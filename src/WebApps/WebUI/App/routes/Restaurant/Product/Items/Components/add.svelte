<script lang="ts">
  import Modal from "$core/components/Modal.svelte";
  import type { Item } from "$core/interfaces/restaurant/item";
  import type { ProductionArea } from "$core/interfaces/restaurant/production-area";
  import { productionAreaService } from "$core/services/restaurant/production-area-service";
  import { onMount } from "svelte";

  export let openNew;
  export let modalClosed;
  export let data = {} as Item;

  let productionAreas = [] as ProductionArea[];

  onMount(() => {
    getProductionArea();
    getProducts();
  });

  // Get prodction areas
  const getProductionArea = () => {
    productionAreaService.get().then((res) => {
      if (res) productionAreas = res;
    });
  };

  // Get products => Articulos
  const getProducts = () => {};

  const onModalClose = () => {
    openNew = false;
    modalClosed();
  };
</script>

{#if openNew}
  <Modal
    open={openNew}
    iconTitle={data.id > 0 ? "ti-sync" : "ti-plus"}
    title={data.id > 0 ? "Actualizar sala" : "Registrar sala"}
    onClosed={() => onModalClose()}
    fullScreen={true}
  >
    <div class="modal-body">
      <form>
        <div class="row">
          <div class="col-6">
            <div class="form-group input-group-lg">
              <label for="exampleFormControlSelect1">Producto</label>
              <select class="form-control" id="exampleFormControlSelect1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group  input-group-lg">
              <label for="production-area">Areas de producción</label>
              <select class="form-control" id="production-area">
                <option disabled>seleccione</option>
                {#each productionAreas as productionArea}
                  <option value={productionArea.id}>
                    {productionArea.description}
                  </option>
                {/each}
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label for="exampleFormControlTextarea1">Example textarea</label>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="exampleFormControlTextarea1">Example textarea</label>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </Modal>
{/if}
