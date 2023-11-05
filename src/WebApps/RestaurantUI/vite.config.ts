import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: './/public/ssl/server.key',
      cert:'./public/ssl/server.crt'
    }
  },
  resolve: {
    alias: {
      "@": "/src", 
      //"@admin": "/src/modules/admin",
    },
  },
  plugins: [react()],
  build: {
    outDir: "../../Services/Restaurant/Restaurant.API/wwwroot", // this line place index.html in the public folder
    assetsDir: "./dist", // this line place your assets in the public/dist folder
    chunkSizeWarningLimit: 1600
  },
});
