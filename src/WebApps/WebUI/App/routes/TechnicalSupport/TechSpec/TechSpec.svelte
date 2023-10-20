<script lang="ts">
  import { onMount } from "svelte";
  import List from "./components/List.svelte";
  import TechSpecDialog from "./components/TechSpecDialog.svelte";
  import { orderService } from "../services";

  let showPopup = false;

  const onShowPopup = (ev) => {
    showPopup = true;
  };

  const onPopupClose = (data) => {
    showPopup = false;

    console.log(data);
  };

  onMount(() => {
    orderService.get({tipo: 1}).then((response) => {
      console.log(response);
    });
  });
</script>

<div class="d-flex justify-content-end mb-3">
  <div class="p-2">
    <input type="text" class="form-control border-select" />
  </div>
  <div class="p-2">
    <button type="button" class="btn btn-info" on:click={onShowPopup}>
      <i class="ti-plus" /> Nuevo
    </button>
  </div>
</div>
<List />

{#if showPopup}
  <TechSpecDialog open={showPopup} onClosed={(data) => onPopupClose(data)} />
{/if}
