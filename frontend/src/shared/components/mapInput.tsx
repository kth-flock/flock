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

const markerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <FaLocationDot size={34} className="fill-primary" />,
  ),
  className: "custom-marker",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

type Location = {
  lat: number;
  lng: number;
  label: string;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    pedestrian?: string;
    house_number?: string;
    postcode?: string;
    municipality?: string;
    city?: string;
    town?: string;
    village?: string;
  };
};

// Default view: Stockholm, Sweden
const DEFAULT_CENTER: [number, number] = [59.3293, 18.0686];
const DEFAULT_ZOOM = 12;

function formatLocationName(result: NominatimResult) {
  const address = result.address;
  const street = address?.road ?? address?.pedestrian;
  const streetAndNumber = [street, address?.house_number]
    .filter(Boolean)
    .join(" ");
  const municipality =
    address?.municipality ?? address?.city ?? address?.town ?? address?.village;
  const formattedName = [streetAndNumber, address?.postcode, municipality]
    .filter(Boolean)
    .join(", ");
  const shortName = formattedName || result.display_name;

  return shortName.length > 56
    ? `${shortName.slice(0, 53).trimEnd()}...`
    : shortName;
}

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
    if (selected) {
      map.setView([selected.lat, selected.lng], map.getZoom());
    }
  }, [selected, map]);
  return null;
}

export default function LocationPicker({
  onSelect,
}: {
  onSelect?: (location: Location) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSearchRef = useRef(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { ref, isFocused, focusWithinProps } =
    useFocusWithin<HTMLInputElement>();

  useEffect(() => {
    if (!isMapOpen) return;

    function handleOutsidePointer(event: PointerEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsMapOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [isMapOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "5",
          countrycodes: "se",
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/search?${params.toString()}`,
          {
            referrer: window.location.origin,
            referrerPolicy: "origin",
            headers: {
              "Accept-Language": "en",
            },
          },
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Nominatim search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function chooseResult(result: NominatimResult) {
    const location: Location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      label: result.display_name,
    };
    setSelected(location);
    setResults([]);
    skipNextSearchRef.current = true;
    setQuery(formatLocationName(result));
    setIsMapOpen(false);
    onSelect?.(location);
  }

  async function handleMapClick(lat: number, lng: number) {
    setSelected({ lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    setIsMapOpen(false);
    setLoading(true);

    let label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    try {
      const params = new URLSearchParams({
        format: "json",
        lat: String(lat),
        lon: String(lng),
        addressdetails: "1",
      });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/reverse?${params.toString()}`,
        {
          referrer: window.location.origin,
          referrerPolicy: "origin",
          headers: { "Accept-Language": "en" },
        },
      );
      if (!response.ok) throw new Error("Reverse geocoding failed");

      const result: NominatimResult = await response.json();
      label = formatLocationName(result);
    } catch (err) {
      console.error("Nominatim reverse geocoding failed:", err);
    } finally {
      const location = { lat, lng, label };
      setSelected(location);
      skipNextSearchRef.current = true;
      setQuery(label);
      onSelect?.(location);
      setLoading(false);
    }
  }

  return (
    <div ref={pickerRef} className="relative z-20 w-full">
      <FieldWrapper
        icon={<FaLocationDot />}
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
            onChange={(e) => setQuery(e.target.value)}
            onFocus={focusWithinProps.onFocus}
            onBlur={focusWithinProps.onBlur}
            placeholder="Search for an address or place..."
            className="body w-full border-0 bg-transparent p-0 pr-16 outline-none placeholder:text-neutral"
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
            <FaMapLocationDot aria-hidden="true" className="fill-primary" />
          </button>
          {loading && (
            <span className="caption absolute right-16 top-1/2 -translate-y-1/2 text-primary">
              Searching...
            </span>
          )}

          {results.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-5 z-1000 max-h-52 overflow-y-auto rounded-xl border border-primary/20 bg-white p-0 shadow-md">
              {results.map((r) => (
                <li
                  key={r.place_id}
                  onClick={() => chooseResult(r)}
                  className="body-sm cursor-pointer border-b border-primary/10 px-4 py-3 text-primary last:border-b-0 hover:bg-secondary/20"
                >
                  {formatLocationName(r)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </FieldWrapper>

      {isMapOpen && (
        <div className="absolute left-0 right-0 top-full z-1000 mt-2 overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-xl">
          <MapContainer
            center={selected ? [selected.lat, selected.lng] : DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: 350, width: "100%" }}
          >
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onClick={handleMapClick} />
            <RecenterOnSelect selected={selected} />
            {selected && (
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
