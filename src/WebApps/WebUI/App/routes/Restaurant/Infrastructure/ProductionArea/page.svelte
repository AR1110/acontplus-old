<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { onMount } from "svelte";
	import Add from "./components/add.svelte";
	import List from "./components/list.svelte";
	import { productionAreaService } from "$core/services/restaurant/production-area-service";

	let title = "Areas de producción";
	let productionAreas = [];
	let isNew = false;

	onMount(() => {
		get();
	});

	const get = () => {
		productionAreaService.get().then((response) => {
			if (response) {
				productionAreas = response.data;
			}
		});
	};

	const openNew = () => {
		if (openNew) {
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
<List items={productionAreas} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
