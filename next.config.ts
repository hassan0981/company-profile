import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  transpilePackages: ["gsap"],
  // touched to reload gsap dependency after npm install
};

export default nextConfig;
