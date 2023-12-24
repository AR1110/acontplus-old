<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Establecimiento } from '$restaurant/interfaces/establecimiento';
	import { estabAsignService } from '$modules/restaurant/services/estab-asign-service';
	import { sharedService } from '$services/shared.service';
	import { ArticleService } from '$inventario/services/article-service';
	import AdvancedSearch from '$components/AdvancedSearch.svelte';
	import axios from 'axios';
	import { itemService } from '$restaurant/services/item-service';
	import { hideLoader, showLoader } from '$utils/loading-spinner';

	type Subfamilia = {
		idSubFamilia: number;
		siglas: string;
		descripcion: string;
	};
	type Product = {
		id: number;
		codigo: string;
		descripcion: string;
	};

	let establecimientos: Array<Establecimiento> = [];
	let subfamilias: Array<Subfamilia> = [];

	let dataSearch = {
		codEstab: '',
		idSubfamilia: 0,
		itemId: 0
	};

	let cancelToken;
	let showProductsFound = false;
	let dataSearchProduct = {
		textSearch: '',
		productName: ''
	};
	let productsFound: Array<Product> = [];

	onMount(() => {
		estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			if (response) {
				establecimientos = response;
				dataSearch.codEstab = establecimientos.find((estab) => estab.predeterminado).codEstab;
			}
		});

		ArticleService.getDataForm({ tipo: 5 }).then((response) => {
			subfamilias = response.subfamilias;
		});
	});

	// Función para manejar clics en el documento
	function handleClickArea(event) {
		const miDiv = document.getElementById('contentProductSearch');
		if (miDiv && !miDiv.contains(event.target)) {
			showProductsFound = false;
		}
	}

	// Agrega un event listener para escuchar clics en el documento
	document.addEventListener('click', handleClickArea);
	// Elimina el event listener cuando el componente se destruye
	onDestroy(() => {
		document.removeEventListener('click', handleClickArea);
	});

	const onInput = async (e) => {
		dataSearchProduct.textSearch = e.target.value;
		productsFound = [];

		if (dataSearchProduct.textSearch.length < 2) return;

		// Check if we made a request
		if (cancelToken) {
			// Cancel the previous request before making a new request
			cancelToken.cancel('mensaje de cancelación');
		}
		// Create a new CancelToken
		cancelToken = axios.CancelToken.source();
		try {
			let json = {
				pageIndex: 1,
				pageSize: 50,
				tipo: 1,
				textSearch: dataSearchProduct.textSearch
			};
			itemService.get(JSON.stringify(json), cancelToken?.token).then((response) => {
				console.log(response);
				if (response) {
					productsFound = response['items'];
					showProductsFound = productsFound.length > 0;
				}
			});
		} catch (error) {
			if (axios.isCancel(error)) {
				console.log('Request canceled', error.message);
			} else {
				console.log('Something went wrong: ', error.message);
			}
		}
	};

	const onFocus = () => {
		showProductsFound = productsFound.length > 0;
	};

	const onBlur = () => {
		//showProductsFound = false;
	};

	const selectedProduct = (dataProduct: Product) => {
		dataSearch = Object.assign({
			...dataSearch,
			itemId: dataProduct.id
		});
		dataSearchProduct = Object.assign({
			...dataSearchProduct,
			productName: dataProduct.descripcion
		});
		showProductsFound = false;
	};

	const getReport = async (format: 'pdf' | 'excel') => {
		try {
			const parameters = {
				hasService: false,
				hasIdUsuarioRol: true,
				reportParams: JSON.stringify({
					hasParams: false,
					codigo: 'RII',
					codEstab: dataSearch.codEstab,
					format,
					aditionalParams: []
				}),
				dataParams: JSON.stringify(dataSearch)
			};
			showLoader();
			await sharedService.download(parameters);
			hideLoader();
		} catch (error) {
			console.log(error);
		}
	};
</script>

<form autocomplete="off" id="contentReportItemIngredient">
	<div class="row">
		<div class="col-4 col-xl-4 col-md-12">
			<div class="form-group">
				<label for="estab">Establecimiento: </label>
				<select bind:value={dataSearch.codEstab} class="form-control border-select" id="estab">
					{#each establecimientos as item}
						<option value={item.codEstab}>
							{item.nombreComercial}
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
			<div class="form-group">
				<label for="categoria-search">Categoría: </label>
				<select
					name="categoria-search"
					id="categoria-search"
					class="form-control border-select"
					bind:value={dataSearch.idSubfamilia}
				>
					<option value={0}>Todos</option>
					{#each subfamilias as subfamilia}
						<option value={subfamilia.idSubFamilia}>{subfamilia.descripcion}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
			<div class="form-group" id="contentProductSearch">
				<label for="product-search"
					>Producto:
					<small class="text-success">{dataSearchProduct.productName}</small>
				</label>
				<div class="input-group">
					<AdvancedSearch
						on:input={onInput}
						on:focus={onFocus}
						on:blur={onBlur}
						value={dataSearchProduct.textSearch}
						placeholder="Buscar Producto"
					/>
					<div class="input-group-append">
						<button
							class="btn btn-danger"
							type="button"
							on:click={() => {
								dataSearchProduct.textSearch = '';
								dataSearch.itemId = 0;
								dataSearchProduct.productName = '';
								showProductsFound = false;
							}}>&times;</button
						>
					</div>
				</div>

				{#if showProductsFound}
					<div class="floating-results list-group">
						{#each productsFound as item}
							<a href={null} class="list-group-item" on:click={() => selectedProduct(item)}>
								<i class="fa-solid fa-bowl-food" />
								{item.descripcion}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-12">
			<div class="form-group">
				<label for="exportTo">Exportar a:</label>
			</div>
			<div class="form-group">
				<div class="btn-group btn-group-lg" role="group">
					<button type="button" class="btn btn-info" on:click={() => getReport('pdf')}>PDF</button>
					<button type="button" class="btn btn-success" on:click={() => getReport('excel')}
						>Excel</button
					>
				</div>
			</div>
		</div>
	</div>
</form>

<style>
	.border-select:focus {
		border-color: blue !important;
	}
</style>
