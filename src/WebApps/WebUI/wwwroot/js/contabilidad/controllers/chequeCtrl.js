(function () {

    'use strict';

    app.controller('chequeCtrl', chequeCtrl);
    chequeCtrl.$inject = ['$scope', 'chequeService', 'comprobanteEgresoService', 'formulario', 'commonService'];

    function chequeCtrl($scope, chequeSvc, comprobanteEgresoSvc, fS, commonSvc) {


        $scope.recordsQuantity = [25, 50, 100];

        $scope.moreSearchOptions = false;

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            checkBoxFecha: true,
            totalRecords: 0,
            maxSize: 5,
            tipo: 0
        }

        $scope.establecimientos = [];
        $scope.cheques = [];
        $scope.proveedor = {};
        $scope.cliente = {};

        $scope.tipos = [
            { id: 0, descripcion: 'Todos' },
            { id: 1, descripcion: 'Pagos' },
            { id: 2, descripcion: 'Cobros' }
        ];

        initLoad();
        function initLoad() {
            try {
                showLoader();
                chequeSvc.getDataFilter().then(response => {
                    if (response) {
                        $scope.establecimientos = response.estabs;
                        if ($scope.establecimientos.length > 0) {
                            let dataEstab = $scope.establecimientos.find(estab => estab.defaultEstab);
                            if (dataEstab) {
                                $scope.dataSearch.codEstab = dataEstab.codEstab;
                            }
                        }
                    }
                    getCheques();
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        function getCheques() {
            try {
                let params = {
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    codEstab: fS.isValidField($scope.dataSearch.codEstab),
                    checkBoxFecha: $scope.dataSearch.checkBoxFecha,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    byGestion: [1, 2].includes($scope.dataSearch.tipo) ? $scope.dataSearch.tipo : null,
                    byPersona: [1, 2].includes($scope.dataSearch.tipo) ? fS.isValidField($scope.dataSearch.numeroIdentificacion) : null,
                    byPosfechado: [true, false].includes($scope.dataSearch.byPosfechado) ? $scope.dataSearch.byPosfechado : null
                }
                showLoader();
                chequeSvc.getAll(params).then(response => {
                    $scope.cheques = response.cheques;
                }).catch(error => console.log(error))
                    .finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)

            }
        }

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate
            getCheques();
        }

        $scope.refresh = function () {
            getCheques();
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions
        }


        //==============Proveedor ===========
        $scope.onKeyupProveedor = function () {
            if (!$scope.proveedor.nombreProveedor) {
                $scope.dataSearch.numeroIdentificacion = null;
            }
        };
        $scope.onSelectProveedor = function (item) {
            $scope.dataSearch.numeroIdentificacion = item.numeroIdentificacion;
            getCheques();
        }

        //==================CLIENTE ==================
        $scope.onKeyupCliente = function () {
            if (!$scope.cliente.nombreCliente) {
                $scope.dataSearch.idCliente = 0;
            }
        }
        $scope.onSelectCliente = function (item) {
            $scope.dataSearch.numeroIdentificacion = item.numeroIdentificacion;
            getCheques();
        }




        //Guardar Cheques Cobro/Pago
        $scope.askToSaveCheck = async (item) => {
            let tipoCheque = item.codDoc === 'CI' ? 'Cobro Cheque' : 'Pago Cheque';

            if (item.estado.toUpperCase() === "COBRADO" || item.estado.toUpperCase() === "ANULADO") {
                Swal.fire({
                    icon: 'warning',
                    //title: 'Insumos',
                    html: '<small>Este documento ya se encuentra <strong>COBRADO/ANULADO</strong>!</small>',
                    allowOutsideClick: false
                });
                return
            }


            Swal.fire({
                icon: 'warning',
                title: `<small>Guardar ${tipoCheque}</small>`,
                html: `<small>Está seguro/a de guardar este <b>${tipoCheque}</b> del Cliente <strong>${item.persona}</strong> ahora?</small>`,
                input: 'text',
                inputPlaceholder: 'Ingrese la observación',
                showLoaderOnConfirm: true,
                preConfirm: function (text) {
                    if (!fS.isValidField(text)) {
                        Swal.showValidationMessage('Ingrese la Observación');
                        return
                    }
                    if (text.length < 5) {
                        Swal.showValidationMessage('tiene que tener al menos 15 caracteres!');
                        return
                    }
                    return text;
                },
                allowOutsideClick: () => !Swal.isLoading(),
                showConfirmButton: 'true',
                confirmButtonText: 'Si, guardar',
                showCancelButton: 'true',
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    if (item.codDoc === 'CI') {
                        let params = {
                            idCobro: item.id,
                            observacion: result.value,
                            cobro: true
                        }
                        comprobanteIngresoUpdate(params)
                    } else {
                        let params = {
                            idPago: item.id,
                            observacion: result.value,
                            pago: true
                        }
                        comprobanteEgresoUpdate(params)
                    }
                }

            })

        }

        function comprobanteEgresoUpdate(obj) {
            try {
                showLoader();
                comprobanteEgresoSvc.update(obj).then(response => {
                    if (response.code === "0") {
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        fS.sweetAlert('success', response.message, response.titleSms);
                        getCheques();
                    }
                }).catch(error => console.log(error))
                    .finally(() => hideLoader());
            } catch (error) {
                hideLoader();
                console.log(error)
            }

        }

        function comprobanteIngresoUpdate(obj) {
            try {
                showLoader();
                comprobanteEgresoSvc.update(obj).then(response => {
                    if (response.code === "0") {
                        fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        fS.sweetAlert('success', response.message, response.titleSms);
                        getCheques();
                    }
                }).catch(error => console.log(error))
                    .finally(() => hideLoader());
            } catch (error) {
                hideLoader();
                console.log(error)
            }

        }


        $scope.askToAnnulCheck = async (item) => {
            let tipoCheque = item.codDoc === 'CI' ? 'Cobro Cheque' : 'Pago Cheque';
            if (item.estado.toUpperCase() === "ANULADO") {
                Swal.fire({
                    icon: 'warning',
                    //title: 'Insumos',
                    html: '<small>Este documento ya se encuentra <strong>ANULADO</strong>!</small>',
                    allowOutsideClick: false
                });
                return
            }

            let { isConfirmed, value } = await Swal.fire({
                icon: 'warning',
                title: `<small>Anular ${tipoCheque}</small>`,
                html: `<small>Está seguro/a de anular este <b>${tipoCheque}</b> del Cliente <strong>${item.persona}</strong> ahora?</small>`,
                input: 'text',
                inputPlaceholder: 'Ingrese la observación',
                showLoaderOnConfirm: true,
                preConfirm: function (text) {
                    if (!fS.isValidField(text)) {
                        Swal.showValidationMessage('Ingrese la Observación');
                        return
                    }
                    if (text.length < 8) {
                        Swal.showValidationMessage('tiene que tener al menos 15 caracteres!');
                        return
                    }
                    return text;
                },
                allowOutsideClick: () => !Swal.isLoading(),
                showConfirmButton: 'true',
                confirmButtonText: 'Si, guardar',
                showCancelButton: 'true',
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                if (item.gestion === 1) {
                    let params = {
                        idCobro: item.id,
                        observacion: value,
                        anular: true
                    }
                    comprobanteIngresoUpdate(params)
                } else {
                    let params = {
                        idPago: item.id,
                        observacion: value,
                        anular: true
                    }
                    comprobanteEgresoUpdate(params)
                }
            }
        }

        $scope.getReport = async (item) => {
            const formatType = 'pdf'

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: "RCHE",
                    format: formatType,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify({
                    id: item.id,
                    idTipoDocumento: item.idTipoDocumento,
                    codEstab: item.codEstab
                })
            }

            commonSvc.getReport({
                parameters,
                formatType
            })
        }















    }

})(window.angular)