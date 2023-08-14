<script lang="ts">
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
	import { onMount } from "svelte";
	import Add from "./componets/add.svelte";
	import List from "./componets/list.svelte";
	import { roomService } from "$core/services/restaurant/room-service";
	import SelectEstablecimiento from "../Components/SelectEstablecimiento.svelte";

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

	const changeEstab = (codEstab) => {
		getRooms(codEstab);
	};
</script>

<Breadcrumbs
	title={"Salas"}
	action={"Nueva"}
	openNew={() => openNew()}
/>

<SelectEstablecimiento establecimientos={establecimientos} {changeEstab} />
<List reloadList={reloadList} {rooms} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
