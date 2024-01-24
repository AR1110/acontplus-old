<script lang="ts">
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
</div>