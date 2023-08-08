<script lang="ts">
  import Modal from '$core/components/Modal.svelte';

  export let openNew;
  export let modalClosed;

  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };

  const onSave = () => {
    console.log('save');
  };
</script>

{#if openNew}
  <Modal
    open={openNew}
    iconTitle={'ti-plus'}
    title={'Registrar'}
    onClosed={() => onModalClose()}
  >
    <form on:submit|preventDefault={onSave}>
      <div class="modal-body">
        <div class="form-group">
          <label for="descripcion"
            >Descripción <span class="text-danger">*</span></label
          >
          <input
            type="text"
            name="descripcion"
            class="form-control border-select"
          />
        </div>
        <div class="form-group">
          <label for="descripcion"
            >Código <span class="text-danger">*</span></label
          >
          <input
            type="text"
            name="descripcion"
            class="form-control border-select"
          />
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
