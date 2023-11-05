<script lang="ts">
  import Items from "../Items/page.svelte";
  import Menus from "../Menus/page.svelte";
  import Ingredient from "../Ingredient/page.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import Promotion from "../Promotions/page.svelte";
  let items = [
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Productos",
      value: 1,
      component: Items,
    },
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Menus",
      value: 2,
      component: Menus,
    },
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Promociones",
      value: 3,
      component: Promotion,
    },
    {
      icon: "fa-solid fa-plate-wheat",
      label: "Ingredientes",
      value: 4,
      component: Ingredient,
    },
  ];
</script>

<div class="card">
  <div class="card-body">
    <Tabs {items} />
  </div>
</div>
