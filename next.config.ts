import type { NextConfig } from "next";

const isStaticExport =
  process.env.CF_PAGES === "1" ||
  process.env.CF_PAGES === "true" ||
  process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport ? true : undefined,
  rewrites: isStaticExport
    ? undefined
    : async () => [
        { source: "/remove-background", destination: "/" },
        { source: "/image-background-remover", destination: "/" },
        { source: "/product-background-remover", destination: "/" },
        { source: "/transparent-background-maker", destination: "/" },
        { source: "/white-background-maker", destination: "/" },
      ],
};

export default nextConfig;
