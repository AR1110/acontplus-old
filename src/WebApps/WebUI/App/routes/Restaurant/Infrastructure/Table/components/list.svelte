<script lang="ts">
	import { onMount } from "svelte";
	import { tableService } from "$core/services/restaurant/table-service";

	let tables = [];
	onMount(() => {
		tableService.get(JSON.stringify({ tipo: 1 })).then(
			(response) => {
				if (response) {
					tables = response["tables"];
					console.log(tables);
				}
			},
			(error) => {
				console.log(error);
			}
		);
	});

	function formatDateTime(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES");
	}
</script>

<div class="card">
	<div class="card-body">
		{#if tables.length > 0}
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
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
								<td>{index + 1}</td>
								<td>{item.description}</td>
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
