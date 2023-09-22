<script lang="ts">
  import { onMount } from "svelte";
  import { useMenuStore } from "$routes/Restaurant/store/menuStore";
  import Add from "./Add.svelte";

  let menus = [];

  useMenuStore.subscribe((values) => {
    menus = values.menus;
  });
  onMount(() => {
    useMenuStore.get();
  });
</script>

{#if menus.length > 0}
  <div class="row">
    {#each menus as item}
      <div class="col-4 col-md-4 col-sm-12">
        <div class="card border border-primary">
          <div class="card-header bg-transparent">
            <h5 class="card-title">{item.title}</h5>
          </div>
          <div class="card-body">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
              class="card-img-top img-responsive"
              src={item.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png"}
              height="200"
              width="200"
              alt="Imagen del producto"
            />
          </div>
          <div class="card-footer bg-transparent">
            <button
              type="button"
              class="btn btn-outline-primary"
              on:click={() => useMenuStore.openingModal(item)}
              ><i class="ti-plus" /> Administrar</button
            >
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <h5>No se en  traron registros</h5>
{/if}

<Add />

<style>
  .img-responsive {
    max-width: 100%;
    height: 200px;
    object-fit: cover;
  }
</style>
