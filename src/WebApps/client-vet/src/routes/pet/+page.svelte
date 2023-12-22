<!-- svelte-ignore tag-option-deprecated -->
<script type="js">
	import { onMount } from 'svelte';
	import { client } from '$lib/utils/axiosClient';
	import toast from '$lib/utils/toast';
	import Swal from 'sweetalert2';
	import AdvancedSearch from '$lib/components/AdvancedSearch.svelte';
	import { showLoader, hideLoader } from '$lib/utils/loading-spinner';
	import { Chart, registerables } from 'chart.js';
	import Pagination from '$lib/components/Pagination.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	Chart.register(...registerables);

	let genderes = [],
		breeds = [],
		breedsFiltered = [],
		petTypes = [],
		pets = [];

	let tipo = 1;

	let recordsQuantity = [10, 25, 50, 100];

	let page = 0;
	let pageCurrent = 0;
	let pageSize = recordsQuantity[0];
	let textSearch = '';
	let totalRecords = 0;
	let timer;
	let totalPetTypes = [],
		totalBreeds = [],
		totalGenders = [];

	const getTotals = async () => {
		showLoader();
		await client
			.get(
				`Vet/Pets/?json=` +
					JSON.stringify({
						tipo: 3,
						pageIndex: pageCurrent == 0 ? 1 : pageCurrent,
						pageSize: pageSize == 0 ? 9 : pageSize,
						textSearch: textSearch
					})
			)
			.then((response) => {
				if (response.data.code == 1) {
					let tempArray = JSON.parse(response.data.payload) || [];
					totalPetTypes = tempArray['totalPetTypes'] || [];
					if (totalPetTypes.length > 0) {
						drawChartPetType();
					}

					totalBreeds = tempArray['totalBreeds'] || [];
					if (totalBreeds.length > 0) {
						drawChartPetBreed();
					}
					totalGenders = tempArray['totalGenders'] || [];
					if (totalGenders) {
						drawChartPetSex();
					}
				}
				hideLoader();
			})
			.catch((error) => {
				hideLoader();
				console.log(error);
			});
	};

	const getPets = async () => {
		showLoader();
		await client
			.get(
				`Vet/Pets/?json=` +
					JSON.stringify({
						tipo,
						pageIndex: pageCurrent == 0 ? 1 : pageCurrent,
						pageSize: pageSize == 0 ? 9 : pageSize,
						textSearch: textSearch
					})
			)
			.then((response) => {
				if (response.data.code == 1) {
					let tempArray = JSON.parse(response.data.payload) || [];
					totalPetTypes = tempArray['totalPetTypes'];
					totalBreeds = tempArray['totalBreeds'];
					totalGenders = tempArray['totalGenders'];

					pets = tempArray['pets'];
					if (pets.length > 0) {
						totalRecords = pets[0]['totalRecords'];
					}
					pets.forEach((element, index) => {
						if (element.weight === null) {
							element.weight = 'N/A';
						}
						if (element.age === null) {
							element.age = 'N/A';
						}
						if (element.color === null) {
							element.color = 'N/A';
						}
					});
				}
				hideLoader();
			})
			.catch((error) => {
				hideLoader();
				console.log(error);
			});
	};

	const onPageChange = (event) => {
		page = event.detail.page;
		pageCurrent = page + 1;
		getPets();
	};

	const onChange = (e) => {
		pageSize = parseInt(e.target.value);
		getPets();
	};

	onMount(async () => {
		await client.get('Vet/Genderes/').then((response) => {
			genderes = response.data;
		});
		await client.get('Vet/PetTypes/').then((response) => {
			petTypes = response.data;
		});
		await client.get('Vet/Breeds/').then((response) => {
			breeds = response.data;
		});
		await getPets();
		await getTotals();
	});

	const filterBreed = (id) => {
		breedsFiltered = breeds.filter((x) => x.petTypeId == id);
	};

	let pet = {
		id: '',
		customerId: '',
		companyId: '',
		name: '',
		petTypeId: '',
		breedId: '',
		genderId: '',
		age: '',
		color: '',
		weight: ''
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
			toast({ type: 'warning', message: 'Debe asignar un cliente' });
			return;
		}
		if (!pet.petTypeId) {
			toast({ type: 'warning', message: 'Debe seleccionar una especie' });
			return;
		}
		if (!pet.genderId) {
			toast({ type: 'warning', message: 'Debe seleccionar el sexo' });
			return;
		}
		const newPet = {
			customerId: customerSelected.customerId,
			companyId: customerSelected.companyId,
			name: pet.name,
			petTypeId: pet.petTypeId,
			breedId: pet.breedId,
			genderId: pet.genderId,
			color: pet.color
		};
		await client
			.post('Vet/Pets/', newPet)
			.then((response) => {
				toast({
					type: 'success',
					message: 'Registrada exitosamente'
				});
				openNew(false);
			})
			.catch((error) => {
				console.log(error);
			});
		cleanPet();
		await getPets();
		await getTotals();
	};

	const deletePet = async (id) => {
		let { isConfirmed } = await Swal.fire({
			text: 'Esta seguro de eliminar esta mascota?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, proceder!',
			cancelButtonText: 'No, cancelar'
		});
		if (isConfirmed) {
			await client
				.delete('Vet/Pets/' + id)
				.then((response) => {
					toast({
						type: 'success',
						message: 'Eliminada exitosamente'
					});
					pets = pets.filter((pet) => pet.id !== id);
				})
				.catch((error) => {
					console.log(error);
				});
			await getTotals();
		}
	};

	const editPet = (petEdited) => {
		editStatus = true;
		pet = petEdited;
		customerSelected.businessName = petEdited.customer;
		customerSelected.idCard = petEdited.customerIdCard;
		customerSelected.email = petEdited.email;
		breedsFiltered = breeds.filter((b) => b.petTypeId == petEdited.petTypeId);
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
			// age: pet.age,
			color: pet.color,
			enabled: pet.enabled
			// weight: pet.weight,
		};

		await client
			.put('Vet/Pets/' + updatedpet.id, updatedpet)
			.then((response) => {
				toast({
					type: 'success',
					message: 'Actualizada exitosamente'
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

	let value = '';
	let isFocused = false;
	//const onInput = (e) => (value = e.target.value)
	let customers = [];
	const onInput = async (e) => {
		value = e.target.value;
		if (value.length >= 3) {
			let data = {
				textSearch: value
			};
			await client
				.get(`Venta/Cliente/Search/`, {
					params: {
						json: JSON.stringify(data)
					}
				})
				.then((response) => {
					if (response.data.code == '1') {
						customers = JSON.parse(response.data.payload);
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
			value = '';
		}
	};
	let placeholder = 'Buscar cliente';
	let isCustomerSelected = false;
	let customerSelected = {
		customerId: '',
		companyId: '',
		businessName: '',
		idCard: '',
		email: '',
		telephone: '',
		address: ''
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
		value = '';
		customers = [];
	};

	let filteredPets = [];

	let searchTerm = '';
	// resets language menu if search input is used

	const searchPets = () => {
		return (filteredPets = pets.filter((pet) => {
			let petName = pet.name.toLowerCase();
			return petName.includes(searchTerm.toLowerCase());
		}));
	};

	const search = (e) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (e.target.value != '' && e.target.value.length >= 3) {
				tipo = 2;
				textSearch = e.target.value;
				getPets();
			} else {
				tipo = 1;
				textSearch = '';
				getPets();
			}
		}, 750);
	};

	const clearInput = () => {
		document.querySelector('input').value = '';
		tipo = 1;
		textSearch = '';
		search({ target: { value: '' } });
	};

	let chartPetType = null,
		chartPetBreed = null,
		chartPetSex = null;

	const drawChartPetType = () => {
		if (chartPetType != null) {
			chartPetType.destroy();
		}
		let groupedPets = totalPetTypes.reduce((groups, item) => {
			const group = groups[item.name] || [];
			group.push(item);
			groups[item.name] = group;
			return groups;
		}, {});
		let labels = Object.keys(groupedPets);
		let lengths = labels.map((key) => groupedPets[key][0]['total']);
		const ctx = document.getElementById('chartPetType').getContext('2d');

		chartPetType = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Cantidad',
						data: lengths,
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					y: {
						ticks: {
							beginAtZero: true
						}
					},
					x: {
						ticks: {
							beginAtZero: true,
							autoSkip: false
						}
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'Distribución por especie',
						padding: {
							top: 10,
							bottom: 30
						}
					}
				}
			},
			responsive: true
		});
	};

	const drawChartPetBreed = () => {
		if (chartPetBreed != null) {
			chartPetBreed.destroy();
		}
		let groupedPets = totalBreeds.reduce((groups, item) => {
			const group = groups[item.name] || [];
			group.push(item);
			groups[item.name] = group;
			return groups;
		}, {});
		let labels = Object.keys(groupedPets);
		let lengths = labels.map((key) => groupedPets[key][0]['total']);
		const ctx = document.getElementById('chartPetBreed').getContext('2d');

		chartPetBreed = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Cantidad',
						data: lengths,
						fill: false,
						borderWidth: 1,
						tension: 0.1
					}
				]
			},
			options: {
				scales: {
					y: {
						ticks: {
							callback: function (value, index, values) {
								// Only return even numbers
								return value % 2 === 0 ? value : null;
							}
						}
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'Distribución por Raza',
						padding: {
							top: 10,
							bottom: 30
						}
					}
				}
			},
			responsive: true
		});
	};
	const drawChartPetSex = () => {
		if (chartPetSex != null) {
			chartPetSex.destroy();
		}
		let groupedPets = totalGenders.reduce((groups, item) => {
			const group = groups[item.name] || [];
			group.push(item);
			groups[item.name] = group;
			return groups;
		}, {});
		let labels = Object.keys(groupedPets);
		let lengths = labels.map((key) => groupedPets[key][0]['total']);
		const ctx = document.getElementById('chartPetSex').getContext('2d');

		chartPetSex = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Cantidad',
						data: lengths,
						borderWidth: 1
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Distribución por Sexo',
						padding: {
							top: 10,
							bottom: 30
						}
					}
				}
			},
			responsive: true
		});
	};
</script>

<Breadcrumbs title="{'Registro de Mascotas'}" action={'Nueva'} openNew={() => openNew(true)}
></Breadcrumbs>

<div class="row">
	<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
		<div class="card">
			<div class="card-body">
				<canvas id="chartPetType" width="500" height="500" />
			</div>
		</div>
	</div>
	<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
		<div class="card">
			<div class="card-body">
				<canvas id="chartPetBreed" width="500" height="500" />
			</div>
		</div>
	</div>
	<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
		<div class="card">
			<div class="card-body">
				<canvas id="chartPetSex" width="400" height="500" />
			</div>
		</div>
	</div>
</div>

{#if showForm || editStatus}
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
								<a href={null} class="list-group-item" on:click={selectClient(item)}
									><i class="ti-user" /> - {item.numeroIdentificacion}
									- {item.nombreFiscal}</a
								>
							{/each}
						</div>{/if}
				</div>
			</div>
		</div>
		{#if isCustomerSelected || editStatus}
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
								<input type="text" class="form-control" disabled value={customerSelected.idCard} />
							</div>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
							<div class="form-group">
								<label for="">Email</label>
								<input type="text" class="form-control" disabled value={customerSelected.email} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">
						{#if !editStatus}Datos de la Mascota{:else}Editar Mascota{/if}
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
									on:change={(e) => filterBreed(e.target.value)}
								>
									<option selected disabled>Seleccione el tipo</option>
									{#each petTypes as item}
										<option value={item.id}>{item.name}</option>
									{/each}
								</select>
							</div>
						</div>
						{#if breedsFiltered.length > 0}
							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
								<div class="form-group">
									<label for="breed">Raza:</label>
									<select
										name="breed"
										id="breed"
										class="form-control"
										required
										bind:value={pet.breedId}
									>
										<option selected disabled>Seleccione la raza</option>
										{#each breedsFiltered as item}
											<option value={item.id}>{item.name}</option>
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
								<select name="gender" id="gender" class="form-control" bind:value={pet.genderId}>
									<option selected disabled>Seleccione el sexo</option>
									{#each genderes as item}
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
									disabled
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
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
							<div class="form-group">
								<label for="pet-weight">Peso (kg)</label>
								<input
									type="number"
									id="pet-weight"
									class="form-control"
									placeholder="5.5"
									step="any"
									disabled
									bind:value={pet.weight}
								/>
							</div>
						</div>
					</div>

					<button type="submit" class="btn btn-success">
						<i class="ti-save" />
						{#if !editStatus}
							Guardar
						{:else}
							Actualizar{/if}
					</button>
					{#if showForm || editStatus}
						<button type="button" class="btn btn-warning" on:click={() => openNew(false)}>
							<i class="ti-close" />Cancelar
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</form>
{/if}
<div class="row">
	<div class="col-lg-9 col-md-9 col-sm-9 col-12">
		<span class="form-group pull-left page-size form-inline">
			<select class="form-control control-color" on:change={(e) => onChange(e)}>
				{#each recordsQuantity as record}
					<option value={record}>{record}</option>
				{/each}
			</select>
		</span>
	</div>
	<div class="col-lg-3 col-md-3 col-sm-3 col-12">
		<div class="input-group mb-3">
			<input
				type="text"
				class="form-control form-control-lg search-input"
				placeholder="Buscar..."
				aria-label=""
				aria-describedby="basic-addon1"
				on:keyup={(e) => {
					search(e);
				}}
			/>
			<div class="input-group-append">
				<button
					class="btn btn-outline-secondary"
					on:click={() => {
						clearInput();
					}}
					type="button"><i class="fa fa-sync" /></button
				>
			</div>
		</div>
	</div>
</div>
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
						<th>Peso</th>
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
								<td>{item.weight}</td>
								<td>
									<div class="custom-control custom-switch text-warning">
										<input
											type="checkbox"
											bind:checked={item.enabled}
											on:change={() => disablePet(item)}
											class="custom-control-input"
											id="switch{item.id}"
										/>
										<label class="custom-control-label" for="switch{item.id}" />
									</div>
								</td>
								<td>
									<button class="btn btn-outline-danger btn-sm" on:click={deletePet(item.id)}>
										<i class="ti-trash" />
									</button>
									<button class="btn btn-outline-warning btn-sm" on:click={editPet(item)}>
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
								<td>{item.weight}</td>
								<td>
									<div class="custom-control custom-switch text-warning">
										<input
											type="checkbox"
											bind:checked={item.enabled}
											on:change={() => disablePet(item)}
											class="custom-control-input"
											id="switch{item.id}"
										/>
										<label class="custom-control-label" for="switch{item.id}" />
									</div>
								</td>
								<td>
									<button class="btn btn-outline-danger btn-sm" on:click={deletePet(item.id)}>
										<i class="ti-trash" />
									</button>
									<button class="btn btn-outline-warning btn-sm" on:click={editPet(item)}>
										<i class="ti-pencil" />
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
			<!-- Add pagination -->
			<Pagination {page} {pageSize} count={totalRecords} on:pageChange={onPageChange} />
		</div>
	</div>
</div>
