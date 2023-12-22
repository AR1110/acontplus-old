<script lang="ts">
    import Breadcrumbs from "$components/Breadcrumbs.svelte";
    let title = "Categoria";
    let isnew;
    let openNew = () => {
      if (openNew) {
        console.log("is open new");
      }
    };
  </script>
  
  <Breadcrumbs {title} action={"Nueva"} openNew={() => openNew()} />
  