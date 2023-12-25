<script lang="ts">
	import Tabs from '$components/Tabs.svelte';
	import Techspec from '$technicalsupport/tech-spec/TechSpec.svelte';

	let items = [
		{
			icon: '',
			label: 'Ficha Técnica',
			value: 1,
			component: Techspec
		}
	];
</script>

<div class="card">
	<div class="card-body">
		<Tabs {items} />
	</div>
</div>
