import { c as create_ssr_component, o as onDestroy, d as each, b as add_attribute, e as escape, v as validate_component } from "../../../../chunks/ssr.js";
import { T as Tabs, B as Breadcrumbs } from "../../../../chunks/Tabs.js";
import "../../../../chunks/axiosClient.js";
import "file-saver";
import { A as AdvancedSearch } from "../../../../chunks/AdvancedSearch.js";
const css = {
  code: ".border-select.svelte-zl4yf2:focus{border-color:blue !important}",
  map: null
};
const ItemIngredient = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let establecimientos = [];
  let subfamilias = [];
  let showProductsFound = false;
  let dataSearchProduct = { textSearch: "", productName: "" };
  let productsFound = [];
  function handleClickArea(event) {
    const miDiv = document.getElementById("contentProductSearch");
    if (miDiv && !miDiv.contains(event.target)) {
      showProductsFound = false;
    }
  }
  document.addEventListener("click", handleClickArea);
  onDestroy(() => {
    document.removeEventListener("click", handleClickArea);
  });
  $$result.css.add(css);
  return `<form autocomplete="off" id="contentReportItemIngredient"><div class="row"><div class="col-4 col-xl-4 col-md-12"><div class="form-group"><label for="estab" data-svelte-h="svelte-1q7u6t1">Establecimiento:</label> <select class="form-control border-select svelte-zl4yf2" id="estab">${each(establecimientos, (item) => {
    return `<option${add_attribute("value", item.codEstab, 0)}>${escape(item.nombreComercial)} </option>`;
  })}</select></div></div></div> <div class="row"><div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"><div class="form-group"><label for="categoria-search" data-svelte-h="svelte-1s5aqc3">Categoría:</label> <select name="categoria-search" id="categoria-search" class="form-control border-select svelte-zl4yf2"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1e5wamb">Todos</option>${each(subfamilias, (subfamilia) => {
    return `<option${add_attribute("value", subfamilia.idSubFamilia, 0)}>${escape(subfamilia.descripcion)}</option>`;
  })}</select></div></div> <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"><div class="form-group" id="contentProductSearch"><label for="product-search">Producto:
					<small class="text-success">${escape(dataSearchProduct.productName)}</small></label> <div class="input-group">${validate_component(AdvancedSearch, "AdvancedSearch").$$render(
    $$result,
    {
      value: dataSearchProduct.textSearch,
      placeholder: "Buscar Producto"
    },
    {},
    {}
  )} <div class="input-group-append"><button class="btn btn-danger" type="button" data-svelte-h="svelte-chs0lk">×</button></div></div> ${showProductsFound ? `<div class="floating-results list-group">${each(productsFound, (item) => {
    return `<a${add_attribute("href", null, 0)} class="list-group-item"><i class="fa-solid fa-bowl-food"></i> ${escape(item.descripcion)} </a>`;
  })}</div>` : ``}</div></div></div> <div class="row"><div class="col-12"><div class="form-group" data-svelte-h="svelte-dzd824"><label for="exportTo">Exportar a:</label></div> <div class="form-group"><div class="btn-group btn-group-lg" role="group"><button type="button" class="btn btn-info" data-svelte-h="svelte-up6ywm">PDF</button> <button type="button" class="btn btn-success" data-svelte-h="svelte-1s2yh6">Excel</button></div></div></div></div> </form>`;
});
const Tabs_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let items = [
    {
      icon: "fa-solid fa-boxes-stacked",
      label: "Producto Ingrediente",
      value: 1,
      component: ItemIngredient
    }
  ];
  return `<div class="card"><div class="card-body">${validate_component(Tabs, "Tabs").$$render($$result, { items }, {}, {})}</div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Breadcrumbs, "Breadcrumbs").$$render(
    $$result,
    {
      title: "Reportes",
      action: "",
      openNew: null
    },
    {},
    {}
  )} ${validate_component(Tabs_1, "TabsReport").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
