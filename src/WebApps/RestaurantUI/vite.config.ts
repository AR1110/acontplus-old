import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
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
  },
});
