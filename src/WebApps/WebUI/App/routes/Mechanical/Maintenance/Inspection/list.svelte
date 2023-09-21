<script lang="ts">
  import { onMount } from "svelte";
  import { InspectionStore } from "$routes/Mechanical/Store/inspection.store";
  import { InspectionService } from "$core/services/mechanical/inspection-service";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import Add from "../Inspection/add.svelte";

  let inspections = [];

  onMount(() => {
    get();
  });

  //Get
  function get() {
    showLoader();
    InspectionService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      if (response) {
        inspections = response["inspection"];
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
            <th scope="col">Cliente / Conductor</th>
            <th scope="col">Placa</th>
            <th scope="col">Marca</th>
            <th scope="col">Tipo</th>
            <th scope="col">Kilometraje</th>
            <th scope="col">Combustible</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {#each inspections as item}
            <tr>
              <td>{item.businessName}</td>
              <td>{item.licensePlate}</td>
              <td>{item.brand}</td>
              <td>{item.vehicleType}</td>
              <td>{item.mileage}</td>
              <td>{item.fuellevel}</td>
              <td
                ><button
                  class="btn btn-outline-warning btn-sm"
                  on:click={() => InspectionStore.getOpenModal(item.id,0)}
                >
                  <i class="ti-pencil" />
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

