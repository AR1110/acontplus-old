<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Add from "./components/add.svelte";
  import List from "./components/list.svelte";
  let title = "Subategoria";
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

<Breadcrumbs {title} action={"Nueva"} openNew={() => openNew()} />
<List />
<Add openNew={isnew} modalClosed={() => closeModal()} />
