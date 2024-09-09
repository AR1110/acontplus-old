import { c as create_ssr_component, b as add_attribute } from "./ssr.js";
import "./client.js";
const css = {
  code: ".border-select.svelte-zl4yf2:focus{border-color:blue !important}",
  map: null
};
const AdvancedSearch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value } = $$props;
  let { placeholder } = $$props;
  let { disabled = false } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  $$result.css.add(css);
  return `<input class="form-control border-select svelte-zl4yf2" onclick="this.select()"${add_attribute("placeholder", placeholder, 0)}${add_attribute("value", value, 0)} ${disabled ? "disabled" : ""}>`;
});
export {
  AdvancedSearch as A
};
