<script lang="ts">
  import type { Room } from "$core/interfaces/restaurant/room";
  import { roomService } from "$core/services/restaurant/room-service";
  import toast from "$core/utils/toast";
  import Swal from "sweetalert2";
  import Add from "./add.svelte";
  import type { Floor } from "$core/interfaces/restaurant/floor";

  export let rooms = [] as Room[];
  let edit = {} as Room;
  export let reloadList;
  let isNew = false;
  export let floors = [] as Floor[];

  const openNew = (data) => {
    if (openNew) {
      edit = data;
      isNew = true;
    }
  };

  const closeModal = () => {
    isNew = false;
    reloadList();
  };

  // Delete production area
  const remove = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cerrar",
    }).then((result) => {
      if (result.isConfirmed) {
        roomService.remove(id).then((response) => {
          if (response.status === 200) {
            toast({
              type: "success",
              message: "Eliminado exitosamente",
            });
          }
          reloadList();
        });
      }
    });
  };
</script>

<div class="card">
  <div class="card-body">
    {#if rooms.length > 0}
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th />
              <th>N°</th>
              <th>Código</th>
              <th>Descripcion</th>
              <th>Capacidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each rooms as item, index}
              <tr>
                <td>
                  <!-- svelte-ignore a11y-invalid-attribute -->
                  <a
                    href="javascript:void(0)"
                    class="btn btn-sm btn-success"
                    on:click={() => openNew(item)}
                  >
                    <i class="fas fa-edit" />
                  </a>
                  <!-- svelte-ignore a11y-invalid-attribute -->
                  <a
                    href="javascript:void(0)"
                    class="btn btn-sm btn-danger"
                    on:click={() => remove(item.id)}
                  >
                    <i class="fas fa-trash" />
                  </a>
                </td>
                <td>{index + 1}</td>
                <td>{item.code}</td>
                <td> {item.floor.description} - {item.description}</td>
                <td>{item.capacity}</td>
                <td>
                  {#if item.enabled}
                    <span class="badge badge-success">Activo</span>
                  {:else}
                    <span class="badge badge-danger">Inactivo</span>
                  {/if}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <h5>No hay registros</h5>
    {/if}
  </div>
</div>
<Add openNew={isNew} modalClosed={() => closeModal()} data={edit} {floors} />
