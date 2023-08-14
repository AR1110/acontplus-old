<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { onMount } from "svelte";
	import Add from "./components/add.svelte";
	import List from "./components/list.svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
	import { tableService } from "$core/services/restaurant/table-service";
	import SelectEstablecimiento from "../Components/SelectEstablecimiento.svelte";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
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
		showLoader();
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			hideLoader();
			if (response) {
				establecimientos = response;
				codEstab = establecimientos[0].codEstab;
				getTable(codEstab);
			}
		});
	};

	const getTable = (codEstab) => {
		showLoader();
		tableService.get(codEstab).then((response) => {
			hideLoader();
			if (response) {
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

	const reloadList = () => {
		getTable(codEstab);
	};

	const changeEstab = (codEstab) => {
		getTable(codEstab);
	};
</script>

<Breadcrumbs {title} action={"Nueva"} openNew={() => openNew()} />
<SelectEstablecimiento {establecimientos} {changeEstab} />
<List {reloadList} {tables} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
