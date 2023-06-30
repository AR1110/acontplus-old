<!-- svelte-ignore tag-option-deprecated -->
<svelte:options tag="pet-app" />

<script>
	import { v4 } from "uuid";
	import { onMount } from "svelte";
	import axios from "axios";
	//import jwt_decode from "jwt-decode"
	import { client } from "./axiosClient";
	import toast from "./toast";
	import Swal from "sweetalert2";
	import Search from "./Search.svelte";
	console.log("amazing svelte yeyey");
	let quotes = [];
	let error = null;
	// onMount(async () => {
	// 	try {
	// 		console.log("inside axios request")
	// 		const res = await axios.get(
	// 			`http://localhost:57340/gateway/PetSexes/`
	// 		)
	// 		quotes = res.data
	// 		console.log(quotes)
	// 	} catch (e) {
	// 		error = e
	// 	}
	// })
	let petSexes = [],
		petBreeds = [],
		petTypes = [],
		pets = [];

	// const cat = localStorage.getItem("ngStorage-currentUser")
	// const objToken = JSON.parse(cat)
	// console.log(objToken.token)
	// var decodedJwt = jwt_decode(objToken.token)
	// console.log(decodedJwt)
	const initialLoad = async () => {
		// console.log("inside axios request")
		// const res = await axios.get(
		// 	`${decodedJwt.urlGateway}/gateway/PetSexes/`,
		// 	{
		// 		headers: {},
		// 		params: {},
		// 	}
		// )
		// petSexes = res.data
		// console.log(res.data)
		await client.get("/gateway/Pets/").then((response) => {
			pets = response;
			console.log("pets =>", pets);
		});
		await client.get("/gateway/PetSexes/").then((response) => {
			petSexes = response;
			console.log("petSexes =>", petSexes);
		});
		await client.get("/gateway/PetTypes/").then((response) => {
			petTypes = response;
			console.log("petTypes =>", petTypes);
		});
		await client.get("/gateway/PetBreeds/").then((response) => {
			petBreeds = response;
			console.log("breeds => ", petBreeds);
		});
	};

	initialLoad();

	let pet = {
		id: "",
		clientUniqueId: "",
		companyUniqueId: "",
		name: "",
		petTypeId: "",
		petBreedId: "",
		petSexId: "",
		age: "",
		color: "",
	};

	let editStatus = false;

	const cleanPet = () => {
		pet = {};
	};
	let showForm = false;
	const openNew = (open) => {
		showForm = open;
		if (!open && editStatus) {
			editStatus = false;
			cleanPet();
		}
	};
	const addPet = async () => {
		if (!clientSelected.numeroIdentificacion) {
			toast({ type: "warning", message: "Debe asignar un cliente" });
			return;
		}
		if (!pet.petTypeId) {
			toast({ type: "warning", message: "Debe seleccionar una especie" });
			return;
		}
		if (!pet.petSexId) {
			toast({ type: "warning", message: "Debe seleccionar el sexo" });
			return;
		}
		const newPet = {
			clientUniqueId: clientSelected.numeroIdentificacion,
			companyUniqueId: clientSelected.rucEmpresa,
			name: pet.name,
			petTypeId: pet.petTypeId,
			petBreedId: pet.petBreedId,
			petSexId: pet.petSexId,
			age: pet.age,
			color: pet.color,
		};
		await client
			.post("/gateway/Pets/", newPet)
			.then((response) => {
				console.log(response);
				toast({
					type: "success",
					message: "Registrada exitosamente",
				});
				openNew(false);
				initialLoad();
			})
			.catch((error) => {
				console.log(error);
			});
		cleanPet();
	};

	const deletePet = async (id) => {
		let { isConfirmed } = await Swal.fire({
			text: "Esta seguro de eliminar esta mascota",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, proceder!",
			cancelButtonText: "No, cancelar",
		});
		if (isConfirmed) {
			await client
				.delete("/gateway/Pets/" + id)
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

	const editPet = (petEdited) => {
		editStatus = true;
		pet = petEdited;
	};

	const updatePet = async () => {
		let updatedpet = {
			id: pet.id,
			clientUniqueId: pet.clientUniqueId,
			companyUniqueId: pet.companyUniqueId,
			name: pet.name,
			petType: pet.petType,
			petTypeId: pet.petTypeId,
			petBreed: pet.petBreed,
			petBreedId: pet.petBreedId,
			petSex: pet.petSex,
			petSexId: pet.petSexId,
			age: pet.age,
			color: pet.color,
			enabled: pet.enabled,
		};

		await client
			.put("/gateway/Pets/" + updatedpet.id, updatedpet)
			.then((response) => {
				const petIndex = pets.findIndex((p) => p.id === pet.id);
				pets[petIndex] = updatedpet;
				console.log(response);
				toast({
					type: "success",
					message: "Actualizada exitosamente",
				});
				openNew(false);
				initialLoad();
			})
			.catch((error) => {
				console.log(error);
			});

		cleanPet();
		editStatus = false;
	};

	const onSubmitHandler = () => {
		if (!editStatus) {
			addPet();
		} else {
			updatePet();
		}
	};

	function disablePet(item) {
		pet = item;
		//console.log(pet)
		updatePet();
	}

	import Input from "./Input.svelte";
	let value = "";
	let isFocused = false;
	//const onInput = (e) => (value = e.target.value)
	let clients = [];
	const onInput = async (e) => {
		value = e.target.value;
		console.log(value);
		if (value.length >= 3) {
			let data = {
				textSearch: value,
			};
			await client
				.get(`/gateway/Cliente/Search/`, {
					params: {
						json: JSON.stringify(data),
					},
				})
				.then((response) => {
					if (response.code == "1") {
						clients = JSON.parse(response.payload);
						console.log(clients);
					}
				});
		}
	};
	const onFocus = () => (isFocused = true);
	const onBlur = () => (isFocused = false);
	let placeholder = "Buscar cliente";
	let isClientSelected = false;
	let clientSelected = {};
	const selectClient = (e) => {
		isClientSelected = true;
		clientSelected = e;
		console.log(e);
	};

	let filteredPets = [];

	let searchTerm = "";
	// resets language menu if search input is used

	const searchPets = () => {
		return (filteredPets = pets.filter((pet) => {
			let petName = pet.name.toLowerCase();
			return petName.includes(searchTerm.toLowerCase());
		}));
	};
</script>

<div class="row page-titles">
	<div class="col-md-5 align-self-center">
		<h5 class="text-themecolor">Registro de Mascotas</h5>
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

<div class="card">
	<div class="card-body">
		<!-- <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="http://205.209.99.71:8006/"
                    width="100%"
                    height="500"
                    allowfullscreen
                    sandbox>
                <p>
                    <a href="/en-US/docs/Glossary">
                        Fallback link for browsers that don't support iframes
                    </a>
                </p>
            </iframe>
        <svelte-app id="khalid" name="Khalid"></svelte-app>
        <svelte-app id="paul" name="Paul"></svelte-app>
        <test-counter></test-counter> -->

		{#if showForm | editStatus}
			<h5 class="card-title">
				{#if !editStatus}Añadir Mascota{:else}Editar Mascota{/if}
			</h5>
			<form on:submit|preventDefault={onSubmitHandler}>
				<div class="row">
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
						<div class="form-group">
							<!-- <Input
				on:input={onInput}
				on:focus={onFocus}
				on:blur={onBlur}
				{value}
				{placeholder}
			/>
			<div>
				Focus: {isFocused}
			</div>
			<div>
				Value: {value}
			</div> -->
							<div class="input-group">
								<!-- <input type="text" class="form-control" placeholder="Search" />
				<div class="input-group-append">
					<button class="btn btn-primary" type="button">Search</button>
				</div> -->
								<Input
									on:input={onInput}
									on:focus={onFocus}
									on:blur={onBlur}
									{value}
									{placeholder}
								/>
							</div>
							{#if clients.length > 0 && !isClientSelected}
								<div class="floating-results list-group">
									{#each clients as item}
										<a
											href="#"
											class="list-group-item"
											on:click={selectClient(item)}
											><i class="ti-user" /> - {item.numeroIdentificacion}
											- {item.nombreFiscal}</a
										>
									{/each}
								</div>{/if}
						</div>
					</div>
				</div>
				{#if isClientSelected}
					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="">Cliente</label>
								<input
									type="text"
									class="form-control"
									disabled
									value={clientSelected.nombreFiscal}
								/>
							</div>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
							<div class="form-group">
								<label for="">Ruc</label>
								<input
									type="text"
									class="form-control"
									disabled
									value={clientSelected.numeroIdentificacion}
								/>
							</div>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
							<div class="form-group">
								<label for="">Email</label>
								<input
									type="text"
									class="form-control"
									disabled
									value={clientSelected.correo}
								/>
							</div>
						</div>
					</div>
				{/if}
				<div class="row">
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
						<div class="form-group">
							<label for="pet-name">Nombre</label>
							<input
								bind:value={pet.name}
								type="text"
								class="form-control"
								id="pet-name"
								placeholder="Nombre"
								required
							/>
						</div>
					</div>
					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-3">
						<div class="form-group">
							<label for="petType">Tipo:</label>
							<select
								name="petType"
								id="petType"
								class="form-control"
								required
								bind:value={pet.petTypeId}
							>
								<option selected disabled
									>Seleccione el tipo</option
								>
								{#each petTypes as item}
									<option value={item.id}>{item.name}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
						<div class="form-group">
							<label for="petBreed">Raza:</label>
							<select
								name="petBreed"
								id="petBreed"
								class="form-control"
								required
								bind:value={pet.petBreedId}
							>
								<option selected disabled
									>Seleccione la raza</option
								>
								{#each petBreeds as item}
									<option value={item.id}>{item.name}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
						<div class="form-group">
							<label for="petSex">Sexo:</label>
							<select
								name="petSex"
								id="petSex"
								class="form-control"
								bind:value={pet.petSexId}
							>
								<option selected disabled
									>Seleccione el sexo</option
								>
								{#each petSexes as item}
									<option value={item.id}>{item.name}</option>
								{/each}
							</select>
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
								bind:value={pet.age}
							/>
						</div>
					</div>
					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
						<div class="form-group">
							<label for="pet-color">Color</label>
							<input
								type="text"
								id="pet-color"
								class="form-control"
								placeholder="blanco"
								required
								bind:value={pet.color}
							/>
						</div>
					</div>
				</div>

				<button type="submit" class="btn btn-success">
					<i class="ti-save" />
					{#if !editStatus} Guardar {:else} Actualizar{/if}
				</button>
				{#if showForm | editStatus}
					<button
						type="button"
						class="btn btn-warning"
						on:click={() => openNew(false)}
					>
						<i class="ti-close" />Cancelar
					</button>
				{/if}
			</form>
			<hr />
		{/if}
		<Search
			bind:searchTerm
			on:input={searchPets}
			placeholder="Buscar Mascota"
		/>

		<div class="table-responsive">
			<table class="table table-bordered">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Especie</th>
						<th>Raza</th>
						<th>Sexo</th>
						<th>Edad</th>
						<th>Color</th>
						<th>Estado</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#if searchTerm && filteredPets.length === 0}
						<h5>No se encontraron resultados</h5>
					{:else if filteredPets.length > 0}
						{#each filteredPets as item}
							<tr>
								<td>{item.name}</td>
								<td>{item.petType.name}</td>
								<td>{item.petBreed.name}</td>
								<td>{item.petSex.name}</td>
								<td>{item.age}</td>
								<td>{item.color}</td>
								<td>
									<div
										class="custom-control custom-switch text-warning"
									>
										<input
											type="checkbox"
											bind:checked={item.enabled}
											on:change={() => disablePet(item)}
											class="custom-control-input"
											id="switch{item.id}"
										/>
										<label
											class="custom-control-label"
											for="switch{item.id}"
										/>
									</div>
								</td>
								<td>
									<button
										class="btn btn-outline-danger btn-sm"
										on:click={deletePet(item.id)}
									>
										<i class="ti-trash" />
									</button>
									<button
										class="btn btn-outline-warning btn-sm"
										on:click={editPet(item)}
									>
										<i class="ti-pencil" />
									</button>
								</td>
							</tr>
						{/each}
					{:else}
						{#each pets as item}
							<tr>
								<td>{item.name}</td>
								<td>{item.petType.name}</td>
								<td>{item.petBreed.name}</td>
								<td>{item.petSex.name}</td>
								<td>{item.age}</td>
								<td>{item.color}</td>
								<td>
									<div
										class="custom-control custom-switch text-warning"
									>
										<input
											type="checkbox"
											bind:checked={item.enabled}
											on:change={() => disablePet(item)}
											class="custom-control-input"
											id="switch{item.id}"
										/>
										<label
											class="custom-control-label"
											for="switch{item.id}"
										/>
									</div>
								</td>
								<td>
									<button
										class="btn btn-outline-danger btn-sm"
										on:click={deletePet(item.id)}
									>
										<i class="ti-trash" />
									</button>
									<button
										class="btn btn-outline-warning btn-sm"
										on:click={editPet(item)}
									>
										<i class="ti-pencil" />
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	@import "../dist/css/style.css";
	@import "bootstrap-toggle";

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
</style>
