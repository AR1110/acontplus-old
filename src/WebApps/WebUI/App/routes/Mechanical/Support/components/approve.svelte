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
  let decimals = [];
  let valueArticle = "";
  let paramValidation = [undefined, null, "", 0];
  let placeholderArticle = "Buscar por C.I o Nombre Comercial";
  let currentDateString = "";
  let tarifaImpuestos = [];
  let dataCalculos = {
    totalesImpuestos: 0,
    totalesImpuestosNetos: 0,
    totalImpuestoVigente: 0,
    totalImpuestoVigenteNeto: 0,
    subTotalIvaCero: 0,
    subTotalNetoIvaCero: 0,
    subTotalExentoIva: 0,
    subTotalNetoExentoIva: 0,
    subTotalNoObjetoIva: 0,
    subTotalNetoNoObjetoIva: 0,
    iva: 0,
    sumaTotalNeto: 0,
    totalDescuento: 0,
    totalIce: 0,
    irbpnr: 0,
    propina: 0,
    total: 0,
    valorIva: 0,
  };

  const onModalClose = () => {
    supportStore.update((state) => ({
      ...state,
      isApprove: false,
    }));
  };

  // Todo: Create human format date
  const convertFormat = (date) => {
    let currentDate = new Date(date);

    currentDateString = currentDate.toLocaleDateString("es-ES", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
            bodegas: warehouses,
            decimals: decimals,
            tarifas: dataMedida.tarifas,
            tipoIvas: tipoIva,
            medidas: medidas,
            orderIndex: 0,
            ...dataArticle,
            idTarifa: dataTarifa.idTarifa,
            idBodega: idBodega,
            idMedida: dataMedida.idMedida,
            cantidad: 1,
            precioVenta: dataTarifa.precioVenta,
            precioSinSubsidio: 0,
            precioUnitario: dataTarifa.precioVenta,
            precioConIva: dataTarifa.precioConIva,
            valorDescuento: 0,
            precioTotalSinImpuesto: 0,
            porcentajeDescuento: 0,
            total: dataTarifa.precioConIva * 1,
            nota: "S/N",
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

  function getTotales() {
    let CODIGO_PORCENTAJE_IVA0 = "0",
      CODIGO_PORCENTAJE_IVAEXENTO = "7",
      CODIGO_PORCENTAJE_IVA_NO_OBJETO = "6";

    const dataTotal = supportDetails.reduce((total, itemDetails) => {
        let dataImpuesto = tipoIva.find((x) => x.idTipoIva == itemDetails.idTipoIva);

        let dataImpuestoVigente = tarifaImpuestos.find((x) => x.codigoPorcentaje == dataImpuesto.codigoPorcentaje);

        total.valorIva = dataImpuestoVigente.tarifa;

        itemDetails.cantidad = Number(itemDetails.cantidad);
        itemDetails.precioUnitario = Number(itemDetails.precioUnitario);
        itemDetails.valorDescuento = Number(itemDetails.valorDescuento);

        if (dataImpuesto.codigoPorcentaje == dataImpuestoVigente.codigoPorcentaje) {
          total.totalImpuestoVigente += itemDetails.cantidad * itemDetails.precioUnitario;
          total.totalImpuestoVigenteNeto += (itemDetails.precioUnitario - itemDetails.valorDescuento) * itemDetails.cantidad;
        }

        if (dataImpuesto.codigoPorcentaje == CODIGO_PORCENTAJE_IVA0) {
          total.subTotalIvaCero += itemDetails.cantidad * itemDetails.precioUnitario;
          total.subTotalNetoIvaCero += (itemDetails.precioUnitario - itemDetails.valorDescuento) *itemDetails.cantidad;
        }

        if (dataImpuesto.codigoPorcentaje == CODIGO_PORCENTAJE_IVAEXENTO) {
          total.subTotalExentoIva += itemDetails.cantidad * itemDetails.precioUnitario;
          total.subTotalNetoExentoIva += (itemDetails.precioUnitario - itemDetails.valorDescuento) * itemDetails.cantidad;
        }

        if (dataImpuesto.codigoPorcentaje == CODIGO_PORCENTAJE_IVA_NO_OBJETO) {
          total.subTotalNoObjetoIva += itemDetails.cantidad * itemDetails.precioUnitario;
          total.subTotalNetoNoObjetoIva += (itemDetails.precioUnitario - itemDetails.valorDescuento) * itemDetails.cantidad;
        }

        total.sumaTotalNeto += itemDetails.cantidad * itemDetails.precioUnitario;
        total.valorDescuento += itemDetails.cantidad * itemDetails.precioUnitario;
        return total;
      },
      {
        totalesImpuestos: 0,
        totalesImpuestosNetos: 0,
        totalImpuestoVigente: 0,
        totalImpuestoVigenteNeto: 0,
        subTotalIvaCero: 0,
        subTotalNetoIvaCero: 0,
        subTotalExentoIva: 0,
        subTotalNetoExentoIva: 0,
        subTotalNoObjetoIva: 0,
        subTotalNetoNoObjetoIva: 0,
        iva: 0,
        sumaTotalNeto: 0,
        totalDescuento: 0,
        totalIce: 0,
        irbpnr: 0,
        propina: 0,
        total: 0,
        valorIva: 0,
      }
    );

    let iva = (dataTotal.sumaTotalNeto * dataTotal.valorIva) / 100;

    let total = dataTotal.sumaTotalNeto + iva;
    let importeTotal = total - dataTotal.totalDescuento;

    let { valorIva, totalDescuento, ...result } = dataTotal;

    // Todo: Update support
    support = {
      ...support,
      ...result,
      iva,
      total: importeTotal,
    };

    // Todo: Update dataCalculos
    dataCalculos = {
      ...result,
      iva,
      total: importeTotal,
    };
  }

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
      cellEdited: function (cell) {
        Calculations.calculateTotal(cell);
        getTotales();
      },
      editor: "input",
      field: "cantidad",
      hozAlign: "center",
      title: "Cantidad",
    },
    {
      cellEdited: function (cell) {
        Calculations.calculateTotal(cell), getTotales();
      },
      editor: customSelect.selectMeasures,
      field: "idMedida",
      formatter: Calculations.formatters,
      hozAlign: "center",
      title: "Medida",
    },
    {
      cellEdited: function (cell) {
        Calculations.calculateTotal(cell), getTotales();
      },
      editor: customSelect.selectTipoIva,
      field: "idTipoIva",
      formatter: Calculations.formatters,
      hozAlign: "center",
      title: "I.V.A",
    },
    {
      cellEdited: function (cell) {
        Calculations.calculateTotal(cell), getTotales();
      },
      editor: customSelect.selectFee,
      field: "idTarifa",
      formatter: Calculations.formatters,
      hozAlign: "center",
      title: "Tarifa",
    },
    {
      cellEdited: function (cell) {
        Calculations.calculateTotal(cell), getTotales();
      },
      editor: "input",
      field: "precioUnitario",
      hozAlign: "center",
      title: "Precio U.",
    },
    {
      cellEdited: function (cell) {
        Calculations.calculateTotal(cell), getTotales();
      },
      editor: "input",
      field: "precioConIva",
      hozAlign: "center",
      title: "P.Iva",
    },
    {
      field: "total",
      hozAlign: "center",
      title: "Total",
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
          item.decimals = decimals;
        });
      }
    }
  };

  const selectCodEstab = () => {
    if (establishments.length > 0) {
      let estab = establishments.find((x) => x.predeterminado === true);

      support.codEstab = estab.codEstab;
      tarifaImpuestos = [...JSON.parse(estab.tarifasImpuestos)];
    }
    // if (
    //   paramValidation.includes(support.codEstab) && establishments.length > 0) {
    //   let estab = establishments.find((x) => x.predeterminado === true);

    //   support.codEstab = estab.codEstab;
    //   tarifaImpuestos = [...JSON.parse(estab.tarifasImpuestos)];
    // }
  };

  const refreshWarehouseCodEstab = (codEstab) => {
    support.codEstab = codEstab;
    tarifaImpuestos = [];

    let idBodega = warehouses.find(
      (x) => x.codEstab == support.codEstab
    ).idBodega;
    tarifaImpuestos = [
      ...JSON.parse(
        establishments.find((x) => x.codEstab == support.codEstab)
          .tarifasImpuestos
      ),
    ];

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
      .then((response) => {
        console.log(response);
      })
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
    decimals = values.decimals;

    initialPushData();
    selectCodEstab();
    convertFormat(support.date);
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
            <input
              type="date"
              on:change={() => convertFormat(support.date)}
              bind:value={support.date}
              class="form-control"
            />
            <small><span class="text-success">{currentDateString}</span></small>
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
          <div class="col-8 col-sm-8" />
          <div class="col-4 col-sm-4">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td>SubTotal sin Impuesto</td>
                  <td>$ {dataCalculos.totalImpuestoVigenteNeto}</td>
                </tr>
                <tr>
                  <td>
                    <select class="form-control form-control-sm" disabled>
                      {#each tarifaImpuestos as item}
                        <option value={item.tarifa}>{item.descripcion}</option>
                      {/each}
                    </select>
                  </td>
                  <td>$ {dataCalculos.iva}</td>
                </tr>
                <tr>
                  <td>Total descuento</td>
                  <td>$ {dataCalculos.totalDescuento ?? 0}</td>
                </tr>
                <tr class="font-18">
                  <th>Total</th>
                  <th>$ {dataCalculos.total}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-dark" on:click={() => onModalClose()}
        >&times; Cerrar</button
      >
    </div>
  </Modal>
{/if}
