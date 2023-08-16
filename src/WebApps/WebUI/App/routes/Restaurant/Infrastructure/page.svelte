<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import TabsInfra from "./Components/TabsInfra.svelte";
</script>

<Breadcrumbs title={"Infraestructura"} action={""} openNew={null} />
<div class="card">
	<div class="card-body">
		<TabsInfra />
	</div>
</div>
