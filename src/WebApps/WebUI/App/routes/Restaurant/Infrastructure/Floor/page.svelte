<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { onMount } from "svelte";
	import Add from "./components/add.svelte";
	import List from "./components/list.svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";

	let isNew = false;
	let reloadList;
	let establecimientos = [];
	let codEstab = "";

	onMount(() => {
		getEstabAsign();
	});

	const openNew = () => {
		if (openNew) {
			isNew = true;
		}
	};

	const closeModal = () => {
		isNew = false;
		reloadList();
	};

	const getEstabAsign = () => {
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			if (response) {
				establecimientos = response;
				codEstab = establecimientos[0].codEstab;
			}
		});
	};
</script>

<Breadcrumbs title={"Pisos"} action={"Nueva"} openNew={() => openNew()} />
<div class="form-group">
	<label for="select">Establecimientos</label>
	<select class="form-control" id="select">
		{#each establecimientos as item}
			<option value={item.codEstab}>{item.nombreComercial}</option>
		{/each}
	</select>
</div>
<List bind:reloadList codEstab={codEstab} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
