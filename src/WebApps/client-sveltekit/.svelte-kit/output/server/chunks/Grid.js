import { c as create_ssr_component, b as add_attribute } from "./ssr.js";
const Grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { dataArray, columns } = $$props;
  let tableComponent;
  if ($$props.dataArray === void 0 && $$bindings.dataArray && dataArray !== void 0)
    $$bindings.dataArray(dataArray);
  if ($$props.columns === void 0 && $$bindings.columns && columns !== void 0)
    $$bindings.columns(columns);
  return `<div${add_attribute("this", tableComponent, 0)}></div>`;
});
export {
  Grid as G
};
