<script lang="ts">
    import { onMount } from "svelte";
    import Modal from "$core/components/Modal.svelte";
    import toast from "$core/utils/toast";
    import type { Recipe } from "$core/interfaces/restaurant/recipe";
    import { IngredientService } from "$core/services/restaurant/ingredient-service";
    import Grid from "$core/components/Grid.svelte";
    export let openNew;
    export let modalClosed;

    let data = {} as Recipe;

    onMount(() => {});

    const onModalClose = () => {
        openNew = false;
        modalClosed();
    };

    let ingredientsFounded = [];
    let ingredient = {
        title: "",
    };
    const searchIngredient = () => {
        IngredientService.get({ textSearch: "test" }).then((response) => {
            if (response) {
                ingredientsFounded = response["ingredients"];
            }
        });
    };

    let itemsFounded = [];
    const searchItems = () => {
        IngredientService.get({ textSearch: "test" }).then((response) => {
            if (response) {
                itemsFounded = response["ingredients"];
            }
        });
    };
    let item = {
        title: "",
    };

    let columns = [
        {
            title: "Ingrediente",
            field: "title",
            widthGrow: 3,
        },
        {
            title: "Cantidad",
            field: "quantity",
            widthGrow: 3,
        },
        {
            title: "Unidad",
            field: "unit",
            widthGrow: 3,
            editor: "input",
            headerSort: false,
            editorParams: {
                selectContents: true,
            },
        },
    ];
    let ingredientsAdded = [];
    const addIngredient = () => {
        ingredientsAdded.push({
            title: ingredient.title,
            quantity: data.quantity,
            unit: data.unit,
        });
    };
    const onSave = () => {};
</script>

{#if openNew}
    <Modal
        open={openNew}
        iconTitle={"ti-plus"}
        title={"Registrar Receta"}
        size={"modal-lg"}
        onClosed={() => onModalClose()}
    >
        <form on:submit|preventDefault={onSave}>
            <div class="modal-body">
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="">Producto</label>
                            <input
                                type="text"
                                class="form-control"
                                bind:value={item.title}
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="">Ingrediente</label>
                            <input
                                type="text"
                                class="form-control"
                                bind:value={ingredient.title}
                            />
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <label for="">Cantidad</label>
                            <input
                                type="number"
                                class="form-control"
                                step="any"
                                bind:value={data.quantity}
                            />
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <label for="">Unidad</label>
                            <input
                                type="text"
                                class="form-control"
                                bind:value={data.unit}
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <button
                            class="btn btn-outline-info btn-sm"
                            on:click={addIngredient}
                        >
                            <i class="ti-plus" /> Agregar Ingrediente
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <Grid dataArray={ingredientsAdded} {columns} />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-success">
                    <i class="ti-save" /> Guardar
                </button>
                <button
                    type="button"
                    class="btn btn-dark"
                    on:click={() => onModalClose()}>&times; Cerrar</button
                >
            </div>
        </form>
    </Modal>
{/if}
