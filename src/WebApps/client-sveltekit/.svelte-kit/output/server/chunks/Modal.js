import { c as create_ssr_component, b as add_attribute, e as escape, i as null_to_empty } from "./ssr.js";
const css = {
  code: ".modal.svelte-10c5fkz{display:block;background:rgba(0, 0, 0, 0.5)}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  let { onClosed } = $$props;
  let { title } = $$props;
  let { iconTitle } = $$props;
  let { size = "" } = $$props;
  let { fullScreen = false } = $$props;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onClosed === void 0 && $$bindings.onClosed && onClosed !== void 0)
    $$bindings.onClosed(onClosed);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.iconTitle === void 0 && $$bindings.iconTitle && iconTitle !== void 0)
    $$bindings.iconTitle(iconTitle);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.fullScreen === void 0 && $$bindings.fullScreen && fullScreen !== void 0)
    $$bindings.fullScreen(fullScreen);
  $$result.css.add(css);
  return `<div id="modalNew" class="modal svelte-10c5fkz" tabindex="-1" role="dialog" aria-labelledby="sampleModalLabel"${add_attribute("aria-hidden", false, 0)}><div class="${"modal-dialog " + escape(fullScreen ? "modal-fullscreen" : "", true) + " modal-dialog-centered " + escape(size ? size : "", true) + " svelte-10c5fkz"}" role="document"><div class="modal-content"><div class="modal-header bg-success text-white"><h5 class="modal-title">${iconTitle ? `<i class="${escape(null_to_empty(iconTitle), true) + " svelte-10c5fkz"}"></i>` : ``} ${escape(title)}</h5> <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close" data-svelte-h="svelte-vxa5jm"></button></div> ${slots.default ? slots.default({}) : ``}</div></div> </div>`;
});
export {
  Modal as M
};
