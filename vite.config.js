// vite.config.js
export default {
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
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["emailjs-com"],
        },
      },
    },
  },
  // Environment variables
  envPrefix: "VITE_",
};
