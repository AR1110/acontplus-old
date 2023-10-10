<script lang="ts">
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import { ArticleService } from "$lib/services/inventory/article-service";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import { showLoader, hideLoader } from "$lib/utils/loading-spinner";
  import GridForItem from "$lib/components/GridForItem.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import toast from "$lib/utils/toast";
  import { SupportDetailService } from "$services/Mechanical/support-detail-service";

  let support;
  let paramValidation = [undefined, null, "", 0];
  let value = "";
  let placeholder = "Buscar Artículos";
  let articles = [];
  let supportDetails = [];
  let establecimientos = [];
  let bodegas = [];
  let medidas = [];
  let codEstab = "";

  // Todo: GRID COLUMNS
  let selectBodega = (cell, onRendered, success, cancel) => {
    let bodegas = [];
    let rows = cell.getRow().getData();

    if (rows.bodegas != undefined || rows.bodegas != null) {
      bodegas = rows.bodegas;
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

    for (let i = 0; i < bodegas.length; i++) {
      let option = document.createElement("option");

      option.value = bodegas[i].idBodega.toString();
      option.text = bodegas[i].bodega;
      if (bodegas[i].idBodega === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    console.log(selectList);
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
        cell.getElement().dataset.feeId = selectList.selectedOptions[0].value;
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

  let selectMedidas = (cell, onRendered, success, cancel) => {
    let medidas = [];
    let rows = cell.getRow().getData();

    if (rows.medidas != undefined || rows.medidas != null) {
      medidas = rows.medidas;
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

    for (let i = 0; i < medidas.length; i++) {
      let option = document.createElement("option");

      option.value = medidas[i].idMedida.toString();
      option.text = medidas[i].descripcion;
      if (medidas[i].idTarifa === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  let formatterFee = (cell) => {
    let fees = [];
    let row = cell.getRow().getData();
    let value = cell.getValue();

    if (row.tarifas != undefined && value != undefined) {
      fees = row.tarifas;

      return fees.find((x) => x.idTarifa == value).tarifa;
    }
    return "";
  };

  let formatterMedida = (cell) => {
    let medidas = [];
    let row = cell.getRow().getData();
    let value = cell.getValue();

    if (row.medidas != undefined && value != undefined) {
      medidas = row.medidas;

      return medidas.find((x) => x.idMedida == value).descripcion;
    }
    return "";
  };

  let formatterBodega = (cell) => {
    let bodegas = [];
    let row = cell.getRow().getData();
    let value = cell.getValue();

    if (row.bodegas != undefined && value != undefined) {
      bodegas = row.bodegas;

      return bodegas.find((x) => x.idBodega == value).bodega;
    }
    return "SELECCIONE";
  };

  let calculateTotal = (cell) => {
    let row = cell.getRow().getData();
    let column = cell.getColumn()._column.field;

    if (column == "idTarifa") {
      let tarifa = row.tarifas.find((x) => x.idTarifa == row.idTarifa);

      cell.getRow().update({ priceIva: tarifa.precioConIva });
    }

    if (column == "quantity") {
      if (row.quantity >= 0) {
        cell.getRow().update({ quantity: row.quantity });
      } else {
        let oldQuantity = cell.getOldValue();
        cell.getRow().update({ quantity: oldQuantity });
      }
    }
    let total = row.priceIva * row.quantity;
    cell.getRow().update({ total: total });
  };

  let maintenanceDetailsColumns = [
    {
      editable: "never",
      field: "descripcion",
      title: "Producto",
      with: 300,
    },
    {
      editable: "never",
      field: "codigoArticulo",
      hozAlign: "center",
      title: "Código",
      with: 100,
    },
    {
      editor: selectBodega,
      formatter: formatterBodega,
      field: "idBodega",
      hozAlign: "center",
      title: "Bodega",
      with: 100,
    },
    {
      editor: selectMedidas,
      formatter: formatterMedida,
      field: "idMedida",
      hozAlign: "center",
      title: "Medida",
      with: 100,
    },
    {
      editor: selectFee,
      formatter: formatterFee,
      cellEdited: calculateTotal,
      field: "idTarifa",
      hozAlign: "center",
      title: "Tarifa",
      typeNumber: true,
      with: 100,
    },
    {
      editable: "never",
      field: "priceIva",
      hozAlign: "center",
      title: "Precio",
      with: 100,
    },
    {
      cellEdited: calculateTotal,
      editor: "input",
      field: "quantity",
      hozAlign: "center",
      title: "Cantidad",
      sorter: "number",
      with: 200,
    },
    {
      calcBottom: "sum",
      editable: false,
      editor: "input",
      field: "total",
      hozAlign: "center",
      title: "Total",
      with: 100,
    },
    {
      cellClick: (e, cell) => {
        removeArticle(cell.getData().idArticulo);
        cell.getRow().delete();
      },
      formatter: "buttonCross",
      hozAlign: "center",
      resizable: false,
      title: "Opción",
      width: 100,
    },
  ];

  // AUXILIAR FUNCTIONS FOR SELECT DATA
  const selectCodEstab = () => {
    if (supportDetails != undefined || supportDetails != null) {
      if (supportDetails.length > 0) {
        codEstab = supportDetails[0].codEstab;
      }
    }

    if (paramValidation.includes(codEstab) && establecimientos.length > 0) {
      codEstab = establecimientos[0].codEstab;
    }
  };

  let verifyMaintenanceDetailsAndPush = () => {
    if (supportDetails != undefined || supportDetails != null) {
      if (supportDetails.length != 0) {
        supportDetails.forEach((item) => {
          item.medidas = medidas.filter((x) => x.idArticulo == item.idArticulo);
          item.tarifas = JSON.parse(
            medidas.find((x) => x.idMedida == item.idMedida).tarifas
          );
          item.bodegas = bodegas;
          item.priceIva = item.price;
          item.total = item.priceIva * item.quantity;
        });
      }
    }
  };

  // Refresh bodegas
  const refreshBodegas = (codEstab) => {
    let idBodega = bodegas.find((x) => x.codEstab == codEstab).idBodega;

    if (!paramValidation.includes(idBodega)) {
      codEstab = codEstab;
      supportDetails.forEach((item) => {
        item.idBodega = idBodega;
      });
      supportDetails = [...supportDetails];
    }
  };

  // SEARCH THE VECICLES WITH CUSTOMER
  const onInput = async (e) => {
    value = e.target.value;
    articles = [];
    let data = {};
    if (value.length < 3) return;
    data = {
      busqueda: value,
    };
    ArticleService.search(JSON.stringify(data)).then((response) => {
      if (response) {
        articles = response;
      }
    });
  };

  const onFocus = () => {};

  const onBlur = (e) => {
    if (!value) {
      articles = [];
      value = "";
    }
  };

  // CAPTURE DATA ARTICLE
  const selectArticle = (e) => {
    let dataArticle = {};
    let medidas = [];

    articles = [];
    value = "";
    ArticleService.get(
      JSON.stringify({ tipo: 6, idArticulo: e.idArticulo })
    ).then((response) => {
      if (response) {
        dataArticle = response[0][0];

        medidas = response[1].map((item) => {
          return {
            ...item,
            tarifas: JSON.parse(item.tarifas),
          };
        });

        let idBodega = bodegas.find((x) => x.codEstab == codEstab).idBodega;
        let dataMedida = medidas[0];
        let dataTarifa = dataMedida.tarifas[0];
        let obj = {
          ...dataArticle,
          medidas,
          tarifas: dataMedida.tarifas,
          idMedida: dataMedida.idMedida,
          idTarifa: dataTarifa.idTarifa,
          quantity: 1,
          priceIva: dataTarifa.precioConIva,
          price: dataTarifa.precioConIva,
          total: dataTarifa.precioConIva * 1,
          idBodega: idBodega,
          bodegas: bodegas,
        };
        supportDetails = [...supportDetails, obj];
      }
    });
  };

  // REMOVE ARTICLE
  const removeArticle = (idArticulo) => {
    let newFilter = supportDetails.filter(
      (x) => x.idArticulo != idArticulo
    );
    supportDetails = newFilter;
  };

  // Save
  const onSave = () => {
    if (!onValidate()) return;
    showLoader();

    SupportDetailService.post({
      data: {
        support,
        supportDetails: supportDetails.map((item) => ({
          id: item.id > 0 ? item.id : 0,
          articuloId: item.idArticulo,
          tarifaId: item.idTarifa,
          bodegaId: item.idBodega,
          medidaId: item.idMedida,
          description: item.descripcion,
          quantity: item.quantity,
          price: item.priceIva,
          cost: item.precioCosto,
          total: item.total,
          codePercentage: item.codigoPorcentaje,
          percentage: item.tarifa,
          inventory: item.llevaInventario,
        })),
      },
    }).then((response) => {
      hideLoader();
      if (response.code == 1) {
        toast({ type: "success", message: response.message });
        onModalClose();
      } else {
        toast({ type: "warning", message: response.message });
      }
    });
  };

  // edit
  const onUpdate = () => {
    if (!onValidate()) return;
    showLoader();

    SupportDetailService.put(support.id, {
      data: {
        support,
        supportDetails: supportDetails.map((item) => ({
          id: item.id > 0 ? item.id : 0,
          articuloId: item.idArticulo,
          tarifaId: item.idTarifa,
          bodegaId: item.idBodega,
          medidaId: item.idMedida,
          description: item.descripcion,
          quantity: item.quantity,
          price: item.priceIva,
          cost: item.precioCosto,
          total: item.total,
          codePercentage: item.codigoPorcentaje,
          percentage: item.tarifa,
          inventory: item.llevaInventario,
        })),
      },
    }).then((response) => {
      hideLoader();
      if (response.code == 1) {
        toast({ type: "success", message: response.message });
        onModalClose();
      } else {
        toast({ type: "warning", message: response.message });
      }
    });
  };

  // validation
  const onValidate = () => {
    let isValid = true;
    try {
      if (paramValidation.includes(support.date)) {
        toast({ type: "warning", message: "Ingrese la fecha" });
        return;
      }

      if (paramValidation.includes(support.id)) {
        toast({
          type: "warning",
          message: "Seleccione a que inspección se hará el mantenimiento",
        });
        return;
      }

      if (paramValidation.includes(support.obs)) {
        toast({
          type: "warning",
          message: "Detalle el mantenimiento que esta realizando",
        });
        return;
      }

      if (supportDetails.length == 0) {
        toast({
          type: "warning",
          message: "Ingreso un detalle",
        });
        return;
      }

      return isValid;
    } catch (error) {
      return false;
    }
  };

  // CLOSE MODAL
  const onModalClose = () => {
    MaintenanceStore.update((state) => ({
      ...state,
      isOpen: false,
      maintenance: {
        id: 0,
        supportId: 0,
        date: new Date().toISOString().slice(0, 10),
        obs: "",
      },
      maintenanceDetail: [],
    }));
  };

  MaintenanceStore.subscribe((values) => {
    support = values.support;
    supportDetails = values.supportDetail;
    establecimientos = values.establecimiento;
    bodegas = values.bodega;
    medidas = values.medidas;

    selectCodEstab();
    verifyMaintenanceDetailsAndPush();
  });
</script>

{#if $MaintenanceStore.isOpen}
  <Modal
    open={$MaintenanceStore.isOpen}
    iconTitle={support.id > 0 ? "ti-async" : "ti-plus"}
    title={support.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form
        autocomplete="off"
        style="text-transform:uppercase"
        on:submit|preventDefault={support.id > 0 ? onUpdate : onSave}
      >
        <div class="row">
          <div class="col">
            <label for="serch">Datos del Mantenimiento </label>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-4">
            <div class="form-group">
              <label for="country"
                >Fecha <span class="text-danger"> *</span></label
              >
              <input
                type="Date"
                class="form-control"
                disabled
                bind:value={support.date}
              />
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-8 col-lg-8">
            <label for="country"
              >Detalle del Mantenimiento <span class="text-danger">
                *</span
              ></label
            >
            <input
              type="text"
              class="form-control"
              disabled
              bind:value={support.obs}
            />
          </div>
        </div>

        <hr />

        <div class="row">
          <div class="col">
            <label for="serch">Buscar Repuestos</label>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <AdvancedSearch
              on:input={onInput}
              on:focus={onFocus}
              on:blur={onBlur}
              {value}
              {placeholder}
            />
            {#if articles.length > 0}
              <div class="floating-results list-group">
                {#each articles as item}
                  <a
                    href={null}
                    class="list-group-item"
                    on:click={() => selectArticle(item)}
                    ><i class="fa fa-caret-square-o-left" /> - {item.codigo}
                    - {item.descripcion}</a
                  >
                {/each}
              </div>
            {/if}
          </div>
          <div class="col">
            <div class="form-group">
              <select
                name="establecimiento"
                id="establecimiento"
                class="form-control border-select"
                on:change={() => refreshBodegas(codEstab)}
                bind:value={codEstab}
              >
                {#each establecimientos as item}
                  <option value={item.codEstab}>
                    {item.nombreComercial}
                  </option>
                {/each}
              </select>
            </div>
          </div>
        </div>
        <hr />

        <div class="row mt-2">
          <div class="col-12">
            <GridForItem
              arrayData={supportDetails}
              columns={maintenanceDetailsColumns}
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">
            <i class="ti-save" /> Guardar</button
          >
          <button
            type="button"
            class="btn btn-dark"
            on:click={() => onModalClose()}>&times; Cerrar</button
          >
        </div>
      </form>
    </div>
  </Modal>
{/if}
