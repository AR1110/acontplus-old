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
    alert("hola");
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
    alert(JSON.stringify(recipe));
    alert("Datos de pueblo");
  };

  const changeProductionArea = (e) => {
    alert(e.target.value);
  };

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
              <select on:change={() => changeProductionArea(event)}
                class="form-control form-control-lg"
                id="ingredients">
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
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {#each recipe as item}
                <tr>
                  <th scope="row">{item.id}</th>
                  <td>{item.descriptionIngredient}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
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
