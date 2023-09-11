<script lang="ts">
  import { hideLoader } from "./../../../../../core/utils/loading-spinner.js";
  import { itemService } from "$core/services/restaurant/item-service";
  import { showLoader } from "$core/utils/loading-spinner";
  import { useItemStore } from "$routes/Restaurant/store/itemStore.js";
  import GridForItem from "$core/components/GridForItem.svelte";
  import Modal from "$core/components/Modal.svelte";
  import Search from "./search.svelte";
  import toast from "$core/utils/toast";
  import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
  import type { Item } from "$core/interfaces/restaurant/item";
  import type { Recipe } from "$core/interfaces/restaurant/recipe.js";
  import { IngredientService } from "$core/services/restaurant/ingredient-service.js";

  let data;
  let recipes = [] as Recipe[];
  let productionAreas = [];
  let validatorParam = [undefined, null, "", 0];

  let medidas = [];
  let extents = [];

  useItemStore.subscribe((values) => {
    (productionAreas = values.productionAreas),
      (data = values.dataUpdate),
      (recipes = values.recipes);
  });

  //https://jsfiddle.net/biruktes/hn8gascw/24/
  let customNativeSelect = function (cell, onRendered, success, cancel) {
    let medidasByCell = cell.getRow().getData();

    // Validate if medidasByCell.extents is empty.
    if (medidasByCell.extents == undefined) medidas = [];
    if (medidasByCell.extents != undefined)
      medidas = JSON.parse(medidasByCell.extents);

    let cellRealValue = cell.getElement().dataset.extentId;
    cellRealValue =
      typeof cellRealValue === "undefined" ? "none" : cellRealValue;

    //Create and append select list
    let selectList = document.createElement("select");

    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != cellRealValue) {
        success(selectList.selectedOptions[0].value);

        // Store value to cell dataset
        cell.getElement().dataset.descripcion =
          selectList.selectedOptions[0].text;
        cell.getElement().dataset.extentId =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    //submit new value on blur or change
    selectList.addEventListener("blur", onChange);

    //submit new value on enter
    selectList.addEventListener("keydown", function (e) {
      if (e.keyCode == 13) {
        onChange();
      }
      if (e.keyCode == 27) {
        cancel();
      }
    });

    //Create and append the options
    for (let i = 0; i < medidas.length; i++) {
      let option = document.createElement("option");

      option.value = medidas[i].idMedida.toString();
      option.text = medidas[i].descripcion;

      if (medidas[i].idMedida === cellRealValue) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }

    return selectList;
  };

  let updatePrecio = (cell) => {
    let getData = cell.getRow().getData();
    let quantity = getData.quantity;
    let extentId = getData.extentId;
    let extents = getData.extents;
    let precioCosto = getData.precioCosto || 0;

    if (extents == undefined) extents = [];
    if (extents != undefined) extents = JSON.parse(getData.extents);

    for (let i = 0; i < extents.length; i++) {
      if (extents[i].idMedida == extentId) {
        precioCosto = extents[i].precioCosto * quantity;
      }
    }
    cell.getRow().update({ costPrice: precioCosto.toFixed(2) });
  };

  let columns = [
    {
      title: "Ingrediente",
      field: "summary",
      widthGrow: 1,
      with: 250,
    },
    {
      title: "Medida",
      field: "extentId",
      with: 150,
      onUpdate: updatePrecio,
      editor: customNativeSelect,
      formatter: function (cell) {
        let getData = cell.getRow().getData();
        let value = cell.getValue();

        if (getData.extents == undefined) medidas = [];
        if (getData.extents != undefined) medidas = JSON.parse(getData.extents);

        for (let i = 0; i < medidas.length; i++) {
          if (medidas[i].idMedida == value) {
            value = medidas[i].descripcion;
            setTimeout(() => {
              updatePrecio(cell);
            }, 100);
            break;
          }
        }
        return value;
      },
    },
    {
      title: "Peso",
      field: "weight",
      editor: true,
      with: 50,
      validator: ["numeric"],
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
      with: 90,
      editor: true,
      cellEdited: updatePrecio,
      validator: ["required", "numeric"],
    },
    {
      title: "Precio costo",
      field: "costPrice",
      with: 90,
      editor: true,
      formatter: function (cell) {
        let value = 0;
        let quantity = 0;
        let extents = [];

        let getData = cell.getRow().getData();
        let extentId = getData.extentId;

        quantity = getData.quantity;
        if (getData.extents == undefined) extents = [];
        if (getData.extents != undefined) extents = JSON.parse(getData.extents);

        for (let i = 0; i < extents.length; i++) {
          if (extents[i].idMedida == extentId) {
            value = extents[i].precioCosto * quantity;
            break;
          }
        }
        getData.costPrice = value;
        return value.toFixed(2);
      },
      bottomCalc: function (data) {
        let total = 0;
        data.forEach((element) => {
          total += element;
        });
        return total.toFixed(2);
      },
    },
    {
      title: "Acciones",
      widthGrow: 1,
      hozAlign: "center",
      formatter: "buttonCross",
      width: 100,
      align: "center",
      cellClick: function (e, cell) {
        removeFromList(cell.getData().id);
        cell.getRow().delete();
      },
    },
  ];

  const onUpdate = () => {
    if (!onValidation(data)) return;
    if (!validateExtentId(recipes)) return;

    showLoader();
    let newObject = {
      itemJson: data,
      productionAreaJson: { productionAreaId: data.productionAreaId },
      recipeJson: recipes,
    };

    itemService.put(data.id, { data: newObject }).then((response) => {
      hideLoader();
      if (response.status === 200) {
        if (response.data.code == "0") {
          return toast({ type: "warning", message: response.data.message });
        }

        onModalClose();
        useItemStore.get();
        toast({ type: "success", message: response.data.message });
        data = {} as Item;
      } else {
        toast({ type: "warning", message: response.data.message });
      }
    });
  };

  const setOnChange = (ingredient: Ingredient) => {
    let exists = recipes.find((x) => x.ingredientId == ingredient.id);
    if (exists) {
      return toast({ type: "warning", message: "El ingrediente ya existe" });
    }
    onPushRecipe(ingredient, data.id);
  };

  const onPushRecipe = (data: Ingredient, itemId: number) => {
    let newObject = {
      id: 0,
      itemId: itemId,
      extentId: 0,
      productId: data.productId,
      ingredientId: data.id,
      unit: 0,
      weight: 0,
      netWeight: 0,
      summary: data.summary,
      instructions: "",
      quantity: 0,
    };
    useItemStore.update((state) => ({
      ...state,
      recipes: [...state.recipes, newObject],
    }));
    getExtendId(data.productId);
    toast({ type: "success", message: "Agregado" });
  };

  const getExtendId = (productId: number) => {
    let query = { tipo: 3, productId: productId };

    showLoader();
    IngredientService.get(JSON.stringify(query))
      .then((resp) => {
        if (resp) {
          extents = resp["extents"];

          recipes.forEach((e: any) => {
            if (e.productId === productId) {
              e.extentId = extents[0].idMedida;
              e.extents = JSON.stringify(extents);
            }
          });
          useItemStore.update((state) => ({ ...state, recipes: recipes }));
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  const removeFromList = (id: number) => {
    let newArray = recipes.filter((x) => x.id !== id);
    useItemStore.update((state) => ({
      ...state,
      recipes: newArray,
    }));
  };

  // MODALS EVENTS
  const onModalClose = () => {
    useItemStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
    recipes = [];
  };

  // VALIDATIONS
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

  const validateExtentId = (recipe: any) => {
    let isValid = true;
    try {
      if (recipe.length === 0) {
        toast({
          type: "warning",
          message: "Debe seleccionar al menos un ingrediente",
        });
        isValid = false;
      }

      recipe.forEach((element: any) => {
        if (validatorParam.includes(element.extentId)) {
          toast({
            type: "warning",
            message: "Debe seleccionar las medidas de los ingredientes",
          });
          isValid = false;
        } else {
          element.extentId = Number(element.extentId);
        }
      });
      return isValid;
    } catch (error) {
      toast({ type: "error", message: error });
      return false;
    }
  };
</script>

{#if $useItemStore.isOpen}
  <Modal
    open={$useItemStore.isOpen}
    iconTitle={data.id > 0 ? "ti-sync" : "ti-plus"}
    title={data.id > 0
      ? ` Actualizar ${$useItemStore.description.toUpperCase()}`
      : "Registrar"}
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
          <div class="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <div class="form-group">
              <label for="ingredients">Ingredientes</label>
            </div>
          </div>
          <div class="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <Search {setOnChange} />
          </div>
        </div>

        <hr />

        <GridForItem arrayData={recipes} {columns} />

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
