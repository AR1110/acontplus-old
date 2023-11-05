<script lang="ts">
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import Add from "./components/add.svelte";
	import List from "./components/list.svelte";


	let title = "Areas de producción";
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

<Breadcrumbs {title} action={"nueva"} openNew={() => openNew()} />
<List bind:reloadList />
<Add openNew={isNew} modalClosed={() => closeModal()} />
