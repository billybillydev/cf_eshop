import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Entry point for the TypeScript source file
  format: ["cjs", "esm"], // Build both CommonJS and ESM formats
  dts: true, // Generate TypeScript declaration files
  sourcemap: false, // Optionally generate source maps
  clean: true, // Clean the output directory before building
  outDir: "dist", // Output directory for the built files
});
