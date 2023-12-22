<script lang="ts">
    import Breadcrumbs from "$components/Breadcrumbs.svelte";
    import Add from "$contabilidad/subcategoria/components/Add.svelte";
    import List from "$contabilidad/subcategoria/components/List.svelte";
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
  