<script lang="ts">
  import GridForItem from "$lib/components/GridForItem.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { supportStore } from "$routes/Mechanical/Store/support.store";

  const onModalClose = () => {
    supportStore.update((state) => ({
      ...state,
      isApprove: false,
    }));
  };

  let colums = [
    {
      title: "Op",
      field: "code",
      width: 100,
    },
    {
      title: "N°",
      field: "client",
      width: 200,
    },
    {
      title: "Cód.",
      field: "date",
      width: 100,
    },
    {
      title: "Descripción",
      field: "warehouse",
      width: 100,
    },
    {
      title: "Cantidad",
      field: "rate",
      width: 100,
    },
    {
      title: "Medida",
      field: "status",
      width: 100,
    },
    {
      title: "IVA",
      field: "actions",
      width: 100,
    },
    {
      title: "Precio",
      field: "actions",
      width: 100,
    },
    {
      title: "Total",
      field: "actions",
      width: 100,
    },
    {
      title: "Tarifa",
      field: "actions",
      width: 100,
    },
    {
      title: "Precio U.",
      field: "actions",
      width: 100,
    },
    {
      title: "P.Iva",
      field: "actions",
      width: 100,
    },
  ];
</script>

{#if $supportStore.isApprove}
  <Modal
    open={$supportStore.isOpen}
    iconTitle={"ti-plus"}
    title={"Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form autocomplete="off">
        <div class="row">
          <div class="col-sm-4 nopadding">
            <div class="form-group m-b-0">
              <label for="cliente" class="control-label">
                Cliente <span class="text-danger">*</span>
              </label>
              <div class="input-group bootstrap-touchspin">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Ingrese C.I o Nombre Comercial"
                  data-bts-button-down-class="btn btn-secondary btn-outline"
                  data-bts-button-up-class="btn btn-secondary btn-outline"
                />

                <span
                  class="input-group-btn input-group-append bootstrap-touchspin-injected"
                >
                  <button
                    class="btn btn-secondary btn-outline bootstrap-touchspin-up"
                    type="button"
                  >
                    <i class="ti-plus" />
                  </button>
                </span>

                <span
                  class="input-group-btn input-group-append bootstrap-touchspin-injected"
                >
                  <button
                    class="btn btn-secondary btn-outline bootstrap-touchspin-up"
                    type="button"
                  >
                    <i class="ti-search" />
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div class="col-sm-2 nopadding">
            <label for="cliente" class="">
              Nro Identificación <span class="text-danger">*</span>
            </label>
            <input type="text" disabled class="form-control" />
          </div>
          <div class="col-sm-2 nopadding">
            <label for="">
              Fecha Emisión <span class="text-danger">*</span>
            </label>
            <input type="date" class="form-control" />
            <small><span class="text-success">Datos de prueba</span></small>
          </div>
          <div class="col-sm-2 nopadding">
            <div class="form-group">
              <label for="">Bodega</label>
              <select class="form-control custom-select">
                <option>::SELECCIONE::</option>
                <option>India</option>
                <option>Sri Lanka</option>
                <option>USA</option>
              </select>
            </div>
          </div>
          <div class="col-sm-2 nopadding">
            <div class="form-group">
              <label for="">Tarifa</label>
              <select class="form-control custom-select">
                <option>::SELECCIONE::</option>
                <option>India</option>
                <option>Sri Lanka</option>
                <option>USA</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-sm-4 nopadding">
            <div class="form-group m-b-0">
              <label for=""> Buscar por artíulo </label>
              <input type="text" class="form-control" />
            </div>
          </div>
          <div class="col-sm-2 nopadding">
            <label for="cliente" class=""> Buscar por Código </label>
            <input type="text" class="form-control" placeholder="Ej: COMP1" />
          </div>
          <div class="col-sm-6 nopadding">
            <div class="row justify-content-end">
              <div class="col-lg-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <button
                  type="button"
                  class="btn btn-block btn-lg btn-success mt-4"
                  id="btnSaveAndUpdateDocument"
                >
                  <i class="ti-save" /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!--Add tabulator -->
        <div class="row mt-2">
          <div class="col-12">
            <GridForItem arrayData={[]} columns={colums} />
          </div>
        </div>
      </form>
    </div>
  </Modal>
{/if}
