<script lang="ts">
  import { MaintenanceStore } from "$routes/Mechanical/Store/maintenance.store";
  import { ArticleService } from "$core/services/inventory/article-service";
  import AdvancedSearch from "$core/components/AdvancedSearch.svelte";
  import Modal from "$core/components/Modal.svelte";

  let value = "";
  let placeholder = "Buscar Artículos";
  let articles = [];
  let supportDetails = [];

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
    supportDetails = [...supportDetails, e];
  };

  // REVOME ITEM THE DETAILT SUPPORT
  const removeIten = (i) => {
    supportDetails = supportDetails.filter((item, index) => index !== i);
  };

  // CLOSE MODAL
  const onModalClose = () => {
    MaintenanceStore.update((state) => ({
      ...state,
      isOpen: false,
    }));
  };
</script>

{#if $MaintenanceStore.isOpen}
  <Modal
    open={$MaintenanceStore.isOpen}
    iconTitle={"ti-plus"}
    title={"Registrar"}
    onClosed={() => onModalClose()}
    fullScreen={true}
    size={"modal-dialog-scrollable"}
  >
    <div class="modal-body">
      <form autocomplete="off" style="text-transform:uppercase">
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
              <input type="Date" class="form-control" />
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-8 col-lg-8">
            <label for="country"
              >Detalle del Mantenimiento <span class="text-danger">
                *</span
              ></label
            >
            <input type="text" class="form-control" />
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
                  {#each supportDetails as item, index}
                    <tr>
                      <td class="text-center">{item.codigo}</td>
                      <td class="text-center">{item.descripcion}</td>
                      <td class="text-center">1</td>
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
