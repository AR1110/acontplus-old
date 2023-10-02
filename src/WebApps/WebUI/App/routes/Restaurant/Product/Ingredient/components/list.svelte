<script lang="ts">
  import { useIngredientStore } from "$routes/Restaurant/store/ingredientsStore";
  import { onMount } from "svelte";
  import Add from "./add.svelte";
  import Pagination from "../../Components/Pagination.svelte";

  let ingredient = [];

  let recordsQuantity = [10, 25, 50, 100];
  let page;
  let pageSize = recordsQuantity[0];

  const unSuscribe = useIngredientStore.subscribe((values) => {
    ingredient = values.ingredients;
  });

  const onChange = (e) => {
    pageSize = parseInt(e.target.value);
    useIngredientStore.get({ pageSize: pageSize });
  };

  function onPageChange(event) {
    page = event.detail.page;
    useIngredientStore.get({ pageIndex: page + 1 });
  }

  onMount(() => {
    useIngredientStore.get();
    return () => unSuscribe();
  });
</script>

{#if ingredient.length > 0}
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

<div class="responsive-table">
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col" />
        <th scope="col">#</th>
        <th scope="col">Ingrediente</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Unitario</th>
        <th scope="col">Contenido</th>
      </tr>
    </thead>
    <tbody>
      {#each ingredient as item, i}
        <tr>
          <th>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
              href="javascript:void(0)"
              class="btn btn-sm btn-success"
              on:click={() => useIngredientStore.getUpdate(item)}
            >
              <i class="fas fa-edit" />
            </a>
          </th><th scope="row">{i + 1}</th>
          <td>
            {#if item.s3ObjectUrl != null && item.s3ObjectUrl != ""}
              <img src={item.s3ObjectUrl} width="70" class="rounded" alt="" />
            {:else}
              <img
                src="https://i.stack.imgur.com/GNhxO.png"
                width="70"
                class="rounded"
                alt=""
              />
            {/if}

            <span class="mr-5">{item.summary}<span /> </span></td
          >
          <td>{item.quantity}</td>
          <td>{item.unit}</td>
          <td>{item.content}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <!-- Add pagination -->
  {#if ingredient.length > 0}
    <Pagination
      {page}
      {pageSize}
      count={ingredient[0]["totalRecords"]}
      on:pageChange={onPageChange}
    />
  {/if}
</div>
<Add />
