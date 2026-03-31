/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import { env } from "./src/config";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [env.HOST_URL],
    host: true,
    strictPort: true,
    port: env.PORT,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: env.API_URL,
        changeOrigin: true,
        secure: false,
        rewrite(path) {
          return path.replace(/^\/api/, "");
        },
      },
    },
  },
  build: {
    outDir: "../api/public",
    emptyOutDir: true,
  },
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      $: "/src",
    },
  },
});
