(function () {

    'use strict';

    app.controller('reporteVentaCtrl', reporteVentaCtrl);

    reporteVentaCtrl.$inject = ['$scope', '$injector', 'docElectService'];

    function reporteVentaCtrl($scope, $injector, docElectSvc) {
        const reporteVentaSvc = $injector.get('reporteFactElectService');
        // const decodeToken = $injector.get('decodeToken');
        const tS = $injector.get('toastService');
        const fS = $injector.get('formulario');
        const commonSvc = $injector.get('commonService');

        //  let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
        const DOC_TYPE = $injector.get('DOC_TYPE');
        const CODE_REPORT = $injector.get('CODE_REPORT');

        let format = 'pdf'

        // // Obtén el año actual
        // const anioActual = new Date().getFullYear();

        // // Establece la fecha de inicio al primer día de enero
        // const fechaInicio = new Date(anioActual, 0, 1);

        // // Establece la fecha de fin al último día de diciembre
        // const fechaFin = new Date(anioActual, 11, 31);

        $scope.dataSearch = {
            idEstablecimiento: 0,
            idPuntoEmision: 0,
            idEstadoDocumento: 0,
            codeDevolucion: 'ALL',
            codeRetencion: 'ALL',
            idUsuario: 0
        };
        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.estadosDoc = [];
        $scope.tiposDoc = [];

        $scope.cliente = {};
        $scope.user = {};

        $scope.retenciones = [
            { code: 'ALL', descripcion: 'Todos' },
            { code: 'CR', descripcion: 'Con Retención' },
            { code: 'SR', descripcion: 'Sin Retención' },
        ]
        $scope.devoluciones = [
            { code: 'ALL', descripcion: 'Todos' },
            { code: 'CD', descripcion: 'Con Devolución' },
            { code: 'SD', descripcion: 'Sin Devolución' },
        ]

        $scope.showField = true;

        initiload();
        function initiload() {
            try {
                showLoader();
                docElectSvc.getDataFilter().then(response => {
                    let { estabs, estadosDoc, tiposDoc } = response;
                    console.log(response)
                    $scope.establecimientos = estabs;
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                        $scope.puntosEmision = dataEstab.puntosEmision;
                    }
                    $scope.tiposDoc = tiposDoc;
                    const dataTipoDoc = $scope.tiposDoc.find(tipoDoc => tipoDoc.codDoc === DOC_TYPE.FV_SRI);
                    $scope.dataSearch.idTipoDocumento = dataTipoDoc.idTipoDocumento;
                    $scope.estadosDoc = [...estadosDoc, {
                        codDoc: '0',
                        idTipoDocumento: 0,
                        descripcion: 'NO AUTORIZADO'
                    }]
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        $scope.onChangeTipoDoc = function () {
            let dataTipoDoc = $scope.tiposDoc.find(td => td.idTipoDocumento === $scope.dataSearch.idTipoDocumento);
            $scope.showField = false;

            if (dataTipoDoc && dataTipoDoc.codDoc === DOC_TYPE.FV_SRI) {
                $scope.showField = true;
            }
            console.log('test')
        }

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate;
        }

        $scope.onChangeEstab = function () {
            let dataEstab = $scope.establecimientos.find(estab => estab.idEstablecimiento === $scope.dataSearch.idEstablecimiento);
            if (dataEstab) {
                $scope.puntosEmision = dataEstab.puntosEmision;
                $scope.dataSearch.idPuntoEmision = 0;
            } else {
                $scope.puntosEmision = [];
                $scope.dataSearch.idPuntoEmision = 0;
            }
        }


        $scope.onKeyupCliente = function () {
            console.log($scope.cliente)
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.identificacion = null;

            }
        }

        $scope.onSelectCliente = function (data) {
            console.log(data)
            $scope.dataSearch.identificacion = data.numeroIdentificacion;

        }


        $scope.onKeyupUser = function () {
            console.log($scope.cliente)
            if (!$scope.cliente.nombreUser) {
                $scope.dataSearch.idUsuario = 0;
            }
        }

        $scope.onSelectUser = function (data) {
            $scope.dataSearch.idUsuario = data.idUsuario;

        }

        $scope.getReportPDF = function () {
            format = 'pdf';
            getReport();
        }
        $scope.getReportEXCEL = function () {
            format = 'excel';
            getReport();
        }

        const dataReporte = {
            [DOC_TYPE.FV_SRI]: {
                tipo: 2,
                codigo: CODE_REPORT.FEG
            },
            [DOC_TYPE.NC_SRI]: {
                tipo: 3,
                codigo: CODE_REPORT.NCRG
            }
        }

        function getReport() {
            try {
                // if (!($scope.dataSearch.idTipoDocumento > 0)) {
                //     tS.toastr('warning', 'Seleccione el Tipo Documento');
                //     return
                // }
                if ($scope.dataSearch.checkBoxCustomer && !fS.isValidField($scope.dataSearch.identificacion)) {
                    tS.toastr('warning', 'Seleccione el Cliente');
                    return
                }
                if ($scope.dataSearch.checkBoxUser && !fS.isValidField($scope.dataSearch.idUsuario)) {
                    tS.toastr('warning', 'Seleccione el Usuario');
                    return
                }
                let dataEstab = $scope.establecimientos.find(estab => estab.idEstablecimiento === $scope.dataSearch.idEstablecimiento);
                let dataEstado = $scope.estadosDoc.find(estado => estado.idEstadoDocumento === $scope.dataSearch.idEstadoDocumento);
                let { codDoc } = $scope.tiposDoc.find(item => item.idTipoDocumento === $scope.dataSearch.idTipoDocumento)

                let getDataReport = dataReporte[codDoc]
                let dataParams = {
                    tipo: getDataReport.tipo,
                    ckFecha: true,
                    codDoc,
                    codEstab: dataEstab && dataEstab.codEstab || null,
                    idCliente: $scope.dataSearch.idCliente,
                    codEstado: dataEstado && dataEstado.codigo || null,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    identificacion: $scope.dataSearch.checkBoxCustomer ? fS.isValidField($scope.dataSearch.identificacion) : null,
                    idUsuario: $scope.dataSearch.checkBoxUser ? fS.isValidField($scope.dataSearch.idUsuario) : null
                }
                const parameters = {
                    hasIdUsuarioRol: true,
                    reportParams: JSON.stringify({
                        hasParams: false,
                        codigo: getDataReport.codigo,
                        format,
                        aditionalParams: [],
                    }),
                    dataParams: JSON.stringify(dataParams),
                }
                commonSvc.getReport({
                    parameters,
                    formatType: format
                })
            } catch (error) {
                console.log(error)
            }

        }

    }

})(window.angular)