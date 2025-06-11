import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    experimental: {
        // Enable if needed for advanced features
    },
};

export default nextConfig;
