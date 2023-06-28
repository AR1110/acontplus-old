<svelte:options tag="vet-app" />

<script>
	import { v4 } from "uuid";
	import { onMount } from "svelte";
	import axios from "axios";
	import jwt_decode from "jwt-decode";
	console.log('amazing svelte yeyey')
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
	let petSexes = [];

	const cat = localStorage.getItem("ngStorage-currentUser");
	const objToken = JSON.parse(cat);
	console.log(objToken.token);
	var decodedJwt = jwt_decode(objToken.token);
	console.log(decodedJwt);
	const requestAPI = async () => {
		try {
			console.log("inside axios request");
			const res = await axios.get(
				`${decodedJwt.urlGateway}/gateway/PetSexes/`,
				{
					headers: {},
					params: {},
				}
			);
			petSexes = res.data;
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
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

	let editStatus = false;

	const cleanProduct = () => {
		product = {
			id: "",
			name: "",
			description: "",
			category: "",
			imageURL: "",
		};
	};

	const addProduct = () => {
		const newProduct = {
			id: v4(),
			name: product.name,
			description: product.description,
			category: product.category,
			imageURL: product.imageURL,
		};

		products = products.concat(newProduct);

		cleanProduct();
		console.log(products);
	};

	const deleteProduct = (id) => {
		console.log(id);
		products = products.filter((product) => product.id !== id);
	};

	const editProduct = (productEdited) => {
		editStatus = true;
		product = productEdited;
		console.log(product);
	};

	const updateProduct = () => {
		let updatedProduct = {
			name: product.name,
			description: product.description,
			id: product.id,
			imageURL: product.imageURL,
			category: product.category,
		};
		const productIndex = products.findIndex((p) => p.id === product.id);
		products[productIndex] = updatedProduct;
		cleanProduct();
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
			addProduct();
		} else {
			updateProduct();
		}
	};

	import Input from './Input.svelte'
	let value = 'test';
	let isFocused = false;
	const onInput =(e)=>value=e.target.value;
	const onFocus =()=>isFocused=true;
	const onBlur =()=>isFocused=false;
	let placeholder = 'Buscar cliente'
</script>

<Input on:input={onInput} on:focus={onFocus} on:blur={onBlur} {value} {placeholder}/>
<div>
	Focus: {isFocused}
</div>
<div>
	Value: {value}
</div>

<div class="row">
	<div class="col-md-4">
		<div class="form-group">
			<label for="petSex">Sexo:</label>
			<select name="" id="" class="form-control">
				{#each petSexes as sex}
					<option>{sex.name}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="col-md-4">
		<div class="form-group">
			<label for="petType">Tipo:</label>
			<select name="" id="petType" class="form-control">
				{#each petSexes as sex}
					<option>{sex.name}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="col-md-4">
		<div class="form-group">
			<label for="petBreed">Raza:</label>
			<select name="" id="petBreed" class="form-control">
				{#each petSexes as sex}
					<option>{sex.name}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

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
									<img
										src="images/no-product.png"
										class="p-2 img-fluid"
										alt="Image"
									/>
								{:else}
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
										<strong>{product.name}</strong>
										<span>
											<small>{product.category}</small>
										</span>
									</h5>
									<p class="card-text">
										{product.description}
									</p>
									<button
										class="btn btn-danger"
										on:click={deleteProduct(product.id)}
									>
										Delete
									</button>
									<button
										class="btn btn-secondary"
										on:click={editProduct(product)}
									>
										Edit
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="col-md-6">
				<div class="card">
					<div class="card-body">
						<h2 class="card-title">
							{#if !editStatus}Añadir Mascota{:else}Editar Mascota{/if}
						</h2>
						<form on:submit|preventDefault={onSubmitHandler}>
							<div class="form-group">
								<label for="product-name">Product Name</label>
								<input
									bind:value={product.name}
									type="text"
									class="form-control"
									id="product-name"
									placeholder="Product Name"
								/>
							</div>

							<div class="form-group">
								<label for="product-description"
									>Product Description</label
								>
								<textarea
									bind:value={product.description}
									id="product-description"
									rows="3"
									class="form-control"
									placeholder="Product Description"
								/>
							</div>

							<div class="form-group">
								<label for="produtc-image-url"
									>Product Image URL</label
								>
								<input
									bind:value={product.imageURL}
									type="url"
									id="product-image-url"
									class="form-control"
									placeholder="https://faztweb.com"
								/>
							</div>

							<div class="form-group">
								<label for="category">Product Category</label>
								<select
									id="category"
									class="form-control"
									bind:value={product.category}
								>
									<option selected disabled
										>Select a Category</option
									>
									<option value="laptops">Laptops</option>
									<option value="peripherals"
										>Peripherals</option
									>
									<option value="servers">Servers</option>
								</select>
							</div>
							<button type="submit" class="btn btn-primary">
								{#if !editStatus}Save Product{:else}Update
									Product{/if}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	@import "../dist/css/style.css";
</style>
