let mainPath = `/Home/Index?name=~/Pages/Contabilidad/CuentaPorPagar/Components/` ;

app.component("appCuentaPorPagarComponent", {
    templateUrl: `${mainPath}_CuentaPorPagarComponent.cshtml`,
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
        const DOC_TYPE = $injector.get('DOC_TYPE');
     

        $ctrl.$onInit = function () {  
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
                    }else{
                        $scope.dataSearch.totalRecords =0;
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
 
                // Filtrar las notas de crédito de los documentos
                const notasCreditoFiltered = docs.filter(d => d.codDoc === DOC_TYPE.NC_SRI);
 
              
                // Clonar los documentos seleccionados
                const devolucionesFactura = structuredClone($scope.selectedDocumentos);

                // Filtrar y mapear las facturas con retención
                const facturasRetencion = structuredClone($scope.selectedDocumentos)
                    .filter(doc => hasRelatedRetention(docs, doc))
                    .map(doc => processFacturaRetencion(doc, notasCreditoFiltered, docs));

                // Filtrar y mapear las notas de crédito por factura
                const notasCreditoFactura = notasCreditoFiltered
                    .filter(nc => hasDevolucionFactura(devolucionesFactura, nc))
                    .map(item => addSerieComprobanteFactura(item, devolucionesFactura));

               
                // Si no hay notas de crédito o facturas con retención, salir
                if (!(notasCreditoFactura.length > 0 || facturasRetencion.length > 0)) return;

                // Función para verificar si un documento tiene una retención relacionada
                function hasRelatedRetention(docs, doc) {
                   
                    return docs.some(d => d.codDoc === DOC_TYPE.R_SRI && d.numAutDocSustento === doc.numAutDocSustento);
                }

                // Función para procesar una factura con retención
                function processFacturaRetencion(doc, notasCreditoFiltered, docs) {
                    const dataDocRel = docs.find(d => d.codDoc === DOC_TYPE.R_SRI && d.numAutDocSustento === doc.numAutDocSustento);

                    const totalValorDevolucion = calculateTotalValorDevolucion(doc, notasCreditoFiltered);

                    let serieComprobanteRetencion = '';
                    let valorRetencion = 0;
                    if (dataDocRel) {
                        serieComprobanteRetencion = dataDocRel.nroDocumento;
                        valorRetencion = dataDocRel.saldo;
                    }

                    const sumaValorRetencionValorDevolucion = valorRetencion + totalValorDevolucion;
                    const valorFactRetencion = doc.importeTotal - sumaValorRetencionValorDevolucion;
 

                    return {
                        serieComprobante: doc.serieComprobante,
                        fechaEmision: doc.fechaEmision,
                        importeTotal: doc.importeTotal,
                        serieComprobanteRetencion,
                        valorRetencion,
                        totalValorDevolucion,
                        valorFactRetencion: fS.roundNumber(valorFactRetencion, 3),
                    };
                }

                // Función para calcular el total de valor de devolución de una factura
                function calculateTotalValorDevolucion(doc, notasCreditoFiltered) {
                    return notasCreditoFiltered
                        .filter(nc => nc.numAutDocSustento === doc.numAutDocSustento)
                        .reduce((acc, curr) => acc + curr.valor, 0); // Asumiendo que `curr` tiene una propiedad `valor`
                }

                // Función para verificar si hay devolución de factura
                function hasDevolucionFactura(devolucionesFactura, nc) {
                    return devolucionesFactura.some(df => df.numAutDocSustento === nc.numAutDocSustento);
                }

                // Función para agregar el número de serie del comprobante de factura a una nota de crédito
                function addSerieComprobanteFactura(item, devolucionesFactura) {
                    const dataDevolucion = devolucionesFactura.find(df => df.numAutDocSustento === item.numAutDocSustento);
                    if (dataDevolucion) {
                        item.serieComprobanteFactura = dataDevolucion.serieComprobante;
                    }
                    return item;
                }


               


                modalSvc.openWithComponent({
                    component:'appDocRelacionadoComponent',  
                    size: 'xl',
                    params: {
                        notasCreditoFactura,
                        facturasRetencion
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


app.component("appDocRelacionadoComponent", {
    templateUrl: `${mainPath}_DocRelacionadoComponent.cshtml`,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&', 
    },
    controller: ["$scope", function($scope){
        let $ctrl = this; 
        $scope.facturasRetencion = [];
        $scope.notasCreditoFactura = [];

        $scope.dataTotal = {
            importeTotal: 0, 
            valorRetencion: 0,
            totalValorDevolucion: 0,
            valorFactRetencion: 0,            
        }
        $scope.valorTotalNotaCreditoFactura=0;

        $ctrl.$onInit = function(){
            
            $scope.facturasRetencion = $ctrl.resolve.params.facturasRetencion;
            $scope.notasCreditoFactura = $ctrl.resolve.params.notasCreditoFactura;
           
            for(let item of $scope.facturasRetencion){
                $scope.dataTotal.importeTotal += item.importeTotal;
                $scope.dataTotal.valorRetencion += item.valorRetencion;
                $scope.dataTotal.totalValorDevolucion += item.totalValorDevolucion;
                $scope.dataTotal.valorFactRetencion += item.valorFactRetencion;                
            } 

            let valorTotalNotaCreditoFactura = $scope.notasCreditoFactura.reduce((acc,curr)=>acc+curr.saldo, 0);

            $scope.dataTotal.importeTotal = fS.roundNumber(item.importeTotal, 3);
            $scope.dataTotal.valorRetencion = fS.roundNumber(item.valorRetencion, 3);
            $scope.dataTotal.totalValorDevolucion = fS.roundNumber(item.totalValorDevolucion, 3);
            $scope.dataTotal.valorFactRetencion = fS.roundNumber(item.valorFactRetencion,3);

            $scope.valorTotalNotaCreditoFactura = fS.roundNumber(valorTotalNotaCreditoFactura, 3);

        }

        $ctrl.ok = function () {
            
            
            $ctrl.close( );
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss( );
        };

    }]
});



(function () {

    'use strict'; 

    //---------------------------------------------START CUOTAS----------------------------------------------------
    app.controller("modalCuotaCtrl", modalCuotaCtrl);

    modalCuotaCtrl.$inject = ["$scope", "$uibModalInstance", "$injector", "formulario", "toastService", "params"];

    function modalCuotaCtrl($scope, $uibModalInstance,$injector, fS, tS, params) {
        const cuentaPorPagarSvc = $injector.get('cuentaPorPagarService');

        let { data, cuotas } = params;

        const NUM_MAX_ROUND = 3;

        $scope.tiempoCreditos = [];

        $scope.data = Object.assign({}, data);

        $scope.cloneIdTiempoCredito = $scope.data.idTiempoCredito; //Clonamos tiempo de credito agregado al documento 
        $scope.configFecha = fS.formatDate($scope.data.fechaEmision);
        $scope.totalDiferencia = 0;
        $scope.totalCuota = $scope.data.importeTotal;


        initialLoad();
        function initialLoad() {
            showLoader();
            cuentaPorPagarSvc.getDataFormCuota().then(response => {
                $scope.tiempoCreditos = response.tiemposCredito;
            }).finally(() => hideLoader())

            $scope.cuotas = cuotas.map(item => {
                let fechaVencimiento = item.fechaVencimiento.split(" ")[0].split("/").reverse().join("/");
                item.fechaVencimiento = new Date(fechaVencimiento);
                return item;
            })
            let totalCuota = $scope.cuotas.map(val => parseFloat(val.cuota)).reduce((prev, curr) => prev + curr, 0);
            $scope.totalCuota = fS.roundNumber(totalCuota, NUM_MAX_ROUND);

        }


        //Obtenemos fecha escrita de fecha vencimiento de la cuota 
        $scope.getFechaVencimientoEscrita = (fechaVencimiento) => {
            return fS.getFechaEscritaCompleta(fechaVencimiento)
        }


        //Generar Nueva cuota 
        $scope.generarNuevaCuota = () => {
            let tiempoCredito = $scope.tiempoCreditos.find(item => item.idTiempoCredito === $scope.data.idTiempoCredito);

            Swal.fire({
                icon: 'warning',
                html: `<small>Está seguro/a de generar <h3><b>${tiempoCredito.numeroCuota} </b></h3> ${tiempoCredito.numeroCuota === 1 ? 'Cuota' : 'Cuotas'} del Comprobante <b>N°. ${$scope.data.serieComprobante}</b></small>`,
                showDenyButton: true,
                confirmButtonText: `Si, generar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(result => {
                if (result.isConfirmed) {
                    let data = {
                        idCuentaPorPagar: $scope.data.id,
                        idTiempoCredito: $scope.data.idTiempoCredito,
                        codPago: $scope.data.codPago
                    };

                    cuentaPorPagarSvc.post(data).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code == "1") {

                            fS.sweetAlert('success', response.message, response.titleSms, 1000);

                            let cuotas = response.payload ? JSON.parse(response.payload) : []

                            $scope.cuotas = cuotas.map(item => {
                                item.fechaVencimiento = fS.formatDate(item.fechaVencimiento);
                                return item
                            })

                        }
                    })
                } else {
                    $scope.data.idTiempoCredito = $scope.cloneIdTiempoCredito;
                }
            })
        }



        //Fin de Mes => 1
        //Mismo dia => 0
        $scope.getConfigFechaCuota = (validacion) => {
            try {
                if (!$scope.configFecha) {
                    fS.sweetAlert('warning', 'Fecha Inválida', 'Configuración de Fecha');
                    return
                }
                if ($scope.configFecha.getFullYear().toString().length !== 4) {
                    fS.sweetAlert('warning', 'El Formato del Año es incorrecto', 'Configuración de Fecha');
                    return
                }

                if (!validacion && $scope.configFecha.getDate() >= 28) {
                    fS.sweetAlert('warning', 'Para la opción <code>Mismo Día</code>, el día tiene que ser menor a 28 días!', 'Configuración de Fecha');
                    return
                }

                if (validacion) {
                    $scope.getEndOfMonthDates($scope.configFecha)
                } else {
                    $scope.getSameDayOfMonth($scope.configFecha);
                }

            } catch (error) {
                console.log(error)
            }
        }


        $scope.getEndOfMonthDates = (startDate) => {
            let currentDate = new Date(startDate)

            for (let item of $scope.cuotas) {

                // Obtener el último día del mes actual
                const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

                // Establecer la fecha actual en el último día del mes actual
                currentDate.setDate(lastDayOfMonth);

                // Agregar la fecha vecimiento 
                item.fechaVencimiento = new Date(currentDate)

                // Establecer la fecha actual en el primer día del mes siguiente
                currentDate.setDate(1);
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }


        $scope.getSameDayOfMonth = (date) => {
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const dayOfMonth = date.getDate() <= daysInMonth ? date.getDate() : daysInMonth;
            let index = 0;
            for (let item of $scope.cuotas) {
                const newDate = new Date(date);
                newDate.setMonth(date.getMonth() + index++);
                newDate.setDate(dayOfMonth);
                item.fechaVencimiento = newDate;
            }

        }


        $scope.setValorEntrada = (valorEntrada) => {
            try {


                if ([null, undefined, '0', ""].includes(valorEntrada)) {
                    setTimeout(() => {
                        $("#valorEntrada").select();
                    }, 50);
                    valorEntrada = 0;
                    return
                }

                let total = 0;
                let valorCuota = 0;
                let numeroCuota = $scope.tiempoCreditos.find(item => item.idTiempoCredito === $scope.data.idTiempoCredito).numeroCuota;


                total = $scope.data.importeTotal - parseFloat(valorEntrada);
                total = fS.roundNumber(total, 5);

                valorCuota = total / numeroCuota
                valorCuota = fS.roundNumber(valorCuota, 5);


                for (let item of $scope.cuotas) {
                    if (item.nroCuota === "E") {
                        item.cuota = valorCuota === 0 ? $scope.data.importeTotal : valorEntrada;
                    }
                    if (item.nroCuota !== "E") {
                        item.cuota = valorCuota;
                    }
                }

                let totalCuota = $scope.cuotas.map(val => parseFloat(val.cuota)).reduce((prev, curr) => prev + curr, 0);
                $scope.totalCuota = fS.roundNumber(totalCuota, $scope.NUM_MAX_ROUND)

            } catch (error) {
                console.log(error)
            }
        }

        //Set valor por cuota 
        $scope.setValorCuota = (cuota) => {
            try {

                if ([null, undefined, "", "0", "-"].includes(cuota.cuota)) {
                    setTimeout(() => {
                        $("#setValcuota" + cuota.idCuotaXPagar).select();
                    }, 50);
                    return
                }


                let cuotasIndexMenor = $scope.cuotas.filter((val, index, arrayCuota) => index <= arrayCuota.indexOf(cuota));
                let cuotasIndexMayor = $scope.cuotas.filter((val, index, arrayCuota) => index > arrayCuota.indexOf(cuota));
                let totalCuotaIndexMenor = cuotasIndexMenor.map(val => Number(val.cuota)).reduce((prev, curr) => prev + curr, 0);

                if (totalCuotaIndexMenor > $scope.data.importeTotal) {
                    tS.toastr('warning', 'El valor de la Cuota tiene que ser menor al Total del Documento');
                }

                if (cuotasIndexMayor.length > 0) {
                    let total = $scope.data.importeTotal - totalCuotaIndexMenor; //Total Cuota - total Factura  

                    let numeroCuota = cuotasIndexMayor.length;
                    let valorCuota = total / numeroCuota;


                    angular.forEach($scope.cuotas, (val, index, arrayCuotas) => {
                        //Si la Cuota tiene entrada 
                        if (val.nroCuota !== "E" && index > arrayCuotas.indexOf(cuota)) {
                            val.cuota = fS.roundNumber(valorCuota, 5);
                        } else if (index > arrayCuotas.indexOf(cuota)) {
                            val.cuota = fS.roundNumber(valorCuota, 5);
                        }
                    });

                }

                let totalCuota = $scope.cuotas.map(val => parseFloat(val.cuota)).reduce((prev, curr) => prev + curr, 0);
                $scope.totalCuota = fS.roundNumber(totalCuota, NUM_MAX_ROUND) //Suma Total Cuota            

                let diferencia = $scope.data.importeTotal - $scope.totalCuota;
                $scope.totalDiferencia = fS.roundNumber(diferencia, NUM_MAX_ROUND)
            } catch (error) {
                console.log(error)
            }
        }

        //Set date fecha Vencimiento by cuota 
        $scope.setFechaVencimientoCuota = (cuota) => {
            let inputFvcto = $("#fechaVencimiento" + cuota.idCuotaXPagar);

            if (!cuota.fechaVencimiento) {
                inputFvcto.removeClass('is-valid');
                inputFvcto.addClass('is-invalid');
                return
            } else {
                inputFvcto.addClass('is-valid');
                inputFvcto.removeClass('is-invalid');
            }

            for (let i = 0; i < $scope.cuotas.length; i++) {
                if (i < $scope.cuotas.indexOf(cuota)) {
                    if (cuota.fechaVencimiento <= $scope.cuotas[i].fechaVencimiento) {
                        inputFvcto.removeClass('is-valid');
                        inputFvcto.addClass('is-invalid');
                        return
                    } else {
                        inputFvcto.removeClass('is-invalid');
                        inputFvcto.addClass('is-valid');
                    }
                }
            }
        }


        //Guardar Cuotas Modificadas
        $scope.guardarCuota = () => {
            try {

                if ($scope.cuotas.some(val => val.nroCuota === "E" && [null, undefined, "", 0, "0", ".", "-"].includes(val.cuota))) {
                    tS.toatsr('warning', 'Ingrese el Valor de la Entrada', 'Guardar Cuotas');
                    return
                }

                if ($scope.cuotas.some(val => [null, undefined, "", 0, "0", ".", "-"].includes(val.cuota) || val.cuota < 0)) {
                    tS.toastr('warning', 'Verifique el valor de las Cuotas', 'Guardar Cuotas');
                    return
                }

                if ($scope.cuotas.some(val => [null, undefined, ""].includes(val.fechaVencimiento)
                    || $("#fechaVencimiento" + val.idCuotaPorPagar).hasClass('is-invalid'))
                ) {
                    tS.toatsr('warning', 'Ingrese las fechas de vencimiento correctamente');
                    return
                }

                if (fS.roundNumber($scope.totalCuota) !== fS.roundNumber($scope.data.importeTotal)) {
                    fS.sweetAlert('warning', 'El valor total del Documento no coincide con el valor total de la Cuota')
                    return
                }

                Swal.fire({
                    icon: 'warning',
                    html: `<small>Está seguro/a de guardar las cuotas de este Comprobante
                            N°: <b>${$scope.data.serieComprobante}</b></small>`,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, guardar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then(result => {

                    if (result.isConfirmed) {
                        showLoader();
                        let data = {
                            cuotas: JSON.stringify($scope.cuotas)
                        }
                        cuentaPorPagarSvc.put($scope.data.id, data).then(response => {
                            if (response.code === "0") {
                                hideLoader()
                                fS.sweetAlert('warning', response.message, response.titleSms);
                                return
                            }
                            if (response.code === "1") {
                                hideLoader()
                                $scope.reload = true
                                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                let cuotas = response.payload ? JSON.parse(response.payload) : []
                                $scope.cuotas = cuotas.map(item => {
                                    item.fechaVencimiento = fS.formatDate(item.fechaVencimiento);
                                    return item
                                })
                            }
                        }).catch(error => {
                            hideLoader();
                            console.log(error)
                        })

                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.closeModal = () => {
            let obj = null
            if ($scope.reload) {
                obj = { reload: true }
            }
            $uibModalInstance.close(obj)
        }
    }
    //---------------------------------------------END CUOTAS--------------------------------------------------

    //=======================================START MOVIMIENTO CAJA============================================== 
    app.controller('historialMovimientoCtrl', historialMovimientoCtrl);

    historialMovimientoCtrl.$inject = ["$scope", "$uibModalInstance", "params"]
    function historialMovimientoCtrl($scope, $uibModalInstance, params) {

        let { data, historialMovimientos } = params

        $scope.data = Object.assign({}, data)
        $scope.historialMovimientos = historialMovimientos;


        $scope.closeModal = () => {
            $uibModalInstance.close();
        }

    }


})(window.angular)
