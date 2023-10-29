<script lang="ts">
    import Tabs from "$lib/components/Tabs.svelte"; 
    import CuentaPorCobrar from "./CuentaPorCobrar.svelte";

  let items = [
    {
      icon: "",
      label: "Cuenta por cobrar",
      value: 1,
      component: CuentaPorCobrar,
    },
  ];
</script>

<div class="card">
  <div class="card-body">
    <Tabs {items} />
  </div>
</div>
