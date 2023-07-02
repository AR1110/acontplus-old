<svelte:options tag="pet-medical-history-app" />

<script>
    import { onMount } from "svelte";
    import { client } from "../../core/api/axiosClient";

    import Add from "./components/Add.svelte";
    let newRecord = false;
    function openNew(open) {
        newRecord = open;
    }
    let medicalHistories = [];
    onMount(async () => {
        await client.get("/gateway/MedicalHistories/").then((response) => {
            medicalHistories = response;
            //console.log("behaviorsStatuses => ", behaviorsStatuses);
        });
    });
    const getReport = async (id) => {
        await client
            .post(`/gateway/MedicalHistories/Report/` + id)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const deleteHistory = async (id) => {
        // let { isConfirmed } = await Swal.fire({
        // 	text: "Esta seguro de eliminar esta mascota",
        // 	icon: "warning",
        // 	showCancelButton: true,
        // 	confirmButtonColor: "#3085d6",
        // 	cancelButtonColor: "#d33",
        // 	confirmButtonText: "Si, proceder!",
        // 	cancelButtonText: "No, cancelar",
        // });
        // if (isConfirmed) {
        // 	await client
        // 		.delete("/gateway/Pets/" + id)
        // 		.then((response) => {
        // 			console.log(response);
        // 			toast({
        // 				type: "success",
        // 				message: "Eliminada exitosamente",
        // 			});
        // 			pets = pets.filter((pet) => pet.id !== id);
        // 		})
        // 		.catch((error) => {
        // 			console.log(error);
        // 		});
        // }
    };

    const editHistory = (historyEdited) => {
        // editStatus = true;
        // pet = petEdited;
    };
</script>

<div class="row page-titles">
    <div class="col-md-5 align-self-center">
        <h5 class="text-themecolor">Registro Informado de Estetica Canina</h5>
    </div>
    <div class="col-md-7 align-self-center text-right">
        <div class="d-flex justify-content-end align-items-center">
            <button
                type="button"
                on:click={() => openNew(true)}
                class="btn btn-info d-block d-lg-inline-block m-l-15"
            >
                <i class="fa fa-plus-circle" /> Nuevo
            </button>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <Add />
        <hr />
        <div class="table-responsive">
            <table class="table">
                <caption>Registros</caption>
                <thead>
                    <tr>
                        <th>Mascota</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {#each medicalHistories as item}
                        <tr>
                            <td>{item.pet.name}</td>
                            <td>{item.date}</td>
                            <td>
                                <button
                                    class="btn btn-outline-danger btn-sm"
                                    on:click={deleteHistory(item.id)}
                                >
                                    <i class="ti-trash" />
                                </button>
                                <button
                                    class="btn btn-outline-warning btn-sm"
                                    on:click={editHistory(item)}
                                >
                                    <i class="ti-pencil" />
                                </button>
                                <button
                                    class="btn btn-outline-danger btn-sm"
                                    on:click={getReport(item.id)}
                                    title="Obtener Reporte"
                                >
                                    <i class="fa fa-file-pdf" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    @import "../dist/css/style.css";
    .floating-results {
        position: absolute;
        z-index: 1000;
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
        background-color: #fff;
        border: 1px solid #ced4da;
        border-top: none;
        border-radius: 0 0 0.25rem 0.25rem;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
    }

    .floating-results .list-group-item {
        cursor: pointer;
    }

    .floating-results .list-group-item:hover {
        background-color: #f8f9fa;
    }
</style>
