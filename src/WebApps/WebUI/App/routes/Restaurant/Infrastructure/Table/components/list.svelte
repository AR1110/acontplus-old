<script lang="ts">
	import { tableService } from "$core/services/restaurant/table-service";
	import type { Table } from "$core/interfaces/restaurant/table";
	import Swal from "sweetalert2";
	import toast from "$core/utils/toast";
	import Add from "./add.svelte";

	export let reloadList;
	export let tables = [] as Table[];
	let edit = {} as Table;
	let isNew = false;

	function formatDateTime(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES");
	}

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
				tableService.remove(id).then((response) => {
					if (response.status === 200) {
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
		{#if tables.length > 0}
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
							<th />
							<th>N°</th>
							<th>Descripcion</th>
							<th>N° de mesa</th>
							<th>Capacidad</th>
							<th>Fecha registro</th>
							<th>Estado</th>
						</tr>
					</thead>
					<tbody>
						{#each tables as item, index}
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
								<td> {item.room.description}  - {item.description}</td>
								<td>{item.numberTable}</td>
								<td>{item.capacity}</td>
								<td>{formatDateTime(item.createdAt)}</td>
								<td>
									{#if item.enabled}
										<span class="badge badge-success"
											>Activo</span
										>
									{:else}
										<span class="badge badge-danger"
											>Inactivo</span
										>
									{/if}
								</td>
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
