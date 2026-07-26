import type { NextConfig } from "next";

// CloudBase builds this project and deploys the generated out/ directory.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
