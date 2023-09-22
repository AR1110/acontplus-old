<script lang="ts">
  import type { Establecimiento } from "$core/interfaces/restaurant/establecimiento";
  import type { PromotionMenu } from "$core/interfaces/restaurant/promotion-menu";
  import Modal from "$core/components/Modal.svelte";
  import type { Promotion } from "$core/interfaces/restaurant/promotion";
  import { usePromotionStore } from "$routes/Restaurant/store/promotionStore";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import { MenuService } from "$core/services/restaurant/menu-service";
  import toast from "$core/utils/toast";
  import GridForItem from "$core/components/GridForItem.svelte";
  import { hideLoader, showLoader } from "$core/utils/loading-spinner";
  import { PromotionService } from "$core/services/restaurant/promotion-service";
  import { PromotionMenuService } from "$core/services/restaurant/promotion-menu-service";
  import { remove } from "toastr";

  // Variables.
  let dataUpdate: Promotion = {
    id: 0,
    codEstab: "",
    description: "",
    startDate: "",
    endDate: "",
    promotionDays: "",
  };
  let establecimientos: Establecimiento[] = [];
  let days = [];
  let daysSelected = [];
  let itemSearch = [];
  let validation = [undefined, null, 0, ""];
  let promotionMenus: PromotionMenu[] = [];
  let value = "";
  let placeholder = "Buscar menu";

  //Todo: Manipulate days.
  const onDaySelected = () => {
    dataUpdate.promotionDays = dataUpdate.promotionDays || "";

    if (dataUpdate.promotionDays.length > 0) {
      return (daysSelected = JSON.parse(dataUpdate.promotionDays));
    }

    if (dataUpdate.promotionDays.length <= 0) {
      return (daysSelected = days.map((e) => {
        return {
          idDia: e.idDia,
          descripcion: e.descripcion,
          horaInicio: "00:00",
          horaFin: "00:00",
          checked: false,
        };
      }));
    }
  };

  // Todo: Search menu.
  const onInput = async (e) => {
    value = e.target.value;
    itemSearch = [];

    if (value.length > 3) return;
    if (validation.includes(value)) return;

    let params = JSON.stringify({ textSearch: value });

    // Apply debounce in search
    MenuService.get(params).then((response) => {
      if (response) {
        itemSearch = response["menus"];
      }
    });
  };

  const onFocus = () => {};

  const onBlur = () => {
    if (!value) {
      itemSearch = [];
      value = "";
    }
  };

  const selectSearch = (id, data) => {
    const menu = itemSearch.find((e) => e.id === id);
    const exists = promotionMenus.find((e) => e.menuId === menu.id);

    if (exists)
      return toast({
        type: "warning",
        message: "Ya existe agregado para la promoción",
      });

    let newPromotionMenu = {
      id: 0,
      promotionId: data.id,
      menuId: menu.id,
      title: menu.title,
    };

    promotionMenus = [...promotionMenus, newPromotionMenu];
    itemSearch = [];
    value = "";
  };

  // Todo: Grid tables configuration.
  const onRemove = (id) => {
    promotionMenus = promotionMenus.filter((e) => e.menuId !== id);
    promotionMenus = [...promotionMenus];
  };

  let productColumns = [
    {
      align: "center",
      field: "id",
      title: "Id",
    },
    {
      editable: "never",
      field: "title",
      title: "Menu",
      with: 500,
    },
    {
      cellClick: (e, cell) => {
        onRemove(cell.getData().menuId);
        cell.getRow().delete();
      },
      formatter: "buttonCross",
      hozAlign: "center",
      title: "Opción",
      width: 100,
    },
  ];

  // Todo: Save and Update promotion.
  const getPromotionMenu = (id) => {
    showLoader();
    PromotionMenuService.get(id)
      .then((response) => {
        if (response) {
          promotionMenus = response["promotionMenus"];
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  const onPost = () => {
    if (!onValidation()) return;

    dataUpdate.promotionDays = JSON.stringify(daysSelected);
    let newObject = {
      ...dataUpdate,
      promotionMenus: promotionMenus,
    };

    showLoader();
    PromotionService.post({ data: newObject })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.code === "1") {
            usePromotionStore.get();
            onModalClose();
            toast({ type: "success", message: response.data.message });
          } else {
            toast({ type: "warning", message: response.data.message });
          }
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  const onPut = () => {
    if (!onValidation()) return;

    showLoader();
    dataUpdate.promotionDays = JSON.stringify(daysSelected);
    let newObject = {
      ...dataUpdate,
      promotionMenus: promotionMenus,
    };

    PromotionService.put(dataUpdate.id, { data: newObject })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.code === "1") {
            usePromotionStore.get();
            onModalClose();
            toast({ type: "success", message: response.data.message });
          } else {
            toast({ type: "warning", message: response.data.message });
          }
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  const onValidation = () => {
    let isValid = true;

    try {
      if (validation.includes(dataUpdate.codEstab)) {
        isValid = false;
        toast({ type: "warning", message: "Seleccione un establecimiento" });
      }

      if (validation.includes(dataUpdate.description)) {
        isValid = false;
        toast({ type: "warning", message: "Ingrese una descripción" });
      }
      return isValid;
    } catch (error) {
      isValid = false;
      toast({
        type: "warning",
        message: "Debe llenar los campos obligatorios",
      });
    }
  };

  // Todo: Modal close function
  const onModalClose = () => {
    daysSelected = [];
    promotionMenus = [];
    dataUpdate = {
      id: 0,
      codEstab: "",
      description: "",
      startDate: "",
      endDate: "",
      promotionDays: "",
    };
    usePromotionStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
  };

  // Todo: Use reactive store.
  usePromotionStore.subscribe((values) => {
    dataUpdate = values.dataUpdate;
    establecimientos = values.establecimientos;
    days = values.days;

    if (days.length > 0) {
      onDaySelected();
      getPromotionMenu(dataUpdate.id);
    }
  });
</script>

{#if $usePromotionStore.isOpen}
  <Modal
    open={$usePromotionStore.isOpen}
    iconTitle={"ti-plus"}
    title="Nueva promoción"
    size={"modal-lg modal-dialog-scrollable"}
    onClosed={() => onModalClose()}
  >
    <div class="modal-body">
      <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div class="form-group">
            <label for="codEstab">Establecimiento</label>
            <select
              bind:value={dataUpdate.codEstab}
              class="form-control form-control-lg"
              id="codEstab"
            >
              {#each establecimientos as item}
                <option value={item.codEstab}>
                  {item.nombreComercial}
                </option>
              {/each}
            </select>
          </div>
        </div>
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div class="form-group">
            <label for="description">Descripción</label>
            <input
              bind:value={dataUpdate.description}
              type="text"
              class="form-control form-control-lg"
              id="description"
              placeholder=""
            />
          </div>
        </div>
      </div>

      <!-- Picker -->
      <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div class="form-group">
            <label for="description">Inicio</label>
            <input
              bind:value={dataUpdate.startDate}
              max={dataUpdate.endDate}
              type="date"
              class="form-control form-control-lg"
              id="description"
            />
          </div>
        </div>
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div class="form-group">
            <label for="description">Fin</label>
            <input
              bind:value={dataUpdate.endDate}
              min={dataUpdate.startDate}
              type="date"
              class="form-control form-control-lg"
              id="description"
            />
          </div>
        </div>
      </div>

      <div class="row mt-3">
        {#each daysSelected as item}
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

      <div class="row mt-4">
        <div class="col-8 col-md-8 col-sm-12">
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
                    on:click={() => selectSearch(item.id, dataUpdate)}
                    ><img
                      src={item.s3ObjectUrl ||
                        "https://i.stack.imgur.com/GNhxO.png"}
                      width="70"
                      height="50"
                      alt=""
                    />
                    {item.title}</a
                  >
                {/each}
              </div>
            {/if}
          </div>
        </div>
        <div class="col-4 col-md-4 col-sm-12" />
      </div>

      <div class="row mt-2">
        <div class="col-12">
          <GridForItem arrayData={promotionMenus} columns={productColumns} />
        </div>
      </div>

      <div class="modal-footer">
        <button
          on:click={dataUpdate.id > 0 ? onPut : onPost}
          type="submit"
          class="btn btn-success"
        >
          <i class="ti-save" /> Guardar
        </button>
        <button
          type="button"
          class="btn btn-dark"
          on:click={() => onModalClose()}>&times; Cerrar</button
        >
      </div>
    </div>
  </Modal>
{/if}
