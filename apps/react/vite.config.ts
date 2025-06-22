/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { join } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import { env } from "./src/config";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
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
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      $: "/src",
    },
  },
});
