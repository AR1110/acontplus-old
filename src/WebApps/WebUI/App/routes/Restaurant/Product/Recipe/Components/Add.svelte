<script lang="ts">
    import { onMount } from "svelte";
    import Modal from "$core/components/Modal.svelte";
    import toast from "$core/utils/toast";
    import { IngredientService } from "$core/services/restaurant/ingredient-service";
    export let openNew;
    export let modalClosed;

    onMount(() => {});

    const onModalClose = () => {
        openNew = false;
        modalClosed();
    };

    let ingredientsFounded = [];
    const searchIngredient = () => {
        IngredientService.get({ textSearch: "test" }).then((response) => {
            if (response) {
                ingredientsFounded = response["ingredients"];
            }
        });
    };

    const onSave = () => {};
</script>

{#if openNew}
    <Modal
        open={openNew}
        iconTitle={"ti-plus"}
        title={"Registrar Receta"} 
        onClosed={() => onModalClose()}
    >
        <form on:submit|preventDefault={onSave}>
            <div class="modal-body">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="">Nombre</label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </Modal>
{/if}
