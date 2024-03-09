import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		https: {
			key: './src/assets/ssl/server.key',
			cert: './src/assets/ssl/server.crt'
		}
	},
	plugins: [sveltekit()]
});
