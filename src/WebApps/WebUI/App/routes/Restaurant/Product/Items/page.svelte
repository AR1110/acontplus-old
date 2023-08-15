<script lang="ts">
  import type { Item } from "$core/interfaces/restaurant/item";
  import { onMount } from "svelte";
  import Search from "./Components/search.svelte";

  let items = [] as Item[];

  onMount(async () => {
	 console.log("onMount");
  });

</script>

<Search />
