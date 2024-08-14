//@ts-check
(function () {

    'use strict';

    app.controller('chequeCtrl', chequeCtrl);
    chequeCtrl.$inject = [
        '$scope',
        '$injector', 
    ];

    function chequeCtrl($scope, $injector) {
        const controlCajaSvc = $injector.get('controlCajaService');
        const comprobanteEgresoSvc = $injector.get('comprobanteEgresoService');
        const comprobanteIngresoSvc = $injector.get('comprobanteIngresoService');
        const fS = $injector.get('formulario');
        const commonSvc = $injector.get('commonService');


        $scope.recordsQuantity = [25, 50, 100];

        $scope.moreSearchOptions = false;

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            checkBoxDate: true,
            totalRecords: 0,
            maxSize: 5, 
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

        $scope.resultRangeFilter = resultRangeFilter;
        $scope.refresh = refresh;
        $scope.onClickBtnMore = onClickBtnMore;

        initLoad();
        function initLoad() {
            try {
                controlCajaSvc.getDataFilter().then(response => {
                    console.log(response)
                    if (response) {
                        $scope.establecimientos = response.estabs;
                        if ($scope.establecimientos.length > 0) {
                            let dataEstab = $scope.establecimientos.find(estab => estab.predeterminado);
                            if (dataEstab) {
                                $scope.dataSearch.idEstablecimiento = dataEstab.idEstablecimiento;
                            }
                        }
                    }
                    console.log($scope.dataSearch)
                    getCheques();
                }).catch(error => {
                    console.log(error)
                })
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
                    idEstablecimiento: $scope.dataSearch.idEstablecimiento,
                    checkBoxDate: $scope.dataSearch.checkBoxDate,
                    dateStart: fS.formatDateMoment($scope.dataSearch.dateStart),
                    dateEnd: fS.formatDateMoment($scope.dataSearch.dateEnd),
                    byPosfechado: $scope.dataSearch.posfechado
                }
                controlCajaSvc.getAll(params).then(response => {
                    $scope.cheques = response.cheques;
                }).catch(error => console.log(error))
            } catch (error) {
                console.log(error)

            }
        }

        function resultRangeFilter(item) {
            $scope.dataSearch.dateStart = item.startDate;
            $scope.dataSearch.dateEnd = item.endDate;
            getCheques();
        }

        function refresh() {
            getCheques();
        }

        function onClickBtnMore() {
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



        const esComprobanteIngreso = item=>item.codDoc==='CI';
        const esComprobanteEgreso = item=>item.codDoc==='CE';


        //Guardar Cheques Cobro/Pago
        $scope.askToSaveCheck = async function (item)  {
            let tipoCheque = esComprobanteIngreso(item) ? 'Cobro Cheque' : 'Pago Cheque'; 

            let responseApi = {};

            if (esComprobanteIngreso(item)){
                responseApi = await comprobanteIngresoSvc.getDataForDelete(item.idComprobante);
            }

            if (esComprobanteEgreso(item)){
                responseApi = await comprobanteEgresoSvc.getDataToDelete(item.idComprobante); 
            }

            console.log(responseApi)


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