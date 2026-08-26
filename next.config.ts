import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
    // Next.js 16 only allows quality values listed here (default: [75]).
    // 90 gets us noticeably sharper posters without the size cost of 100.
    qualities: [75, 90],
  },
};

export default nextConfig;
