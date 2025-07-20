import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    TERMII_BASE_URL: process.env.TERMII_BASE_URL,
    TERMII_API_KEY: process.env.TERMII_API_KEY,
  },
  // output: "export",
  // distDir: "_next",
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
