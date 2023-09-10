<script>
  import { TabulatorFull as Tabulator } from "tabulator-tables";
  import { onMount } from "svelte";

  export let columns;
  export let arrayData;

  let tableComponent;
  let table;
  $:tempData = arrayData;

  $: table && tempData && table.setData(tempData);

  function loadTabulator(){
    console.log('load inifinite grid')
    table = new Tabulator(tableComponent, {
      layout: "fitColumns",
      data: tempData,
      reactiveData: true,
      columns: columns,
    });
  }

  onMount(loadTabulator)
</script>

<div bind:this={tableComponent} />
