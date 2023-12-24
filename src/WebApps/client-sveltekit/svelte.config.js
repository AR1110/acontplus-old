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
            $contabilidad: "src/modules/contabilidad",
            $interfaces: "src/lib/interfaces",
            $inventario: "src/modules/inventario",
            $modules: "src/modules",
            $mechanical: "src/modules/mechanical",
            $restaurant: "src/modules/restaurant",
            $sales: "src/modules/sales",
            $services: "src/lib/services",
            $technicalsupport: "src/modules/technical-support",
            $utils: "src/lib/utils",
            $vet: "src/modules/vet",
        }
    }
};

export default config;