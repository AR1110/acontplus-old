<script lang="ts">
  import { usePromotionStore } from "$routes/Restaurant/store/promotionStore";
  import { onDestroy, onMount } from "svelte";
  import Add from "../../Menus/Components/Add.svelte";
  import type { Promotion } from "$lib/interfaces/restaurant/promotion";
  import type { Establecimiento } from "$lib/interfaces/restaurant/establecimiento";
  let promotions = [] as Promotion[];
  let establecimientos = [] as Establecimiento[];
  let codEstab = "";

  let unsuscribe = usePromotionStore.subscribe((values) => {
    promotions = values.promotions;
    establecimientos = values.establecimientos;
    codEstab = values.codEstab;
  });

  onDestroy(() => {
    unsuscribe();
  });

  const onChangeEstablecimiento = (codEstab: string) => {
    usePromotionStore.update((state) => ({
      ...state,
      codEstab: codEstab,
    }));
    usePromotionStore.get({ codEstab: codEstab });
  };

  onMount(() => {
    usePromotionStore.getEstablecimiento();
  });
</script>

<div class="row">
  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12" />
  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
    <div class="form-group">
      <select
        bind:value={codEstab}
        class="form-control form-control-lg"
        id="codEstab"
        on:change={() => onChangeEstablecimiento(codEstab)}
      >
        {#each establecimientos as item}
          <option value={item.codEstab}>
            {item.nombreComercial}
          </option>
        {/each}
      </select>
    </div>
  </div>
</div>

{#if promotions.length > 0}
  <div class="table-responsive">
    <table class="table table-hover">
      <thead class="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Promoción</th>
          <th scope="col">Fecha Inicio</th>
          <th scope="col">Fecha Fin</th>
          <th scope="col">Opción</th>
        </tr>
      </thead>
      <tbody>
        {#each promotions as item}
          <tr>
            <th scope="row">
              <img
                src={item.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png"}
                width="70"
                class="rounded"
                alt=""
              />
            </th>
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
