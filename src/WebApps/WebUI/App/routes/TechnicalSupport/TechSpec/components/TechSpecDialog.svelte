<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";
  import {
    techSpecCustomerStore,
    activeShowForm,
  } from "./../../store/techSpecCustomerStore";
  import {
    techSpecStore,
    setCustomerCompanyId,
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

  /* Start Modal Customer List */
  let showPopupCustomer = false;

  const onShowPopupCustomer = (ev) => {
    showPopupCustomer = true;
  };

  const onPopupCloseCustomer = (data) => {
    showPopupCustomer = false;

    console.log(data);
  };
  /* End Modal Customer List */

  const modalClose = (data) => {
    open = false;
    if (onClosed) {
      onClosed(data);
    }
  };

  onMount(() => {
    console.log("dialog spec");
  });

  const resultCustomerSelected = <T>(data: T) => {
    if (typeof data === "number") {
      setCustomerCompanyId(data);
    }
  };

  /**Customer*/
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
                  >
                    <option value="" />
                  </select>
                </div>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div class="form-group">
                  <label for="puntoEmision">
                    Punto Emisión: <span class="text-danger">*</span>
                  </label>
                  <select
                    name="puntoEmision"
                    id="puntoEmision"
                    class="form-control border-select"
                  >
                    <option value="" />
                  </select>
                </div>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div class="form-group">
                  <label for="fechaEmision"
                    >Fecha Emisión:
                    <span class="text-danger">*</span>
                  </label>
                  <input type="date" class="form-control border-select" />
                </div>
              </div>
            </div>
            <div class="linea-con-letra">
              <span class="texto-html">Datos cliente</span>
            </div>
            <!--End section general -->

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
                            activeShowForm("UPDATE", data.customerCompanyId)}
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
            <!--End Form register-update customer-->
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
  .linea-con-letra {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative; /* Agregamos posición relativa */
  }

  .linea-con-letra::before {
    content: "";
    position: absolute; /* Agregamos posición absoluta */
    top: 50%;
    left: 0;
    right: 0;
    border-bottom: 1px solid #e9ecef;
    transform: translateY(-50%); /* Centramos verticalmente */
  }

  .texto-html {
    background-color: #00c292; /* Color de fondo (verde) */
    border-radius: 10px; /* Borde redondeado */
    padding: 5px; /* Espaciado dentro del fondo */
    position: relative;
    color: #fff;
    z-index: 1; /* Colocamos el texto por encima de la línea */
  }
</style>
