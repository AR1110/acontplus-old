<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { estabAsignService } from '$modules/restaurant/services/estab-asign-service';
	import { onMount } from 'svelte';
	import Add from './componets/add.svelte';
	import List from './componets/list.svelte';
	import { roomService } from '$restaurant/services/room-service';
	import SelectEstablecimiento from '../Components/SelectEstablecimiento.svelte';
	import { hideLoader, showLoader } from '$utils/loading-spinner';
	import { floorService } from '$restaurant/services/floor-service';
	import type { Floor } from '$restaurant/interfaces/floor';

	let establecimientos = [];
	let rooms = [];
	let floors = [] as Floor[];

	let isNew = false;
	let codEstab = '';

	onMount(async () => {
		getCodEstab();
	});

	const getCodEstab = () => {
		showLoader();
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			hideLoader();
			if (response) {
				establecimientos = response;
				codEstab = establecimientos[0].codEstab;
				getRooms(codEstab);
				getFloors(codEstab);
			}
		});
	};

	const getRooms = (codEstab: string) => {
		if (!isExistCodEstab(codEstab)) return;

		showLoader();
		roomService.getByCode(codEstab).then((response) => {
			hideLoader();
			if (response) {
				rooms = response;
			}
		});
	};

	const getFloors = (codEstab) => {
		floorService.getByCode(codEstab).then((response) => {
			if (response) {
				floors = response;
			}
		});
	};

	const isExistCodEstab = (codEstab: string) => {
		if (codEstab === undefined || codEstab === null || codEstab === '') {
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

<!-- <Breadcrumbs title={'Salas'} action={'Nueva'} openNew={() => openNew()} /> -->
<div class="row mt-2 mb-2">
	<div class="col-6">
		<button type="button" class="btn btn-info" on:click={() => openNew()}>
			<i class="ti-plus"></i> Registrar Sala</button
		>
	</div>
</div>
<SelectEstablecimiento {establecimientos} {changeEstab} />
<List {reloadList} {rooms} {floors} />
<Add openNew={isNew} modalClosed={() => closeModal()} {floors} />
