(function () {


    var mainPath = `/Home/Index?name=~/Pages/Contabilidad/CuentaPorCobrar/Components/`;

    app.component("appCuentaPorCobrarComponent", {
        templateUrl: `${mainPath}_CuentaPorCobrarComponent.cshtml`,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
            isNotModal: '='
        },
        controller: ['$scope', '$injector', 'decodeToken', function ($scope, $injector, decodeToken) {
            let $ctrl = this;

            const cuentaPorCobrarSvc = $injector.get('cuentaPorCobrarService');
            const comprobanteIngresoSvc = $injector.get('comprobanteIngresoService')
            const fS = $injector.get('formulario');
            const tS = $injector.get('toastService');
            const DOC_TYPE = $injector.get('DOC_TYPE');
            const modalSvc = $injector.get("modalService");
            const nombreModalContabilidad = $injector.get("nombreModalContabilidad");
            const nombreModalVenta = $injector.get("nombreModalVenta");
            let commonSvc = $injector.get('commonService');


            $scope.dataSearch = {
                pageIndex: 1,
                pageSize: 25,
                maxSize: 5,
                totalVenta: 0,
                totalAbono: 0,
                totalSaldo: 0,
                idTipoDocumento: 0,
                codDoc: 0,
                checkBoxFecha: true,
                fechaInicio: new Date(),
                fechaFin: new Date(),
                codEstado: 0,
                ckCxcVencida: false,
                convertToDoc: false
            }
            let loadFromDoc = false;

            $ctrl.$onInit = function () {

                if ($ctrl.resolve && typeof $ctrl.resolve === 'object') {
                    $scope.isNotModal = true;
                    $scope.dataSearch.idCuentaPorCobrar = $ctrl.resolve.params.idCuentaPorCobrar;
                    $scope.dataSearch.checkBoxFecha = false;
                    loadFromDoc = true;

                }
            };




            $scope.cliente = {};

            $scope.cuentasPorCobrar = [];
            $scope.recordsQuantity = [25, 50, 100]

            let selectedDocumentosTemp = [];
            $scope.selectedDocumentos = [];

            $scope.tableOptions = {
                sortBy: '',
                rowSelection: true,
                multiSelect: true
            }

            $scope.establecimientos = [];
            $scope.estadosDoc = [];
            $scope.tiposDoc = [];



            initiload();


            function initiload() {
                try {
                    showLoader();
                    cuentaPorCobrarSvc.getDataFilter().then(response => {
                        const { estabs, estadosDoc, tiposDoc } = response;
                        $scope.establecimientos = estabs;
                        $scope.estadosDoc = estadosDoc;
                        $scope.tiposDoc = tiposDoc;

                        if ($scope.estadosDoc.length > 0) {
                            let dataEstado = $scope.estadosDoc.find(e => e.codigo === "NCBR");
                            $scope.dataSearch.codEstado = dataEstado.codigo;
                        }

                        if ($scope.establecimientos.length > 0) {
                            let dataEstab = $scope.establecimientos.find(estab => estab.defaultEstab);
                            $scope.dataSearch.codEstab = dataEstab.codEstab;
                            getCuentasPorCobrar();
                        }

                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader());

                 //   comprobanteIngresoSvc.getPosfechadoCobrosModal()

                } catch (error) {
                    console.log(error)
                }
            }

            function getCodigoTipoDoc() {
                let dataDoc = $scope.tiposDoc.find(doc => doc.idTipoDocumento === $scope.dataSearch.idTipoDocumento);
                let codigo;
                if (dataDoc) {
                    if (dataDoc.codigo === DOC_TYPE.FV) codigo = DOC_TYPE.FV_SRI;
                    if (dataDoc.codigo === DOC_TYPE.NE) codigo = DOC_TYPE.NE
                }
                return codigo;
            }

            function getCuentasPorCobrar() {
                let ckFecha = $scope.dataSearch.checkBoxFecha;
                let codEstado = fS.isValidField($scope.dataSearch.codEstado);

                let secuencial = fS.isValidField($scope.dataSearch.secuencial);
                if (secuencial) {
                    ckFecha = false;
                    tS.toastr('info', 'Buscando por Nro. Secuencial')
                }
                if (loadFromDoc) {
                    codEstado = null;
                }

                let params = {
                    codEstab: $scope.dataSearch.codEstab,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    ckFecha,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    codEstado,
                    idCliente: fS.isValidField($scope.dataSearch.idCliente),
                    codDoc: fS.isValidField(getCodigoTipoDoc()),
                    ckCxcVencida: fS.isValidField($scope.dataSearch.ckCxcVencida),
                    convertToDoc: $scope.dataSearch.convertToDoc,
                    secuencial,
                    idCuentaPorCobrar: $scope.dataSearch.idCuentaPorCobrar
                }
                $scope.selectedDocumentos = [];
                $scope.cuentasPorCobrar = [];
                selectedDocumentosTemp = [];
                showLoader();
                cuentaPorCobrarSvc.getAll(params).then(response => {
                    const { cuentasPorCobrar, totalRecords, totalMora ,totalVenta, totalAbono, totalSaldo } = response;

                    $scope.cuentasPorCobrar = cuentasPorCobrar;
                    $scope.dataSearch.totalRecords = totalRecords;
                    $scope.dataSearch.totalVenta = totalVenta;
                    $scope.dataSearch.totalMora = totalMora;
                    $scope.dataSearch.totalAbono = totalAbono;
                    $scope.dataSearch.totalSaldo = totalSaldo;

                }).catch(error => {
                    console.log(error)
                }).finally(() => {
                    hideLoader()
                    $scope.dataSearch.idCuentaPorCobrar = null;
                    loadFromDoc = false;
                });
            }

            //=========================START FILTERS =======================================
            $scope.estabFilter = function () {
                let dataEstab = $scope.establecimientos.find(estab => estab.codEstab === $scope.dataSearch.codEstab);
                $scope.puntosEmision = dataEstab.puntosEmision;
                $scope.dataSearch.idPuntoEmision = $scope.puntosEmision.find(pto => (pto.defaultPtoEmi)).idPuntoEmision;
                getCuentasPorCobrar();
            }

            $scope.callGetCuentasPorCobrar = function () {
                getCuentasPorCobrar();
            }
            $scope.refresh = function () {
                getCuentasPorCobrar();
            }
            $scope.onClickMoreFilter = function () {
                $scope.dataSearch.showMoreFilter = !$scope.dataSearch.showMoreFilter;
            }

            $scope.resultRangeFilter = function (item) {
                $scope.dataSearch.fechaInicio = item.startDate;
                $scope.dataSearch.fechaFin = item.endDate;
                getCuentasPorCobrar();
            };

            //====================Cliente===========
            $scope.onKeyupCliente = function () {
                if (!$scope.cliente.nombreCliente) {
                    $scope.dataSearch.idCliente = 0;
                    $scope.dataSearch.checkBoxFecha = true;
                }
            }
            $scope.onSelectCliente = function (item) {
                $scope.dataSearch.idCliente = item.idCliente;
                $scope.dataSearch.checkBoxFecha = true;
                getCuentasPorCobrar();
            }

            $scope.pagechanged = function () {
                getCuentasPorCobrar();
            };

            $scope.changePageSize = function () {
                $scope.dataSearch.pageIndex = 1;
                getCuentasPorCobrar();
            };

            //=========================END FILTERS =======================================

            $scope.rowEnabledPayment = function (item) {
                return !(["PP", "PE"].includes(item.codEstado))
            }

            $scope.selectedRow = function (item) {

            }

            function deleteDocSeleted(item) {
                let index = $scope.selectedDocumentos.indexOf(item);
                $scope.selectedDocumentos.splice(index, 1);
            }


            $scope.onSelectDoc = function (item) {

            }


            $scope.onDesSelectDoc = function (item) {
                let index = selectedDocumentosTemp.indexOf(item);
                selectedDocumentosTemp.splice(index, 1);
            }


            // Función para verificar si los valores de razonSocialComprador son los mismos
            function verificarClienteIgual() {
                const firstCustomerId = $scope.selectedDocumentos[0].idCliente;

                // Verificar si todas las demás entradas tienen la misma idCliente
                const sonIguales = $scope.selectedDocumentos.every(cuenta => cuenta.idCliente === firstCustomerId);

                return sonIguales;
            }

            $scope.openDocPaymentModal = function () {
                if ($scope.selectedDocumentos.length === 0) {
                    tS.toastr('warning', 'Seleccione al menos un documento!');
                    return
                }

                if (!verificarClienteIgual()) {
                    tS.toastr('warning', 'Seleccione documentos que pertenezca al mismo cliente');
                    return
                }


                const selectedDocumentos = structuredClone($scope.selectedDocumentos);

                const promises = selectedDocumentos.map(cxc => comprobanteIngresoSvc.getCuotasByIdCuentaPorCobrar(cxc.idCuentaPorCobrar));


                showLoader();
                Promise.all(promises)
                    .then(results => {
                        hideLoader();
                        let mergeWithCuotas = mergeCuotas(selectedDocumentos, results);
                        openModalCobroLote(mergeWithCuotas);
                    })
                    .catch(error => {
                        console.error('Al menos una solicitud falló:', error);
                        // Manejar el error
                    }).finally(() => hideLoader());

            }

            function mergeCuotas(selectedDocumentos, results) {
                return selectedDocumentos.map(cxc => {
                    const [cuotasFiltradas] = results.filter(item =>
                        item.some(cuota => cuota.idCuentaPorCobrar === cxc.idCuentaPorCobrar)
                    )
                    return {
                        ...cxc,
                        saldoOriginal: cxc.saldo,
                        valorSaldoLectura: cxc.saldo,
                        cuotas: structuredClone(cuotasFiltradas),
                        cuotasOriginal: structuredClone(cuotasFiltradas)
                    };
                });
            }

            $scope.getReport = async (item) => {
                const formatType = 'pdf';
                let dataParams = JSON.stringify({
                    codEstab: item.codEstab,
                    id: item.idCuentaPorCobrar,
                    tipo: 5,
                    userRoleId: decodeToken.userRoleId
                })

                const parameters = {

                    reportParams: JSON.stringify({
                        hasParams: false,
                        codEstab: item.codEstab,
                        codigo: "RETC",
                        format: formatType,
                        aditionalParams: []
                    }),
                    dataParams,
                    hasService: true
                }


                commonSvc.getReport({
                    parameters,
                    formatType,
                    v2: true
                })
            }


            async function openModalCobroLote(selectedDocumentos) {
                try {
                    const { fileCtrl, ctrl, template } = nombreModalContabilidad.COBRO_LOTE;
                    let controller = (await import(fileCtrl))[ctrl];

                    let modalRef = modalSvc.open({
                        controller,
                        template,
                        params: {
                            selectedDocumentos
                        },
                        size: 'xl',
                        windowClass: 'uibModalFullScreen',
                    })
                    modalRef.result.then(result => {
                        if (result && typeof result === 'object') {
                            getCuentasPorCobrar();
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
            }


            $scope.solicitarCredito = async function (item) {
                try {
                    let { controllers, templates, fileCtrl } = nombreModalVenta.SOLICITUD_CREDITO;
                    let ctrl = controllers['MSC'];
                    let template = templates['MSC'];

                    let controller = (await import(fileCtrl))[ctrl];

                    let modalRef = modalSvc.open({
                        controller,
                        template,
                        params: {
                            data: structuredClone(item)
                        },
                        size: 'xl',
                    })
                    modalRef.result.then(result => {
                        if (typeof result === 'object') {
                            getCuentasPorCobrar();
                        }
                    })

                } catch (error) {
                    console.log(error)
                }
            }




            $ctrl.ok = function () {
                $ctrl.close();
            };

            $ctrl.cancel = function () {
                $ctrl.dismiss();
            };

        }]
    });



})()
