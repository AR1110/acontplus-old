<script lang="ts">
  import ProductionArea from '../ProductionArea/page.svelte';
  import Floors from '../Floor/page.svelte';
  import Rooms from '../Room/page.svelte';
  import Tables from '../Table/page.svelte';
  import Tabs from '@/lib/components/Tabs.svelte';

  let items = [
    {
      label: 'Pisos',
      icon: 'fa-solid fa-house',
      value: 1,
      component: Floors,
    },
    {
      label: 'Salas',
      icon: 'fa-solid fa-building',
      value: 2,
      component: Rooms,
    },
    {
      label: 'Areas de Produccion',
      icon: 'fa-solid fa-kitchen-set',
      value: 3,
      component: ProductionArea,
    },
    {
      label: 'Mesas',
      icon: 'fa-solid fa-table',
      value: 4,
      component: Tables,
    }
  ];
</script>

<Tabs {items} />
