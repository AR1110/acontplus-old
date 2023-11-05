<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import TabsMain from "./Components/tabsMain.svelte";
</script>

<Breadcrumbs title={"Mantenimientos"} action={""} openNew={null} />
<div class="card">
  <div class="card-body">
    <TabsMain />
  </div>
</div>
