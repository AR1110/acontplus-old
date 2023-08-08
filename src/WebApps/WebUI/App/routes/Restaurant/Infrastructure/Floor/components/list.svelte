<script lang="ts">
	import { floorService } from "$core/services/restaurant/floor-service";
	import { onMount } from "svelte";
	import toast from "$core/utils/toast";

	let floors = [];

	onMount(() => {
		floorService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			if (response) {
				floors = response["floors"];
			}
		});
	});
</script>

<div class="card">
	<div class="card-body">
		{#if floors.length > 0}
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
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
