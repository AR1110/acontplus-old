<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$core/components/Modal.svelte";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import { showLoader, hideLoader } from "$core/utils/loading-spinner";
  import toast from "$core/utils/toast";
  import type { Vehicle } from "$core/interfaces/mechanical/vehicle";
  import type { Customer } from "$core/interfaces/customer/customer";
  import { SupportService } from "$core/services/mechanical/support-service";
  import { VehicleService } from "$core/services/mechanical/vehicle-service";
  import { CustomerService } from "$core/services/customer/customer-service";
  import { supportStore } from "$routes/Mechanical/Store/support.store";

  let support;
  let vehicle;
  let customer;
  let parameter = { establecimientoId: 0, sequence: "" };
  let users = [];
  let dataSearch = [];
  let establishments = [];
  let emissionPoints = [];
  let emissionPointsSelected = [];
  let vehicleTypes = [];
  let countrys = [];
  let idTypes = [];
  let customers = [];
  let emissionPointData = {};
  let paramValidation = [undefined, null, "", 0];
  let value = "";
  let valueCustomer = "";
  let isCustomerSelected = false;
  let placeholder = "Buscar Cliente o Vehículo";
  let placeholderCustomer = "Buscar Cliente";
  let disabled = true;
  let disabledCustomer = true;
  let hidden = true;
  let hiddenCustomer = true;
  let disguise = false;
  let cancel = false;
  let icon = "";

  onMount(() => {
    getDataForm();
  });

  supportStore.subscribe((values) => {
    (support = values.support),
      (vehicle = values.vehicle),
      (customer = values.customer),
      (parameter = values.parameter);
    getDataForm();
  });

  // GET FOR DATA
  function getDataForm() {
    SupportService.get(JSON.stringify({ tipo: 2 })).then((response) => {
      if (response) {
        emissionPoints = response["emissionPoints"];
        vehicleTypes = response["vehicleTypes"];
        countrys = response["countrys"];
        idTypes = response["idTypes"];
        users = response["users"];
        customer.idType = "04";
        if (support.id > 0) {
          parameter = parameter;
          emissionPointsSelected = emissionPoints.filter(
            (item) => item.establecimientoId === parameter.establecimientoId
          );
          disabledData(0);
        } else {
          establishments = response["establishments"];
          parameter.establecimientoId = establishments[0].establecimientoId;
          getDataEstablishments(parameter.establecimientoId);
        }
      }
    });
  }

  // CHANGE OF establishments CAPTUREP DATA
  const getDataEstablishments = (e) => {
    emissionPointsSelected = emissionPoints.filter(
      (item) => item.establecimientoId === e
    );
    support.puntoEmisionId = emissionPointsSelected[0].puntoEmisionId;
    getDataEmissionPoints(support.puntoEmisionId);
  };

  // CHANGE OF emissionPoints CAPTURED SEQUENCE
  const getDataEmissionPoints = (e) => {
    emissionPointData = emissionPointsSelected.filter(
      (item) => item.puntoEmisionId === e
    );
    parameter.sequence =
      emissionPointData[0].ptoEmi + "-" + emissionPointData[0].sequence;
  };

  // SEARCH THE VECICLES WITH CUSTOMER
  const onInput = async (e) => {
    value = e.target.value;
    dataSearch = [];
    let data = {};
    if (value.length < 3) return;
    data = {
      tipo: 4,
      textSearch: value,
    };
    SupportService.get(JSON.stringify(data)).then((response) => {
      if (response) {
        dataSearch = response["dataSeach"];
      }
    });
  };

  const onFocus = () => {};

  const onBlur = (e) => {
    if (!value) {
      dataSearch = [];
      value = "";
    }
  };

  // SEARCH THE  CUSTOMER
  const onInputCustomer = async (e) => {
    valueCustomer = e.target.value;
    customers = [];
    let data = {};
    if (!disabledCustomer) {
      if (customer.idType == "04") {
        if (valueCustomer.length == 13) {
          getRucSri(valueCustomer);
          valueCustomer = "";
          disabledCustomer = true;
          placeholderCustomer = "Buscar Cliente";
        }
      }
      if (customer.idType == "05") {
        if (valueCustomer.length == 10) {
          getCedulaSri(valueCustomer);
          valueCustomer = "";
          disabledCustomer = true;
          placeholderCustomer = "Buscar Cliente";
        }
      }
      return;
    }

    if (valueCustomer.length < 3) return;
    data = {
      textSearch: valueCustomer,
    };
    CustomerService.search(JSON.stringify(data)).then((response) => {
      if (response) {
        customers = response;
      }
    });
  };

  const onFocusCustomer = () => {};

  const onBlurCustomer = (e) => {
    if (!valueCustomer) {
      customers = [];
      valueCustomer = "";
    }
  };

  // CAPTURE DATA THE CUSTOMER
  const selectClient = (e) => {
    isCustomerSelected = true;
    vehicle.customerId = e.idCliente;
    customer.idType = e.codigoSri;
    customer.idCard = e.numeroIdentificacion;
    customer.businessName = e.nombreComercial;
    customer.tradeName = e.nombreFiscal;
    customer.email = e.correo;
    customer.telephone = e.telefono;
    customer.address = e.direccion;
    valueCustomer = "";
    customers = [];
  };

  // GET DATA THE SEARCH FOR IF
  const getDataSearch = (id) => {
    VehicleService.get(JSON.stringify({ tipo: 3, id })).then((response) => {
      if (response) {
        vehicle = response["vehicle"][0];
        customer = response["customer"][0];
        support.vehicleCompanyId = response["vehicle"][0].id;
        support.customerId = response["customer"][0].id;
        value = "";
        dataSearch = [];
        disabled = true;
        disguise = true;
        hidden = true;
        icon = "ti-plus";
      }
    });
  };

  // FUNCTION FOR DISABLED IMPUT
  const disabledData = (tipo) => {
    // Option update
    if (tipo == 0) {
      disabled = false;
      value = "";
      hidden = false;
      hiddenCustomer = true;
      disguise = false;
      cancel = true;
      valueCustomer = "";
    }

    //Option New
    if (tipo == 1) {
      disabled = false;
      vehicle = {} as Vehicle;
      customer = {} as Customer;
      value = "";
      hidden = false;
      hiddenCustomer = false;
      disguise = false;
      cancel = true;
      valueCustomer = "";
    }

    //Option more or less
    if (tipo == 3) {
      if (hidden) {
        icon = "ti-minus";
        hidden = false;
      } else {
        icon = "ti-plus";
        hidden = true;
      }
    }
    // Cancel
    if (tipo == 4) {
      if (vehicle.id > 0) {
        getDataSearch(vehicle.id);
        hidden = true;
        hiddenCustomer = true;
        cancel = false;
        value = "";
        valueCustomer = "";
        disabled = true;
        disabledCustomer = true;
      } else {
        vehicle = {} as Vehicle;
        customer = {} as Customer;
        hidden = true;
        hiddenCustomer = true;
        cancel = false;
        value = "";
        valueCustomer = "";
        disabled = true;
        disabledCustomer = true;
      }
    }

    // New Customer
    if (tipo == 5) {
      disabledCustomer = false;
      customer = {} as Customer;
      customers = [];
      valueCustomer = "";
      customer.idType = "04";
      placeholderCustomer = "Consultar Sri";
    }
  };

  // NEW CUSTOMER GET WITH API SRI
  const getRucSri = (idCard) => {
    showLoader();
    CustomerService.getRuc(idCard).then((response) => {
      hideLoader();
      if (response) {
        if (!response.razonSocial) {
          toast({ type: "warning", message: response.error });
          return;
        } else {
          customer.idCard = response.numeroRuc;
          customer.businessName = response.razonSocial;
          customer.tradeName = response.nombreComercial;
          customer.email = response.email;
          customer.address = response.direccion;
          customer.telephone = response.telefono;
        }
      }
    });
  };

  const getCedulaSri = (idCard) => {
    showLoader();
    CustomerService.getCedula(idCard).then((response) => {
      hideLoader();
      if (response) {
        if (!response.nombreCompleto) {
          toast({ type: "warning", message: response.error });
          return;
        } else {
          customer.idCard = response.identificacion;
          customer.businessName = response.nombreCompleto;
          customer.tradeName = response.nombreCompleto;
          customer.email = response.email;
          customer.address = response.direccion;
          customer.telephone = response.telefono;
        }
      }
    });
  };

  // Save
  const onSave = () => {
    if (!onValidate()) return;
    showLoader();
    SupportService.post({
      data: { vehicle, customer, support },
    }).then((response) => {
      hideLoader();
      if (response.code == 1) {
        toast({ type: "success", message: response.message });
        onModalClose();
        supportStore.get();
      } else {
        toast({ type: "warning", message: response.message });
      }
    });
  };

  // edit
  const onUpdate = () => {
    if (!onValidate()) return;
    showLoader();
    SupportService.put(support.id, {
      data: { vehicle, customer, support },
    }).then((response) => {
      hideLoader();
      if (response.code == 1) {
        toast({ type: "success", message: response.message });
        onModalClose();
        supportStore.get();
      } else {
        toast({ type: "warning", message: response.message });
      }
    });
  };

  const onValidate = () => {
    let isValid = true;
    try {
      // datos de la ficha
      if (paramValidation.includes(parameter.establecimientoId)) {
        toast({ type: "warning", message: "Seleccione el Establecimiento" });
        return;
      }

      if (paramValidation.includes(support.puntoEmisionId)) {
        toast({ type: "warning", message: "Seleccione el Punto de Emision" });
        return;
      }

      if (paramValidation.includes(support.date)) {
        toast({ type: "warning", message: "Seleccione la fecha " });
        return;
      }

      if (paramValidation.includes(support.userAssignedId)) {
        toast({ type: "warning", message: "Seleccione un Técnico Encargado " });
        return;
      }

      if (paramValidation.includes(support.obs)) {
        toast({ type: "warning", message: "Detalle el soporte a realizar " });
        return;
      }

      // datos del vehiculo
      if (paramValidation.includes(vehicle.vehicleTypeId)) {
        toast({ type: "warning", message: "Seleccione el tipo de Vehículo" });
        return;
      }

      if (paramValidation.includes(vehicle.countryId)) {
        toast({ type: "warning", message: "Selecccion el país" });
        return;
      }

      if (paramValidation.includes(vehicle.licensePlate)) {
        toast({ type: "warning", message: "Ingrese la Placa" });
        return;
      }

      if (paramValidation.includes(vehicle.brand)) {
        toast({ type: "warning", message: "Ingrese una marca" });
        return;
      }

      if (paramValidation.includes(vehicle.year)) {
        toast({ type: "warning", message: "Ingrese un año de fabricación" });
        return;
      }

      if (paramValidation.includes(vehicle.color)) {
        toast({ type: "warning", message: "Ingrese el color" });
        return;
      }

      if (paramValidation.includes(vehicle.engine)) {
        toast({ type: "warning", message: "Ingrese el Motor" });
        return;
      }

      if (paramValidation.includes(vehicle.chassis)) {
        toast({ type: "warning", message: "Ingrese el Chasis" });
        return;
      }
      if (paramValidation.includes(vehicle.cylindraje)) {
        toast({ type: "warning", message: "Ingrese el cilindraje" });
        return;
      }

      // datos del cliente
      if (paramValidation.includes(customer.idType)) {
        toast({
          type: "warning",
          message: "Ingrese el Tipo de Identificación",
        });
        return;
      }

      if (paramValidation.includes(customer.idCard)) {
        toast({ type: "warning", message: "Ingrese la Identificación" });
        return;
      }

      if (paramValidation.includes(customer.businessName)) {
        toast({ type: "warning", message: "Ingrese el nobre comercial" });
        return;
      }

      if (paramValidation.includes(customer.tradeName)) {
        toast({ type: "warning", message: "Ingrese el nombre fiscal" });
        return;
      }

      return isValid;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // CLOSE MODAL
  const onModalClose = () => {
    disabledData(4);
    supportStore.update((state) => ({
      ...state,
      isOpen: false,
      support: {
        id: 0,
        puntoEmisionId: 0,
        vehicleCompanyId: 0,
        userAssignedId: 0,
        customerId: 0,
        supportTypeId: 0,
        date: new Date().toISOString().slice(0, 10),
        sequence: 0,
        obs: "",
      },
      vehicle: {
        id: 0,
        countryId: 0,
        vehicleId: 0,
        vehicleTypeId: 0,
        customerId: 0,
        licensePlate: "",
        brand: "",
        model: "",
        year: 0,
        color: "",
        engine: "",
        chassis: "",
        cylindraje: "",
        enabled: false,
      },
      customer: {
        id: 0,
        idType: "",
        idCard: "",
        businessName: "",
        tradeName: "",
        email: "",
        telephone: "",
        address: "",
      },
    }));
  };
</script>

{#if $supportStore.isOpen}
  <Modal
    open={$supportStore.isOpen}
    iconTitle={support.id > 0 ? "ti-sync" : "ti-plus"}
    title={support.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form
        style="text-transform:uppercase"
        on:submit|preventDefault={support.id > 0 ? onUpdate : onSave}
        autocomplete="off"
      >
        <div class="row">
          <div class="col">
            <label for="serch">Datos de la ficha</label>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="country"
                >Establecimiento <span class="text-danger"> *</span></label
              >
              <select
                name="country"
                id="country"
                disabled={support.id > 0}
                bind:value={parameter.establecimientoId}
                on:change={() =>
                  getDataEstablishments(parameter.establecimientoId)}
                class="form-control border-select"
              >
                {#each establishments as item}
                  <option value={item.establecimientoId}>
                    {item.nombreComercial}
                  </option>
                {/each}
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country"
                >Punto Emisión <span class="text-danger"> *</span></label
              >
              <select
                name="country"
                id="country"
                class="form-control border-select"
                disabled={support.id > 0}
                bind:value={support.puntoEmisionId}
                on:change={() => getDataEmissionPoints(support.puntoEmisionId)}
              >
                {#each emissionPointsSelected as item}
                  <option value={item.puntoEmisionId}>
                    {item.ptoEmi}
                  </option>
                {/each}
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="">Fecha <span class="text-danger"> *</span></label>
              <input
                type="date"
                class="form-control"
                bind:value={support.date}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="">Secuencia <span class="text-danger"> *</span></label
              >
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={parameter.sequence}
              />
            </div>
          </div>
        </div>
        <br>

        <div class="row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-4">
            <div class="form-group">
              <label for="country"
                >Técnico Encargado <span class="text-danger"> *</span></label
              >
              <select
                name="country"
                id="country"
                bind:value={support.userAssignedId}
                class="form-control border-select"
              >
                {#each users as item}
                  <option value={item.userAssignedId}>
                    {item.userName}
                  </option>
                {/each}
              </select>
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-8 col-lg-8">
            <label for="country"
              >Soporte a realizar <span class="text-danger"> *</span></label
            >
            <input
              type="text"
              class="form-control"
              bind:value={support.obs}
            />
          </div>
        </div>
        <hr />

        <div class="row">
          <div class="col">
            <label for="serch">Datos del Vehículo</label>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <AdvancedSearch
              on:input={onInput}
              on:focus={onFocus}
              on:blur={onBlur}
              {value}
              {placeholder}
            />
            {#if dataSearch.length > 0}
              <div class="floating-results list-group">
                {#each dataSearch as item}
                  <a
                    href={null}
                    class="list-group-item"
                    on:click={() => getDataSearch(item.id)}
                    ><i class="fa fa-car" /> - {item.licensePlate}
                    - {item.tradeName}</a
                  >
                {/each}
              </div>
            {/if}
          </div>
          <div class="col">
            <button
              type="button"
              class="btn btn-success"
              on:click={() => disabledData(1)}
            >
              <i class="ti-save" /></button
            >

            {#if vehicle.id > 0}
              <button
                type="button"
                class="btn btn-info"
                on:click={() => disabledData(0)}
              >
                <i class="ti-pencil" /></button
              >
            {/if}
            {#if disguise}
              <button
                type="button"
                class="btn btn-info"
                on:click={() => disabledData(3)}
              >
                <i class={icon} /></button
              >
            {/if}
            {#if cancel}
              <button
                type="button"
                class="btn btn-danger"
                on:click={() => disabledData(4)}
              >
                <i class="ti-close" /></button
              >
            {/if}
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="country"
                >País <span class="text-danger"> *</span></label
              >
              <select
                name="country"
                id="country"
                class="form-control border-select"
                {disabled}
                bind:value={vehicle.countryId}
              >
                {#each countrys as item}
                  <option value={item.countryId}>
                    {item.description}
                  </option>
                {/each}
              </select>
            </div>
          </div>

          <div class="col">
            <div class="form-group">
              <label for=""
                >Tipo de Vehículo <span class="text-danger"> *</span></label
              >
              <select
                name="vehicleType"
                id="vehicleType"
                class="form-control border-select"
                {disabled}
                bind:value={vehicle.vehicleTypeId}
              >
                {#each vehicleTypes as item}
                  <option value={item.vehicleTypeId}>
                    {item.description}
                  </option>
                {/each}
              </select>
            </div>
          </div>

          <div class="col">
            <div class="form-group">
              <label for="">Placa <span class="text-danger"> *</span></label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.licensePlate}
              />
            </div>
          </div>

          <div class="col">
            <div class="form-group">
              <label for="">Marca <span class="text-danger"> *</span></label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.brand}
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col" {hidden}>
            <div class="form-group">
              <label for="">Modelo</label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.model}
              />
            </div>
          </div>

          <div class="col" {hidden}>
            <div class="form-group">
              <label for=""
                >Año de Fabricación <span class="text-danger"> *</span></label
              >
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.year}
              />
            </div>
          </div>

          <div class="col" {hidden}>
            <div class="form-group">
              <label for="">Color <span class="text-danger"> *</span></label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.color}
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col" {hidden}>
            <div class="form-group">
              <label for="">Motor <span class="text-danger"> *</span></label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.engine}
              />
            </div>
          </div>

          <div class="col" {hidden}>
            <div class="form-group">
              <label for="">Chasis <span class="text-danger"> *</span></label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.chassis}
              />
            </div>
          </div>

          <div class="col" {hidden}>
            <div class="form-group">
              <label for=""
                >Cilindraje <span class="text-danger"> *</span></label
              >
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={vehicle.cylindraje}
              />
            </div>
          </div>
        </div>
        <hr />

        <div class="row">
          <div class="col">
            <label for="serch">Datos del Cliente</label>
          </div>
        </div>
        <div class="row">
          <div class="col" hidden={hiddenCustomer}>
            <AdvancedSearch
              on:input={onInputCustomer}
              on:focus={onFocusCustomer}
              on:blur={onBlurCustomer}
              value={valueCustomer}
              placeholder={placeholderCustomer}
            />
            {#if customers.length > 0}
              <div class="floating-results list-group">
                {#each customers as item}
                  <a
                    href={null}
                    class="list-group-item"
                    on:click={() => selectClient(item)}
                    ><i class="ti-user" /> - {item.numeroIdentificacion}
                    - {item.nombreFiscal}</a
                  >
                {/each}
              </div>{/if}
          </div>

          <div class="col" hidden={hiddenCustomer}>
            <select
              name="country"
              id="country"
              bind:value={customer.idType}
              class="form-control border-select"
              disabled={disabledCustomer}
            >
              {#each idTypes as item}
                <option value={item.idType}>
                  {item.description}
                </option>
              {/each}
            </select>
          </div>

          <div class="col" hidden={hiddenCustomer}>
            <button
              type="button"
              class="btn btn-info"
              on:click={() => disabledData(5)}
            >
              <i class="ti-user" /> Nuevo</button
            >
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md">
            <div class="form-group">
              <label for="">Indentificación</label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={customer.idCard}
              />
            </div>
          </div>
          <div class="col-md">
            <div class="form-group">
              <label for="">Razón Social</label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={customer.businessName}
              />
            </div>
          </div>
          <div class="col-md">
            <div class="form-group">
              <label for="">Email</label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={customer.email}
              />
            </div>
          </div>
        </div>

        <div class="row" {hidden}>
          <div class="col-md">
            <div class="form-group">
              <label for="">Nombre Comercial</label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={customer.tradeName}
              />
            </div>
          </div>
          <div class="col-md">
            <div class="form-group">
              <label for="">Dirección</label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={customer.address}
              />
            </div>
          </div>
          <div class="col-md">
            <div class="form-group">
              <label for="">Teléfono</label>
              <input
                type="text"
                class="form-control"
                {disabled}
                bind:value={customer.telephone}
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">
            <i class="ti-save" /> Guardar</button
          >
          <button
            type="button"
            class="btn btn-dark"
            on:click={() => onModalClose()}>&times; Cerrar</button
          >
        </div>
      </form>
    </div>
  </Modal>
{/if}
