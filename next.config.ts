import type { NextConfig } from "next";

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    }
  }
};

export default nextConfig;
