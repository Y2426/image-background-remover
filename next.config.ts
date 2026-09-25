import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async rewrites() {
    return [
      { source: "/remove-background", destination: "/" },
      { source: "/image-background-remover", destination: "/" },
      { source: "/product-background-remover", destination: "/" },
      { source: "/transparent-background-maker", destination: "/" },
      { source: "/white-background-maker", destination: "/" },
    ];
  },
};

export default nextConfig;
