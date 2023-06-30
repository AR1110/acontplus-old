<script>
	import { getEventsAction } from "../../../core/utils/utils.js";
	import { current_component } from "svelte/internal";
	const events = getEventsAction(current_component);
	export let value;
    export let placeholder;
</script>
<input class="form-control" placeholder="{placeholder}" use:events {value}/>