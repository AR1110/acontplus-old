<script lang="ts">
  import { onMount } from 'svelte';
  import { tableService } from '$core/services/restaurant/table-service';

  let tables = [];
  onMount(() => {
    tableService.get(JSON.stringify({ tipo: 1 })).then((response) => {
		if (response) {
		  tables = response[0];
		  console.log(tables);
		}
    });
  });
</script>


<div class="card">
	<div class="card-body">
		{#if tables.length > 0}
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
							<th>N°</th>
							<th>Código</th>
							<th>Descripcion</th>
						</tr>
					</thead>
					<tbody>
						{#each tables as item, index}
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