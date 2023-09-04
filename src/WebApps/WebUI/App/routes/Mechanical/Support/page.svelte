<script lang="ts">
  import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
  import Add from "$routes/Mechanical/Support/components/add.svelte";
  let isNew = false;

  const openNew = () => {
    if (openNew) {
      isNew = true;
    }
  };
  const closeModal = () => {
    isNew = false;
  };
</script>

<Breadcrumbs title={"Soportes"} action={"Nuevo"} openNew={() => openNew()} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
  