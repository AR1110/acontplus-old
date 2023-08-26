<script lang="ts">
  import type { Item } from "$core/interfaces/restaurant/item";
  import type { Recipe } from "$core/interfaces/restaurant/recipe.js";
  import { RecipeService } from "$core/services/restaurant/recipe-service";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";

  import Add from "./add.svelte";

  export let items;
  export let ingredientes;
  export let reloadList;

  // Local variables
  let isNew = false;
  let edit = {} as Item;
  let listRecipe = [] as Recipe[];

  // For pagination
  let page = 0;
  let pageIndex = 0;
  let pageSize = 10;



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

  function onPageChange(event) {
    console.log(event.detail.page);
  }

  function editItem (item) {
    if (editItem) {
      edit = item;
      isNew = true;
    }
  };

  function closeModal () {
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
      <!-- <div slot="bottom">
        <Pagination
          {page}
          {pageSize}
        
          
        />
      </div> -->
    </table>
  </div>
{:else}
  <p class="text-center text-italic">No hay items registrados</p>
{/if}

<Add
  openNew={isNew}
  modalClosed={() => closeModal()}
  data={edit}
  {ingredientes}
  recipe={listRecipe}
/>
