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
      const directories = [
        "dist/assets/js",
        "dist/assets/css",
        "dist/assets/webfonts",
        "dist/images",
      ];

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
        "contact.js",
      ];

      jsFiles.forEach((file) => {
        const src = path.resolve(__dirname, `assets/js/${file}`);
        const dest = path.resolve(__dirname, `dist/assets/js/${file}`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
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
        } else {
          console.warn(`Warning: ${file} not found in assets/css/`);
        }
      });

      // Copy webfonts folder
      const webfontsDir = path.resolve(__dirname, "assets/webfonts");
      const destWebfontsDir = path.resolve(__dirname, "dist/assets/webfonts");

      if (fs.existsSync(webfontsDir)) {
        if (!fs.existsSync(destWebfontsDir)) {
          fs.mkdirSync(destWebfontsDir, { recursive: true });
        }

        const webfontFiles = fs.readdirSync(webfontsDir);
        webfontFiles.forEach((file) => {
          const src = path.resolve(webfontsDir, file);
          const dest = path.resolve(destWebfontsDir, file);
          if (fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dest);
          }
        });
      }

      // Copy images
      const imgDir = path.resolve(__dirname, "images");
      const destImgDir = path.resolve(__dirname, "dist/images");

      if (fs.existsSync(imgDir)) {
        if (!fs.existsSync(destImgDir)) {
          fs.mkdirSync(destImgDir, { recursive: true });
        }
        const imgFiles = fs.readdirSync(imgDir);
        imgFiles.forEach((file) => {
          const src = path.resolve(imgDir, file);
          const dest = path.resolve(destImgDir, file);
          if (fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dest);
          }
        });
      }

      // Manually fix the HTML file with a complete rewrite
      const htmlPath = path.resolve(__dirname, "dist/index.html");
      if (fs.existsSync(htmlPath)) {
        // Get the original unprocessed HTML as a template
        const originalHtmlPath = path.resolve(__dirname, "index.html");
        let originalHtml = fs.readFileSync(originalHtmlPath, "utf-8");

        // Update paths to use absolute paths
        originalHtml = originalHtml
          .replace(/src="assets\//g, 'src="/assets/')
          .replace(/href="assets\//g, 'href="/assets/')
          .replace(/src="images\//g, 'src="/images/')
          .replace(/href="images\//g, 'href="/images/');

        // Remove any references to hashed main.js file
        originalHtml = originalHtml.replace(
          /<script type="module" crossorigin src="\/assets\/js\/main-[A-Za-z0-9]+\.js"><\/script>/g,
          ""
        );

        fs.writeFileSync(htmlPath, originalHtml);
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
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        // Ensure proper CSS output
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          let extType = info[info.length - 1];

          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/webfonts/[name][extname]`;
          }

          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/[name][extname]`;
          }

          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return `images/[name][extname]`;
          }

          return `assets/[name][extname]`;
        },
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
      },
    },
    // Ensure IMask is properly processed
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  // Environment variables
  envPrefix: "VITE_",
  // Custom plugins
  plugins: [
    {
      name: "preserve-scripts",
      transformIndexHtml(html) {
        return html;
      },
    },
    {
      name: "disable-preload-fonts",
      transformIndexHtml(html) {
        // Remove any preload links for font files that Vite might add
        return html.replace(
          /<link rel="preload".*?(woff2|woff|ttf|eot|otf).*?>/g,
          ""
        );
      },
    },
    copyAssets(),
  ],
});
