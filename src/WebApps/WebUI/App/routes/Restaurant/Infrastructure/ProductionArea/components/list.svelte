<script lang="ts">
	import { productionAreaService } from "$core/services/restaurant/production-area-service";
	import { onMount } from "svelte";

	let productionAreas = [];

	onMount(() => {
		productionAreaService.get().then((response) => {
			if (response) {
				productionAreas = response.data;
			}
		});
	});
</script>

<div class="card">
	<div class="card-body">
		{#if productionAreas.length > 0}
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
							<th>N�</th>
							<th>C�digo</th>
							<th>Descripcion</th>
						</tr>
					</thead>
					<tbody>
						{#each productionAreas as item, index}
							<tr>
								<td>{index + 1}</td>
								<td>{item.code}</td>
								<td>{item.description}</td>
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
