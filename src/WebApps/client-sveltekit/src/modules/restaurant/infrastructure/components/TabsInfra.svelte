<script lang="ts">
	import ProductionArea from '$restaurant/infrastructure/production-area/ProductionArea.svelte';
	import Floors from '$restaurant/infrastructure/Floor/Floor.svelte';
	import Rooms from '$restaurant/infrastructure/Room/Room.svelte';
	import Tables from '$restaurant/infrastructure/Table/Table.svelte';
	import Tabs from '$components/Tabs.svelte';

	let items = [
		{
			label: 'Pisos',
			icon: 'fa fa-building',
			value: 1,
			component: Floors
		},
		{
			label: 'Salas',
			icon: 'fa fa-building',
			value: 2,
			component: Rooms
		},
		{
			label: 'Areas de Produccion',
			icon: 'fa fa-kitchen-set',
			value: 3,
			component: ProductionArea
		},
		{
			label: 'Mesas',
			icon: 'fa fa-table',
			value: 4,
			component: Tables
		}
	];
</script>

<Tabs {items} />