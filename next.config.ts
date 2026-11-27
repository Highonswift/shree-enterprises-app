import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Storyblok Assets only.
    remotePatterns: [{ protocol: "https", hostname: "a.storyblok.com", pathname: "/f/**" }],
  },
};

export default nextConfig;
