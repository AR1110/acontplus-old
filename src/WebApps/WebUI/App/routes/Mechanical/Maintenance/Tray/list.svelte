<script lang="ts">
  import { onMount } from "svelte";
  import { SupportService } from "$core/services/mechanical/support-service";
  import { InspectionStore } from "$routes/Mechanical/Store/inspection.store";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import Add from "../Inspection/add.svelte";

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
            <th scope="col">Secuencia</th>
            <th scope="col">Fecha</th>
            <th scope="col">Cliente / Conductor</th>
            <th scope="col">Placa</th>
            <th scope="col">Detalle</th>
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
                  on:click={() => InspectionStore.getOpenModal(item.id)}
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
