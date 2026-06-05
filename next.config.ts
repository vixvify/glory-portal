import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "djqfgswshbirueryhanh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pub-0a16fa033f7f4d5ab3e1f6592f9d390d.r2.dev",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
  },
};

export default nextConfig;
