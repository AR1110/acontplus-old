<script lang="ts">
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import { MenuService } from "$core/services/restaurant/menu-service";
  import { useMenuStore } from "$routes/Restaurant/store/menuStore";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import GridForItem from "$core/components/GridForItem.svelte";
  import Modal from "$core/components/Modal.svelte";
  import toast from "$core/utils/toast";
  import type { Menu } from "$core/interfaces/restaurant/menu";
  import { MenuItemService } from "$core/services/restaurant/menu-item-service";
  import { itemService } from "$core/services/restaurant/item-service";

  let data = {} as Menu;
  let value = "";
  let placeholder = "Buscar producto";
  let itemSearch = [];
  let productsAdded = [];
  let menuTypes = [];
  let days = [];
  let daysChecked = [];
  let timeout;
  let codeMenuType = "";
  let validation = [undefined, null, 0, ""];

  useMenuStore.subscribe((values) => {
    data = values.dataUpdate;
    menuTypes = values.menuTypes;
    days = values.days;

    if (data.id > 0) {
      getItems(data.id);
      getCodeMenuType(data.menuTypeId);
    }
  });

  const getItems = (id: number) => {
    MenuItemService.getById(id, { id: id, tipo: 1 }).then((response) => {
      if (response) {
        productsAdded = response["menuItems"];

        verifyUpdateCell(productsAdded);
      }
    });
  };

  let verifyUpdateCell = (productsAdded) => {
    for (let i = 0; i < productsAdded.length; i++) {
      let fee = JSON.parse(productsAdded[i].fees).find(
        (x) => x.idTarifa == productsAdded[i].feeId
      );
      productsAdded[i].priceIVA = fee.precioConIva;
      productsAdded[i].price = fee.precioVenta;
    }
    checkDays(days);
  };

  let getCodeMenuType = (id) => {
    let menuType = menuTypes.find((x) => x.id == id);
    codeMenuType = menuType.code;
  };

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
    let porcentaje = 0;
    let descuento = 0;
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

    if (column === "discountPercent") {
      if (row.discountPercent >= 0 && row.discountPercent <= 100) {
        porcentaje = row.discountPercent / 100;
        descuento = row.price * porcentaje;

        cell.getRow().update({
          discountPercent: row.discountPercent,
          discountValue: descuento,
        });
      } else {
        let oldValue = cell.getOldValue();
        cell.getRow().update({ discountPercent: oldValue });
        return toast({
          type: "warning",
          message: "El descuento no puede ser mayor al 100%",
        });
      }
    }
    totalDiscount = (row.price - row.discountValue) * row.quantity;
    cell.getRow().update({ subtotal: totalDiscount });
  };

  const removeFromList = (id: number) => {
    let newArray = productsAdded.filter((x) => x.id !== id);
    productsAdded = newArray;
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
      cellEdited: calculateTotal,
      field: "feeId",
      hozAlign: "center",
      title: "Tarifa",
      typeNumber: true,
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
      sorter: "number",
      cellEdited: calculateTotal,
      with: 200,
    },
    {
      editor: "input",
      field: "discountPercent",
      title: "Desc. %",
      sorter: "number",
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

        if (!validation.includes(discountValue)) {
          discountValue = parseFloat(discountValue.toFixed(2));
        } else {
          discountValue = 0;
        }
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

        if (!validation.includes(subtotal)) {
          subtotal = parseFloat(subtotal.toFixed(2));
        } else {
          subtotal = 0;
        }
        return subtotal;
      },
    },
    {
      cellClick: (e, cell) => {
        removeFromList(cell.getData().id);
        cell.getRow().delete();
      },
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
      let json = { pageIndex: 1, pageSize: 10, tipo: 1, textSearch: value };

      itemService.get(JSON.stringify(json)).then((response) => {
        if (response) {
          itemSearch = response["items"];
        }
      });
    }, 300);
  };

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
      codigo: item.codigo,
      medida: item.medida,
      menuId: data.id,
      feeId: 0,
      quantity: 0,
      discountPercent: 0,
      discountValue: 0,
      subtotal: 0,
    };

    getTarifaById(newMenuItem.productId, newMenuItem);
  };

  const getTarifaById = (productId, newMenuItem) => {
    MenuItemService.getById(0, { productId: productId, tipo: 2 }).then(
      (response) => {
        if (response) {
          let newFees = response["tarifas"];

          newFees.forEach((e) => {
            if (e.precioPredeterminado) {
              newMenuItem.feeId = e.idTarifa;
              newMenuItem.priceIVA = e.precioConIva;
              newMenuItem.price = e.precioVenta;
            }
          });

          productsAdded.forEach((e) => {
            if (validation.includes(e.price)) {
              e.price = 0;
            }

            if (validation.includes(e.priceIVA)) {
              e.priceIVA = 0;
            }
          });

          newMenuItem.fees = JSON.stringify(newFees);
          productsAdded = [...productsAdded, newMenuItem];
        }
      }
    );
  };

  // Todo: MODAL
  const onModalClose = () => {
    useMenuStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
    daysChecked = [];
    productsAdded = [];
  };

  const onUpdate = () => {
    if (!onValidate()) return;

    let summary = productsAdded.map((item) => item.descripcion).join(", ");
    data.summary = summary;

    data.promotionDays = "";
    data.promotionDays = JSON.stringify(daysChecked);

    let forSave = {
      ...data,
      menuItems: productsAdded,
    };
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

  // Todo: DAYS CHECKBOX
  let checkDays = (days) => {
    if (data.promotionDays.length > 0) {
      let daysPromotion = JSON.parse(data.promotionDays);
      return (daysChecked = daysPromotion);
    }

    if (data.promotionDays.length <= 0) {
      days.forEach((e) => {
        daysChecked.push({
          idDia: e.idDia,
          descripcion: e.descripcion,
          horaInicio: "00:00",
          horaFin: "00:00",
          checked: false,
        });
      });
      daysChecked = daysChecked;
    }
  };
</script>

{#if $useMenuStore.isOpen}
  <Modal
    open={$useMenuStore.isOpen}
    iconTitle={"ti-plus"}
    title={`Menu - ${data.id > 0 ? data.title : ""}`}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
    onClosed={() => onModalClose()}
  >
    <div class="modal-body">
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
                  on:change={() => getCodeMenuType(data.menuTypeId)}
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

          {#if codeMenuType === "PROM"}
            <div class="row mt-3">
              <div class="col-6">
                <div class="form-group">
                  <label for="">Fecha Inicio</label>
                  <input
                    type="date"
                    class="form-control"
                    bind:value={data.startDate}
                    max={data.endDate}
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="">Fecha Fin</label>
                  <input
                    type="date"
                    class="form-control"
                    min={data.startDate}
                    bind:value={data.endDate}
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="">Días y horas de promoción</label>
            </div>
            <div class="row">
              {#each daysChecked as item}
                <div class="col-4">
                  <div class="checkbox icheck-primary">
                    <input
                      type="checkbox"
                      bind:checked={item.checked}
                      id="primary_{item.idDia}"
                    />
                    <label for="primary_{item.idDia}">{item.descripcion}</label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <input
                      type="time"
                      disabled={!item.checked}
                      bind:value={item.horaInicio}
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <input
                      type="time"
                      disabled={!item.checked}
                      bind:value={item.horaFin}
                      class="form-control"
                    />
                  </div>
                </div>
              {/each}
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
                        ><i class="fa-solid fa-bowl-food" />
                        {item.descripcion}</a
                      >
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
          <div class="row mt-2">
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
    </div>
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
