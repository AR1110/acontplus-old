<script lang="ts">
  import { supportStore } from "$routes/Mechanical/Store/support.store";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import GridForItem from "$lib/components/GridForItem.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { ArticleService } from "$services/inventory/article-service";
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
            idBodega: idBodega,
            idMedida: dataMedida.idMedida,
            idTarifa: dataTarifa.idTarifa,
            medidas,
            price: dataTarifa.precioConIva,
            priceIva: dataTarifa.precioConIva,
            quantity: 1,
            tarifas: dataMedida.tarifas,
            total: dataTarifa.precioConIva * 1,
            tipoIvas: tipoIva,
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

  // Todo: Customer select to SupportDetail table
  let selectWareHouse = (cell, onRendered, success, cancel) => {
    let warehouses = [];
    let rows = cell.getRow().getData();

    if (rows.tarifas != undefined || rows.tarifas != null) {
      warehouses = rows.bodegas;
    }

    let selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.bodega = selectList.selectedOptions[0].text;
        cell.getElement().dataset.idBodega =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < warehouses.length; i++) {
      let option = document.createElement("option");

      option.value = warehouses[i].idBodega.toString();
      option.text = warehouses[i].bodega;
      if (warehouses[i].idBodega === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  let selectFee = (cell, onRendered, success, cancel) => {
    let fees = [];
    let rows = cell.getRow().getData();

    if (rows.tarifas != undefined || rows.tarifas != null) {
      fees = rows.tarifas;
    }

    let selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.tarifa = selectList.selectedOptions[0].text;
        cell.getElement().dataset.idTarifa =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < fees.length; i++) {
      let option = document.createElement("option");

      option.value = fees[i].idTarifa.toString();
      option.text = fees[i].tarifa;
      if (fees[i].idTarifa === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  let selectMeasures = (cell, onRendered, success, cancel) => {
    let measures = [];
    let rows = cell.getRow().getData();

    if (rows.medidas != undefined || rows.medidas != null) {
      measures = rows.medidas;
    }

    let selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.descripcion =
          selectList.selectedOptions[0].text;
        cell.getElement().dataset.idMedida =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < measures.length; i++) {
      let option = document.createElement("option");

      option.value = measures[i].idMedida.toString();
      option.text = measures[i].descripcion;
      if (measures[i].idMedida === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  let selectTipoIva = (cell, onRendered, success, cancel) => {
    let tipoIvas = [];
    let rows = cell.getRow().getData();

    if (rows.tipoIvas != undefined || rows.tipoIvas != null) {
      tipoIvas = rows.tipoIvas;
    }

    let selectList = document.createElement("select");
    selectList.style.width = "100%";
    selectList.style.boxSizing = "border-box";

    onRendered(function () {
      selectList.focus();
      selectList.style.height = "100%";
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.descripcion =
          selectList.selectedOptions[0].text;
        cell.getElement().dataset.idTipoIva =
          selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener("blur", onChange);

    for (let i = 0; i < tipoIvas.length; i++) {
      let option = document.createElement("option");

      option.value = tipoIvas[i].idTipoIva.toString();
      option.text = tipoIvas[i].descripcion;
      if (tipoIvas[i].idTipoIva === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };


  // Todo: Formatters for table
  let formatters = (cell) => {
    let column = cell.getColumn()._column.field;
    let row = cell.getRow().getData();
    let value = cell.getValue();

    if (column == "idTarifa") {
      let tarifas = [];

      if (row.tarifas != undefined && value != undefined) {
        tarifas = row.tarifas;

        return tarifas.find((x) => x.idTarifa == value).tarifa;
      }
      return "_";
    }

    if (column == "idMedida") {
      let medidas = [];

      if (row.medidas != undefined && value != undefined) {
        medidas = row.medidas;

        return medidas.find((x) => x.idMedida == value).descripcion;
      }
      return "_";
    }

    if (column == "idBodega") {
      let bodegas = [];

      if (row.bodegas != undefined && value != undefined) {
        bodegas = row.bodegas;

        return bodegas.find((x) => x.idBodega == value).bodega;
      }
      return "_";
    }

    if (column == "idTipoIva") {
      let tipoIvas = [];

      if (row.tipoIvas != undefined && value != undefined) {
        tipoIvas = row.tipoIvas;

        return tipoIvas.find((x) => x.idTipoIva == value).descripcion;
      }
      return "_";
    }
  };

  // Todo: Calculate total
  let calculateTotal = (cell) => {
    let row = cell.getRow().getData();
    let column = cell.getColumn()._column.field;
    let value = cell.getValue();

    if (column == "idMedida") {
      let newMeasure = row.medidas.find((x) => x.idMedida == value);

      cell.getRow().update({
        tarifas: newMeasure.tarifas,
        idTarifa: newMeasure.tarifas[0].idTarifa,
        price: newMeasure.tarifas[0].precioVenta,
        priceIva: newMeasure.tarifas[0].precioConIva,
      });

      // Todo: Update price and priceIva
    }

    if (column == "idTarifa") {
      let newFee = row.tarifas.find((x) => x.idTarifa == value);
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioConIva = calcularPrecioConIva(newFee.precioVenta, porcentaje);

      cell.getRow().update({
        price: newFee.precioVenta,
        priceIva: precioConIva,
      });
    }

    if (column == "quantity") {
    }

    if (column == "price") {
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioConIva = calcularPrecioConIva(value, porcentaje);

      cell.getRow().update({
        priceIva: precioConIva,
      });
    }

    if (column == "priceIva") {
      let porcentaje = row.tipoIvas.find(
        (x) => x.idTipoIva == row.idTipoIva
      ).porcentaje;

      let precioVenta = calcularPrecioVenta(value, porcentaje);

      cell.getRow().update({
        price: precioVenta,
      });
    }
  };

  // Todo: Auxiliar functions
  const calcularPrecioConIva = (precioVenta: number, porcentaje: number) => {
    try {
      const resultadoPorcentaje = Number(porcentaje) / 100;
      const result = Number(precioVenta) * Number(resultadoPorcentaje);
      const precioConIva = result + Number(precioVenta);
      return precioConIva;
    } catch (error) {
      toast({
        type: "error",
        message: "Se ha encontrado errores en Precio Venta",
      });
    }
  };

  const calcularPrecioVenta = (precioConIva, porcentaje) => {
    try {
      const resultadoPorcentaje = Number(porcentaje) / 100 + 1;
      const precioVenta = Number(precioConIva) / Number(resultadoPorcentaje);
      return precioVenta;
    } catch (error) {
      toastr.error(error);
    }
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
      editor: selectWareHouse,
      field: "idBodega",
      formatter: formatters,
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
      cellEdited: calculateTotal,
      editor: "input",
      field: "quantity",
      hozAlign: "center",
      title: "Cantidad",
    },
    {
      editor: selectMeasures,
      field: "idMedida",
      formatter: formatters,
      cellEdited: calculateTotal,
      hozAlign: "center",
      title: "Medida",
    },
    {
      editor: selectTipoIva,
      field: "idTipoIva",
      hozAlign: "center",
      title: "I.V.A",
      formatter: formatters,
      width: 100,
    },
    {
      cellEdited: calculateTotal,
      editor: selectFee,
      field: "idTarifa",
      formatter: formatters,
      hozAlign: "center",
      title: "Tarifa",
      width: 100,
    },
    {
      title: "Precio U.",
      field: "price",
      hozAlign: "center",
      editor: "input",
      cellEdited: calculateTotal,
      width: 100,
    },
    {
      title: "P.Iva",
      field: "priceIva",
      hozAlign: "center",
      editor: "input",
      cellEdited: calculateTotal,
      width: 100,
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
          item.priceIva = item.tarifas.find((x) => x.idTarifa == item.idTarifa).precioConIva;
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

  const findPriceIva = () => {
     
  }

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
                <button type="button" class="btn btn-block btn-success mt-4">
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
                  class="btn btn-block btn-outline-primary mt-4"
                >
                  <i class="ti-save" /> Nota Entrega
                </button>
              </div>
            </div>
          </div>
        </div>

        <!--Add tabulator -->
        <div class="row mt-2">
          <div class="col-12">
            <GridForItem arrayData={supportDetails} columns={colums} />
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
