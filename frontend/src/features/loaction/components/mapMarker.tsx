import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { FaLocationDot } from "react-icons/fa6";

export const MarkerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <FaLocationDot size={34} className="fill-primary" aria-hidden />,
  ),
  className: "custom-marker",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});
