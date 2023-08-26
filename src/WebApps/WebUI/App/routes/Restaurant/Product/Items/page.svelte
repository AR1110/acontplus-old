<script lang="ts">
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import { IngredientService } from "$core/services/restaurant/ingredient-service";
  import { itemService } from "$core/services/restaurant/item-service";
  import { onMount } from "svelte";
  import List from "./Components/list.svelte";
  import OptionList from "./Components/option.svelte";
  import Search from "./Components/search.svelte";
  import type { Ingredient } from "$core/interfaces/restaurant/ingredient";

  let items = [];
  let ingredientes = [] as Ingredient[];
  let recordsQuantity = [10, 25, 50, 100];
  let currentPage = 1;
  let timer;

  let params = {
    idSubFamilia: 0,
    pageIndex: currentPage,
    pageSize: recordsQuantity[0],
    tipo: 1,
  };

  onMount(async () => {
    get(JSON.stringify({ ...params }));
    getIngredient();
  });

  const reloadList = () => {
    get(JSON.stringify({ ...params }));
  };

  // Get items
  const get = (params: string) => {
    showLoader();
    itemService.get(params).then((response) => {
      hideLoader();
      items = [];
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

  // Search
  const search = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (e.target.value != "") {
        params["textSearch"] = e.target.value;
      } else {
        delete params["textSearch"];
      }
      get(JSON.stringify({ ...params }));
    }, 750);
  };

  // get pageSize from option-list
  const getPageSize = (e) => {
    params["pageSize"] = parseInt(e.target.value);
    get(JSON.stringify({ ...params }));
  };
</script>

<div class="row">
  <div class="col-lg-9 col-md-9 col-sm-1">
    <OptionList {recordsQuantity} select={getPageSize} />
  </div>
  <div class="col-lg-3 col-md-3 col-sm-12 col-12">
    <Search {search} />
  </div>
</div>

<List
  {reloadList}
  {items}
  {ingredientes}
/>
