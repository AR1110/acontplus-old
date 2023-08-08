<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	let name = "i am danis manchus";
	let title = "Areas de producción";
	const openNew = () => {};
</script>

<Breadcrumbs {title} action={"nueva"} {openNew} />
<h5>Hi from production {name}</h5>
