<script lang="ts">
  import { itemService } from "$core/services/restaurant/item-service";
  import Modal from "$core/components/Modal.svelte";
  import type { Item } from "$core/interfaces/restaurant/item";
  import type { ProductionArea } from "$core/interfaces/restaurant/production-area";
  import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
  import type { Recipe } from "$core/interfaces/restaurant/recipe";

  import { productionAreaService } from "$core/services/restaurant/production-area-service";
  import { onMount } from "svelte";
  import toast from "$core/utils/toast";

  export let openNew;
  export let modalClosed;
  export let data = {} as Item;
  export let ingredientes = [] as Ingredient[];

  let productionAreas = [] as ProductionArea[];
  let recipe = [] as Recipe[];

  onMount(() => {
    getProductionArea();
  });

  const getProductionArea = () => {
    productionAreaService.get().then((res) => {
      if (res) productionAreas = res;
    });
  };

  const onUpdate = () => {
    let newObject = {
      itemJson: data,
      productionAreaJson: { productionAreaId: data.productionAreaId },
      recipeJson: recipe,
    };

    itemService.put(data.id, { data: newObject }).then((res) => {
      if (res.status === 200) {
        onModalClose();
        toast({ type: "success", message: res.data.message });
        data = {} as Item;
      } else {
        toast({ type: "warning", message: res.data.message });
      }
    });
  };

  const onPushRecipe = (data: Ingredient, itemId: number) => {
    recipe.push({
      id: 0,
      unit: 0,
      weight: 0,
      netWeight: 0,
      createdAt: "",
      updatedAt: "",
      enabled: true,
      deleted: false,
      userId: 0,
      ingredientId: data.id,
      descriptionIngredient: data.summary,
      instructions: "",
      quantity: 0,
      itemId: itemId,
    });

    recipe = [...recipe];
  };

  const changeProductionArea = (e) => {
    let id = parseInt(e.target.value);
    let filter = ingredientes.filter((x) => x.id == id);

    let index = filter[0];
    onPushRecipe(index, data.id);
  };

  const removeRecipe = (index: number) => {
    console.log(recipe);
   let newRecipe =  recipe.splice(index, 1);
   console.log(newRecipe);
    recipe = [...newRecipe];
  }

  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
</script>

{#if openNew}
  <Modal
    open={openNew}
    iconTitle={data.id > 0 ? "ti-sync" : "ti-plus"}
    title={data.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form on:submit|preventDefault={onUpdate} autocomplete="off">
        <div class="row">
          <div class="col-6">
            <div class="form-group input-group-lg">
              <label for="production-area">Areas de producción</label>
              <select
                bind:value={data.productionAreaId}
                class="form-control"
                id="production-area"
              >
                <option disabled>seleccione</option>
                {#each productionAreas as productionArea}
                  <option value={productionArea.id}>
                    {productionArea.description}
                  </option>
                {/each}
              </select>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="summary">Resumen</label>
              <input
                bind:value={data.summary}
                class="form-control form-control-lg"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-6">
            <div class="form-group">
              <label for="recipe">Receta</label>
              <textarea
                bind:value={data.recipe}
                class="form-control"
                id="recipe"
                rows="3"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="instructions">Instrucciones</label>
              <textarea
                bind:value={data.instructions}
                class="form-control"
                id="instructions"
                rows="3"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label for="instructions">Contenido</label>
              <textarea
                bind:value={data.content}
                class="form-control"
                id="instructions"
                rows="3"
              />
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label for="ingredients">Ingredientes</label>
              <select
                on:change={() => changeProductionArea(event)}
                class="form-control form-control-lg"
                id="ingredients"
              >
                {#each ingredientes as ingrediente}
                  <option value={ingrediente.id}>
                    {ingrediente.summary}
                  </option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Ingrediente</th>
                <th scope="col">Unit</th>
                <th scope="col">Peso</th>
                <th scope="col">Peso neto</th>
                <th scope="col">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {#each recipe as item, index}
                <tr>
                  <th scope="row">
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      on:click={() => {removeRecipe(index)}}
                    >
                      <i class="ti-trash" />
                    </button>
                  <td>{item.descriptionIngredient}</td>
                  <td>
                    <input
                      bind:value={item.unit}
                      class="form-control form-control-sm"
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      bind:value={item.weight}
                      class="form-control form-control-sm"
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      bind:value={item.netWeight}
                      class="form-control form-control-sm"
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      bind:value={item.quantity}
                      class="form-control form-control-sm"
                      type="number"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">
            <i class="ti-save" /> Guardar</button
          >
          <button
            type="button"
            class="btn btn-dark"
            on:click={() => onModalClose()}>&times; Cerrar</button
          >
        </div>
      </form>
    </div>
  </Modal>
{/if}
