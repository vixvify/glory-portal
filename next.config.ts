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
      {
        protocol: "https",
        hostname: "**.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "www.wallpaperflare.com",
      },
      {
        protocol: "https",
        hostname: "4kwallpapers.com",
      },
    ],
  },
};

export default nextConfig;
