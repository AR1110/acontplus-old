<script lang="ts">
	import { estabAsignService } from "$core/services/restaurant/estab-asign-service";
	import { hideLoader, showLoader } from "$core/utils/loading-spinner";
	import { onMount } from "svelte";

	// Variables locales
	let estabAsign = [];

	onMount(() => {
		getEstablecimiento();
	});

	// Get estab
	const getEstablecimiento = () => {
		let params = JSON.stringify({ tipo: 1 });

		showLoader();
		estabAsignService.get(params).then((response) => {
			hideLoader();
			if (response) {
				estabAsign = response;
			}
		});
	};
</script>

<div class="container">
	<div class="row">
		<div class="col-8"></div>
		<div class="col-4">
			<select class="form-control">
				<option disabled>SELECCIONE</option>
				{#each estabAsign as item}
					<option value={item.codEstab}>{item.nombreComercial}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
