export type Location = {
  lat: number;
  lng: number;
  label: string;
};

export type NominatimResult = {
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

export function formatLocationName(result: NominatimResult) {
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

// Default view: Stockholm, Sweden
export const DEFAULT_CENTER: [number, number] = [59.3293, 18.0686];
export const DEFAULT_ZOOM = 12;
