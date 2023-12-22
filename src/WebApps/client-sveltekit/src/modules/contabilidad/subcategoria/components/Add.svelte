<script lang="ts">
    import { onMount } from "svelte";
    import { SubcategoriaService } from "$services/subcategoria-service";
    import type { Subcategoria } from "$interfaces/subcategoria";
    import Modal from "$components/Modal.svelte";
    import toast from "$utils/toast.js";
  
    export let openNew;
    export let modalClosed;
  
    let data = {} as Subcategoria;
    let categorias = [],
      tipos = [];
    const onModalClose = () => {
      openNew = false;
      modalClosed();
    };
  
    const getData = () => {
      SubcategoriaService.get(JSON.stringify({ tipo: 2 })).then((response) => {
        if (response) {
          tipos = response[0];
          categorias = response[1];
        }
      });
    };
  
    //   if (openNew) {
    //     getData();
    //   }
  
    onMount(() => {
      getData();
    });
  
    const onSave = () => {
      SubcategoriaService.post(data).then((response) => {
        if (response) {
          onModalClose();
          toast({ type: "sucess", message: response.message });
        }
      });
    };
  </script>
  
  {#if openNew}
    <Modal
      open={openNew}
      iconTitle={"ti-plus"}
      title={"Registrar Subcategoria"}
      onClosed={() => onModalClose()}
    >
      <form on:submit|preventDefault={onSave}>
        <div class="modal-body">
          <div class="row">
            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div class="form-group">
                <label for="tipo">Tipo.: <span class="text-danger">*</span></label
                >
                <select
                  name="tipo"
                  id="tipo"
                  class="form-control border-select"
                  bind:value={data.tipoId}
                >
                  {#each tipos as item}
                    <option value={item.tipoId}>
                      {item.descripcion}
                    </option>
                  {/each}
                </select>
              </div>
            </div>
  
            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div class="form-group">
                <label for="categoria"
                  >Categoria.: <span class="text-danger">*</span></label
                >
                <select
                  name="categoria"
                  id="categoria"
                  class="form-control border-select"
                  bind:value={data.categoriaId}
                >
                  {#each categorias as item}
                    <option value={item.categoriaId}>
                      {item.descripcion}
                    </option>
                  {/each}
                </select>
              </div>
            </div>
  
            <div class="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-12">
              <div class="form-group">
                <label for="descripcion"
                  >Descripción <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="descripcion"
                  bind:value={data.descripcion}
                  class="form-control border-select"
                />
              </div>
            </div>
  
            <div class="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-12">
              <div class="form-group">
                <label for="codigo"
                  >Codigo <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="codigo"
                  bind:value={data.codigo}
                  class="form-control border-select"
                />
              </div>
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
  