<script lang="ts">
	import { floorService } from "$core/services/restaurant/floor-service";
	import toast from "$core/utils/toast";
	import { onMount } from "svelte";
	import Swal from "sweetalert2";
	let floors = [];

	onMount(() => {
		getFloors();
	});

	let getFloors = () => {
		floorService.get().then((response) => {
			if (response) {
				floors = response;
			}
		});
	};

	export const reloadList = () => {
		getFloors();
	};

	const openNew = (data) => {
		if (openNew) {
			//isNew = true;
		}
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
