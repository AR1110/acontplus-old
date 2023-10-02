<script lang="ts">
    import { onMount } from "svelte";
    import MaskInput from "svelte-input-mask/MaskInput.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import type {
        StockFisico,
        StockFisicoDetalle,
    } from "$lib/interfaces/stock-fisico";
    import { Estabs } from "$services/establecimiento-service";
    import { StockFisicoService } from "$services/stok-fisico-service";
    import { ArticleService } from "$services/inventory/article-service";
    import AdvancedSearch from "$lib/components/AdvancedSearch.svelte";
    import Grid from "$lib/components/Grid.svelte";
    import type { MotivoDiscrepancia } from "$lib/interfaces/motivo-discrepancia";
    import { Discrepancias } from "$services/motivos-discrepancia-service";
    import toast from "$lib/utils/toast";

    export let showModal = false;
    export let onModalClose;
    let iconTitle = "ti-check";
    let title = "Nueva Toma Fisica";
    let codEstab;
    let bodegaId = 0;
    let data = {} as StockFisico;
    type mainForm = {
        tipo: number;
        opcion: number;
        articuloId: number;
        idSubFamilia: number;
        nroDocumento: string;
    };
    let options: mainForm = {
        tipo: 0,
        opcion: 1,
        articuloId: 0,
        idSubFamilia: 0,
        nroDocumento: "",
    };
    let allArrays = [];
    let establecimientos = [],
        puntosEmision = [],
        bodegas = [],
        subfamilias = [];

    let motivosDiscrepancia = [] as MotivoDiscrepancia[];

    const initialLoad = () => {
        StockFisicoService.get(JSON.stringify({ tipo: 1 })).then(
            (response: any) => {
                if (response) {
                    allArrays = response;
                    console.log(allArrays);
                    puntosEmision = allArrays["puntosEmision"].filter(
                        (x) => x.codEstab === codEstab
                    );
                    setDefaultPtoEmi();
                    bodegas = allArrays["bodegas"].filter(
                        (x) => x.codEstab === codEstab
                    );
                    setDefaultBodega();
                    subfamilias = allArrays["subfamilias"];
                    data.serieDocumento =
                        allArrays["configDocumento"][0].estab +
                        "-" +
                        allArrays["configDocumento"][0].ptoEmi +
                        "-" +
                        String(
                            allArrays["configDocumento"][0].ultimaSecuencia
                        ).padStart(9, "0");
                    data.secuencial = Number(
                        allArrays["configDocumento"][0].ultimaSecuencia
                    );
                }
            }
        );
        Discrepancias.get(null).then((response) => {
            motivosDiscrepancia = response;
            console.log(motivosDiscrepancia);
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
        if (articlesFounded.length == 0) {
            toast({ type: "warning", message: "Debe agregar un detalle" });
            return;
        }
        // articlesFounded.forEach(element => {
        //     if (element.motivoDiscrepanciaId == 0) {
        //         toast({type: 'warning', message: "Debe seleccionar un motivo de discrepancia en todos los registros"})
        //         return
        //     }
        // });
        if (articlesFounded.some((x) => x.motivoDiscrepanciaId == 0)) {
            toast({
                type: "warning",
                message:
                    "Debe seleccionar un motivo de discrepancia en todos los registros",
            });
            return;
        }
        //modalClose("saving");
        let newData = {
            header: data,
            stockFisicoDetalles: articlesFounded,
        };
        console.log(newData);
        StockFisicoService.post({ data: newData }).then((response) => {
            if (response.code == "0") {
                toast({ type: "warning", message: response.message });
            }
            if (response.code == "1") {
                toast({ type: "success", message: response.message });
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
            console.log(response.code);
        });
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
            bodegaId = bodegas.find((x) => x.defaultBodega === true).idBodega;
            articlesFounded.forEach((value) => {
                value.bodegaId = bodegaId;
            });
        }
    };

    const onChangeEstablecimiento = () => {
        puntosEmision = allArrays["puntosEmision"].filter(
            (x) => x.codEstab === data.codEstab
        );
        setDefaultPtoEmi();
        bodegas = allArrays["bodegas"].filter(
            (x) => x.codEstab === data.codEstab
        );
        setDefaultBodega();
    };
    const askToChangeBodega = () => {
        articlesFounded.forEach((value) => {
            value.bodegaId = bodegaId;
        });
    };
    //const advancedSearch = () => {};

    let article = "";
    let articleSelected = {};
    let articles = [];
    const onInput = async (e) => {
        article = e.target.value;
        if (article.length >= 3) {
            let data = {
                busqueda: article,
            };
            ArticleService.search(JSON.stringify(data)).then((response) => {
                if (response.code == "1") {
                    articles = JSON.parse(response.payload);
                }
            });
        } else if (articles.length > 0) {
            articles = [];
        }
    };
    const onFocus = () => {};
    const onBlur = (e) => {
        if (!article) {
            articles = [];
            article = "";
        }
    };
    let isArticleSelected = false;
    const selectArticle = (e) => {
        isArticleSelected = true;
        articleSelected = e;
        options.articuloId = e.idArticulo;
        getArticles();
    };
    let articlesFounded = [] as StockFisicoDetalle[];
    const getArticles = () => {
        articlesFounded = [];
        options.tipo = 4;
        StockFisicoService.get(JSON.stringify(options)).then((response) => {
            if (response) {
                articlesFounded = response["articulos"];
                articlesFounded.forEach((value) => {
                    value.stockFisicoId = 0;
                    value.bodegaId = bodegaId;
                    value.cantidadContada = 0;
                    value.discrepancia = 0;
                    value.motivoDiscrepanciaId = 0;
                    value.motivoDiscrepancia = "";
                    value.otroMotivo = "";
                });
            }
        });
    };

    let updateDiscrepancia = (cell) => {
        let data = cell.getData();
        let sum = Number(data.stockActual) - Number(data.cantidadContada);
        let row = cell.getRow();
        row.update({
            discrepancia: sum,
        });
    };
    //https://jsfiddle.net/biruktes/hn8gascw/24/
    let customNativeSelect = function (cell, onRendered, success, cancel) {
        var cellRealValue = cell.getElement().dataset.motivoDiscrepancia;
        cellRealValue =
            typeof cellRealValue === "undefined" ? "none" : cellRealValue;

        //Create and append select list
        var selectList = document.createElement("select");

        selectList.style.width = "100%";
        selectList.style.boxSizing = "border-box";

        onRendered(function () {
            selectList.focus();
            selectList.style.height = "100%";
        });

        function onChange() {
            if (selectList.selectedOptions[0].value != cellRealValue) {
                success(selectList.selectedOptions[0].value);
                // Store value to cell dataset
                cell.getElement().dataset.motivoDiscrepancia =
                    selectList.selectedOptions[0].value;
                cell.getElement().dataset.motivoDiscrepanciaId =
                    selectList.selectedOptions[0].text;
                // alert(
                //     "Here is what the actual looks like: " +
                //         JSON.stringify(cell.getTable().getData())
                // );
            } else {
                // No change
                cancel();
            }
        }

        //submit new value on blur or change
        selectList.addEventListener("blur", onChange);

        //submit new value on enter
        selectList.addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                onChange();
            }

            if (e.keyCode == 27) {
                cancel();
            }
        });

        //Create and append the options
        for (var i = 0; i < motivosDiscrepancia.length; i++) {
            var option = document.createElement("option");
            option.value = motivosDiscrepancia[i].id.toString();
            option.text = motivosDiscrepancia[i].descripcion;

            if (motivosDiscrepancia[i].id === cellRealValue) {
                //option.selected = "selected";
                option.selected = true;
            }
            selectList.appendChild(option);
        }

        return selectList;
    };
    let columns = [
        {
            title: "Código",
            field: "codigo",
            widthGrow: 2,
        },
        {
            title: "Descripcion",
            field: "descripcion",
            widthGrow: 2,
        },
        {
            title: "Cant. Contada",
            field: "cantidadContada",
            widthGrow: 2,
            editor: "input",
            cellEdited: updateDiscrepancia,
            headerSort: false,
            editorParams: {
                selectContents: true,
            },
        },
        {
            title: "Stock Actual",
            field: "stockActual",
            widthGrow: 2,
            headerSort: false,
        },
        {
            title: "Discrepancia",
            field: "discrepancia",
            widthGrow: 2,
            // mutator: (value, data, type, params, component) => {
            //     return Number(data.stock) - Number(data.cantidadContada);
            // },
        },
        {
            title: "Motivo",
            field: "motivoDiscrepanciaId",
            //editor: "list",
            editor: customNativeSelect,
            //editorParams: { values: motivosDiscrepancia },
        },
    ];

    const handleNroDocChange = (e) => {
        options.nroDocumento = e.detail.inputState.maskedValue;
    };
</script>

{#if showModal}
    <Modal open={showModal} onClosed={() => onPopupClose()} {iconTitle} {title}>
        <form autocomplete="off" on:submit|preventDefault={onSave}>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                        <div class="form-group">
                            <label for="establecimiento">Estab.:</label>
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

                    <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12">
                        <div class="form-group">
                            <label for="puntoEmision">Punto Emisión:</label>
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
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                        <div class="form-group">
                            <label for="bodegas">Bodega</label>
                            <select
                                name="bodegas"
                                id="bodegas"
                                class="form-control border-select"
                                bind:value={bodegaId}
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
                    <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-6">
                        <div class="form-group">
                            <label for="fechaEmision">Fecha Emisión</label>
                            <input
                                type="date"
                                name="fechaEmision"
                                bind:value={data.fecha}
                                class="form-control border-select"
                                required
                            />
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-6">
                        <div class="form-group">
                            <label for="secuencial">Secuencial</label>
                            <input
                                type="text"
                                name="secuencial"
                                readonly
                                disabled
                                bind:value={data.serieDocumento}
                                class="form-control border-select"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-12">
                        <div class="form-group">
                            <label for="">Responsable</label>
                            <input
                                type="text"
                                class="form-control"
                                bind:value={data.responsable}
                                required
                            />
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
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
                    {#if options.opcion == 1}
                        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div class="form-group">
                                <label for="">Articulo</label>
                                <AdvancedSearch
                                    on:input={onInput}
                                    on:focus={onFocus}
                                    on:blur={onBlur}
                                    value={article}
                                    placeholder={"Buscar articulo"}
                                />
                                {#if articles.length > 0 && !isArticleSelected}
                                    <div class="floating-results list-group">
                                        {#each articles as item}
                                            <a
                                                href={null}
                                                class="list-group-item"
                                                on:click={() =>
                                                    selectArticle(item)}
                                                ><i class="fa-solid fa-check" />
                                                {item.codigo}
                                                - {item.descripcion}</a
                                            >
                                        {/each}
                                    </div>{/if}
                            </div>
                        </div>
                    {/if}

                    <!-- <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <button
                            type="button"
                            class="btn btn-outline-info btn-lg"
                            on:click={advancedSearch}
                            ><i class="ti-search" /> Busqueda Avanzada</button
                        >
                    </div> -->

                    {#if options.opcion == 3}
                        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div class="form-group">
                                <label for="idSubFamilia">Subfamilias:</label>
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
                        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <!-- @await Html.PartialAsync("~/Views/Proveedor/_ProveedorAutocompleteFiltro.cshtml") -->
                        </div>
                    {/if}
                    {#if options.opcion == 5}
                        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div class="form-group">
                                <label for="nroDocumento"
                                    >N° de Documento:</label
                                >
                                <!-- <input
                                    type="text"
                                    class="form-control"
                                    id="nroDocumento"
                                    name="nroDocumento"
                                    placeholder="000-000-000000000"
                                    on:blur={getArticles}
                                    bind:value={options.nroDocumento}
                                    required
                                /> -->
                                <MaskInput
                                    class="form-control"
                                    alwaysShowMask
                                    maskChar="_"
                                    mask="000-000-000000000"
                                    on:blur={getArticles}
                                    on:change={handleNroDocChange}
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
                {#if articlesFounded.length > 0}
                    <Grid dataArray={articlesFounded} {columns} />
                {/if}
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

    <!-- <div class="card">
        <div class="card-body">
          
        </div>
    </div> -->
{/if}
