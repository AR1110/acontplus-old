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

<Add openNew={isnew} modalClosed={() => closeModal()} />
<br />
<List />
