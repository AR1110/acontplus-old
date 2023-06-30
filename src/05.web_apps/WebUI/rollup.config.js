import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import builtins from 'rollup-plugin-node-builtins';
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
    // This `main.js` file we wrote
    input: 'wwwroot/js/main.js',
    output: {
        sourcemap: true,
        // The destination for our bundled JavaScript
        file: 'wwwroot/js/build/bundle.js',
        // Our bundle will be an Immediately-Invoked Function Expression
        format: 'iife',
        //format: 'cjs',
        // The IIFE return value will be assigned into a variable called `app`
        name: 'app',
    },
    plugins: [
        svelte({
            dev: !production,
            // Tell the svelte plugin where our svelte files are located
            include: 'wwwroot/**/*.svelte',
            emitCss: false,
            compilerOptions: {
                customElement: true,
            }
        }),
        builtins(),
        json(),
        commonjs({
            include: /node_modules/,
            requireReturnsDefault: 'auto',
        }),
        replace({
            preventAssignment: true,
        }),

        // Tell any third-party plugins that we're building for the browser
        resolve({
            browser: true,
            //dedupe: ['svelte']
        }),
        //production && terser(),
    ]
};