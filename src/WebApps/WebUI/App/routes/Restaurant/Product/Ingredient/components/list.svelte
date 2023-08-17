<script lang="ts">
   import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
   import type { IngredientType } from "$core/interfaces/restaurant/ingredient-type";
   import Add from "./add.svelte";

   export let ingredient = [] as Ingredient[];
   export let ingredientType = [] as IngredientType[];
   export let reloadList;

   let edit = {} as Ingredient;
   let isNew = false;


   const editItem = (item) => {
      if (editItem) {
         edit = item;
         isNew = true;
      }
   };

   const closeModal = () => {
		isNew = false;
      reloadList();
	};

</script>
<div class="responsive-table">
   <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col"></th>
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
               <a href="javascript:void(0)" class="btn btn-sm btn-success" on:click={() => editItem(item)}>
                  <i class="fas fa-edit"></i>
               </a>
            <th scope="row">{i + 1}</th>
            <td>
               {#if item.s3ObjectUrl != null && item.s3ObjectUrl != ""}
                  <img src={item.s3ObjectUrl} width="70" class="rounded" alt="" />
               {:else}
                  <img src="https://i.stack.imgur.com/GNhxO.png" width="70" class="rounded" alt="" />
               {/if}

               <span class="mr-5">{item.summary}<span/>
            </td>
            <td>{item.quantity}</td>
            <td>{item.unit}</td>
            <td>{item.content}</td>
         </tr>
      {/each}
      </tbody>
    </table>
</div>
<Add openNew={isNew}
     closeModal={() => closeModal()}
     ingredient={edit}
     ingredientType={ingredientType} />