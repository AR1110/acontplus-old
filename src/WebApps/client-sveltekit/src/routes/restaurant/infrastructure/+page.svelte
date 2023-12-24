<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import TabsInfra from '$restaurant/infrastructure/components/TabsInfra.svelte';
</script>

<Breadcrumbs title={'Infraestructura'} action={''} openNew={null} />
<div class="card">
	<div class="card-body">
		<TabsInfra />
	</div>
</div>
