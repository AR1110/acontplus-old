<script lang="ts">
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import { ArticleService } from "$lib/services/inventory/article-service";
  import { MaintenanceService } from "$lib/services/mechanical/maintenance-service";
  import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
  import { showLoader, hideLoader } from "$lib/utils/loading-spinner";
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
    articles = [];
    value = "";
    maintenanceDetails = [...maintenanceDetails, { ...e, quantity: 1 }];
  };

  // REVOME ITEM THE DETAILT SUPPORT
  const removeIten = (i) => {
    maintenanceDetails = maintenanceDetails.filter(
      (item, index) => index !== i
    );
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
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th class="text-center">Codigo</th>
                    <th class="text-center">Descripción</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {#each maintenanceDetails as item, index}
                    <tr>
                      <td class="text-center">{item.codigo}</td>
                      <td class="text-center">{item.descripcion}</td>
                      <td width="5%" class="text-center"
                        ><div class="col-12 col-sm-12 col-md-12 col-lg-12">
                          <b
                            ><input
                              type="text"
                              class="form-control form-control-sm"
                              bind:value={item.quantity}
                            /></b
                          >
                        </div></td
                      >
                      <td class="text-center">
                        <button
                          type="button"
                          class="btn btn-outline-danger btn-sm"
                          on:click={() => removeIten(index)}
                        >
                          <i class="ti-trash" />
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
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
