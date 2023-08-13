<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { onMount } from "svelte";
	import Add from "./components/add.svelte";
	import List from "./components/list.svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
	import toast from "$core/utils/toast";
	import { floorService } from "$core/services/restaurant/floor-service";

	let establecimientos = [];
	let codEstab = "";
	let floors = [];

	let isNew = false;

	onMount(() => {
		getCodEstab();
	});
	const getCodEstab = () => {
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			if (response) {
				establecimientos = response;
				codEstab = establecimientos[0].codEstab;
				getFloors(codEstab);
			}
		});
	};

	let getFloors = (codEstab: string) => {
		if (!isExistsCodEstab(getCodEstab)) {
			return toast({
				type: "warning",
				message: "Seleccione un establecimiento",
			});
		}

		floorService.getByCode(codEstab).then((response) => {
			if (response) {
				floors = response;
				console.log(floors);
			}
		});
	};

	const isExistsCodEstab = (codEstab) => {
		console.log(codEstab);
		if (codEstab === undefined || codEstab === null || codEstab === "") {
			return false;
		}
		return true;
	};

	const openNew = () => {
		if (openNew) {
			isNew = true;
		}
	};

	const closeModal = () => {
		isNew = false;
		getFloors(codEstab);
	};

	const selectEstab = (e) => {
		getFloors(codEstab);
	};

	const reloadList = () => {
		getFloors(codEstab);
	};
</script>

<Breadcrumbs
	title={"Pisos"}
	action={"Nueva"}
	openNew={() => openNew()}
	select={true}
	bind:establecimientos
	{selectEstab}
/>

<List reloadList={reloadList} {floors} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
