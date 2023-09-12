<script lang="ts">
  import Modal from "$core/components/Modal.svelte";
  import Grid from "$core/components/Grid.svelte";
  import type { Menu } from "$core/interfaces/restaurant/menu";
  import { useMenuStore } from "$routes/Restaurant/store/menuStore";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import toast from "$core/utils/toast";

  let data = {} as Menu;
  let value = "";
  let placeholder = "Buscar producto";
  let itemSearch = [];
  let productsAdded = [];
  let timeout;

  useMenuStore.subscribe((values) => {
    data = values.dataUpdate;
    itemSearch = values.items;
  });

  let productColumns = [
    {
      title: "Producto",
      field: "descripcion",
      editable: "never",
      with: 300,
      resizable: true,
    },
    {
      title: "Precio costo",
      field: "costPrice",
      editor: "input",
      with: 200,
      resizable: true,
    },
    {
      title: "Opción",
      hozAlign: "center",
      formatter: "buttonCross",
      width: 100,
      cellClick: (e, cell) => {
        console.log(e, cell);
      },
    },
  ];

  const onInput = async (e) => {
    value = e.target.value;
    itemSearch = [];

    if (value.length > 3) return;

    // Apply debounce in search
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      useMenuStore.searchItem({ textSearch: value });
    }, 300);
  };

  $itemSearch: itemSearch;

  const onFocus = () => {};

  const onBlur = () => {
    if (!value) {
      itemSearch = [];
      value = "";
    }
  };

  const getItemSearch = (id, data) => {
    const item = itemSearch.find((x) => x.id === id);

    // Verify in the list if the item exists
    const itemExists = productsAdded.find((x) => x.productId === item.productId);

    if (itemExists) return toast({ type: "success", message: "Agregado" });

    let newMenu = {
      id: 0,
      itemId: item.id,
      productId: item.productId,
      costPrice: item.costPrice,
      descripcion: item.descripcion,
      menuId: data.id,
    };

    productsAdded.push(newMenu);

    //productsAdded = [...productsAdded, newMenu];
  };

  const onModalClose = () => {
    useMenuStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
  };

  const onSave = () => {};
</script>

{#if $useMenuStore.isOpen}
  <Modal
    open={$useMenuStore.isOpen}
    iconTitle={"ti-plus"}
    title={`Menu - ${data.id > 0 ? data.title : ""}`}
    size={"modal-lg"}
    onClosed={() => onModalClose()}
  >
    <form on:submit|preventDefault={onSave}>
      <div class="modal-body">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label for="">Descripción</label>
              <input type="text" class="form-control" bind:value={data.title} />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label for="">Resumen</label>
              <textarea class="form-control" bind:value={data.summary} />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-8 col-md-12 col-sm-12">
            <div class="form-group">
              <AdvancedSearch
                on:input={onInput}
                on:focus={onFocus}
                on:blur={onBlur}
                {value}
                {placeholder}
              />
              {#if itemSearch.length > 0}
                <div class="floating-results list-group">
                  {#each itemSearch as item}
                    <a
                      href={null}
                      class="list-group-item"
                      on:click={() => getItemSearch(item.id, data)}
                      ><i class="fa-solid fa-bowl-food" /> {item.descripcion}</a
                    >
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            {JSON.stringify(productsAdded)}
            <Grid dataArray={productsAdded} columns={productColumns} />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-success">
          <i class="ti-save" /> Guardar
        </button>
        <button
          type="button"
          class="btn btn-dark"
          on:click={() => onModalClose()}>&times; Cerrar</button
        >
      </div>
    </form>
  </Modal>
{/if}

<style>
  :global([data-svelte-search] input) {
    width: 100%;
    font-size: 1rem;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid #e0e0e0;
    border-radius: 0.25rem;
  }
</style>
