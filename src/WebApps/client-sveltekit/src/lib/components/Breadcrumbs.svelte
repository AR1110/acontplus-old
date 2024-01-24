<script>
	export let title;
	export let openNew;
	export let action;
</script>

<div class="row page-titles">
	<div class="col-md-5 align-self-center">
		<h5 class="text-themecolor">{title}</h5>
	</div>
	{#if openNew}
		<div class="col-md-7 align-self-center text-right">
			<div class="d-flex justify-content-end align-items-center">
				<button
					type="button"
					on:click={() => openNew()}
					class="btn btn-info d-block d-lg-inline-block m-l-15"
				>
					<i class="fa fa-plus-circle" />
					{action}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.page-titles {
		background: #fff;
		padding: 14px 10px;
		box-shadow: 1px 0px 20px rgba(255, 255, 255, 0.08);
		margin: 0 -25px 25px -25px;
	}
</style>
