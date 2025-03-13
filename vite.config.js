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
      // Create directory structure
      const directories = ["dist/assets/js", "dist/assets/css", "dist/images"];

      directories.forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

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

      // Copy CSS files directly to maintain original structure
      const cssFiles = ["main.css", "noscript.css", "fontawesome-all.min.css"];

      cssFiles.forEach((file) => {
        const src = path.resolve(__dirname, `assets/css/${file}`);
        const dest = path.resolve(__dirname, `dist/assets/css/${file}`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log(`Copied ${file} to dist/assets/css/`);
        } else {
          console.warn(`Warning: ${file} not found in assets/css/`);
        }
      });

      // Copy images
      const imgDir = path.resolve(__dirname, "images");
      const destImgDir = path.resolve(__dirname, "dist/images");

      if (fs.existsSync(imgDir)) {
        const imgFiles = fs.readdirSync(imgDir);
        imgFiles.forEach((file) => {
          const src = path.resolve(imgDir, file);
          const dest = path.resolve(destImgDir, file);
          if (fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${file} to dist/images/`);
          }
        });
      }
    },
  };
}

export default defineConfig({
  // Base public path when served in production
  base: "/",
  // Configure the server
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  // Build configuration
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // Prevent asset inlining
    assetsInlineLimit: 0,
    rollupOptions: {
      external: [
        "/assets/js/jquery.min.js",
        "/assets/js/browser.min.js",
        "/assets/js/breakpoints.min.js",
        "/assets/js/util.js",
        "/assets/js/main.js",
      ],
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        // Ensure proper CSS output
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/[name][extname]";
          }
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
        // Make sure the script tags already have data-vite-ignore
        return html;
      },
    },
    copyAssets(),
  ],
});
