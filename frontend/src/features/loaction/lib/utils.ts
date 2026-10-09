import { useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Location } from "./geocoding";

export function ClickHandler({
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

export function RecenterOnSelect({ selected }: { selected: Location | null }) {
  const map = useMap();
  useEffect(() => {
    if (selected?.lat !== undefined && selected.lon !== undefined) {
      map.setView([selected.lat, selected.lon], map.getZoom());
    }
  }, [selected, map]);
  return null;
}
