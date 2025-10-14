import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default withContentlayer(nextConfig);
