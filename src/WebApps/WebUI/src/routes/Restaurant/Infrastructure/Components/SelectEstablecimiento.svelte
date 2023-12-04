<script lang="ts">
	export let establecimientos;
	export let changeEstab;

	const getChange = (e) => {
		let codEstab = e.target.value;
		changeEstab(codEstab);
	};
</script>

<div class="row">
	<div class="col-md-6">Establecimientos</div>
	<div class="col-md-6 align-self-center text-right">
		<div class="d-flex justify-content-end align-items-center">
			<select
				class="form-control"
				id="select"
				on:change={(e) => getChange(e)}
			>
				{#each establecimientos as item}
					<option value={item.codEstab}>{item.nombreComercial}</option
					>
				{/each}
			</select>
		</div>
	</div>
</div>
