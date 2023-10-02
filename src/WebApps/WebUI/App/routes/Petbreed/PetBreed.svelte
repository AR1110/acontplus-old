<script>
  import { onMount } from "svelte";
  import { showLoader, hideLoader } from "$core/utils/loading-spinner";
  import { client } from "$core/api/axiosClient";
  import toast from "$core/utils/toast";
  import Swal from "sweetalert2";
  import Search from "$core/components/Search.svelte";

  let petTypes = [],
    breeds = [];
  onMount(async () => {
    showLoader();
    await client
      .get("Vet/PetTypes/")
      .then((response) => {
        petTypes = response.data;
      })
      .catch((error) => {
        hideLoader();
        console.log(error);
      });
    getBreeds();
    hideLoader();
  });

  const getBreeds = async () => {
    await client
      .get("Vet/Breeds/")
      .then((response) => {
        breeds = response.data;
        if (breeds.length > 0) {
          breeds.forEach((element, index) => {
            if (element.description === null) {
              element.description = "N/A";
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        hideLoader();
      });
  };

  let breed = {
    petTypeId: "",
    code: "",
    name: "",
    description: "",
  };

  let editStatus = false,
    showForm = false;

  const openNew = (open) => {
    showForm = open;
    if (!open && editStatus) {
      editStatus = false;
      cleanBreed();
    }
  };

  const cleanBreed = () => {
    breed = {};
  };

  const save = () => {
    if (!editStatus) {
      addBreed();
    } else {
      updateBreed();
    }
  };
  const addBreed = async () => {
    if (!breed.petTypeId) {
      toast({ type: "warning", message: "Debe seleccionar una especie" });
      return;
    }
    if (!breed.code) {
      toast({ type: "warning", message: "Debe ingresar el código" });
      return;
    }
    if (!breed.name) {
      toast({ type: "warning", message: "Debe ingresar el nombre" });
      return;
    }
    const newBreed = {
      name: breed.name,
      petTypeId: breed.petTypeId,
      code: breed.code,
      description: breed.description,
    };
    await client
      .post("Vet/Breeds/", newBreed)
      .then((response) => {
        console.log(response);
        breeds.push(response);
        breeds = breeds;
        toast({
          type: "success",
          message: "Registrada exitosamente",
        });
        openNew(false);
      })
      .catch((error) => {
        console.log(error);
      });
    cleanBreed();
  };
  const editBreed = (item) => {
    breed = item;
    editStatus = true;
  };
  const updateBreed = async () => {
    let updatedBreed = {
      id: breed.id,
      petTypeId: breed.petTypeId,
      code: breed.code,
      name: breed.name,
      description: breed.description,
    };
    await client
      .put("Vet/Breeds/" + updatedBreed.id, updatedBreed)
      .then((response) => {
        debugger;
        // const breedIndex = breeds.findIndex((b) => b.id === breed.id);
        // breeds[breedIndex] = updatedBreed;
        getBreeds();
        toast({
          type: "success",
          message: "Actualizada exitosamente",
        });
        openNew(false);
      })
      .catch((error) => {
        console.log(error);
      });

    cleanBreed();
    editStatus = false;
  };
  const deleteBreed = async (id) => {
    let { isConfirmed } = await Swal.fire({
      text: "Esta seguro de eliminar esta raza?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, proceder!",
      cancelButtonText: "No, cancelar",
    });
    if (isConfirmed) {
      await client
        .delete("Vet/Breeds/" + id)
        .then((response) => {
          console.log(response);
          toast({
            type: "success",
            message: "Eliminada exitosamente",
          });
          breeds = breeds.filter((b) => b.id !== id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  let filteredBreeds = [];

  let searchTerm = "";

  const searchBreeds = () => {
    return (filteredBreeds = breeds.filter((b) => {
      let breedName = b.name.toLowerCase();
      return breedName.includes(searchTerm.toLowerCase());
    }));
  };
</script>

<div class="row page-titles">
  <div class="col-md-5 align-self-center">
    <h5 class="text-themecolor">Razas de Mascotas</h5>
  </div>
  <div class="col-md-7 align-self-center text-right">
    <div class="d-flex justify-content-end align-items-center">
      <button
        type="button"
        on:click={() => openNew(true)}
        class="btn btn-info d-block d-lg-inline-block m-l-15"
      >
        <i class="fa fa-plus-circle" /> Nueva
      </button>
    </div>
  </div>
</div>
{#if showForm | editStatus}
  <div class="card">
    <div class="card-body">
      {#if !editStatus}
        <h5 class="card-title">Añadir Raza</h5>{:else}
        <h5 class="card-title">Editar Raza</h5>{/if}
      <form on:submit|preventDefault={save}>
        <div class="row">
          <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-4">
            <div class="form-group">
              <label for="petTypeId">Especie:</label>
              <select
                name="petTypeId"
                id="petTypeId"
                class="form-control"
                bind:value={breed.petTypeId}
              >
                <option selected disabled>Seleccione la especie</option>
                {#each petTypes as item}
                  <option value={item.id}>{item.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-4">
            <div class="form-group">
              <label for="">Código</label>
              <input
                type="text"
                name="code"
                id="code"
                min="1"
                maxlength="5"
                class="form-control"
                bind:value={breed.code}
                required
              />
            </div>
          </div>
          <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
            <div class="form-group">
              <label for="">Nombre</label>
              <input
                type="text"
                name="breed-name"
                id="breed-name"
                class="form-control"
                min="3"
                maxlength="100"
                bind:value={breed.name}
                required
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
            <div class="form-group">
              <label for="">Descripción</label>
              <input
                type="text"
                name="description"
                id="description"
                class="form-control"
                maxlength="500"
                bind:value={breed.description}
              />
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-success">
          <i class="ti-save" />
          {#if !editStatus} Guardar {:else} Actualizar{/if}
        </button>
        {#if showForm | editStatus}
          <button
            type="button"
            class="btn btn-warning"
            on:click={() => openNew(false)}
          >
            <i class="ti-close" />Cancelar
          </button>
        {/if}
      </form>
    </div>
  </div>
{/if}

{#if breeds.length > 0}
  <Search bind:searchTerm on:input={searchBreeds} placeholder="Buscar Razas" />

  <div class="card">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Especie</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {#if searchTerm && filteredBreeds.length === 0}
              <h5>No se encontraron resultados</h5>
            {:else if filteredBreeds.length > 0}
              {#each filteredBreeds as item}
                <tr>
                  <td>{item.petType.name}</td>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-warning btn-sm"
                      on:click={editBreed(item)}><i class="ti-pencil" /></button
                    >
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      on:click={deleteBreed(item.id)}
                      ><i class="ti-trash" /></button
                    >
                  </td>
                </tr>
              {/each}
            {:else}
              {#each breeds as item}
                <tr>
                  <td>{item.petType.name}</td>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-warning btn-sm"
                      on:click={editBreed(item)}><i class="ti-pencil" /></button
                    >
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      on:click={deleteBreed(item.id)}
                      ><i class="ti-trash" /></button
                    >
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{:else}
  <h5 class="text-info">No se encontraron registros de razas</h5>
{/if}

<style>
  /* @import "../dist/css/style.css"; */
</style>
