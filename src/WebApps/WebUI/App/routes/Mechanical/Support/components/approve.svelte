<script lang="ts">
  import { ArticleService } from "$services/inventory/article-service";
  import { Calculations } from "../helpers/calculations";
  import { customSelect } from "../helpers/custom-select";
  import { FacturaService } from "$services/Mechanical/factura-service";
  import { hideLoader, showLoader } from "$utils/loading-spinner";
  import { MapperToAction } from "../helpers/mapper-to-action";
  import { supportStore } from "$routes/Mechanical/Store/support.store";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import GridForItem from "$lib/components/GridForItem.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import toast from "$utils/toast";

  let support;
  let establishments = [];
  let measures = [];
  let warehouses = [];
  let articles = [];
  let supportDetails = [];
  let tipoIva = [];
  let valueArticle = "";
  let paramValidation = [undefined, null, "", 0];
  let placeholderArticle = "Buscar por C.I o Nombre Comercial";

  const onModalClose = () => {
    supportStore.update((state) => ({
      ...state,
      isApprove: false,
    }));
  };

  // Todo: Search articles
  const onInputArticle = async (e) => {
    valueArticle = e.target.value;
    articles = [];
    let data = {};
    if (valueArticle.length < 3) return;
    data = {
      busqueda: valueArticle,
    };
    ArticleService.search(JSON.stringify(data)).then((response) => {
      if (response) {
        articles = response;
      }
    });
  };

  const onFocusArticle = () => {};

  const onBlurArticle = (e) => {
    if (!valueArticle) {
      articles = [];
      valueArticle = "";
    }
  };

  const selectArticle = (e) => {
    let dataArticle = {};
    let medidas = [];

    articles = [];
    valueArticle = "";
    ArticleService.get(
      JSON.stringify({ tipo: 6, idArticulo: e.idArticulo })
    ).then((response) => {
      if (response) {
        dataArticle = response[0][0];

        // Todo: Validate if article has llevaInventario
        let isExists = onValidateLlevaInventario(dataArticle);

        if (isExists) {
          medidas = response[1].map((item) => {
            return {
              ...item,
              tarifas: JSON.parse(item.tarifas),
            };
          });
          let idBodega = warehouses.find(
            (x) => x.codEstab == support.codEstab
          ).idBodega;

          let dataMedida = medidas[0];
          let dataTarifa = dataMedida.tarifas[0];

          let obj = {
            ...dataArticle,
            bodegas: warehouses,
            cantidad: 1,
            idBodega: idBodega,
            idMedida: dataMedida.idMedida,
            idTarifa: dataTarifa.idTarifa,
            medidas,
            nota: "S/N",
            precioConIva: dataTarifa.precioConIva,
            precioUnitario: dataTarifa.precioVenta,
            precioVenta: dataTarifa.precioVenta,
            tarifas: dataMedida.tarifas,
            tipoIvas: tipoIva,
            total: dataTarifa.precioConIva * 1,
          };
          supportDetails = [...supportDetails, obj];
        }
      }
    });
  };

  let onValidateLlevaInventario = (item: any) => {
    let isValid = true;

    try {
      let exists = supportDetails.find((x) => x.idArticulo == item.idArticulo);

      if (exists != undefined && item.llevaInventario) {
        toast({
          type: "warning",
          message: "El artículo ya se encuentra en la lista",
        });
        isValid = false;
      }
      return isValid;
    } catch (error) {
      toast({ type: "error", message: "Se ha encontrado errores" });
      isValid = false;
    }
  };

  const removeArticle = (idArticulo) => {
    let newFilter = supportDetails.filter((x) => x.idArticulo != idArticulo);
    supportDetails = newFilter;
  };

  // Todo: Header for table
  let colums = [
    {
      formatter: "buttonCross",
      hozAlign: "center",
      title: "Opción",
      width: 100,
      cellClick: (e, cell) => {
        removeArticle(cell.getData().idArticulo);
        cell.getRow().delete();
      },
    },
    {
      editor: customSelect.selectWareHouses,
      field: "idBodega",
      formatter: Calculations.formatters,
      hozAlign: "center",
      title: "Bodega",
      width: 100,
    },
    {
      field: "codigoArticulo",
      hozAlign: "center",
      title: "Código",
      width: 100,
    },
    {
      field: "descripcion",
      title: "Descripción",
      editor: "input",
    },
    {
      cellEdited: Calculations.calculateTotal,
      editor: "input",
      field: "cantidad",
      hozAlign: "center",
      title: "Cantidad",
    },
    {
      cellEdited: Calculations.calculateTotal,
      editor: customSelect.selectMeasures,
      field: "idMedida",
      formatter: Calculations.formatters,
      hozAlign: "center",
      title: "Medida",
    },
    {
      editor: customSelect.selectTipoIva,
      field: "idTipoIva",
      hozAlign: "center",
      title: "I.V.A",
      formatter: Calculations.formatters,
      width: 100,
    },
    {
      cellEdited: Calculations.calculateTotal,
      editor: customSelect.selectFee,
      field: "idTarifa",
      formatter: Calculations.formatters,
      hozAlign: "center",
      title: "Tarifa",
      width: 100,
    },
    {
      title: "Precio U.",
      field: "precioVenta",
      hozAlign: "center",
      editor: "input",
      cellEdited: Calculations.calculateTotal,
    },
    {
      title: "P.Iva",
      field: "precioConIva",
      hozAlign: "center",
      editor: "input",
      cellEdited: Calculations.calculateTotal,
    },
    {
      field: "total",
      hozAlign: "center",
      title: "Total",
      width: 75,
    },
  ];

  let initialPushData = () => {
    if (supportDetails != undefined || supportDetails != null) {
      if (supportDetails.length != 0) {
        supportDetails.forEach((item) => {
          item.medidas = measures
            .map((x) => {
              return {
                ...x,
                tarifas: JSON.parse(x.tarifas),
              };
            })
            .filter((x) => x.idArticulo == item.idArticulo);
          item.tarifas = JSON.parse(
            measures.find((x) => x.idMedida == item.idMedida).tarifas
          );
          item.bodegas = warehouses.filter(
            (x) => x.codEstab == support.codEstab
          );
          item.tipoIvas = tipoIva;

          item.precioConIva = item.tarifas.find(
            (x) => x.idTarifa == item.idTarifa
          ).precioConIva;
        });
      }
    }
  };

  const selectCodEstab = () => {
    if (supportDetails != undefined || supportDetails != null) {
      if (supportDetails.length > 0) {
        support.codEstab = supportDetails[0].codEstab;
      }
    }

    if (
      paramValidation.includes(support.codEstab) &&
      establishments.length > 0
    ) {
      support.codEstab = establishments[0].codEstab;
    }
  };

  const refreshWarehouseCodEstab = (codEstab) => {
    support.codEstab = codEstab;

    let idBodega = warehouses.find(
      (x) => x.codEstab == support.codEstab
    ).idBodega;

    if (!paramValidation.includes(idBodega)) {
      supportDetails.forEach((item) => {
        item.idBodega = idBodega;
        item.bodegas = warehouses.filter((x) => x.codEstab == support.codEstab);
      });
      supportDetails = [...supportDetails];
    }
  };

  // Todo: Save FACTURA
  const saveFactura = () => {
    showLoader();

    let data = {
      factura: JSON.stringify(MapperToAction.facturaMapperTo(support)),
      detalle: JSON.stringify(MapperToAction.detalleMapperTo(supportDetails)),
    };

    FacturaService.post(data)
      .then((response) => {})
      .finally(() => {
        hideLoader();
      });
  };

  // Todo: Save NOTA ENTREGA
  const saveNotaEntrega = () => {};

  supportStore.subscribe((values) => {
    support = values.support;
    supportDetails = values.supportDetails;
    establishments = values.establishments;
    measures = values.measures;
    warehouses = values.warehouses;
    tipoIva = values.tipoIva;

    initialPushData();
    selectCodEstab();
  });
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
                  bind:value={support.businessName}
                  class="form-control"
                  disabled
                  placeholder="Ingrese C.I o Nombre Comercial"
                  data-bts-button-down-class="btn btn-secondary btn-outline"
                  data-bts-button-up-class="btn btn-secondary btn-outline"
                />
                <span
                  class="input-group-btn input-group-append bootstrap-touchspin-injected"
                >
                  <button
                    disabled
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
            <label for="">
              N° Identificación <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              disabled
              bind:value={support.idCard}
              class="form-control"
            />
          </div>
          <div class="col-sm-2 nopadding">
            <label for="">
              Fecha Emisión <span class="text-danger">*</span>
            </label>
            <input type="date" bind:value={support.date} class="form-control" />
            <small><span class="text-success">Datos de prueba</span></small>
          </div>
          <div class="col-sm-4 nopadding">
            <div class="form-group">
              <label for=""
                >Establecimiento
                <span class="text-danger"> *</span>
              </label>
              <select
                class="form-control custom-select"
                bind:value={support.codEstab}
                on:change={() => refreshWarehouseCodEstab(support.codEstab)}
              >
                <option disabled>::SELECCIONE::</option>
                {#each establishments as item}
                  <option value={item.codEstab}>{item.nombreComercial}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-sm-4 nopadding">
            <div class="form-group m-b-0">
              <label for=""> Buscar por artículo </label>
              <AdvancedSearch
                on:input={onInputArticle}
                on:focus={onFocusArticle}
                on:blur={onBlurArticle}
                value={valueArticle}
                placeholder={placeholderArticle}
              />
              {#if articles.length > 0}
                <div class="floating-results list-group">
                  {#each articles as item}
                    <a
                      on:click={() => selectArticle(item)}
                      href={null}
                      class="list-group-item"
                      ><i class="ti-user" /> - {item.codigo}
                      - {item.descripcion}</a
                    >
                  {/each}
                </div>{/if}
            </div>
          </div>
          <div class="col-sm-2 nopadding">
            <label for="cliente" class=""> Buscar por Código </label>
            <input type="text" class="form-control" placeholder="Ej: COMP1" />
          </div>
          <div class="col-sm-3 nopadding">
            <div class="row">
              <div class="col-lg-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <button
                  on:click={saveFactura}
                  type="button"
                  class="btn btn-block btn-success mt-4"
                >
                  <i class="ti-save" /> Factura
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-3 nopadding">
            <div class="row">
              <div class="col-lg-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <button
                  type="button"
                  on:click={saveNotaEntrega}
                  class="btn btn-block btn-outline-primary mt-4"
                >
                  <i class="ti-save" /> Nota Entrega
                </button>
              </div>
            </div>
          </div>
        </div>

        <!--Add tabulator -->
        <div class="row mt-4">
          <div class="col-12">
            <GridForItem arrayData={supportDetails} columns={colums} />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12 col-sm-12">
            <div class="pull-right text-right">
              <address>
                <h6>SubTotal sin Impuesto $07</h6>
                <h6>Total Descuento $07</h6>
                <h4>Total $435</h4>
              </address>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="submit" class="btn btn-success">
        <i class="ti-save" /> Guardar
      </button>
      <button type="button" class="btn btn-dark" on:click={() => onModalClose()}
        >&times; Cerrar</button
      >
    </div>
  </Modal>
{/if}
