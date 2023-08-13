<script lang="ts">
	import { floorService } from "$core/services/restaurant/floor-service";
	import toast from "$core/utils/toast";
	import Swal from "sweetalert2";
	import Add from "./add.svelte";
	import type { Floor } from "$core/interfaces/restaurant/floor";

	export let floors = [] as Floor[];
	export let reloadList;
	let edit = {} as Floor;


	// In component
	let isNew = false;

	const openNew = (data) => {
		if (openNew) {
			edit = data;
			isNew = true;
		}
	};

	const closeModal = () => {
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
				floorService.remove(id).then((response) => {
					if (response.status === 200) {
						toast({
							type: "success",
							message: "Eliminado exitosamente",
						});
					}
					reloadList();
				});
			}
		});
	};
</script>

<div class="card">
	<div class="card-body">
		{#if floors.length > 0}
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
							<th />
							<th>N°</th>
							<th>Código</th>
							<th>Descripcion</th>
							<th>Capacidad</th>
							<th>Estado</th>
						</tr>
					</thead>
					<tbody>
						{#each floors as item, index}
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
								<td>{item.capacity}</td>
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
