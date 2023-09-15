<script lang="ts">
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import Modal from "$core/components/Modal.svelte";

  let support;

  MaintenanceStore.subscribe((values) => {
    support = values.support;
  });

  // CLOSE MODAL
  const onModalClose = () => {
    MaintenanceStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
  };
</script>

{#if $MaintenanceStore.isOpen}
  <Modal
    open={$MaintenanceStore.isOpen}
    iconTitle={"ti-plus"}
    title={"Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form style="text-transform:uppercase">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="country">Serie Documento </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.sequence}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Marca </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.brand}
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label for="country">Tipo </label>
              <input
                type="text"
                class="form-control"
                disabled
                bind:value={support.vehicleType}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </Modal>
{/if}
