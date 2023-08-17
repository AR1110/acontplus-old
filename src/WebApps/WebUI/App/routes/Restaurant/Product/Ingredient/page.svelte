<script lang="ts">
	import { hideLoader, showLoader } from './../../../../core/utils/loading-spinner.js';
    import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
    import type { IngredientType } from "$core/interfaces/restaurant/ingredient-type";
    import { IngredientService } from "$core/services/restaurant/ingredient-service";
    import { onMount } from "svelte";
    import List from "./components/list.svelte";
    import { itemService } from "$core/services/restaurant/item-service";

    let ingredient = [] as Ingredient[];
    let ingredientType = [] as IngredientType[];

   onMount(() => {
      getIngredient();
      getIngredientType();
    });

    const getIngredient = () => {
      showLoader();
      IngredientService.get(JSON.stringify({id: 1 })).then((res) => {
        hideLoader();
        if (res) {
          ingredient = res["ingredients"];
        }
      });
    }

   const getIngredientType = () => {
      let params  = JSON.stringify({
        tipo: 2,
        checkSubFamilia: false,
        idSubFamilia: 0,
        pageIndex: 0,
        pageSize: 0,
      });
      itemService.get(params).then((res) => {
        console.log(res);
        if (res) {
          ingredientType = res["ingredientType"];
          console.log(getIngredientType);
        }
      });
    }

    const reloadList = () => {
      getIngredient();
		getIngredientType();
	};
</script>
<List ingredient={ingredient} ingredientType={ingredientType} {reloadList} />
