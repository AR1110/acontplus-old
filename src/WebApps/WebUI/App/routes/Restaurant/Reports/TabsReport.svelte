<script lang="ts">
    import Tabs from "$lib/components/Tabs.svelte";
  import ItemIngredient from "./components/ItemIngredient.svelte";

  let items = [
    {
      icon: "fa-solid fa-boxes-stacked",
      label: "Producto Ingrediente",
      value: 1,
      component: ItemIngredient,
    },
  ];
</script>

<div class="card">
  <div class="card-body">
    <Tabs {items} />
  </div>
</div>
