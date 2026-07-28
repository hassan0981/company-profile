import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  transpilePackages: ["gsap"],
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: "/web-development",
        destination: "/services/web-development",
        permanent: true,
      },
      {
        source: "/seo-services",
        destination: "/services/seo",
        permanent: true,
      },
      {
        source: "/social-media-management",
        destination: "/services/social-media",
        permanent: true,
      },
      {
        source: "/meta-ads",
        destination: "/services/meta-ads",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
      },
      {
        source: "/sitemap-0.xml",
        destination: "/sitemap.xml",
      },
    ];
  },
};

export default nextConfig;
