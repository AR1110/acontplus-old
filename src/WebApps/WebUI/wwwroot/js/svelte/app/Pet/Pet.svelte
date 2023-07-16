<!-- svelte-ignore tag-option-deprecated -->
<script>
	import { v4 } from "uuid";
	import { onMount } from "svelte";
	import { client } from "../../core/api/axiosClient";
	import toast from "../../core/utils/toast";
	import Swal from "sweetalert2";
	import Search from "../../core/components/Search.svelte";
	import AdvancedSearch from "../../core/components/AdvancedSearch.svelte";
	import { showLoader, hideLoader } from "../../core/utils/loading-spinner";

	let genderes = [],
		breeds = [],
		breedsFiltered = [],
		petTypes = [],
		pets = [];

	const getPets = async () => {
		showLoader();
		await client
			.get(`/gateway/Pets/?json=` + JSON.stringify({ tipo: 1 }))
			.then((response) => {
				if (response.code == 1) {
					pets = JSON.parse(response.payload);
				}
				hideLoader();
			})
			.catch((error) => {
				hideLoader();
				console.log(error);
			});
	};

	onMount(async () => {
		await client.get("/gateway/Genderes/").then((response) => {
			genderes = response;
		});
		await client.get("/gateway/PetTypes/").then((response) => {
			petTypes = response;
		});
		await client.get("/gateway/Breeds/").then((response) => {
			breeds = response;
		});
		await getPets();
	});

	const filterBreed = (id) => {
		breedsFiltered = breeds.filter((x) => x.petTypeId == id);
	};

	let pet = {
		id: "",
		customerId: "",
		companyId: "",
		name: "",
		petTypeId: "",
		breedId: "",
		genderId: "",
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
		if (!open) {
			customerSelected = {};
			isCustomerSelected = false;
		}
	};

	const addPet = async () => {
		if (!customerSelected.customerId) {
			toast({ type: "warning", message: "Debe asignar un cliente" });
			return;
		}
		if (!pet.petTypeId) {
			toast({ type: "warning", message: "Debe seleccionar una especie" });
			return;
		}
		if (!pet.genderId) {
			toast({ type: "warning", message: "Debe seleccionar el sexo" });
			return;
		}
		const newPet = {
			customerId: customerSelected.customerId,
			companyId: customerSelected.companyId,
			name: pet.name,
			petTypeId: pet.petTypeId,
			breedId: pet.breedId,
			genderId: pet.genderId,
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
			})
			.catch((error) => {
				console.log(error);
			});
		cleanPet();
		await getPets();
		//window.location.reload(true);
	};

	const deletePet = async (id) => {
		let { isConfirmed } = await Swal.fire({
			text: "Esta seguro de eliminar esta mascota?",
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
		customerSelected.businessName = petEdited.customer;
		customerSelected.idCard = petEdited.customerIdCard;
		customerSelected.email = petEdited.email;
		breedsFiltered = breeds.filter(
			(b) => b.petTypeId == petEdited.petTypeId
		);
	};

	const updatePet = async () => {
		let updatedpet = {
			id: pet.id,
			customerId: pet.customerId,
			companyId: pet.companyId,
			name: pet.name,
			petTypeId: pet.petTypeId,
			breedId: pet.breedId,
			genderId: pet.genderId,
			age: pet.age,
			color: pet.color,
			enabled: pet.enabled,
		};

		await client
			.put("/gateway/Pets/" + updatedpet.id, updatedpet)
			.then((response) => {
				toast({
					type: "success",
					message: "Actualizada exitosamente",
				});
				openNew(false);
			})
			.catch((error) => {
				console.log(error);
			});

		cleanPet();
		editStatus = false;
		await getPets();
	};

	const save = () => {
		if (!editStatus) {
			addPet();
		} else {
			updatePet();
		}
	};

	function disablePet(item) {
		pet = item;
		updatePet();
	}

	let value = "";
	let isFocused = false;
	//const onInput = (e) => (value = e.target.value)
	let customers = [];
	const onInput = async (e) => {
		value = e.target.value;
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
						customers = JSON.parse(response.payload);
					}
				});
		} else if (customers.length > 0) {
			customers = [];
		}
	};
	const onFocus = () => {};
	const onBlur = (e) => {
		if (!value) {
			customers = [];
			value = "";
		}
	};
	let placeholder = "Buscar cliente";
	let isCustomerSelected = false;
	let customerSelected = {
		customerId: "",
		companyId: "",
		businessName: "",
		idCard: "",
		email: "",
		telephone: "",
		address: "",
	};
	const selectClient = (e) => {
		isCustomerSelected = true;
		customerSelected.customerId = e.customerId;
		customerSelected.companyId = e.companyId;
		customerSelected.businessName = e.nombreFiscal;
		customerSelected.idCard = e.numeroIdentificacion;
		customerSelected.email = e.correo;
		customerSelected.telephone = e.telephone;
		customerSelected.address = e.direccion;
		value = "";
		customers = [];
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
	<form on:submit|preventDefault={save}>
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
					{#if customers.length > 0 && !isCustomerSelected}
						<div class="floating-results list-group">
							{#each customers as item}
								<a
									href={null}
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
		{#if isCustomerSelected | editStatus}
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">Datos del Cliente</h5>
					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="">Razón Social</label>
								<input
									type="text"
									class="form-control"
									disabled
									value={customerSelected.businessName}
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
									value={customerSelected.idCard}
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
									value={customerSelected.email}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">
						{#if !editStatus}Datos de la Mascota{:else}Editar
							Mascota{/if}
					</h5>
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
									on:change={(e) =>
										filterBreed(e.target.value)}
								>
									<option selected disabled
										>Seleccione el tipo</option
									>
									{#each petTypes as item}
										<option value={item.id}
											>{item.name}</option
										>
									{/each}
								</select>
							</div>
						</div>
						{#if breedsFiltered.length > 0}
							<div
								class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
							>
								<div class="form-group">
									<label for="breed">Raza:</label>
									<select
										name="breed"
										id="breed"
										class="form-control"
										required
										bind:value={pet.breedId}
									>
										<option selected disabled
											>Seleccione la raza</option
										>
										{#each breedsFiltered as item}
											<option value={item.id}
												>{item.name}</option
											>
										{/each}
									</select>
								</div>
							</div>
						{/if}
					</div>

					<div class="row">
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
							<div class="form-group">
								<label for="gender">Sexo:</label>
								<select
									name="gender"
									id="gender"
									class="form-control"
									bind:value={pet.genderId}
								>
									<option selected disabled
										>Seleccione el sexo</option
									>
									{#each genderes as item}
										<option value={item.id}
											>{item.name}</option
										>
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
				</div>
			</div>
		{/if}
	</form>
{/if}

<Search bind:searchTerm on:input={searchPets} placeholder="Buscar Mascota" />
<div class="card">
	<div class="card-body">
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
								<td>{item.petType}</td>
								<td>{item.breed}</td>
								<td>{item.gender}</td>
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
								<td>{item.petType}</td>
								<td>{item.breed}</td>
								<td>{item.gender}</td>
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
