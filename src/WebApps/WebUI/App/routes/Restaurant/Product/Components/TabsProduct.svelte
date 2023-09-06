<script lang="ts">
  import Items from "../Items/page.svelte";
  import Menus from "../Menus/page.svelte";
  //import Recipe from "../Recipe/page.svelte";
  import Ingredient from "../Ingredient/page.svelte";
  import Tabs from "$core/components/Tabs.svelte";
  let items = [
    // {
    //   icon: "fa-solid fa-plate-wheat",
    //   label: "Menus",
    //   value: 1,
    //   component: Menus,
    // },
    {
      label: "Productos",
      value: 1,
      component: Items,
    },
    // {
    //   label: "Receta",
    //   value: 3,
    //   component: Recipe,
    // },
    {
      label: "Ingredientes",
      value: 2,
      component: Ingredient,
    },
  ];
</script>

<div class="card">
  <div class="card-body">
    <Tabs {items} />
  </div>
</div>
