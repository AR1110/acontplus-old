<script lang="ts">
  import type { Establecimiento } from "@/lib/interfaces/restaurant/establecimiento";
  import type { PromotionMenu } from "@/lib/interfaces/restaurant/promotion-menu";
  import Modal from "@/lib/components/Modal.svelte";
  import type { Promotion } from "@/lib/interfaces/restaurant/promotion";
  import { usePromotionStore } from "@/routes/Restaurant/store/promotionStore";
  import AdvancedSearch from "@/lib/components/AdvancedSearch.svelte";
  import { MenuService } from "@/lib/services/restaurant/menu-service";
  import toast from "@/lib/utils/toast";
  import GridForItem from "@/lib/components/GridForItem.svelte";
  import { hideLoader, showLoader } from "@/lib/utils/loading-spinner";
  import { PromotionService } from "@/lib/services/restaurant/promotion-service";
  import { PromotionMenuService } from "@/lib/services/restaurant/promotion-menu-service";

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
  let regexHour = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  let promotionMenus: PromotionMenu[] = [];
  let value = "";
  let placeholder = "Buscar menu";
  let file;

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
          diaSemana: e.diaSemana,
          descripcion: e.descripcion,
          horaInicio: "00:00",
          horaFin: "23:59",
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
      s3ObjectUrl: menu.s3ObjectUrl || "https://i.stack.imgur.com/GNhxO.png",
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
      field: "s3ObjectUrl",
      title: "Imagen",
      formatter: "image",
      hozAlign: "center",
      resizable: false,
      headerSort: false,
      formatterParams: {
        height: "50px",
        width: "70px",
      },
    },
    {
      rezisable: true,
      editable: "never",
      field: "title",
      title: "Menu",
      with: 300,
      maxWith: 500,
    },
    {
      cellClick: (e, cell) => {
        onRemove(cell.getData().menuId);
        cell.getRow().delete();
      },
      rezisable: true,
      with: 100,
      formatter: "buttonCross",
      hozAlign: "center",
      title: "Opción",
    },
  ];

  // Todo: Save and Update promotion.
  const getPromotionMenu = (id) => {
    showLoader();
    let params = JSON.stringify({ tipo: 1 });
    PromotionMenuService.get(id, params)
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
    if (!onValidationHour()) return;

    let newPromotionMenu = promotionMenus.map((e) => {
      return {
        promotionId: e.promotionId,
        menuId: e.menuId,
      };
    });
    
    dataUpdate.promotionDays = JSON.stringify(daysSelected);
    let newObject = {
      ...dataUpdate,
      promotionMenus: newPromotionMenu,
    };

    showLoader();
    PromotionService.post(JSON.stringify(newObject), file)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.code === "1") {
            file = undefined;
            usePromotionStore.get({ codEstab: $usePromotionStore.codEstab });
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
    if (!onValidationHour()) return;

    showLoader();

    let newPromotionMenu = promotionMenus.map((e) => {
      return { id: e.id, promotionId: e.promotionId,menuId: e.menuId };
    });
    console.log(newPromotionMenu);

    dataUpdate.promotionDays = JSON.stringify(daysSelected);
    let newObject = {
      ...dataUpdate,
      promotionMenus: newPromotionMenu,
    };

    PromotionService.put(dataUpdate.id, JSON.stringify(newObject), file)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.code === "1") {
            file = undefined;
            usePromotionStore.get({ codEstab: $usePromotionStore.codEstab });
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

  const onValidationHour = () => {
    let isValid = true;
    try {
      daysSelected.forEach((e) => {
        if (e.checked) {
          if (!regexHour.test(e.horaInicio)) {
            isValid = false;
            toast({
              type: "warning",
              message: `La hora de inicio no es válida para el día ${e.descripcion}`,
            });
          }

          if (!regexHour.test(e.horaFin)) {
            isValid = false;
            toast({
              type: "warning",
              message: `La hora de fin no es válida para el día ${e.descripcion}`,
            });
          }
        }
      });
      return isValid;
    } catch (error) {
      isValid = false;
      toast({
        type: "warning",
        message: "Debe revisar las horas de inicio y fin",
      });
    }
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
    usePromotionStore.update((state) => ({
      ...state,
      isOpen: false,
      dataUpdate: {
        id: 0,
        codEstab: "",
        description: "",
        startDate: "",
        endDate: "",
        promotionDays: "",
      },
    }));
  };

  function handleFileChange(event) {
    file = event.target.files[0];
  }

  function clearImage() {
    file = undefined;
  }

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
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div class="custom-input">
            <label for="file-input" class="hover-effect">
              Haz clic o arrastra un archivo aquí
            </label>
            <input
              type="file"
              id="file-input"
              accept=".jpg, .jpeg, .png"
              on:change={handleFileChange}
            />
          </div>
          {#if file}
            <div class="image-preview">
              <img src={URL.createObjectURL(file)} alt="Preview" />
            </div>
          {/if}
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
                type="text"
                min="00:00"
                placeholder="00:00"
                disabled={!item.checked}
                bind:value={item.horaInicio}
                class="form-control"
              />
            </div>
          </div>
          <div class="col-4">
            <div class="form-group">
              <input
                type="text"
                max="23:59"
                placeholder="00:00"
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

<style>
  /* Estilos CSS aquí */
  /* Estilos CSS aquí */
  .custom-input {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .custom-input:hover {
    border-color: #007bff;
  }

  .hover-effect {
    display: block;
    transition: color 0.3s ease;
    margin-bottom: 10px;
  }

  .custom-input:hover .hover-effect {
    color: #007bff;
  }

  .image-preview {
    margin-top: 20px;
  }

  .image-preview img {
    max-width: 100%;
    height: 100px;
    object-fit: cover;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }

  /* Estilo para el input file */
  input[type="file"] {
    display: none;
  }

  label[for="file-input"] {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  label[for="file-input"]:hover {
    background-color: #fff;
  }
</style>
