import { c as create_ssr_component, e as escape, d as each, b as add_attribute, v as validate_component, m as missing_component } from "./ssr.js";
/* empty css                                          */
const css = {
  code: ".page-titles.svelte-pn5nn5{background:#fff;padding:14px 10px;box-shadow:1px 0px 20px rgba(255, 255, 255, 0.08);margin:0 -25px 25px -25px}",
  map: null
};
const Breadcrumbs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { openNew } = $$props;
  let { action } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.openNew === void 0 && $$bindings.openNew && openNew !== void 0)
    $$bindings.openNew(openNew);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  $$result.css.add(css);
  return `<div class="row page-titles svelte-pn5nn5"><div class="col-md-5 align-self-center"><h5 class="text-themecolor">${escape(title)}</h5></div> ${openNew ? `<div class="col-md-7 align-self-center text-right"><div class="d-flex justify-content-end align-items-center"><button type="button" class="btn btn-info d-block d-lg-inline-block m-l-15"><i class="fa fa-plus-circle"></i> ${escape(action)}</button></div></div>` : ``} </div>`;
});
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { items = [] } = $$props;
  let { activeTabValue = 1 } = $$props;
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.activeTabValue === void 0 && $$bindings.activeTabValue && activeTabValue !== void 0)
    $$bindings.activeTabValue(activeTabValue);
  return `<ul class="nav nav-tabs" id="myTab" role="tablist">${each(items, (item) => {
    return `<li class="nav-item"><button class="${"nav-link " + escape(activeTabValue === item.value ? "active" : "", true)}" id="${escape(item.value, true) + "-tab"}" data-toggle="tab" role="tab"${add_attribute("aria-controls", item.value, 0)} aria-expanded="true"><span class="hidden-sm-up">${item.icon ? `<i${add_attribute("class", item.icon, 0)}></i> ` : ``}</span> <span class="hidden-xs-down">${escape(item.label)}</span></button> </li>`;
  })}</ul> ${each(items, (item) => {
    return `${activeTabValue == item.value ? `<div class="tab-content"><div class="${"tab-pane " + escape(activeTabValue === item.value ? "active" : "", true) + " p-10"}" id="${"tab-pane-" + escape(item.value, true)}" role="tabpanel">${validate_component(item.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div> </div>` : ``}`;
  })}`;
});
export {
  Breadcrumbs as B,
  Tabs as T
};
