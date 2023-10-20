// import svelte from "rollup-plugin-svelte";
// import commonjs from "@rollup/plugin-commonjs";
// import resolve from "@rollup/plugin-node-resolve";
// import terser from "@rollup/plugin-terser";
// import sveltePreprocess from "svelte-preprocess";
// import typescript from "@rollup/plugin-typescript";
// import replace from '@rollup/plugin-replace';
// import path from "path";
// import alias from "@rollup/plugin-alias";
// // import nodeResolve from '@rollup/plugin-node-resolve';

// const production = !process.env.ROLLUP_WATCH;
// const appObject = "bundle"

// export default {
//     // This `main.js` file we wrote
//     input: 'App/main.js',
//     output: {
//         sourcemap: !production,
//         // The destination for our bundled JavaScript
//         file: `wwwroot/build/${appObject}.js`,
//         // Our bundle will be an Immediately-Invoked Function Expression
//         format: 'iife',
//         // The IIFE return value will be assigned into a variable called `app`
//         name: `${appObject}`,
//     },
//     cache: true,
//     plugins: [
//         alias({
//             entries: [
//                 { find: "$interfaces", replacement: path.resolve(__dirname, "../WebUI/App/lib/interfaces") },
//                 { find: "$services", replacement: path.resolve(__dirname, "../WebUI/App/lib/services") },
//                 { find: "$utils", replacement: path.resolve(__dirname, "../WebUI/App/lib/utils") },
//                 { find: "$lib", replacement: path.resolve(__dirname, "../WebUI/App/lib") },
//                 { find: "$routes", replacement: path.resolve(__dirname, "../WebUI/App/routes") },
//                 { find: "$restaurant", replacement: path.resolve(__dirname, "../WebUI/App/routes/Restaurant") },
//                 { find: "$mechanical", replacement: path.resolve(__dirname, "../WebUI/App/routes/Mechanical") },
//                 { find: "$pet", replacement: path.resolve(__dirname, "../WebUI/App/routes") + "/Pet" },
//                 { find: "$petbreed", replacement: path.resolve(__dirname, "../WebUI/App/routes") + "/PetBreed" },
//                 { find: "$petmedicalhistory", replacement: path.resolve(__dirname, "../WebUI/App/routes") + "/PetMedicalHistory" },
//                 { find: "$technical-support", replacement: path.resolve(__dirname, "../WebUI/App/routes") + "/TechnicalSupport" },
//             ]
//         }),
//         replace({
//             preventAssignment: true,
//             "process.env.NODE_ENV": JSON.stringify("development")
//         }),
//         svelte({
//             preprocess: sveltePreprocess({ sourceMap: !production }),
//             emitCss: false,
//             compilerOptions: {
//                 // enable run-time checks when not in production
//                 //dev: !production,
//                 customElement: false,
//             }
//         }),
//         //css({ output: `${appObject}.css` }),
//         // Tell any third-party plugins that we're building for the browser
//         resolve({
//             browser: true,
//             dedupe: ['svelte', 'svelte/transition', 'svelte/internal'], // important!
//         }),
//         //nodeResolve(), // must come before the typescript plugin!
//         typescript({
//             sourceMap: !production,
//             inlineSources: !production,
//             types: ["svelte"],
//             resolveJsonModule: true
//         }),
//         commonjs({
//             include: /node_modules/,
//             sourceMap: !production
//         }),
//         production && terser(),
//     ],
//     watch: {
//         clearScreen: false
//     }
// };