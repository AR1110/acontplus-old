<script lang="ts">
    import { onMount } from "svelte";
    import Search from "svelte-search";
    import Modal from "$core/components/Modal.svelte";
    import toast from "$core/utils/toast";
    import Grid from "$core/components/Grid.svelte";
    import type { Menu } from "$core/interfaces/restaurant/menu";

    export let openNew;
    export let modalClosed;
    const onModalClose = () => {
        openNew = false;
        modalClosed();
    };

    let data = {} as Menu;

    let item = {
        title: "",
    };

    let textSearch = "";

    const searchProduct = () => {
        if (textSearch && textSearch.length >= 3) {
            console.log("searching");
            //toast({ type: "info", message: "searching..." });
        }
    };

    let productsAdded = [];
    let productColumns = [{}];
    const addProduct = () => {};

    const onSave = () => {};
</script>

{#if openNew}
    <Modal
        open={openNew}
        iconTitle={"ti-plus"}
        title={"Registrar Menu"}
        size={"modal-lg"}
        onClosed={() => onModalClose()}
    >
        <form on:submit|preventDefault={onSave}>
            <div class="modal-body">
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="">Descripción</label>
                            <input
                                type="text"
                                class="form-control"
                                bind:value={data.title}
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="">Resumen</label>
                            <textarea
                                class="form-control"
                                bind:value={data.summary}
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <Search
                                hideLabel
                                label="Producto"
                                bind:value={textSearch}
                                placeholder="Buscar producto..."
                                on:type={(e) => {
                                    //console.log("type", e.detail); // input value
                                    searchProduct();
                                }}
                                on:clear={() => {
                                    //console.log("clear");
                                    searchProduct();
                                }}
                            />
                            {#if textSearch}
                                <button
                                    type="button"
                                    class="btn btn-outline-danger btn-sm"
                                    on:click={() => (textSearch = "")}
                                    >Clear "{textSearch}"</button
                                >
                            {/if}
                        </div>
                    </div>
                </div>
                <!-- <div class="row">
                    <div class="col-6">
                        <button
                            class="btn btn-outline-info btn-sm"
                            on:click={addProduct}
                        >
                            <i class="ti-plus" /> Agregar Producto
                        </button>
                    </div>
                </div> -->
                <div class="row">
                    <div class="col-12">
                        <Grid
                            dataArray={productsAdded}
                            columns={productColumns}
                        />
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

<style>
    :global([data-svelte-search] input) {
        width: 100%;
        font-size: 1rem;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border: 1px solid #e0e0e0;
        border-radius: 0.25rem;
    }
</style>
