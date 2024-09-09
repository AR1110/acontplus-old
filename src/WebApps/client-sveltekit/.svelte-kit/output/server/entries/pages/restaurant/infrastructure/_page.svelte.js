import { c as create_ssr_component, v as validate_component, b as add_attribute, d as each, e as escape } from "../../../../chunks/ssr.js";
import { T as Tabs, B as Breadcrumbs } from "../../../../chunks/Tabs.js";
/* empty css                                                           */
import { c as client } from "../../../../chunks/axiosClient.js";
import { M as Modal } from "../../../../chunks/Modal.js";
import "toastr";
import { s as showLoader, p as productionAreaService, h as hideLoader, e as estabAsignService, t as toast } from "../../../../chunks/estab-asign-service.js";
import "sweetalert2";
const Add$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { openNew } = $$props;
  let { modalClosed } = $$props;
  let { data = {} } = $$props;
  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
  if ($$props.openNew === void 0 && $$bindings.openNew && openNew !== void 0)
    $$bindings.openNew(openNew);
  if ($$props.modalClosed === void 0 && $$bindings.modalClosed && modalClosed !== void 0)
    $$bindings.modalClosed(modalClosed);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${openNew ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: openNew,
      iconTitle: data.id > 0 ? "ti-sync" : "ti-plus",
      title: data.id ? "Actualizar" : "Registrar",
      onClosed: () => onModalClose()
    },
    {},
    {
      default: () => {
        return `<form autocomplete="off"><div class="modal-body"><div class="form-group"><label for="descripcion" data-svelte-h="svelte-p5anxs">Descripción <span class="text-danger">*</span></label> <input type="text" name="description" id="description" class="form-control border-select"${add_attribute("value", data.description, 0)}></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-1ik12wk">Código <span class="text-danger">*</span></label> <input type="text" name="code" id="code" class="form-control border-select"${add_attribute("value", data.code, 0)}></div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-1354xfx"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-1eej5u1">× Cerrar</button></div></form>`;
      }
    }
  )}` : ``}`;
});
const List$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isNew = false;
  let productionAreas = [];
  let edit = {};
  const reloadList = () => {
    get2();
  };
  const get2 = () => {
    showLoader();
    productionAreaService.get().then((response) => {
      hideLoader();
      if (response) {
        productionAreas = response;
      }
    });
  };
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  if ($$props.reloadList === void 0 && $$bindings.reloadList && reloadList !== void 0)
    $$bindings.reloadList(reloadList);
  return `<div class="card"><div class="card-body">${productionAreas.length > 0 ? `<div class="table-responsive"><table class="table"><caption data-svelte-h="svelte-1czmamk">Áreas de Produción</caption> <thead data-svelte-h="svelte-196pv94"><tr><th></th> <th>N°</th> <th>Código</th> <th>Descripcion</th> <th>Estado</th></tr></thead> <tbody>${each(productionAreas, (item, index) => {
    return `<tr><td> <a href="javascript:void(0)" class="btn btn-sm btn-success" data-svelte-h="svelte-idptaj"><i class="fas fa-edit"></i></a>  <a href="javascript:void(0)" class="btn btn-sm btn-danger" data-svelte-h="svelte-1mn2deg"><i class="fas fa-trash"></i> </a></td> <td>${escape(index + 1)}</td> <td>${escape(item.code)}</td> <td>${escape(item.description)}</td> <td>${item.enabled ? `<span class="badge badge-success" data-svelte-h="svelte-1px8qmb">Activo</span> ` : `<span class="badge badge-danger" data-svelte-h="svelte-u5kgu8">Inactivo</span> `}</td> </tr>`;
  })}</tbody></table></div>` : `<h5 data-svelte-h="svelte-1h5iwzf">No hay registros</h5>`}</div></div> ${validate_component(Add$3, "Add").$$render(
    $$result,
    {
      openNew: isNew,
      modalClosed: () => closeModal(),
      data: edit
    },
    {},
    {}
  )}`;
});
const ProductionArea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isNew = false;
  let reloadList;
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` <div class="row mt-2 mb-2"><div class="col-6"><button type="button" class="btn btn-info" data-svelte-h="svelte-1afv5ib"><i class="ti-plus"></i> Registrar Área</button></div></div> ${validate_component(List$3, "List").$$render(
      $$result,
      { reloadList },
      {
        reloadList: ($$value) => {
          reloadList = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Add$3, "Add").$$render(
      $$result,
      {
        openNew: isNew,
        modalClosed: () => closeModal()
      },
      {},
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const url$2 = "Restaurant/Floors/";
async function get$2() {
  return await client.get(url$2 + "Get").then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }, (err) => {
    console.log(err);
    return null;
  });
}
async function getByCode$1(codEstab) {
  return await client.get(url$2 + "GetByCode/" + codEstab).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }, (err) => {
    console.log(err);
    return null;
  });
}
async function post$2(data) {
  return await client.post(url$2, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (err) => {
    let { status, data: data2 } = err.response;
    return { status, data: data2 };
  });
}
async function put$2(id, data) {
  return await client.put(url$2 + id, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (err) => {
    let { status, data: data2 } = err.response;
    return { status, data: data2 };
  });
}
async function remove$2(id) {
  return await client.delete(url$2 + id).then((response) => {
    let { status, data } = response;
    return { status, data };
  }, (err) => {
    let { status, data } = err.response;
    return { status, data };
  });
}
const floorService = {
  get: get$2,
  getByCode: getByCode$1,
  post: post$2,
  put: put$2,
  remove: remove$2
};
const Add$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { openNew } = $$props;
  let { modalClosed } = $$props;
  let { data = {} } = $$props;
  let establecimientos = [];
  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
  if ($$props.openNew === void 0 && $$bindings.openNew && openNew !== void 0)
    $$bindings.openNew(openNew);
  if ($$props.modalClosed === void 0 && $$bindings.modalClosed && modalClosed !== void 0)
    $$bindings.modalClosed(modalClosed);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${openNew ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: openNew,
      iconTitle: data.id > 0 ? "ti-sync" : "ti-plus",
      title: data.id > 0 ? "Actualizar" : "Registrar",
      onClosed: () => onModalClose()
    },
    {},
    {
      default: () => {
        return `<form autocomplete="off"><div class="modal-body"><div class="form-group"><label for="tipo" data-svelte-h="svelte-1w4uhje">Establecimiento.: <span class="text-danger">*</span></label> <select name="establecimiento" id="establecimiento" class="form-control border-select">${each(establecimientos, (item) => {
          return `<option${add_attribute("value", item.codEstab, 0)}>${escape(item.nombreComercial)} </option>`;
        })}</select></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-p5anxs">Descripción <span class="text-danger">*</span></label> <input type="text" name="description" id="description" class="form-control border-select"${add_attribute("value", data.description, 0)}></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-1ik12wk">Código <span class="text-danger">*</span></label> <input type="text" name="code" id="code" class="form-control border-select"${add_attribute("value", data.code, 0)}></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-1it92on">Capacidad <span class="text-danger">*</span></label> <input type="number" name="capacity" id="capacity" class="form-control border-select"${add_attribute("value", data.capacity, 0)}></div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-1354xfx"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-1eej5u1">× Cerrar</button></div></form>`;
      }
    }
  )}` : ``}`;
});
const List$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { floors = [] } = $$props;
  let { reloadList } = $$props;
  let edit = {};
  let isNew = false;
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  if ($$props.floors === void 0 && $$bindings.floors && floors !== void 0)
    $$bindings.floors(floors);
  if ($$props.reloadList === void 0 && $$bindings.reloadList && reloadList !== void 0)
    $$bindings.reloadList(reloadList);
  return `<div class="card"><div class="card-body">${floors.length > 0 ? `<div class="table-responsive"><table class="table"><caption data-svelte-h="svelte-1wr511a">Pisos</caption> <thead data-svelte-h="svelte-y6h3go"><tr><th></th> <th>N°</th> <th>Código</th> <th>Descripcion</th> <th>Capacidad</th> <th>Estado</th></tr></thead> <tbody>${each(floors, (item, index) => {
    return `<tr><td> <a href="javascript:void(0)" class="btn btn-sm btn-success" data-svelte-h="svelte-idptaj"><i class="fas fa-edit"></i></a>  <a href="javascript:void(0)" class="btn btn-sm btn-danger" data-svelte-h="svelte-1mn2deg"><i class="fas fa-trash"></i> </a></td> <td>${escape(index + 1)}</td> <td>${escape(item.code)}</td> <td>${escape(item.description)}</td> <td>${escape(item.capacity)}</td> <td>${item.enabled ? `<span class="badge badge-success" data-svelte-h="svelte-qji68g">Activo</span> ` : `<span class="badge badge-danger" data-svelte-h="svelte-1g80mal">Inactivo</span> `}</td> </tr>`;
  })}</tbody></table></div>` : `<h5 data-svelte-h="svelte-1h5iwzf">No hay registros</h5>`}</div></div> ${validate_component(Add$2, "Add").$$render(
    $$result,
    {
      openNew: isNew,
      modalClosed: () => closeModal(),
      data: edit
    },
    {},
    {}
  )}`;
});
const SelectEstablecimiento = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { establecimientos } = $$props;
  let { changeEstab } = $$props;
  if ($$props.establecimientos === void 0 && $$bindings.establecimientos && establecimientos !== void 0)
    $$bindings.establecimientos(establecimientos);
  if ($$props.changeEstab === void 0 && $$bindings.changeEstab && changeEstab !== void 0)
    $$bindings.changeEstab(changeEstab);
  return `<div class="row"><div class="col-md-6" data-svelte-h="svelte-z9ke81">Establecimientos</div> <div class="col-md-6 align-self-center text-right"><div class="d-flex justify-content-end align-items-center"><select class="form-control" id="select">${each(establecimientos, (item) => {
    return `<option${add_attribute("value", item.codEstab, 0)}>${escape(item.nombreComercial)}</option>`;
  })}</select></div></div></div>`;
});
const Floor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let establecimientos = [];
  let codEstab = "";
  let floors = [];
  let isNew = false;
  const getCodEstab = () => {
    showLoader();
    estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      hideLoader();
      if (response) {
        establecimientos = response;
        codEstab = establecimientos[0].codEstab;
        getFloors(codEstab);
      }
    });
  };
  let getFloors = (codEstab2) => {
    if (!isExistsCodEstab(getCodEstab)) {
      return toast({
        type: "warning",
        message: "Seleccione un establecimiento"
      });
    }
    showLoader();
    floorService.getByCode(codEstab2).then((response) => {
      hideLoader();
      if (response) {
        floors = response;
      }
    });
  };
  const isExistsCodEstab = (codEstab2) => {
    if (codEstab2 === void 0 || codEstab2 === null || codEstab2 === "") {
      return false;
    }
    return true;
  };
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  const reloadList = () => {
    getCodEstab();
  };
  const changeEstab = (codEstab2) => {
    getFloors(codEstab2);
  };
  return ` <div class="row mt-2 mb-2"><div class="col-6"><button type="button" class="btn btn-info" data-svelte-h="svelte-tpbhs3"><i class="ti-plus"></i> Registrar Piso</button></div></div> ${validate_component(SelectEstablecimiento, "SelectEstablecimiento").$$render($$result, { establecimientos, changeEstab }, {}, {})} ${validate_component(List$2, "List").$$render($$result, { reloadList, floors }, {}, {})} ${validate_component(Add$2, "Add").$$render(
    $$result,
    {
      openNew: isNew,
      modalClosed: () => closeModal()
    },
    {},
    {}
  )}`;
});
const url$1 = "Restaurant/Rooms/";
async function get$1() {
  return await client.get(url$1 + "Get").then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }, (err) => {
    console.log(err);
    return null;
  });
}
async function getByCode(CodEstab) {
  return await client.get(url$1 + "GetByCode/" + CodEstab).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }, (err) => {
    console.log(err);
    return null;
  });
}
async function post$1(data) {
  return await client.post(url$1, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (err) => {
    let { status, data: data2 } = err.response;
    return { status, data: data2 };
  });
}
async function put$1(id, data) {
  return await client.put(url$1 + id, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (err) => {
    let { status, data: data2 } = err.response;
    return { status, data: data2 };
  });
}
async function remove$1(id) {
  return await client.delete(url$1 + id).then((response) => {
    let { status, data } = response;
    return { status, data };
  }, (err) => {
    let { status, data } = err.response;
    return { status, data };
  });
}
const roomService = {
  get: get$1,
  getByCode,
  post: post$1,
  put: put$1,
  remove: remove$1
};
const Add$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { openNew } = $$props;
  let { modalClosed } = $$props;
  let { data = {} } = $$props;
  let { floors = [] } = $$props;
  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
  if ($$props.openNew === void 0 && $$bindings.openNew && openNew !== void 0)
    $$bindings.openNew(openNew);
  if ($$props.modalClosed === void 0 && $$bindings.modalClosed && modalClosed !== void 0)
    $$bindings.modalClosed(modalClosed);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.floors === void 0 && $$bindings.floors && floors !== void 0)
    $$bindings.floors(floors);
  return `${openNew ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: openNew,
      iconTitle: data.id > 0 ? "ti-sync" : "ti-plus",
      title: data.id > 0 ? "Actualizar sala" : "Registrar sala",
      onClosed: () => onModalClose()
    },
    {},
    {
      default: () => {
        return `<form autocomplete="off"><div class="modal-body"><div class="form-group"><label for="tipo" data-svelte-h="svelte-1xo1q6w">Piso: <span class="text-danger">*</span></label> <select name="establecimiento" id="establecimiento" class="form-control border-select"><option disabled value="seleccione ítem" data-svelte-h="svelte-1683bm7">seleccione ítem</option>${each(floors, (item) => {
          return `<option${add_attribute("value", item.id, 0)}>${escape(item.description)} </option>`;
        })}</select></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-1vnzyit">Descripción <span class="text-danger">*</span></label> <input type="text" name="description" id="description" class="form-control border-select"${add_attribute("value", data.description, 0)}></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-136x0p3">Código <span class="text-danger">*</span></label> <input type="text" name="code" id="code" class="form-control border-select"${add_attribute("value", data.code, 0)}></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-1fns866">Capacidad <span class="text-danger">*</span></label> <input type="number" name="capacity" id="capacity" class="form-control border-select"${add_attribute("value", data.capacity, 0)}></div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-13cpenm"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-196of2o">× Cerrar</button></div></form>`;
      }
    }
  )}` : ``}`;
});
const List$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { rooms = [] } = $$props;
  let edit = {};
  let { reloadList } = $$props;
  let isNew = false;
  let { floors = [] } = $$props;
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  if ($$props.rooms === void 0 && $$bindings.rooms && rooms !== void 0)
    $$bindings.rooms(rooms);
  if ($$props.reloadList === void 0 && $$bindings.reloadList && reloadList !== void 0)
    $$bindings.reloadList(reloadList);
  if ($$props.floors === void 0 && $$bindings.floors && floors !== void 0)
    $$bindings.floors(floors);
  return `<div class="card"><div class="card-body">${rooms.length > 0 ? `<div class="table-responsive"><table class="table"><caption data-svelte-h="svelte-6n1qw8">Salas</caption> <thead data-svelte-h="svelte-y6h3go"><tr><th></th> <th>N°</th> <th>Código</th> <th>Descripcion</th> <th>Capacidad</th> <th>Estado</th></tr></thead> <tbody>${each(rooms, (item, index) => {
    return `<tr><td> <a href="javascript:void(0)" class="btn btn-sm btn-success" data-svelte-h="svelte-idptaj"><i class="fas fa-edit"></i></a>  <a href="javascript:void(0)" class="btn btn-sm btn-danger" data-svelte-h="svelte-1mn2deg"><i class="fas fa-trash"></i> </a></td> <td>${escape(index + 1)}</td> <td>${escape(item.code)}</td> <td>${escape(item.floor.description)} - ${escape(item.description)}</td> <td>${escape(item.capacity)}</td> <td>${item.enabled ? `<span class="badge badge-success" data-svelte-h="svelte-1px8qmb">Activo</span> ` : `<span class="badge badge-danger" data-svelte-h="svelte-u5kgu8">Inactivo</span> `}</td> </tr>`;
  })}</tbody></table></div>` : `<h5 data-svelte-h="svelte-1h5iwzf">No hay registros</h5>`}</div></div> ${validate_component(Add$1, "Add").$$render(
    $$result,
    {
      openNew: isNew,
      modalClosed: () => closeModal(),
      data: edit,
      floors
    },
    {},
    {}
  )}`;
});
const Room = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let establecimientos = [];
  let rooms = [];
  let floors = [];
  let isNew = false;
  let codEstab = "";
  const getRooms = (codEstab2) => {
    if (!isExistCodEstab(codEstab2))
      return;
    showLoader();
    roomService.getByCode(codEstab2).then((response) => {
      hideLoader();
      if (response) {
        rooms = response;
      }
    });
  };
  const isExistCodEstab = (codEstab2) => {
    if (codEstab2 === void 0 || codEstab2 === null || codEstab2 === "") {
      return false;
    }
    return true;
  };
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  const reloadList = () => {
    getRooms(codEstab);
  };
  const changeEstab = (codEstab2) => {
    getRooms(codEstab2);
  };
  return ` <div class="row mt-2 mb-2"><div class="col-6"><button type="button" class="btn btn-info" data-svelte-h="svelte-1r8hpfx"><i class="ti-plus"></i> Registrar Sala</button></div></div> ${validate_component(SelectEstablecimiento, "SelectEstablecimiento").$$render($$result, { establecimientos, changeEstab }, {}, {})} ${validate_component(List$1, "List").$$render($$result, { reloadList, rooms, floors }, {}, {})} ${validate_component(Add$1, "Add").$$render(
    $$result,
    {
      openNew: isNew,
      modalClosed: () => closeModal(),
      floors
    },
    {},
    {}
  )}`;
});
const url = "Restaurant/Tables/";
async function get(codEstab) {
  return await client.get(`${url}GetByCode/${codEstab}`).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }, (error) => {
    console.log(error);
    return null;
  });
}
async function post(data) {
  return await client.post(url, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
async function put(id, data) {
  return await client.put(url + id, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (error) => {
    let { status, data: data2 } = error.response;
    return { status, data: data2 };
  });
}
async function remove(id) {
  return await client.delete(url + id).then((response) => {
    let { status, data } = response;
    return { status, data };
  }, (error) => {
    let { status, data } = error.response;
    return { status, data };
  });
}
const tableService = {
  get,
  post,
  put,
  remove
};
const Add = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { openNew } = $$props;
  let { modalClosed } = $$props;
  let { data = {} } = $$props;
  let { rooms = [] } = $$props;
  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
  if ($$props.openNew === void 0 && $$bindings.openNew && openNew !== void 0)
    $$bindings.openNew(openNew);
  if ($$props.modalClosed === void 0 && $$bindings.modalClosed && modalClosed !== void 0)
    $$bindings.modalClosed(modalClosed);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.rooms === void 0 && $$bindings.rooms && rooms !== void 0)
    $$bindings.rooms(rooms);
  return `${openNew ? `${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      open: openNew,
      iconTitle: data.id > 0 ? "ti-sync" : "ti-plus",
      title: data.id > 0 ? "Actualizar mesa" : "Registrar mesa",
      onClosed: () => onModalClose()
    },
    {},
    {
      default: () => {
        return `<form autocomplete="off"><div class="modal-body"><div class="form-group"><label for="tipo" data-svelte-h="svelte-zknmlu">Sala: <span class="text-danger">*</span></label> <select name="room" id="room" class="form-control border-select"><option disabled value="seleccione ítem" data-svelte-h="svelte-1683bm7">seleccione ítem</option>${each(rooms, (item) => {
          return `<option${add_attribute("value", item.id, 0)}>${escape(`${item.floor.description} - ${item.description}`)} </option>`;
        })}</select></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-1vnzyit">Descripción <span class="text-danger">*</span></label> <input type="text" name="description" id="description" class="form-control border-select"${add_attribute("value", data.description, 0)}></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-12bz7g2">Número de mesa <span class="text-danger">*</span></label> <input type="number" name="numberTable" id="numberTable" class="form-control border-select"${add_attribute("value", data.numberTable, 0)}></div> <div class="form-group"><label for="descripcion" data-svelte-h="svelte-1fns866">Capacidad <span class="text-danger">*</span></label> <input type="number" name="capacity" id="capacity" class="form-control border-select"${add_attribute("value", data.capacity, 0)}></div></div> <div class="modal-footer"><button type="submit" class="btn btn-success" data-svelte-h="svelte-13cpenm"><i class="ti-save"></i> Guardar</button> <button type="button" class="btn btn-dark" data-svelte-h="svelte-196of2o">× Cerrar</button></div></form>`;
      }
    }
  )}` : ``}`;
});
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES");
}
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { reloadList } = $$props;
  let { tables = [] } = $$props;
  let { rooms = [] } = $$props;
  let edit = {};
  let isNew = false;
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  if ($$props.reloadList === void 0 && $$bindings.reloadList && reloadList !== void 0)
    $$bindings.reloadList(reloadList);
  if ($$props.tables === void 0 && $$bindings.tables && tables !== void 0)
    $$bindings.tables(tables);
  if ($$props.rooms === void 0 && $$bindings.rooms && rooms !== void 0)
    $$bindings.rooms(rooms);
  return `<div class="card"><div class="card-body">${tables.length > 0 ? `<div class="table-responsive"><table class="table"><caption data-svelte-h="svelte-x5umdn">Mesas</caption> <thead data-svelte-h="svelte-z6lt14"><tr><th></th> <th>N°</th> <th>Descripcion</th> <th>N° de mesa</th> <th>Capacidad</th> <th>Fecha registro</th> <th>Estado</th></tr></thead> <tbody>${each(tables, (item, index) => {
    return `<tr><td> <a href="javascript:void(0)" class="btn btn-sm btn-success" data-svelte-h="svelte-10868aj"><i class="fas fa-edit"></i></a>  <a href="javascript:void(0)" class="btn btn-sm btn-danger" data-svelte-h="svelte-1qgjv2u"><i class="fas fa-trash"></i> </a></td> <td>${escape(index + 1)}</td> <td>${escape(item.room.description)} - ${escape(item.description)}</td> <td>${escape(item.numberTable)}</td> <td>${escape(item.capacity)}</td> <td>${escape(formatDateTime(item.createdAt))}</td> <td>${item.enabled ? `<span class="badge badge-success" data-svelte-h="svelte-1px8qmb">Activo</span>` : `<span class="badge badge-danger" data-svelte-h="svelte-u5kgu8">Inactivo</span>`}</td> </tr>`;
  })}</tbody></table></div>` : `<h5 data-svelte-h="svelte-1h5iwzf">No hay registros</h5>`}</div></div> ${validate_component(Add, "Add").$$render(
    $$result,
    {
      openNew: isNew,
      modalClosed: () => closeModal(),
      data: edit,
      rooms
    },
    {},
    {}
  )}`;
});
const Table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let establecimientos = [];
  let codEstab = "";
  let tables = [];
  let rooms = [];
  let isNew = false;
  const getTable = (codEstab2) => {
    showLoader();
    tableService.get(codEstab2).then((response) => {
      hideLoader();
      if (response) {
        tables = response;
      }
    });
  };
  const closeModal = () => {
    isNew = false;
    reloadList();
  };
  const reloadList = () => {
    getTable(codEstab);
  };
  const changeEstab = (codEstab2) => {
    getTable(codEstab2);
  };
  return ` <div class="row mt-2 mb-2"><div class="col-6"><button type="button" class="btn btn-info" data-svelte-h="svelte-16dbj58"><i class="ti-plus"></i> Registrar Mesa</button></div></div> ${validate_component(SelectEstablecimiento, "SelectEstablecimiento").$$render($$result, { establecimientos, changeEstab }, {}, {})} ${validate_component(List, "List").$$render($$result, { reloadList, tables, rooms }, {}, {})} ${validate_component(Add, "Add").$$render(
    $$result,
    {
      openNew: isNew,
      modalClosed: () => closeModal(),
      rooms
    },
    {},
    {}
  )}`;
});
const TabsInfra = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let items = [
    {
      label: "Pisos",
      icon: "fa fa-building",
      value: 1,
      component: Floor
    },
    {
      label: "Salas",
      icon: "fa fa-building",
      value: 2,
      component: Room
    },
    {
      label: "Areas de Produccion",
      icon: "fa fa-kitchen-set",
      value: 3,
      component: ProductionArea
    },
    {
      label: "Mesas",
      icon: "fa fa-table",
      value: 4,
      component: Table
    }
  ];
  return `${validate_component(Tabs, "Tabs").$$render($$result, { items }, {}, {})}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Breadcrumbs, "Breadcrumbs").$$render(
    $$result,
    {
      title: "Infraestructura",
      action: "",
      openNew: null
    },
    {},
    {}
  )} <div class="card"><div class="card-body">${validate_component(TabsInfra, "TabsInfra").$$render($$result, {}, {}, {})}</div></div>`;
});
export {
  Page as default
};
