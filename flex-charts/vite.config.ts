import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/FlexCharts/" : "/",
  resolve: {
    alias: {
      // This allows importing from 'lib' in the playground
      "./lib": resolve(__dirname, "./src/lib"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    reportCompressedSize: true,
  },
});
