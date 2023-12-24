<script lang="ts">
	import ProductPvp from './ProductPVP.svelte';
	import { productDialogStore } from './productDialogStore';
	const data = $productDialogStore.data;
</script>

<div class="row">
	<div class="col-lg-6 col-md-6 col-sm-12 col-12">
		<div class="form-group">
			<label for="productName">Descripción</label>
			<input type="text" class="form-control border-select" />
		</div>
	</div>
	<div class="col-lg-6 col-md-6 col-sm-12 col-12">
		<div class="form-group">
			<label for="category">Categoria: <span class="text-danger">*</span> </label>
			<div class="input-group">
				<select
					name="category"
					id="category"
					class="form-control border-select"
					bind:value={data.idSubfamilia}
				>
					{#each $productDialogStore.dataForm.subfamilias as item}
						<option value={item.idSubFamilia}>{item.descripcion}</option>
					{/each}
				</select>
				<div class="input-group-append">
					<button class="btn btn-outline-secondary btn-sm" type="button" tabindex="-1">
						<i class="fa fa-plus fa-xs" />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
		<div class="row">
			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
				<div class="form-group">
					<label for="code">Código: <span class="text-danger">*</span></label>
					<input
						type="text"
						class="form-control border-select"
						placeholder="Ej: COM050"
						aria-invalid="false"
					/>
				</div>
			</div>

			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
				<div class="form-group">
					<label for="codeAux">Código Aux: </label>
					<input
						type="text"
						class="form-control border-select"
						placeholder="Ej: COM050"
						aria-invalid="false"
					/>
				</div>
			</div>

			<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
				<div class="form-group">
					<label for="barcode">Código de Barra: <span class="text-danger">*</span> </label>
					<div class="input-group">
						<input type="text" class="form-control border-select" />
						<div class="input-group-append">
							<button type="button" class="btn btn-outline-secondary">
								<i class="fas fa-barcode" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
		<div class="row">
			<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
				<div class="form-group">
					<label for="typeProduct">Tipo Artículo: <span class="text-danger">*</span> </label>
					<select class="form-control border-select">
						{#each $productDialogStore.dataForm.tiposProducto as item}
							<option value={item.idTipoArticulo}>{item.descripcion}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
				<div class="form-group">
					<label for="measure">U. Medida</label>
					<div class="input-group">
						<select class="form-control border-select">
							{#each $productDialogStore.dataForm.medidas as item}
								<option value={item.idMedida}>{item.descripcion}</option>
							{/each}
						</select>
						<div class="input-group-append">
							<button type="button" class="btn btn-outline-secondary btn-sm" tabindex="-1"
								><i class="fa fa-plus fa-xs" /></button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
{JSON.stringify($productDialogStore.data)}
<div class="row">
	<div class="form-group col-lg-2 col-md-6 col-sm-6 col-12">
		<label for="vatRate">Tipo Iva: </label>
		<select class="form-control border-select" bind:value={data.idTipoIva}>
			{#each $productDialogStore.dataForm.tarifasImpuesto as item}
				<option value={item.idTipoIva}>{item.descripcion}</option>
			{/each}
		</select>
	</div>
	<div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-6">
		<label for="priceCost">Precio Costo: <span class="text-danger">*</span></label>
		<input
			type="text"
			class="form-control border-select"
			bind:value={data.precioCosto}
			placeholder="0.00"
		/>
	</div>
	<div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-6">
		<label for="precioSinSubsidio">Precio Sin Subsidio:</label>
		<input
			type="text"
			class="form-control border-select"
			bind:value={data.precioSinSubsidio}
			placeholder="0.00"
		/>
	</div>
	<div class="form-group col-lg-2 col-md-6 col-sm-6 col-12 text-center">
		<label for="inventory">Inventario: </label>
		<div class="icheck-primary">
			<input type="checkbox" id="llevarInventarioAgregar1" name="llevarInventarioAgregar1" />
			<label for="llevarInventarioAgregar1" />
		</div>
	</div>
	<div class="form-group col-lg-2 col-md-3 col-sm-6 col-12 text-center">
		<label for="checkAdditional">Adicionales: </label>
		<div class="icheck-primary">
			<input type="checkbox" id="datosAdicionalesAgregar1" name="datosAdicionalesAgregar1" />
			<label for="datosAdicionalesAgregar1" />
		</div>
	</div>
	<!-- <div class="form-group col-lg-2 col-md-3 col-sm-6 col-12 text-center">
        <label for="labels">Etiqueta: </label>
        <select class="form-control border-select">
            <option></option>
        </select>
    </div> -->
	<div class="form-group col-lg-2 col-md-3 col-sm-6 col-12 text-center">
		<label for="checkFraccionable">Fraccionable: </label>
		<div class="icheck-primary">
			<input
				type="checkbox"
				id="productoFraccionableAgregar1"
				name="productoFraccionableAgregar1"
			/>
			<label for="productoFraccionableAgregar1" />
		</div>
	</div>
</div>

<div class="row">
	<div class="col-lg-8 col-md-12 col-sm-12 col-12">
		<ProductPvp />
	</div>
</div>
