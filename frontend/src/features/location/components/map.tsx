"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { Location } from "@flock/shared/schemas/geocode";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "../lib/geocoding";
import { MarkerIcon } from "./mapMarker";
import { ClickHandler, RecenterOnSelect } from "../lib/utils";

export default function LocationMap({
  selected,
  onMapClick,
}: {
  selected: Location | null;
  onMapClick: (lat: number, lon: number) => void;
}) {
  const hasPoint = selected?.lat !== undefined && selected.lon !== undefined;

  return (
    <MapContainer
      center={hasPoint ? [selected.lat!, selected.lon!] : DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: 350, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onClick={onMapClick} />
      <RecenterOnSelect selected={selected} />
      {hasPoint && (
        <Marker position={[selected.lat!, selected.lon!]} icon={MarkerIcon} />
      )}
    </MapContainer>
  );
}
