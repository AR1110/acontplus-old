<script lang="ts">
	import type { Item } from "$core/interfaces/restaurant/item";
	import { onMount } from "svelte";
	import Search from "./Components/search.svelte";
	import { itemService } from "$core/services/restaurant/item-service";
	import List from "./Components/list.svelte";

	let items = [] as Item[];

	onMount(async () => {
		get();
	});

	const get = () => {
		let params = JSON.stringify({
			checkSubFamilia: false,
			idSubFamilia: 0,
			pageIndex: 1,
         pageSize: 10,
		});

		itemService.get(params).then((res) => {
			if (res) {
				items = res["items"];
			}
		});
	}
</script>

<Search />
<List items={items} />
