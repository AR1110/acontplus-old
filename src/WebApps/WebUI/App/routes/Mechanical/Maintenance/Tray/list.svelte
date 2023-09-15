<script lang="ts">
  import { onMount } from "svelte";
  import { MaintenanceService } from "$core/services/mechanical/maintenance-service";
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import Add from "../Inspection/add.svelte";
  let trays = [];

  onMount(() => {
    get();
  });

  //Get
  function get() {
    showLoader();
    MaintenanceService.get(JSON.stringify({ tipo: 2 })).then((response) => {
      if (response) {
        trays = response["trays"];
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
            <th scope="col">Secuencia</th>
            <th scope="col">Fecha</th>
            <th scope="col">Cliente / Conductor</th>
            <th scope="col">Placa</th>
            <th scope="col">Obs</th>
          </tr>
        </thead>
        <tbody>
          {#each trays as item}
            <tr>
              <td>{item.sequence}</td>
              <td>{item.date}</td>
              <td>{item.tradeName}</td>
              <td>{item.licensePlate}</td>
              <td>{item.obs}</td>
              <td
                ><button
                  class="btn btn-outline-danger btn-sm"
                  on:click={() => MaintenanceStore.getOpenModal(item.supportId)}
                >
                  <i class="ti-ticket" />
                </button></td
              >
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Add pagination -->
    </div>
  </div>
</div>
<Add />
