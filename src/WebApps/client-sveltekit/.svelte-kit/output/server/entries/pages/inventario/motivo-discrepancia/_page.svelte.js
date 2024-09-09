import { c as create_ssr_component, v as validate_component, d as each, e as escape, b as add_attribute } from "../../../../chunks/ssr.js";
import "../../../../chunks/axiosClient.js";
import "toastr";
import "sweetalert2";
import { G as Grid } from "../../../../chunks/Grid.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let motivos = [];
  let dataArray = [];
  let columns = [
    {
      title: "Código",
      field: "codigo",
      widthGrow: 2,
      editor: "input"
    },
    {
      title: "Descripcion",
      field: "descripcion",
      widthGrow: 2,
      editor: "input"
    }
  ];
  return `<div class="row page-titles"><div class="col-md-5 align-self-center" data-svelte-h="svelte-1dkhyg4"><h5 class="text-themecolor">Motivos de Discrepancia</h5></div> <div class="col-md-7 align-self-center text-right"><div class="d-flex justify-content-end align-items-center"><button type="button" class="btn btn-info d-block d-lg-inline-block m-l-15" data-svelte-h="svelte-1xxtjm7"><i class="fa fa-plus-circle"></i> Nuevo</button></div></div></div> ${``} ${motivos.length > 0 ? `${validate_component(Grid, "Grid").$$render($$result, { dataArray, columns }, {}, {})} <div class="card"><div class="card-body"><div class="table-responsive"><table class="table"><thead data-svelte-h="svelte-w1ubw3"><tr><th>Código</th> <th>Descripción</th> <th>Estado</th> <th>Op</th></tr></thead> <tbody>${each(motivos, (item) => {
    return `<tr><td>${escape(item.codigo)}</td> <td>${escape(item.descripcion)}</td> <td><div class="custom-control custom-switch text-warning"><input type="checkbox" class="custom-control-input" id="${"switch" + escape(item.id, true)}"${add_attribute("checked", item.enabled, 1)}> <label class="custom-control-label" for="${"switch" + escape(item.id, true)}"></label> </div></td> <td><button class="btn btn-outline-warning" data-svelte-h="svelte-o2aa78"><i class="ti-pencil"></i></button></td> </tr>`;
  })}</tbody></table></div></div></div>` : ``} ${$$result.head += `<!-- HEAD_svelte-1ku9z42_START --><link href="https://unpkg.com/tabulator-tables@4.9.1/dist/css/tabulator.min.css" rel="stylesheet"><!-- HEAD_svelte-1ku9z42_END -->`, ""}`;
});
export {
  Page as default
};
