// import svelte from 'rollup-plugin-svelte';
// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import replace from "@rollup/plugin-replace";
// //import json from "@rollup/plugin-json";
// //import builtins from 'rollup-plugin-node-builtins';

// const production = !process.env.ROLLUP_WATCH;
// const appObject = "petMH"
// export default {
//     // This `main.js` file we wrote
//     input: 'App/main.js',
//     output: {
//         // The destination for our bundled JavaScript
//         file:  `wwwroot/build/${appObject}.js`,
//         // Our bundle will be an Immediately-Invoked Function Expression
//         format: 'iife',
//         //format: 'cjs',
//         // The IIFE return value will be assigned into a variable called `app`
//         name: 'petMH',
//     },
//     plugins: [
//         svelte({
//             // Tell the svelte plugin where our svelte files are located
//             include: 'App/**/*.svelte',
//             emitCss: false,
//             compilerOptions: {
//                 customElement: true,
//             }
//         }),
//         //builtins(),
//         //json(),
//         commonjs({
//             include: /node_modules/,
//             requireReturnsDefault: 'auto',
//         }),
//         replace({
//             preventAssignment: true,
//         }),

//         // Tell any third-party plugins that we're building for the browser
//         resolve({
//             browser: true,
//             dedupe: ['svelte']
//         }),
//         //production && terser(),
//     ]
// };

import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import replace from '@rollup/plugin-replace';
import path from "path";
import alias from "@rollup/plugin-alias";
import nodeResolve from '@rollup/plugin-node-resolve';

const production = !process.env.ROLLUP_WATCH;
// const appObject = "petBreed"
// const appObject = "petMH"
const appObject = "configEmail"

export default {
    // This `main.js` file we wrote
    input: 'App/main.js',
    output: {
        sourcemap: !production,
        // The destination for our bundled JavaScript
        file: `wwwroot/build/${appObject}.js`,
        // Our bundle will be an Immediately-Invoked Function Expression
        format: 'iife',
        //format: 'cjs',
        // The IIFE return value will be assigned into a variable called `app`
        name: `${appObject}`,
    },
    plugins: [
        alias({
            entries: [
                { find: "$lib", replacement:  path.resolve(__dirname, "../App/lib") },
                
                { find: "$pet", replacement:  path.resolve(__dirname, "../App/lib") + "/Pet" },
                { find: "$petbreed", replacement:  path.resolve(__dirname, "../App/lib") + "/PetBreed" },
                { find: "$petmedicalhistory", replacement:  path.resolve(__dirname, "../App/lib") + "/PetMedicalHistory" },
            ]
        }),
        //builtins(),
        //json(),
        // commonjs({
        //     include: /node_modules/,
        //     requireReturnsDefault: 'auto',
        // }),
        replace({
            preventAssignment: true,
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            emitCss: false,
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
                customElement: false,
            }
        }),
        //css({ output: `${appObject}.css` }),
        // Tell any third-party plugins that we're building for the browser
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),

        commonjs({
            include: /node_modules/,
            sourceMap: !production
        }),
        nodeResolve(), // must come before the typescript plugin!
        typescript({
            sourceMap: !production,
            inlineSources: !production,
            types: ["svelte"],
            resolveJsonModule: true
        }),
        production && terser(),
    ],
    watch: {
        clearScreen: false
    }
};