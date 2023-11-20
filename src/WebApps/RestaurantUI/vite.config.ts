import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: './public/ssl/server.key',
      cert:'./public/ssl/server.crt'
    }
  },
  resolve: {
    alias: {
      "@": "/src", 
      //"@admin": "/src/modules/admin",
    },
  },
  plugins: [react(), VitePWA({ 
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    manifest: {
      
      name: 'My Awesome App',
      short_name: 'MyApp',
      description: 'My Awesome App description',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'assets/icon/windows11/Square44x44Logo.scale-100.png',
          sizes: '44x44',
          type: 'image/png', 
        }, 
      ]
    }
  })],
  build: {
    outDir: "../../Services/Restaurant/Restaurant.API/wwwroot", // this line place index.html in the public folder
    assetsDir: "./dist", // this line place your assets in the public/dist folder
    chunkSizeWarningLimit: 1600
  },
});
