<script lang="ts">
	import { hideLoader } from './../../../../../core/utils/loading-spinner.js';
  import { itemService } from "$core/services/restaurant/item-service";
  import type { Item } from "$core/interfaces/restaurant/item";
  import type { ProductionArea } from "$core/interfaces/restaurant/production-area";
  import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
  import type { Recipe } from "$core/interfaces/restaurant/recipe";
  import { productionAreaService } from "$core/services/restaurant/production-area-service";
  import { onMount } from "svelte";
  import Modal from "$core/components/Modal.svelte";
  import toast from "$core/utils/toast";
  import Grid from "$core/components/Grid.svelte";
  import { showLoader } from "$core/utils/loading-spinner";

  export let openNew;
  export let modalClosed;
  export let data = {} as Item;
  export let ingredientes = [] as Ingredient[];
  export let recipe = [] as Recipe[];

  let productionAreas = [] as ProductionArea[];
  let validatorParam = [undefined, null, "", 0]

  onMount(() => {
    getProductionArea();
  });

  const getProductionArea = () => {
    productionAreaService.get().then((res) => {
      if (res) productionAreas = res;
    });
  };

  const onUpdate = () => {
    if (!onValidation(data)) return;
    if (!onValidationRecipe(recipe)) return;

    showLoader();
    let newObject = {
      itemJson: data,
      productionAreaJson: { productionAreaId: data.productionAreaId },
      recipeJson: recipe,
    };
    itemService.put(data.id, { data: newObject }).then((response) => {
      hideLoader();
      if (response.status === 200) {
        onModalClose();
        toast({ type: "success", message: response.data.message });
        data = {} as Item;
      } else {
        toast({ type: "warning", message: response.data.message });
      }
    });
  };

  const onPushRecipe = (data: Ingredient, itemId: number) => {
    let newObject = {
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
      summary: data.summary,
      instructions: "",
      quantity: 0,
      itemId: itemId,
    };
    recipe.push(newObject);
  };

  const changeProductionArea = (e) => {
    let id = parseInt(e.target.value);
    let filter = ingredientes.find((x) => x.id == id);

    // Verify exists ingredient in array
    let exists = recipe.find((x) => x.ingredientId == filter.id);
    if (exists) {
      toast({ type: "warning", message: "El ingrediente ya existe" });
      return;
    }

    onPushRecipe(filter, data.id);
  };

  const onModalClose = () => {
    openNew = false;
    recipe = [];
    modalClosed();
  };

  const onValidation = (item: Item) => {
    let isValid = true;
    try {
      if (validatorParam.includes(item.productionAreaId)) {
        toast({ type: "warning", message: "Debe seleccionar un area de producción" });
        isValid = false;
      }
      return isValid;
    } catch (error) {
      toast({ type: "error", message: error });
      return false;
    }
  }

  const onValidationRecipe = (recipe) => {
    let isValid = true;
    for (let index = 0; index < recipe.length; index++) {
      const element = recipe[index];
      try {
        if (validatorParam.includes(element.unit)) {
          toast({ type: "warning", message: "Debe ingresar una Unidad" });
          isValid = false;
          return isValid;
        }
        if (validatorParam.includes(element.netWeight)) {
          toast({ type: "warning", message: "Debe ingresar un Peso Neto" });
          isValid = false;
          return isValid;
        }
        if (validatorParam.includes(element.quantity)) {
          toast({ type: "warning", message: "Debe ingresar una Cantidad" });
          isValid = false;
          return isValid;
        }
        return isValid;
        break;
      } catch (error) {
        toast({ type: "error", message: "Debe ingresar los valores requeridos" });
        return false;
      }
    }
  }

  let columns = [
    {
      title: "Ingrediente",
      field: "summary",
      widthGrow: 1,
    },
    {
      title: "Unit",
      field: "unit",
      widthGrow: 1,
      editor: true,
    },
    {
      title: "Peso",
      field: "weight",
      widthGrow: 3,
      editor: true,
    },
    {
      title: "Peso neto",
      field: "netWeight",
      widthGrow: 3,
      editor: true,
    },
    {
      title: "Instrucciones",
      field: "instructions",
      widthGrow: 3,
      editor: true,
    },
    {
      title: "Cantidad",
      field: "quantity",
      widthGrow: 3,
      editor: true,
    },
    {
      title: "Estado",
      field: "enabled",
      widthGrow: 1,
      widthShrink: 0,
      widthFixed: true,
      hozAlign: "center",
      formatter: "tickCross",
      sorter: "boolean",
      editor: true,
    }
  ];
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
                rows="4"
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
                rows="4"
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

        <Grid dataArray={recipe} {columns} />

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

