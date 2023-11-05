<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onDestroy, onMount } from "svelte";
  import Swal from "sweetalert2";
  import {
    techSpecCustomerStore,
    activeShowForm,
  } from "./../../store/techSpecCustomerStore";

  import {
    techSpecStore,
    initiload,
    setCustomerCompanyId,
    saveDevice,
    resetFormDevice,
    resetFormMain,
  } from "./../../store/techSpecStore";
  import CustomerListDialog from "$lib/components/Customer/CustomerListDialog.svelte";
  import CustomerFormFast from "./CustomerFormFast.svelte";
  import CustomerSearch from "./CustomerSearch.svelte";

  export let open = false;
  export let showBackdrop = true;
  export let onClosed;
  let title = "Nueva Ficha Técnica";

  // Data Form Tech Spec
  $: data = $techSpecStore.data;
  $: dataDevice = $techSpecStore.dataDevice;

  /* Start Modal Customer List */
  let showPopupCustomer = false;

  const onShowPopupCustomer = (ev) => {
    showPopupCustomer = true;
  };

  const onPopupCloseCustomer = (data) => {
    showPopupCustomer = false;

    console.log(data);
  };

  const resultCustomerSelected = <T>(data: T, dataType: string) => {
    if (typeof data === "number") {
      setCustomerCompanyId(data);
    }
    if (dataType === "DATASRI") {
      activeShowForm("NEW", 0, data);
    }
  };
  /* End Modal Customer List */

  onMount(() => {
    initiload();
    console.log("dialog spec");
  });

  const onChangeEstab = () => {
    Swal.fire({
      text: "Esta seguro de cambiar el establecimiento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí!",
      cancelButtonText: "No!",
    }).then((result) => {
      if (result.isConfirmed) {
        const dataEstab = $techSpecStore.estabs.find(estab=>estab.idEstablecimiento===data.establecimientoId);
        const puntosEmision = dataEstab.puntosEmision;
        const dataPuntoEmision = puntosEmision.find(ptoEmi=>(ptoEmi.defaultPtoEmi));

        techSpecStore.update(state=>{
          state.puntosEmision = puntosEmision;
          state.data.tempEstablecimientoId = state.data.establecimientoId;
          state.data.puntoEmisionId = dataPuntoEmision.idPuntoEmision;
          return state;
        }) 
      }else{
        techSpecStore.update(state=>{
          state.data.establecimientoId = state.data.tempEstablecimientoId;
          return state;
        })
      }
    });
    console.log(data);
  };

  const modalClose = (data) => {
    open = false;
    if (onClosed) {
      onClosed(data);
    }
  };

  onDestroy(() => {
    resetFormMain();
  });
</script>

{#if open}
  <div
    class="modal"
    id="TechSpecDialog"
    tabindex="-1"
    role="dialog"
    aria-labelledby="TechSpecDialogLabel"
    aria-hidden={false}
  >
    <div
      class="modal-dialog modal-xl"
      role="document"
      in:fly={{ y: -50, duration: 300 }}
      out:fly={{ y: -50, duration: 300, easing: quintOut }}
    >
      <div class="modal-content">
        <form autocomplete="off">
          <div class="modal-header">
            <h5 class="modal-title" id="TechSpecDialogLabel">{title}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              on:click={() => modalClose("close")}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!--Start section general -->
            <div class="row">
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div class="form-group">
                  <label for="estab">
                    Estab: <span class="text-danger">*</span>
                  </label>
                  <select
                    name="estab"
                    id="estab"
                    class="form-control border-select"
                    required
                    bind:value={data.establecimientoId}
                    on:change={onChangeEstab}
                  >
                    {#each $techSpecStore.estabs as estab}
                      <option value={estab.idEstablecimiento}
                        >{estab.nombreComercial}</option
                      >
                    {/each}
                  </select>
                </div>
              </div>
              <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12">
                <div class="form-group">
                  <label for="puntoEmision">
                    Punto Emisión: <span class="text-danger">*</span>
                  </label>
                  <select
                    name="puntoEmision"
                    id="puntoEmision"
                    class="form-control border-select"
                    bind:value={data.puntoEmisionId}
                    required
                  >
                    {#each $techSpecStore.puntosEmision as estab}
                      <option value={estab.idPuntoEmision}
                        >{estab.ptoEmi}</option
                      >
                    {/each}
                  </select>
                </div>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div class="form-group">
                  <label for="fechaEmision"
                    >Fecha Emisión:
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    class="form-control border-select"
                    bind:value={data.createdAt}
                    required
                  />
                </div>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div class="form-group">
                  <label for="encargado">
                    Responsable: <span class="text-danger">*</span>
                  </label>
                  <select
                    name="encargado"
                    id="encargado"
                    class="form-control border-select"
                    required
                  >
                    <option value="" />
                  </select>
                </div>
              </div>
            </div>

            <div class="card rounded border border-info">
              <div class="card-header">Datos cliente:</div>
              <div class="card-body">
                <!--Start section customer -->
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                    <div class="form-group">
                      <label for="customerSearch"
                        >Cliente:
                        <span class="text-danger">*</span>
                      </label>
                      <div class="input-group">
                        <CustomerSearch {resultCustomerSelected} />
                        <div class="input-group-append">
                          <button
                            type="button"
                            disabled={$techSpecCustomerStore.isUpdateCustomer}
                            class="btn btn-secondary btn-xs"
                            on:click={() => activeShowForm("NEW", 0)}
                          >
                            <i class="fa fa-plus fa-xs" />
                          </button>
                          {#if data.customerCompanyId > 0}
                            <button
                              type="button"
                              disabled={$techSpecCustomerStore.isNewCustomer}
                              class="btn btn-secondary btn-xs"
                              on:click={() =>
                                activeShowForm(
                                  "UPDATE",
                                  data.customerCompanyId
                                )}
                            >
                              <i class="fa fa-edit fa-xs" />
                            </button>
                          {/if}
                          <button
                            type="button"
                            class="btn btn-secondary btn-xs"
                            on:click={onShowPopupCustomer}
                          >
                            <i class="fa fa-search fa-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!--Start Form register-update customer-->
                {#if $techSpecCustomerStore.showForm}
                  <CustomerFormFast />
                {/if}
              </div>
            </div>
            <!--End Form register-update customer-->
            <div class="card rounded border border-success">
              <div class="card-header d-flex justify-content-between">
                <span>Datos Equipo:</span>
                <button type="button" class="btn btn-outline-info btn-sm"
                  >Historial</button
                >
              </div>
              <div class="card-body">
                <!--Start Form register product-->
                <div class="row">
                  <div
                    class="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="category"
                        >Categoria:
                        <span class="text-danger">*</span>
                      </label>
                      <select
                        name="category"
                        id="category"
                        class="form-control border-select"
                        bind:value={dataDevice.categoryId}
                      >
                        {#each $techSpecStore.categories as category}
                          <option value={category.id}>
                            {category.name}
                          </option>
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div
                    class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="productName"
                        >Nombre Producto:
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="productName"
                        id="productName"
                        bind:value={dataDevice.name}
                        class="form-control border-select"
                      />
                    </div>
                  </div>

                  <div
                    class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="productIMEISerie"
                        >IMEI/Serie:
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="productIMEISerie"
                        id="productIMEISerie"
                        class="form-control border-select"
                        bind:value={dataDevice.serie}
                      />
                    </div>
                  </div>
                  <div
                    class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="productMarca"
                        >Marca:
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="productMarca"
                        id="productMarca"
                        class="form-control border-select"
                        bind:value={dataDevice.marca}
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div
                    class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="productModel">Modelo: </label>
                      <input
                        type="text"
                        name="productModel"
                        id="productModel"
                        class="form-control border-select"
                        bind:value={dataDevice.model}
                      />
                    </div>
                  </div>
                  <div
                    class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="productYear">Año: </label>
                      <input
                        type="number"
                        name="productYear"
                        id="productYear"
                        class="form-control border-select"
                        bind:value={dataDevice.year}
                      />
                    </div>
                  </div>
                  <div
                    class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="productWarranty">Garantía: </label>
                      <input
                        type="text"
                        name="productWarranty"
                        id="productWarranty"
                        class="form-control border-select"
                        bind:value={dataDevice.warranty}
                      />
                    </div>
                  </div>
                  <div
                    class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 col-12"
                  >
                    <div class="form-group">
                      <label for="productColor">Color: </label>
                      <input
                        type="text"
                        name="productColor"
                        id="productColor"
                        class="form-control border-select"
                        bind:value={dataDevice.color}
                      />
                    </div>
                  </div>
                </div>
                <div class="d-inline-flex justify-content-center flex-row">
                  <button
                    type="button"
                    class="btn btn-info"
                    on:click={saveDevice}
                  >
                    {#if data.deviceId > 0}
                      <i class="ti-pencil" /> Actualizar
                    {:else}
                      <i class="ti-save" /> Guardar
                    {/if}
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger mx-1"
                    on:click={resetFormDevice}
                  >
                    <i class="fa fa-refresh" /> Limpiar
                  </button>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="form-group">
                  <label for="observación">Observación:</label>
                  <textarea
                    class="form-control border-select"
                    aria-label="obs"
                  />
                </div>
              </div>
            </div>

            <!--Start Form register product-->
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-success">
              <i class="ti-save" />
              Guardar
            </button>
            <button
              type="button"
              class="btn btn-dark"
              data-dismiss="modal"
              on:click={() => modalClose("close")}
            >
              &times; Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  {#if showBackdrop}
    <div class="modal-backdrop show" transition:fade={{ duration: 150 }} />
  {/if}
{/if}

{#if showPopupCustomer}
  <CustomerListDialog
    open={showPopupCustomer}
    onClosed={(data) => onPopupCloseCustomer(data)}
  />
{/if}

<style>
  .modal {
    display: block;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
