<script>
	import { onMount } from "svelte";
	import { client } from "../../../core/api/axiosClient";
	import AdvancedSearch from "../../../core/components/AdvancedSearch.svelte";
	import toast from "../../../core/utils/toast";
	import {
		showLoader,
		hideLoader,
	} from "../../../core/utils/loading-spinner"; 

	export let newRecord;
	export let editStatus;
	export let historyEdited;

	let diseases = [],
		diseasesStatuses = [],
		behaviors = [],
		behaviorsStatuses = [];

	let healthChecks = [];

	let medicalHistory = {
		petId: "",
		date: "",
		healthChecks: [],
		behaviorTests: [],
		observations: "",
	};

	let now = new Date(),
		month,
		day,
		year;

	let dateString;

	onMount(async () => {
		console.log("starting");
		await client.get("/gateway/Diseases/").then((response) => {
			diseases = response;
		});
		await client.get("/gateway/DiseaseStatus/").then((response) => {
			diseasesStatuses = response;
		});
		await client.get("/gateway/Behaviors/").then((response) => {
			behaviors = response;
		});
		await client.get("/gateway/BehaviorStatus/").then((response) => {
			behaviorsStatuses = response;
		});

		(month = "" + (now.getMonth() + 1)),
			(day = "" + now.getDate()),
			(year = now.getFullYear());

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		dateString = [year, month, day].join("-");
		medicalHistory.date = dateString;
	});

	function addDisease(d, ds) {
		healthChecks.push({
			diseaseId: d,
			diseaseStatusId: ds,
		});
	}

	function addDiseaseStatus(d, ds) {
		if (healthChecks.some((check) => check.diseaseId === d)) {
			healthChecks.find(
				(check) => check.diseaseId === d
			).diseaseStatusId = ds;
		} else {
			addDisease(d, ds);
		}
	}

	let behaviorTests = [];
	function addBehavior(d, ds) {
		behaviorTests.push({
			behaviorId: d,
			behaviorStatusId: ds,
		});
	}

	function addBehaviorStatus(d, ds) {
		if (behaviorTests.some((test) => test.behaviorId === d)) {
			behaviorTests.find(
				(test) => test.behaviorId === d
			).behaviorStatusId = ds;
		} else {
			addBehavior(d, ds);
		}
	}

	let value = "";
	let isFocused = false;
	//const onInput = (e) => (value = e.target.value)
	let pets = [];
	const onInput = async (e) => {
		value = e.target.value;
		console.log(value);
		if (value.length >= 3) {
			showLoader();
			let data = {
				tipo: 2,
				textSearch: value,
			};
			await client
				.get(`/gateway/pets/search?json=` + JSON.stringify(data))
				.then((response) => {
					hideLoader();
					if (response.code == 1) {
						pets = JSON.parse(response.payload);
						console.log(pets);
					}
				})
				.catch((error) => {
					hideLoader();
					console.log(error);
				});
		} else if (pets.length > 0) {
			pets = [];
		}
	};
	const onFocus = () => (isFocused = true);
	const onBlur = () => {
		if (!value) {
			pets = [];
			value = "";
		}
	};
	let placeholder = "Buscar cliente/mascota";
	let isPetSelected = false;
	let petSelected = {};
	const selectPet = (e) => {
		isPetSelected = true;
		petSelected = e;
		value = "";
		pets = [];
	};

	const addHistory = async () => {
		if (!petSelected.id) {
			toast({ type: "warning", message: "Debe asignar un cliente" });
			return;
		}
		if (healthChecks.length == 0) {
			toast({
				type: "warning",
				message: "Debe registrar el test de salud",
			});
			return;
		}
		if (behaviorTests.length == 0) {
			toast({
				type: "warning",
				message: "Debe de registrar los test de comportamiento",
			});
			return;
		}
		const newHistory = {
			petId: petSelected.id,
			date: medicalHistory.date,
			healthChecks: healthChecks,
			behaviorTests: behaviorTests,
			observations: medicalHistory.observations,
		};
		await client
			.post("/gateway/MedicalHistories/", newHistory)
			.then((response) => {
				toast({
					type: "success",
					message: "Registrado exitosamente",
				});
				newRecord = false;
				setTimeout(() => {
					window.location.reload();
				}, 500);
			})
			.catch((error) => {
				console.log(error);
			});
		medicalHistory = {};
	};

	const onSubmitHandler = () => {
		addHistory();
	};
	const getHistoryById = async () => {
		await client
			.get("/gateway/MedicalHistories/" + historyEdited.id)
			.then((response) => {
				console.log(response)
				//let tempArray = JSON.parse(response.payload);
				console.log(JSON.parse(response.payload))
			})
			.catch((error) => {
				console.log(error);
			});
		//medicalHistory = historyEdited;
		//console.log(medicalHistory);
	};
	if (editStatus) {
		getHistoryById(historyEdited.id);
	}
</script>

<div class="card">
	<div class="card-body">
		<div class="row">
			<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
				<div class="form-group">
					<div class="input-group">
						<AdvancedSearch
							on:input={onInput}
							on:focus={onFocus}
							on:blur={onBlur}
							{value}
							{placeholder}
						/>
					</div>
					{#if pets.length > 0 && !isPetSelected}
						<div class="floating-results list-group">
							{#each pets as item}
								<a
									href={null}
									class="list-group-item"
									style="cursor:pointer"
									title="Seleccionar"
									on:click={selectPet(item)}
									><i class="fa fa-paw" /> ({item.name}) -
									<i class="ti-user" />
									{item.customer}</a
								>
							{/each}
						</div>{/if}
				</div>
			</div>
		</div>
		{#if (petSelected.id > 0) | editStatus}
			<form on:submit|preventDefault={onSubmitHandler}>
				<div class="row">
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
						<label for="">Fecha</label>
						<input
							type="date"
							name=""
							id=""
							class="form-control"
							bind:value={medicalHistory.date}
						/>
					</div>
				</div>
				<br />
				<div class="card border border-info rounded">
					<div class="card-body">
						<h5 class="card-title">Datos del Responsable</h5>
						<div class="row">
							<div
								class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"
							>
								<div class="form-group">
									<label for="">Cliente</label>
									<input
										type="text"
										class="form-control"
										disabled
										value={petSelected.customer}
									/>
								</div>
							</div>
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
							>
								<div class="form-group">
									<label for="">Ruc</label>
									<input
										type="text"
										class="form-control"
										disabled
										value={petSelected.customerIdCard}
									/>
								</div>
							</div>
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
							>
								<div class="form-group">
									<label for="">Email</label>
									<input
										type="text"
										class="form-control"
										disabled
										value={petSelected.email}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="card border border-info rounded">
					<div class="card-body">
						<h5 class="card-title">Datos de la mascota</h5>
						<div class="row">
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12"
							>
								<div class="form-group">
									<label for="pet-name">Nombre</label>
									<h5>{petSelected.name}</h5>
								</div>
							</div>
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
							>
								<div class="form-group">
									<label for="pet-type">Tipo</label>
									<h5>{petSelected.petType}</h5>
								</div>
							</div>
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
							>
								<div class="form-group">
									<label for="pet-age">Raza</label>
									<h5>{petSelected.breed}</h5>
								</div>
							</div>
						</div>
						<div class="row">
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
							>
								<div class="form-group">
									<label for="pet-age">Sexo</label>
									<h5>{petSelected.gender}</h5>
								</div>
							</div>
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
							>
								<div class="form-group">
									<label for="pet-age">Color</label>
									<h5>{petSelected.color}</h5>
								</div>
							</div>
						</div>
					</div>
				</div>

				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Test de Salud</th>
							{#each diseasesStatuses as item}
								<th>{item.name}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each diseases as d}
							<tr>
								<td>{d.name}</td>
								{#each diseasesStatuses as ds}
									<td
										><input
											type="radio"
											id="{d.id}-chkdds"
											name="{d.id}-chkdds"
											on:change={() =>
												addDiseaseStatus(d.id, ds.id)}
										/></td
									>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>

				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Test de Comportamiento:</th>
							{#each behaviorsStatuses as item}
								<th>{item.name}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each behaviors as d}
							<tr>
								<td>{d.name}</td>
								{#each behaviorsStatuses as ds}
									<td
										><input
											type="radio"
											id="{d.id}-chkbbs"
											name="{d.id}-chkbbs"
											on:change={() =>
												addBehaviorStatus(d.id, ds.id)}
										/></td
									>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="row">
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
						<label for="">Corte y Estilo</label>
						<textarea
							name=""
							id=""
							class="form-control"
							bind:value={medicalHistory.observations}
						/>
					</div>
				</div>

				<button type="submit" class="btn btn-success">
					<i class="ti-save" />
					Guardar
				</button>
			</form>
		{/if}
	</div>
</div>
