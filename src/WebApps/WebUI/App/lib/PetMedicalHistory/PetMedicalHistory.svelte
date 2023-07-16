<script>
	import { onMount } from "svelte";
	import { client, clientFile } from "../../core/api/axiosClient";
	import Swal from "sweetalert2";
	import toast from "../../core/utils/toast";
	import FileSaver from "file-saver";
	import Search from "../../core/components/Search.svelte";
	import Add from "./components/Add.svelte";
	import { showLoader, hideLoader } from "../../core/utils/loading-spinner";
	//import toast, { Toaster } from 'svelte-french-toast';
	let newRecord = false;

	function openNew(open) {
		newRecord = open;
	}
	let medicalHistories = [];
	onMount(async () => {
		initialLoad();
	});

	const initialLoad = async () => {
		showLoader();
		await client
			.get("/gateway/MedicalHistories/")
			.then((response) => {
				if (response.code == "1") {
					medicalHistories = JSON.parse(response.payload);
				}
			})
			.catch((error) => {
				hideLoader();
				console.log(error);
			});
		hideLoader();
	};

	const getReport = async (id) => {
		//Add authentication headers as params
		// var params = {
		//     access_token: "An access_token",
		//     other_header: "other_header",
		// };

		//Add authentication headers in URL
		//var url = [url_generating_pdf, $.param(params)].join("?");

		//Open window
		//window.open(url);
		showLoader();
		await clientFile(`/gateway/MedicalHistories/Report/` + id)
			.then((response) => {
				var ieEDGE = navigator.userAgent.match(/Edge/g);
				var ie = navigator.userAgent.match(/.NET/g); // IE 11+
				var oldIE = navigator.userAgent.match(/MSIE/g);

				var blob = new window.Blob([response.data], {
					type: "application/pdf",
				});

				if (ie || oldIE || ieEDGE) {
					window.navigator.msSaveBlob(blob, fileName);
				} else {
					var fileURL = URL.createObjectURL(blob);
					window.open(fileURL);
				}
				hideLoader();
				return;
				let fileBlob = new Blob([response.data], {
					type: response.headers["content-type"],
				});
				let objectUrl = window.URL || window.webkitURL;
				let urlFile = objectUrl.createObjectURL(fileBlob);
				// Ajuste horizontal
				let x = parseInt((screen.width - 1200) / 2);
				// Ajustae vertical
				let y = parseInt((screen.height - 650) / 4);
				window.open(
					urlFile,
					"_blank",
					`resizable=yes
					width=1200
					height=650
					screenY=${y}
					screenX=${x}`
				);
				return;
				let serverData = new Blob([response.data], {
					type: response.headers["content-type"],
				});
				// let fileName = response
				//     .headers()["content-disposition"].split(";")[1]
				//     .split("=")[1];
				let fileName = response.headers["content-disposition"]
					.split(";")[1]
					.split("=")[1]
					.replace('"', "");
				fileName = fileName.replace('"', "");
				FileSaver.saveAs(serverData, fileName);
			})
			.catch((error) => {
				hideLoader();
				console.log(error);
			});
	};
	const deleteHistory = async (id) => {
		let { isConfirmed } = await Swal.fire({
			text: "Esta seguro de eliminar este registro?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, proceder!",
			cancelButtonText: "No, cancelar",
		});
		if (isConfirmed) {
			await client
				.delete("/gateway/MedicalHistories/" + id)
				.then((response) => {
					console.log(response);
					toast({
						type: "success",
						message: "Eliminada exitosamente",
					});
					pets = pets.filter((pet) => pet.id !== id);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const formatDate = (inputDate) => {
		let date = new Date(inputDate);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = String(date.getFullYear());

		return `${day}/${month}/${year}`;
	};

	let searchTerm = "";
	let filteredRecords = [];

	const searchRecords = () => {
		return (filteredRecords = medicalHistories.filter((item) => {
			let petName = item.pet.name.toLowerCase();
			return petName.includes(searchTerm.toLowerCase());
		}));
	};

	let editStatus = false;
	let historyEdited = {};

	const editHistory = (item) => {
		//toast({ type: "info", message: "Funcionalidad en construccion" });
		editStatus = true;
		historyEdited = item;
	};
</script>

<div class="row page-titles">
	<div class="col-md-5 align-self-center">
		<h5 class="text-themecolor">Registro Informado de Estetica Canina</h5>
	</div>
	<div class="col-md-7 align-self-center text-right">
		<div class="d-flex justify-content-end align-items-center">
			<button
				type="button"
				on:click={() => openNew(true)}
				class="btn btn-info d-block d-lg-inline-block m-l-15"
			>
				<i class="fa fa-plus-circle" /> Nuevo
			</button>
		</div>
	</div>
</div>
<!-- <Toaster /> -->

{#if newRecord | editStatus}
	<Add {newRecord} {editStatus} {historyEdited} {initialLoad} />
{:else}
	<Search
		bind:searchTerm
		on:input={searchRecords}
		placeholder="Buscar Mascota"
	/>
{/if}

<div class="card">
	<div class="card-body">
		<div class="table-responsive">
			<table class="table">
				<caption>Registros</caption>
				<thead>
					<tr>
						<th>Cliente</th>
						<th>Mascota</th>
						<th>Fecha</th>
						<th>Obs</th>
					</tr>
				</thead>
				<tbody>
					{#each medicalHistories as item}
						<tr>
							<td>{item.customer}</td>
							<td>{item.petName}</td>
							<td> {formatDate(item.date)} </td>
							<td> {item.observations} </td>
							<td>
								<button
									class="btn btn-outline-danger btn-sm"
									on:click={deleteHistory(item.id)}
								>
									<i class="ti-trash" />
								</button>
								<button
									class="btn btn-outline-warning btn-sm"
									on:click={editHistory(item)}
								>
									<i class="ti-pencil" />
								</button>
								<button
									class="btn btn-outline-danger btn-sm"
									on:click={getReport(item.id)}
									title="Obtener Reporte"
								>
									<i class="fa fa-file-pdf" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
<!-- 
<style lang="css">
	/* @import "../dist/css/style.css"; */
	.floating-results {
		position: absolute;
		z-index: 1000;
		width: 100%;
		max-height: 300px;
		overflow-y: auto;
		background-color: #fff;
		border: 1px solid #ced4da;
		border-top: none;
		border-radius: 0 0 0.25rem 0.25rem;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
	}

	.floating-results .list-group-item {
		cursor: pointer;
	}

	.floating-results .list-group-item:hover {
		background-color: #f8f9fa;
	}
</style> -->
