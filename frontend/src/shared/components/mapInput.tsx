"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { FieldWrapper } from "./formInputs";
import { useFocusWithin } from "../hooks/useFocusWithin";
import { renderToStaticMarkup } from "react-dom/server";
import { debounce } from "../lib/debounce";
import type { Location, NominatimResult } from "../lib/nominatim";
import {
  formatLocationName,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
} from "../lib/nominatim";
import { geocodeFetch } from "../lib/apiFetch";

// ---------- CONSTANTS ----------

const markerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <FaLocationDot size={34} className="fill-primary" aria-hidden />,
  ),
  className: "custom-marker",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

// ---------- HELPER FUNCTIONS ----------

function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterOnSelect({ selected }: { selected: Location | null }) {
  const map = useMap();
  useEffect(() => {
    if (selected?.lat !== undefined && selected.lng !== undefined) {
      map.setView([selected.lat, selected.lng], map.getZoom());
    }
  }, [selected, map]);
  return null;
}

// ---------- COMPONENT ----------

export default function LocationPicker({
  initialValue,
  onSelect,
}: {
  initialValue?: Location | null;
  onSelect?: (location: Location | null) => void;
}) {
  const [query, setQuery] = useState(initialValue?.label ?? "");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [selected, setSelected] = useState<Location | null>(
    initialValue ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const searchRequestRef = useRef(0);
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string, requestId: number) => {
      setLoading(true);
      try {
        const data = await geocodeFetch<NominatimResult[]>("search", {
          q: searchQuery,
        });
        if (requestId === searchRequestRef.current) setResults(data);
      } catch (err) {
        if (requestId === searchRequestRef.current) {
          console.error("Geocoding search failed:", err);
        }
      } finally {
        if (requestId === searchRequestRef.current) setLoading(false);
      }
    }, 1000),
  ).current;
  const skipNextSearchRef = useRef(Boolean(initialValue?.label));
  const pickerRef = useRef<HTMLDivElement>(null);
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLInputElement>();

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsMapOpen(false);
        setResults([]);
        debouncedSearch.cancel();
        searchRequestRef.current += 1;
        setLoading(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  useEffect(() => {
    const requestId = ++searchRequestRef.current;
    debouncedSearch.cancel();

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      setLoading(false);
      return;
    }

    if (query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    debouncedSearch(query, requestId);

    return () => {
      debouncedSearch.cancel();
      searchRequestRef.current += 1;
    };
  }, [query, debouncedSearch]);

  function commitLocation(location: Location, displayText: string) {
    setSelected(location);
    skipNextSearchRef.current = displayText !== query;
    setQuery(displayText);
    onSelect?.(location);
  }

  function chooseResult(result: NominatimResult) {
    const location: Location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      label: result.display_name,
    };
    commitLocation(location, formatLocationName(result));
    setResults([]);
    setIsMapOpen(false);
  }

  async function handleMapClick(lat: number, lng: number) {
    setSelected({ lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    setIsMapOpen(false);
    setLoading(true);

    let label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    try {
      const result = await geocodeFetch<NominatimResult>("reverse", {
        lat: String(lat),
        lon: String(lng),
      });

      label = formatLocationName(result);
    } catch (err) {
      console.error("Geocoding reverse lookup failed:", err);
    } finally {
      const location = { lat, lng, label };
      commitLocation(location, label);
      setLoading(false);
    }
  }

  return (
    <div ref={pickerRef} className="relative z-20 w-full">
      <FieldWrapper
        icon={<FaLocationDot aria-hidden />}
        label="Location"
        htmlFor="location-search"
        isFocused={isFocused}
        onClick={() => ref.current?.focus()}
      >
        <div className="relative">
          <input
            id="location-search"
            ref={ref}
            type="text"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              setSelected(null);
              onSelect?.(value.trim() ? { label: value } : null);
            }}
            onFocus={focusWithinProps.onFocus}
            onBlur={focusWithinProps.onBlur}
            placeholder="Search for an address or place..."
            autoComplete="off"
            className="flock-body w-full border-0 bg-transparent p-0 pr-16 outline-none placeholder:text-neutral"
          />
          <button
            type="button"
            aria-label={isMapOpen ? "Close map" : "Open map"}
            onClick={(event) => {
              event.stopPropagation();
              setIsMapOpen((open) => !open);
            }}
            className="absolute flex items-center bg-accent/50 p-2 rounded-lg right-0 -top-1/2 cursor-pointer hover:shadow-md hover:scale-110"
          >
            <FaMapLocationDot aria-hidden className="fill-primary" />
          </button>
          {loading && (
            <span className="flock-caption absolute right-16 top-1/2 -translate-y-1/2 text-primary">
              Searching...
            </span>
          )}

          {results.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-5 z-50 max-h-52 overflow-y-auto rounded-xl border border-primary/20 bg-white p-0 shadow-md">
              {results.map((r) => (
                <li
                  key={r.place_id}
                  className="border-b border-primary/10 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => chooseResult(r)}
                    className="flock-body-sm block w-full px-4 py-3 text-left text-primary hover:bg-secondary/20 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    {formatLocationName(r)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FieldWrapper>

      {isMapOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-xl">
          <MapContainer
            center={
              selected?.lat !== undefined && selected.lng !== undefined
                ? [selected.lat, selected.lng]
                : DEFAULT_CENTER
            }
            zoom={DEFAULT_ZOOM}
            style={{ height: 350, width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onClick={handleMapClick} />
            <RecenterOnSelect selected={selected} />
            {selected?.lat !== undefined && selected.lng !== undefined && (
              <Marker
                position={[selected.lat, selected.lng]}
                icon={markerIcon}
              />
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
