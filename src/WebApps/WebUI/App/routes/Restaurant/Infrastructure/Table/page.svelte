<script lang="ts">
  import Breadcrumbs from '$core/components/Breadcrumbs.svelte';
  import Add from './components/add.svelte';
  import List from './components/list.svelte';
  let title = 'Mesas';

  // Modal management
  let isNew = false;
  let reloadList;

  const openNew = () => {
    if (openNew) {
      isNew = true;
    }
  };

  const closeModal = () => {
    isNew = false;
    reloadList();
  };
</script>
<Breadcrumbs {title} action={'Nueva'} openNew={() => openNew()} />
<List bind:reloadList />
<Add openNew={isNew} modalClosed={() => closeModal()} />