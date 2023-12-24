<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import TabsMain from '$mechanical/maintenance/components/tabsMain.svelte';
</script>

<Breadcrumbs title={'Mantenimientos'} action={''} openNew={null} />
<div class="card">
	<div class="card-body">
		<TabsMain />
	</div>
</div>
