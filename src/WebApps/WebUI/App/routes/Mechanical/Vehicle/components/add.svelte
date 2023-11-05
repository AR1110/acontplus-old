<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$lib/components/Modal.svelte";
  import toast from "$lib/utils/toast";
  import { showLoader, hideLoader } from "$lib/utils/loading-spinner";
  import type { Vehicle } from "$lib/interfaces/mechanical/vehicle";
  import type { Customer } from "$lib/interfaces/customer/customer";
  import { VehicleService } from "$lib/services/mechanical/vehicle-service";
  import { CustomerService } from "$lib/services/customer/customer-service";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import { vehicleStore } from "$routes/Mechanical/Store/vehicle.store";

  export let openNew;
  export let modalClosed;
  export let vehicle: Vehicle = {
    id: 0,
    countryId: 0,
    vehicleId: 0,
    vehicleTypeId: 0,
    customerId: 0,
    licensePlate: "",
    brand: "",
    model: "",
    year: null,
    color: "",
    engine: "",
    chassis: "",
    cylindraje: "",
    enabled: true,
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

  let cardTypeId = 0;
  let customers = [];
  let value = "";
  let placeholder = "Buscar cliente";
  let isCustomerSelected = false;

  let paramValidation = [undefined, null, "", 0];
  let vehicleTypes = [];
  let countrys = [];

  onMount(() => {
    getDataForm();
  });

  const getDataForm = () => {
    VehicleService.get(JSON.stringify({ tipo: 2 })).then((response) => {
      if (response) {
        vehicleTypes = response["vehicleTypes"];
        countrys = response["countrys"];
      }
    });
  };

  const onInput = async (e) => {
    value = e.target.value;
    customers = [];
    if (value.length < 3) return;

    let data = {
      textSearch: value,
    };
    CustomerService.search(JSON.stringify(data)).then((response) => {
      if (response) {
        customers = response;
      }
    });
  };

  const onFocus = () => {};

  const onBlur = (e) => {
    if (!value) {
      customers = [];
      value = "";
    }
  };

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
    value = "";
    customers = [];
  };

  const onSave = () => {
    if (!onValidate()) return;

    showLoader();
    VehicleService.post({
      data: { vehicle, customer: customer, cardTypeId },
    }).then((response) => {
      hideLoader();
      if (response.code == 1) {
        toast({ type: "success", message: response.message });
        vehicle = {} as Vehicle;
        customer = {} as Customer;
        vehicleStore.get();
        onModalClose();
      } else {
        toast({ type: "warning", message: response.message });
      }
    });
  };

  const onUpdate = () => {
    if (!onValidate()) return;
    showLoader();
    VehicleService.put(vehicle.id, { data: { vehicle, customer } }).then(
      (response) => {
        hideLoader();
        if (response.code == 1) {
          toast({ type: "success", message: response.message });
          vehicle = {} as Vehicle;
          customer = {} as Customer;
          vehicleStore.get();
          onModalClose();
        } else {
          toast({ type: "warning", message: response.message });
        }
      }
    );
  };

  const onValidate = () => {
    let isValid = true;
    try {
      if (paramValidation.includes(vehicle.customerId)) {
        toast({
          type: "warning",
          message: "Seleccione el Cliente / Conductor",
        });
        return;
      }

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
      return isValid;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
</script>

{#if openNew}
  <Modal
    open={openNew}
    iconTitle={vehicle.id > 0 ? "ti-sync" : "ti-plus"}
    title={vehicle.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    size={"modal-xl"}
  >
    <form
      style="text-transform:uppercase"
      on:submit|preventDefault={vehicle.id > 0 ? onUpdate : onSave}
      autocomplete="off"
    >
      <div class="modal-body">
        <div class="row">
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="card">
              <div class="card-body border border-info rounded">
                <div class="form-group row">
                  <label for="inputSearch" class="col-sm-2 col-form-label"
                    >Cliente / Conductor : <span class="text-danger">
                      *</span
                    ></label
                  >
                  <div class="col-sm-6">
                    <AdvancedSearch
                      on:input={onInput}
                      on:focus={onFocus}
                      on:blur={onBlur}
                      {value}
                      {placeholder}
                    />
                  </div>
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

                <div class="row">
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for="">Indentificación</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        value={customer.idCard}
                      />
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                      <label for="">Razón Social</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        value={customer.businessName}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for="">Email</label>
                      <input
                        type="text"
                        class="form-control"
                        disabled
                        value={customer.email}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body border border-info rounded">
                <h5 class="card-title">Vehículo</h5>
                <div class="row">
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                    <div class="form-group">
                      <label for="country"
                        >País <span class="text-danger"> *</span></label
                      >
                      <select
                        name="country"
                        id="country"
                        class="form-control border-select"
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
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                    <div class="form-group">
                      <label for=""
                        >Tipo de Vehículo <span class="text-danger">
                          *</span
                        ></label
                      >
                      <select
                        name="vehicleType"
                        id="vehicleType"
                        class="form-control border-select"
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
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for=""
                        >Placa <span class="text-danger"> *</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.licensePlate}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                    <div class="form-group">
                      <label for=""
                        >Marca <span class="text-danger"> *</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.brand}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for="">Modelo</label>
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.model}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for=""
                        >Año de Fabricación <span class="text-danger">
                          *</span
                        ></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.year}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for=""
                        >Color <span class="text-danger"> *</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.color}
                      />
                    </div>
                  </div>

                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for=""
                        >Motor <span class="text-danger"> *</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.engine}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for=""
                        >Chasis <span class="text-danger"> *</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.chassis}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for=""
                        >Cilindraje <span class="text-danger"> *</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={vehicle.cylindraje}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
  </Modal>
{/if}
