<script lang="ts">
	import { hideLoader, showLoader } from '$core/utils/loading-spinner.js';
	import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
	import { onMount } from "svelte";
	import Add from "./components/add.svelte";
	import List from "./components/list.svelte";
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
	import toast from "$core/utils/toast";
	import { floorService } from "$core/services/restaurant/floor-service";
	import SelectEstablecimiento from "../Components/SelectEstablecimiento.svelte";

	let establecimientos = [];
	let codEstab = "";
	let floors = [];

	let isNew = false;

	onMount(() => {
		getCodEstab();
	});
	const getCodEstab = () => {
		showLoader()
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			hideLoader()
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

		showLoader();
		floorService.getByCode(codEstab).then((response) => {
			hideLoader();
			if (response) {
				floors = response;
			}
		});
	};

	const isExistsCodEstab = (codEstab) => {
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
		getCodEstab();
	};

	const changeEstab = (codEstab) => {
		getFloors(codEstab);
	};
</script>

<Breadcrumbs title={"Pisos"} action={"Nueva"} openNew={() => openNew()} />
<SelectEstablecimiento {establecimientos} {changeEstab} />
<List {reloadList} {floors} />
<Add openNew={isNew} modalClosed={() => closeModal()} />
