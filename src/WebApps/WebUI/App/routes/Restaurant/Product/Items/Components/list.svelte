<script lang="ts">
	import { hideLoader, showLoader } from './../../../../../core/utils/loading-spinner.js';
  import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
  import type { Item } from "$core/interfaces/restaurant/item";
  import { RecipeService } from "$core/services/restaurant/recipe-service";
  import Add from "./add.svelte";
  import type { Recipe } from '$core/interfaces/restaurant/recipe.js';

  export let items = [] as Item[];
  export let ingredientes = [] as Ingredient[];
  export let reloadList;

  // Local variables
  let edit = {} as Item;
  let isNew = false;
  let listRecipe = [] as Recipe[];

  const editItem = (item) => {
    if (editItem) {
      edit = item;
      isNew = true;
    }
  };

  const getRecipeById = (item: Item) => {
    showLoader();
    RecipeService.getByItem(item.id).then((response) => {
      hideLoader();
      if (response) {
        listRecipe = response["recipe"];
      }
      editItem(item);
    });
  };

  const closeModal = () => {
    isNew = false;
    reloadList();
  };
</script>

{#if items.length > 0}
  <div class="resposive-table">
    <table class="table">
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col">N°</th>
          <th scope="col">Item</th>
          <th scope="col">Resumen</th>
          <th scope="col">Cocinado</th>
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
                on:click={() => getRecipeById(item)}
              >
                <i class="fas fa-edit" />
              </a>
            </th>
            <th>{index + 1}</th>
            <td>
              <img src={item.s3ObjectUrl} width="70" class="rounded" alt="" />
              {item.descripcion}
            </td>
            <td>{item.summary}</td>
            <td>
              {#if item.cooking}
                <i class="fas fa-check text-success" />
              {:else}
                <i class="fas fa-times text-danger" />
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div class="alert alert-info" role="alert">No hay items registrados</div>
{/if}


<Add
  openNew={isNew}
  modalClosed={() => closeModal()}
  data={edit}
  ingredientes={ingredientes}
  recipe={listRecipe}
/>
