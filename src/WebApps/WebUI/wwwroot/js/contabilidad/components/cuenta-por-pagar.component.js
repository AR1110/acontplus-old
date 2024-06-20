let templateUrl = `/Home/Index?name=~/Pages/Contabilidad/Components/_CuentaPorPagarComponent.cshtml`;

app.component("app-cuenta-por-pagar", {
    templateUrl,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
        isNotModal:'='
    },
    controller: ['$scope', '$injector', '$timeout', function ($scope, $injector, $timeout) {
        let $ctrl = this;

        const tS = $injector.get('toastService');
        const sS = $injector.get('screenSize');
        const modalSvc = $injector.get('modalService');
        const fS = $injector.get('formulario');
        const cuentaPorPagarSvc = $injector.get('cuentaPorPagarService');
        const nombreModalContabilidad = $injector.get('nombreModalContabilidad');
        const mainPaths = $injector.get('mainPaths');
     

        $ctrl.$onInit = function () {
           // $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = {
                
            };
            console.log(this)
            $scope.isNotModal = typeof $ctrl.resolve === 'object' ? true : false;
        };






        

        $scope.establecimientos = [];
        $scope.estadosDoc = [];

        $scope.recordsQuantity = [25, 50, 100]

        const selectedDocumentosTemp = [];

        $scope.isMobile = sS.on('xs, sm', function (isMatch) {
            $scope.isMobile = isMatch
        })

        if ($scope.isMobile) {
            Swal.fire(
                'Dispositivo Movil Detectado!',
                'Para una mejor comodidad, le recomendamos usar una Laptop o PC.',
                'success'
            )
        } else {
            $timeout(() => {
                document.getElementById('menu_toggle').click()
            }, 1100)
        }

        $scope.moreSearchOptions = false;
        $scope.dataSearch = {
            checkBoxFecha: true,
            pageIndex: 1,
            pageSize: 25,
            maxSize: 5,
            secuencial: null,
            typeSearchNro: 1
        }


        $scope.tipoDocumentos = [
            // { codigo: '03', descripcion: 'LIQUIDACION COMPRA' },
            // { codigo: 'FC', descripcion: 'FACTURA' },
            // { codigo: 'DH', descripcion: 'DOCUMENTO NO HABITUAL' },
        ];
        $scope.typesSearchNro = [
            { code: 1, description: 'Ninguna' },
            { code: 2, description: 'Retención' },
            { code: 3, description: 'Nota Crédito' },
        ]

        $scope.cuentasPorPagar = [];
        $scope.selectedDocumentos = [];
        $scope.proveedor = {};

        $scope.tableOptions = {
            sortBy: '',
            rowSelection: true,
            multiSelect: true
        };

        let isCheckedDoc = false;

      
        $scope.getCuentasPorPagar = () => {
            try {

                let checkboxFecha = $scope.dataSearch.checkBoxFecha;

                if (fS.isValidField($scope.dataSearch.secuencial)) {
                    if (!fS.isNumber($scope.dataSearch.secuencial)) {
                        tS.toastr('warning', 'Secuencial tiene que ser un número válido')
                        return
                    }
                    checkboxFecha = false;
                    tS.toastr('info', 'Buscando por Nro. Secuencial')
                }

                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    checkboxFecha,
                    codEstado: fS.isValidField($scope.dataSearch.codEstado),
                    codDoc: fS.isValidField($scope.dataSearch.codDoc),
                    idProveedor: fS.isValidField($scope.dataSearch.idProveedor),
                    dateStart: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    dateEnd: fS.formatDateMoment($scope.dataSearch.fechaFin),
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    secuencial: fS.isValidField($scope.dataSearch.secuencial),
                    typeSearchNro: $scope.dataSearch.typeSearchNro
                }

                $scope.cuentasPorPagar = [];
                $scope.selectedDocumentos = [];
                isCheckedDoc = false;

                showLoader();
              
                cuentaPorPagarSvc.getAll(dataSearch).then(response => {
                    $scope.cuentasPorPagar = response; 


                    if ($scope.cuentasPorPagar.length > 0) {
                        $scope.dataSearch.totalRecords = $scope.cuentasPorPagar[0].totalRecords;
                    }
                }).catch((error) => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        initLoad();
        function initLoad() {
            try {
                showLoader();
                cuentaPorPagarSvc.getDataFilter().then(response => {
                    const {
                        estabs,
                        estadosDoc,
                        tiposDoc
                    } = response;
                    $scope.establecimientos = estabs;
                    $scope.estadosDoc = estadosDoc;
                    $scope.tipoDocumentos = tiposDoc || []

                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(item => item.defaultEstab);
                        $scope.dataSearch.codEstab = dataEstab.codEstab;
                        $scope.getCuentasPorPagar();
                    }
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {
                console.log(error)
            }
        }

        //----------------------------------------------FILTROS ----------------------------------------
        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate;
            $scope.dataSearch.fechaFin = item.endDate;
            $scope.getCuentasPorPagar();
        };



        $scope.onKeyupProveedor = function () {
            if (!$scope.proveedor.nombreProveedor) {
                $scope.dataSearch.idProveedor = 0;
            }
        };
        $scope.onSelectProveedor = function (item) {
            $scope.dataSearch.idProveedor = item.idProveedor;
            $scope.getCuentasPorPagar();
        };

        $scope.onClickBtnMore = function () {
            $scope.moreSearchOptions = !$scope.moreSearchOptions;
        };

        $scope.pagechanged = function () {
            $scope.getCuentasPorPagar();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getCuentasPorPagar();
        };
        //==========================END FILTERS===================================

        $scope.rowEnabledPayment = function (item) {
            return !(["PP", "PE"].includes(item.codEstado));
        }



        $scope.onDesSelectDoc = function (item) {
            isCheckedDoc = false;
            let index = selectedDocumentosTemp.indexOf(item);
            selectedDocumentosTemp.splice(index, 1);
        }

        $scope.onSelectDoc = function () {
            isCheckedDoc = true;
        }

        function getDocsBySupplierId(idProveedor) {

            cuentaPorPagarSvc.getDataFormaPago(idProveedor).then(response => {
                let docs = response.docs;
                if (docs.length === 0) return;


                for (let item of docs) {
                    item.isDocRelacionado = $scope.selectedDocumentos.some(sd => sd.numAutDocSustento === item.numAutDocSustento);
                }

                modalSvc.open({
                    controller: ["$uibModalInstance", "$scope", "params", function ($uibModalInstance, $scope, params) {
                        const { docs } = params;

                        $scope.docs = docs;

                        $scope.closeModal = function () {
                            $uibModalInstance.close();
                        }
                    }],
                    template: `${mainPaths.cuenta_por_pagar_view}Shared/_ModalDocRelacionado.cshtml`,
                    size: 'xl',
                    params: {
                        docs
                    }
                })
            })

        }

        $scope.$watch('selectedDocumentos', function (newItems) {
            if (newItems.length === 0 || !isCheckedDoc) return

            if (!verificarProveedorIgual()) return;

            let idProveedor = $scope.selectedDocumentos[0].idProveedor;
            getDocsBySupplierId(idProveedor);

        }, true);



        // Función para verificar si los valores de razonSocialComprador son los mismos
        function verificarProveedorIgual() {
            const firstCustomerId = $scope.selectedDocumentos[0].idProveedor;

            // Verificar si todas las demás entradas tienen la misma idProveedor
            const sonIguales = $scope.selectedDocumentos.every(cuenta => cuenta.idProveedor === firstCustomerId);

            return sonIguales;
        }

        function mergeCuotas(selectedDocumentos, results) {
            return selectedDocumentos.map(cxc => {
                const [cuotasFiltradas] = results.filter(item =>
                    item.some(cuota => cuota.idCuentaPorPagar === cxc.idCuentaPorPagar)
                )
                return {
                    ...cxc,
                    saldoTemporal: cxc.saldo,
                    cuotas: structuredClone(cuotasFiltradas),
                    cloneCuotas: structuredClone(cuotasFiltradas)
                };
            });
        }

        $scope.openDocPaymentModal = function () {
            if ($scope.selectedDocumentos.length === 0) {
                tS.toastr('warning', 'Seleccione al menos un documento!');
                return
            }

            if (!verificarProveedorIgual()) {
                tS.toastr('warning', 'Seleccione documentos que pertenezca al mismo proveedor');
                return
            }

            const selectedDocumentos = structuredClone($scope.selectedDocumentos);
            // Crear un array de promesas para cada solicitud
            const promises = selectedDocumentos.map(cxc => cuentaPorPagarSvc.getCuotasById(cxc.idCuentaPorPagar));

            // Utilizar Promise.all para ejecutar las promesas concurrentemente
            showLoader();
            Promise.all(promises)
                .then(results => {
                    hideLoader();
                    let mergeWithCuotas = mergeCuotas(selectedDocumentos, results);
                    if (mergeWithCuotas.some(item => !item.cuotas || item.cuotas.length === 0)) {
                        tS.toastr('warning', 'Algunos de los documentos seleccionados no tiene cuotas');
                        return
                    }
                    openModalCobroLote(mergeWithCuotas);
                })
                .catch(error => {
                    console.error('Al menos una solicitud falló:', error);
                    // Manejar el error
                }).finally(() => hideLoader());

        }

        async function openModalCobroLote(selectedDocumentos) {
            try {
                let fileCtrl = nombreModalContabilidad.PAGO.fileCtrl;
                let ctrl = nombreModalContabilidad.PAGO.controllers['MPL'];
                let template = nombreModalContabilidad.PAGO.templates['MPL'];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.open({
                    controller,
                    template,
                    params: {
                        data: selectedDocumentos[0],
                        selectedDocumentos
                    },
                    size: 'xl',
                    isRenderRazorPartial: true
                })
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.getCuentasPorPagar();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }


        //-------------------------------------PAGO ----------------------------
        $scope.openModalPagoLote = () => {
            if ($scope.dataSearch.codEstab !== 'ALL' && $scope.dataSearch.idProveedor > 0 && $scope.options.rowSelection && $scope.selectedDocumentos.length > 0) {

                let modalParams = {
                    controller: 'modalPagoCtrl',
                    template: `${mainPaths.cuenta_por_pagar_view}Shared/_ModalPago.cshtml`,
                    size: 'xl',
                    //  windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }


                modalParams.params = {
                    data: $scope.selectedDocumentos[0],
                    selectedDocumentos: $scope.selectedDocumentos,
                }

                //Open Modal 
                let modalRef = modalSvc.open(modalParams)
                modalRef.result.then(result => {
                    if (typeof result === 'object') {
                        $scope.selectedDocumentos = [];
                        $scope.getCuentasPorPagar();
                    }
                })


            } else {

                fS.sweetAlert(
                    'info',
                    `<div class="text-left">
                        Para realizar Pago por Lote realice lo siguiente: 
                        <ol>
                            <li value="01">Seleccione el Establecimiento.</li>                            
                            <li>Seleccione el Proveedor</li>                            
                            <li>Seleccione los documentos <span class="text-danger"><b>pendientes</b></span> </li>                    
                        </ol>
                    </div>`
                )
            }
        }


        //Obtenemos las cuotas
        $scope.getCuotaCuentaPorPagar = (item) => {
            //Params APi 
            let spParams = JSON.stringify({
                idCuentaPorPagar: item.idCuentaPorPagar,
                codPago: 'PE',
                tipo: 2
            })


            return _mS.getData('get', 'Contabilidad/CuentaPorPagar?json=' + spParams, null, true);
        }


        $scope.selectedRow = (item) => {
            try {
                $scope.proveedor = {
                    idProveedor: item.idProveedor
                }

                showLoader();


                $scope.getCuotaCuentaPorPagar(item).then(response => {

                    if (response.code === "0") {
                        hideLoader();
                        $scope.deleteDocSeleted(item);
                    }

                    if (response.code === "1") {
                        item.cuotas = JSON.parse(response.payload)[0] || [];
                        hideLoader();
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })


            } catch (error) {
                $scope.deleteDocSeleted(item);
                hideLoader();
                console.log(error)
            }

        }

        $scope.deleteDocSeleted = (item) => {
            let index = $scope.selectedDocumentos.indexOf(item);
            $scope.selectedDocumentos.splice(index, 1);
        }

        //======================================MODAL CUOTA================================================ 
        $scope.openModalCuota = async (item) => {
            try {

                let modalParams = {
                    controller: 'modalCuotaCtrl',
                    template: `${mainPaths.cuenta_por_pagar_view}Shared/_ModalCuota.cshtml`,
                    size: 'xl',
                    isRenderRazorPartial: true
                }

                showLoader();
                cuentaPorPagarSvc.getCuotas(item.idCuentaPorPagar).then(response => {
                    modalParams.params = {
                        cuotas: response,
                        data: {
                            ...item,
                            id: item.idCuentaPorPagar,
                            codPago: item.codEstado,
                            numeroIdentificacion: item.identificacionComprador
                        },
                    }

                    let modalRef = modalSvc.open(modalParams);
                    modalRef.result.then(res => {
                        if (res !== null && typeof res === 'object') {
                            initLoad();

                        }
                    })
                    hideLoader()
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }

        $scope.openModalHistorialMov = (item) => {
            try {

                let modalParams = {
                    template: `${mainPaths.cuenta_por_pagar_view}Shared/_ModalHistorialPago.cshtml`,
                    controller: 'historialMovimientoCtrl',
                    size: 'xl', 
                }
                showLoader();
                cuentaPorPagarSvc.getHistorialPago(item.idCuentaPorPagar).then(response => {
                    if (response.length === 0) {
                        tS.toastr('warning', 'No tiene historial de movimientos')
                        return
                    }
                    modalParams.params = {
                        data: item,
                        historialMovimientos: response
                    }
                    modalSvc.openModalCustom(modalParams)
                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader());
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }














 

        $ctrl.ok = function () {
            $ctrl.close({$value: $ctrl.selected.item});
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }]
});