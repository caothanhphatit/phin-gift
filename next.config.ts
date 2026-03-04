import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  distDir: "dist",
  images: {
    unoptimized: true, // required for static export (no Next.js image server)
  },
};

export default withNextIntl(nextConfig);
