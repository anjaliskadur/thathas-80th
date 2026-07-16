import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder photo-wall cards are SVG (public/photos/*.svg). Once real
    // family photos (jpg/png/webp) are dropped in, this can stay on since it
    // only affects local, trusted assets.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
