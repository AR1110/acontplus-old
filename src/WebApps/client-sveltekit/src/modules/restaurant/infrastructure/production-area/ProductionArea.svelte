<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import Add from './components/add.svelte';
	import List from './components/list.svelte';

	let title = 'Areas de producción';
	let isNew = false;
	let reloadList;

	const openNew = () => {
		if (openNew) {
			isNew = true;
		}
	};

	const closeModal = () => {
		isNew = false;
		reloadList();
	};
</script>

<!-- <Breadcrumbs {title} action={'nueva'} openNew={() => openNew()} /> -->
<div class="row mt-2 mb-2">
	<div class="col-6">
		<button type="button" class="btn btn-info" on:click={() => openNew()}>
			<i class="ti-plus"></i> Registrar Área</button
		>
	</div>
</div>
<List bind:reloadList />
<Add openNew={isNew} modalClosed={() => closeModal()} />
