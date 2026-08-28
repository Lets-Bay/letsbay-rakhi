import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access from the phone IP
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - allowedDevOrigins is added in latest next.js versions and might not be fully typed yet
  allowedDevOrigins: ['192.168.1.6', '0.0.0.0'],
};

export default nextConfig;
