import * as universal from '../entries/pages/inventario/stock-fisico/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/inventario/stock-fisico/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/inventario/stock-fisico/+page.ts";
export const imports = ["_app/immutable/nodes/5.DsQe8hCR.js","_app/immutable/chunks/scheduler.X72G1_9w.js","_app/immutable/chunks/index.B8LpvrVp.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/Modal.x2igpm5O.js","_app/immutable/chunks/_commonjsHelpers.BW5BPR-H.js","_app/immutable/chunks/article-service.CTNP4BVB.js","_app/immutable/chunks/AdvancedSearch.Ep6bdFxN.js","_app/immutable/chunks/entry.DTXdeeiq.js","_app/immutable/chunks/Grid.B9RqvdmK.js","_app/immutable/chunks/tabulator_esm.Bh8P6COo.js","_app/immutable/chunks/toast.7TWafbp8.js"];
export const stylesheets = ["_app/immutable/assets/Modal.BsF1iGkX.css","_app/immutable/assets/AdvancedSearch.Dzh1sa4G.css"];
export const fonts = [];
