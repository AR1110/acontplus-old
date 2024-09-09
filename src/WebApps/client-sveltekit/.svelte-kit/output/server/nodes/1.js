

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CeBmTDzX.js","_app/immutable/chunks/scheduler.X72G1_9w.js","_app/immutable/chunks/index.B8LpvrVp.js","_app/immutable/chunks/entry.DTXdeeiq.js"];
export const stylesheets = [];
export const fonts = [];
