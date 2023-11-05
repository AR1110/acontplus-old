<script lang="ts">
  import { onMount } from "svelte";
  import { SupportService } from "$lib/services/mechanical/support-service";
  import { InspectionStore } from "$routes/Mechanical/Store/inspection.store";
  import { hideLoader, showLoader } from "$lib/utils/loading-spinner";
  import Add from "../Inspection/add.svelte";
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import AddMaintenance from "../Maintenance/add.svelte";

  let trays = [];
  let json = { pageIndex: 1, pageSize: 10, tipo: 1, chkUser: true };

  onMount(() => {
    get();
  });

  //Get
  function get() {
    showLoader();
    SupportService.get(JSON.stringify(json)).then((response) => {
      if (response) {
        trays = response["supports"];
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
            <th class="text-center" scope="col">Secuencia</th>
            <th class="text-center" scope="col">Fecha</th>
            <th class="text-center" scope="col">Cliente / Conductor</th>
            <th class="text-center" scope="col">Placa</th>
            <th class="text-center" scope="col">Detalle</th>
            <th class="text-center" scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {#each trays as item}
            <tr>
              <td class="text-center">{item.sequence}</td>
              <td class="text-center">{item.date}</td>
              <td class="text-center">{item.tradeName}</td>
              <td class="text-center">{item.licensePlate}</td>
              <td class="text-center">{item.obs}</td>
              <td class="text-center">
                <button
                  title="Realizar Mantenimiento"
                  on:click={() => MaintenanceStore.getOpenModal(item.id, 0)}
                  class="btn btn-outline-success btn-sm"
                >
                  <i class="fa fa-wrench" />
                </button>
                <button
                  title="Registrar Inspección"
                  class="btn btn-outline-info btn-sm"
                  on:click={() => InspectionStore.getOpenModal(0, item.id)}
                >
                  <i class="fa fa-file-text" />
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
<AddMaintenance />
