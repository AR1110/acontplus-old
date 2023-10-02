<script lang="ts">
    import Tabs from "$lib/components/Tabs.svelte"; 
    import Techspec from "../TechSpec/TechSpec.svelte";

  let items = [
    {
      icon: "fa-solid fa-boxes-stacked",
      label: "Ficha Técnica (Ingreso)",
      value: 1,
      component: Techspec,
    },
  ];
</script>

<div class="card">
  <div class="card-body">
    <Tabs {items} />
  </div>
</div>
