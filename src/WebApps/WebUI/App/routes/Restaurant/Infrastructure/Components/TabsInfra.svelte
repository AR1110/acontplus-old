<script lang="ts">
  import ProductionArea from '../ProductionArea/page.svelte';
  import Floors from '../Floor/page.svelte';
  import Rooms from '../Room/page.svelte';
  import Tables from '../Table/page.svelte';
  import Tabs from '$core/components/Tabs.svelte';

  let items = [
    {
      label: 'Pisos',
      icon: 'fa-solid fa-house',
      value: 1,
      component: Floors,
    },
    {
      label: 'Salas',
      icon: '',
      value: 2,
      component: Rooms,
    },
    {
      label: 'Areas de Produccion',
      icon: '',
      value: 3,
      component: ProductionArea,
    },
    {
      label: 'Mesas',
      icon: '',
      value: 4,
      component: Tables,
    }
  ];
</script>

<Tabs {items} />
