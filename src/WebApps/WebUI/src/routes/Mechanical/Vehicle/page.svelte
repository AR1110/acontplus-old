<script lang="ts">
  import Breadcrumbs from "@/lib/components/Breadcrumbs.svelte";
  import Add from "@/routes/Mechanical/Vehicle/components/add.svelte";
  import List from "@/routes/Mechanical/Vehicle/components/list.svelte";
  import { onMount } from "svelte";
  import { vehicleStore } from "../Store/vehicle.store";

  let isNew = false;

  const openNew = () => {
    if (openNew) {
      isNew = true;
    }
  };

  const closeModal = () => {
    isNew = false;
    reloadList();
  };

  const reloadList = () => {};

  onMount(() => {
    vehicleStore.get();
  });
</script>

<Breadcrumbs title={"Vehículos"} action={"Nuevo"} openNew={() => openNew()} />
<List />
<Add openNew={isNew} modalClosed={() => closeModal()} />
