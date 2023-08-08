<script lang="ts">
	import { roomService } from "$core/services/restaurant/room-service";
	import { onMount } from "svelte";
	import toast from "$core/utils/toast";

	let rooms = [];

	onMount(() => {
		roomService.get(JSON.stringify({ tipo: 1 })).then((response) => {
			console.log(response);
			if (response === undefined) {
				return toast({
					type: "info",
					message: "Sin registro",
				});
			}
			if (response) {
				rooms = response["rooms"];
			}
		});
	});
</script>

<div class="card">
	<div class="card-body">
		{#if rooms.length > 0}
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
						{#each rooms as item, index}
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
