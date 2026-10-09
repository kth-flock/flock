export type Location = {
  lat?: number;
  lon?: number;
  label: string;
};

// Default view: Stockholm, Sweden
export const DEFAULT_CENTER: [number, number] = [59.3293, 18.0686];
export const DEFAULT_ZOOM = 12;
