<script lang="ts">
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import { MenuService } from "$core/services/restaurant/menu-service";
  import { useMenuStore } from "$routes/Restaurant/store/menuStore";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import GridForItem from "$core/components/GridForItem.svelte";
  import Modal from "$core/components/Modal.svelte";
  import toast from "$core/utils/toast";
  import type { Menu } from "$core/interfaces/restaurant/menu";
  import moment from "moment";

  let data = {} as Menu;
  let value = "";
  let placeholder = "Buscar producto";
  let itemSearch = [];
  let productsAdded = [];
  let menuTypes = [];
  let timeout;

  // Moment local date
  let thisMoment = moment();
  let endOfMonth = moment(thisMoment).endOf("month");
  let startOfMonth = moment(thisMoment).startOf("month");

  let dateRangePicker = {
    date: { startDate: startOfMonth, endDate: endOfMonth },
    picker: null,
    pickerClasses: "extra-class-names",
    options: {
      pickerClasses: "custom-display", //angular-daterangepicker extra
      buttonClasses: "btn",
      applyButtonClasses: "btn-success",
      cancelButtonClasses: "btn-danger",
      locale: {
        applyLabel: "Aplicar",
        cancelLabel: "Cancelar",
        customRangeLabel: "Rango Personalizado",
        separator: " - ",
        format: "YYYY-MM-DD",
      },
      ranges: {
        "Ultimos 15 Días": [moment().subtract(14, "days"), moment()],
        "Ultimos 30 Días": [moment().subtract(29, "days"), moment()],
      },
      eventHandlers: {
        "apply.daterangepicker": function (event, picker) {},
      },
    },
  };

  useMenuStore.subscribe((values) => {
    data = values.dataUpdate;
    itemSearch = values.items;
    menuTypes = values.menuTypes;
    productsAdded = values.menuItems;
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

    if (row.fees != undefined) fees = JSON.parse(row.fees);

    for (let i = 0; i < fees.length; i++) {
      if (fees[i].idTarifa == value) {
        console.log(fees[i].tarifa);
        value = fees[i].tarifa;
        cell.getRow().update({
          priceIVA: fees[i].precioConIva,
          price: fees[i].precioVenta,
        });
        break;
      }
    }
    return value;
  };

  let calculateTotal = (cell) => {
    let row = cell.getRow().getData();
    let porcentaje = 0;
    let descuento = 0;
    let totalDiscount = 0;

    porcentaje = row.discountPercent / 100;
    descuento = row.price * porcentaje;
    totalDiscount = (row.price - descuento) * row.quantity;

    cell.getRow().update({ discountValue: descuento, subtotal: totalDiscount });
  };


  let productColumns = [
    {
      editable: "never",
      field: "descripcion",
      title: "Producto",
      with: 300,
    },
    {
      editable: "never",
      field: "codigo",
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
      editor: selectFee,
      formatter: formatterFee,
      field: "feeId",
      hozAlign: "center",
      title: "Tarifa",
      with: 100,
    },
    {
      editable: "never",
      field: "priceIVA",
      hozAlign: "center",
      title: "Precio IVA",
      with: 100,
    },
    {
      field: "price",
      hozAlign: "center",
      title: "Precio Venta",
      with: 200,
    },
    {
      editor: "input",
      field: "quantity",
      hozAlign: "center",
      title: "Cantidad",
      cellEdited: calculateTotal,
      with: 200,
    },
    {
      editor: "input",
      field: "discountPercent",
      title: "Desc. %",
      hozAlign: "center",
      with: 200,
      cellEdited: calculateTotal,
    },
    {
      editable: "never",
      field: "discountValue",
      title: "Valor Descuento",
      hozAlign: "center",
      with: 200,
      calcBottom: "sum",
      bottomCalc: function (data) {
        let discountValue = 0;
        data.forEach((element) => {
          discountValue += element;
        });
        return discountValue;
      },
    },
    {
      calcBottom: "sum",
      editable: false,
      editor: "input",
      field: "subtotal",
      hozAlign: "center",
      title: "Subtotal",
      with: 100,
      bottomCalc: function (data) {
        let subtotal = 0;
        data.forEach((element) => {
          subtotal += element;
        });
        return subtotal;
      },
    },
    {
      cellClick: (e, cell) => {},
      formatter: "buttonCross",
      hozAlign: "center",
      resizable: false,
      title: "Opción",
      width: 100,
    },
  ];

  // Todo: SEARCH ITEM
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

  // Todo: GET ITEM SEARCH
  const getItemSearch = (id, data) => {
    const item = itemSearch.find((x) => x.id === id);

    // Verify in the list if the item exists
    const itemExists = productsAdded.find(
      (x) => x.productId === item.productId
    );
    if (itemExists)
      return toast({
        type: "warning",
        message: "Ya existe agregado para el combo",
      });

    let newMenuItem = {
      id: 0,
      itemId: item.id,
      productId: item.productId,
      costPrice: item.costPrice,
      descripcion: item.descripcion,
      menuId: data.id,
      feeId: 0,
      quantity: 0,
      discountPercent: 0,
      discountValue: 0,
      subtotal: 0,
      fees: item.fees,
    };

    useMenuStore.update((state) => ({
      ...state,
      menuItems: [...state.menuItems, newMenuItem],
    }));
  };

  const onModalClose = () => {
    productsAdded = [];
    useMenuStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
  };

  const onUpdate = () => {
    if (!onValidate()) return;

    let forSave = { ...data, menuItems: productsAdded };

    showLoader();
    MenuService.put(data.id, { data: forSave })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.code === "1") {
            toast({ type: "success", message: response.data.message });
            onModalClose();
          } else {
            toast({ type: "warning", message: response.data.message });
          }
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  const onValidate = () => {
    let isValid = true;
    try {
      if (productsAdded.length <= 0) {
        toast({
          type: "warning",
          message: "Debe agregar productos para crear el combo",
        });
        isValid = false;
      }
      return isValid;
    } catch (error) {
      toast({ type: "error", message: "Verifica los campos requeridosa" });
      isValid = false;
    }
  };
</script>

{#if $useMenuStore.isOpen}
  <Modal
    open={$useMenuStore.isOpen}
    iconTitle={"ti-plus"}
    title={`Menu - ${data.id > 0 ? data.title : ""}`}
    fullScreen={true}
    onClosed={() => onModalClose()}
  >
    <form on:submit|preventDefault={onUpdate}>
      <div class="modal-body">
        <div class="row">
          <div class="col-6">
            <div class="form-group input-group-lg">
              <label for="menu-type">Tipo Menu</label>
              <select
                bind:value={data.menuTypeId}
                class="form-control"
                id="menu-type"
              >
                <option disabled>SELECCIONE</option>
                {#each menuTypes as items}
                  <option value={items.id}>
                    {items.name}
                  </option>
                {/each}
              </select>
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="">Descripción</label>
              <input
                type="text"
                class="form-control input-group-lg"
                bind:value={data.title}
              />
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
          <div class="col-12">
            <div class="form-group">
              <label for="">Contenido</label>
              <textarea class="form-control" bind:value={data.content} />
            </div>
          </div>
        </div>

        {#if data.menuTypeId === 3}
          <div class="row">
            <div class="col-12">
              <label for="dateRange">Rango de Fechas </label>
              <input
                class="form-control input-group-lg date-picker"
                type="text"
                bind:value={dateRangePicker.date}
                placeholder="Seleccione la fecha"
              />
            </div>
          </div>
        {/if}

        <div class="row mt-3">
          <div class="col-8 col-md-12 col-sm-12">
            <label for="search">Buscar producto </label>
            <div class="form-group input-group-lg">
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
            <GridForItem arrayData={productsAdded} columns={productColumns} />
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
