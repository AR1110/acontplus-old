<script lang="ts">
	import type { Item } from "$core/interfaces/restaurant/item";
	import { onMount } from "svelte";
	import Search from "./Components/search.svelte";
	import { itemService } from "$core/services/restaurant/item-service";

	let items = [] as Item[];

	onMount(async () => {
    let params = JSON.stringify({ idSubFamilia: 1,pageIndex: 1, pageSize: 10 });
		itemService.get(params).then((res) => {
			if (res) {
				items = res["items"];
        console.log(items);
			}
		});
	});
</script>

<Search />
