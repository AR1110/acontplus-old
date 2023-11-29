<script lang="ts">
  import Breadcrumbs from "@/lib/components/Breadcrumbs.svelte";
  import Add from "@/routes/Mechanical/Support/components/add.svelte";
  import List from "./components/list.svelte";
  import { onMount } from "svelte";
  import { supportStore } from "../Store/support.store";

  let isNew = false;

  const openNew = () => {
    if (openNew) {
      isNew = true;
    }
  };

  onMount(() => {
    supportStore.get();
  });
</script>

<Breadcrumbs
  title={"Soportes"}
  action={"Nuevo"}
  openNew={() => supportStore.getOpenModal()}
/>
<Add />
<List />
