import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from 'path'
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

export default defineConfig({
    plugins: [
        svelte({ preprocess: preprocess({ postcss: false }), emitCss: false }),
        preact(),
        basicSsl(),
    ],
    // server: {
    //     port: 3001,
    //     https: true,
    // },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis",
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
    },
    // worker: {
    //     format: "es",
    // },
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
            "$contab": resolve(__dirname, "../WebUI/App/routes/Contabilidad"),
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
            plugins: [
                // Enable rollup polyfills plugin
                // used during production bundling
                rollupNodePolyFill(),
            ],
            output: {
                format: "esm",
                entryFileNames: 'bundle.js',
                assetFileNames: '[name].[ext]',
            },
        },
        outDir: 'wwwroot/build',
    },
});