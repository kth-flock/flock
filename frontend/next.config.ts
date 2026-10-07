import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@flock/shared"],
  images: {
    // Hosts next/image may load from. Add the real image host once uploads exist. Unsplash is temp for testing.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
    ],
  },
};

export default nextConfig;
