<script type="ts">
    let editStatus = false,
        showPopup = false;
    import Add from "./Components/Add.svelte";
    import ListStockFisico from "./Components/list-stock-fisico.svelte";

    const openNew = (open) => {
        showPopup = open;
        if (!open && editStatus) {
            editStatus = false;
            //clean();
        } else {
        }
    };

    const onPopupClose = (data) => {
        showPopup = false; 
    };
</script>

<div class="row page-titles">
    <div class="col-md-5 align-self-center">
        <h5 class="text-themecolor">Stock Físico</h5>
    </div>
    <div class="col-md-7 align-self-center text-right">
        <div class="d-flex justify-content-end align-items-center">
            <button
                type="button"
                on:click={() => openNew(true)}
                class="btn btn-info d-block d-lg-inline-block m-l-15"
            >
                <i class="fa fa-plus-circle" /> Nuevo
            </button>
        </div>
    </div>
</div>
<!-- {#if showForm}
    <ModalNuevo />
{/if} -->

<Add showModal={showPopup} onModalClose={(data) => onPopupClose(data)} />

<ListStockFisico />
