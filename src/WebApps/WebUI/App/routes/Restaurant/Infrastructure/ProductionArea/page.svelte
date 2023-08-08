<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
  import Add from "./components/add.svelte";
  import List from "./components/list.svelte";
	let name = "i am danis manchus";
	let title = "Areas de producción";

	// Modal management
	let isNew = false;
	const openNew = () => {
		if(openNew){
			isNew = true;
		}
	};

	const closeModal = () => {
		isNew = false;
		setTimeout(() => {
			window.location.reload;
		}, 500);
	};
</script>

<Breadcrumbs {title} action={"nueva"} openNew={() => openNew()} />
<h5>Hi from production {name}</h5>
<List />
<Add openNew={isNew} modalClosed={() => closeModal()}></Add>