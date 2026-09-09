import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/home.html", destination: "/home", permanent: false },
      { source: "/six-pages.html", destination: "/six-pages", permanent: false },
      { source: "/index.html", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
