import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.CR45SLgm.js","_app/immutable/chunks/scheduler.X72G1_9w.js","_app/immutable/chunks/index.B8LpvrVp.js"];
export const stylesheets = ["_app/immutable/assets/Breadcrumbs.D57YUqto.css"];
export const fonts = [];
