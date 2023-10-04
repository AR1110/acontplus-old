<script lang="ts">
    import Tabs from "$lib/components/Tabs.svelte"; 
    import Techspec from "../TechSpec/TechSpec.svelte";

  let items = [
    {
      icon: "",
      label: "Ficha Técnica",
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
