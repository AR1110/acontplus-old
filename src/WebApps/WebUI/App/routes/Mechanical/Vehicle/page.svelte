<script lang="ts">
  import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
  import Add from "$routes/Mechanical/Vehicle/components/add.svelte";
  import List from "$routes/Mechanical/Vehicle/components/list.svelte";

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
</script>

<Breadcrumbs title={"Vehículos"} action={"Nuevo"} openNew={() => openNew()} />
  <List {reloadList} />
  <Add openNew={isNew} modalClosed={() => closeModal()} />
