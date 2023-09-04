<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$core/components/Modal.svelte";
  import type { Support } from "$core/interfaces/mechanical/support";
  import { SupportService } from "$core/services/mechanical/support-service";

  export let openNew;
  export let modalClosed;
  export let support: Support = {
    id: 0,
    puntoEmisionId: 0,
    date: "",
    sequence: 0,
    vehicleCompanyId: 0,
    customerId: 0,
  };
  let establishments = [];
  let emissionPoints = [];

  onMount(() => {
    getDataForm();
  });

  // GET FOR DATA
  const getDataForm = () => {
    SupportService.get(JSON.stringify({ tipo: 2 })).then((response) => {
      if (response) {
        establishments = response["establishments"];
        emissionPoints = response["emissionPoints"];
      }
    });
  };

  // CHANGE OF establishments CAPTUREP DATA
  const getDataEstablishments = (e) => {
    console.log(e)
  };

  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
</script>

{#if openNew}
  <Modal
    open={openNew}
    iconTitle={support.id > 0 ? "ti-sync" : "ti-plus"}
    title={support.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    size={"modal-xl"}
  >
    <form>
      <div class="modal-body">
        <div class="row">
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="card">
              <div class="card-body border border-info rounded">
                <h5 class="card-title">Datos Ficha</h5>
                <div class="row">
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                    <div class="form-group">
                      <label for="country"
                        >Establecimiento <span class="text-danger">
                          *</span
                        ></label
                      >
                      <select
                        name="country"
                        id="country"
                        class="form-control border-select"
                      >
                        {#each establishments as item}
                          <option value={item.establecimientoId} on:change={() => getDataEstablishments(item)}>
                            {item.nombreComercial}
                          </option>
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                    <div class="form-group">
                      <label for="country"
                        >Punto Emisión <span class="text-danger">
                          *</span
                        ></label
                      >
                      <select
                        name="country"
                        id="country"
                        class="form-control border-select"
                        bind:value={support.puntoEmisionId}
                      >
                        {#each emissionPoints as item}
                          <option value={item.puntoEmisionId}>
                            {item.ptoEmi}
                          </option>
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                    <div class="form-group">
                      <label for=""
                        >Fecha <span class="text-danger"> *</span></label
                      >
                      <input
                        type="date"
                        class="form-control"
                        bind:value={support.date}
                      />
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                    <div class="form-group">
                      <label for=""
                        >Secuencia <span class="text-danger"> *</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        bind:value={support.sequence}
                      />
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
      </div>
    </form>
  </Modal>
{/if}
