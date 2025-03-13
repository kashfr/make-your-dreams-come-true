// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";

// Simple copy plugin
function copyAssets() {
  return {
    name: "copy-assets",
    closeBundle() {
      // Ensure assets/js directory exists
      const jsDir = path.resolve(__dirname, "dist/assets/js");
      if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir, { recursive: true });
      }

      // Copy JS files
      const jsFiles = [
        "jquery.min.js",
        "browser.min.js",
        "breakpoints.min.js",
        "util.js",
        "main.js",
      ];

      jsFiles.forEach((file) => {
        const src = path.resolve(__dirname, `assets/js/${file}`);
        const dest = path.resolve(__dirname, `dist/assets/js/${file}`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log(`Copied ${file} to dist/assets/js/`);
        } else {
          console.warn(`Warning: ${file} not found in assets/js/`);
        }
      });
    },
  };
}

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
    // Preserve the original file structure
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        // Preserve the directory structure
        assetFileNames: (assetInfo) => {
          // Keep original paths for assets in the assets directory
          if (assetInfo.name && assetInfo.name.includes("assets/")) {
            return "[name][extname]";
          }
          // For other assets, use the default naming
          return "assets/[name]-[hash][extname]";
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
  // Environment variables
  envPrefix: "VITE_",
  // Custom plugins
  plugins: [
    {
      name: "preserve-scripts",
      transformIndexHtml(html) {
        // Add data-vite-ignore to script tags to prevent Vite from processing them
        return html.replace(
          /<script src="assets\/js\/(jquery\.min|browser\.min|breakpoints\.min|util|main)\.js"><\/script>/g,
          '<script src="assets/js/$1.js" data-vite-ignore></script>'
        );
      },
    },
    copyAssets(),
  ],
});
