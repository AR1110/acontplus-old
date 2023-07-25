<script lang="ts">
    import { onMount } from "svelte";
    import Modal from "../../../core/components/Modal.svelte";
    import type { StockFisico } from "../../../core/interfaces/stock-fisico";
    import { Estabs } from "../../../core/services/establecimiento-service";
    import { Stock } from "../../../core/services/stok-fisico-service";

    export let showModal = false;
    export let onModalClose;
    let iconTitle = "ti-check";
    let title = "Nueva Toma Fisica";
    let codEstab;
    let idBodega = 0;
    let data = {} as StockFisico;
    type mainForm = {
        opcion: number;
        idSubFamilia: number;
        nroDocumento: string;
    };
    let options: mainForm = {
        opcion: 0,
        idSubFamilia: 0,
        nroDocumento: "",
    };
    let allArrays = [];
    let establecimientos = [],
        puntosEmision = [],
        bodegas = [],
        subfamilias = [];

    const initialLoad = () => {
        Stock.get(JSON.stringify({ tipo: 1 })).then((response: any) => {
            if (response) {
                allArrays = response;
                console.log(allArrays);
                puntosEmision = allArrays[0].filter(
                    (x) => x.codEstab === codEstab
                );
                setDefaultPtoEmi();
                bodegas = allArrays[1].filter((x) => x.codEstab === codEstab);
                setDefaultBodega();
            }
        });
    };
    let catalogs = [
        { code: 1, description: "Articulo" },
        { code: 3, description: "Subfamilias" },
        { code: 4, description: "Proveedor" },
        { code: 5, description: "N° Documento" },
    ];
    const getEstabs = () => {
        Estabs.get(JSON.stringify({ tipo: 1 })).then((response: any) => {
            if (response) {
                establecimientos = response;
                codEstab = establecimientos.find(
                    (x) => x.predeterminado === true
                ).codEstab;
                if (codEstab) {
                    initialLoad();
                }
            }
        });
    };

    onMount(() => {
        getEstabs();
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

    const setDefaultPtoEmi = () => {
        if (puntosEmision.length > 0) {
            data.puntoEmisionId = puntosEmision.find(
                (x) => x.defaultPtoEmi == true
            ).idPuntoEmision;
        }
    };

    const setDefaultBodega = () => {
        if (bodegas.length > 0) {
            idBodega = bodegas.find((x) => x.defaultBodega === true).idBodega;
        }
    };

    const onChangeEstablecimiento = () => {
        puntosEmision = allArrays[0].filter(
            (x) => x.codEstab === data.codEstab
        );
        setDefaultPtoEmi();
        bodegas = allArrays[1].filter((x) => x.codEstab === data.codEstab);
        setDefaultBodega();
    };
    const askToChangeBodega = () => {};
    const advancedSearch = () => {};

    const getArticles = () => {};
</script>

{#if showModal}
    <!-- <Modal open={showModal} onClosed={() => onPopupClose()} {iconTitle} {title}>
       
    </Modal> -->

    <div class="card">
        <div class="card-body">
            <form autocomplete="off" on:submit|preventDefault={onSave}>
                <div class="modal-body">
                    <div class="row">
                        <div
                            class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                        >
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

                        <div
                            class="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-12"
                        >
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

                        <div
                            class="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-12"
                        >
                            <div class="form-group">
                                <label for="fechaEmision"
                                    >Fecha Emisión <span class="text-danger"
                                        >*</span
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

                        <div
                            class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                        >
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
                        <!-- <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                            <button
                                type="button"
                                class="btn btn-outline-info btn-lg"
                                on:click={advancedSearch}
                                ><i class="ti-search" /> Busqueda Avanzada</button
                            >
                        </div> -->
                        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12">
                            <div class="form-group">
                                <label for="opcion">Opciones:</label>
                                <select
                                    name="opcion"
                                    id="opcion"
                                    class="form-control"
                                    bind:value={options.opcion}
                                >
                                    {#each catalogs as item}
                                        <option value={item.code}>
                                            {item.description}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        {#if options.opcion == 3}
                            <div
                                class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12"
                            >
                                <div class="form-group">
                                    <label for="idSubFamilia"
                                        >Subfamilias:</label
                                    >
                                    <select
                                        name="idSubFamilia"
                                        id="idSubFamilia"
                                        class="form-control"
                                        bind:value={options.idSubFamilia}
                                        on:change={getArticles}
                                    >
                                        {#each subfamilias as item}
                                            <option value={item.idSubFamilia}>
                                                {item.descripcion}
                                            </option>
                                        {/each}
                                    </select>
                                </div>
                            </div>
                        {/if}
                        {#if options.opcion == 4}
                            <div
                                class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12"
                            >
                                <!-- @await Html.PartialAsync("~/Views/Proveedor/_ProveedorAutocompleteFiltro.cshtml") -->
                            </div>
                        {/if}
                        {#if options.opcion == 5}
                            <div
                                class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12"
                            >
                                <div class="form-group">
                                    <label for="nroDocumento"
                                        >N° de Documento:</label
                                    >
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="nroDocumento"
                                        name="nroDocumento"
                                        placeholder="000-000-000000000"
                                        on:blur={getArticles}
                                        bind:value={options.nroDocumento}
                                        required
                                    />
                                </div>
                            </div>
                        {/if}
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
                        <div
                            class="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-8"
                        >
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
        </div>
    </div>
{/if}
