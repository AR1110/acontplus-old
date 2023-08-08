<script lang="ts">
	import { productionAreaService } from '$core/services/restaurant/production-area-service';
  import Modal from '$core/components/Modal.svelte';
  import type { ProductionArea } from '$core/interfaces/restaurant/production-area';
  import toastr from 'toastr';

  export let openNew;
  export let modalClosed;

  let data = {} as ProductionArea;

  const onSave = () => {
    productionAreaService.post(data).then((response) => {
      if(response.data.status === 201) {
        modalClosed();
        toastr.success('Agregado exitiosamente');
      } {
        console.log(response);
        toastr.error('Ups! ocurrio un error');
      }
    });
  };

  const setCode = (description: string) => {
    if(description === undefined || description === null) return;

    data.code = description.substring(0, 3).toUpperCase();
  };

  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
</script>

{#if openNew}
  <Modal
    open={openNew}
    iconTitle={'ti-plus'}
    title={'Registrar'}
    onClosed={() => onModalClose()}
  >
    <form on:submit|preventDefault={onSave} autocomplete="off">
      <div class="modal-body">
        <div class="form-group">
          <label for="descripcion">
            Descripción <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            name="description"
            id="description"
            bind:value={data.description}
            on:keyup={(e) => setCode(data.description)}
            class="form-control border-select"
          />
        </div>
        <div class="form-group">
          <label for="descripcion">
            Código <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            name="code"
            id="code"
            bind:value={data.code}
            class="form-control border-select"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-success">
          <i class="ti-save" /> Guardar</button>
        <button
          type="button"
          class="btn btn-dark"
          on:click={() => onModalClose()}>&times; Cerrar</button
        >
      </div>
    </form>
  </Modal>
{/if}
