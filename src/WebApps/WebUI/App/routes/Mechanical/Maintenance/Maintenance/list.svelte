<script lang="ts">
  import { onMount } from "svelte";
  import { MaintenanceService } from "$core/services/mechanical/maintenance-service";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import Add from "../Maintenance/add.svelte";

  let maintenances = [];

  onMount(() => {
    get();
  });

  function get() {
    showLoader();
    MaintenanceService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      if (response) {
        maintenances = response["maintenances"];
      }
      hideLoader();
    });
  }
</script>

<div class="card">
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th class="text-center" scope="col">Fecha</th>
            <th class="text-center" scope="col">Detalle</th>
            <th class="text-center" scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {#each maintenances as item}
            <tr>
              <td class="text-center">{item.date}</td>
              <td class="text-center">{item.obs}</td>
              <td class="text-center"
                ><button
                  title="Editar"
                  on:click={() => MaintenanceStore.getOpenModal(item.id, 0)}
                  class="btn btn-outline-warning btn-sm"
                >
                  <i class="ti-pencil" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <!-- Add pagination -->
    </div>
  </div>
</div>
<Add />
