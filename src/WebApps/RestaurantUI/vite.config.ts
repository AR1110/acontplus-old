import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      // { find: '@assets', replacement: '/src/assets' },
      // { find: '@common', replacement: '/src/common' },
      "@admin": "/src/modules/admin",
    },
  },
  plugins: [react()],
  build: {
    outDir: "../src/Restaurant.API/wwwroot", // this line place index.html in the public folder
    assetsDir: "./dist", // this line place your assets in the public/dist folder
  },
});
