//@ts-check
export {
    modalCobroRapidoCtrl
};

modalCobroRapidoCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    'params'
]
function modalCobroRapidoCtrl($scope, $uibModalInstance, $injector, params) {

    const modalCobroSvc = $injector.get('modalCobroService').get();
    const comprobanteIngresoSvc = $injector.get('comprobanteIngresoService');
    const nombreModalContabilidad = $injector.get('nombreModalContabilidad');

    const modalSvc = $injector.get('modalService');
    const tS = $injector.get('toastService');
    const fS = $injector.get('formulario')

    let { data } = params;
    let { idCuentaPorCobrar } = data;



    $scope.data = {}

    $scope.cobro = {
        valorAbono: 0,
        valorSaldo: 0,
        valorCambio: 0,
        abono: 0,
        fechaEmision: new Date()
    };


    $scope.entidadFinanciera = {};
    $scope.banco = {};
    $scope.cuentaBancaria = {};
    $scope.estadoCobro = {};

    $scope.selectedDocumentos = [];


    $scope.entidadesFinancieras = [];
    $scope.subEntidadesFinancieras = [];

    $scope.isLoading = false;
    $scope.isSaving = false;
    $scope.isSubmitting = false; // lock to prevent multiple confirmations / duplicate submissions


    $scope.findSubEntidad = findSubEntidad;
    $scope.openModalCobroAvanzado = openModalCobroAvanzado;
    $scope.setValorEfectivo = setValorEfectivo;
    $scope.save = save;


    modalCobroSvc.clearData();


    function resetData() {
        $scope.cobro.valorAbono = $scope.comprobante.saldo;
        $scope.cobro.abono = $scope.comprobante.saldo;
        $scope.cobro.valorCambio = 0;

        $scope.cobro.valorSaldo = 0;
        $scope.cobro.fechaEmision = new Date();
        $scope.cobro.idBanco = 0;
        $scope.cobro.nro = null;
        $scope.cobro.referencia = null;
        $scope.cobro.idCiudad = 0;
        $scope.cobro.aprobacion = null;
        $scope.cobro.lote = null;
        $scope.cobro.posFechado = false;

        if ($scope.entidadFinanciera.codigo === 'CHE') {
            $scope.cobro.referencia = $scope.comprobante.razonSocialComprador
        }
    }

    function findSubEntidad(id) {
        $scope.entidadFinanciera = $scope.entidadesFinancieras.find(item => item.idEntidadFinanciera === id);
        $scope.subEntidadesFinancieras = $scope.entidadFinanciera.subEntidadesFinanciera;
        if ($scope.subEntidadesFinancieras.length > 0) {
            $scope.cobro.idSubEntidadFinanciera = $scope.subEntidadesFinancieras[0].idSubEntidadFinanciera;
        } else {
            tS.toastr('warning', 'No posee SubEntidades financieras!');
        }
        resetData();
    }

    loadInitialData();
    function loadInitialData() {
        try {

            $scope.isLoading = true;


            comprobanteIngresoSvc.paymentFormData({
                idCuentaPorCobrar
            }).then(dataFormaCobro => {
                $scope.isLoading = false;
                let {
                    entidadesFinanciera,
                    bancos,
                    ciudades,
                    cuentaPorCobrar,
                    estadosPago
                } = dataFormaCobro;

                modalCobroSvc.setEstadoCobro(dataFormaCobro.estadosPago);
                modalCobroSvc.setConfigCobro(dataFormaCobro.configCobro);

                $scope.entidadesFinancieras = entidadesFinanciera;
                let dataEntidadFinanciera = $scope.entidadesFinancieras.find(val => val.codigo === 'EFE');


                $scope.bancos = bancos;

                $scope.ciudades = ciudades;


                if (cuentaPorCobrar.some(item => [null, undefined, []].includes(item.cuotas))) {
                    fS.sweetAlert('warning', 'No posee cuotas');
                    throw 'No posee cuotas'
                }

                let selectedDocsTemp = modalCobroSvc.prepararParaCobro(cuentaPorCobrar);

                $scope.selectedDocumentos = selectedDocsTemp;


                let dataCuentaPorCobrar = $scope.selectedDocumentos[0];
                $scope.comprobante = {
                    codEstab: dataCuentaPorCobrar.codEstab,
                    idCliente: dataCuentaPorCobrar.idCliente,
                    identificacionComprador: dataCuentaPorCobrar.identificacionComprador,
                    razonSocialComprador: dataCuentaPorCobrar.razonSocialComprador,
                    serieComprobante: dataCuentaPorCobrar.serieComprobante,
                    fechaEmision: fS.formatDateMoment(fS.formatDate(dataCuentaPorCobrar.fechaEmision)),
                    importeTotal: dataCuentaPorCobrar.importeTotal,
                    saldo: dataCuentaPorCobrar.saldo,
                    abono: dataCuentaPorCobrar.abono
                }

                $scope.cobro = Object.assign($scope.cobro, {
                    valorAbono: $scope.comprobante.saldo,
                    abono: $scope.comprobante.saldo
                })

                if (dataEntidadFinanciera) {
                    $scope.findSubEntidad(dataEntidadFinanciera.idEntidadFinanciera);
                } else {
                    tS.toastr('warning', 'Entidad Financiera Efectivo no posee subentidad financiera');
                }
            }).catch(error => {
                $scope.isLoading = false;
                console.log(error)
            }).finally(() => {
                $scope.isLoading = false;
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function openModalCobroAvanzado() {
        try {
            const { fileCtrl, ctrl, template } = nombreModalContabilidad.COBRO_LOTE;
            let controller = (await import(fileCtrl))[ctrl];
            let modalRef = modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                params,
                isRenderRazorPartial: true
            })

            modalRef.result.then(result => {
                if (typeof result === 'object') {
                    $uibModalInstance.close(result);
                }
            })

        } catch (error) {
            console.log(error)
        }
    }


    function setValorEfectivo() {
        let valorCambio = 0, saldo = 0;
        // if ($scope.entidadFinanciera.codigo !== "EFE") return

        if (!(typeof $scope.cobro.valorAbono === 'number')) {
            $scope.cobro.valorCambio = 0
            $scope.cobro.abono = 0
            $scope.cobro.valorSaldo = 0;
            // tS.toastr('warning', 'Ingrese un número válido');
            return
        }

        if ($scope.cobro.valorAbono >= $scope.comprobante.saldo) {
            valorCambio = $scope.cobro.valorAbono - $scope.comprobante.saldo;
            $scope.cobro.valorCambio = fS.roundNumber(valorCambio, fS.max_dos);
            $scope.cobro.abono = fS.roundNumber($scope.comprobante.saldo, fS.max_dos);
            $scope.cobro.valorSaldo = 0;
        } else {
            $scope.cobro.valorSaldo = $scope.comprobante.saldo;

            saldo = $scope.cobro.valorSaldo - $scope.cobro.valorAbono;
            $scope.cobro.valorCambio = 0;
            $scope.cobro.valorSaldo = fS.roundNumber(saldo, fS.max_dos);
            $scope.cobro.abono = fS.roundNumber($scope.cobro.valorAbono, fS.max_dos)
        }
    }


    async function save() {
        try {

            if ($scope.isSaving || $scope.isSubmitting) return;
            // mark that we're processing a save action (pre-confirmation lock)
            $scope.isSubmitting = true;

            if (!modalCobroSvc.isValidForm($scope.cobro, $scope.entidadFinanciera.codigo)) throw 'Form invalid'

            let { isConfirmed } = await Swal.fire({
                // title: 'Guardar Cobro?',
                text: "Esta seguro de guardar este cobro?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                allowOutsideClick: false,
                allowEscapeKey: true
            })

            if (!isConfirmed) {
                // user cancelled, release pre-confirmation lock
                $scope.isSubmitting = false;
                return;
            }


            if (isConfirmed) {
                try {
                    let comprobante = {
                        idCliente: $scope.comprobante.idCliente,
                        total: $scope.cobro.valorAbono,
                        abono: $scope.cobro.abono,
                        codEstab: $scope.comprobante.codEstab,
                        numeroIdentificacion: $scope.comprobante.identificacionComprador,
                        nombreFiscal: $scope.comprobante.razonSocialComprador,
                        observacion: $scope.cobro.observacion
                    }

                    let infoCobro = [{
                        nro: $scope.cobro.nro,
                        lote: $scope.cobro.lote,
                        aprobacion: $scope.cobro.aprobacion,
                        referencia: $scope.cobro.referencia
                    }]
                    let cobros = [{
                        idSubEntidadFinanciera: $scope.cobro.idSubEntidadFinanciera,
                        idEntidadFinanciera: $scope.entidadFinanciera.idEntidadFinanciera,
                        idBanco: $scope.cobro.idBanco,
                        idCuentaBancaria: 0,
                        fechaEmision: fS.formatDateTimeZone($scope.cobro.fechaEmision),
                        valor: $scope.cobro.valorAbono,
                        posfechado: $scope.cobro.posFechado,
                        cobro: !$scope.cobro.posFechado,
                        secuencial: 0,
                        infoCobro: $scope.entidadFinanciera.codigo === 'EFE' ? undefined : JSON.stringify(infoCobro),
                        abono: $scope.cobro.abono,
                        controlCaja: $scope.subEntidadesFinancieras.find(item => item.idSubEntidadFinanciera === $scope.cobro.idSubEntidadFinanciera).controlCaja,
                        observacion: $scope.cobro.observacion
                    }];

                    modalCobroSvc.clearData();


                    for (let item of $scope.selectedDocumentos) {
                        item.cuotasCalculadas = structuredClone(item.cuotasCalculadasClone);
                    }
                    modalCobroSvc.setValorAbono($scope.cobro.valorAbono);
                    modalCobroSvc.setCuentasPorCobrar($scope.selectedDocumentos);
                    //  modalCobroSvc.setEsAbonoPosfechado($scope.cobro.posFechado);
                    modalCobroSvc.setUniqueIndex(0)

                    //--------agregando abono ---
                    modalCobroSvc.aplicarAbono();

                    if (modalCobroSvc.getCobrosDetalle().length === 0) {
                        fS.sweetAlert('warning', 'Cobro detalle vacio')
                        throw 'Cobro detalle vacio';
                    }

                    let cobrosDetalle = modalCobroSvc.getCobrosDetalle().filter(item => (item.abono > 0));
                    let historialCuentas = modalCobroSvc.getHistorialCuentas();

                    let cuentasPorCobrarEstado = modalCobroSvc.generarCuentasPorCobrarEstado({
                        historialCuentas,
                        cobros,
                        cobrosDetalle
                    })

                    let cuotasPorCobrarEstado = modalCobroSvc.generarCuotasPorCobrarEstado({
                        cobrosDetalle
                    })

                    let data = {
                        comprobante,
                        cobros,
                        cobroDetalle: cobrosDetalle,
                        historialCuentas,
                        cuentasPorCobrarEstado,
                        cuotasPorCobrarEstado
                    }

                    const params = comprobanteIngresoSvc.mapperTo(data);

                    const managedRegister = fS.fetchManager(comprobanteIngresoSvc.post);

                    $scope.isSaving = true;
                    managedRegister(params).then((response) => {
                        // release both flags on completion
                        $scope.isSaving = false;
                        $scope.isSubmitting = false;

                        if (!response) return;
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message)
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message, '', 1000)
                            $uibModalInstance.close(response)
                        }
                    }).catch(error => {
                        $scope.isSaving = false;
                        $scope.isSubmitting = false;
                        console.log(error)
                    })
                } catch (error) {
                    $scope.isSaving = false;
                    $scope.isSubmitting = false;

                    console.log(error)
                }

            }

        } catch (error) {
            console.log(error)
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}
