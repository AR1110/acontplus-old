<script>
	import { getEventsAction } from "../utils/utils.js";
	import { current_component } from "svelte/internal";
	const events = getEventsAction(current_component);
	export let value;
	export let placeholder;
	export let disabled = false;
</script>

<input
	class="form-control"
	onclick="this.select()"
	{placeholder}
	use:events
	{value}
	{disabled}
/>
