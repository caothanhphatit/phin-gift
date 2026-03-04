import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true, // required for static export (no Next.js image server)
  },
};

export default nextConfig;
