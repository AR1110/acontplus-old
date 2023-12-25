<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import Add from '$mechanical/vehicle/components/Add.svelte';
	import List from '$mechanical/vehicle/components/List.svelte';
	import { onMount } from 'svelte';
	import { vehicleStore } from '$mechanical/store/vehicle.store';

	let isNew = false;

	const openNew = () => {
		if (openNew) {
			isNew = true;
		}
	};

	const closeModal = () => {
		isNew = false;
		reloadList();
	};

	const reloadList = () => {};

	onMount(() => {
		vehicleStore.get();
	});
</script>

<Breadcrumbs title={'Vehículos'} action={'Nuevo'} openNew={() => openNew()} />
<List />
<Add openNew={isNew} modalClosed={() => closeModal()} />
