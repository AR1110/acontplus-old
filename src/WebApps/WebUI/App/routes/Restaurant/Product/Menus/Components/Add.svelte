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

  let productColumns = [
    {
      editable: "never",
      field: "descripcion",
      resizable: true,
      title: "Producto",
      with: 300,
    },
    {
      editor: "input",
      field: "quantity",
      resizable: true,
      title: "Cantidad",
      with: 100,
    },
    {
      editor: "input",
      field: "percentageDiscount",
      resizable: true,
      title: "Descuento",
      with: 100,
    },
    {
      calcBottom: "sum",
      editable: false,
      editor: "input",
      field: "total",
      resizable: true,
      title: "Total",
      with: 200,
      bottomCalc: function (data) {
        let total = 0;
        data.forEach((element) => {
          total += element;
        });
        return total;
      },
    },
    {
      cellClick: (e, cell) => {},
      formatter: "buttonCross",
      hozAlign: "center",
      title: "Opción",
      width: 100,
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
      quantity: 0,
      percentageDiscount: 0,
      total: 0,
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
    size={"modal-lg"}
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
