<!-- <script lang="ts">
	import ProductionArea from '$restaurant/infrastructure/production-area/ProductionArea.svelte';
	import Floors from '$restaurant/infrastructure/Floor/Floor.svelte';
	import Rooms from '$restaurant/infrastructure/Room/Room.svelte';
	import Tables from '$restaurant/infrastructure/Table/Table.svelte';
	import Tabs from '$components/Tabs.svelte';

	let items = [
		{
			label: 'Pisos',
			icon: 'fa-solid fa-house',
			value: 1,
			component: Floors
		},
		{
			label: 'Salas',
			icon: 'fa-solid fa-building',
			value: 2,
			component: Rooms
		},
		{
			label: 'Areas de Produccion',
			icon: 'fa-solid fa-kitchen-set',
			value: 3,
			component: ProductionArea
		},
		{
			label: 'Mesas',
			icon: 'fa-solid fa-table',
			value: 4,
			component: Tables
		}
	];
</script>

<Tabs {items} /> -->

<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@theui/sveltekit-components';
	import ProductionArea from '$restaurant/infrastructure/production-area/ProductionArea.svelte';
	import Floors from '$restaurant/infrastructure/Floor/Floor.svelte';
	import Rooms from '$restaurant/infrastructure/Room/Room.svelte';
	import Tables from '$restaurant/infrastructure/Table/Table.svelte';
</script>

<Tabs>
	<TabList class="nav nav-tabs" id="myTab" role="tablist">
		<Tab class="nav-link"><i class="fa fa-solid fa-building"></i> Pisos</Tab>
		<Tab class="nav-link"><span class="fa fa-solid fa-building"></span> Salas</Tab>
		<Tab class="nav-link"><span class="fa fa-solid fa-kitchen-set"></span> Areas de Produccion</Tab>
		<Tab class="nav-link"><span class="fa fa-solid fa-table"></span> Mesas</Tab>
	</TabList>
	<TabPanel>
		<Floors></Floors>
	</TabPanel>
	<TabPanel>
		<Rooms></Rooms>
	</TabPanel>
	<TabPanel>
		<ProductionArea></ProductionArea>
	</TabPanel>
	<TabPanel>
		<Tables></Tables>
	</TabPanel>
</Tabs>
