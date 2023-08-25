<script lang="ts">
  import type { Item } from "$core/interfaces/restaurant/item";
  import { onMount } from "svelte";
  import Search from "./Components/search.svelte";
  import { itemService } from "$core/services/restaurant/item-service";
  import List from "./Components/list.svelte";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import type { Ingredient } from "$core/interfaces/restaurant/ingredient";
  import { IngredientService } from "$core/services/restaurant/ingredient-service";

  let items = [] as Item[];
  let ingredientes = [] as Ingredient[];
  let timer;

  onMount(async () => {
    get();
    getIngredient();
  });

  const get = () => {
    showLoader();
    itemService.get(JSON.stringify({ idSubFamilia: 0, pageIndex: 1, pageSize: 10, tipo: 1 })).then((response) => {
      hideLoader();
      if (response) {
        items = response["items"];
      }
    });
  };

  // Get ingredientes
  const getIngredient = () => {
    showLoader();
    IngredientService.get(JSON.stringify({ id: 1 })).then((response) => {
      hideLoader();
      if (response) {
        ingredientes = response["ingredients"];
      }
    });
  };

  const reloadList = () => {
    get();
  };

  const search = (e) => {
    let newParams = {
      idSubFamilia: 0,
      pageIndex: 1,
      pageSize: 10,
      tipo: 1,
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      if (e.target.value != "") {
        newParams["textSearch"] = e.target.value;
      } else {
        delete newParams["textSearch"];
      }
      console.log(newParams);

      showLoader();
      itemService.get(JSON.stringify(newParams)).then((response) => {
        hideLoader();
        items = [] as Item[];
        if (response) {
          items = response["items"];
        }
      });
    }, 750);
  };
</script>

<Search {search} />
<List {reloadList} {items} {ingredientes} />
