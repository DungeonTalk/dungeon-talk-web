import { reactRouter } from "@react-router/dev/vite";
// import { cloudflare } from "@cloudflare/vite-plugin"; // (삭제) Miniflare 오류 해결을 위해 주석 처리
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // cloudflare({ viteEnvironment: { name: "ssr" } }), // (삭제) Miniflare 오류 해결을 위해 주석 처리
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  define: { 
    global: "window",
  },
  server: {
    proxy: {
      "/v1": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
