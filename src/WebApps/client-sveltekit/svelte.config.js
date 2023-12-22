import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            fallback: 'index.html',
        }),
        paths: {
            base: isProd ? '/client-sveltekit' : ''
        },
        //prerender: { entries: [] }
        alias: {
            $components: "src/lib/components",
            $constants: "src/lib/constants",
            $interfaces: "src/lib/interfaces",
            $services: "src/lib/services",
            $utils: "src/lib/utils",
            $modules: "src/modules",
            $inventario: "src/modules/inventario",
            $contabilidad: "src/modules/contabilidad"
        }
    }
};

export default config;