import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import dts from 'vite-plugin-dts';
import { resolve } from 'path'
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

export default defineConfig({
    plugins: [
        svelte({ preprocess: preprocess({ postcss: false }), emitCss: false }),
        dts({
            root: './',
            entryRoot: './App/',
            tsConfigFilePath: './tsconfig.json',
            include: ['**/*'],
            skipDiagnostics: false,
          }),
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
    worker: {
        format: "esm",
    },
    resolve:{
        alias:{
            "$interfaces": resolve(__dirname, "../WebUI/App/lib/interfaces"),
            "$services": resolve(__dirname, "../WebUI/App/lib/services"),
            "$utils": resolve(__dirname, "../WebUI/App/lib/utils"),
            "$lib": resolve(__dirname, "../WebUI/App/lib"),
            "$routes": resolve(__dirname, "../WebUI/App/routes"),
            "$restaurant": resolve(__dirname, "../WebUI/App/routes/Restaurant"),
            "$mechanical": resolve(__dirname, "../WebUI/App/routes/Mechanical"),
            "$pet": resolve(__dirname, "../WebUI/App/routes") + "/Pet",
            "$petbreed": resolve(__dirname, "../WebUI/App/routes") + "/PetBreed",
            "$petmedicalhistory": resolve(__dirname, "../WebUI/App/routes") + "/PetMedicalHistory",
            "$technical-support": resolve(__dirname, "../WebUI/App/routes") + "/TechnicalSupport",
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'App/main.js'),
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
            },
        },
        outDir: 'wwwroot/build',
    },
});