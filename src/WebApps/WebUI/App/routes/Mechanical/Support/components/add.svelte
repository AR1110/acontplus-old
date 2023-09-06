<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$core/components/Modal.svelte";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import { showLoader, hideLoader } from "$core/utils/loading-spinner";
  import toast from "$core/utils/toast";
  import type { Support } from "$core/interfaces/mechanical/support";
  import type { Vehicle } from "$core/interfaces/mechanical/vehicle";
  import type { Customer } from "$core/interfaces/customer/customer";
  import { SupportService } from "$core/services/mechanical/support-service";
  import { VehicleService } from "$core/services/mechanical/vehicle-service";
  import { CustomerService } from "$core/services/customer/customer-service";

  export let openNew;
  export let modalClosed;
  export let support: Support = {
    id: 0,
    puntoEmisionId: 0,
    vehicleCompanyId: 0,
    customerId: 0,
    supportTypeId: 0,
    date: new Date().toISOString().slice(0, 10),
    sequence: 0,
    obs: "",
  };

  export let vehicle: Vehicle = {
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
  };

  export let customer: Customer = {
    id: 0,
    idType: "",
    idCard: "",
    businessName: "",
    tradeName: "",
    email: "",
    telephone: "",
    address: "",
  };
  let dataSearch = [];
  let establishments = [];
  let emissionPoints = [];
  let emissionPointsSelected = [];
  let vehicleTypes = [];
  let countrys = [];
  let supportTypes = [];
  let idTypes = [];
  let customers = [];
  let emissionPointData = {};
  let establecimientoId = 0;
  let sequence = "";
  let value = "";
  let valueCustomer = "";
  let isCustomerSelected = false;
  let idCard = "";
  let cardTypeId = 0;
  let placeholder = "Buscar Cliente o Vehículo";
  let disabled = true;
  let hidden = true;
  let hiddenSearch = true;
  let disguise = false;
  let cancel = false;
  let icon = "";

  onMount(() => {
    getDataForm();
  });

  // GET FOR DATA
  const getDataForm = () => {
    SupportService.get(JSON.stringify({ tipo: 2 })).then((response) => {
      if (response) {
        establishments = response["establishments"];
        emissionPoints = response["emissionPoints"];
        vehicleTypes = response["vehicleTypes"];
        countrys = response["countrys"];
        supportTypes = response["supportTypes"];
        idTypes = response["idTypes"];
        establecimientoId = establishments[0].establecimientoId;
        getDataEstablishments(establecimientoId);
      }
    });
  };

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
    sequence =
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
    dataSearch = [];
    let data = {};
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
    cardTypeId = e.idTipoIdentificacion;
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
      disguise = false;
      cancel = true;
      hiddenSearch = false;
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
        cancel = false;
        hiddenSearch = true;
        value = "";
        valueCustomer = "";
      } else {
        vehicle = {} as Vehicle;
        customer = {} as Customer;
        hidden = true;
        cancel = false;
        hiddenSearch = true;
        value = "";
        valueCustomer = "";
      }
    }
  };

  // NEW CUSTOMER GET WITH API SRI
  const getApiSri = () => {
    showLoader();
    if (customer.idType == "04" && idCard.length == 13) {
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
    }
    if (customer.idType == "05") {
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
    }
  };

  // CLOSE MODAL
  const onModalClose = () => {
    openNew = false;
    hidden = true;
    cancel = false;
    disguise = false;
    disabled = true;
    hiddenSearch = true;
    establecimientoId = 0;
    sequence = "";
    value = "";
    valueCustomer = "";
    emissionPointsSelected = [];
    countrys = [];
    vehicleTypes = [];
    support = {} as Support;
    vehicle = {} as Vehicle;
    customer = {} as Customer;
    modalClosed();
  };
</script>

{#if openNew}
  <Modal
    open={openNew}
    iconTitle={support.id > 0 ? "ti-sync" : "ti-plus"}
    title={support.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form autocomplete="off">
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
                bind:value={establecimientoId}
                on:change={() => getDataEstablishments(establecimientoId)}
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
                bind:value={sequence}
              />
            </div>
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
          <div class="col">
            <input
              type="text"
              class="form-control"
              on:change={() => getApiSri()}
              placeholder="Buscar Cliente"
              {disabled}
              bind:value={idCard}
            />
          </div>

          <div class="col" hidden={hiddenSearch}>
            <AdvancedSearch
              on:input={onInputCustomer}
              on:focus={onFocusCustomer}
              on:blur={onBlurCustomer}
              value={valueCustomer}
              placeholder="Buscar Cliente"
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

          <div class="col">
            <select
              name="country"
              id="country"
              bind:value={customer.idType}
              on:click={() => getApiSri()}
              class="form-control border-select"
            >
              {#each idTypes as item}
                <option value={item.idType}>
                  {item.description}
                </option>
              {/each}
            </select>
          </div>

          <div class="col">
            <button type="button" class="btn btn-info">
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
