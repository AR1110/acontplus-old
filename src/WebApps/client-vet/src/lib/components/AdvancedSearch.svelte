<script>
	import { getEventsAction } from '$lib/utils/utils';
	import { current_component } from 'svelte/internal';
	const events = getEventsAction(current_component);
	export let value;
	export let placeholder;
	export let disabled = false;
</script>

<input
	class="form-control border-select"
	onclick="this.select()"
	{placeholder}
	use:events
	{value}
	{disabled}
/>

<style>
	.border-select:focus {
		border-color: blue !important;
	}
</style>
