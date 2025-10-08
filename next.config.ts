import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["three"],
  devIndicators: false,
  reactStrictMode: false,
};

export default nextConfig;
