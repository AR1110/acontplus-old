<script lang="ts">
  import { onMount } from "svelte";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import { supportStore } from "$routes/Mechanical/Store/support.store";
  import Pagination from "$core/components/Pagination.svelte";
    import Add from "./add.svelte";

  let supports = [];
  let recordsQuantity = [10, 25, 50, 100];
  let page;
  let pageSize = recordsQuantity[0];

  onMount(() => {
    return () => unsubscribe();
  });

  //Get
  const unsubscribe = supportStore.subscribe((values) => {
    supports = values.supports;
  });

  // page change pagination
  function onPageChange(event) {
    page = event.detail.page;
    supportStore.get({ pageIndex: page + 1 });
  }

  const onChange = (e) => {
    pageSize = parseInt(e.target.value);
    supportStore.get({ pageSize: pageSize });
  };

</script>

{#if supports.length > 0}
  <div class="row">
    <div class="col-lg-9 col-md-9 col-sm-1">
      <span class="form-group pull-left page-size form-inline">
        <select
          class="form-control control-color"
          bind:value={pageSize}
          on:change={(e) => onChange(e)}
        >
          {#each recordsQuantity as record}
            <option value={record}>{record}</option>
          {/each}
        </select>
      </span>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-12 col-12" />
  </div>
{/if}

<div class="card">
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Secuencia</th>
            <th scope="col">Fecha</th>
            <th scope="col">Identificación</th>
            <th scope="col">Cliente / Conductor</th>
            <th scope="col">Placa</th>
            <th scope="col">Estado</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {#each supports as item}
            <tr>
              <td>{item.sequence}</td>
              <td>{item.date}</td>
              <td>{item.idCard}</td>
              <td>{item.tradeName}</td>
              <td>{item.licensePlate}</td>
              <td>{item.status}</td>
              <td>
                <button class="btn btn-outline-danger btn-sm" >
                  <i class="ti-trash" />
                </button>
                <button class="btn btn-outline-warning btn-sm" on:click={() => supportStore.getOpenModal(item.id)}>
                  <i class="ti-pencil" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <!-- Add pagination -->
      {#if supports.length > 0}
        <Pagination
          {page}
          {pageSize}
          count={supports[0]["totalRecords"]}
          on:pageChange={onPageChange}
        />
      {/if}
    </div>
  </div>
</div>
<Add/>
