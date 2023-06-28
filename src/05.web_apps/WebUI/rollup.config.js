import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve'

import livereload from 'rollup-plugin-livereload'

export default {
    // This `main.js` file we wrote
    input: 'wwwroot/js/main.js',
    output: {
        // The destination for our bundled JavaScript
        file: 'wwwroot/js/build/bundle.js',
        // Our bundle will be an Immediately-Invoked Function Expression
        format: 'iife',
        // The IIFE return value will be assigned into a variable called `app`
        name: 'app',
    },
    plugins: [
        // serve(),
        // livereload(),
        svelte({
            // Tell the svelte plugin where our svelte files are located
            include: 'wwwroot/**/*.svelte',
            emitCss: false,
            compilerOptions: {
                customElement: true
            }
        }),
        svelte({
            include: 'wwwroot/dist/*.css',
            emitCss: true, // without this, <style> in components are not included in bundle
            css: css => {
                css.write('wwwroot/css/build/bundle.css')
            }
        }),
        // Tell any third-party plugins that we're building for the browser
        resolve({ browser: true }),
    ]
};