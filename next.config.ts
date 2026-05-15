import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages compatibility
};

if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}

export default nextConfig;
