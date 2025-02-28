/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// @ts-check

import { fileURLToPath } from "url";
import path from "path";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import env.js (will be executed for side effects)
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  // Enable React 19 features
  experimental: {
    optimizePackageImports: ["@trpc/server", "@trpc/client"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  }
};

export default config;
