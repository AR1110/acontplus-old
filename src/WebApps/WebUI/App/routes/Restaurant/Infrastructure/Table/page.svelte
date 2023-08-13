<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { onMount } from "svelte";
	import Add from "./components/add.svelte";
	import List from "./components/list.svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
	import { tableService } from "$core/services/restaurant/table-service";
	let title = "Mesas";

	// Modal management
	let establecimientos = [];
	let codEstab = "";
	let tables = [];
	let isNew = false;

	onMount(() => {
		getCodEstab();
	});

	const getCodEstab = () => {
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			if (response) {
				establecimientos = response;
				codEstab = establecimientos[0].codEstab;
				getTable(codEstab);
			}
		});
	};

	const getTable = (codEstab) => {
		tableService.get(codEstab).then((response) => {
			if (response) {
				console.log(response);
				tables = response;
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
		reloadList();
	};

	const changeEstab = (event) => {
		codEstab = event.target.value;
		getTable(codEstab);
	};

	const reloadList = () => {
		getTable(codEstab);
	};
</script>

<Breadcrumbs
	{title}
	action={"Nueva"}
	openNew={() => openNew()}
	select={true}
	bind:establecimientos
	selectEstab={changeEstab}
/>
<List reloadList={reloadList} tables={tables} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
