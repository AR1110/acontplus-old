(function () {

    'use strict'; 
    app.controller('reporteInventarioCtrl', reporteInventarioCtrl);

    reporteInventarioCtrl.$inject = [
        '$scope',
        '$injector',
    ];

    function reporteInventarioCtrl($scope, $injector) {
        let commonSvc = $injector.get('commonService');
        let fS = $injector.get('formulario');
        let tS = $injector.get('toastService');
        let articuloSvc = $injector.get('articuloService');

        $scope.dataSearch = {
            bySubFamilia: 0,
            idMarca: 0
        };
        $scope.dataSearch.byOrderCampo = 'ar.descripcion';
        $scope.dataSearch.byOrder = 'ASC';
        $scope.dataSearch.byTipoReporte = 0 //Consumo Diario
        $scope.dataSearch.byTipoFormato = 'pdf';
        $scope.dataSearch.codTransaccion = 'S';
        $scope.dataSearch.estado = 'VI';
        $scope.proveedor = {};

        $scope.establecimientos = [];

        //Tabs Stock 
        const REPORTE_STOCK_VALORACION = 'INVRV'; //Inventario Valoración
        const REPORT_ARTICULO_PVP = 'INVAT';
        $scope.isShowEstabStock = true;
        $scope.dataSearch.tipoReporteStock = REPORTE_STOCK_VALORACION;


        $scope.initiload = function () {
            showLoader();
            articuloSvc.getDataFormReport().then(response => {
                const { estabs, subFamilias, marcas} = response;
                $scope.establecimientos = estabs;
                let dataEstab = $scope.establecimientos.find(item => (item.defaultEstab))
            
                $scope.dataSearch.idEstablecimiento = dataEstab.idEstablecimiento;
 
                $scope.bodegas = dataEstab.bodegas;
                $scope.dataSearch.idBodega = $scope.bodegas.find(item => (item.defaultBodega)).idBodega;
                $scope.subFamilias = subFamilias.reduce(function (acc, obj) {
                    let key = obj.familia;
                    let existingGroup = acc.find(function (group) {
                        return group.familia === key;
                    });

                    if (existingGroup) {
                        existingGroup.subFamilias.push({
                            idSubFamilia: obj.idSubFamilia,
                            subFamilia: obj.subFamilia
                        });
                    } else {
                        acc.push({
                            familia: key,
                            subFamilias: [{
                                idSubFamilia: obj.idSubFamilia,
                                subFamilia: obj.subFamilia
                            }]
                        });
                    }

                    return acc;
                }, []);

                $scope.marcas = marcas;

            }).finally(()=>hideLoader())
        }
        $scope.initiload();


        $scope.onTab = function (e, type) {
            $scope.dataSearch.byTipoReporte = type;
            $scope.dataSearch.checkboxArticuloFiltro = false;
            $scope.dataSearch.checkboxUsuarioFiltro = false;
            $scope.dataSearch.chkProveedor = false;
            $scope.dataSearch.checkboxSubFamiliaFiltro = false;
            $scope.dataSearch.ckFechaCaducidad = false;
            $scope.dataSearch.chkUbicacion = false;

            let contentTab = document.querySelectorAll(".tab-content .tab-pane");
            let getTabPane = contentTab[type];

            for (let item of contentTab) {
                item.classList.remove("active");
            }
            getTabPane.classList.add("active");
        }

        $scope.onChangeEstab = function () {
            if ($scope.establecimientos.length === 0) return
            if (!($scope.dataSearch.idEstablecimiento > 0)) {
                $scope.dataSearch.idBodega = 0;
                $scope.dataSearch.idEstablecimiento = 0;
                $scope.bodegas = [];
                return
            }
            let dataEstab = $scope.establecimientos.find(item => item.idEstablecimiento === $scope.dataSearch.idEstablecimiento);
            $scope.bodegas = dataEstab.bodegas;
            if ($scope.bodegas.length > 0) {
                $scope.dataSearch.idBodega = $scope.bodegas.find(item => (item.defaultBodega)).idBodega;
            } else {
                $scope.dataSearch.idBodega = 0;

            }
        }


        //Tabs Stock 
        $scope.onChangeTipoReporteStock = function () {
            console.log($scope.dataSearch.tipoReporteStock)
            if ($scope.dataSearch.tipoReporteStock === REPORTE_STOCK_VALORACION) {
                $scope.isShowEstabStock = true;
            } else {
                $scope.isShowEstabStock = false;
            }
        }

        $scope.onChangeCheckProveedor = function () {
            if ($scope.dataSearch.chkProveedor) {
                $scope.dataSearch.checkboxSubFamiliaFiltro = false;
            }
        }

        $scope.onKeyupProveedor = function () {
            if (!$scope.proveedor.nombreProveedor) {
                $scope.dataSearch.numeroIdentificacion = null;
            }
        }
        $scope.onSelectProveedor = function (item) {
            $scope.dataSearch.numeroIdentificacion = item.numeroIdentificacion;
        }


        $scope.onKeyupArticle = function () {
            if (!$scope.dataSearchArticle) {
                $scope.dataSearch.idArticulo = 0;
            }
        }
        $scope.onSelectArticle = function (item) {
            $scope.dataSearchArticle = item.descripcion;
            $scope.dataSearch.idArticulo = item.idArticulo;
        }


        $scope.onSelectUser = function (item) {
            $scope.dataSearch.idUsuario = item.idUsuario;
        }
        $scope.onKeyupUser = function () {
            if (!$scope.dataSearchUser.nombreCompleto) {
                $scope.dataSearch.idUsuario = 0;
            }
        }


        $scope.getReport = function () {
            try {
                //Tabs 1
                if ($scope.dataSearch.checkboxArticuloFiltro) {
                    if (!($scope.dataSearch.idArticulo > 0)) {
                        tS.toastr('warning', 'Seleccione el Artículo!');
                        return
                    }
                    if ($scope.dataSearch.checkboxUsuarioFiltro) {
                        if (!($scope.dataSearch.idUsuario > 0)) {
                            tS.toastr('warning', 'Seleccione el Usuario!');
                            return
                        }
                    }
                }


                if ($scope.dataSearch.chkProveedor) {
                    if (!($scope.dataSearch.numeroIdentificacion)) {
                        tS.toastr('warning', 'Seleccione el Proveedor!');
                        return
                    }
                }

                if (!$scope.dataSearch.chkProveedor && $scope.dataSearch.checkboxSubFamiliaFiltro) {
                    if (!$scope.dataSearch.bySubFamilia) {
                        tS.toastr('warning', 'Seleccione la SubFamilia', 'Reporte');
                        return
                    }
                }

                if ($scope.dataSearch.checkboxStockFiltro) {
                    if (!$scope.dataSearch.byStock) {
                        tS.toastr('warning', 'Seleccione el Stock', 'Reporte');
                        return
                    }
                }

                if ($scope.dataSearch.checkboxUsuarioFiltro) {
                    if (!($scope.dataSearch.idUsuario > 0)) {
                        tS.toastr('warning', 'Seleccione el Usuario');
                        return;
                    }
                }

                if ($scope.dataSearch.byTipoReporte == 3) {
                    if ($scope.dataSearch.chkUbicacion) {
                        if (!$scope.dataSearch.textUbicacion) {
                            tS.toastr('warning', 'Ingrese la ubicación ');
                            return;
                        }
                    }
                }

                $scope.dataSearch.filtroFecha = getFilterDate();

                if ($scope.dataSearch.byTipoReporte === 0) {
                    getReportConsumoDiario();
                }

                if ($scope.dataSearch.byTipoReporte === 1) {
                    // if (!($scope.dataSearch.bySubFamilia > 0)) {
                    //     tS.toastr('warning', 'Seleccione la Subfamilia!');
                    //     return
                    // }
                    getReportArticuloStock();
                }
                if ($scope.dataSearch.byTipoReporte === 2) {
                    // if (!($scope.dataSearch.bySubFamilia > 0)) {
                    //     tS.toastr('warning', 'Seleccione la Subfamilia!');
                    //     return
                    // }
                    getReportArticuloPVP();
                }
                if ($scope.dataSearch.byTipoReporte === 3) {
                    getReportArticuloFraccionado();
                }
                if ($scope.dataSearch.byTipoReporte === 4) {
                    getReportCaducidad();
                }

            } catch (error) {
                console.log(error)
            }
        }

        function isValidField(field) {
            let invalid = ["", null, undefined, 0].includes(field)
            if (invalid) {
                return null;
            }
            return field;
        }

        function getFilterDate() {
            let fechaHoy = new Date();
            let fecha = fechaHoy.getDate() + '-' + (fechaHoy.getMonth() + 1) + '-' + fechaHoy.getFullYear();
            let hora = fechaHoy.getHours() + ':' + fechaHoy.getMinutes();
            return fecha + ' ' + hora;
        }

        // REPORTE DE CONSUMO DIARIO DE ARTICULOS
        function getReportConsumoDiario() {
         
            let dataSearch = {
                tipo: 4,
                checkBoxFecha: true,
                idUsuario: $scope.dataSearch.idUsuario,
                idArticulo: $scope.dataSearch.idArticulo,
                codTransaccion: $scope.dataSearch.codTransaccion,
                fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                codEstab: fS.isValidField($scope.dataSearch.codEstab),
                idBodega: fS.isValidField($scope.dataSearch.idBodega)
            }

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: $scope.dataSearch.checkboxAgruparArticulo? 'CDAA': 'CDA',
                    format: $scope.dataSearch.byTipoFormato,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataSearch)
            }

            const params = {
                parameters,
                formatType: $scope.dataSearch.byTipoFormato
            }

            commonSvc.getReport(params)
        }

        //Reporte Stock General - Stock con valoración
        function getReportArticuloStock() {
            try {
                let dataEstab = $scope.establecimientos.find(estab => estab.idEstablecimiento === $scope.dataSearch.idEstablecimiento);
                let codEstab = null;
                if (dataEstab) {
                    codEstab = dataEstab.codEstab;
                }

                let dataSearch = {
                    tipo: 3,
                    bySubFamilia: isValidField($scope.dataSearch.bySubFamilia),
                    numeroIdentificacion: isValidField($scope.dataSearch.numeroIdentificacion),
                    codEstab,
                    idBodega: isValidField($scope.dataSearch.idBodega),
                    idMarca: isValidField($scope.dataSearch.idMarca),
                    filtroFecha: $scope.dataSearch.filtroFecha
                }

                const parameters = {
                    reportParams: JSON.stringify({
                        codigo: REPORTE_STOCK_VALORACION,
                        format: $scope.dataSearch.byTipoFormato,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataSearch)
                }

                const params = {
                    parameters,
                    formatType: $scope.dataSearch.byTipoFormato
                }

                commonSvc.getReport(params)
            } catch (error) {
                console.log(error)
            }
        }

        function getReportArticuloPVP() {
            try {

                let dataSearch = {
                    tipo: 2,
                    bySubFamilia: isValidField($scope.dataSearch.bySubFamilia),
                }
                const parameters = {
                    reportParams: JSON.stringify({
                        codigo: REPORT_ARTICULO_PVP,
                        format: $scope.dataSearch.byTipoFormato,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataSearch)
                }

                const params = {
                    parameters,
                    formatType: $scope.dataSearch.byTipoFormato
                }

                commonSvc.getReport(params)
            } catch (error) {
                console.log(error)
            }
        }

        //lista lista precios 

        // REPORTE DE ARTICULOS CON TARIFAS DE PRECIO ||  REPORTE DE ARTICULOS CON STOCK POR BODEGA
        // $scope.getReportArticle = function () {
        //     let dataSearch = {
        //         tipo: $scope.dataSearch.tipoReporteArticulo === 'INVRV' ? 3 : 2,
        //         codEstab: $scope.dataSearch.codEstab,
        //         chkProveedor: $scope.dataSearch.chkProveedor,
        //         numeroIdentificacion: $scope.dataSearch.numeroIdentificacion,
        //         checkboxSubFamiliaFiltro: $scope.dataSearch.checkboxSubFamiliaFiltro,
        //         ckFechaCaducidad: $scope.dataSearch.ckFechaCaducidad,
        //         fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
        //         fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
        //         chkUbicacion: $scope.dataSearch.chkUbicacion,
        //         idBodega: ["", 0, null, undefined].includes($scope.dataSearch.idBodega) ? null : $scope.dataSearch.idBodega,
        //         textUbicacion: $scope.dataSearch.textUbicacion,
        //         bySubFamilia: $scope.dataSearch.bySubFamilia,
        //         byOrderCampo: $scope.dataSearch.byOrderCampo,
        //         byTipoFormato: $scope.dataSearch.byTipoFormato,
        //         byTipoReporte: $scope.dataSearch.byTipoReporte,
        //         byOrder: $scope.dataSearch.byOrder,
        //         filtroFecha: $scope.dataSearch.filtroFecha
        //     }

        //     const parameters = {
        //         reportParams: JSON.stringify({
        //             codigo: $scope.dataSearch.tipoReporteArticulo === 'INVRV' ? 'INVRV' : 'INVAT',
        //             format: $scope.dataSearch.byTipoFormato,
        //             aditionalParams: []
        //         }),
        //         dataParams: JSON.stringify(dataSearch)
        //     }

        //     const params = {
        //         parameters,
        //         formatType: $scope.dataSearch.byTipoFormato
        //     }

        //     commonSvc.getReport(params)
        // }

        // REPORTE DE ARTICULOS FRACCIONADOS 
        function getReportArticuloFraccionado() {
            let dataSearch = {
                tipo: 1,
                checkBoxArticulo: $scope.dataSearch.checkboxArticuloFiltro,
                idArticulo: $scope.dataSearch.idArticulo,
                chkProveedor: $scope.dataSearch.chkProveedor,
                numeroIdentificacion: $scope.dataSearch.numeroIdentificacion,
                checkboxSubFamiliaFiltro: $scope.dataSearch.checkboxSubFamiliaFiltro,
                bySubFamilia: $scope.dataSearch.bySubFamilia,
            }
            const parameters = {
                reportParams: JSON.stringify({
                    codigo: 'RAF',
                    format: $scope.dataSearch.byTipoFormato,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataSearch)
            }

            const params = {
                parameters,
                formatType: $scope.dataSearch.byTipoFormato
            }

            commonSvc.getReport(params)
        }

        // REPORTE DE CADUCIDAD DE ARTICULOS 
        function getReportCaducidad() {
            let dataSearch = {
                tipo: 5,
                codEstab: $scope.dataSearch.codEstab,
                chkProveedor: $scope.dataSearch.chkProveedor,
                numeroIdentificacion: $scope.dataSearch.numeroIdentificacion,
                checkboxSubFamiliaFiltro: $scope.dataSearch.checkboxSubFamiliaFiltro,
                bySubFamilia: $scope.dataSearch.bySubFamilia,
                ckFechaCaducidad: $scope.dataSearch.ckFechaCaducidad,
                fechaInicio: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                fechaFin: fS.formatDateTimeZone($scope.dataSearch.fechaFin),
                chkUbicacion: $scope.dataSearch.chkUbicacion,
                idBodega: ["", 0, null, undefined].includes($scope.dataSearch.idBodega) ? null : $scope.dataSearch.idBodega,
                textUbicacion: $scope.dataSearch.textUbicacion,
                chkEstado: true,
                estado: $scope.dataSearch.estado,
                byTipoFormato: $scope.dataSearch.byTipoFormato,
                byTipoReporte: $scope.dataSearch.byTipoReporte,
                filtroFecha: $scope.dataSearch.filtroFecha
            }

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: 'RCAA',
                    format: $scope.dataSearch.byTipoFormato,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataSearch)
            }

            const params = {
                parameters,
                formatType: $scope.dataSearch.byTipoFormato
            }

            commonSvc.getReport(params)
        }

    }
})(window.angular)