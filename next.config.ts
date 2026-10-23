import type { NextConfig } from "next";
const basePath =
  process.env.NODE_ENV === "production" ? "/Catalogo_espacial" : "";
const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default config;
