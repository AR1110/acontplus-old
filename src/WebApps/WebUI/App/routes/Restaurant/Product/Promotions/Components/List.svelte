<script lang="ts">
  import { usePromotionStore } from "$routes/Restaurant/store/promotionStore";
  import { onMount } from "svelte";
  import Add from "../../Menus/Components/Add.svelte";
  import type { Promotion } from "$core/interfaces/restaurant/promotion";
  let promotions = [] as Promotion[];

  usePromotionStore.subscribe((values) => {
    promotions = values.promotions;
  });

  onMount(() => {
    usePromotionStore.get();
    usePromotionStore.getEstablecimiento();
  });
</script>

{#if promotions.length > 0}
  <div class="table-responsive">
    <table class="table table-hover">
      <thead class="thead-light">
        <tr>
          <th scope="col">Promoción</th>
          <th scope="col">Fecha Inicio</th>
          <th scope="col">Fecha Fin</th>
          <th scope="col">Opción</th>
        </tr>
      </thead>
      <tbody>
        {#each promotions as item}
          <tr>
            <th scope="row">{item.description}</th>
            <td>{item.startDate}</td>
            <td>{item.endDate}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-primary"
                on:click={() => usePromotionStore.openingModal(item)}
                ><i class="ti-plus" /> Administrar</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div class="row">
    <div class="col-12">
      <div class="alert alert-danger" role="alert">
        <center>No se encontraron registros</center>
      </div>
    </div>
  </div>
{/if}

<Add />
