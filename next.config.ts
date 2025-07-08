import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  // output: "export",
  distDir: "_next",
  async redirects() {
    return [
      {
        source: "/components",
        destination: "/",
        permanent: false,
      },
      {
        source: "/api",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
