<!-- <script lang="ts">
	import Tabs from '$components/Tabs.svelte';
	import ListSupport from '$mechanical/maintenance/tray/List.svelte';
	import ListInspection from '$mechanical/maintenance/inspection/components/List.svelte';
	let items = [
		{
			label: 'Bandeja',
			icon: 'fa fa-solid fa-folder',
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

<Tabs {items} /> -->

<script>
	import { Tabs, TabList, Tab, TabPanel } from '@theui/sveltekit-components';
	import ListSupport from '$mechanical/maintenance/tray/List.svelte';
	import ListInspection from '$mechanical/maintenance/inspection/components/List.svelte';
</script>

<Tabs>
	<TabList class="nav nav-tabs" id="myTab" role="tablist">
		<Tab class="nav-link"><i class='fa fa-folder'></i> Bandeja</Tab>
		<Tab class="nav-link"><span class="fa fa-file-pdf"></span>  Inspección</Tab>
	</TabList>
	<TabPanel>
		<ListSupport></ListSupport>
	</TabPanel>
	<TabPanel>
		<ListInspection></ListInspection>
	</TabPanel>
</Tabs>
