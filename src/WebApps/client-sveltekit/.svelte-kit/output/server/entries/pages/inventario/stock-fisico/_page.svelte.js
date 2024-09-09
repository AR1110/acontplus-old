import { c as create_ssr_component, v as validate_component, d as each, b as add_attribute, e as escape } from "../../../../chunks/ssr.js";
import "input-core";
import { M as Modal } from "../../../../chunks/Modal.js";
import "../../../../chunks/axiosClient.js";
import { A as AdvancedSearch } from "../../../../chunks/AdvancedSearch.js";
import { G as Grid } from "../../../../chunks/Grid.js";
import "toastr";
let iconTitle = "ti-check";
let title = "Nueva Toma Fisica";
const Add = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showModal = false } = $$props;
  let { onModalClose } = $$props;
  let data = {};
  let establecimientos = [], puntosEmision = [], bodegas = [];
  let motivosDiscrepancia = [];
  let catalogs = [
    { code: 1, description: "Articulo" },
    { code: 3, description: "Subfamilias" },
    { code: 4, description: "Proveedor" },
    { code: 5, description: "N° Documento" }
  ];
  const onPopupClose = () => {
    showModal = false;
    onModalClose("closing");
  };
  let article = "";
  let articles = [];
  let isArticleSelected = false;
  let articlesFounded = [];
  let updateDiscrepancia = (cell) => {
    let data2 = cell.getData();
    let sum = Number(data2.stockActual) - Number(data2.cantidadContada);
    let row = cell.getRow();
    row.update({ discrepancia: sum });
  };
  let customNativeSelect = function(cell, onRendered, success, cancel) {
    var cellRealValue = cell.getElement().dataset.motivoDiscrepancia;
    cellRealValue = typeof cellRealValue === "undefined" ? "none" : cellRealValue;
    var selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";
    onRendered(function() {
      selectList.focus();
      selectList.style.height = "100%";
    });
    function onChange() {
      if (selectList.selectedOptions[0].value != cellRealValue) {
        success(selectList.selectedOptions[0].value);
        cell.getElement().dataset.motivoDiscrepancia = selectList.selectedOptions[0].value;
        cell.getElement().dataset.motivoDiscrepanciaId = selectList.selectedOptions[0].text;
      } else {
        cancel();
      }
    }
    selectList.addEventListener("blur", onChange);
    selectList.addEventListener("keydown", function(e) {
      if (e.keyCode == 13) {
        onChange();
      }
      if (e.keyCode == 27) {
        cancel();
      }
    });
    for (var i = 0; i < motivosDiscrepancia.length; i++) {
      var option = document.createElement("option");
      option.value = motivosDiscrepancia[i].id.toString();
      option.text = motivosDiscrepancia[i].descripcion;
      if (motivosDiscrepancia[i].id === cellRealValue) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };
  let columns = [
    {
      title: "Código",
      field: "codigo",
      widthGrow: 2
    },
    {
      title: "Descripcion",
      field: "descripcion",
      widthGrow: 2
    },
    {
      title: "Cant. Contada",
      field: "cantidadContada",
      widthGrow: 2,
      editor: "input",
      cellEdited: updateDiscrepancia,
      headerSort: false,
      editorParams: { selectContents: true }
    },
    {
      title: "Stock Actual",
      field: "stockActual",
      widthGrow: 2,
      headerSort: false
    },
    {
      title: "Discrepancia",
      field: "discrepancia",
      widthGrow: 2
    },
    //     return Number(data.stock) - Number(data.cantidadContada);
    // },
    {
      title: "Motivo",
      // mutator: (value, data, type, params, component) => {
      field: "motivoDiscrepanciaId",
      //editor: "list",
      editor: customNativeSelect
    }
  ];
  if ($$props.showModal === void 0 && $$bindings.showModal && showModal !== void 0)
    $$bindings.showModal(showModal);
  if ($$props.onModalClose === void 0 && $$bindings.onModalClose && onModalClose !== void 0)
    $$bindings.onModalClose(onModalClose);
  return `${showModal ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: showModal,
      onClosed: () => onPopupClose(),
      iconTitle,
      title
    },
    {},
    {
      default: () => {
        return `<form autocomplete="off"><div class="modal-body"><div class="row"><div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12"><div class="form-group"><label for="establecimiento" data-svelte-h="svelte-1akq5mx">Estab.:</label> <select name="establecimiento" id="establecimiento" class="form-control border-select">${each(establecimientos, (item) => {
          return `<option${add_attribute("value", item.codEstab, 0)}>${escape(item.nombreComercial)} </option>`;
        })}</select></div></div> <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12"><div class="form-group"><label for="puntoEmision" data-svelte-h="svelte-r1zem8">Punto Emisión:</label> <select id="puntoEmision" name="puntoEmision" class="form-control border-select">${each(puntosEmision, (item) => {
          return `<option${add_attribute("value", item.idPuntoEmision, 0)}>${escape(item.ptoEmi)} </option>`;
        })}</select></div></div> <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12"><div class="form-group"><label for="bodegas" data-svelte-h="svelte-z14v4d">Bodega</label> <select name="bodegas" id="bodegas" class="form-control border-select">${each(bodegas, (item) => {
          return `<option${add_attribute("value", item.idBodega, 0)}>${escape(item.bodega)}</option>`;
        })}</select></div></div> <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-6"><div class="form-group"><label for="fechaEmision" data-svelte-h="svelte-txofvy">Fecha Emisión</label> <input type="date" name="fechaEmision" class="form-control border-select" required${add_attribute("value", data.fecha, 0)}></div></div> <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-6"><div class="form-group"><label for="secuencial" data-svelte-h="svelte-sbpqem">Secuencial</label> <input type="text" name="secuencial" readonly disabled class="form-control border-select" required${add_attribute("value", data.serieDocumento, 0)}></div></div></div> <div class="row"><div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-12"><div class="form-group"><label for="" data-svelte-h="svelte-1kxw6my">Responsable</label> <input type="text" class="form-control" required${add_attribute("value", data.responsable, 0)}></div></div> <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12"><div class="form-group"><label for="opcion" data-svelte-h="svelte-1miww7s">Opciones:</label> <select name="opcion" id="opcion" class="form-control">${each(catalogs, (item) => {
          return `<option${add_attribute("value", item.code, 0)}>${escape(item.description)} </option>`;
        })}</select></div></div> ${`<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12"><div class="form-group"><label for="" data-svelte-h="svelte-whu51b">Articulo</label> ${validate_component(AdvancedSearch, "AdvancedSearch").$$render(
          $$result,
          {
            value: article,
            placeholder: "Buscar articulo"
          },
          {},
          {}
        )} ${articles.length > 0 && !isArticleSelected ? `<div class="floating-results list-group">${each(articles, (item) => {
          return `<a${add_attribute("href", null, 0)} class="list-group-item"><i class="fa-solid fa-check"></i> ${escape(item.codigo)}
												- ${escape(item.descripcion)}</a>`;
        })}</div>` : ``}</div></div>`}  ${``} ${``} ${``}</div>  ${articlesFounded.length > 0 ? `${validate_component(Grid, "Grid").$$render($$result, { dataArray: articlesFounded, columns }, {}, {})}` : ``} <br>  <div class="row"><div class="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-8"><div class="form-group"><textarea class="form-control" placeholder="Observación" required>${escape(data.obs || "")}</textarea></div></div> <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-8" data-svelte-h="svelte-1rrl7xx"><div class="text-right"></div></div></div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-t24n23"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-1vre7e4">× Cerrar</button></div></form>`;
      }
    }
  )} ` : ``}`;
});
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let stocksFisicos = [];
  return `<div class="card"><div class="card-body"><div class="row"><div class="col-lg-12"><div class="card">${stocksFisicos.length ? `<table class="table table-bordered"><thead data-svelte-h="svelte-mtrvly"><tr><th>N°. Documento</th> <th>Responsable</th> <th>Fecha Emisión</th> <th>Observación</th></tr></thead> <tbody>${each(stocksFisicos, (item) => {
    return `<tr><td>${escape(item.serieDocumento)}</td> <td>${escape(item.responsable)}</td> <td>${escape(item.fecha)}</td> <td>${escape(item.obs)}</td> <td data-svelte-h="svelte-1x0lejd"><button class="btn btn-danger btn-sm"><i class="fa fa-file-excel"></i></button> <button class="btn btn-warning btn-sm"><i class="ti-pencil"></i></button></td> </tr>`;
  })}</tbody> </table>` : `<h5 data-svelte-h="svelte-1bii0au">No se encontraron</h5>`}</div></div></div></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showPopup = false;
  const onPopupClose = (data) => {
    showPopup = false;
  };
  return `<div class="row page-titles"><div class="col-md-5 align-self-center" data-svelte-h="svelte-qn3jsx"><h5 class="text-themecolor">Stock Físico</h5></div> <div class="col-md-7 align-self-center text-right"><div class="d-flex justify-content-end align-items-center"><button type="button" class="btn btn-info d-block d-lg-inline-block m-l-15" data-svelte-h="svelte-1xxtjm7"><i class="fa fa-plus-circle"></i> Nuevo</button></div></div></div>  ${validate_component(Add, "Add").$$render(
    $$result,
    {
      showModal: showPopup,
      onModalClose: (data) => onPopupClose()
    },
    {},
    {}
  )} ${validate_component(List, "List").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
