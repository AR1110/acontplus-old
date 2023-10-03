<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onDestroy, onMount } from "svelte";
  import GeneralInfo from "./GeneralInfo.svelte";
  import Tabs from "../Tabs.svelte";
  import { getDataForm } from "./productDialogStore"; 

  export let open = false;
  export let onClosed;
  export let title = "Nuevo Artículo";
  export let idArticulo = 0;

  let items = [
    {
      icon: "fas fa-home",
      label: "General",
      value: 1,
      component: GeneralInfo,
    },
  ];

  onMount(() => {
    getDataForm();
  });

  const save = () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const modalClose = (data) => {
    open = false;
    if (onClosed) {
      onClosed(data);
    }
  };
</script>

{#if open}
  <div
    class="modal"
    id="sampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="sampleModalLabel"
    aria-hidden={false}
  >
    <div
      class="modal-dialog modal-xl"
      role="document"
      in:fly={{ y: -50, duration: 300 }}
      out:fly={{ y: -50, duration: 300, easing: quintOut }}
    >
      <div class="modal-content">
        <form autocomplete="off">
          <div class="modal-header">
            <h5 class="modal-title" id="sampleModalLabel">{title}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              on:click={() => modalClose("close")}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <Tabs {items} />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              on:click={() => save()}>Guardar</button
            >
            <button
              type="button"
              class="btn btn-dark"
              data-dismiss="modal"
              on:click={() => modalClose("close")}>Close</button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    display: block;
    overflow-y: auto;
  }
</style>
