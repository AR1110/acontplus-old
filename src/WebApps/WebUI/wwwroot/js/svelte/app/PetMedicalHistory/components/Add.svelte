<script>
	import { onMount } from "svelte";
	import { client } from "../../../core/api/axiosClient";
	import AdvancedSearch from "../../../core/components/AdvancedSearch.svelte";
	import toast from "../../../core/utils/toast";
	export let newRecord
	
	let diseases = [],
		diseasesStatuses = [],
		behaviors = [],
		behaviorsStatuses = [];

	let healthChecks = [];

	let medicalHistories = []

	onMount(async () => {
		console.log("starting");
		await client.get("/gateway/Diseases/").then((response) => {
			diseases = response;
			//console.log("diseases =>", diseases);
		});
		await client.get("/gateway/DiseaseStatus/").then((response) => {
			diseasesStatuses = response;
			//console.log("diseasesStatuses =>", diseasesStatuses);
		});
		await client.get("/gateway/Behaviors/").then((response) => {
			behaviors = response;
			//console.log("behaviors =>", behaviors);
		});
		await client.get("/gateway/BehaviorStatus/").then((response) => {
			behaviorsStatuses = response;
			//console.log("behaviorsStatuses => ", behaviorsStatuses);
		});
	});

	let medicalHistory = {
		petId: "",
		date: "",
		healthChecks: [],
		behaviorTests: [],
		observations: "",
	};

	function addDesease(d, ds) {
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
			addDesease(d, ds);
		}
		//console.log(healthChecks);
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
		//console.log(behaviorTests);
	}

	let value = "";
	let isFocused = false;
	//const onInput = (e) => (value = e.target.value)
	let pets = [];
	const onInput = async (e) => {
		value = e.target.value;
		console.log(value);
		if (value.length >= 3) {
			let data = {
				textSearch: value,
			};
			await client
				.get(`/gateway/pets/search/` + value)
				.then((response) => {
					pets = response;
					console.log(pets);
				});
		}
	};
	const onFocus = () => (isFocused = true);
	const onBlur = () => (isFocused = false);
	let placeholder = "Buscar cliente/mascota";
	let isPetSelected = false;
	let petSelected = {};
	const selectPet = (e) => {
		isPetSelected = true;
		petSelected = e;
		console.log(e);
	};

	const addHistory = async () => {
		if (!petSelected.id) {
			toast({ type: "warning", message: "Debe asignar un cliente" });
			return;
		}
		// if (!pet.petTypeId) {
		// 	toast({ type: "warning", message: "Debe seleccionar una especie" });
		// 	return;
		// }
		// if (!pet.genderId) {
		// 	toast({ type: "warning", message: "Debe seleccionar el sexo" });
		// 	return;
		// }
		const newHistory = {
			petId: petSelected.id,
			date: medicalHistory.date,
			healthChecks: healthChecks,
			behaviorTests: behaviorTests,
			observations: medicalHistory.observations,
		};
		console.log(newHistory);
		await client
			.post("/gateway/MedicalHistories/", newHistory)
			.then((response) => {
				toast({
					type: "success",
					message: "Registrada exitosamente",
				});
				newRecord = false
				setTimeout(() => {
					window.location.reload()
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
</script>

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
							href="#"
							class="list-group-item"
							on:click={selectPet(item)}
							><i class="ti-user" /> - {item.name}
							- {item.customerId}</a
						>
					{/each}
				</div>{/if}
		</div>
	</div>
</div>

<hr />
{#if petSelected.id > 0}
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
		<div class="row">
			<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
				<div class="form-group">
					<label for="">Cliente</label>
					<!-- <input
					type="text"
					class="form-control"
					disabled
					value={clientSelected.nombreFiscal}
				/> -->
				</div>
			</div>
			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
				<div class="form-group">
					<label for="">Ruc</label>
					<input
						type="text"
						class="form-control"
						disabled
						value={petSelected.customerId}
					/>
				</div>
			</div>
			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
				<div class="form-group">
					<label for="">Email</label>
					<!-- <input
					type="text"
					class="form-control"
					disabled
					value={clientSelected.correo}
				/> -->
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
				<div class="form-group">
					<label for="pet-name">Nombre</label>
					<input
						bind:value={petSelected.name}
						type="text"
						class="form-control"
						id="pet-name"
						placeholder="Nombre"
						disabled
						required
					/>
				</div>
			</div>
			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
				<div class="form-group">
					<label for="pet-age">Edad</label>
					<input
						type="number"
						id="pet-age"
						class="form-control"
						step="any"
						required
						disabled
						bind:value={petSelected.age}
					/>
				</div>
			</div>
		</div>

		<table class="table table-bordered">
			<caption><h5>Test de Salud:</h5></caption>
			<thead>
				<tr>
					<th />
					{#each diseasesStatuses as item}
						<th>{item.name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each diseases as d}
					<tr>
						<th>{d.name}</th>
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
			<caption><h5>Test de Comportamiento:</h5></caption>
			<thead>
				<tr>
					<th />
					{#each behaviorsStatuses as item}
						<th>{item.name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each behaviors as d}
					<tr>
						<th>{d.name}</th>
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
