<script lang="ts">
  import { hideLoader } from "./../../../../../core/utils/loading-spinner.js";
  import { itemService } from "$core/services/restaurant/item-service";
  import type { Item } from "$core/interfaces/restaurant/item";
  import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
  import Modal from "$core/components/Modal.svelte";
  import toast from "$core/utils/toast";
  import Grid from "$core/components/Grid.svelte";
  import { showLoader } from "$core/utils/loading-spinner";
  import { useItemStore } from "$routes/Restaurant/store/itemStore.js";
  import Search from "./search.svelte";

  //export let modalClosed;
  let data;
  let recipe = [];
  let productionAreas = [];
  let validatorParam = [undefined, null, "", 0];

  const unSuscribe = useItemStore.subscribe((values) => {
    (productionAreas = values.productionAreas),
      (data = values.dataUpdate),
      (recipe = values.recipes);
  });

  const onUpdate = () => {
    if (!onValidation(data)) return;

    showLoader();
    let newObject = {
      itemJson: data,
      productionAreaJson: { productionAreaId: data.productionAreaId },
      recipeJson: recipe,
    };

    console.log(newObject);

    itemService.put(data.id, { data: newObject }).then((response) => {
      hideLoader();
      if (response.status === 200) {
        onModalClose();
        useItemStore.get();
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
    toast({ type: "success", message: "Agregado" });
  };

  const setOnChange = (data: Ingredient) => {
    let exists = recipe.find((x) => x.ingredientId == data.id);
    if (exists) {
      return toast({ type: "warning", message: "El ingrediente ya existe" });
    }
    onPushRecipe(data, data.id);
  };

  const removeFromList = (id: number) => {
    let newArray = recipe.filter((x) => x.id !== id);
    recipe = [];
    recipe.push(...newArray);
  };

  const onModalClose = () => {
    useItemStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
    recipe = [];
  };

  const onValidation = (item: Item) => {
    let isValid = true;
    try {
      if (validatorParam.includes(item.productionAreaId)) {
        toast({
          type: "warning",
          message: "Debe seleccionar un area de producción",
        });
        isValid = false;
      }
      return isValid;
    } catch (error) {
      toast({ type: "error", message: error });
      return false;
    }
  };

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
      validator: ["integer"],
    },
    {
      title: "Peso",
      field: "weight",
      widthGrow: 3,
      editor: true,
      validator: ["numeric"],
    },
    {
      title: "Peso neto",
      field: "netWeight",
      widthGrow: 3,
      editor: true,
      validator: ["required", "numeric"],
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
      validator: ["required", "numeric"],
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
    },
    {
      title: "Acciones",
      widthGrow: 1,
      hozAlign: "center",
      formatter: "buttonCross",
      width: 40,
      align: "center",
      cellClick: function (e, cell) {
        removeFromList(cell.getData().id);
        cell.getRow().delete();
      },
    },
  ];
</script>

{#if $useItemStore.isOpen}
  <Modal
    open={$useItemStore.isOpen}
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
            </div>
          </div>
          <div class="col-6">
            <Search {setOnChange} />
          </div>
        </div>

        <hr />

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
