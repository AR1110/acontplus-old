import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
/* empty css                                                     */
const Dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<small data-svelte-h="svelte-1trst19">Cargando ...</small>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-x5wltr_START -->${$$result.title = `<title>Acontplus</title>`, ""}<meta name="description" content="Acontplus"><!-- HEAD_svelte-x5wltr_END -->`, ""} ${validate_component(Dashboard, "Dashboard").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
