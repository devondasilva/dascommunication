import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite charge ses fichiers WebAssembly depuis node_modules : il ne doit pas être intégré au bundle
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    // Photos de profil Google des clients
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
