<script lang="ts">
    import Add from "./Components/Add.svelte";
    import List from "./Components/List.svelte";
    let isnew;
    let openNew = () => {
        if (openNew) {
            console.log("is open new");
            isnew = true;
        }
    };
    let closeModal = () => {
        isnew = false;
        setTimeout(() => {
            window.location.reload;
        }, 500);
    };
</script>

<div class="row">
    <div class="col-6">
        <button class="btn btn-outline-info" on:click={openNew}
            ><i class="ti-plus" /> Agregar</button
        >
    </div>
</div>

<List />
<Add openNew={isnew} modalClosed={() => closeModal()} />
