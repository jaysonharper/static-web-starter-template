import { defineConfig } from "vite";

export default defineConfig({
  // Base public path when served in development or production
  base:
    process.env.NODE_ENV === "production"
      ? "/static-web-starter-template/"
      : "/",

  // Build options
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Generate manifest for better caching
    manifest: false,
    // Optimize for modern browsers
    target: "esnext",
    // Minify for production (esbuild is faster and built-in)
    minify: "esbuild",
    // Generate source maps for debugging
    sourcemap: false,
  },

  // Development server options
  server: {
    port: 5173,
    host: true,
    open: true,
  },

  // Preview server options (for testing build)
  preview: {
    port: 5173,
    host: true,
  },
});
