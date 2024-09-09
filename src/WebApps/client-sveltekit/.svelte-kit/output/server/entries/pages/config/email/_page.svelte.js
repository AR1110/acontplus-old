import { c as create_ssr_component, b as add_attribute, v as validate_component } from "../../../../chunks/ssr.js";
import "../../../../chunks/axiosClient.js";
import "sweetalert2";
const Switch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { checked = false } = $$props;
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  return `<div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="checked"${add_attribute("checked", checked, 1)}> <label class="custom-control-label" for="checked"></label></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let data = {
    idEmailConfig: 0,
    enableSsl: false,
    from: "",
    host: "",
    password: "",
    port: 0
  };
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="row mt-3 mb-3"><div class="col-6"><div class="card card-body"><h4 class="card-title" data-svelte-h="svelte-zhadaq">Parametros Email</h4> <h5 class="card-subtitle" data-svelte-h="svelte-5o4eia"><span class="text-danger">*</span> Ingrese todos los campos requeridos</h5> <hr> <div class="row"><div class="col-sm-12 col-xs-12"><form autocomplete="off"><div class="form-group"><label for="EnableSsl" data-svelte-h="svelte-310p49">EnableSsl <span class="text-danger">*</span></label> ${validate_component(Switch, "Switch").$$render(
      $$result,
      { checked: data.enableSsl },
      {
        checked: ($$value) => {
          data.enableSsl = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="form-group"><label for="from" data-svelte-h="svelte-yqzk8r">From <span class="text-danger">*</span></label> <input type="text" class="form-control" id="from" placeholder="..." required${add_attribute("value", data.from, 0)}></div> <div class="form-group"><label for="host" data-svelte-h="svelte-1ydc5fr">Host <span class="text-danger">*</span></label> <input type="text" class="form-control" id="host" placeholder="..." required${add_attribute("value", data.host, 0)}></div> <div class="form-group"><label for="password" data-svelte-h="svelte-yl4eoz">Password <span class="text-danger">*</span></label> <input type="text" class="form-control" id="password" placeholder="..." required${add_attribute("value", data.password, 0)}></div> <div class="form-group"><label for="port" data-svelte-h="svelte-i6a7z7">port <span class="text-danger">*</span></label> <input type="text" class="form-control" id="port" placeholder="..." required${add_attribute("value", data.port, 0)}></div> <button type="submit" class="btn btn-success" data-svelte-h="svelte-o1snjf"><i class="ti-save"></i> Guardar</button></form></div></div></div></div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
