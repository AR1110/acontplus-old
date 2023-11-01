export { modalArticuloCtrl };

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

    const CODIGO_IVA = "IVA12";

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

    function checkPrecioCosto() {
        return !([null, undefined, "", 0].includes($scope.data.precioCosto));
    }

    //GridOptions Invoice
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
                            5
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
                            5
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
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, 5);
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
        showLoader();
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
                console.log(response);
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
            .finally(() => hideLoader());
    }

    function setCodigoSecuencialArticulo() {
        if ($scope.subFamilias.length === 0 || (params && params.isImport)) return;

        const { codigo, idSubFamilia } = $scope.subFamilias[0];
        console.log($scope.subFamilias[0]);
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
            showLoader();
            articuloSvc
                .findById(params.idArticulo)
                .then((response) => {
                    let { data, articuloTarifas } = response;
                    console.log(response);
                    $scope.data = data;

                    $scope.dataCodigoBarra.descripcion = $scope.data.descripcion;

                    $scope.gridOptions.data = articuloTarifas.map((item) => {
                        let ganancia = item.precioVenta - $scope.data.precioCosto;
                        item.ganancia = fS.roundNumber(ganancia, 5);
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
                })
                .catch((error) => {
                    console.log(error);
                }).finally(() => hideLoader())
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

        if ($scope.step === 4 || $scope.tipoRegistro === 2) {
            getUbicacionArticulo();
        }
    };

    $scope.resultModalSubFamilia = async function (result) {
        try {
            if (typeof result !== "object") return;

            const { subFamilias } = await articuloSvc.getDataForForm();
            $scope.subFamilias = subFamilias;
            const { idSubFamilia, codigo } = $scope.subFamilias.at(
                $scope.subFamilias.length - 1
            );
            $scope.data.idSubFamilia = idSubFamilia;
            setCodigo(codigo);
        } catch (error) {
            console.log(error);
        }
    };

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

    $scope.resultModalMedida = async function(result) {
        try {
            if (typeof result !== "object") return;
            const { medidas } = await articuloSvc.getDataForForm();
            $scope.medidas = medidas;
            $scope.data.idMedida = $scope.medidas.at($scope.medidas.length - 1).idMedida;
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
                    5
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
                        5
                    );
                }

                ganancia = getTarifaGanacia(val.precioVenta, $scope.data.precioCosto);
                $scope.gridOptions.data[index].ganancia = fS.roundNumber(ganancia, 5);
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
        recalculateTarifaUpdateArticle($scope.opcionCalculate);
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
                .update($scope.data.idArticulo, $scope.image.selectedFile, senData)
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

    $scope.resultModalMedidaCodigoBarra = async function(result) {
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
            articuloCodigoBarraSvc.put($scope.data.idArticuloCodigoBarra, $scope.dataCodigoBarra)
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
        if (response.id === '0') {
            tS.toastr('warning', response.message, response.titleSms);
        }
        if (response.id === '1') {
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
                if (response.id == "0") {
                    tS.toastr('warning', response.message, response.titleSms);
                }
                if (response.id == "1") {
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

    $scope.editarUbicacion = function(item) { 
        let dataBodega = $scope.bodegas.find(bodega=>bodega.idBodega===item.idBodega);
        $scope.dataUbicacion = Object.assign({}, item);        
        if(dataBodega){
            let dataEstab = $scope.establecimientos.find(estab=>estab.idEstablecimiento===dataBodega.idEstablecimiento);
            $scope.dataUbicacion.idEstablecimiento = dataEstab.idEstablecimiento;
        } 
    }

    $scope.resetDataUbicacion = function() { 
        $scope.dataUbicacion = {}; 
    }

    $scope.askToDeleteUbicacion = async function(item) {
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
