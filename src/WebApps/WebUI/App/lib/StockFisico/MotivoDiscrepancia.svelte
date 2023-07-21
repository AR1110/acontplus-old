<script lang="ts">
    import type { MotivoDiscrepancia } from "../../core/models/stock.model";
    import { onMount } from "svelte";
    import { client } from "../../core/api/axiosClient";
    import toast from "../../core/utils/toast";
    import Swal from "sweetalert2";
    let url = "Inventario/MotivoDiscrepancias";
    let data: MotivoDiscrepancia = {
        id: 0,
        codigo: "",
        descripcion: "",
    };

    let motivos: MotivoDiscrepancia[] = [];

    onMount(() => {
        onload();
    });

    const onload = async () => {
        await client
            .get(url)
            .then((response: any) => {
                motivos = response;
                console.log(motivos);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    let editStatus = false,
        showForm = false;

    const openNew = (open) => {
        showForm = open;
        if (!open && editStatus) {
            editStatus = false;
            cleanMotivo();
        }
    };
    const cleanMotivo = () => {};

    const add = async () => {
        if (!data.codigo) {
            toast({ type: "warning", message: "Ingrese el código" });
            return;
        }
        if (!data.descripcion) {
            toast({ type: "warning", message: "Ingrese la descripción" });
            return;
        }
        await client
            .post(url, data)
            .then((response: any) => {
                toast({
                    type: "success",
                    message: "Registrada exitosamente",
                });
                openNew(false);
                onload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const save = async () => {
        if (editStatus) {
            update();
        } else {
            add();
        }
    };
    const edit = (e) => {
        editStatus = true;
        data = e;
    };
    const update = () => {};
</script>

<div class="row page-titles">
    <div class="col-md-5 align-self-center">
        <h5 class="text-themecolor">Motivos de Discrepancia</h5>
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
{#if showForm || editStatus}
    <div class="card">
        <div class="card-body">
            <h5 class="title">Registrar Motivo</h5>
            <form on:submit|preventDefault={save}>
                <div class="row">
                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                        <div class="form-group">
                            <label for="">Código</label>
                            <input
                                type="text"
                                class="form-control"
                                maxlength="5"
                                min="1"
                                bind:value={data.codigo}
                            />
                        </div>
                        <div class="form-group">
                            <label for="">Descripción</label>
                            <input
                                type="text"
                                class="form-control"
                                maxlength="100"
                                bind:value={data.descripcion}
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-outline-success"
                    ><i class="ti-save" /> Guardar</button
                >
            </form>
        </div>
    </div>
{/if}
{#if motivos.length > 0}
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Op</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each motivos as item}
                            <tr>
                                <td>{item.codigo}</td>
                                <td>{item.descripcion}</td>
                                <td>
                                    <button
                                        class="btn btn-outline-warning"
                                        on:click={() => edit(item)}
                                        ><i class="ti-pencil" /></button
                                    >
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
{/if}
