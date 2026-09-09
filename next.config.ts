import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: false },
      { source: "/home.html", destination: "/", permanent: false },
      { source: "/index.html", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
