(function() {

    'use strict';

    let URL_TEMPLATE = '~/Areas/Factura/Pages/Shared/'

    let commonSvc = {};
    let ventaSvc = {};
    let facturaSvc = {};
    let clienteSvc = {};
    let fS = {};
    let tS = {};

    let mainDataForm = {};

    app.controller('facturaCtrl', facturaCtrl);

    facturaCtrl.$inject = ['$scope', '$injector', 'modalService'];

    function facturaCtrl($scope, $injector, modalSvc) {
     
        commonSvc = $injector.get('commonService');
        ventaSvc = $injector.get('ventaService');
        facturaSvc = $injector.get('facturaService');
        clienteSvc = $injector.get('clienteService');
        fS = $injector.get('formulario');
        tS = $injector.get('toastService');
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10
        };

        $scope.openModalNew = function() {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: 'ModalFacturaCtrl',
                    template: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
                    params: {},
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })

                modalRef.result.then(result => {
                    if(typeof result === 'object'){
                        $scope.getGuiasRemision();
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }

        //========================Start Filters=================

        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
            $scope.dataSearch.fechaFin = item.endDate
            $scope.getGuiasRemision();
        }

        $scope.clienteSearch = function (textSearch) {
            let query = {
                textSearch
            }

            if (textSearch.length > 2) {
                return clienteSvc.search(query).catch(error => {
                    console.log(error)
                })
            }
        }

        $scope.onKeyupClienteSearchFiltro = function () {
            if (!$scope.modelTextSearch) {
                $scope.dataSearch.byCliente = 0;
            }
        }

        $scope.selectedClienteSearchFiltro = function (item) {
            $scope.dataSearch.byCliente = item.idCliente;
            $scope.getGuiasRemision();
        }

        $scope.usuarioSearch = function (textSearch) {
            try {
                let query = {
                    idRol: idUsuarioRol,
                    busqueda: textSearch
                }
    
                if (query.busqueda.length > 2) {
                    return commonSvc.usuarioSearch(query)
                        .catch(error => {
                            console.log(error);
                            throw error;
                        })
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.onKeyupUsuarioSearch = function () {
            if (!$scope.modelNombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }

        $scope.selectedUsuarioSearch = function (item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
        }

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }

        $scope.searchFilterLocal = function () {
            let guiasRemision = JSON.parse(JSON.stringify($scope.cloneGuiasRemision));
            $scope.guiasRemision = $filter("filter")(guiasRemision, $scope.dataSearch.bySearch);
            
        }

        //=====================Eend Filters=======================

        $scope.getTotales = () => {
            let total = 0,
                totalAbono = 0,
                totalSaldo = 0;
            for (let val of $scope.facturas) {
                if (val.estadoFinanciero !== 'Anulada') {
                    total += val.total;
                    totalAbono += val.abono;
                    totalSaldo += val.saldo;
                }
            };
            $scope.total = fS.roundNumber(total, 5);
            $scope.totalAbono = fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = fS.roundNumber(totalSaldo, 5);
        }
    

        $scope.getFacturas = function() {
            try {
                showLoader();
                $scope.facturas = [];
                $scope.cloneFacturas = [];

                let query = {
                    codEstab: $scope.dataSearch.codEstab,                 
                    checkBoxCustomer: $scope.dataSearch.byCliente > 0,
                    byCustomer: $scope.dataSearch.byCliente,
                    checkBoxDate: true,
                    checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                    byUsuario: $scope.dataSearch.byUsuario,
                    checkBoxStatus: $scope.dataSearch.codEstado ? true : false,
                    codEstado: $scope.dataSearch.codEstado,
                    dateStart: fS.formatDateTimeZone($scope.dataSearch.fechaInicio),
                    dateEnd: fS.formatDateTimeZone($scope.dataSearch.fechaFin)
                }
                $scope.getTotales();
                facturaSvc.getAll(query).then(response => {
                    hideLoader();
                    $scope.facturas = response;
                
                    $scope.cloneFacturas = JSON.parse(JSON.stringify($scope.facturas));
                    $scope.getTotales();
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }
        
        $scope.initiload  = function () {
            showLoader();
            ventaSvc.getDataForm({ typeList: 1 }).then((response) => {
                mainDataForm = response;
                $scope.establecimientos = mainDataForm.establecimientos;
                
                $scope.dataSearch.codEstab = $scope.establecimientos[0].codEstab;
                $scope.getFacturas();
            }).catch((errorResponse) => {
                hideLoader();
                console.log(errorResponse);
            });

            commonSvc.getEstadoDocByCodDoc('PRE').then(response => {
                $scope.estadoDocumentos = response;
            })
        }
        $scope.initiload();

    }




    app.controller('ModalFacturaCtrl', ModalFacturaCtrl);

    ModalFacturaCtrl.$inject=['$scope', '$uibModalInstance', 'params'];

    function ModalFacturaCtrl($scope, $uibModalInstance, params) {

    }



})(window.angular)