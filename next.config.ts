import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without it, Turbopack walks up and
  // finds a stray lockfile in the user's home dir and warns about ambiguity.
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
