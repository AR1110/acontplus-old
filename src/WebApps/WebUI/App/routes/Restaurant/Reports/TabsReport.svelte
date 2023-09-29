<script lang="ts">
    import Tabs from "$core/components/Tabs.svelte";
  import Product from "./components/ProductIngredient.svelte";

  let items = [
    {
      icon: "fa-solid fa-boxes-stacked",
      label: "Producto Ingrediente",
      value: 1,
      component: Product,
    },
  ];
</script>

<div class="card">
  <div class="card-body">
    <Tabs {items} />
  </div>
</div>
