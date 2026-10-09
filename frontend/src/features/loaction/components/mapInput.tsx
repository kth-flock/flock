"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { FieldWrapper } from "../../../shared/components/formInputs";
import { useFocusWithin } from "../../../shared/hooks/useFocusWithin";
import type { Location } from "../lib/geocoding";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "../lib/geocoding";
import { geocodeFetch } from "../lib/api";
import { MarkerIcon } from "./mapMarker";
import { ClickHandler } from "../lib/utils";
import { RecenterOnSelect } from "../lib/utils";
import debounce from "lodash/debounce";

export type LocationPickerProps = {
  onSelect?: (location: Location | null) => void;
};

export default function LocationPicker({ onSelect }: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const searchRequestRef = useRef(0);
  const skipNextSearchRef = useRef(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLInputElement>();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string, requestId: number) => {
        setLoading(true);
        try {
          const data = await geocodeFetch<Location[]>("search", {
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
      }, 400),
    [],
  );

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

  function commitLocation(location: Location) {
    setSelected(location);
    skipNextSearchRef.current = location.label !== query;
    setQuery(location.label);
    onSelect?.(location);
  }

  function chooseResult(result: Location) {
    commitLocation(result);
    setResults([]);
    setIsMapOpen(false);
  }

  async function handleMapClick(lat: number, lon: number) {
    setSelected({ lat, lon, label: `${lat.toFixed(5)}, ${lon.toFixed(5)}` });
    setIsMapOpen(false);
    setLoading(true);

    let label = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    try {
      const result = await geocodeFetch<Location>("reverse", {
        lat: String(lat),
        lon: String(lon),
      });

      label = result.label;
    } catch (err) {
      console.error("Geocoding reverse lookup failed:", err);
    } finally {
      const location = { lat, lon, label };
      commitLocation(location);
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
              {results.map((r, i) => (
                <li
                  key={i}
                  className="border-b border-primary/10 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => chooseResult(r)}
                    className="flock-body-sm block w-full px-4 py-3 text-left text-primary hover:bg-secondary/20 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    {r.label}
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
              selected?.lat !== undefined && selected.lon !== undefined
                ? [selected.lat, selected.lon]
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
            {selected?.lat !== undefined && selected.lon !== undefined && (
              <Marker
                position={[selected.lat, selected.lon]}
                icon={MarkerIcon}
              />
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
