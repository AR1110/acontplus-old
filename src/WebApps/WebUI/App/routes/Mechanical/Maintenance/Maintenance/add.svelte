<script lang="ts">
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import { ArticleService } from "$lib/services/inventory/article-service";
  import { MaintenanceService } from "$lib/services/mechanical/maintenance-service";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import { showLoader, hideLoader } from "$lib/utils/loading-spinner";
  import GridForItem from "$lib/components/GridForItem.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import toast from "$lib/utils/toast";

  let maintenance;
  let paramValidation = [undefined, null, "", 0];
  let value = "";
  let placeholder = "Buscar Artículos";
  let articles = [];
  let maintenanceDetails = [];

  MaintenanceStore.subscribe((values) => {
    maintenance = values.maintenance;
    maintenanceDetails = values.maintenanceDetail;
  });

  // Todo: GRID COLUMNS
  let selectFee = (cell, onRendered, success, cancel) => {
    let fees = [];
    let rows = cell.getRow().getData();

    if (rows.fees === undefined) fees = [];
    if (rows.fees != undefined) fees = JSON.parse(rows.fees);

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

    selectList.addEventListener("keydown", function (e) {
      if (e.keyCode == 13) {
        onChange();
      }
      if (e.keyCode == 27) {
        cancel();
      }
    });

    for (let i = 0; i < fees.length; i++) {
      let option = document.createElement("option");

      option.value = fees[i].idTarifa.toString();
      option.text = fees[i].tarifa;
      if (fees[i].idMedida === rows) {
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

    fees = JSON.parse(row.fees);
    return fees.find((x) => x.idTarifa == value).tarifa;
  };

  let calculateTotal = (cell) => {
    let row = cell.getRow().getData();
    let totalDiscount = 0;

    let column = cell.getColumn()._column.field;

    if (column === "feeId") {
      let fee = JSON.parse(row.fees).find((x) => x.idTarifa == row.feeId);

      cell.getRow().update({
        priceIVA: fee.precioConIva,
        price: fee.precioVenta,
      });
    }

    if (column === "quantity") {
      if (row.quantity >= 0) {
        cell.getRow().update({ quantity: row.quantity });
      } else {
        let oldValue = cell.getOldValue();
        cell.getRow().update({ quantity: oldValue });
      }
    }

    totalDiscount = (row.priceIVA - row.discountValue) * row.quantity;
    if (!paramValidation.includes(totalDiscount)) {
      totalDiscount = parseFloat(totalDiscount.toFixed(2));
    }
    cell.getRow().update({ subtotal: totalDiscount });
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
      editable: "never",
      field: "medida",
      hozAlign: "center",
      title: "Medida",
      with: 100,
    },
    {
      field: "feeId",
      hozAlign: "center",
      title: "Tarifa",
      typeNumber: true,
      with: 100,
    },
    {
      editable: "never",
      field: "priceIva",
      hozAlign: "center",
      title: "Precio ",
      with: 100,
    },
    {
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
        cell.getRow().delete();
      },
      formatter: "buttonCross",
      hozAlign: "center",
      resizable: false,
      title: "Opción",
      width: 100,
    },
  ];

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

        //
        let dataMedida = medidas[0];
        let dataTarifa = dataMedida.tarifas[0];
        let obj = {
          ...dataArticle,
          medidas,
          tarifas: dataMedida.tarifas,
          idMedida: dataMedida.idMedida,
          idTarifa: dataTarifa.idTarifa,
          quantity: 1,
          price: dataTarifa.precioConIva,
          total: dataTarifa.precioConIva * 1,
        };

        console.log(obj);

        maintenanceDetails = [...maintenanceDetails, obj];
      }
    });
  };


  // Save
  const onSave = () => {
    if (!onValidate()) return;
    showLoader();
    MaintenanceService.post({
      data: {
        maintenance,
        maintenanceDetails: maintenanceDetails.map((item) => ({
          id: item.id > 0 ? item.id : 0,
          articuloId: item.idArticulo,
          description: item.descripcion,
          quantity: item.quantity,
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
    MaintenanceService.put(maintenance.id, {
      data: {
        maintenance,
        maintenanceDetails: maintenanceDetails.map((item) => ({
          id: item.id > 0 ? item.id : 0,
          articuloId: item.idArticulo,
          description: item.descripcion,
          quantity: item.quantity,
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
      if (paramValidation.includes(maintenance.date)) {
        toast({ type: "warning", message: "Ingrese la fecha" });
        return;
      }

      if (paramValidation.includes(maintenance.inspectionId)) {
        toast({
          type: "warning",
          message: "Seleccione a que inspección se hará el mantenimiento",
        });
        return;
      }

      if (paramValidation.includes(maintenance.obs)) {
        toast({
          type: "warning",
          message: "Detalle el mantenimiento que esta realizando",
        });
        return;
      }

      if (maintenanceDetails.length == 0) {
        toast({
          type: "warning",
          message: "Ingreso un detalle",
        });
        return;
      }

      return isValid;
    } catch (error) {
      console.log(error);
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
        inspectionId: 0,
        date: new Date().toISOString().slice(0, 10),
        obs: "",
      },
      maintenanceDetail: [],
    }));
  };
</script>

{#if $MaintenanceStore.isOpen}
  <Modal
    open={$MaintenanceStore.isOpen}
    iconTitle={maintenance.id > 0 ? "ti-async" : "ti-plus"}
    title={maintenance.id > 0 ? "Actualizar" : "Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form
        autocomplete="off"
        style="text-transform:uppercase"
        on:submit|preventDefault={maintenance.id > 0 ? onUpdate : onSave}
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
                bind:value={maintenance.date}
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
              bind:value={maintenance.obs}
            />
          </div>
        </div>

        <hr />

        <div class="row">
          <div class="col">
            <label for="serch">Buscar Repuestos </label>
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
          <div class="col" />
        </div>
        <hr />

        <div class="row mt-2">
          <div class="col-12">
            <GridForItem arrayData={maintenanceDetails} columns={maintenanceDetailsColumns} />
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
