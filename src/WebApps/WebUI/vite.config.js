import { defineConfig } from "vite";
import { resolve } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [
        svelte({ emitCss: false }),
    ],
    resolve: {
        alias: {
            "$interfaces": resolve(__dirname, "../WebUI/App/lib/interfaces"),
            "$lib": resolve(__dirname, "../WebUI/App/lib"),
            "$mechanical": resolve(__dirname, "../WebUI/App/routes/Mechanical"),
            "$restaurant": resolve(__dirname, "../WebUI/App/routes/Restaurant"),
            "$routes": resolve(__dirname, "../WebUI/App/routes"),
            "$services": resolve(__dirname, "../WebUI/App/lib/services"),
            "$technical-support": resolve(__dirname, "../WebUI/App/routes") + "/TechnicalSupport",
            "$utils": resolve(__dirname, "../WebUI/App/lib/utils"),
            "$ventas": resolve(__dirname, "../WebUI/App/routes/ventas"),
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'App/main.ts'),
            name: 'bundle',
            formats: ['iife'],
            fileName: 'bundle',
        },
        rollupOptions: {
            output: {
                format: "esm",
                entryFileNames: 'bundle.js',
                assetFileNames: '[name].[ext]',
            },
        },
        outDir: 'wwwroot/build',
    },
});