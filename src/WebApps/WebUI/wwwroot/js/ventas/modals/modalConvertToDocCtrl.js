//@ts-check
export {
    convertToDocModalCtrl,
    historialConversionDocCtrl
}

convertToDocModalCtrl.$inject = [
    '$scope',
    '$injector',
    '$uibModalInstance',
    '$q',
    'params'
]
function convertToDocModalCtrl($scope, $injector, $uibModalInstance, $q, params) {

    let { codDoc, id } = params;
    let proformaSvc = $injector.get('proformaService');
    let notaEntregaSvc = $injector.get('notaEntregaService');
    let facturaSvc = $injector.get('facturaService');
    let DOC_TYPE = $injector.get('DOC_TYPE')
    let fS = $injector.get('formulario')
    let tS = $injector.get('toastService')


    $scope.isDocOriginProforma = false;
    $scope.isDocOriginNotaEntrega = false;

    $scope.tiemposCredito = [];
    $scope.formasPagoSri = [];
    $scope.config = {

    }

    $scope.companyCustomer = {};
    $scope.comprobante = {};
    $scope.detalles = [];
    $scope.infoAdicionalDocumento = [];


    //En caso de que se factura }
    $scope.dataFormaPago = {
        idFormaPagoSri: 0,
        idTiempoCredito: 0,
        plazo: 1,
        total: 0
    }

    $scope.titleModal = null;

    $scope.vendedores = [];

    function calculateTotalItems(items) {
        return items.map(item => {
            let precioTotalSinImpuesto = ((item.precioUnitario * item.cantidad)) - item.valorDescuento;
            let total = precioTotalSinImpuesto + item.valorImpuesto;
            return {
                ...item,
                precioConIva: fS.roundNumber(item.precioConIva, 5),
                precioTotalSinImpuesto: fS.roundNumber(precioTotalSinImpuesto, 5),
                total: fS.roundNumber(total, 5)
            }

        })
    }

    function getDataFormProforma() {

        return $q.all([
            proformaSvc.getDataFormConvert(),
            proformaSvc.getId(id)
        ])
    }

    function getDataFormNotaEntrega() {

        return $q.all([
            notaEntregaSvc.getDataFormConvert(),
            notaEntregaSvc.getId(id)
        ])
    }

    if (codDoc === DOC_TYPE.PR) {
        $scope.isDocOriginProforma = true;
        $scope.titleModal = 'Nota Entrega o Factura'
        onLoadProforma();
    }

    if (codDoc === DOC_TYPE.NE) {
        $scope.isDocOriginNotaEntrega = true;
        $scope.titleModal = 'Factura'
        onLoadNotaEntrega();
    }

    function onLoadProforma() {
        try {
            showLoader();
            getDataFormProforma().then(response => {
                const [dataForm, data] = response; 
                const { tiemposCredito, formasPagoSri, config, vendedores } = dataForm;
                const { cliente, comprobante, items, infoAdicionalDocumento } = data;

                $scope.tiemposCredito = tiemposCredito;
                $scope.formasPagoSri = formasPagoSri;
                $scope.config = config;
                $scope.vendedores = vendedores || [];

                $scope.companyCustomer = cliente;
                $scope.comprobante = comprobante;
                $scope.comprobante.fechaEmision = new Date();

                $scope.detalles = calculateTotalItems(items);
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;

                let dataTiempoCredito = $scope.tiemposCredito[0];
                if (dataTiempoCredito) {
                    $scope.dataFormaPago.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.comprobante.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.dataFormaPago.plazo = dataTiempoCredito.diasCredito;
                    $scope.comprobante.fechaVencimiento = fS.getFechaVencimiento($scope.comprobante.fechaEmision, dataTiempoCredito.diasCredito)
                }

                //Por defecto tomamos SIN UTILIZACION DEL SISTEMA FINANCIERO
                if ($scope.formasPagoSri.length > 0) {
                    let dataFormaPago = $scope.formasPagoSri.find(item => {
                        if ($scope.config.idFormaPagoSri > 0) {
                            return (item.idFormaPagoSri === $scope.config.idFormaPagoSri);
                        } else {
                            return (item.codigo === "01");
                        }
                    });
                    if (dataFormaPago) {
                        $scope.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
                    }
                }

                $scope.dataFormaPago.total = $scope.comprobante.total;

                if (!$scope.config.multipleVendedor) {
                    let dataUsuario = $scope.vendedores.find(item => (item.predeterminado));
                    $scope.comprobante.idUsuario = dataUsuario.idUsuario;
                }

            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader())
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }


    function onLoadNotaEntrega() {
        try {
            showLoader();
            getDataFormNotaEntrega().then(response => {
                const [dataForm, data] = response;

                const { tiemposCredito, formasPagoSri, config, vendedores } = dataForm;
                const { cliente, comprobante, items, infoAdicionalDocumento } = data;

                $scope.tiemposCredito = tiemposCredito;
                $scope.formasPagoSri = formasPagoSri;
                $scope.config = config;
                $scope.vendedores = vendedores;

                $scope.companyCustomer = cliente;
                $scope.comprobante = comprobante;
                $scope.comprobante.fechaEmision = new Date();

                $scope.detalles = calculateTotalItems(items);
                $scope.infoAdicionalDocumento = infoAdicionalDocumento;



                //Por defecto tomamos SIN UTILIZACION DEL SISTEMA FINANCIERO
                if ($scope.formasPagoSri.length > 0) {
                    let dataFormaPago = $scope.formasPagoSri.find(item => {
                        if ($scope.config.idFormaPagoSri > 0) {
                            return (item.idFormaPagoSri === $scope.config.idFormaPagoSri);
                        } else {
                            return (item.codigo === "01");
                        }
                    });
                    if (dataFormaPago) {
                        $scope.dataFormaPago.idFormaPagoSri = dataFormaPago.idFormaPagoSri;
                    }
                }

                let dataTiempoCredito = $scope.tiemposCredito.find(item => item.idTiempoCredito === $scope.comprobante.idTiempoCredito)
                if (dataTiempoCredito) {
                    $scope.dataFormaPago.idTiempoCredito = dataTiempoCredito.idTiempoCredito;
                    $scope.dataFormaPago.plazo = dataTiempoCredito.diasCredito;
                    $scope.comprobante.fechaVencimiento = fS.getFechaVencimiento($scope.comprobante.fechaEmision, dataTiempoCredito.diasCredito)

                    $scope.dataFormaPago.total = $scope.comprobante.total;
                }

                if (!$scope.config.multipleVendedor) {
                    let dataUsuario = $scope.vendedores.find(item => (item.predeterminado));
                    $scope.comprobante.idUsuario = dataUsuario.idUsuario;
                }


            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader())
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }


    function isValidForm() {
        if (!fS.isValidField($scope.comprobante.codEstab)) {
            tS.toastr({
                type: 'warning',
                message: 'Seleccione el Establecimiento'
            });
            return
        }
        if (!($scope.comprobante.idPuntoEmision > 0)) {
            tS.toastr({
                type: 'warning',
                message: 'Seleccione el Punto de Emisión'
            });
            return
        }
        if (!($scope.comprobante.idTiempoCredito > 0)) {
            tS.toastr({
                type: 'warning',
                message: 'Seleccione el Tiempo Credito'
            });
            return
        }
        if (!fS.isDateValid($scope.comprobante.fechaEmision)) {
            tS.toastr({
                type: 'warning',
                message: 'Ingrese una fecha válida',
            });
            return;
        }

        if (fS.validateDateIsAfterCurrentDate($scope.comprobante.fechaEmision)) {
            tS.toastr('warning', 'La fecha de emisión del documento no puede ser posterior a la fecha actual.')
            return
        }

        let ajusteFechaEmision = fS.ajustarFechaEmision(false, $scope.comprobante.fechaEmision);

        if (ajusteFechaEmision) {
            $scope.comprobante.fechaEmision = ajusteFechaEmision;
        } else {
            console.log('Error al justar la fecha de Emisión')
            return
        }


        if (!(fS.isDateValid($scope.comprobante.fechaVencimiento))) {
            tS.toastr('warning', 'Seleccione la Fecha de vencimiento');
            return
        }


        if (!($scope.companyCustomer.idCliente > 0)) {
            tS.toastr({
                type: 'warning',
                message: 'El cliente es requerido'
            })
            return
        }

        if (!($scope.comprobante.idUsuario > 0)) {
            tS.toastr({
                type: 'warning',
                message: 'Seleccione el vendedor'
            })
            return
        }

        // if (!($scope.comprobante.idUsuario > 0)) {
        //     tS.toastr({
        //         type: 'warning',
        //         message: 'Seleccione el Vendedor'
        //     })
        //     return
        // }

        if ($scope.detalles.some((row) => row.llevaInventario && row.cantidad === 0)) {
            tS.toastr({
                type: 'warning',
                message:
                    'No es posible vender artículos con inventario cuando la cantidad es igual a 0.',
            });
            return;
        }

        if ($scope.detalles.some((row) => !(row.idBodega > 0))) {
            tS.toastr({
                type: 'warning',
                message: 'Seleccione la bodega en el detalle de los artículos',
            });
            return;
        }

        if ($scope.comprobante.total <= 0) {
            tS.toastr({
                type: 'warning',
                message: 'No se puede generar el documento con valor total 0!',
            });
            return;
        }
        return true;
    }


    const validateCuota = function () {
        let objParamsCuota = {
            fechaEmision: $scope.comprobante.fechaEmision,
            tiemposCredito: $scope.tiemposCredito,
            idTiempoCredito: $scope.comprobante.idTiempoCredito,
            montoTotal: $scope.comprobante.total,
            cuotas: []
        }
        let cuotas = [];
        let montoTotalCuota = 0;


        let dataCuota = fS.calcularCuotas(objParamsCuota);
        cuotas = dataCuota.cuotas;
        montoTotalCuota = dataCuota.montoTotalCuota;



        if (fS.roundNumber(montoTotalCuota, 2) !== fS.roundNumber($scope.comprobante.total, 2)) {
            tS.toastr({
                type: 'warning',
                message: 'No coincide el total de la cuota con el importe total del documento.'
            });
            return [];
        }

        return cuotas;
    }


    $scope.saveNotaEntrega = async function () {
        try {

            if (!isValidForm()) return

            let cuotas = validateCuota();

            if (cuotas && cuotas.length === 0) return



            showLoader();
            let serieComprobante = await notaEntregaSvc.generateSerieComprobante({
                idPuntoEmision: $scope.comprobante.idPuntoEmision,
            })
                .catch(error => console.log(error))
                .finally(() => hideLoader())
            if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";


            const customSwal = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            let { isConfirmed } = await customSwal.fire({
                title: '<small>Guardar Nota de Entrega</small>',
                html: `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            if (!isConfirmed) return

            let query = proformaSvc.queryMapperConvertToDoc({
                id,
                codDocDestino: DOC_TYPE.NE, //documento destino
                codDoc: DOC_TYPE.NE,//documento origen 
                comprobante: $scope.comprobante,
                detalles: $scope.detalles,
                infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                cuotas,
                dataFormaPago: $scope.dataFormaPago
            })

            showLoader();
            proformaSvc.convertToDoc(query).then(response => {
                if (response.code === '0') {
                    fS.sweetAlert('warning', response.message, response.titleSms);
                }
                if (response.code === "1") {
                    fS.sweetAlert('success', response.message, response.titleSms, 1000);

                    let mainData = {
                        isRegister: true,
                        data: response.dataResponse,
                    }
                    $uibModalInstance.close(mainData)
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader())


        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }


    function setDataChangeFormaPago() {
        let dataFormaPago = $scope.formasPagoSri.find(item => item.idFormaPagoSri === $scope.dataFormaPago.idFormaPagoSri);
        let el = document.getElementById('infoReferenciaFormaPago')
        if (el) {
        //    el.innerHTML = dataFormaPago.infoReferencia;
        }
    }

    $scope.saveInvoiceOfProforma = async function () {
        try {

            if (!isValidForm()) return

            let cuotas = validateCuota();

            if (cuotas && cuotas.length === 0) return


            Swal.fire({
                title: '<small>Seleccionar forma de pago: </small>',
                html: ` 
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Forma de Pago</th>
                                    <th>Plazo</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select ng-model="dataFormaPago.idFormaPagoSri" id="formaDePago" class="form-control border-select" name="formaDePago">
                                            ${$scope.formasPagoSri.map((item) => `<option value="${item.idFormaPagoSri}">
                                                ${item.descripcion}
                                            </option>`)}
                                            
                                        </select>
                                        <span class="d-flex justify-content-center text-info" id="infoReferenciaFormaPago"></span> 
                                    </td>
                                    <td width="100px">
                                        ${$scope.dataFormaPago.plazo} ${$scope.dataFormaPago.plazo > 1 ? 'Días' : 'Día'}
                                    </td>
                                    <td width="100px">
                                        $${$scope.dataFormaPago.total}
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>  
                `,
                didOpen: () => {
                    let el = document.getElementById('formaDePago');
                    if ($scope.companyCustomer.idFormaPagoSri > 0) {
                        $scope.dataFormaPago.idFormaPagoSri = $scope.companyCustomer.idFormaPagoSri;
                    }
                    if (el) {
                        el.value = $scope.dataFormaPago.idFormaPagoSri;
                        setDataChangeFormaPago();

                        el.addEventListener('change', () => {
                            $scope.dataFormaPago.idFormaPagoSri = Number(el.value);
                            setDataChangeFormaPago();
                        })
                    }

                },
                preConfirm: () => {
                    let idFormaPagoSri = document.getElementById('formaDePago').value;
                    if (!(idFormaPagoSri > 0)) {
                        tS.toastr('warning', 'Seleccione la forma de pago!')
                        return false;
                    }
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Continuar!',
                cancelButtonText: 'Cancelar!'
            }).then(async result => {
                if (result.isConfirmed) {

                    showLoader();
                    let serieComprobante = await facturaSvc.generateSerieComprobante({
                        idPuntoEmision: $scope.comprobante.idPuntoEmision,
                    })
                        .catch(error => console.log(error))
                        .finally(() => hideLoader())
                    if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";



                    const customSwal = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-success',
                            cancelButton: 'btn btn-danger ml-2'
                        },
                        buttonsStyling: false
                    })

                    let { isConfirmed } = await customSwal.fire({
                        title: '<small>Guardar Factura</small>',
                        html: `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        cancelButtonText: 'No, cancelar!',
                        reverseButtons: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    })

                    if (!isConfirmed) return

                    let query = proformaSvc.queryMapperConvertToDoc({
                        id,
                        codDocDestino: DOC_TYPE.FE, //documento destino
                        codDoc: DOC_TYPE.FV_SRI,//documento origen 
                        comprobante: $scope.comprobante,
                        detalles: $scope.detalles,
                        infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                        cuotas,
                        dataFormaPago: $scope.dataFormaPago
                    })

                    showLoader();
                    proformaSvc.convertToDoc(query).then(response => {
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.code === "1") {
                            fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            $uibModalInstance.close(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())



                }

            })





        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }


    $scope.saveInvoiceOfNotaEntrega = async function () {
        try {

            if (!isValidForm()) return

            let cuotas = validateCuota();

            if (cuotas && cuotas.length === 0) return

            showLoader();
            let serieComprobante = await facturaSvc.generateSerieComprobante({
                idPuntoEmision: $scope.comprobante.idPuntoEmision,
            })
                .catch(error => console.log(error))
                .finally(() => hideLoader())
            if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";


            const customSwal = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            let { isConfirmed } = await customSwal.fire({
                title: '<small>Guardar Factura</small>',
                html: `<small>Esta Ud. seguro de guardar este Documento N°. <b>${serieComprobante}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            if (!isConfirmed) return

            let query = notaEntregaSvc.queryMapperConvertToDoc({
                id,
                codDocDestino: DOC_TYPE.FE, //documento destino inventario
                codDoc: DOC_TYPE.FV_SRI, //cuentas por cobrar
                comprobante: $scope.comprobante,
                detalles: $scope.detalles,
                infoAdicionalDocumento: $scope.infoAdicionalDocumento,
                cuotas,
                dataFormaPago: $scope.dataFormaPago
            })

            showLoader();
            notaEntregaSvc.convertToDoc(query).then(response => {
                if (response.code === '0') {
                    fS.sweetAlert('warning', response.message, response.titleSms);
                }
                if (response.code === "1") {
                    fS.sweetAlert('success', response.message, response.titleSms, 1000);
                    $uibModalInstance.close(response)
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader())


        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }





    $scope.closeModal = function () {
        $uibModalInstance.close();
    }



}


historialConversionDocCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    'params'
]

function historialConversionDocCtrl($scope, $uibModalInstance, $injector, params) {
    let proformaSvc = $injector.get('proformaService');
    let notaEntregaSvc = $injector.get('notaEntregaService');
    let DOC_TYPE = $injector.get('DOC_TYPE');

    $scope.historialConversion = [];

    const { codDoc, id } = params;

    if (DOC_TYPE.PR === codDoc) {
        try {
            showLoader();
            proformaSvc.getHistorialConversionDoc(id)
                .then(response => {
                    $scope.historialConversion = response;
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
        } catch (error) {
            hideLoader();
        }
    }

    if (DOC_TYPE.NE === codDoc) {
        try {
            showLoader();
            notaEntregaSvc.getHistorialConversionDoc(id)
                .then(response => {
                    $scope.historialConversion = response;
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
        } catch (error) {
            console.log(error)
        }
    }




    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}