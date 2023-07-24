<script>
    import { TabulatorFull as Tabulator } from "tabulator-tables";
    import { onMount } from "svelte";

    export let dataArray, columns;

    let tableComponent;

    onMount(() => {
        debugger;
        new Tabulator(tableComponent, {
            data: dataArray, //link data to table
            reactiveData: true, //enable data reactivity
            columns: columns, //define table columns
            // autocolumns: true,
            // autoColumnsDefinitions: [
            //     { field: "codigo", editor: "input" }, //add input editor to the name column
            //     { field: "descripcion", headerFilter: true }, //add header filters to the age column
            // ],
        });
    });
</script>

<div bind:this={tableComponent} />