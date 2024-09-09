import { c as create_ssr_component } from "../../chunks/ssr.js";
import "../../chunks/client.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `    <div class="container-fluid"><main>${slots.default ? slots.default({}) : ``}</main></div> `;
});
export {
  Layout as default
};
