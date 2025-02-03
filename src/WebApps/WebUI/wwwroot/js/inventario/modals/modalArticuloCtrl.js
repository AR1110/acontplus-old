//@ts-check
export {
    modalArticuloCtrl,
    modalArticuloFraccionadoCtrl,
    ModalArticuloGeneralCtrl,
    modalHistorialCompraCtrl,
    modalProductPhotoCtrl
};

modalArticuloCtrl.$inject = [
    "$scope",
    "$uibModalInstance",
    "$injector",
    "$timeout",
    "params",
];

function modalArticuloCtrl(
    $scope,
    $uibModalInstance,
    $injector,
    $timeout,
    params
) {
    let articuloSvc = $injector.get("articuloService");
    let articuloCodigoBarraSvc = $injector.get("articuloCodigoBarraService");
    let articuloUbicacionSvc = $injector.get('articuloUbicacionService');
    let tS = $injector.get("toastService");
    let fS = $injector.get("formulario");
    let pricingUtils = $injector.get("pricingUtils");
    let productPhotoService = $injector.get("productPhotoService");

    const CODIGO_IVA = "4";

    $scope.data = {
        idTipoArticulo: 0,
        idMedida: 0,
        precioCosto: 0,
        precioSinSubsidio: 0,
        stockMinimo: 0,
        stockMaximo: 0,
        cantMinimaVentaPorMayor: 0,
        idBodega: 0,
    };

    $scope.establecimientos = [];
    $scope.bodegas = [];
    $scope.subFamilias = [];
    $scope.tipoArticulos = [];
    $scope.medidas = [];
    $scope.etiquetaActividades = [];
    $scope.tarifas = [];
    $scope.tarifas = [];

    $scope.marcas = [];
    $scope.modelos = [];

    $scope.decimal = {};

    $scope.tipoIces = [];
    $scope.tipoIvas = [];

    $scope.tipoRegistro = 1;
    $scope.step = 1; //Por Defecto Tab General

    $scope.opcionCalculate = null;
    $scope.dataTarifaOption = {
        opcionCalculate: null
    }
    //imagen articulo
    $scope.selectedFile = null;
    $scope.image = {
        selectedFile: null
    }

    //Data Codigo Barra
    $scope.dataCodigoBarra = {
        color: "#ffffff",
        descripcion: null
    };

    //Data Ubicación
    $scope.dataUbicacion = {
        idEstablecimiento: "",
        idBodega: "",
        ubicacion: "",
    };

    $scope.showEstado = false;

    function checkPrecioCosto() {
        return !([null, undefined, "", 0].includes($scope.data.precioCosto));
    }


    $scope.gridOptions = {
        enableColumnMenus: false,
        enableColumnReordering: true,
        showGridFooter: false,
        enableSorting: false,
        enableFiltering: false,
        enableRowHashing: false,
        enableCellEdit: false,
        cellEditableCondition: () => {
            return checkPrecioCosto();
        },
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        if ($scope.gridApi) {
            $timeout(() => {
                $scope.gridApi.core.handleWindowResize();
                $scope.gridApi.grid.refresh();
            }, 5);
        }

        gridApi.edit.on.afterCellEdit(
            $scope,
            (rowEntity, colDef, newValue, oldValue) => {
                const index = $scope.gridOptions.data.indexOf(rowEntity); //Obtenemos indice

                let precioConIva = 0;
                let precioVenta = 0;
                let porcentajeUtilidad = 0;
                let ganancia = 0;

                //Validacion de Campos
                if (
                    [null, undefined, "", 0].includes($scope.data.precioCosto) ||
                    isNaN($scope.data.precioCosto)
                ) {
                    tS.toastr("warning", "Ingrese el Precio de Costo");
                    return;
                }

                if (colDef.field === "precioVenta") {
                    if ([null, undefined].includes(newValue)) {
                        rowEntity.precioVenta = oldValue;
                    }
                    if (rowEntity.precioVenta > 0) {
                        if (rowEntity.precioVenta < $scope.data.precioCosto) {
                            rowEntity[colDef.field] = oldValue;
                        }
                    }
                }

                if (colDef.field === "precioConIva") {
                    if ([null, undefined].includes(newValue)) {
                        rowEntity.precioConIva = oldValue;
                    }

                    if (rowEntity.precioConIva > 0) {
                        if (rowEntity.precioConIva < $scope.data.precioCosto) {
                            rowEntity.precioConIva = oldValue;
                        }
                    }
                }

                if (
                    (colDef.field === "porcentajeUtilidad" && newValue === undefined) ||
                    newValue === null
                ) {
                    rowEntity.porcentajeUtilidad = oldValue;
                }

                //Calculos
                switch (colDef.field) {
                    case "precioVenta":
                        precioConIva = pricingUtils.calcularPrecioConIva(
                            rowEntity.precioVenta,
                            rowEntity.porcentajeIva
                        );
                        porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(
                            $scope.data.precioCosto,
                            rowEntity.precioVenta
                        );

                        $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                            rowEntity.precioVenta,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                            precioConIva,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(
                            porcentajeUtilidad,
                            pricingUtils.precisionMaxima
                        );

                        break;

                    case "precioConIva":
                        precioVenta = pricingUtils.calcularPrecioVenta(
                            rowEntity.precioConIva,
                            rowEntity.porcentajeIva
                        );
                        porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(
                            $scope.data.precioCosto,
                            precioVenta
                        );

                        $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                            rowEntity.precioConIva,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                            precioVenta,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(
                            porcentajeUtilidad,
                            pricingUtils.precisionMaxima
                        );

                        break;
                    case "porcentajeUtilidad":
                        precioVenta = pricingUtils.calcularPorcentajeUtilidad(
                            $scope.data.precioCosto,
                            rowEntity.porcentajeUtilidad
                        );
                        precioConIva = pricingUtils.calcularPrecioConIva(
                            precioVenta,
                            rowEntity.porcentajeIva
                        );

                        $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                            precioVenta,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                            precioConIva,
                            $scope.decimal.nroPrecio
                        );
                        break;
                }

                //alexis ramirez
                ganancia = rowEntity.precioVenta - $scope.data.precioCosto;
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, pricingUtils.precisionMaxima);
            }
        );
    };

    $scope.gridOptions.columnDefs = [
        {
            name: "idTarifa",
            field: "idTarifa",
            visible: false,
        },
        {
            name: "tarifa",
            field: "tarifa",
            enableCellEdit: false,
            width: "15%",
            minWidth: 100,
        },
        {
            name: "Tipo Iva",
            field: "porcentajeIva",
            type: "number",
            enableCellEdit: false,
            width: "5%",
            minWidth: 100,
        },
        {
            name: "precioVenta",
            field: "precioVenta",
            enableCellEditOnFocus: true,
            enableCellEdit: true,
            allowCellFocus: true,
            type: "number",
            width: "15%",
            minWidth: 100,
        },
        {
            name: "precioConIva",
            field: "precioConIva",
            enableCellEditOnFocus: true,
            enableCellEdit: true,
            allowCellFocus: true,
            type: "number",
            width: "15%",
            minWidth: 100,
        },
        {
            name: "porcentajeUtilidad",
            field: "porcentajeUtilidad",
            type: "number",
            enableCellEditOnFocus: true,
            enableCellEdit: true,
            allowCellFocus: true,
            width: "18%",
            minWidth: 100,
        },

        {
            name: "Utilidad",
            field: "ganancia",
            type: "number",
            enableCellEditOnFocus: true,
            width: "10%",
            minWidth: 100,
        },
        {
            name: "P. precioPredeterminado",
            field: "precioPredeterminado",
            visible: false,
        },
        {
            name: "Estado",
            field: "predeterminadaVal",
            enableCellEdit: false,
            type: "checkbox",
            //cellTemplate: '<div class="text-center"><input type="checkbox"' +
            //    'name="radio" value="radio" ng-click="grid.appScope.updateDefault(row.entity)"/></div>', //'<md-switch style="display:inline;" title="Actualizar estado" aria-label="Predeterminado" ng-click="grid.appScope.updateDefault(row)"></md-switch>',

            width: "15%",
            minWidth: 100,
            cellClass: function (grid, row) {
                if (row.entity.precioPredeterminado) {
                    row.entity.predeterminadaVal = "Predeterminado";
                    return "blue";
                }
            },
        },
    ];

    initiload();
    function initiload() { 
        articuloSvc
            .getDataForForm()
            .then((response) => {
                let {
                    establecimientos,
                    decimal,
                    subFamilias,
                    medidas,
                    modelos,
                    marcas,
                    tiposArticulo,
                    tarifasImpuesto,
                    tiposICE,
                    tarifas,
                    etiquetas,
                    permission,
                } = response;

                $scope.establecimientos = establecimientos;
                if ($scope.establecimientos.length > 0) {
                    let dataEstab = $scope.establecimientos.find(
                        (estab) => estab.defaultEstab === true
                    ); 
                    $scope.bodegas = dataEstab.bodegas;
                    $scope.dataUbicacion.idEstablecimiento = dataEstab.idEstablecimiento;
                    if ($scope.bodegas.length > 0) {
                        let dataBodega = $scope.bodegas.find(
                            (bodega) => bodega.defaultBodega === true
                        );
                        $scope.dataUbicacion.idBodega = dataBodega.idBodega;
                    }
                }

                //SubFamilias
                $scope.subFamilias = subFamilias;

                //  //Tipo Articulo
                $scope.tipoArticulos = tiposArticulo;
                $scope.data.idTipoArticulo =
                    $scope.tipoArticulos.length > 0
                        ? $scope.tipoArticulos[0].idTipoArticulo
                        : 0;

                //  //Medida
                $scope.medidas = medidas;
                $scope.data.idMedida =
                    $scope.medidas.length > 0 ? $scope.medidas[0].idMedida : 0;

                //  //Etiqueta Actividades
                $scope.etiquetaActividades = etiquetas;

                //Aplicacion de Permisos
                $scope.articlePermission = permission;

                $scope.tarifas = tarifas;

                $scope.marcas = marcas;
                $scope.modelos = modelos;

                $scope.decimal = decimal;

                $scope.tipoIces = tiposICE;
                $scope.tipoIvas = tarifasImpuesto;
                let dataIVA = $scope.tipoIvas.find((item) => item.codigo == CODIGO_IVA);
                $scope.data.idTipoIva = dataIVA.idTipoIva;

                setCodigoSecuencialArticulo();
                setGridTarifa();

                //Registro de artículo desde Importación
                if (params && params.isImport) {
                    $scope.data.codigo = params.codigo;
                    $scope.data.codigoAuxiliar = params.codigoAuxiliar;
                    $scope.data.codigoBarra = params.codigo;
                    $scope.data.descripcion = params.descripcion;
                    $scope.data.precioCosto = fS.roundNumber(
                        params.precioCosto,
                        $scope.decimal.nroPrecio
                    );
                    if ($scope.data.codigoAuxiliar) {
                        $scope.data.codigoAuxiliar = params.codigoAuxiliar;
                    } else {
                        $scope.data.codigoAuxiliar = params.codigo;
                    }
                    return;
                }

                //Actualizar artículo
                if (params && params.idArticulo > 0) {
                    $scope.tipoRegistro = 2;
                    getDataArticulo();

                    //Disabled Column
                    for (let item of $scope.gridOptions.columnDefs) {
                        if (
                            ["precioConIva", "porcentajeUtilidad", "ganancia"].includes(
                                item.field
                            )
                        ) {
                            item.visible = $scope.articlePermission.isUpdatePrice;
                        }
                        if (item.field === "precioVenta") {
                            item.enableCellEdit = $scope.articlePermission.isUpdatePrice;
                            item.enableCellEditOnFocus =
                                $scope.articlePermission.isUpdatePrice;
                        }
                    }
                }
            }) 
    }
    $scope.getArticuloCodigo = () => {
        if ($scope.data.idArticulo > 0 || (params.isImport && $scope.data.codigo && $scope.data.codigoAuxiliar && $scope.data.codigoBarra)) {
            Swal.fire({
                //title: "Are you sure?",
                html: "¿Está de acuerdo en reemplazar automáticamente el <b>Código</b>, <b>Código Auxiliar</b> y <b>Código de Barra</b> con los datos generados por el sistema?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si!",
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    if ($scope.subFamilias.length > 0) {
                        let { codigo } = $scope.subFamilias.find(
                            (val) => val.idSubFamilia === $scope.data.idSubFamilia
                        );
                        setCodigo(codigo);
                        $scope.$apply();
                    }
                }
            });
            return
        }
        //if (params && params.isImport && $scope.data.codigo && $scope.data.codigoAuxiliar && $scope.data.codigoBarra) return;

        if ($scope.tipoRegistro === 1 && $scope.subFamilias.length > 0) {
            let { codigo } = $scope.subFamilias.find(
                (val) => val.idSubFamilia === $scope.data.idSubFamilia
            );
            setCodigo(codigo);
        }
    }
    function setCodigoSecuencialArticulo() {
        if ($scope.subFamilias.length === 0 || (params && params.isImport)) return;

        const { codigo, idSubFamilia } = $scope.subFamilias[0];

        $scope.data.idSubFamilia = idSubFamilia;
        setCodigo(codigo);
    }

    function setCodigo(codigo) {
        $scope.data.codigo = codigo;
        $scope.data.codigoAuxiliar = "AUX-" + codigo;
        $scope.data.codigoBarra = codigo;
    }

    function setGridTarifa() {
        let dataIVA = $scope.tipoIvas.find((item) => item.codigo == CODIGO_IVA);
        $scope.gridOptions.data = $scope.tarifas.map((item) => {
            item.tarifa = item.descripcion;
            item.precioVenta = 0;
            item.precioConIva = 0;
            item.porcentajeUtilidad = 0;
            item.porcentajeIva = dataIVA.porcentaje;
            item.predeterminadaVal =
                item.predeterminada === true ? "Predeterminada" : "";
            item.precioPredeterminado = item.predeterminada;
            item.ganancia = 0;
            return item;
        });
    }

    function getDataArticulo() {
        try { 
            articuloSvc
                .findById(params.idArticulo)
                .then((response) => {
                    let { data, articuloTarifas } = response;

                    $scope.data = data;

                    $scope.dataCodigoBarra.descripcion = $scope.data.descripcion;

                    $scope.gridOptions.data = articuloTarifas.map((item) => {
                        let ganancia = item.precioVenta - $scope.data.precioCosto;
                        item.ganancia = fS.roundNumber(ganancia, pricingUtils.precisionMaxima);
                        return item;
                    });


                    $scope.data.fechaCaducidad = $scope.data.caducidad ? new Date($scope.data.fechaCaducidad) : null

                    if ($scope.data.datosLote) {
                        $scope.data.fechaCreacion = new Date($scope.data.fechaCreacion);
                        $scope.data.fechaCaducidadLote = new Date(
                            $scope.data.fechaCaducidadLote
                        );
                    } else {
                        $scope.data.fechaCreacion = null;
                        $scope.data.fechaCaducidadLote = null;
                    }
                    $scope.data.cloneIdSubFamilia = $scope.data.idSubFamilia;


                    $scope.showEstado = $scope.data.estado;

                })
                .catch((error) => {
                    console.log(error);
                }) 
        } catch (error) {
            console.log(error);
        }
    }

    $scope.onTabArticulo = function (step) {
        $scope.step = step;
        if ($scope.step === 3) {
            getCodigoBarraArticulo();
            console.log("articulo codigo barra");
        }

        if ($scope.step === 4 && $scope.data.idArticulo > 0) {
            getUbicacionArticulo();
        }
    };

    $scope.resultModalSubFamilia = async function (result) {
        try {
            if (typeof result !== "object") return;

            const { subFamilias } = await articuloSvc.getDataForForm();
            $scope.subFamilias = subFamilias;
            const { idSubFamilia } = $scope.subFamilias.at(
                $scope.subFamilias.length - 1
            );
            $scope.data.idSubFamilia = idSubFamilia;
            //  setCodigo(codigo);
            $scope.getArticuloCodigo();
        } catch (error) {
            console.log(error);
        }
    };

    $scope.refreshSubFamilia = function () {
        try {
            showLoader();
            articuloSvc.getDataForForm().then(response => {

                $scope.subFamilias = response.subFamilias;
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader())
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }

    $scope.resultModalMarca = async function (result) {
        try {
            if (typeof result !== "object") return;

            let { marcas } = await articuloSvc.getDataForForm();
            $scope.marcas = marcas;
            $scope.data.idMarca = $scope.marcas.at($scope.marcas.length - 1).idMarca;
        } catch (error) {
            console.log(error);
        }
    };

    $scope.resultModalModelo = async function (result) {
        try {
            if (typeof result !== "object") return;
            const { modelos } = await articuloSvc.getDataForForm();
            $scope.modelos = modelos;
            $scope.data.idModelo = $scope.modelos.at(
                $scope.modelos.length - 1
            ).idModelo;
        } catch (error) {
            console.log(error);
        }
    };

    $scope.resultModalMedida = async function (result) {
        try {
            if (typeof result !== "object") return;
            const { medidas } = await articuloSvc.getDataForForm();
            $scope.medidas = medidas;
            $scope.data.idMedida = $scope.medidas.at($scope.medidas.length - 1).idMedida;
        } catch (error) {
            console.log(error);
        }
    }

    $scope.refreshMedida = async function () {
        try {
            showLoader();
            articuloSvc.getDataForForm().then(response => {
                $scope.medidas = response.medidas;
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader())
        } catch (error) {
            console.log(error);
        }
    }
    $scope.getBarcode = function () {
        // console.log(item)
        if (!$scope.data.codigoBarra || !$scope.data.descripcion) {
            tS.toastr(
                "warning",
                "Debe ingresar la descripción y el código de barra del artículo para generar el código de barras"
            );
            return;
        }
        let codigoBarra = $scope.data.codigoBarra;
        let descripcion = $scope.data.descripcion;

        Swal.fire({
            // icon:'info',
            html: `<div class="card">
                  <card class="card-header text-center bg-transparent">
                      Código de Barra
                  </card>
                  <div class="card-body border border-danger" id="cardBusiness">                        
                      <h6 class="text-center">${descripcion}</h6>
                      <img id="barcode" alt="">
                  </div>
                  <div class="card-footer">                     
                      <button type="button" class="btn btn-success btn-block" id="btnBarcodeExport">
                          <i class="ti-download"></i> Descargar
                      </button>
                  </div>
              </div>`,
            showConfirmButton: false,
            showCancelButton: false,
            showDenyButton: false,
        });

        JsBarcode("#barcode", codigoBarra, {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            // height: 75,
            // displayValue: false
        });

        document
            .getElementById("btnBarcodeExport")
            .addEventListener("click", () => {
                let container = document.getElementById("cardBusiness"); /* full page */

                html2canvas(container, {
                    allowTaint: true,
                }).then(function (canvas) {
                    let link = document.createElement("a");
                    document.body.appendChild(link);
                    link.download = codigoBarra + "_barcode.jpg";

                    link.href = canvas.toDataURL();
                    link.target = "_blank";
                    link.click();
                    link.download();
                });
            });
    }

    function getTarifaGanacia(precioVenta, precioCosto) {
        return precioVenta - precioCosto;
    }
    /**
     * @param {any} precioCosto
     */
    function recalculateTarifaRegister() {
        if (
            [null, undefined, ""].includes($scope.data.precioCosto) ||
            isNaN($scope.data.precioCosto)
        ) {
            tS.toastr("warning", "Ingrese un número válido");
            return;
        }
        if ($scope.data.precioCosto === 0) {
            tS.toastr("warning", "El valor mínimo en el precio de costo es 0.01");
            return;
        }

        let dataIVA = $scope.tipoIvas.find(
            (item) => item.idTipoIva === $scope.data.idTipoIva
        );
        try {
            let index = 0;
            for (let val of $scope.gridOptions.data) {
                $scope.gridOptions.data[index].porcentajeIva = dataIVA.porcentaje;

                let precioVenta = pricingUtils.calcularPrecioVenta(
                    val.precioConIva,
                    val.porcentajeIva
                );
                $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                    precioVenta,
                    $scope.decimal.nroPrecio
                );

                let precioConIva = pricingUtils.calcularPrecioConIva(
                    val.precioVenta,
                    val.porcentajeIva
                );
                $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                    precioConIva,
                    $scope.decimal.nroPrecio
                );

                let porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(
                    $scope.data.precioCosto,
                    precioVenta
                );
                $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(
                    porcentajeUtilidad,
                    pricingUtils.precisionMaxima
                );

                let ganancia = getTarifaGanacia(
                    val.precioVenta,
                    $scope.data.precioCosto
                );
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, 5);
                index++;
            }
        } catch (error) {
            toastr.error(error);
        }
    }

    function recalculateTarifaUpdateArticle(opcionCalculate) {
        if (
            [null, undefined, 0].includes($scope.data.precioCosto) ||
            isNaN($scope.data.precioCosto)
        ) {
            tS.toastr("warning", "Ingrese un número válido");
            return;
        }

        if ($scope.data.precioCosto === 0) {
            tS.toastr("warning", "El valor mínimo en el precio de costo es 0.01");
            return;
        }

        try {
            let index = 0;
            for (let val of $scope.gridOptions.data) {
                let precioConIva = 0,
                    porcentajeUtilidad = 0,
                    ganancia = 0;

                let precioVenta = pricingUtils.calcularPorcentajeUtilidad(
                    $scope.data.precioCosto,
                    val.porcentajeUtilidad
                );

                if (opcionCalculate === "optionPorcentaje") {
                    $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                        precioVenta,
                        $scope.decimal.nroPrecio
                    );

                    precioConIva = pricingUtils.calcularPrecioConIva(
                        val.precioVenta,
                        val.porcentajeIva
                    );
                    $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                        precioConIva,
                        $scope.decimal.nroPrecio
                    );
                }

                if (opcionCalculate === "optionPvp") {
                    porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(
                        $scope.data.precioCosto,
                        val.precioVenta
                    );
                    $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(
                        porcentajeUtilidad,
                        pricingUtils.precisionMaxima
                    );
                }

                ganancia = getTarifaGanacia(val.precioVenta, $scope.data.precioCosto);
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, pricingUtils.precisionMaxima);
                index++;
            }
        } catch (error) {
            toastr.error(error);
        }
    }

    //Calcular Tarifa al momento de agregar el articulo
    $scope.recalculateTarifaAdd = function () {
        if ($scope.tipoRegistro === 2 && !$scope.articlePermission.isUpdatePrice) {
            tS.toastr("warning", "No tienes permiso para realizar esta acción");
            return;
        }

        if (
            [null, undefined, "", 0].includes($scope.data.precioCosto) ||
            isNaN($scope.data.precioCosto)
        )
            return;

        $scope.data.precioCosto = fS.roundNumber(
            $scope.data.precioCosto,
            $scope.decimal.nroPrecio
        );

        recalculateTarifaRegister();
    };

    $scope.recalculateTarifaUpdate = function () {
        if (
            [null, undefined, "", 0].includes($scope.data.precioCosto) ||
            isNaN($scope.data.precioCosto)
        )
            return;

        $scope.data.precioCosto = fS.roundNumber(
            $scope.data.precioCosto,
            $scope.decimal.nroPrecio
        );
        recalculateTarifaUpdateArticle($scope.dataTarifaOption.opcionCalculate);
    };

    //Guardar/Actualizar Articulo

    function setResponse(dataRepository) {
        const data = {
            idArticulo: dataRepository.idArticulo,
            idMedida: dataRepository.idMedida,
            codigoPrincipal: dataRepository.codigo,
            codigoAuxiliar: dataRepository.codigoAuxiliar,
            codigoBarra: dataRepository.codigoBarra,
            etiquetas: dataRepository.etiquetas.map((item) => {
                return {
                    ...item,
                    etiquetas: item.etiquetas.split(";"),
                };
            }),
        };
        $uibModalInstance.close(data);
    }

    $scope.save = function () {
        let titulo = $scope.tipoRegistro === 1 ? "Agregar" : "Actualizar";

        if ($scope.tipoRegistro == 1) {
            if (!$scope.data.descripcion) {
                tS.toastr("warning", "Ingrese la Descripción del Articulo", titulo);
                return;
            }

            if (!$scope.data.codigoBarra) {
                tS.toastr("warning", "Ingrese el Código de Barra del Articulo", titulo);
                return;
            }

            if (!($scope.data.idTipoArticulo > 0)) {
                tS.toastr("warning", "Seleccione el Tipo Articulo", titulo);
                return;
            }

            if (!($scope.data.idMedida > 0)) {
                tS.toastr("warning", "Seleccione la Medida", titulo);
                return;
            }

            if (isNaN($scope.data.precioCosto)) {
                tS.toastr("warning", "Ingrese el Precio de Costo del Articulo", titulo);
                return;
            }

            if ($scope.data.datosAdicionales) {
                if (!($scope.data.idEtiqueta > 0)) {
                    tS.toastr("warning", "Seleccione la Etiqueta", titulo);
                    return;
                }
            }
        }

        if ($scope.tipoRegistro == 1 || $scope.tipoRegistro == 2) {
            if (!$scope.data.descripcion) {
                tS.toastr("warning", "Ingrese la Descripción del Articulo", titulo);
                return;
            }
            if (!($scope.data.idSubFamilia > 0)) {
                tS.toastr("warning", "Seleccione la Sub Familia del Articulo", titulo);
                return;
            }

            if (!$scope.data.codigo) {
                tS.toastr("warning", "Ingrese el Código del Articulo", titulo);
                return;
            }

            if (!($scope.data.idTipoArticulo > 0)) {
                tS.toastr("warning", "Seleccione el Tipo Articulo", titulo);
                return;
            }

            if (!($scope.data.idMedida > 0)) {
                tS.toastr("warning", "Seleccione la Medida", titulo);
                return;
            }

            if ($scope.data.caducidad) {
                if (!$scope.data.fechaCaducidad) {
                    tS.toastr(
                        "warning",
                        "Ingrese la fecha de Caducidad del Articulo",
                        titulo
                    );
                    return;
                }
            }

            if ($scope.data.datosLote) {
                if (!$scope.data.lote) {
                    tS.toastr("warning", "Ingrese el Lote", titulo);
                    return;
                }
                if (!$scope.data.fechaCreacion) {
                    tS.toastr("warning", "Ingrese la fecha de Creación", titulo);
                    return;
                }
                if (!$scope.data.fechaCaducidadLote) {
                    tS.toastr(
                        "warning",
                        "Ingrese la fecha de Caducidad del Lote",
                        titulo
                    );
                    return;
                }
            }
        }

        if (isNaN($scope.data.precioCosto)) {
            tS.toastr("warning", "Ingrese el Precio de Costo del Articulo", titulo);
            return;
        }

        if ($scope.data.precioCosto === 0) {
            tS.toastr(
                "warning",
                "El valor mínimo en el precio de costo es 0.01",
                titulo
            );

            return;
        }

        $scope.data.precioSinSubsidio = [null, undefined, "", "0"].includes(
            $scope.data.precioSinSubsidio
        )
            ? 0
            : $scope.data.precioSinSubsidio;

        let jsonPvp = [];
        for (const ap of $scope.gridOptions.data) {
            jsonPvp.push({
                idArticuloPvP: ap.idArticuloPvP,
                idTarifa: ap.idTarifa,
                precioVenta: ap.precioVenta,
                precioConIva: ap.precioConIva,
                porcentajeUtilidad: ap.porcentajeUtilidad,
                precioPredeterminado: ap.precioPredeterminado,
            });
        }

        const senData = {
            jsonArticulo: JSON.stringify($scope.data),
            jsonPvp: JSON.stringify(jsonPvp),
            idBodega: $scope.dataUbicacion.idBodega,
            ubicacion: $scope.dataUbicacion.ubicacion,
        };

        let dataRepository = {};
        if (!($scope.data.idArticulo > 0)) {
            showLoader();
            articuloSvc
                .save($scope.image.selectedFile, senData)
                .then((response) => {
                    if (response.code == 0) {
                        tS.toastr("warning", response.message, response.titleSms);
                    }
                    if (response.code == 1) {
                        tS.toastr("success", response.message, response.titleSms);
                        dataRepository = JSON.parse(response.payload)[0];
                        if (dataRepository) {
                            setResponse(dataRepository);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => hideLoader());
        } else if ($scope.data.idArticulo > 0) {
            showLoader();
            articuloSvc
                .update($scope.data.idArticulo, senData)
                .then((response) => {
                    if (response.code == 0) {
                        tS.toastr("warning", response.message, response.titleSms);
                    }
                    if (response.code == 1) {
                        tS.toastr("success", response.message, response.titleSms);
                        dataRepository = JSON.parse(response.payload)[0];
                        if (dataRepository) {
                            setResponse(dataRepository);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => hideLoader());
        }
    };

    $scope.uploadFile = () => {
        if ($scope.data.productPhotoId > 0 && $scope.image.selectedFile != null) {
            showLoader();
            productPhotoService.update({ id: $scope.data.productPhotoId, data: JSON.stringify({ id: $scope.data.productPhotoId, s3ObjectKey: null, s3ObjectUrl: null }), file: $scope.image.selectedFile, }).then(response => {
                if (response.code == "0") {
                    tS.toastr("warning", response.message)
                }
                if (response.code == "1") {
                    let src = URL.createObjectURL($scope.image.selectedFile)
                    document.getElementById('productImage').src = src
                    tS.toastr("success", response.message)
                }
                hideLoader()
            }).catch(error => {
                hideLoader()
                console.log(error);
            });
        }
        if ($scope.data.idArticulo > 0 && $scope.data.productPhotoId == 0 && $scope.image.selectedFile != null) {
            showLoader();
            productPhotoService.post({ productId: $scope.data.idArticulo, file: $scope.image.selectedFile, }).then(response => {
                if (response.code == "0") {
                    tS.toastr("warning", response.message)
                }
                if (response.code == "1") {
                    let src = URL.createObjectURL($scope.image.selectedFile)
                    document.getElementById('productImage').src = src
                    tS.toastr("success", response.message)
                }
                hideLoader()
            }).catch(error => {
                hideLoader()
                console.log(error);
            });
        }
    }

    $scope.closeModal = function () {
        if (
            (!($scope.data.idArticulo > 0) && !$scope.data.descripcion) ||
            !$scope.data.precioCosto
        ) {
            Swal.fire({
                icon: "warning",
                html: `<small>Está seguro/a de salir sin guardar los datos del artículo?</small>`,
                confirmButtonText: "Sí, salir",
                showDenyButton: true,
                denyButtonText: "No, cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    $uibModalInstance.close();
                }
            });
            $(".swal2-container").css("z-index", "999999");
            return;
        }
        $uibModalInstance.close();
    };



    $scope.articuloCodigoBarras = [];
    //=======================================ARTICULO CODIGO BARRA ============================
    function getCodigoBarraArticulo() {
        showLoader();
        articuloSvc.findById(params.idArticulo).then((response) => {
            let { articuloCodigoBarras } = response;
            $scope.articuloCodigoBarras = articuloCodigoBarras;
        })
            .catch((err) => {
                console.log(err);
            }).finally(() => hideLoader())
    }

    $scope.resultModalMedidaCodigoBarra = async function (result) {
        try {
            if (typeof result !== "object") return;
            const { medidas } = await articuloSvc.getDataForForm();
            $scope.medidas = medidas;
            $scope.dataCodigoBarra.idMedida = $scope.medidas.at($scope.medidas.length - 1).idMedida;
        } catch (error) {
            console.log(error);
        }
    }

    $scope.coloresCodigoBarra = function (item) {
        return {
            "background-color": item.color,
            width: 20,
            height: 20,
        };
    }

    $scope.saveCodigoBarra = function () {
        if (!($scope.dataCodigoBarra.idMedida > 0)) {
            tS.toastr('warning', "Seleccione una Medida");
            return;
        }
        if (!($scope.data.codigoBarra)) {
            tS.toastr('warning', "Ingrese el Codigo de Barra");
            return;
        }
        if (!($scope.data.descripcion)) {
            tS.toastr('warning', "Ingrese la descripción");
            return;
        }
        $scope.dataCodigoBarra.idArticulo = params.idArticulo;
        if ($scope.dataCodigoBarra.idArticuloCodigoBarra > 0) {
            showLoader();
            articuloCodigoBarraSvc.put($scope.dataCodigoBarra.idArticuloCodigoBarra, $scope.dataCodigoBarra)
                .then($scope.successReponseCodigoBarra)
                .catch(err => {
                    console.log(err);
                }).finally(() => hideLoader())
        } else if (!($scope.dataCodigoBarra.idArticuloCodigoBarra > 0)) {
            articuloCodigoBarraSvc.post($scope.dataCodigoBarra).then($scope.successReponseCodigoBarra)
                .catch(err => {
                    console.log(err);
                }).finally(() => hideLoader())
        }
    }

    $scope.successReponseCodigoBarra = function (response) {
        if (response.code === '0') {
            tS.toastr('warning', response.message, response.titleSms);
        }
        if (response.code === '1') {
            tS.toastr('success', response.message, response.titleSms);
            getCodigoBarraArticulo();
            $scope.dataCodigoBarra = {
                color: "#ffffff",
                descripcion: $scope.data.descripcion
            };
        }
    }

    $scope.editarCodigoBarra = function (item) {
        $scope.dataCodigoBarra = Object.assign({}, item);
        $scope.dataCodigoBarra.idMedida = item.idMedida;
    }

    $scope.resetDataCodigoBarra = function () {
        $scope.dataCodigoBarra = {
            color: "#ffffff",
            descripcion: $scope.data.descripcion
        };
    }

    $scope.askToDeleteCodigoBarra = async function (item) {
        let { isConfirmed } = await Swal.fire({
            icon: "warning",
            html: `<small>Esta seguro/a de eliminar este Código de Barra del Articulo ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: "Si, eliminar",
            showCancelButton: true,
            cancelButtonText: "No, cancelar",
            allowOutsideClick: false,
        });

        if (isConfirmed) {
            showLoader();
            articuloCodigoBarraSvc.delete(item.idArticuloCodigoBarra).then((response) => {
                if (response.code == "0") {
                    tS.toastr('warning', response.message, response.titleSms);
                }
                if (response.code == "1") {
                    tS.toastr('success', response.message, response.titleSms);
                    getCodigoBarraArticulo();
                    $scope.dataCodigoBarra = {};
                }
            }).finally(() => hideLoader())
        }
    }

    //=============================================ARTICULO UBICACION=========================
    $scope.articuloUbicaciones = [];
    function getUbicacionArticulo() {
        if (!params) return;

        showLoader();
        articuloSvc.findById(params.idArticulo).then((response) => {
            const { articuloUbicaciones } = response;
            $scope.articuloUbicaciones = articuloUbicaciones;
        })
            .catch((error) => {
                console.error(error);
            }).finally(() => hideLoader())
    }

    $scope.onChangeEstab = () => {
        let dataEstab = $scope.establecimientos.find(estab => estab.idEstablecimiento === $scope.dataUbicacion.idEstablecimiento);
        $scope.bodegas = dataEstab.bodegas;
        $scope.dataUbicacion.idBodega = $scope.bodegas.find(bodega => (bodega.defaultBodega === true)).idBodega;
    }

    $scope.saveUbicacion = function () {
        if (!($scope.dataUbicacion.idBodega > 0)) {
            tS.toastr('warning', "Seleccione la Bodega");
            return;
        }
        if (!($scope.dataUbicacion.ubicacion)) {
            tS.toastr('warning', "Ingrese la Descripción");
            return;
        }

        $scope.dataUbicacion.idArticulo = params.idArticulo;

        if ($scope.dataUbicacion.idArticuloUbicacion > 0) {
            showLoader();
            articuloUbicacionSvc.update($scope.dataUbicacion.idArticuloUbicacion, $scope.dataUbicacion)
                .then((response) => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message)
                        getUbicacionArticulo();
                        $scope.dataUbicacion = {};
                    }
                }).finally(() => hideLoader())
        }

        if ((!$scope.dataUbicacion.idArticuloUbicacion > 0)) {
            showLoader();
            articuloUbicacionSvc.save($scope.dataUbicacion)
                .then((response) => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message)
                        return;
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message)
                        getUbicacionArticulo();
                        $scope.dataUbicacion = {};
                    }
                }).finally(() => hideLoader())
        }
    }

    $scope.editarUbicacion = function (item) {
        let dataBodega = $scope.bodegas.find(bodega => bodega.idBodega === item.idBodega);
        $scope.dataUbicacion = Object.assign({}, item);
        if (dataBodega) {
            let dataEstab = $scope.establecimientos.find(estab => estab.idEstablecimiento === dataBodega.idEstablecimiento);
            $scope.dataUbicacion.idEstablecimiento = dataEstab.idEstablecimiento;
        }
    }

    $scope.resetDataUbicacion = function () {
        $scope.dataUbicacion = {};
    }

    $scope.askToDeleteUbicacion = async function (item) {
        const { isConfirmed } = await Swal.fire({
            icon: "warning",
            html: `<small>Esta seguro/a de eliminar este Ubicación del Articulo ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: "Si, eliminar",
            showCancelButton: true,
            cancelButtonText: "No, cancelar",
            allowOutsideClick: false,
        });

        if (isConfirmed) {
            showLoader();
            articuloUbicacionSvc.delete(item.idArticuloUbicacion)
                .then((response) => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message)
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message)
                        getUbicacionArticulo();
                        $scope.dataUbicacion = {};
                    }
                }).finally(() => hideLoader())
        }
    }


}


/**
 * Articulo Fraccionado 
 */
modalArticuloFraccionadoCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', '$timeout', 'params'];
function modalArticuloFraccionadoCtrl($scope, $uibModalInstance, $injector, $timeout, params) {

    let articuloSvc = $injector.get('articuloService');
    let articuloFraccionadoSvc = $injector.get('articuloFraccionadoService');
    let tS = $injector.get("toastService");
    let fS = $injector.get("formulario");
    let pricingUtils = $injector.get("pricingUtils");


    $scope.tipoRegistro = 1;
    $scope.data = {
        selectedArticulo: ''
    }
    $scope.articulo = {};

    let articuloPrincipalTarifa = []

    function checkPrecioCosto() {
        return !([null, undefined, "", 0].includes($scope.data.precioCostoFraccionado));
    }

    $scope.gridOptions = {
        enableColumnMenus: false,
        enableColumnReordering: true,
        showGridFooter: false,
        enableSorting: false,
        enableFiltering: false,
        enableRowHashing: false,
        enableCellEdit: false,
        cellEditableCondition: () => {
            return checkPrecioCosto();
        },
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        if ($scope.gridApi) {
            $timeout(() => {
                $scope.gridApi.core.handleWindowResize();
                $scope.gridApi.grid.refresh();
            }, 5);
        }

        gridApi.edit.on.afterCellEdit(
            $scope,
            (rowEntity, colDef, newValue, oldValue) => {
                const index = $scope.gridOptions.data.indexOf(rowEntity); //Obtenemos indice

                let precioConIva = 0;
                let precioVenta = 0;
                let porcentajeUtilidad = 0;
                let ganancia = 0;
                let precioCosto = $scope.data.precioCostoFraccionado

                //Validacion de Campos
                if (
                    [null, undefined, "", 0].includes(precioCosto) ||
                    isNaN(precioCosto)
                ) {
                    tS.toastr("warning", "Ingrese el Precio de Costo");
                    return;
                }

                if (colDef.field === "precioVenta") {
                    if ([null, undefined].includes(newValue)) {
                        rowEntity.precioVenta = oldValue;
                    }
                    if (rowEntity.precioVenta > 0) {
                        if (rowEntity.precioVenta < precioCosto) {
                            rowEntity[colDef.field] = oldValue;
                        }
                    }
                }

                if (colDef.field === "precioConIva") {
                    if ([null, undefined].includes(newValue)) {
                        rowEntity.precioConIva = oldValue;
                    }

                    if (rowEntity.precioConIva > 0) {
                        if (rowEntity.precioConIva < precioCosto) {
                            rowEntity.precioConIva = oldValue;
                        }
                    }
                }

                if (
                    (colDef.field === "porcentajeUtilidad" && newValue === undefined) ||
                    newValue === null
                ) {
                    rowEntity.porcentajeUtilidad = oldValue;
                }

                //Calculos
                switch (colDef.field) {
                    case "precioVenta":
                        precioConIva = pricingUtils.calcularPrecioConIva(
                            rowEntity.precioVenta,
                            rowEntity.porcentajeIva
                        );
                        porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(
                            precioCosto,
                            rowEntity.precioVenta
                        );

                        $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                            rowEntity.precioVenta,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                            precioConIva,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(
                            porcentajeUtilidad,
                            pricingUtils.precisionMaxima
                        );

                        break;

                    case "precioConIva":
                        precioVenta = pricingUtils.calcularPrecioVenta(
                            rowEntity.precioConIva,
                            rowEntity.porcentajeIva
                        );
                        porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(
                            precioCosto,
                            precioVenta
                        );

                        $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                            rowEntity.precioConIva,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                            precioVenta,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(
                            porcentajeUtilidad,
                            pricingUtils.precisionMaxima
                        );

                        break;
                    case "porcentajeUtilidad":
                        precioVenta = pricingUtils.calcularPorcentajeUtilidad(
                            precioCosto,
                            rowEntity.porcentajeUtilidad
                        );
                        precioConIva = pricingUtils.calcularPrecioConIva(
                            precioVenta,
                            rowEntity.porcentajeIva
                        );

                        $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                            precioVenta,
                            $scope.decimal.nroPrecio
                        );
                        $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                            precioConIva,
                            $scope.decimal.nroPrecio
                        );
                        break;
                }

                //alexis ramirez
                ganancia = rowEntity.precioVenta - precioCosto;
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, pricingUtils.precisionMaxima);
            }
        );
    };



    $scope.gridOptions.columnDefs = [
        {
            name: "idTarifa",
            field: "idTarifa",
            visible: false,
        },
        {
            name: "tarifa",
            field: "tarifa",
            enableCellEdit: false,
            width: "15%",
            minWidth: 100,
        },
        {
            name: "Tipo Iva",
            field: "porcentajeIva",
            type: "number",
            enableCellEdit: false,
            width: "5%",
            minWidth: 100,
        },
        {
            name: "precioVenta",
            field: "precioVenta",
            enableCellEditOnFocus: true,
            enableCellEdit: true,
            allowCellFocus: true,
            type: "number",
            width: "15%",
            minWidth: 100,
        },
        {
            name: "precioConIva",
            field: "precioConIva",
            enableCellEditOnFocus: true,
            enableCellEdit: true,
            allowCellFocus: true,
            type: "number",
            width: "15%",
            minWidth: 100,
        },
        {
            headerCellTemplate: `<div class="d-flex m-1 justify-content-center align-items-center">
            <span>% Utilidad</span>
            
            <button type="button" ng-click="grid.appScope.recalculatePercentage()"   class="btn btn-secondary btn-xs ml-2"> 
            <i class="fa fa-redo"></i>
        </button>
            
            </div>`,
            name: "porcentajeUtilidad",
            field: "porcentajeUtilidad",
            type: "number",
            enableCellEditOnFocus: true,
            enableCellEdit: true,
            allowCellFocus: true,
            width: "18%",
            minWidth: 100,
        },

        {
            name: "Utilidad",
            field: "ganancia",
            type: "number",
            enableCellEditOnFocus: true,
            width: "10%",
            minWidth: 100,
        },
        {
            name: "P. precioPredeterminado",
            field: "precioPredeterminado",
            visible: false,
        },
        {
            name: "Estado",
            field: "predeterminadaVal",
            enableCellEdit: false,
            type: "checkbox",
            //cellTemplate: '<div class="text-center"><input type="checkbox"' +
            //    'name="radio" value="radio" ng-click="grid.appScope.updateDefault(row.entity)"/></div>', //'<md-switch style="display:inline;" title="Actualizar estado" aria-label="Predeterminado" ng-click="grid.appScope.updateDefault(row)"></md-switch>',

            width: "15%",
            minWidth: 100,
            cellClass: function (grid, row) {
                if (row.entity.precioPredeterminado) {
                    row.entity.predeterminadaVal = "Predeterminado";
                    return "blue";
                }
            },
        },
    ];

    //verificar si datos de articulo proviene de modal articulo ctrl
    $scope.hasDataArticle = false;

    initialLoad();
    function initialLoad() {
        try { 

            articuloSvc.getDataForForm().then(response => {
                const { medidas, tarifas, decimal } = response;
                $scope.medidas = medidas;
                $scope.data.idMedida = $scope.medidas.length > 0 ? $scope.medidas[0].idMedida : 0;

                $scope.tarifas = tarifas;

                $scope.decimal = decimal;

                if (params && params.idArticuloFraccionado) {
                    $scope.tipoRegistro = 2;
                    getDataArticuloFraccionado();
                }


                if(params.hasDataArticle && params.idArticulo>0){
                   $scope.hasDataArticle = params.hasDataArticle
                    $scope.selectedArticuloChange(params);
                }

            }) 

        } catch (error) {
            console.error(error);
        }

        $uibModalInstance.rendered.then(() => {
            $("#agregarArtFraccionado").on("shown.bs.modal", () => {
                $("input[name='articuloAutocomplete']").focus();
            });
        });
    }

    function getDataArticuloFraccionado() {
        articuloFraccionadoSvc.get({ tipo: 2, id: params.idArticuloFraccionado }).then((response) => {
            const { data, pvps } = response;
            $scope.data = {
                ...params,
                ...data,
            };

          
            

            $scope.gridOptions.data = pvps.map((val) => {
                let ganancia = val.precioVenta - $scope.data.precioCostoFraccionado;
                val.ganancia = fS.roundNumber(ganancia, pricingUtils.precisionMaxima);
                return val;
            })
        })
    }


    $scope.recalculatePercentage = function(){
        if(!($scope.data.precioCostoFraccionado>0)){
            tS.toastr({
                type: 'warning',
                message: 'Ingrese precio costo fraccionado'
            })
            return 
        }
        let precioCosto = Number($scope.data.precioCostoFraccionado);

        console.log(articuloPrincipalTarifa)
        articuloPrincipalTarifa.forEach((item, index)=>{
            let precioVenta = pricingUtils.calcularPorcentajeUtilidad(
                precioCosto,
                item.porcentajeUtilidad
            );
            let precioConIva = pricingUtils.calcularPrecioConIva(
                precioVenta,
                item.porcentajeIva
            );

            $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                precioVenta,
                $scope.decimal.nroPrecio
            );
            $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                precioConIva,
                $scope.decimal.nroPrecio
            );
            $scope.gridOptions.data[index].porcentajeUtilidad =  item.porcentajeUtilidad;


           
            let ganancia =  $scope.gridOptions.data[index].precioVenta - precioCosto;
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, pricingUtils.precisionMaxima);
                console.log( $scope.gridOptions.data)
                console.log(item.porcentajeUtilidad)

        })

         
    }

    $scope.searchArticuloFraccionadoFilter = function (textSearch) {
        let query = {
            checkBoxFraccionado: true,
            bySearch: textSearch,
            pageIndex: 1,
            pageSize: 25
        };
        let articulos = articuloSvc.searchForFraccionado(query);
        return articulos;
    }

    $scope.onKeyupSearchArticulo = function () {
       
        // if ([null, undefined, ""].includes($scope.data.selectedArticulo)) {
        //     $scope.data.selectedArticulo = null;
        //     $scope.articulo = {};
        // }
    }

    $scope.selectedArticuloChange = function (item) {
        try { 
            articuloSvc.findById(item.idArticulo).then((response) => { 
                let { data, articuloTarifas } = response;
             
                $scope.data = data;
                $scope.data.selectedArticulo = data.descripcion;

                articuloPrincipalTarifa = structuredClone(articuloTarifas); 

                $scope.gridOptions.data = structuredClone(articuloTarifas).map((item) => {
                    item.precioVenta = 0;
                    item.precioConIva = 0;
                    item.porcentajeUtilidad = 0;
                    item.ganancia = 0;
                    return item;
                });
            })
                .catch((error) => {
                    console.log(error)
                }) 
        } catch (error) { 
            console.log(error);
        }
    }

    $scope.onChangeConversion = function(){
        console.log($scope.data.conversion)
        if($scope.data.conversion>0){
            let precioCostoFraccionado = Number($scope.data.conversion) + $scope.data.precioCosto; 
            $scope.data.precioCostoFraccionado = fS.roundNumber(precioCostoFraccionado, 3)
        }

    }

    $scope.recalculateTarifaAdd = function () {
        if ($scope.gridOptions.data.length === 0) return;

        const precioCosto = $scope.data.precioCostoFraccionado;
        const porcentajeIva = $scope.gridOptions.data[0].porcentajeIva;
        if (
            [null, undefined, ""].includes(precioCosto) ||
            isNaN(precioCosto)
        ) {
            tS.toastr("warning", "Ingrese un número válido");
            return;
        }
        if (precioCosto === 0) {
            tS.toastr("warning", "El valor mínimo en el precio de costo es 0.01");
            return;
        }


        try {
            let index = 0;
            for (let val of $scope.gridOptions.data) {
                $scope.gridOptions.data[index].porcentajeIva = porcentajeIva;

                let precioVenta = pricingUtils.calcularPrecioVenta(
                    val.precioConIva,
                    val.porcentajeIva
                );
                $scope.gridOptions.data[index].precioVenta = fS.roundNumber(
                    precioVenta,
                    $scope.decimal.nroPrecio
                );

                let precioConIva = pricingUtils.calcularPrecioConIva(
                    val.precioVenta,
                    val.porcentajeIva
                );
                $scope.gridOptions.data[index].precioConIva = fS.roundNumber(
                    precioConIva,
                    $scope.decimal.nroPrecio
                );

                let porcentajeUtilidad = pricingUtils.campoPorcentajeUtilidad(
                    precioCosto,
                    precioVenta
                );
                $scope.gridOptions.data[index].porcentajeUtilidad = fS.roundNumber(
                    porcentajeUtilidad,
                    pricingUtils.precisionMaxima
                );

                let ganancia = getTarifaGanacia(
                    val.precioVenta,
                    precioCosto
                );
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, pricingUtils.precisionMaxima);
                index++;
            }
        } catch (error) {
            toastr.error(error);
        }
    }

    function getTarifaGanacia(precioVenta, precioCosto) {
        return precioVenta - precioCosto;
    }

    $scope.resultModalMedida = async function (result) {
        try { 
            if (typeof result !== "object") return;
            const { medidas } = await articuloSvc.getDataForForm();
            $scope.medidas = medidas;
            $scope.data.idMedida = $scope.medidas.at($scope.medidas.length - 1).idMedida;
        } catch (error) {
            console.log(error);
        }
    }

    $scope.save = function () {
        if (!($scope.data.idArticulo > 0)) {
            tS.toastr('warning', "Seleccione el Articulo");
            return;
        }

        if (["", null, undefined].includes($scope.data.conversion)) {
            tS.toastr('warning', "Ingrese la Conversión");
            return;
        }

        if (isNaN($scope.data.conversion)) {
            tS.toastr('warning', 'Valor no válido en el campo Conversión');
            return;
        }
        if (!($scope.data.idMedida > 0)) {
            tS.toastr('warning', "Seleccione la Medida");
            return;
        }
        if (["", null, undefined].includes($scope.data.precioCostoFraccionado)) {
            tS.toastr('warning', "Ingrese el Precio Costo Fraccionado");
            return;
        }

        if (isNaN($scope.data.precioCostoFraccionado)) {
            tS.toastr('warning', "Valor no válido en el campo Precio Costo Fraccionado");
            return;
        }

        let data = {
            idArticulo: $scope.data.idArticulo,
            idMedida: $scope.data.idMedida,
            conversion: $scope.data.conversion,
            gestionVenta: $scope.data.gestionVenta,
            precioCostoFraccionado: $scope.data.precioCostoFraccionado,
            pvps: $scope.gridOptions.data,
        }

        if (!($scope.data.idArticuloFraccionado > 0)) { 
            articuloFraccionadoSvc.post(data).then(successReponse)
                 
        }

        if ($scope.data.idArticuloFraccionado > 0) { 
            articuloFraccionadoSvc.put($scope.data.idArticuloFraccionado, data).then(successReponse) 
        }
    }

    function successReponse(response) { 
        if (response.code == "0") {
            tS.toastr('warning', response.message, response.titleSms);
        }
        if (response.code === "1") {
            tS.toastr('success', response.message, response.titleSms);
            $uibModalInstance.close(response);
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}


//-------------------------------------LISTA DE ARTICULO CON INFORMACIÓN COMPLETA------------------------
/**
 * Clase para gestionar el buscador avanzado del articulo, trae las bodegas y pvps
 * @params null
 */

ModalArticuloGeneralCtrl.$inject = [
    "$scope",
    "$uibModalInstance",
    "articuloService",
    "productPhotoService",
    "modalService",
    "nombreModal",
    "params"
];

function ModalArticuloGeneralCtrl(
    $scope,
    $uibModalInstance,
    artSvc,
    productPhotoSvc,
    modalSvc,
    nombreModal,
    params
) {

    $scope.articulos = [];
    $scope.selectedArticulos = [];
    //Filtro
    $scope.recordsQuantity = [10, 25, 50, 100];
    $scope.dataSearch = {
        pageSize: 50,
        pageIndex: 1,
        maxSize: 5,
        totalRecords: 0,
        bySearch: null,
        byColumn: "DESC",
    };



    $scope.tipoBusquedas = [
        {
            codigo: "DESC",
            descripcion: "Descripción",
        },
        {
            codigo: "COD",
            descripcion: "Código",
        },
        {
            codigo: "AUX",
            descripcion: "Código Auxiliar",
        },
        {
            codigo: "BAR",
            descripcion: "Código Barra",
        },
    ];


    $scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: false,
        decapitate: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true,

    };

    $uibModalInstance.rendered.then(() => {
        $("#inputTextSearch").focus();
    });

    $scope.onSearchText = onSearchText;
    $scope.pageChanged = pageChanged;
    $scope.changePageSize = changePageSize;
    $scope.onEnter = onEnter;
    $scope.refresh = refresh;
    $scope.askToSelect = askToSelect;




    function pageChanged() {
        refresh();
    }

    function changePageSize() {
        $scope.dataSearch.pageIndex = 1;
        refresh();
    }

    function onEnter($event) {
        if ($scope.dataSearch.bySearch && $event.key === "Enter") {
            refresh()
            $scope.dataSearch.bySearch = null;
        }
    };

    function onSearchText() {
        $scope.articulos = [];
        if ($scope.dataSearch.bySearch && $scope.dataSearch.bySearch.length > 2) {
            getArticulos()
        }

    }

    function getArticulos() {
        try {
            $scope.articulos = [];

            $scope.dataSearch.totalRecords = 0;
            $scope.dataSearch.checkBoxStock = [1, 2].includes($scope.dataSearch.byStock);
            artSvc.getAllWithPrices($scope.dataSearch).then((response) => {
                let { articulos, totalRecords } = response;

                $scope.articulos = articulos;
                $scope.dataSearch.totalRecords = totalRecords;
                $scope.tarifas = $scope.articulos.length > 0 ? $scope.articulos[0].tarifas : [];
            }).catch((err) => {
                console.log(err);
            });
        } catch (error) {
            console.log(error);
        }

    }

    function refresh() {
        getArticulos();
    }



    $scope.onChangeCheckBoxItem = (item) => {
        const data = {
            idArticulo: item.idArticulo,
            idPresentacion: item.idPresentacion,
            presentacion: item.presentacion,
            tipoRegistro: 1,
        };
        $uibModalInstance.close(data);
    };

    // $scope.onChangeCheckBoxItem =  (item)=>{
    //     console.log(item)
    // }

    // const dataMergeStockQty = mergeStockQty(cloneOrderItems, {
    //     idArticulo: $event.productId,
    //     idBodega: $event.bodegaId
    // });

    // const cantidad = calculateCantidadStock({
    //     cantidadStock: dataMergeStockQty.cantidadStock,
    //     idBodega: $event.bodegaId,
    //     fechaEmision: this.posStoreSvc.state().order.createdAt,
    //     productoConsolidaciones: $event.consolidacionesFecha
    // });

    // const paramsStock = {
    //     idArticulo: $event.productId,
    //     idBodega: $event.bodegaId,
    //     cantidad
    // };

    function askToSelect(item) {

        if (params && typeof params === 'object' && params.esVenta) {
            askToAdd(item);
            return 
        } 

        const data = {
            idArticulo: item.idArticulo,  
        };
        $uibModalInstance.close(data);


    }

    function getElementQty(){
        return document.getElementById('cantidadInput');
    }

    /**
     * 
     * @param {*} item 
     */
    function askToAdd(item) { 
        Swal.fire({
            title: '¿Qué deseas hacer?',
            html: `
                <label for="cantidadInput" style="display: block; margin-bottom: 5px;">Ingresa una cantidad:</label>
                <input id="cantidadInput" type="number" class="swal2-input" placeholder="Escribe un número" min="1" value="1" autofocus>
            `,
            focusConfirm: false,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Añadir y continuar',
            denyButtonText: 'Añadir y cerrar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const cantidadInput = getElementQty().value;
        
                // Validar si el valor es un número y mayor que 0
                if (isNaN(cantidadInput) || cantidadInput <= 0) {
                    Swal.showValidationMessage('La cantidad debe ser un número mayor a 0.');
                    return false; // Retorna false para no permitir el cierre
                }
        
                return cantidadInput; // Retorna el valor si es válido
            },
            preDeny: () => {
                const cantidadInput = getElementQty().value;
        
                // Validar si el valor es un número y mayor que 0
                if (isNaN(cantidadInput) || cantidadInput <= 0) {
                    Swal.showValidationMessage('La cantidad debe ser un número mayor a 0.');
                    return false; // Retorna false para no permitir el cierre
                }
        
                return cantidadInput; // Retorna el valor si es válido
            },
            didOpen: () => {
                // Detectar la tecla Enter
                const cantidadInputElement = getElementQty();
                 cantidadInputElement.select() 
                cantidadInputElement.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm(); // Simula el clic en "Añadir y continuar"
                    }
                });
            }
        }).then((result) => {
            let cantidadInput = getElementQty().value; // Obtener el valor del input
            cantidadInput = Number(cantidadInput);
        
            if (result.isConfirmed) {
                params.refProductoVenta.onInventario({
                   idArticulo: item.idArticulo,
                   cantidad: cantidadInput
                });
        
            } else if (result.isDenied) {
                params.refProductoVenta.onInventario({
                   idArticulo: item.idArticulo,
                   cantidad: cantidadInput
                });
                $uibModalInstance.close();
            }
        });
        
    }

    $scope.previewImg = function (item) {
        productPhotoSvc.previewImg(item.idArticulo)
    }

    $scope.closeModal = function () {
        $uibModalInstance.close();
    };
}



modalHistorialCompraCtrl.$inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'params'];

function modalHistorialCompraCtrl($scope, $uibModalInstance, mS, tS, params) {
    const URL = 'Compra/CompraHabitual/'
    $scope.articleName = `${params.codigo} -> ${params.descripcion}`;

    $scope.historyComprasArticle = [];

    initialLoad();
    function initialLoad() {
        try { 
            //$scope.articleName = item.descripcion
            mS.getData('get', `${URL}Get?json=${JSON.stringify({
                tipo: 3,
                idArticulo: params.idArticulo
            })}`, null, true).then(
                response => {
                    if (!response.payload) {
                        tS.toastr('warning', 'Este articulo aun no tiene registros de compra habitual')
                    } else {
                        $scope.historyComprasArticle = JSON.parse(response.payload)
                        //console.log($scope.historyComprasArticle)
                        $scope.articleName = $scope.historyComprasArticle[0].articulo;
                    }
                }
            ) 
        } catch (error) {
            console.log(error)
        }
    }


    $scope.askToDeleteCH = async (item) => {
        try {
            const confirmation = await Swal.fire({
                title: '¿Está seguro/a de desvincular este artículo de compras habituales?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
                allowOutsideClick: false,
            });

            if (confirmation.isConfirmed) {
                await $scope.deletePurchaseRecord(item);
            }
        } catch (error) {
            console.error('Error during confirmation or deletion:', error);
        }
    };


    let shouldRefresh = false;

    $scope.deletePurchaseRecord = async (record) => {
        try {
            showLoader();

            const { idDocumento, idCompraHabitual } = { ...record, idDocumento: params.idDocumento };

            const initialResponse = await mS.getData(
                'delete',
                `${URL}Delete?json=${JSON.stringify({ idDocumento, id: idCompraHabitual, tipo: 1 })}`
            );

            if (initialResponse.code === '0') {
                const userConfirmation = await Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    html: `${initialResponse.message} </br> ¿Desea proceder de todas maneras? Este proceso es irreversible.`,
                    showCancelButton: true,
                    confirmButtonText: 'Proceder',
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                });

                if (userConfirmation.isConfirmed) {
                    const finalResponse = await mS.getData(
                        'delete',
                        `${URL}Delete?json=${JSON.stringify({ idDocumento, id: idCompraHabitual, tipo: 2 })}`
                    );

                    handleResponse(finalResponse, record);
                }
            } else {
                handleResponse(initialResponse, record);
            }
        } catch (error) {
            console.error('Error deleting purchase record:', error);
        } finally {
            hideLoader();
        }
    };

    function handleResponse(response, record) {
        if (response.code === '0') {
            tS.toastr('warning', response.message);
        } else if (response.code === '1') {
            const recordIndex = $scope.historyComprasArticle.indexOf(record);
            if (recordIndex > -1) {
                $scope.historyComprasArticle.splice(recordIndex, 1);
            }
            tS.toastr('success', response.message);
            shouldRefresh = true;
            $scope.closeModal();
        }
    }

    $scope.closeModal = () => {
        $uibModalInstance.close({ shouldRefresh });
    };

}

/*******PRODUCT PHOTO****************/
modalProductPhotoCtrl.$inject = [
    '$scope',
    'mainService',
    'toastService',
    '$uibModalInstance',
    'params',
    'productPhotoService'
]
function modalProductPhotoCtrl($scope, mS, tS, $uibModalInstance, params, productPhotoService) {
    $scope.photos = []
    $scope.product = params;
    $scope.productPhoto = {}
    $scope.photoSelected = {}
    const url = 'Inventario/ProductPhoto/';

    let responseRef = null;

    function init() {
        showLoader();
        mS.getData('GET', `${url}${params.idArticulo}`, null, true).then(
            response => {
                if (response.code == "1") {
                    $scope.photos = response.payload;
                }
                hideLoader();
            }
        ).catch(error => {
            hideLoader();
            console.log(error);
        })
    }
    init();

    $scope.edit = async (item) => {
        let { isConfirmed } = await Swal.fire({
            icon: 'question',
            title: 'Esta seguro/a de actualizar la imagen?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            allowOutsideClick: false
        })
        if (isConfirmed) {
            $scope.productPhoto = item;
            let fileInp = document.getElementById('photo');
            fileInp.click();
        }
    }

    $scope.setDefault = async (item) => {
        let { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Esta seguro/a de colocar como predeterminada esta imagen?',
            imageHeight: 300,
            imageUrl: item.s3ObjectUrl,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            showLoader();
            productPhotoService.setDefault({ id: item.id, isDefault: item.isDefault }).then(response => {
                if (response.code == "0") {
                    tS.toastr("warning", response.message)
                }
                if (response.code == "1") {
                    init();
                    tS.toastr("success", response.message)
                    responseRef = response;
                }
                hideLoader()
            }).catch(error => {
                hideLoader()
                console.log(error);
            });
        }
    }

    $scope.delete = async (item) => {
        let { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Esta seguro/a de eliminar la imagen?',
            imageHeight: 300,
            imageUrl: item.s3ObjectUrl,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            showLoader();
            productPhotoService.delete(item.id).then(response => {
                if (response.code == "0") {
                    tS.toastr("warning", response.message)
                }
                if (response.code == "1") {
                    init();
                    tS.toastr("success", response.message)
                    responseRef = response;
                }
                hideLoader()
            }).catch(error => {
                hideLoader()
                console.log(error);
            });
        }
    }

    $scope.upload = async () => {
        let src = URL.createObjectURL($scope.photoSelected)

        let { isConfirmed } = await Swal.fire({
            icon: 'question',
            title: 'Esta seguro de subir esta foto?',
            imageHeight: 300,
            imageUrl: src,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            showLoader();
            if ($scope.productPhoto.id > 0) {
                productPhotoService.update({ id: $scope.productPhoto.id, data: JSON.stringify({ id: $scope.productPhoto.id, s3ObjectKey: $scope.productPhoto.s3ObjectKey, s3ObjectUrl: $scope.productPhoto.s3ObjectUrl }), file: $scope.photoSelected, }).then(response => {
                    if (response.code == "0") {
                        tS.toastr("warning", response.message)
                    }
                    if (response.code == "1") {
                        init();
                        tS.toastr("success", response.message)
                        responseRef = response;
                    }
                    hideLoader()
                }).catch(error => {
                    hideLoader()
                    console.log(error);
                });
            } else {
                productPhotoService.post({ productId: params.idArticulo, file: $scope.photoSelected, }).then(response => {
                    if (response.code == "0") {
                        tS.toastr("warning", response.message)
                    }
                    if (response.code == "1") {
                        $scope.photoSelected = ''
                        $scope.productPhoto = {}
                        init()
                        tS.toastr("success", response.message)
                        responseRef = response;
                    }
                    hideLoader()
                }).catch(error => {
                    hideLoader()
                    console.log(error);
                });
            }
        }
    }

    $scope.closeModal = function () {
        $uibModalInstance.close(responseRef);
    }
}
/**END PRODUCT PHOTO*/