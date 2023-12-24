<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import type { Floor } from "$interfaces/restaurant/floor";
  import type { Room } from "$interfaces/restaurant/room";
  import { roomService } from "$services/restaurant/room-service";
  import { hideLoader, showLoader } from "$utils/loading-spinner";
  import toast from "$utils/toast";

  export let openNew;
  export let modalClosed;

  export let data = {} as Room;
  export let floors = [] as Floor[];

  const setCode = (description: string) => {
    if (description === undefined || description === null) return;
    data.code = description.substring(0, 3).toUpperCase();
  };

  const onSave = () => {
    if (!onValidate(data)) return;

    showLoader();
    roomService.post(data).then((response) => {
      hideLoader();
      if (response.status == 200) {
        onModalClose();
        toast({ type: "success", message: response.data });
        data = {} as Room;
      } else {
        toast({ type: "warning", message: response.data });
      }
    });
  };

  const onUpdate = () => {
    if (!onValidate(data)) return;

    showLoader();
    roomService.put(data.id, data).then((response) => {
      hideLoader();
      if (response.status == 200) {
        onModalClose();
        toast({ type: "success", message: "Actualizado exitosamente" });
        data = {} as Room;
      } else {
        toast({ type: "error", message: "Error al actualizar" });
      }
    });
  };

  const onValidate = (data: Room) => {
    let isValid = true;

    try {
      if (data.floorId === undefined || data.floorId === null) {
        toast({ type: "warning", message: "Seleccione un piso" });
        isValid = false;
      }

      if (data.description === undefined || data.description === null) {
        toast({ type: "warning", message: "Ingrese una descripción" });
        isValid = false;
      }

      if (data.code === undefined || data.code === null) {
        toast({ type: "warning", message: "Ingrese un código" });
        isValid = false;
      }

      if (data.capacity === undefined || data.capacity === null) {
        toast({ type: "warning", message: "Ingrese una capacidad" });
        isValid = false;
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
    iconTitle={data.id > 0 ? "ti-sync" : "ti-plus"}
    title={data.id > 0 ? "Actualizar sala" : "Registrar sala"}
    onClosed={() => onModalClose()}
  >
    <form
      on:submit|preventDefault={data.id > 0 ? onUpdate : onSave}
      autocomplete="off"
    >
      <div class="modal-body">
        <div class="form-group">
          <label for="tipo">Piso: <span class="text-danger">*</span></label>
          <select
            name="establecimiento"
            id="establecimiento"
            class="form-control border-select"
            bind:value={data.floorId}
          >
            <option disabled>seleccione ítem</option>
            {#each floors as item}
              <option value={item.id}>
                {item.description}
              </option>
            {/each}
          </select>
        </div>
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
        <div class="form-group">
          <label for="descripcion">
            Capacidad <span class="text-danger">*</span>
          </label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            bind:value={data.capacity}
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
