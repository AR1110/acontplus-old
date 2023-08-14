<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
	import { onMount } from "svelte";
	import Add from "./componets/add.svelte";
	import List from "./componets/list.svelte";
	import { roomService } from "$core/services/restaurant/room-service";

	let establecimientos = [];
	let rooms = [];

	let isNew = false;
	let codEstab = "";

	onMount(async () => {
		getCodEstab();
	});

	const getCodEstab = () => {
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			if (response) {
				establecimientos = response;
				codEstab = establecimientos[0].codEstab;
				getRooms(codEstab);
			}
		});
	};

	const getRooms = (codEstab: string) => {
		if (!isExistCodEstab(codEstab)) return;

		roomService.getByCode(codEstab).then((response) => {
			if (response) {
				rooms = response;
			}
		});
	};

	const isExistCodEstab = (codEstab: string) => {
		if (codEstab === undefined || codEstab === null || codEstab === "") {
			return false;
		}
		return true;
	};

	const changeEstab = (event) => {
		codEstab = event.target.value;
		getRooms(codEstab);
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
		getRooms(codEstab);
	};
</script>

<Breadcrumbs
	title={"Salas"}
	action={"Nueva"}
	openNew={() => openNew()}
	select={true}
	bind:establecimientos
 	selectEstab={changeEstab}
/>
<List reloadList={reloadList} {rooms} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
