

(function () {

    'use strict';

    const FILE_PATH_PARTIAL_UI = '~/Pages/Contabilidad/CuentaPorPagar/Shared/';

    let cuentaPorPagarSvc = {}

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl)

    cuentaPorPagarCtrl.$inject = ['$scope', '$injector', '$timeout']

    function cuentaPorPagarCtrl($scope, $injector, $timeout) {
        const tS = $injector.get('toastService'); 
        const sS = $injector.get('screenSize');
        const modalSvc = $injector.get('modalService');
        const fS = $injector.get('formulario');
        const cuentaPorPagarSvc = $injector.get('cuentaPorPagarService');
        const nombreModalContabilidad = $injector.get('nombreModalContabilidad');

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
            maxSize: 5
        }

        $scope.tipoDocumentos = [
            { codigo: '03', descripcion: 'LIQUIDACION COMPRA' },
            { codigo: 'FC', descripcion: 'FACTURA' },
            { codigo: 'DH', descripcion: 'DOCUMENTO NO HABITUAL' },
        ];

        $scope.cuentasPorPagar = [];
        $scope.selectedDocumentos = [];
        $scope.proveedor = {};

        $scope.tableOptions = {
            sortBy: '',
            rowSelection: true,
            multiSelect: true
        };

        $scope.getCuentasPorPagar = () => {
            try {


                let dataSearch = {
                    codEstab: $scope.dataSearch.codEstab,
                    checkboxFecha: $scope.dataSearch.checkBoxFecha,
                    codEstado: fS.isValidField($scope.dataSearch.codEstado),
                    codDoc: fS.isValidField($scope.dataSearch.codDoc),
                    idProveedor: fS.isValidField($scope.dataSearch.idProveedor),
                    dateStart: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    dateEnd: fS.formatDateMoment($scope.dataSearch.fechaFin)
                }

                $scope.cuentasPorPagar = [];
                $scope.selectedDocumentos = [];

                showLoader();
                cuentaPorPagarSvc.getAll(dataSearch).then(response => {
                    $scope.cuentasPorPagar = response;
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
                    const { estabs,
                        estadosDoc } = response;
                    $scope.establecimientos = estabs;
                    $scope.estadosDoc = estadosDoc;

                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(item => item.defaultEstab);
                        $scope.dataSearch.codEstab = dataEstab.codEstab;
                        $scope.getCuentasPorPagar();
                    }
                }).catch(error=>{
                    console.log(error)
                }).finally(()=>hideLoader());
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
            let index = selectedDocumentosTemp.indexOf(item);
            selectedDocumentosTemp.splice(index, 1);
        }

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
            console.log($scope.selectedDocumentos)
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
                    console.log(results)
                    hideLoader();
                    let mergeWithCuotas = mergeCuotas(selectedDocumentos, results);
                    openModalCobroLote(mergeWithCuotas);
                })
                .catch(error => {
                    console.error('Al menos una solicitud falló:', error);
                    // Manejar el error
                }).finally(() => hideLoader());

        }

        async function openModalCobroLote(selectedDocumentos) {
            try { 
                console.log(selectedDocumentos)
                let fileCtrl = nombreModalContabilidad.PAGO.fileCtrl;
                let ctrl = nombreModalContabilidad.PAGO.controllers['MPL'];
                let template = nombreModalContabilidad.PAGO.templates['MPL'];
                let controller = (await import(fileCtrl))[ctrl];

                let modalRef = modalSvc.openModalCustom({
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
                        getCuentasPorCobrar();
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
                    template: FILE_PATH_PARTIAL_UI + '_ModalPago.cshtml',
                    size: 'xl',
                    //  windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }


                modalParams.params = {
                    data: $scope.selectedDocumentos[0],
                    selectedDocumentos: $scope.selectedDocumentos,
                }

                //Open Modal 
                let modalRef = _modalSvc.openModalCustom(modalParams)
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
                    template: FILE_PATH_PARTIAL_UI + '_ModalCuota.cshtml',
                    size: 'xl',
                    isRenderRazorPartial: true
                }

                let spParams = JSON.stringify({ idCuentaPorPagar: item.idCuentaPorPagar, tipo: 2 })


                showLoader();
                _mS.getData('get', 'Contabilidad/CuentaPorPagar?json=' + spParams, null, true).then(response => {

                    let cuotas = response.payload ? JSON.parse(response.payload)[0] : []

                    modalParams.params = {
                        cuotas,
                        data: {
                            ...item,
                            id: item.idCuentaPorPagar,
                            codPago: item.codPago,
                            numeroIdentificacion: item.identificacion
                        },
                    }

                    let modalRef = _modalSvc.openModalCustom(modalParams);
                    modalRef.result.then(res => {
                        if (typeof res === 'object') {
                            $scope.initialLoad();

                        }
                    })
                    hideLoader()
                })
                // cuentaPorPagarSvc.get(spParams).then(response=>{
                //     let cuotas = response.cuotas; 
                //     modalParams.params = {
                //         cuotas,
                //         data: {
                //             ...item,
                //             id: item.idCuentaPorPagar,
                //             codPago: item.codPago,
                //             numeroIdentificacion: item.identificacion
                //         },
                //     }

                //     let modalRef = _modalSvc.openModalCustom(modalParams);
                //     modalRef.result.then(res => {
                //         if (typeof res === 'object') {
                //             $scope.initialLoad(); 
                //         }
                //     })
                // }).finally(()=>hideLoader()) 
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }


        $scope.openModalPago = async (item) => {
            try {
                //Params Modal
                let modalParams = {
                    controller: 'modalPagoCtrl',
                    template: FILE_PATH_PARTIAL_UI + '_ModalPago.cshtml',
                    size: 'xl',
                    //  windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }

                showLoader();
                $scope.getCuotaCuentaPorPagar(item).then(response => {

                    if (response.code === "0") {
                        hideLoader()
                        console.log(response)
                    }

                    if (response.code === "1") {

                        item.cuotas = JSON.parse(response.payload)[0] || [];

                        modalParams.params = {
                            selectedDocumentos: [item],
                            data: item
                        }

                        //Open Modal 
                        let modalRef = _modalSvc.openModalCustom(modalParams)
                        modalRef.result.then(result => {
                            $scope.selectedDocumentos = [];

                            if (typeof result === 'object') {
                                $scope.getCuentasPorPagar();
                            }
                        })
                        hideLoader()
                    }

                }).catch(error => {
                    hideLoader()
                    console.log(error)
                })

            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        $scope.openModalHistorialMov = (item) => {
            try {

                let modalParams = {
                    template: FILE_PATH_PARTIAL_UI + '_ModalHistorialPago.cshtml',
                    controller: 'historialMovimientoCtrl',
                    size: 'xl',
                    isRenderRazorPartial: true
                }

                let spParams = JSON.stringify({
                    tipo: 4,
                    idCuentaPorPagar: item.idCuentaPorPagar
                })


                showLoader();
                _mS.getData('get', 'Contabilidad/CuentaPorPagar?json=' + spParams, null, true).then(response => {
                    if (response.code === '0') {
                        hideLoader()
                        fS.sweetAlert('warning', response.message)
                    }
                    if (response.code === '1') {
                        modalParams.params = {
                            data: item,
                            historialMovimientos: JSON.parse(response.payload)[0]
                        }
                        _modalSvc.openModalCustom(modalParams)
                        hideLoader()
                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


    }

    //---------------------------------------------START CUOTAS----------------------------------------------------
    app.controller("modalCuotaCtrl", modalCuotaCtrl);

    modalCuotaCtrl.$inject = ["$scope", "$uibModalInstance", "mainService", "commonService", "formulario", "toastService", "params"];

    function modalCuotaCtrl($scope, $uibModalInstance, mS, commonSvc, fS, tS, params) {

        let { data, cuotas } = params;

        const NUM_MAX_ROUND = 3;

        $scope.tiempoCreditos = [];

        $scope.data = Object.assign({}, data);

        $scope.cloneIdTiempoCredito = $scope.data.idTiempoCredito; //Clonamos tiempo de credito agregado al documento 
        $scope.configFecha = fS.formatDate($scope.data.fechaEmision);
        $scope.totalDiferencia = 0;
        $scope.totalCuota = $scope.data.importeTotal;


        $scope.initialLoad = () => {
            showLoader();
            cuentaPorPagarSvc.get({ tipo: 5 }).then(response => {
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

        $scope.initialLoad();


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

                    mS.getData('post', 'Contabilidad/CuentaPorPagar/' + JSON.stringify(data), null, true).then(response => {
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
                        mS.getData('put', 'Contabilidad/CuentaPorPagar/' + $scope.data.id, data, true)
                            .then(response => {
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
