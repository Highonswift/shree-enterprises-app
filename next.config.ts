import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Storyblok Assets only.
    remotePatterns: [{ protocol: "https", hostname: "a.storyblok.com", pathname: "/f/**" }],
  },
  async headers() {
    // Only the Storyblok Visual Editor may show the site in a frame. The preview bridge does not
    // check who sends it content, so this is what stops other websites from feeding the preview.
    return [{
      source: "/:path*",
      headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'self' https://app.storyblok.com" }],
    }];
  },
};

export default nextConfig;
