(function () {

    'use strict';

    app.controller('comprobanteEgresoCtrl', comprobanteEgresoCtrl);

    comprobanteEgresoCtrl.$inject = ['$scope', '$injector'];
    function comprobanteEgresoCtrl($scope, $injector) {
        let comprobanteEgresoSvc = $injector.get('comprobanteEgresoService');
        let commonSvc = $injector.get('commonService');
        let fS = $injector.get('formulario');

        $scope.recordsQuantity = [25, 50, 100];

        $scope.moreSearchOptions = false;

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            checkBoxFecha: true,
            totalRecords:0,
            maxSize: 5
        }

        $scope.establecimientos = [];
        $scope.comprobantesEgreso = [];

        $scope.proveedor = {};
        $scope.searchEmpleado = {};

        initLoad();
        function initLoad() {

            showLoader();
            comprobanteEgresoSvc.getDataFilter().then(response => {
                if (response) {
                    $scope.establecimientos = response.estabs;
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => estab.defaultEstab);
                        if (dataEstab) {
                            $scope.dataSearch.codEstab = dataEstab.codEstab;
                        }
                    }
                }
                getComprobantesEgreso();
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader());
        }

        function getComprobantesEgreso() {
            try {

                let params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: fS.isValidField($scope.dataSearch.codEstab),
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    byEstado: [0, 1].includes($scope.dataSearch.byEstado) ? $scope.dataSearch.byEstado : null,
                    byPersona: [1, 2].includes($scope.dataSearch.byTipoPersona) ? fS.isValidField($scope.dataSearch.byPersona) : null,
                    byUsuario: fS.isValidField($scope.dataSearch.byUsuario)
                }

                showLoader();
                comprobanteEgresoSvc.getAll(params).then(response => {
                    $scope.comprobantesEgreso = response; 
                    if($scope.comprobantesEgreso.length>0){
                        $scope.dataSearch.totalRecords = $scope.comprobantesEgreso[0].totalRecords || 0;
                    }
                }).catch(error=>{
                    console.log(error)
                }).finally(()=>hideLoader());
            } catch (error) {
                console.log(error)
            }
        }

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            getComprobantesEgreso();
        }

        $scope.refresh = function () {
            getComprobantesEgreso();
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions
        }

        $scope.onKeyupProveedor = function () {
            if (!$scope.proveedor.nombreProveedor) {
                $scope.dataSearch.byPersona = null;
                $scope.dataSearch.checkBoxFecha = true;
            }
        }
        $scope.onSelectProveedor = function (item) {
            $scope.dataSearch.byPersona = item.numeroIdentificacion;
            $scope.dataSearch.checkBoxFecha = true;
            getComprobantesEgreso();
        }

        //====================Empleado===========
        $scope.onKeyupEmpleado = function () {
            if (!$scope.searchEmpleado.nombreCompleto) {
                $scope.dataSearch.byPersona = null;
            }
        }
        $scope.onSelectEmpleado = function (item) {
            $scope.dataSearch.byPersona = item.nroIdentificacion;
            getComprobantesEgreso();
        }
        //====================Empleado===========

        $scope.onKeyupUser = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.onSelectUser = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            getComprobantesEgreso();
        }

        $scope.pagechanged = function () {
            getComprobantesEgreso();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            getComprobantesEgreso();
        };




        $scope.askToCancel = function (item) {
            try {
                Swal.fire({
                    icon: 'warning',
                    html: '<small>Esta seguro/a de Anular este registro de pago ahora?</small>',
                    input: 'text',
                    inputPlaceholder: 'Ingrese la observación',
                    showConfirmButton: true,
                    confirmButtonText: 'Sí, anular',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar!',
                    allowOutsideClick: false,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Ingrese la Observación!'
                        }
                        if (value.length <= 8) {
                            return 'La observación tiene que tener al menos 10 caracteres!'
                        }
                    }
                }).then(result => {
                    if (result.isConfirmed) {
                        try {
                            showLoader();
                            comprobanteEgresoSvc.anular(item.idComprobanteEgreso, result.value).then(response => {
                                if (response.code == "0") {
                                    fS.sweetAlert('warning', response.message, response.titleSms)
                                }
                                if (response.code == "1") {
                                    fS.sweetAlert('success', response.message, response.titleSms, 1000)
                                    getComprobantesEgreso();
                                }
                            }).catch(error => {
                                console.log(error);
                            }).finally(() => {
                                hideLoader();
                            })
                        } catch (error) {
                            hideLoader();
                            console.log(error)
                        }
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }


        $scope.getReport = async (item) => {
            const formatType = 'pdf';
            let dataParams = JSON.stringify({
                codEstab: item.codEstab,
                id: item.idComprobanteEgreso
            })

            const parameters = {
                hasService: true,
                reportParams: JSON.stringify({
                    codEstab: item.codEstab,
                    codigo: "RCEGR",
                    format: formatType,
                    aditionalParams: []
                }),
                dataParams
            }

            commonSvc.getReport({
                parameters,
                formatType
            })
        }

    }




})(window.angular)