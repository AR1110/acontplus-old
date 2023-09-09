<script lang="ts">
  import { onMount } from "svelte";
  import { MenuService } from "$core/services/restaurant/menu-service";
  let menus = [];
  onMount(() => {
    MenuService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      if (response) {
        menus = response["menus"];
      }
    });
  });
  const openModalItems = () => {
    console.log('openModal')
  };
</script>

{#if menus.length > 0}
  <div class="row">
    {#each menus as item}
      <div class="col-4">
        <div class="card border border-primary">
          <div class="card-header bg-transparent">
            <h5 class="card-title">{item.title}</h5>
          </div>
          <div class="card-body">
            <img
              class="card-img-top img-responsive"
              src={item.s3ObjectUrl}
              alt="No image"
            />
          </div>
          <div class="card-footer bg-transparent">
            <button
              type="button"
              class="btn btn-outline-primary"
              on:click={openModalItems}><i class="ti-plus" /> Administrar</button
            >
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <h5>No se encontraron registros</h5>
{/if}
