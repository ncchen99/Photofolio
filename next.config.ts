import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Photofolio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
