<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import Add from '$mechanical/support/components/Add.svelte';
	import List from '$mechanical/support/components/List.svelte';
	import { onMount } from 'svelte';
	import { supportStore } from '$mechanical/store/support.store';

	let isNew = false;

	const openNew = () => {
		if (openNew) {
			isNew = true;
		}
	};

	onMount(() => {
		supportStore.get();
	});
</script>

<Breadcrumbs title={'Soportes'} action={'Nuevo'} openNew={() => supportStore.getOpenModal()} />
<Add />
<List />
