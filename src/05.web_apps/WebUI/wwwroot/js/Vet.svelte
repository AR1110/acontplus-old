<svelte:options tag="vet-app" />

<script>
	import { v4 } from "uuid";
	import { onMount } from "svelte";
	import axios from "axios";
	//import jwt_decode from "jwt-decode";
	import { client } from "./AxiosClient";

	console.log("amazing svelte yeyey");
	let quotes = [];
	let error = null;
	// onMount(async () => {
	// 	try {
	// 		console.log("inside axios request")
	// 		const res = await axios.get(
	// 			`http://localhost:57340/gateway/PetSexes/`
	// 		);
	// 		quotes = res.data;
	// 		console.log(quotes);
	// 	} catch (e) {
	// 		error = e;
	// 	}
	// });
	let petSexes = [],
		petBreeds = [],
		petTypes = [];

	// const cat = localStorage.getItem("ngStorage-currentUser");
	// const objToken = JSON.parse(cat);
	// console.log(objToken.token);
	// var decodedJwt = jwt_decode(objToken.token);
	// console.log(decodedJwt);
	const requestAPI = async () => {
		// console.log("inside axios request");
		// const res = await axios.get(
		// 	`${decodedJwt.urlGateway}/gateway/PetSexes/`,
		// 	{
		// 		headers: {},
		// 		params: {},
		// 	}
		// );
		// petSexes = res.data;
		// console.log(res.data);
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

	requestAPI();

	let products = [
		{
			id: 1,
			name: "Hp Pavilion Notebook",
			description: "HP Laptop",
			category: "laptops",
		},
		{
			id: 2,
			name: "Razer Mouse",
			description: "Gaming Mouse",
			category: "peripherals",
		},
		{
			id: 3,
			name: "Corsair Keyboard",
			description: "Gaming keyboard",
			category: "peripherals",
		},
	];

	let product = {
		id: "",
		name: "",
		description: "",
		category: "",
		imageURL: "",
	};

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
		product = {
			id: "",
			name: "",
			description: "",
			category: "",
			imageURL: "",
		};
	};

	const addPet = () => {
		const newProduct = {
			id: v4(),
			name: pet.name,
			description: pet.age,
			category: product.category,
			imageURL: product.imageURL,
		};

		products = products.concat(newProduct);

		cleanPet();
		console.log(products);
	};

	const deletePet = (id) => {
		console.log(id);
		products = products.filter((product) => product.id !== id);
	};

	const editPet = (productEdited) => {
		editStatus = true;
		product = productEdited;
		console.log(product);
	};

	const updatePet = () => {
		let updatedProduct = {
			name: pet.name,
			description: pet.age,
			id: product.id,
			imageURL: product.imageURL,
			category: product.category,
		};
		const productIndex = products.findIndex((p) => p.id === product.id);
		products[productIndex] = updatedProduct;
		cleanPet();
		//   new Noty({
		// 	theme: "sunset",
		// 	type: "success",
		// 	timeout: 3000,
		// 	text: "Product Update Successfully"
		//   }).show();
		editStatus = false;
	};

	const onSubmitHandler = () => {
		if (!editStatus) {
			addPet();
		} else {
			updatePet();
		}
	};

	import Input from "./Input.svelte";
	let value = "";
	let isFocused = false;
	//const onInput = (e) => (value = e.target.value);
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
</script>

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
			<div class="col-xl-4">
				<div class="form-group">
					<label for="">Cliente</label>
					<h5>{clientSelected.nombreFiscal}</h5>
				</div>
			</div>
			<div class="col-xl-4">
				<div class="form-group">
					<label for="">Ruc</label>
					<h5>{clientSelected.numeroIdentificacion}</h5>
				</div>
			</div>
			<div class="col-xl-4">
				<div class="form-group">
					<label for="">Email</label>
					<h5>{clientSelected.correo}</h5>
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
					bind:value={pet.petTypeId}
				>
					<option selected disabled>Seleccione el tipo</option>
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
					bind:value={pet.petBreedId}
				>
					<option selected disabled>Seleccione la raza</option>
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
					<option selected disabled>Seleccione el sexo</option>
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
					bind:value={pet.color}
				/>
			</div>
		</div>
	</div>

	<button type="submit" class="btn btn-success">
		<i class="ti-save" />
		{#if !editStatus} Guardar {:else} Actualizar{/if}
	</button>
</form>

<main>
	<div class="container p-4">
		<div class="row">
			<div class="col-md-6">
				{#each products as product}
					<div
						class="card mt-2 animate__animated animate__backInLeft"
					>
						<div class="row">
							<div class="col-md-4">
								{#if !product.imageURL}
									<!-- svelte-ignore a11y-img-redundant-alt -->
									<img
										src="images/no-product.png"
										class="p-2 img-fluid"
										alt="Image"
									/>
								{:else}
									<!-- svelte-ignore a11y-img-redundant-alt -->
									<img
										src={product.imageURL}
										class="p-2 img-fluid"
										alt="Image"
									/>
								{/if}
							</div>
							<div class="col-md-8">
								<div class="card-body">
									<h5 class="card-title">
										<strong>{pet.name}</strong>
										<span>
											<small>{product.category}</small>
										</span>
									</h5>
									<p class="card-text">
										{pet.age}
									</p>
									<button
										class="btn btn-danger"
										on:click={deletePet(product.id)}
									>
										Delete
									</button>
									<button
										class="btn btn-secondary"
										on:click={editPet(product)}
									>
										Edit
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>

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
