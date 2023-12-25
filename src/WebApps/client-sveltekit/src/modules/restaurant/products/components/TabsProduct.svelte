<!-- <script lang="ts">
	import Items from '$restaurant/products/Items/Items.svelte';
	import Menus from '$restaurant/products/Menus/Menus.svelte';
	import Ingredient from '$restaurant/products/Ingredient/Ingredient.svelte';
	import Tabs from '$components/Tabs.svelte';
	import Promotion from '$restaurant/products/Promotions/Promotions.svelte';
	let items = [
		{
			icon: 'fa-solid fa-plate-wheat',
			label: 'Productos',
			value: 1,
			component: Items
		},
		{
			icon: 'fa-solid fa-plate-wheat',
			label: 'Menus',
			value: 2,
			component: Menus
		},
		{
			icon: 'fa-solid fa-plate-wheat',
			label: 'Promociones',
			value: 3,
			component: Promotion
		},
		{
			icon: 'fa-solid fa-plate-wheat',
			label: 'Ingredientes',
			value: 4,
			component: Ingredient
		}
	];
</script>

<div class="card">
	<div class="card-body">
		<Tabs {items} />
	</div>
</div> -->

<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@theui/sveltekit-components';
	import Items from '$restaurant/products/Items/Items.svelte';
	import Menus from '$restaurant/products/Menus/Menus.svelte';
	import Ingredient from '$restaurant/products/Ingredient/Ingredient.svelte';
	import Promotion from '$restaurant/products/Promotions/Promotions.svelte';
</script>

<div class="card">
	<div class="card-body">
		<Tabs>
			<TabList class="nav nav-tabs" id="myTab" role="tablist">
				<Tab class="nav-link"><i class="fa fa-plate-wheat"></i> Productos</Tab>
				<Tab class="nav-link"><span class="fa fa-plate-wheat"></span> Menus</Tab>
				<Tab class="nav-link"><span class="fa fa-plate-wheat"></span> Promociones</Tab>
				<Tab class="nav-link"><span class="fa fa-plate-wheat"></span> Ingredientes</Tab>
			</TabList>
			<TabPanel>
				<Items></Items>
			</TabPanel>
			<TabPanel>
				<Menus></Menus>
			</TabPanel>
			<TabPanel>
				<Promotion></Promotion>
			</TabPanel>
			<TabPanel>
				<Ingredient></Ingredient>
			</TabPanel>
		</Tabs>
	</div>
</div>
