<script lang="ts">
	import Tabs from '$components/Tabs.svelte';
	import CuentaPorCobrar from './CuentaPorCobrar.svelte';

	let items = [
		{
			icon: '',
			label: 'Reporte de cartera',
			value: 1,
			component: CuentaPorCobrar
		}
	];
</script>

<div class="card">
	<div class="card-body">
		<Tabs {items} />
	</div>
</div>
