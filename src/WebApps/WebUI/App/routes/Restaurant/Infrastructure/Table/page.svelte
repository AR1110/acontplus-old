<script lang="ts">
  import Breadcrumbs from '$core/components/Breadcrumbs.svelte';
  import List from './components/list.svelte';
  let title = 'Mesas';

  // Modal management
  let isNew = false;
  const openNew = () => {
    if (openNew) {
      isNew = true;
    }
  };

  const closeModal = () => {
    isNew = false;
    setTimeout(() => {
      window.location.reload;
    }, 500);
  };
</script>
<Breadcrumbs {title} action={'nueva'} openNew={() => openNew()} />
<List />