// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  // Base public path when served in production
  base: "./",
  // Configure the server
  server: {
    port: 3000,
    open: true, // Automatically open the browser
    cors: true,
  },
  // Build configuration
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  // Environment variables
  envPrefix: "VITE_",
});
