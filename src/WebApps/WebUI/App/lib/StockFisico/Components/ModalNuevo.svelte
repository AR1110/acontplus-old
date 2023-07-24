<script lang="ts">
    import { onMount } from "svelte";
    import Modal from "../../../core/components/Modal.svelte";
    import type { StockFisico } from "../../../core/interfaces/stock-fisico";
    import type { StructureResponse } from "App/core/interfaces/structure-response";
    import { Estabs } from "../../../core/services/establecimiento-service";
    export let showModal = false;
    export let onModalClose;
    let iconTitle = "ti-check";
    let title = "Nueva Toma Fisica";
    let codEstab = 0;
    let idBodega = 0;
    let data = {} as StockFisico;
    let establecimientos = [],
        puntosEmision = [],
        bodegas = [];

    onMount(() => {
        Estabs.get(JSON.stringify({ tipo: 1 }))
            .then((response: StructureResponse) => {
                console.log(response.payload);
                establecimientos = JSON.parse(response.payload);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    const onSave = () => {
        //modalClose("saving");
    };
    const onPopupClose = () => {
        showModal = false;
        onModalClose("closing");
    };
    const modalClose = () => {
        showModal = false;
        if (onModalClose) {
            onModalClose("closing");
        }
    };
    const onChangeEstablecimiento = () => {};
    const askToChangeBodega = () => {};
    const advancedSearch = () => {};
</script>

{#if showModal}
    <Modal open={showModal} onClosed={() => onPopupClose()} {iconTitle} {title}>
        <form autocomplete="off" on:submit|preventDefault={onSave}>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div class="form-group">
                            <label for="establecimiento"
                                >Estab.: <span class="text-danger">*</span
                                ></label
                            >
                            <select
                                name="establecimiento"
                                id="establecimiento"
                                class="form-control border-select"
                                bind:value={data.codEstab}
                                on:change={onChangeEstablecimiento}
                            >
                                {#each establecimientos as item}
                                    <option value={item.codEstab}>
                                        {item.nombreComercial}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-12">
                        <div class="form-group">
                            <label for="puntoEmision"
                                >Punto Emisión: <span class="text-danger"
                                    >*</span
                                ></label
                            >
                            <select
                                id="puntoEmision"
                                name="puntoEmision"
                                class="form-control border-select"
                                bind:value={data.puntoEmisionId}
                            >
                                {#each puntosEmision as item}
                                    <option value={item.idPuntoEmision}>
                                        {item.ptoEmi}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-12">
                        <div class="form-group">
                            <label for="fechaEmision"
                                >Fecha Emisión <span class="text-danger">*</span
                                ></label
                            >
                            <input
                                type="date"
                                name="fechaEmision"
                                bind:value={data.fecha}
                                class="form-control border-select"
                            />
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div class="form-group">
                            <label for="bodegas">Bodega</label>
                            <select
                                name="bodegas"
                                id="bodegas"
                                class="form-control border-select"
                                bind:value={idBodega}
                                on:change={askToChangeBodega}
                            >
                                {#each bodegas as item}
                                    <option value={item.idBodega}
                                        >{item.bodega}</option
                                    >
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <!-- <md-autocomplete-articulo-component tipo-doc="TIPO_DOC"
                                                                    placeholder="'Buscar Articulo'"
                                                                    abrir-modal-articulo="abrirModalArticulo(item)"
                                                                    get-data-articulo="getDataIdArticulo(item)"
                                                                    set-item-articulo-en-detalle="setItemArticuloEnDetalle(item)"
                                                                    scope-parent="$scope">
                                </md-autocomplete-articulo-component> -->
                    </div>
                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <button
                            type="button"
                            class="btn btn-outline-info btn-lg"
                            on:click={advancedSearch}
                            ><i class="ti-search" /> Busqueda Avanzada</button
                        >
                    </div>
                </div>
                <!-- <div id="grid" ui-grid="gridOptions"
                             ui-grid-edit
                             ui-grid-resize-columns
                             ui-grid-cellNav
                             ui-grid-auto-resize
                             class="grid">
                        </div> -->
                <br />
                <!--Sub Totales -->
                <div class="row">
                    <div class="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-8">
                        <div class="form-group">
                            <textarea
                                class="form-control"
                                placeholder="Observación"
                                bind:value={data.obs}
                                required
                            />
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-8">
                        <div class="text-right">
                            <!-- <h4><strong>Total: ${data.total}</strong></h4> -->
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
                    on:click={() => modalClose()}>&times; Cerrar</button
                >
            </div>
        </form>
    </Modal>
{/if}
