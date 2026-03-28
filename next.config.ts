import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/cpsc349-hw3", 
  images: { unoptimized: true },
};

module.exports = {
  allowedDevOrigins: ['192.168.1.78'],
}

export default nextConfig;
