<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import { onMount } from 'svelte';
	import Add from './components/add.svelte';
	import List from './components/list.svelte';
	import { estabAsignService } from '$modules/restaurant/services/estab-asign-service';
	import { tableService } from '$restaurant/services/table-service';
	import SelectEstablecimiento from '../Components/SelectEstablecimiento.svelte';
	import { hideLoader, showLoader } from '$utils/loading-spinner';
	import type { Room } from '$restaurant/interfaces/room';
	import { roomService } from '$restaurant/services/room-service';
	let title = 'Mesas';

	// Modal management
	let establecimientos = [];
	let codEstab = '';
	let tables = [];
	let rooms = [] as Room[];
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
				getRooms(codEstab);
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

	let getRooms = (codEstab: string) => {
		roomService.getByCode(codEstab).then((response) => {
			if (response) {
				rooms = response;
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

<!-- <Breadcrumbs {title} action={'Nueva'} openNew={() => openNew()} /> -->
<div class="row mt-2 mb-2">
	<div class="col-6">
		<button type="button" class="btn btn-info" on:click={() => openNew()}>
			<i class="ti-plus"></i> Registrar Mesa</button
		>
	</div>
</div>
<SelectEstablecimiento {establecimientos} {changeEstab} />
<List {reloadList} {tables} {rooms} />
<Add openNew={isNew} modalClosed={() => closeModal()} {rooms} />
