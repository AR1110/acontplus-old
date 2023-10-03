<script lang="ts">
  import { onMount } from "svelte";
  import { InspectionStore } from "$routes/Mechanical/Store/inspection.store";
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import { InspectionService } from "$lib/services/mechanical/inspection-service";
  import { hideLoader, showLoader } from "$lib/utils/loading-spinner";
  import Add from "../Inspection/add.svelte";
  import AddMaintenance from "../Maintenance/add.svelte";

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

  function getReport(item) {
    showLoader();
    let format = "pdf";
    let dataParams = { inspectionId: item.id };
    const params = {
      hasService: false,
      hasIdUsuarioRol: true,
      reportParams: JSON.stringify({
        hasParams: true,
        codigo: "MI",
        codEstab: item.codEstab,
        format,
        additionalParams: [],
      }),
      dataParams: JSON.stringify(dataParams),
    };
    InspectionStore.getReport(params);
    setTimeout(() => {
      hideLoader();
    }, 1000);
  }
</script>

<div class="card">
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th class="text-center" scope="col">Cliente / Conductor</th>
            <th class="text-center" scope="col">Placa</th>
            <th class="text-center" scope="col">Marca</th>
            <th class="text-center" scope="col">Tipo</th>
            <th class="text-center" scope="col">Kilometraje</th>
            <th class="text-center" scope="col">Combustible</th>
            <th class="text-center" scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {#each inspections as item}
            <tr>
              <td class="text-center">{item.businessName}</td>
              <td class="text-center">{item.licensePlate}</td>
              <td class="text-center">{item.brand}</td>
              <td class="text-center">{item.vehicleType}</td>
              <td class="text-center">{item.mileage}</td>
              <td class="text-center">{item.fuellevel}</td>
              <td class="text-center"
                ><button
                  title="Editar"
                  class="btn btn-outline-warning btn-sm"
                  on:click={() => InspectionStore.getOpenModal(item.id, 0)}
                >
                  <i class="ti-pencil" />
                </button>
                <button
                  title="Realizar Mantenimiento"
                  on:click={() => MaintenanceStore.getOpenModal(0, item.id)}
                  class="btn btn-outline-info btn-sm"
                >
                  <i class="fa fa-wrench" />
                </button>
                <button
                  title="Obtner reporte"
                  on:click={() => getReport(item)}
                  class="btn btn-outline-dark btn-sm"
                >
                  <i class="fa fa-file-pdf" />
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
