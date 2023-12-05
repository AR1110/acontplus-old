<script lang="ts">
  import { useItemStore } from "@/routes/Restaurant/store/itemStore";
  import { onMount } from "svelte";
  import Pagination from "../../Components/Pagination.svelte";
  import Add from "./add.svelte";

  let items = [];
  let timer;
  let recordsQuantity = [10, 25, 50, 100];

  const unSuscribe = useItemStore.subscribe((values) => {
    items = values.items;
  });

  let page = 0;
  let pageCurrent = 0;
  let pageSize = recordsQuantity[0];

  function onPageChange(event) {
    page = event.detail.page;
    pageCurrent = page + 1;
    useItemStore.get({ pageIndex: pageCurrent });
  }

  const onChange = (e) => {
    pageSize = parseInt(e.target.value);
    useItemStore.get({ pageSize: pageSize });
  };

  const search = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (e.target.value != "") {
        useItemStore.get({ textSearch: e.target.value });
      } else {
        useItemStore.get();
      }
    }, 750);
  };

  const clearInput = () => {
    document.querySelector("input").value = "";
    search({ target: { value: "" } });
  };

  onMount(() => {
    useItemStore.get({ pageSize: pageSize });
    useItemStore.getProductionArea();
    return () => unSuscribe();
  });
</script>

<!-- Add select and search container -->

<div class="row">
  <div class="col-lg-9 col-md-9 col-sm-1">
    <span class="form-group pull-left page-size form-inline">
      <select class="form-control control-color" on:change={(e) => onChange(e)}>
        {#each recordsQuantity as record}
          <option value={record}>{record}</option>
        {/each}
      </select>
    </span>
  </div>
  <div class="col-lg-3 col-md-3 col-sm-12 col-12">
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control form-control-lg search-input"
        placeholder="Buscar..."
        aria-label=""
        aria-describedby="basic-addon1"
        on:keyup={(e) => {
          search(e);
        }}
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          on:click={() => {
            clearInput();
          }}
          type="button"><i class="fa fa-sync" /></button
        >
      </div>
    </div>
  </div>
</div>

<!-- Add table -->
{#if items.length > 0}
  <div class="resposive-table">
    <table class="table">
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col">N°</th>
          <th scope="col">Categoría</th>
          <th scope="col">Item</th>
          <th scope="col">Resumen</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, index}
          <tr>
            <th>
              <!-- svelte-ignore a11y-invalid-attribute -->
              <a
                href="javascript:void(0)"
                class="btn btn-sm btn-success"
                on:click={() => useItemStore.getRecipe(item)}
              >
                <i class="fas fa-edit" />
              </a>
            </th>
            <th>{index + 1}</th>
            <td>{item.categoria}</td>
            <td>
              <img
                src={item.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png"}
                width="70"
                class="rounded"
                alt=""
              />
              {item.descripcion}
            </td>
            <td>{item.summary}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <!-- Add pagination -->
    <Pagination
      {page}
      {pageSize}
      count={items[0]["totalRecords"]}
      on:pageChange={onPageChange}
    />
  </div>
{:else}
  <p class="text-center text-italic">No hay items registrados</p>
{/if}

<Add pageIndexCurrent={pageCurrent} />
