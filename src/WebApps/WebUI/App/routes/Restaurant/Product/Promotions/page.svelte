<script lang="ts">
  import { usePromotionStore } from "$routes/Restaurant/store/promotionStore";
  import Breadcrumbs from "$core/components/Breadcrumbs.svelte";
  import Add from "./Components/Add.svelte";
  import List from "./Components/List.svelte";
</script>

<Breadcrumbs
  title={"Promociones"}
  action={"Nueva promoción"}
  openNew={() => usePromotionStore.openingModal()}
/>
<List />
<Add />
