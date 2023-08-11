<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
  import Add from "./componets/add.svelte";
	import List from "./componets/list.svelte";

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

<Breadcrumbs title={"Salas"} action={'Nueva'} openNew={() => openNew()} />
<List bind:reloadList />
<Add openNew={isNew} modalClosed={() => closeModal()} />
