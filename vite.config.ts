import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    proxy: {
      "/v1": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/ws-chat": {
        target: "ws://localhost:8080",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
