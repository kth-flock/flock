// Placeholder until profiles get a real banner (image or chosen colour)

const bannerColors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-info",
  "bg-warn",
  "bg-error",
];

export const randomBannerColor = () =>
  bannerColors[Math.floor(Math.random() * bannerColors.length)];
