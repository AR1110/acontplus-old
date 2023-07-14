<svelte:options tag="pet-breed" />

<script>
    import { onMount } from "svelte";
    import { showLoader, hideLoader } from "../../core/utils/loading-spinner";
    import { client } from "../../core/api/axiosClient";
    import toast from "../../core/utils/toast";
    import Swal from "sweetalert2";

    let petTypes = [],
        breeds = [];
    onMount(async () => {
        showLoader();
        await client
            .get("/gateway/PetTypes/")
            .then((response) => {
                petTypes = response;
                console.log("petTypes =>", petTypes);
            })
            .catch((error) => {
                hideLoader();
                console.log(error);
            });
        await client
            .get("/gateway/Breeds/")
            .then((response) => {
                breeds = response;
                breeds.forEach((element, index) => {
                    if (element.description === null) {
                        element.description = "N/A";
                    }
                });
                console.log("breeds => ", breeds);
            })
            .catch((error) => {
                console.log(error);
                hideLoader();
            });
        hideLoader();
    });

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
            .post("/gateway/Breeds/", newBreed)
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

    const updateBreed = () => {};
</script>

<div class="row page-titles">
    <div class="col-md-5 align-self-center">
        <h5 class="text-themecolor">Registro de Razas</h5>
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
                                <option selected disabled
                                    >Seleccione la especie</option
                                >
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
                                        ><i class="ti-pencil" /></button
                                    >
                                    <button
                                        type="button"
                                        class="btn btn-outline-danger btn-sm"
                                        ><i class="ti-trash" /></button
                                    >
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
{:else}
    <h5 class="text-info">No se encontraron registros de razas</h5>
{/if}

<style>
    @import "../dist/css/style.css";
</style>
