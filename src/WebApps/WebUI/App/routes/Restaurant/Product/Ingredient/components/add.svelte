<script lang="ts">
  import { hideLoader, showLoader } from "$lib/utils/loading-spinner";
  import { IngredientService } from "$lib/services/restaurant/ingredient-service";
  import { useIngredientStore } from "$routes/Restaurant/store/ingredientsStore";
  import Modal from "$lib/components/Modal.svelte";
  import toast from "$lib/utils/toast";
  import type { Ingredient } from "$lib/interfaces/restaurant/ingredient";

  let ingredient;
  let ingredientType = [];
  let paramValidation = [undefined, null, "", 0];

  useIngredientStore.subscribe((values) => {
    (ingredient = values.dataUpdate), (ingredientType = values.ingredientType);
  });

  const update = () => {
    if (!onValidate(ingredient)) return;
    showLoader();

    let params = {
      productJson: {
        productId: ingredient.productId,
      },
      ingredientJson: ingredient,
    };

    IngredientService.put(ingredient.id, { data: params }).then((response) => {
      hideLoader();
      console.log(response);
      if (response.status == 200) {
        onModalClose();
        useIngredientStore.get();
        toast({ type: "success", message: response.data.message });
        ingredient = {} as Ingredient;
      } else {
        toast({ type: "warning", message: response.data.message });
      }
    });
  };

  const onValidate = (data: Ingredient) => {
    let isValid = true;

    try {
      if (paramValidation.includes(data.summary)) {
        toast({ type: "error", message: "El resumen es requerido" });
        isValid = false;
      }

      if (paramValidation.includes(data.ingredientTypeId)) {
        toast({ type: "error", message: "El tipo es requerido" });
        isValid = false;
      }
      return isValid;
    } catch (error) {
      toast({ type: "error", message: "Error al validar" });
      return false;
    }
  };

  const onModalClose = () => {
    useIngredientStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
  };
</script>

{#if $useIngredientStore.isOpen}
  <Modal
    open={$useIngredientStore.isOpen}
    iconTitle={ingredient.id > 0 ? "ti-sync" : "ti-plus"}
    title={ingredient.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    size="modal-lg"
  >
    <form on:submit|preventDefault={update} autocomplete="off">
      <div class="modal-body">
        <div class="row">
          <div class="col-6">
            <label for="">Resumen</label>
            <input
              class="form-control form-control-lg"
              type="text"
              bind:value={ingredient.summary}
            />
          </div>
          <div class="col-6">
            <label for="">Tipo</label>
            <select
              class="form-control form-control-lg"
              bind:value={ingredient.ingredientTypeId}
            >
              {#each ingredientType as item}
                <option value={item.id}>{item.name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-6">
            <label for="">Cantidad</label>
            <input
              class="form-control form-control-lg"
              type="number"
              bind:value={ingredient.quantity}
            />
          </div>
          <div class="col-6">
            <label for="">Unitario</label>
            <input
              class="form-control form-control-lg"
              type="number"
              bind:value={ingredient.unit}
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <label for="">Contenido</label>
            <textarea
              class="form-control"
              id=""
              rows="3"
              bind:value={ingredient.content}
            />
          </div>
        </div>
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
  </Modal>
{/if}
