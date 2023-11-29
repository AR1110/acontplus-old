import { defineConfig } from "vite";
import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as path from 'path';

export default defineConfig({
    plugins: [
        svelte({ emitCss: false }),
    ],
    resolve: {
        alias: [
            { find: "@", replacement: path.resolve(__dirname, "src") }
        ],
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/main.ts'),
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