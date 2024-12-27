//@ts-check
(function () {

    'use strict';

    app.controller('comprobanteIngresoCtrl', comprobanteIngresoCtrl);

    comprobanteIngresoCtrl.$inject = ['$scope',   '$injector']

    function comprobanteIngresoCtrl($scope,  $injector) { 
        let fS = $injector.get('formulario');
        let tS = $injector.get('toastService');
        let compIngresoSvc = $injector.get('comprobanteIngresoService');


        //Filtro y Pagination  
        $scope.moreSearchOptions = false;  

        $scope.searchCliente = {
            nombreCliente: ''
        } 

        $scope.searchUser = {
            nombreCompleto: ''
        }

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 25,
            maxSize: 5
        }
        $scope.recordsQuantity = [25, 50, 100];

        $scope.typeSend = 'GenericFile';
        $scope.typeSendMail = 'N';

        $scope.resultRangeFilter = resultRangeFilter;
        $scope.onKeyupUser = onKeyupUser;
        $scope.onSelectUser = onSelectUser;
        $scope.onClickBtnMore = onClickBtnMore; 
        $scope.onKeyupCliente = onKeyupCliente;
        $scope.onSelectCliente = onSelectCliente;
        $scope.refresh = refresh;
        $scope.getCobros = getCobros; 



        //Filters 
        function resultRangeFilter(item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
            refresh()
        }

        function onKeyupUser() {
            if (!$scope.searchUser.nombreCompleto) {
                $scope.dataSearch.byUsuario = 0;
            }
        }
        function onSelectUser(item) {
            $scope.dataSearch.byUsuario = item.idUsuario;
            refresh()
        }



        function onClickBtnMore() {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        }
 

        //====================Cliente===========
        function onKeyupCliente() {
            if (!$scope.searchCliente.nombreCompleto) {
                $scope.dataSearch.nroIdentificacion = null;
            }
        }
        function onSelectCliente(item) {
            $scope.dataSearch.nroIdentificacion = item.numeroIdentificacion;
            getCobros();
        }



        function setTotalsColumn() {
            let total = 0, abono = 0, cambio = 0;
            for (let item of $scope.cobros) {
                total += item.total;
                abono += item.abono;
                cambio += item.cambio;
            }
            $scope.total = fS.roundNumber(total);
            $scope.abono = fS.roundNumber(abono);
            $scope.cambio = fS.roundNumber(cambio);
        }

        function refresh() {
            getCobros();
        }


        function getCobros() {
            try {
                $scope.cobros = [];
                $scope.cloneCobros = [];
                setTotalsColumn();

                let isSearchDate = true;

                if (fS.isValidField($scope.dataSearch.nroIdentificacion)) {
                    isSearchDate = false;
                }

                if (fS.isValidField($scope.dataSearch.nroSecuencialDoc)) {
                    isSearchDate = false;
                    tS.toastr({
                        type: 'info',
                        message: 'Buscando por número secuencial'
                    })
                }

                const dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    
                    nroIdentificacion: fS.isValidField($scope.dataSearch.nroIdentificacion),
                    checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                    byUsuario: $scope.dataSearch.byUsuario,
                    checkBoxEstado: [0, 1].includes($scope.dataSearch.byEstado),
                    byEstado: $scope.dataSearch.byEstado,
                    codTipoDoc: $scope.dataSearch.codTipoDoc,
                    nroSecuencialTipoDoc: $scope.dataSearch.nroSecuencialTipoDoc,
                    isSearchNroDoc: $scope.dataSearch.nroSecuencialDoc ? true : false,
                    nroSecuencialDoc: $scope.dataSearch.nroSecuencialDoc,
                    isSearchDate,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize
                } 
                compIngresoSvc.getAll(dataSearch).then(response => {
                    $scope.cobros = response;
                    $scope.cloneCobros = structuredClone(response)
                    setTotalsColumn();

                    if ($scope.cobros.length > 0) {
                        $scope.dataSearch.totalRecords = $scope.cobros[0].totalRecords;

                    }

                }).catch(error => {
                    console.log(error)
                }) 
            } catch (error) { 
                console.log(error)
            }
        }

        initialLoad();
        function initialLoad() {
            compIngresoSvc.getDataFilter().then(response => { 
                $scope.establecimientos = response.estabs;
                let dataEstab = $scope.establecimientos.find(e => e.defaultEstab);
                if (dataEstab) {
                    $scope.dataSearch.codEstab = dataEstab.codEstab;
                    $scope.dataSearch.idEstablecimiento = dataEstab.idEstablecimiento;
                }
                getCobros();
            })

            compIngresoSvc.getPosfechadoCobrosModal()
        }

        $scope.pagechanged = function () {
            $scope.getCobros();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getCobros();
        };
 
        $scope.getParamToSendMail = function (item) {
            return {
                codDoc: 'CI',
                serieComprobante: item.nroDoc,
                correo: item.correo,
                subject: 'Acontplus - Comprobante de Cobro N°: ' + item.nroDoc,
                json: {
                    hasFile: true,
                    isReport: "SI",
                    reportParams: {
                        hasParams: true,
                        codEstab: item.codEstab,
                        codigo: "RCINGR",
                        format: "pdf"
                    },
                    spParams: {
                        id: item.idComprobanteIngreso
                    }
                }
            }
        }
 

    }



})(window.angular)