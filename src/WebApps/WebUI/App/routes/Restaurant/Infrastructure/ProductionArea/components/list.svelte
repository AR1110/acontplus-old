<script lang="ts">
	import { productionAreaService } from "$lib/services/restaurant/production-area-service";
	import toast from "$lib/utils/toast";
	import Swal from "sweetalert2";
	import { onMount } from "svelte";
	import type { ProductionArea } from "$lib/interfaces/restaurant/production-area";
	import Add from "./add.svelte";
  import { hideLoader, showLoader } from "$lib/utils/loading-spinner";

	let isNew = false;
	let productionAreas = [];
	let edit = {} as ProductionArea;

	onMount(() => {
		get();
	});

	export const reloadList = () => {
		get();
	};

	const get = () => {
		showLoader();
		productionAreaService.get().then((response) => {
			hideLoader();
			if (response) {
				productionAreas = response;
			}
		});
	};

	const openNew = (data) => {
		if (openNew) {
			edit = data;
			isNew = true;
		}
	};

	const closeModal = () => {
		isNew = false;
		reloadList();
	};

	// Delete production area
	const remove = (id) => {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "¡No podrás revertir esto!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sí, eliminarlo",
			cancelButtonText: "Cerrar",
		}).then((result) => {
			if (result.isConfirmed) {
				productionAreaService.remove(id).then((response) => {
					if (response.status >= 200 && response.status < 300) {
						toast({
							type: "success",
							message: "Eliminado exitosamente",
						});
						reloadList();
					}
				});
			}
		});
	};
</script>

<div class="card">
	<div class="card-body">
		{#if productionAreas.length > 0}
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
							<th />
							<th>N°</th>
							<th>Código</th>
							<th>Descripcion</th>
							<th>Estado</th>
						</tr>
					</thead>
					<tbody>
						{#each productionAreas as item, index}
							<tr>
								<td>
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a
										href="javascript:void(0)"
										class="btn btn-sm btn-success"
										on:click={() => openNew(item)}
									>
										<i class="fas fa-edit" />
									</a>
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a
										href="javascript:void(0)"
										class="btn btn-sm btn-danger"
										on:click={() => remove(item.id)}
									>
										<i class="fas fa-trash" />
									</a>
								</td>
								<td>{index + 1}</td>
								<td>{item.code}</td>
								<td>{item.description}</td>
								<td>
									{#if item.enabled}
										<span class="badge badge-success"
											>Activo</span
										>
									{:else}
										<span class="badge badge-danger"
											>Inactivo</span
										>
									{/if}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<h5>No hay registros</h5>
		{/if}
	</div>
</div>
<Add openNew={isNew} modalClosed={() => closeModal()} data={edit} />
