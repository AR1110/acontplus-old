<script lang="ts">
	import Tabs from '$components/Tabs.svelte';
	import ListSupport from '$mechanical/maintenance/tray/List.svelte';
	import ListInspection from '$mechanical/maintenance/inspection/components/List.svelte';
	let items = [
		{
			label: 'Bandeja',
			icon: 'fa fa-folder',
			value: 2,
			component: ListSupport
		},
		{
			label: 'Inspección',
			icon: 'fa fa-file-pdf',
			value: 1,
			component: ListInspection
		}
	];
</script>

<Tabs {items} /> 