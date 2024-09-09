import { c as create_ssr_component, f as createEventDispatcher, e as escape, d as each, b as add_attribute, v as validate_component, a as subscribe, o as onDestroy } from "../../../../chunks/ssr.js";
import { T as Tabs, B as Breadcrumbs } from "../../../../chunks/Tabs.js";
import { w as writable } from "../../../../chunks/index.js";
import { c as client } from "../../../../chunks/axiosClient.js";
import { s as showLoader, h as hideLoader, p as productionAreaService, t as toast, e as estabAsignService } from "../../../../chunks/estab-asign-service.js";
import { M as Modal } from "../../../../chunks/Modal.js";
import "toastr";
import { A as AdvancedSearch } from "../../../../chunks/AdvancedSearch.js";
/* empty css                                                           */
const url$6 = "Restaurant/Item/";
async function get$5(json, cancelToken) {
  return await client.get(url$6 + "?json=" + json, { cancelToken }).then(
    (res) => {
      if (res.status != 200)
        return null;
      return res.data;
    },
    (err) => {
      console.log(err);
      return null;
    }
  );
}
async function post$4(data) {
  return await client.post(url$6, data).then(
    (res) => {
      let { status, data: data2 } = res;
      return { status, data: data2 };
    },
    (err) => {
      let { status, data: data2 } = err.response;
      return { status, data: data2 };
    }
  );
}
async function put$3(id, data) {
  return await client.put(url$6 + id, data).then(
    (res) => {
      let { status, data: data2 } = res;
      return { status, data: data2 };
    },
    (err) => {
      let { status, data: data2 } = err.response;
      return { status, data: data2 };
    }
  );
}
async function remove(id) {
  return await client.delete(url$6 + id).then(
    (res) => {
      let { status, data } = res;
      return { status, data };
    },
    (err) => {
      let { status, data } = err.response;
      return { status, data };
    }
  );
}
const itemService = {
  get: get$5,
  post: post$4,
  put: put$3,
  remove
};
const url$5 = "Restaurant/Ingredient/";
async function get$4(params) {
  return await client.get(`${url$5}?json=${params}`).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }).catch((error) => {
    console.log(error);
    return null;
  });
}
async function post$3(data) {
  return await client.post(`${url$5}`, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }).catch((error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
async function put$2(id, data) {
  return await client.put(`${url$5}${id}`, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }).catch((error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
const IngredientService = {
  get: get$4,
  post: post$3,
  put: put$2
};
const url$4 = "Restaurant/Recipe/";
async function get$3(params) {
  return await client.get(`${url$4}?json=${params}`).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.status);
      return null;
    }
  }).catch((error) => {
    console.log(error.response);
    return null;
  });
}
async function getByItem(id) {
  return await client.get(`${url$4}GetByItem/${id}`).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }).catch((error) => {
    console.log(error);
    return null;
  });
}
async function post$2(data) {
  return await client.post(`${url$4}`, data).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.status);
      return null;
    }
  }).catch((error) => {
    console.log(error.response);
    return null;
  });
}
const RecipeService = {
  get: get$3,
  getByItem,
  post: post$2
};
const initiatlState = {
  items: [],
  ingredientes: [],
  productionAreas: [],
  recipes: [],
  dataUpdate: {
    id: 0,
    summary: "",
    cooking: false,
    recipe: "",
    instructions: "",
    content: "",
    createdAt: "",
    updatedAt: "",
    enabled: false,
    deleted: false,
    userId: 0,
    productId: 0,
    descripcion: "",
    s3ObjectUrl: "",
    stockMinimo: 0,
    stock: 0,
    codigo: "",
    codigoAuxiliar: "",
    tipoIva: "",
    tipoArticulo: "",
    style: "",
    productionAreaId: 0,
    descriptionProductionArea: "",
    totalRecords: 0
  },
  setIngredient: {
    id: 0,
    productId: 0,
    productDescription: "",
    s3ObjectUrl: "",
    summary: "",
    quantity: 0,
    unit: 0,
    content: "",
    ingredientTypeId: 0
  }
};
const initiatlModalState = {
  description: "",
  isOpen: false,
  openModal: () => {
  },
  closeModal: () => {
  }
};
const createItemStore = () => {
  const { set, update, subscribe: subscribe2, ...rest } = writable({
    ...initiatlState,
    ...initiatlModalState
  });
  const get2 = (params) => {
    showLoader();
    let json = { pageIndex: 1, pageSize: 9, tipo: 1 };
    let query = Object.assign(json, params ? params : json);
    update((state) => {
      return {
        ...state,
        items: []
      };
    });
    itemService.get(JSON.stringify(query)).then((response) => {
      if (response) {
        update((state) => ({
          ...state,
          items: response["items"]
        }));
      }
    }).finally(() => {
      hideLoader();
    });
  };
  const getProductionArea = () => {
    showLoader();
    productionAreaService.get().then((response) => {
      if (response) {
        update((state) => ({
          ...state,
          productionAreas: response
        }));
      }
    }).finally(() => {
      hideLoader();
    });
  };
  const getIngredient = (params) => {
    let json = { pageIndex: 1, pageSize: 10 };
    let query = Object.assign(json, params ? params : json);
    update((state) => {
      return { ...state, ingredientes: [] };
    });
    IngredientService.get(JSON.stringify(query)).then((response) => {
      hideLoader();
      console.log(response);
      if (response) {
        update((state) => ({
          ...state,
          ingredientes: response["ingredients"]
        }));
      }
    }).finally(() => {
      hideLoader();
    });
  };
  const getRecipe = (item) => {
    RecipeService.getByItem(item.id).then((response) => {
      hideLoader();
      if (response) {
        update((state) => ({
          ...state,
          recipes: response["recipe"],
          isOpen: true,
          dataUpdate: item,
          description: item.descripcion
        }));
      } else {
        update((state) => ({
          ...state,
          recipes: [],
          isOpen: true,
          dataUpdate: item
        }));
      }
    }).finally(() => {
      hideLoader();
    });
  };
  return {
    set,
    subscribe: subscribe2,
    update,
    get: get2,
    getIngredient,
    getProductionArea,
    getRecipe
  };
};
const useItemStore = createItemStore();
const css$5 = {
  code: ".active.svelte-wygqqa{background-color:rgb(150, 150, 235);color:white}ul.svelte-wygqqa{flex:1;float:right;list-style:none}li.svelte-wygqqa{float:left}button.svelte-wygqqa{background:transparent;border:1px solid #ccc;padding:5px 10px;margin-left:3px;float:left;cursor:pointer}",
  map: null
};
const Pagination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { count } = $$props;
  let { page = 0 } = $$props;
  let { pageSize } = $$props;
  let labels = {
    first: "Primero",
    last: "Último",
    next: "Siguiente",
    previous: "Anterior"
  };
  let buttons = [-2, -1, 0, 1, 2];
  let pageCount = 0;
  if (pageCount === void 0 || pageCount === null) {
    pageCount = 0;
  }
  if ($$props.count === void 0 && $$bindings.count && count !== void 0)
    $$bindings.count(count);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.pageSize === void 0 && $$bindings.pageSize && pageSize !== void 0)
    $$bindings.pageSize(pageSize);
  $$result.css.add(css$5);
  pageCount = Math.floor(count / pageSize);
  return `<ul class="svelte-wygqqa"><li class="svelte-wygqqa"><button ${page === 0 ? "disabled" : ""} class="svelte-wygqqa">${escape(labels.first)}</button></li> <li class="svelte-wygqqa"><button ${page === 0 ? "disabled" : ""} class="svelte-wygqqa">${escape(labels.previous)}</button></li> ${each(buttons, (button) => {
    return `${page + button >= 0 && page + button <= pageCount ? `<li class="svelte-wygqqa"><button class="${["svelte-wygqqa", page === page + button ? "active" : ""].join(" ").trim()}">${escape(page + button + 1)}</button> </li>` : ``}`;
  })} <li class="svelte-wygqqa"><button ${page > pageCount - 1 ? "disabled" : ""} class="svelte-wygqqa">${escape(labels.next)}</button></li> <li class="svelte-wygqqa"><button ${page >= pageCount ? "disabled" : ""} class="svelte-wygqqa">${escape(labels.last)}</button></li> </ul>`;
});
const GridForItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { columns } = $$props;
  let { arrayData } = $$props;
  let tableComponent;
  if ($$props.columns === void 0 && $$bindings.columns && columns !== void 0)
    $$bindings.columns(columns);
  if ($$props.arrayData === void 0 && $$bindings.arrayData && arrayData !== void 0)
    $$bindings.arrayData(arrayData);
  return `<div${add_attribute("this", tableComponent, 0)}></div>`;
});
const css$4 = {
  code: "li.autocomplete-items.svelte-xhhva6{list-style:none;border-bottom:1px solid #d4d4d4;z-index:99;top:100%;left:0;right:0;padding:10px;cursor:pointer;background-color:#fff}li.autocomplete-items.svelte-xhhva6:hover{background-color:#81921f;color:white}li.autocomplete-items.svelte-xhhva6:active{background-color:DodgerBlue !important;color:#ffffff}.autocomplete-active.svelte-xhhva6{background-color:DodgerBlue !important;color:#ffffff}",
  map: null
};
const Items_list = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { itemLabel } = $$props;
  let { highlighted } = $$props;
  if ($$props.itemLabel === void 0 && $$bindings.itemLabel && itemLabel !== void 0)
    $$bindings.itemLabel(itemLabel);
  if ($$props.highlighted === void 0 && $$bindings.highlighted && highlighted !== void 0)
    $$bindings.highlighted(highlighted);
  $$result.css.add(css$4);
  return `  <li class="${["autocomplete-items svelte-xhhva6", highlighted ? "autocomplete-active" : ""].join(" ").trim()}"><!-- HTML_TAG_START -->${itemLabel.summary}<!-- HTML_TAG_END --> </li>`;
});
const css$3 = {
  code: 'div.autocomplete.svelte-jn42xm{position:relative;display:inline-block;width:100%}input.svelte-jn42xm{border:1px solid transparent;background-color:#f1f1f1;padding:10px;font-size:16px;border-radius:5px;margin:0;width:auto}input[type="text"].svelte-jn42xm{background-color:#f1f1f1;width:100%}#autocomplete-items-list.svelte-jn42xm{position:relative;margin:0;padding:0;top:0;width:297px;border:1px solid #ddd;background-color:#ddd;z-index:99}',
  map: null
};
const Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { setOnChange } = $$props;
  let filteredCountries = [];
  let ingredientes = [];
  let searchInput;
  let inputValue = "";
  let hiLiteIndex = null;
  if ($$props.setOnChange === void 0 && $$bindings.setOnChange && setOnChange !== void 0)
    $$bindings.setOnChange(setOnChange);
  $$result.css.add(css$3);
  filteredCountries = ingredientes;
  {
    {
      filteredCountries = [];
      hiLiteIndex = null;
    }
  }
  filteredCountries[hiLiteIndex];
  return ` <form autocomplete="off"><div class="autocomplete svelte-jn42xm"><input id="country-input" type="text" placeholder="Buscar ingredientes" class="svelte-jn42xm"${add_attribute("this", searchInput, 0)}${add_attribute("value", inputValue, 0)}></div>  ${filteredCountries.length > 0 ? `<ul id="autocomplete-items-list" class="svelte-jn42xm">${each(filteredCountries, (country, i) => {
    return `${validate_component(Items_list, "ItemsList").$$render(
      $$result,
      {
        itemLabel: country,
        highlighted: i === hiLiteIndex
      },
      {},
      {}
    )}`;
  })}</ul>` : ``} </form>`;
});
const Add$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $useItemStore, $$unsubscribe_useItemStore;
  $$unsubscribe_useItemStore = subscribe(useItemStore, (value) => $useItemStore = value);
  let data;
  let recipes = [];
  let productionAreas = [];
  let extents = [];
  let { pageIndexCurrent } = $$props;
  useItemStore.subscribe((values) => {
    productionAreas = values.productionAreas, data = values.dataUpdate, recipes = values.recipes;
  });
  let selectExtend = function(cell, onRendered, success, cancel) {
    let medidas2 = [];
    let rows = cell.getRow().getData();
    if (rows.extents != void 0) {
      medidas2 = JSON.parse(rows.extents);
    }
    let selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";
    onRendered(function() {
      selectList.focus();
      selectList.style.height = "100%";
    });
    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);
        cell.getElement().dataset.descripcion = selectList.selectedOptions[0].text;
        cell.getElement().dataset.extentId = selectList.selectedOptions[0].value;
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
    for (let i = 0; i < medidas2.length; i++) {
      let option = document.createElement("option");
      option.value = medidas2[i].idMedida.toString();
      option.text = medidas2[i].descripcion;
      if (medidas2[i].idMedida === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };
  let formatterMedida = (cell) => {
    let medidas2 = [];
    let row = cell.getRow().getData();
    let value = cell.getValue();
    if (row.extents != void 0) {
      medidas2 = JSON.parse(row.extents);
    }
    if (medidas2.length == 0)
      return "";
    return medidas2.find((x) => x.idMedida == value).descripcion;
  };
  let formatterCostPrice = (cell) => {
    let medidas2 = [];
    let value = 0;
    let row = cell.getRow().getData();
    if (row.extents != void 0) {
      medidas2 = JSON.parse(row.extents);
    }
    medidas2.forEach((e) => {
      if (e.idMedida == row.extentId) {
        value = e.precioCosto * row.quantity;
      }
    });
    return value.toFixed(2);
  };
  let priceUpdate = (cell) => {
    let column = cell.getColumn()._column.field;
    let row = cell.getRow().getData();
    let medidas2 = [];
    if (row.extents != void 0) {
      medidas2 = JSON.parse(row.extents);
    }
    if (column == "extentId" && medidas2.length > 0) {
      medidas2.forEach((e) => {
        if (e.idMedida == row.extentId) {
          cell.getRow().update({
            precioCosto: e.precioCosto,
            costPrice: (e.precioCosto * row.quantity).toFixed(2)
          });
        }
      });
    }
    if (column == "quantity" && medidas2.length > 0) {
      medidas2.forEach((e) => {
        if (e.idMedida == row.extentId) {
          cell.getRow().update({
            costPrice: (e.precioCosto * row.quantity).toFixed(2)
          });
        }
      });
    }
  };
  let columns = [
    {
      title: "Ingrediente",
      field: "summary",
      widthGrow: 1,
      with: 300
    },
    {
      title: "Medida",
      field: "extentId",
      with: 150,
      editor: selectExtend,
      formatter: formatterMedida,
      cellEdited: priceUpdate
    },
    {
      title: "Peso",
      field: "weight",
      editor: true,
      with: 50,
      widthGrow: 1,
      validator: ["numeric"]
    },
    {
      title: "Instrucciones",
      field: "instructions",
      widthGrow: 3,
      with: 200,
      editor: true
    },
    {
      title: "Cantidad",
      field: "quantity",
      with: 50,
      widthGrow: 1,
      editor: true,
      cellEdited: priceUpdate
    },
    {
      title: "Precio costo",
      field: "precioCosto",
      with: 75,
      widthGrow: 1,
      editor: false
    },
    {
      title: "Total",
      field: "costPrice",
      with: 90,
      editor: true,
      formatter: formatterCostPrice,
      bottomCalc: (values, data2, calcParams) => {
        let total = 0;
        console.log(data2);
        data2.forEach((e) => {
          total += Number(e.costPrice);
        });
        return total.toFixed(2);
      }
    },
    {
      title: "Acciones",
      widthGrow: 1,
      hozAlign: "center",
      formatter: "buttonCross",
      width: 100,
      align: "center",
      cellClick(e, cell) {
        removeFromList(cell.getData().id);
        cell.getRow().delete();
      }
    }
  ];
  const setOnChange = (ingredient) => {
    let exists = recipes.find((x) => x.ingredientId == ingredient.id);
    if (exists) {
      return toast({
        type: "warning",
        message: "El ingrediente ya existe"
      });
    }
    onPushRecipe(ingredient, data.id);
  };
  const onPushRecipe = (data2, itemId) => {
    let newObject = {
      id: 0,
      itemId,
      extentId: 0,
      productId: data2.productId,
      ingredientId: data2.id,
      unit: 0,
      weight: 0,
      netWeight: 0,
      summary: data2.summary,
      instructions: "",
      quantity: 0,
      precioCosto: 0,
      costPrice: 0
    };
    useItemStore.update((state) => ({
      ...state,
      recipes: [...state.recipes, newObject]
    }));
    getExtendId(data2.productId);
    toast({ type: "success", message: "Agregado" });
  };
  const getExtendId = (productId) => {
    let query = { tipo: 3, productId };
    showLoader();
    IngredientService.get(JSON.stringify(query)).then((resp) => {
      if (resp) {
        extents = resp["extents"];
        recipes.forEach((e) => {
          if (e.productId === productId) {
            e.extentId = extents[0].idMedida;
            e.precioCosto = extents[0].precioCosto;
            e.extents = JSON.stringify(extents);
          }
        });
        useItemStore.update((state) => ({ ...state, recipes }));
      }
    }).finally(() => {
      hideLoader();
    });
  };
  const removeFromList = (id) => {
    let newArray = recipes.filter((x) => x.id !== id);
    useItemStore.update((state) => ({ ...state, recipes: newArray }));
  };
  const onModalClose = () => {
    useItemStore.update((state) => ({ ...state, isOpen: false }));
    recipes = [];
  };
  if ($$props.pageIndexCurrent === void 0 && $$bindings.pageIndexCurrent && pageIndexCurrent !== void 0)
    $$bindings.pageIndexCurrent(pageIndexCurrent);
  $$unsubscribe_useItemStore();
  return `${$useItemStore.isOpen ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: $useItemStore.isOpen,
      iconTitle: data.id > 0 ? "ti-sync" : "ti-plus",
      title: data.id > 0 ? ` Actualizar ${$useItemStore.description.toUpperCase()}` : "Registrar",
      onClosed: () => onModalClose(),
      size: "modal-xl modal-dialog-scrollable"
    },
    {},
    {
      default: () => {
        return `<div class="modal-body"><form autocomplete="off"><div class="row"><div class="col-6"><div class="form-group input-group-lg"><label for="production-area" data-svelte-h="svelte-1rxcyg0">Areas de producción</label> <select class="form-control" id="production-area"><option disabled value="seleccione" data-svelte-h="svelte-12jus7u">seleccione</option>${each(productionAreas, (productionArea) => {
          return `<option${add_attribute("value", productionArea.id, 0)}>${escape(productionArea.description)} </option>`;
        })}</select></div></div> <div class="col-6"><div class="form-group"><label for="summary" data-svelte-h="svelte-1e7vmmh">Resumen</label> <input class="form-control form-control-lg" type="text"${add_attribute("value", data.summary, 0)}></div></div></div> <div class="row mt-3"><div class="col-6"><div class="form-group"><label for="recipe" data-svelte-h="svelte-1vr3yx6">Receta</label> <textarea class="form-control" id="recipe" rows="6">${escape(data.recipe || "")}</textarea></div></div> <div class="col-6"><div class="form-group"><label for="instructions" data-svelte-h="svelte-6298hi">Instrucciones</label> <textarea class="form-control" id="instructions" rows="6">${escape(data.instructions || "")}</textarea></div></div></div>  <hr> <div class="row"><div class="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12" data-svelte-h="svelte-1o7f7uf"><div class="form-group"><label for="ingredients">Ingredientes</label></div></div> <div class="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">${validate_component(Search, "Search").$$render($$result, { setOnChange }, {}, {})}</div></div> <hr> ${validate_component(GridForItem, "GridForItem").$$render($$result, { arrayData: recipes, columns }, {}, {})} <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-8492b6"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-r3nec0">× Cerrar</button></div></form></div>`;
      }
    }
  )}` : ``}`;
});
const List$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let items = [];
  let recordsQuantity = [10, 25, 50, 100];
  useItemStore.subscribe((values) => {
    items = values.items;
  });
  let page = 0;
  let pageCurrent = 0;
  let pageSize = recordsQuantity[0];
  return ` <div class="row"><div class="col-lg-9 col-md-9 col-sm-1"><span class="form-group pull-left page-size form-inline"><select class="form-control control-color">${each(recordsQuantity, (record) => {
    return `<option${add_attribute("value", record, 0)}>${escape(record)}</option>`;
  })}</select></span></div> <div class="col-lg-3 col-md-3 col-sm-12 col-12"><div class="input-group mb-3"><input type="text" class="form-control form-control-lg search-input" placeholder="Buscar..." aria-label="" aria-describedby="basic-addon1"> <div class="input-group-append"><button class="btn btn-outline-secondary" type="button" data-svelte-h="svelte-1a3j5wc"><i class="fa fa-sync"></i></button></div></div></div></div>  ${items.length > 0 ? `<div class="resposive-table"><table class="table"><thead data-svelte-h="svelte-1r3sg8"><tr><th scope="col"></th> <th scope="col">N°</th> <th scope="col">Categoría</th> <th scope="col">Item</th> <th scope="col">Resumen</th></tr></thead> <tbody>${each(items, (item, index) => {
    return `<tr><th> <a href="javascript:void(0)" class="btn btn-sm btn-success" data-svelte-h="svelte-1qkzyxe"><i class="fas fa-edit"></i> </a></th> <th>${escape(index + 1)}</th> <td>${escape(item.categoria)}</td> <td><img${add_attribute("src", item.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png", 0)} width="70" class="rounded" alt=""> ${escape(item.descripcion)}</td> <td>${escape(item.summary)}</td> </tr>`;
  })}</tbody></table>  ${validate_component(Pagination, "Pagination").$$render(
    $$result,
    {
      page,
      pageSize,
      count: items[0]["totalRecords"]
    },
    {},
    {}
  )}</div>` : `<p class="text-center text-italic" data-svelte-h="svelte-aangzk">No hay items registrados</p>`} ${validate_component(Add$3, "Add").$$render($$result, { pageIndexCurrent: pageCurrent }, {}, {})}`;
});
const Items = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(List$3, "List").$$render($$result, {}, {}, {})}`;
});
const url$3 = "Restaurant/Menu/";
async function get$2(params) {
  return await client.get(`${url$3}?json=${params}`).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.status);
      return null;
    }
  }).catch((error) => {
    console.log(error.response);
    return null;
  });
}
async function post$1(data) {
  return await client.post(`${url$3}`, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }).catch((error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
async function put$1(id, data) {
  return await client.put(`${url$3 + id}`, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }).catch((error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
const MenuService = {
  get: get$2,
  post: post$1,
  put: put$1
};
const initialState$2 = {
  menus: [],
  dataUpdate: {
    id: 0,
    productId: 0,
    title: "",
    summary: "",
    typeId: 0,
    content: "",
    forPromotion: false
  },
  menuTypes: []
};
const initialModalState$2 = {
  isOpen: false,
  openModal: () => {
  },
  closeModal: () => {
  }
};
const menuStore = () => {
  const { set, update, subscribe: subscribe2 } = writable({
    ...initialState$2,
    ...initialModalState$2
  });
  const get2 = () => {
    showLoader();
    update((state) => ({ ...state, menus: [], menuTypes: [] }));
    MenuService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      update((state) => ({
        ...state,
        menus: response["menus"],
        menuTypes: response["menuTypes"]
      }));
    }).finally(() => {
      hideLoader();
    });
  };
  const openingModal = (menu) => {
    update((state) => ({
      ...state,
      isOpen: true,
      dataUpdate: menu
    }));
  };
  return { set, subscribe: subscribe2, update, get: get2, openingModal };
};
const useMenuStore = menuStore();
const url$2 = "Restaurant/MenuItem/";
async function getById(id, data) {
  return await client.get(`${url$2}GetById/${id}?json=${JSON.stringify(data)}`).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }).catch((error) => {
    console.log(error);
    return null;
  });
}
const MenuItemService = {
  getById
};
const css$2 = {
  code: "[data-svelte-search] input{width:100%;font-size:1rem;padding:0.5rem;margin:0.5rem 0;border:1px solid #e0e0e0;border-radius:0.25rem}",
  map: null
};
let placeholder$1 = "Buscar producto";
const Add$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $useMenuStore, $$unsubscribe_useMenuStore;
  $$unsubscribe_useMenuStore = subscribe(useMenuStore, (value2) => $useMenuStore = value2);
  let data = {};
  let value = "";
  let itemSearch = [];
  let productsAdded = [];
  let validation = [void 0, null, 0, ""];
  const getItems = (id) => {
    showLoader();
    MenuItemService.getById(id, { id, tipo: 1 }).then((response) => {
      if (response) {
        productsAdded = response["menuItems"];
        verifyUpdateCell(productsAdded);
      }
    }).finally(() => {
      hideLoader();
    });
  };
  let verifyUpdateCell = (productsAdded2) => {
    showLoader();
    if (productsAdded2.length > 0) {
      for (let i = 0; i < productsAdded2.length; i++) {
        let fee = JSON.parse(productsAdded2[i].fees).find((x) => x.idTarifa == productsAdded2[i].feeId);
        productsAdded2[i].priceIVA = fee.precioConIva;
        productsAdded2[i].price = fee.precioVenta;
      }
    }
    hideLoader();
  };
  let selectFee = (cell, onRendered, success, cancel) => {
    let fees = [];
    let rows = cell.getRow().getData();
    if (rows.fees === void 0)
      fees = [];
    if (rows.fees != void 0)
      fees = JSON.parse(rows.fees);
    let selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";
    onRendered(function() {
      selectList.focus();
      selectList.style.height = "100%";
    });
    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);
        cell.getElement().dataset.tarifa = selectList.selectedOptions[0].text;
        cell.getElement().dataset.feeId = selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }
    selectList.addEventListener("blur", onChange);
    for (let i = 0; i < fees.length; i++) {
      let option = document.createElement("option");
      option.value = fees[i].idTarifa.toString();
      option.text = fees[i].tarifa;
      if (fees[i].idMedida === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };
  let formatterFee = (cell) => {
    let fees = [];
    let row = cell.getRow().getData();
    let value2 = cell.getValue();
    fees = JSON.parse(row.fees);
    return fees.find((x) => x.idTarifa == value2).tarifa;
  };
  let calculateTotal = (cell) => {
    let row = cell.getRow().getData();
    let porcentaje = 0;
    let descuento = 0;
    let totalDiscount = 0;
    let column = cell.getColumn()._column.field;
    if (column === "feeId") {
      let fee = JSON.parse(row.fees).find((x) => x.idTarifa == row.feeId);
      cell.getRow().update({
        priceIVA: fee.precioConIva,
        price: fee.precioVenta
      });
    }
    if (column === "quantity") {
      if (row.quantity >= 0) {
        cell.getRow().update({ quantity: row.quantity });
      } else {
        let oldValue = cell.getOldValue();
        cell.getRow().update({ quantity: oldValue });
      }
    }
    if (column === "discountPercent") {
      if (row.discountPercent >= 0 && row.discountPercent <= 100) {
        porcentaje = row.discountPercent / 100;
        descuento = row.priceIVA * porcentaje;
        if (!validation.includes(descuento)) {
          descuento = parseFloat(descuento.toFixed(2));
        }
        cell.getRow().update({
          discountPercent: row.discountPercent,
          discountValue: descuento
        });
      } else {
        let oldValue = cell.getOldValue();
        cell.getRow().update({ discountPercent: oldValue });
        return toast({
          type: "warning",
          message: "El descuento no puede ser mayor al 100%"
        });
      }
    }
    totalDiscount = (row.priceIVA - row.discountValue) * row.quantity;
    if (!validation.includes(totalDiscount)) {
      totalDiscount = parseFloat(totalDiscount.toFixed(2));
    }
    cell.getRow().update({ subtotal: totalDiscount });
  };
  const removeFromList = (itemId) => {
    let newArray = productsAdded.filter((x) => x.itemId !== itemId);
    productsAdded = newArray;
  };
  let productColumns = [
    {
      editable: "never",
      field: "descripcion",
      title: "Producto",
      with: 300
    },
    {
      editable: "never",
      field: "codigo",
      hozAlign: "center",
      title: "Código",
      with: 100
    },
    {
      editable: "never",
      field: "medida",
      hozAlign: "center",
      title: "Medida",
      with: 100
    },
    {
      editor: selectFee,
      formatter: formatterFee,
      cellEdited: calculateTotal,
      field: "feeId",
      hozAlign: "center",
      title: "Tarifa",
      typeNumber: true,
      with: 100
    },
    {
      editable: "never",
      field: "priceIVA",
      hozAlign: "center",
      title: "Precio IVA",
      with: 100
    },
    // {
    //   field: "price",
    //   hozAlign: "center",
    //   title: "Precio Venta",
    //   with: 200,
    // },
    {
      editor: "input",
      field: "quantity",
      hozAlign: "center",
      title: "Cantidad",
      sorter: "number",
      cellEdited: calculateTotal,
      with: 200
    },
    {
      editor: "input",
      field: "discountPercent",
      title: "Desc. %",
      sorter: "number",
      hozAlign: "center",
      with: 200,
      cellEdited: calculateTotal
    },
    {
      editable: "never",
      field: "discountValue",
      title: "Valor Descuento",
      hozAlign: "center",
      with: 200,
      calcBottom: "sum",
      bottomCalc(data2) {
        let discountValue = 0;
        data2.forEach((element) => {
          discountValue += element;
        });
        if (!validation.includes(discountValue)) {
          discountValue = parseFloat(discountValue.toFixed(2));
        } else {
          discountValue = 0;
        }
        return discountValue;
      }
    },
    {
      calcBottom: "sum",
      editable: false,
      editor: "input",
      field: "subtotal",
      hozAlign: "center",
      title: "Subtotal",
      with: 100,
      bottomCalc(data2) {
        let subtotal = 0;
        data2.forEach((element) => {
          subtotal += element;
        });
        if (!validation.includes(subtotal)) {
          subtotal = parseFloat(subtotal.toFixed(2));
        } else {
          subtotal = 0;
        }
        return subtotal;
      }
    },
    {
      cellClick: (e, cell) => {
        removeFromList(cell.getData().itemId);
        cell.getRow().delete();
      },
      formatter: "buttonCross",
      hozAlign: "center",
      resizable: false,
      title: "Opción",
      width: 100
    }
  ];
  const onModalClose = () => {
    productsAdded = [];
    useMenuStore.update((state) => ({ ...state, isOpen: false }));
  };
  useMenuStore.subscribe((values) => {
    data = values.dataUpdate;
    values.menuTypes;
    if (data.id > 0) {
      getItems(data.id);
    }
  });
  $$result.css.add(css$2);
  $$unsubscribe_useMenuStore();
  return `${$useMenuStore.isOpen ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: $useMenuStore.isOpen,
      iconTitle: "ti-plus",
      title: `Menu - ${data.id > 0 ? data.title : ""}`,
      size: "modal-xl modal-dialog-scrollable",
      onClosed: () => onModalClose()
    },
    {},
    {
      default: () => {
        return `<div class="modal-body"><div class="modal-body"><div class="row"> <div class="col-6 col-md-6 col-sm-12"><div class="form-group"><label for="" data-svelte-h="svelte-z606aj">Nombre</label> <input type="text" class="form-control input-group-lg"${add_attribute("value", data.title, 0)}></div></div> <div class="col-6 col-md-6 col-sm-6"><div class="form-group"><label for="control-label" data-svelte-h="svelte-1sntogc">Usar en promoción</label> <div class="checkbox icheck-primary"><input type="checkbox" id="${"primary_" + escape(data.id, true)}"${add_attribute("checked", data.forPromotion, 1)}> <label for="${"primary_" + escape(data.id, true)}"></label></div></div></div></div> <div class="row"><div class="col-12"><div class="form-group"><label for="">Descripción -
                <span><button type="button" class="btn btn-sm btn-outline-info" data-toggle="tooltip" data-placement="top" title="Generar la descripción para el combo" data-svelte-h="svelte-1epzsjs"><i class="fa-solid fa-sync"></i>
                    Generar descripción</button></span></label> <textarea class="form-control">${escape(data.summary || "")}</textarea></div></div></div> <div class="row"><div class="col-12"><div class="form-group"><label for="" data-svelte-h="svelte-ps09uv">Contenido</label> <textarea class="form-control">${escape(data.content || "")}</textarea></div></div></div> <div class="row mt-3"><div class="col-6 col-md-6 col-sm-6"></div> <div class="col-6 col-md-6 col-sm-6"><label for="search" data-svelte-h="svelte-1l5n67u">Buscar producto</label> <div class="form-group input-group-lg">${validate_component(AdvancedSearch, "AdvancedSearch").$$render($$result, { value, placeholder: placeholder$1 }, {}, {})} ${itemSearch.length > 0 ? `<div class="floating-results list-group">${each(itemSearch, (item) => {
          return `<a${add_attribute("href", null, 0)} class="list-group-item"><i class="fa-solid fa-bowl-food"></i> ${escape(item.descripcion)}</a>`;
        })}</div>` : ``}</div></div></div> <div class="row mt-2"><div class="col-12">${validate_component(GridForItem, "GridForItem").$$render(
          $$result,
          {
            arrayData: productsAdded,
            columns: productColumns
          },
          {},
          {}
        )}</div></div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-e5bzie"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-196of2o">× Cerrar</button></div></div>`;
      }
    }
  )}` : ``}`;
});
const css$1 = {
  code: ".img-responsive.svelte-1toqyi8{max-width:100%;height:200px;object-fit:cover}",
  map: null
};
const List$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let menus = [];
  useMenuStore.subscribe((values) => {
    menus = values.menus;
  });
  $$result.css.add(css$1);
  return `${menus.length > 0 ? `<div class="row mt-2">${each(menus, (item) => {
    return `<div class="col-4 col-md-4 col-sm-12"><div class="card border border-primary"><div class="card-header bg-transparent"><h5 class="card-title">${escape(item.title)}</h5></div> <div class="card-body"> <img class="card-img-top img-responsive svelte-1toqyi8"${add_attribute("src", item.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png", 0)} height="200" width="200" alt="Imagen del producto"></div> <div class="card-footer bg-transparent"><button type="button" class="btn btn-outline-primary" data-svelte-h="svelte-bgpud5"><i class="ti-plus"></i> Administrar</button> </div></div> </div>`;
  })}</div>` : `<h5 data-svelte-h="svelte-5qruz6">No existe menus registrados</h5>`} ${validate_component(Add$2, "Add").$$render($$result, {}, {}, {})}`;
});
const Menus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(List$2, "List").$$render($$result, {}, {}, {})}`;
});
const initialModalState$1 = {
  isOpen: false,
  openModal: () => {
  },
  closeModal: () => {
  }
};
const initialState$1 = {
  ingredients: [],
  ingredientType: [],
  dataUpdate: {
    id: 0,
    productId: 0,
    productDescription: "",
    summary: "",
    quantity: 0,
    unit: 0,
    content: "",
    ingredientTypeId: 0
  }
};
const createIngredientStore = () => {
  const { set, update, subscribe: subscribe2 } = writable({
    ...initialState$1,
    ...initialModalState$1
  });
  const get2 = (params) => {
    showLoader();
    let json = { pageIndex: 1, pageSize: 10, tipo: 1 };
    let query = Object.assign(json, params ? params : json);
    update((state) => {
      return {
        ...state,
        ingredients: []
      };
    });
    IngredientService.get(JSON.stringify(query)).then((response) => {
      if (response) {
        update((state) => ({
          ...state,
          ingredients: response["ingredients"],
          ingredientType: response["ingredientTypes"]
        }));
      }
    }).finally(() => {
      hideLoader();
    });
  };
  const getUpdate = (data) => {
    update((state) => ({
      ...state,
      isOpen: true,
      dataUpdate: data
    }));
  };
  return { set, subscribe: subscribe2, update, get: get2, getUpdate };
};
const useIngredientStore = createIngredientStore();
const Add$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $useIngredientStore, $$unsubscribe_useIngredientStore;
  $$unsubscribe_useIngredientStore = subscribe(useIngredientStore, (value) => $useIngredientStore = value);
  let ingredient;
  let ingredientType = [];
  useIngredientStore.subscribe((values) => {
    ingredient = values.dataUpdate, ingredientType = values.ingredientType;
  });
  const onModalClose = () => {
    useIngredientStore.update((state) => ({ ...state, isOpen: false }));
  };
  $$unsubscribe_useIngredientStore();
  return `${$useIngredientStore.isOpen ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: $useIngredientStore.isOpen,
      iconTitle: ingredient.id > 0 ? "ti-sync" : "ti-plus",
      title: ingredient.id > 0 ? "Actualizar" : "Registrar",
      onClosed: () => onModalClose(),
      size: "modal-lg"
    },
    {},
    {
      default: () => {
        return `<form autocomplete="off"><div class="modal-body"><div class="row"><div class="col-6"><label for="" data-svelte-h="svelte-7de397">Resumen</label> <input class="form-control form-control-lg" type="text"${add_attribute("value", ingredient.summary, 0)}></div> <div class="col-6"><label for="" data-svelte-h="svelte-etcs38">Tipo</label> <select class="form-control form-control-lg">${each(ingredientType, (item) => {
          return `<option${add_attribute("value", item.id, 0)}>${escape(item.name)}</option>`;
        })}</select></div></div> <div class="row mt-3"><div class="col-6"><label for="" data-svelte-h="svelte-1geecco">Cantidad</label> <input class="form-control form-control-lg" type="number"${add_attribute("value", ingredient.quantity, 0)}></div> <div class="col-6"><label for="" data-svelte-h="svelte-fucs1f">Unitario</label> <input class="form-control form-control-lg" type="number"${add_attribute("value", ingredient.unit, 0)}></div></div> <div class="row mt-3"><div class="col-12"><label for="" data-svelte-h="svelte-ps09uv">Contenido</label> <textarea class="form-control" id="" rows="3">${escape(ingredient.content || "")}</textarea></div></div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-13cpenm"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-196of2o">× Cerrar</button></div></form>`;
      }
    }
  )}` : ``}`;
});
const List$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ingredient = [];
  let recordsQuantity = [10, 25, 50, 100];
  let page;
  let pageSize = recordsQuantity[0];
  useIngredientStore.subscribe((values) => {
    ingredient = values.ingredients;
  });
  return `${ingredient.length > 0 ? `<div class="row mt-3"><div class="col-lg-9 col-md-9 col-sm-1"><span class="form-group pull-left page-size form-inline"><select class="form-control control-color">${each(recordsQuantity, (record) => {
    return `<option${add_attribute("value", record, 0)}>${escape(record)}</option>`;
  })}</select></span></div> <div class="col-lg-3 col-md-3 col-sm-12 col-12"></div></div>` : ``} <div class="responsive-table"><table class="table table-hover"><thead data-svelte-h="svelte-y85cn4"><tr><th scope="col"></th> <th scope="col">#</th> <th scope="col">Ingrediente</th> <th scope="col">Cantidad</th> <th scope="col">Unitario</th> <th scope="col">Contenido</th></tr></thead> <tbody>${each(ingredient, (item, i) => {
    return `<tr><th> <a href="javascript:void(0)" class="btn btn-sm btn-success" data-svelte-h="svelte-9z3it"><i class="fas fa-edit"></i></a> </th><th scope="row">${escape(i + 1)}</th> <td>${item.s3ObjectUrl != null && item.s3ObjectUrl != "" ? `<img${add_attribute("src", item.s3ObjectUrl, 0)} width="70" class="rounded" alt="">` : `<img src="https://i.stack.imgur.com/GNhxO.png" width="70" class="rounded" alt="">`} <span class="mr-5">${escape(item.summary)}<span></span> </span></td> <td>${escape(item.quantity)}</td> <td>${escape(item.unit)}</td> <td>${escape(item.content)}</td> </tr>`;
  })}</tbody></table>  ${ingredient.length > 0 ? `${validate_component(Pagination, "Pagination").$$render(
    $$result,
    {
      page,
      pageSize,
      count: ingredient[0]["totalRecords"]
    },
    {},
    {}
  )}` : ``}</div> ${validate_component(Add$1, "Add").$$render($$result, {}, {}, {})}`;
});
const Ingredient = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(List$1, "List").$$render($$result, {}, {}, {})}`;
});
const url$1 = "Restaurant/Promotion/";
async function get$1(params) {
  return await client.get(`${url$1}?json=${params}`).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }).catch((error) => {
    console.log(error);
    return null;
  });
}
async function post(data, file) {
  return await client.post(`${url$1}?json=${data}`, { file }, { headers: { "Content-Type": "multipart/form-data" } }).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }).catch((error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
async function put(id, data, file) {
  return await client.put(`${url$1 + id}/?json=${data}`, { file }, { headers: { "Content-Type": "multipart/form-data" } }).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }).catch((error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
const PromotionService = {
  get: get$1,
  post,
  put
};
const initialState = {
  dataUpdate: {
    id: 0,
    codEstab: "",
    description: "",
    startDate: "",
    endDate: "",
    promotionDays: ""
  },
  establecimientos: [],
  promotions: [],
  days: [],
  codEstab: ""
};
const initialModalState = {
  isOpen: false,
  openModal: () => {
  },
  closeModal: () => {
  }
};
const promotionStore = () => {
  const { set, update, subscribe: subscribe2 } = writable({
    ...initialModalState,
    ...initialState
  });
  const get2 = (params) => {
    console.log("get");
    showLoader();
    update((state) => ({ ...state, promotions: [], days: [] }));
    let json = { pageIndex: 1, pageSize: 9, tipo: 1, ...params };
    PromotionService.get(JSON.stringify(json)).then((response) => {
      if (response) {
        update((state) => ({
          ...state,
          promotions: response["promotions"],
          days: response["days"]
        }));
      }
      hideLoader();
    });
  };
  const getEstablecimiento = () => {
    estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      if (response) {
        let codEstab = response[0].codEstab;
        update((state) => ({
          ...state,
          establecimientos: response,
          codEstab
        }));
        get2({ codEstab });
      }
    });
  };
  const openingModal = (data) => {
    console.log("openingModal");
    update((state) => ({
      ...state,
      isOpen: true,
      dataUpdate: data || initialState.dataUpdate
    }));
  };
  return {
    set,
    subscribe: subscribe2,
    update,
    get: get2,
    getEstablecimiento,
    openingModal
  };
};
const usePromotionStore = promotionStore();
const url = "Restaurant/PromotionMenu/";
async function get(id, params) {
  return await client.get(`${url}GetById/${id}?json=${params}`).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }).catch((error) => {
    console.log(error);
    return null;
  });
}
const PromotionMenuService = {
  get
};
const css = {
  code: '.custom-input.svelte-1o3nute.svelte-1o3nute{border:2px dashed #ccc;padding:20px;text-align:center;cursor:pointer;transition:border-color 0.3s ease;display:flex;flex-direction:column;align-items:center}.custom-input.svelte-1o3nute.svelte-1o3nute:hover{border-color:#007bff}.hover-effect.svelte-1o3nute.svelte-1o3nute{display:block;transition:color 0.3s ease;margin-bottom:10px}.custom-input.svelte-1o3nute:hover .hover-effect.svelte-1o3nute{color:#007bff}.image-preview.svelte-1o3nute.svelte-1o3nute{margin-top:20px}.image-preview.svelte-1o3nute img.svelte-1o3nute{max-width:100%;height:100px;object-fit:cover;box-shadow:0px 0px 10px rgba(0, 0, 0, 0.3);border-radius:5px}input[type="file"].svelte-1o3nute.svelte-1o3nute{display:none}label[for="file-input"].svelte-1o3nute.svelte-1o3nute{background-color:#007bff;color:#fff;padding:10px 20px;border-radius:5px;cursor:pointer;transition:background-color 0.3s ease}label[for="file-input"].svelte-1o3nute.svelte-1o3nute:hover{background-color:#fff}',
  map: null
};
let placeholder = "Buscar menu";
const Add = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $usePromotionStore, $$unsubscribe_usePromotionStore;
  $$unsubscribe_usePromotionStore = subscribe(usePromotionStore, (value2) => $usePromotionStore = value2);
  let dataUpdate = {
    id: 0,
    codEstab: "",
    description: "",
    startDate: "",
    endDate: "",
    promotionDays: ""
  };
  let establecimientos = [];
  let days = [];
  let daysSelected = [];
  let itemSearch = [];
  let promotionMenus = [];
  let value = "";
  const onDaySelected = () => {
    dataUpdate.promotionDays = dataUpdate.promotionDays || "";
    if (dataUpdate.promotionDays.length > 0) {
      return daysSelected = JSON.parse(dataUpdate.promotionDays);
    }
    if (dataUpdate.promotionDays.length <= 0) {
      return daysSelected = days.map((e) => {
        return {
          idDia: e.idDia,
          diaSemana: e.diaSemana,
          descripcion: e.descripcion,
          horaInicio: "00:00",
          horaFin: "23:59",
          checked: false
        };
      });
    }
  };
  const onRemove = (id) => {
    promotionMenus = promotionMenus.filter((e) => e.menuId !== id);
    promotionMenus = [...promotionMenus];
  };
  let productColumns = [
    {
      field: "s3ObjectUrl",
      title: "Imagen",
      formatter: "image",
      hozAlign: "center",
      resizable: false,
      headerSort: false,
      formatterParams: { height: "50px", width: "70px" }
    },
    {
      rezisable: true,
      editable: "never",
      field: "title",
      title: "Menu",
      with: 300,
      maxWith: 500
    },
    {
      cellClick: (e, cell) => {
        onRemove(cell.getData().menuId);
        cell.getRow().delete();
      },
      rezisable: true,
      with: 100,
      formatter: "buttonCross",
      hozAlign: "center",
      title: "Opción"
    }
  ];
  const getPromotionMenu = (id) => {
    showLoader();
    let params = JSON.stringify({ tipo: 1 });
    PromotionMenuService.get(id, params).then((response) => {
      if (response) {
        promotionMenus = response["promotionMenus"];
      }
    }).finally(() => {
      hideLoader();
    });
  };
  const onModalClose = () => {
    daysSelected = [];
    promotionMenus = [];
    usePromotionStore.update((state) => ({
      ...state,
      isOpen: false,
      dataUpdate: {
        id: 0,
        codEstab: "",
        description: "",
        startDate: "",
        endDate: "",
        promotionDays: ""
      }
    }));
  };
  usePromotionStore.subscribe((values) => {
    dataUpdate = values.dataUpdate;
    establecimientos = values.establecimientos;
    days = values.days;
    if (days.length > 0) {
      onDaySelected();
      getPromotionMenu(dataUpdate.id);
    }
  });
  $$result.css.add(css);
  $$unsubscribe_usePromotionStore();
  return `${$usePromotionStore.isOpen ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: $usePromotionStore.isOpen,
      iconTitle: "ti-plus",
      title: "Nueva promoción",
      size: "modal-lg modal-dialog-scrollable",
      onClosed: () => onModalClose()
    },
    {},
    {
      default: () => {
        return `<div class="modal-body"><div class="row"><div class="col-xl-6 col-lg-6 col-md-6 col-sm-12"><div class="form-group"><label for="codEstab" data-svelte-h="svelte-1kggrfz">Establecimiento</label> <select class="form-control form-control-lg" id="codEstab">${each(establecimientos, (item) => {
          return `<option${add_attribute("value", item.codEstab, 0)}>${escape(item.nombreComercial)} </option>`;
        })}</select></div></div> <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12"><div class="form-group"><label for="description" data-svelte-h="svelte-4yvg3t">Descripción</label> <input type="text" class="form-control form-control-lg" id="description" placeholder=""${add_attribute("value", dataUpdate.description, 0)}></div></div></div>  <div class="row"><div class="col-xl-6 col-lg-6 col-md-6 col-sm-12"><div class="form-group"><label for="description" data-svelte-h="svelte-1hvzy1">Inicio</label> <input${add_attribute("max", dataUpdate.endDate, 0)} type="date" class="form-control form-control-lg" id="description"${add_attribute("value", dataUpdate.startDate, 0)}></div></div> <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12"><div class="form-group"><label for="description" data-svelte-h="svelte-1bfpdfp">Fin</label> <input${add_attribute("min", dataUpdate.startDate, 0)} type="date" class="form-control form-control-lg" id="description"${add_attribute("value", dataUpdate.endDate, 0)}></div></div></div> <div class="row"><div class="col-xl-12 col-lg-12 col-md-12 col-sm-12"><div class="custom-input svelte-1o3nute"><label for="file-input" class="hover-effect svelte-1o3nute" data-svelte-h="svelte-59zdwq">Haz clic o arrastra un archivo aquí</label> <input type="file" id="file-input" accept=".jpg, .jpeg, .png" class="svelte-1o3nute"></div> ${``}</div></div> <div class="row mt-3">${each(daysSelected, (item) => {
          return `<div class="col-4"><div class="checkbox icheck-primary"><input type="checkbox" id="${"primary_" + escape(item.idDia, true)}"${add_attribute("checked", item.checked, 1)}> <label for="${"primary_" + escape(item.idDia, true)}" class="svelte-1o3nute">${escape(item.descripcion)}</label> </div></div> <div class="col-4"><div class="form-group"><input type="text" min="00:00" placeholder="00:00" ${!item.checked ? "disabled" : ""} class="form-control"${add_attribute("value", item.horaInicio, 0)}> </div></div> <div class="col-4"><div class="form-group"><input type="text" max="23:59" placeholder="00:00" ${!item.checked ? "disabled" : ""} class="form-control"${add_attribute("value", item.horaFin, 0)}></div> </div>`;
        })}</div> <div class="row mt-4"><div class="col-8 col-md-8 col-sm-12"><div class="form-group input-group-lg">${validate_component(AdvancedSearch, "AdvancedSearch").$$render($$result, { value, placeholder }, {}, {})} ${itemSearch.length > 0 ? `<div class="floating-results list-group">${each(itemSearch, (item) => {
          return `<a${add_attribute("href", null, 0)} class="list-group-item"><img${add_attribute("src", item.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png", 0)} width="70" height="50" alt=""> ${escape(item.title)}</a>`;
        })}</div>` : ``}</div></div> <div class="col-4 col-md-4 col-sm-12"></div></div> <div class="row mt-2"><div class="col-12">${validate_component(GridForItem, "GridForItem").$$render(
          $$result,
          {
            arrayData: promotionMenus,
            columns: productColumns
          },
          {},
          {}
        )}</div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-jprqfk"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-196of2o">× Cerrar</button></div></div>`;
      }
    }
  )}` : ``}`;
});
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let promotions = [];
  let establecimientos = [];
  let unsuscribe = usePromotionStore.subscribe((values) => {
    promotions = values.promotions;
    establecimientos = values.establecimientos;
    values.codEstab;
  });
  onDestroy(() => {
    unsuscribe();
  });
  return `<div class="row mt-2"><div class="col-6"><button type="button" class="btn btn-info" data-svelte-h="svelte-1hys6uw"><i class="ti-plus"></i> Registrar Promoción</button></div></div> <div class="row"><div class="col-xl-6 col-lg-6 col-md-6 col-sm-12"></div> <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12"><div class="form-group"><select class="form-control form-control-lg" id="codEstab">${each(establecimientos, (item) => {
    return `<option${add_attribute("value", item.codEstab, 0)}>${escape(item.nombreComercial)} </option>`;
  })}</select></div></div></div> ${promotions.length > 0 ? `<div class="table-responsive"><table class="table table-hover"><thead class="thead-light" data-svelte-h="svelte-1rssxvo"><tr><th scope="col">Imagen</th> <th scope="col">Promoción</th> <th scope="col">Fecha Inicio</th> <th scope="col">Fecha Fin</th> <th scope="col">Opción</th></tr></thead> <tbody>${each(promotions, (item) => {
    return `<tr><th scope="row"><img${add_attribute("src", item.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png", 0)} width="70" class="rounded" alt=""></th> <th scope="row">${escape(item.description)}</th> <td>${escape(item.startDate)}</td> <td>${escape(item.endDate)}</td> <td><button type="button" class="btn btn-outline-primary" data-svelte-h="svelte-4fz9ra"><i class="ti-plus"></i> Administrar</button></td> </tr>`;
  })}</tbody></table></div>` : `<div class="row" data-svelte-h="svelte-fwjv4c"><div class="col-12"><div class="alert alert-danger" role="alert"><center>No se encontraron registros</center></div></div></div>`} ${validate_component(Add$2, "Add").$$render($$result, {}, {}, {})}`;
});
const Promotions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ` ${validate_component(List, "List").$$render($$result, {}, {}, {})} ${validate_component(Add, "Add").$$render($$result, {}, {}, {})}`;
});
const TabsProduct = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let items = [
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Productos",
      value: 1,
      component: Items
    },
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Menus",
      value: 2,
      component: Menus
    },
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Promociones",
      value: 3,
      component: Promotions
    },
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Ingredientes",
      value: 4,
      component: Ingredient
    }
  ];
  return `<div class="card"><div class="card-body">${validate_component(Tabs, "Tabs").$$render($$result, { items }, {}, {})}</div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Breadcrumbs, "Breadcrumbs").$$render(
    $$result,
    {
      title: "Administrar Productos",
      action: "",
      openNew: null
    },
    {},
    {}
  )} ${validate_component(TabsProduct, "TabsProduct").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
