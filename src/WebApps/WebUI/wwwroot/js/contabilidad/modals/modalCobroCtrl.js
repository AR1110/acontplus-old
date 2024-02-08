
//====================================================SERVICIO COMPRATIDO=====================================
//=====================================================================================================

class CobroService {
    constructor(tS, mS, fS) {

        this.tS = tS;
        this.mS = mS;
        this.fS = fS;

        this.selectedDocumentos = [];
        this.cobrosDetalle = [];
        this.valorAbono = 0;

        this.esAbonoPosfechado = false;
        this.indexDatoCobro = 0;

        this.url = 'Contabilidad/ComprobanteIngreso/'

        this.MAX_NUMBER_ROUND = 5;
    }

    isDateValid(dateString) {
        var date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return false; // La fecha no es válida
        }
        return true; // La fecha es válida
    }

    /**
     * 
     * @param {Object} cobro 
     * @param {String} codigoEntidad 
     * @returns Boolean
     */
    isValidForm(cobro, codigoEntidad) {
        if (!cobro.idSubEntidadFinanciera > 0) {
            this.tS.toastr('warning', 'Seleccione la SubEntidad Financiera')
        }

        if (!cobro.fechaEmision) {
            this.tS.toastr('warning', 'Ingrese la fecha de emisión')
            return
        }
        if (!this.isDateValid(cobro.fechaEmision)) {
            this.tS.toastr('warning', 'Ingrese una fecha válida')
            return
        }

        if (!cobro.valorAbono > 0) {
            this.tS.toastr('warning', 'Ingrese el valor de abono')
            return
        }

        // =================== TARJETA DE CREDITO / DEBITO  =================================== //
        if (codigoEntidad === 'TAR') {
            // if (!cobro.nro) {
            //     this.tS.toastr('warning', 'Ingrese el Número')
            //     return
            // }

            // if (!cobro.idCiudad > 0) {
            //     this.tS.toastr('warning', 'Ingrese la Ciudad')
            //     return
            // }
            // if (!cobro.referencia) {
            //     this.tS.toastr('warning', 'Ingrese la referencia')
            //     return
            // }
            // if (!cobro.aprobacion) {
            //     this.tS.toastr('warning', 'Ingrese la Aprobación')
            //     return
            // }
            // if (!cobro.lote) {
            //     this.tS.toastr('warning', 'Ingrese el Lote')
            //     return
            // }
        }

        // =================== TRANSFERENCIAS  =================================== //

        if (codigoEntidad === 'TRA') {
            if (!cobro.idBanco > 0) {
                this.tS.toastr('warning', 'Ingrese el Banco')
                return
            }
            if (!cobro.nro) {
                this.tS.toastr('warning', 'Ingrese el Número')
                return
            }
        }

        // =================== CHEQUES  =================================== //

        if (codigoEntidad === 'CHE') {
            if (!cobro.idBanco > 0) {
                this.tS.toastr('warning', 'Ingrese el Banco')
                return
            }
            if (!cobro.nro) {
                this.tS.toastr('warning', 'Ingrese el Número')
                return
            }

            if (!cobro.idCiudad > 0) {
                this.tS.toastr('warning', 'Ingrese la Ciudad')
                return
            }
            if (!cobro.referencia) {
                this.tS.toastr('warning', 'Ingrese a quien va dirigido el Cheque')
                return
            }
        }

        return true;
    }

    /**
     * 
     * @param {Array} selectedDocumentos 
     */
    getHistorialCobros(selectedDocumentos) {
        let historialCobros = [];
        for (let item of selectedDocumentos) {
            let cobrosDetalleFiltered = this.cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar)
 

            let totalAbono = cobrosDetalleFiltered.reduce((prev, curr) => prev + curr.abono, 0);

            if (totalAbono > 0) {
                historialCobros.push({
                    idCuentaPorCobrar: item.idCuentaPorCobrar,
                    abono: totalAbono,
                    diasMora: item.diasMora,
                    mora: item.mora,
                    saldo: item.saldo,
                //   saldoOriginal: item.saldoOriginal
                })
            } else break;
        }
        return historialCobros;
    }


    //--------------
    addFormaCobro() {

        for (let group of this.selectedDocumentos) {

            this.group = group;

            for (let item of group.cuotas) {

                item.abonoPosfechado = 0;

                if (typeof this.valorAbono !== 'number' || this.valorAbono === 0) return;

                //Si la cuota no tiene ningún abono

                if (item.abono > 0) {
                    this.cuotaConAbono(item)
                } else {
                    this.cuotaSinAbono(item)
                }

                item.cuota = this.fS.roundNumber(item.cuota, this.MAX_NUMBER_ROUND);
                item.abono = this.fS.roundNumber(item.abono, this.MAX_NUMBER_ROUND);
                item.abonoPosfechado = this.fS.roundNumber(item.abonoPosfechado, this.MAX_NUMBER_ROUND);
                // item.saldo = this.getValorSaldo(item) //Verificamos el saldo de la Cuota 
                item.estado = this.getEstadoCuota(item);

                item.esCuotaAfectada = true; //
            }
        }
    }


    /**
        * 
        * @param {object} item 
        */
    cuotaSinAbono(item) {

        //Validaciones Saldo Cuota 
        if (item.saldoCta >= this.valorAbono) {
            let valorSaldoCta = item.saldoCta - this.valorAbono;
            item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);
        } else if (item.saldoCta <= this.valorAbono) {
            item.saldoCta = 0;
        }

        //Validaciones Saldo 
        if (item.saldo >= this.valorAbono) {

            //Si el Abono pago no es Posfechado
            item.abono = this.esAbonoPosfechado ? 0 : this.valorAbono;

            //Si el abono pago es posfechado
            item.abonoPosfechado = this.esAbonoPosfechado ? this.valorAbono : 0;

            let valorSaldo = item.saldo - this.valorAbono;
            // let valorSaldoCta = item.saldoCta - this.valorAbono;
            item.saldo = this.fS.roundNumber(valorSaldo, this.MAX_NUMBER_ROUND);
            // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);

            this.addCobroDetalle(item, this.valorAbono, item.saldo)
            this.valorAbono = 0;

        } else if (item.saldo <= this.valorAbono) {

            //Si el Abono pago no es Posfechado
            item.abono = this.esAbonoPosfechado ? 0 : item.saldo;

            //Si el abono pago es posfechado
            item.abonoPosfechado = this.esAbonoPosfechado ? item.saldo : 0;

            this.valorAbono = this.valorAbono - item.saldo;

            this.addCobroDetalle(item, item.saldo, 0)
            item.saldo = 0;
            // item.saldoCta = 0;
        }

    }

    /**
    * 
    * @param {object} item 
    */
    cuotaConAbono(item) {

        //Validaciones Saldo Cuota 
        if (item.saldoCta >= this.valorAbono) {
            let valorSaldoCta = item.saldoCta - this.valorAbono;
            item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);
        } else if (item.saldoCta <= this.valorAbono) {
            item.saldoCta = 0;
        }

        //Validaciones Saldo 

        if (item.saldo >= this.valorAbono) {

            if (this.esAbonoPosfechado) {
                item.abonoPosfechado = this.valorAbono + item.abonoPosfechado;
            } else {
                item.abono = this.valorAbono + item.abono;
            }

            let valorSaldo = item.saldo - this.valorAbono;
            // let valorSaldoCta = item.saldoCta - this.valorAbono;
            item.saldo = this.fS.roundNumber(valorSaldo, this.MAX_NUMBER_ROUND);
            // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);

            this.addCobroDetalle(item, this.valorAbono, item.saldo);
            this.valorAbono = 0;


        } else if (item.saldo <= this.valorAbono) {
            let abonoCuota = item.saldo;
            if (this.esAbonoPosfechado) {
                item.abonoPosfechado = item.abonoPosfechado + item.saldo;
            } else {
                item.abono = item.abono + item.saldo;
            }

            this.valorAbono = this.valorAbono - item.saldo;
            this.valorAbono = this.fS.roundNumber(this.valorAbono, this.MAX_NUMBER_ROUND);
            this.addCobroDetalle(item, abonoCuota, 0);
            item.saldo = 0;
        }
    }


    /**
     * 
     * @param {object} item 
     * @param {number} abono 
     * @returns void
     */
    addCobroDetalle(item, abono, saldo) {
        if (item.cuota == 0) return; 

        let valorMovimientoSaldo = 0;
        let cobrosDetalleFiltered = this.cobrosDetalle.filter(cd => (
            cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar && 
            cd.idCuotaPorCobrar === item.idCuotaPorCobrar
            ))

        let dataUltimoCobroDetalle = cobrosDetalleFiltered.pop();
        if(dataUltimoCobroDetalle){
            valorMovimientoSaldo = dataUltimoCobroDetalle.saldoOriginal - dataUltimoCobroDetalle.abono;
        }else{
            valorMovimientoSaldo = item.saldoOriginal;
        }

 
        this.cobrosDetalle.push({
            idCuentaPorCobrar: this.group.idCuentaPorCobrar,
            idCuotaPorCobrar: item.idCuotaPorCobrar,
            abono: this.fS.roundNumber(abono, this.MAX_NUMBER_ROUND),
            interes: item.interes,
            diasMora: item.diasMora,
            mora: item.mora,
            cuota: this.fS.roundNumber(item.cuota, this.MAX_NUMBER_ROUND),
            saldo,
            secuencial: this.indexDatoCobro,
            saldoOriginal: this.fS.roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND) 
        })
        item.saldo = this.fS.roundNumber(item.saldo, this.MAX_NUMBER_ROUND);
        item.saldoOriginal = this.fS.roundNumber(item.saldoOriginal - abono, this.MAX_NUMBER_ROUND); 
    }

    /**
     * 
     * @param {object} item item cuota  
     * @returns number
     */
    getValorSaldo(item) {
        // let total = item.abono + item.abonoPosfechado;
        // return this.fS.roundNumber(total, 5) === this.fS.roundNumber(item.cuota, 5) ? 0 : this.fS.roundNumber(item.saldo, 5);
        return this.fS.roundNumber(item.saldo, this.MAX_NUMBER_ROUND);
    }


    /**
         * 
         * @param {object} item  cuota
         * @returns {string} estado 
         */
    getEstadoCuota(item) {
        let estado = '';
        if (item.saldo === 0) estado = 'COBRADA'
        if (item.saldo > 0) estado = "PENDIENTE PARCIAL";
        if (item.abono === 0) estado = "PENDIENTE";
        return estado
    }

    // encodeURIComponent(JSON.stringify(jsonData))

    save(data) {
        return this.mS.getData('post', this.url + 'Insert', { data: data }, true)
            .catch(error => {
                throw error;
            })

    }

    getCuotas(query) {
        return this.mS.getData('get', 'Contabilidad/CuentaPorCobrar/?json=' + JSON.stringify(query), null, true)
            .catch(error => {
                throw error;
            })
    }

}


export {
    ModalCobroRapidoCtrl,
    ModalCobroLoteCtrl,
    ModalFormaCobroCtrl,
    ModalCobroDetalleCtrl
}



//====================================================START COBRO RAPIDO=====================================
//=====================================================================================================
ModalCobroRapidoCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    'mainService',
    'modalService',
    'nombreModalContabilidad',
    'toastService',
    'formulario',
    'params'
]


function ModalCobroRapidoCtrl($scope, $uibModalInstance, $injector, mS, modalSvc, nombreModalContabilidad, tS, fS, params) {

    const cuentaPorCobrarSvc = $injector.get('cuentaPorCobrarService');
    const comprobanteIngresoSvc = $injector.get('comprobanteIngresoService')

    let { data } = params;
    let { idCuentaPorCobrar } = data;
    let cobroSvc = new CobroService(tS, mS, fS);



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

    const NUM_MAX_ROUND = 5;

    $scope.entidadesFinancieras = [];
    $scope.subEntidadesFinancieras = [];



    function resetData() {
        $scope.cobro.valorAbono = $scope.comprobante.saldo;
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

    $scope.findSubEntidad = function (id) {
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
            showLoader();
            cuentaPorCobrarSvc.getDataForm(idCuentaPorCobrar).then(response => {
                let {
                    entidadesFinanciera,
                    bancos,
                    ciudades,
                    cuentaPorCobrar
                } = response;
                $scope.entidadesFinancieras = entidadesFinanciera;
                let dataEntidadFinanciera = $scope.entidadesFinancieras.find(val => val.codigo === 'EFE');


                $scope.bancos = bancos;

                $scope.ciudades = ciudades;

                if (cuentaPorCobrar.some(item => [null, undefined].includes(item.cuotas))) {
                    fS.sweetAlert('warning', 'No posee cuotas');
                    throw 'No posee cuotas'
                }

                $scope.selectedDocumentos = cuentaPorCobrar;

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
                console.log(error)
            }).finally(() => hideLoader());
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    $scope.openModalCobroAvanzado = async function () {
        try {
            let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
            let ctrl = nombreModalContabilidad.COBRO.controllers['CL'];
            let template = nombreModalContabilidad.COBRO.templates['CL'];
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


    $scope.setValorEfectivo = function () {
        let valorCambio = 0, saldo = 0;
        if ($scope.entidadFinanciera.codigo !== "EFE") return

        if (!(typeof $scope.cobro.valorAbono === 'number')) {
            $scope.cobro.valorCambio = 0
            $scope.cobro.abono = 0
            $scope.cobro.valorSaldo = 0;
            // tS.toastr('warning', 'Ingrese un número válido');
            return
        }

        if ($scope.cobro.valorAbono >= $scope.comprobante.saldo) {
            valorCambio = $scope.cobro.valorAbono - $scope.comprobante.saldo;
            $scope.cobro.valorCambio = fS.roundNumber(valorCambio, NUM_MAX_ROUND);
            $scope.cobro.abono = fS.roundNumber($scope.comprobante.saldo, NUM_MAX_ROUND);
            $scope.cobro.valorSaldo = 0;
        } else {
            $scope.cobro.valorSaldo = $scope.comprobante.saldo;

            saldo = $scope.cobro.valorSaldo - $scope.cobro.valorAbono;
            $scope.cobro.valorCambio = 0;
            $scope.cobro.valorSaldo = fS.roundNumber(saldo, NUM_MAX_ROUND);
            $scope.cobro.abono = fS.roundNumber($scope.cobro.valorAbono, NUM_MAX_ROUND)
        }
    }

    $scope.save = function () {
        try {
            if (!cobroSvc.isValidForm($scope.cobro, $scope.entidadFinanciera.codigo)) throw 'Form invalid'

            Swal.fire({
                // title: 'Guardar Cobro?',
                text: "Esta seguro de guardar este cobro?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    let comprobante = {
                        idCliente: $scope.comprobante.idCliente,
                        total: $scope.cobro.valorAbono,
                        abono: $scope.cobro.abono,
                        codEstab: $scope.comprobante.codEstab,
                        numeroIdentificacion: $scope.comprobante.identificacionComprador,
                        nombreFiscal: $scope.comprobante.razonSocialComprador
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
                        secuencial: 0,
                        infoCobro: $scope.entidadFinanciera.codigo === 'EFE' ? undefined : JSON.stringify(infoCobro),
                        abono: $scope.cobro.abono,
                        controlCaja: $scope.subEntidadesFinancieras.find(item => item.idSubEntidadFinanciera === $scope.cobro.idSubEntidadFinanciera).controlCaja,
                    }]

                    cobroSvc.valorAbono = $scope.cobro.valorAbono;

                    for (let item of $scope.selectedDocumentos) {
                        item.cuotas = JSON.parse(JSON.stringify(item.cuotasOriginal))
                    }


                    cobroSvc.cobrosDetalle = [];
                    cobroSvc.selectedDocumentos = $scope.selectedDocumentos;
                    cobroSvc.esAbonoPosfechado = $scope.cobro.posFechado;
                    cobroSvc.indexDatoCobro = 0;

                    cobroSvc.addFormaCobro();
                    let historialCobros = cobroSvc.getHistorialCobros(cobroSvc.selectedDocumentos);

                    if (cobroSvc.cobrosDetalle.length === 0) {
                        fS.sweetAlert('warning', 'Cobro detalle vacio')
                        throw 'Cobro detalle vacio';
                    }

                    let data = {
                        comprobante,
                        cobros,
                        cobroDetalle: cobroSvc.cobrosDetalle.filter(item => (item.abono > 0)),
                        historialCobros,
                    }

                    const params = comprobanteIngresoSvc.mapperTo(data);

                    showLoader();
                    comprobanteIngresoSvc.save(params).then(response => {
                        hideLoader();
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message)
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message, '', 1000)
                            $uibModalInstance.close(response)
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    })

                }
            })

        } catch (error) {
            hideLoader()
            console.log(error)
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}
//====================================================END COBRO RAPIDO=====================================
//=====================================================================================================



//====================================================START COBRO LOTE=====================================
//=====================================================================================================
ModalCobroLoteCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    '$injector',
    'mainService',
    'modalService',
    'nombreModalContabilidad',
    'toastService',
    'formulario',
    'params'
]
function ModalCobroLoteCtrl($scope, $uibModalInstance, $injector, mS, modalSvc, nombreModalContabilidad, tS, fS, params) {

    let cuentaPorCobrarSvc = $injector.get('cuentaPorCobrarService');

    const comprobanteIngresoSvc = $injector.get('comprobanteIngresoService');

    let cobroSvc = new CobroService(tS, mS, fS);
    let { data, selectedDocumentos } = params;

    //const NUM_MAX_ROUND = 4;
    //Cobro Lote
    $scope.dataSearch = {

    }


    $scope.options = {
        limitOptions: [5, 10, 15],
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true,
        limit: 5,
        page: 1
    }
    $scope.tipoDocumentos = [];



    let dataFormaCobro = {};
    $scope.comprobante = {};


    //let paymentStep = null;
    let stepSelectDoc = null;
    let stepCuotas = null;

    $scope.isPaymentDocument = false;
    $scope.isPaymentLote = false;
    $scope.footerActionStepUno = true;


    $scope.data = {};
    $scope.data.importeTotal = 0;
    $scope.data.totalMora = 0;
    $scope.data.totalSaldoDoc = 0;
    $scope.data.totalAbonoAnterior = 0;
    $scope.data.totalValorAbono = 0;
    $scope.data.totalSaldo = 0
    $scope.data.valorCambio = 0;

    $scope.indexDatoCobro = 0;

    $scope.datosCobro = [];
    $scope.cobrosDetalle = [];
    $scope.historialCobros = [];


    $scope.selectedDocumentos = [];


    $uibModalInstance.rendered.then(() => {
        stepSelectDoc = document.getElementById('stepSelectDocs');
        stepCuotas = document.getElementById('stepCuotas');

        if (data && data.idCuentaPorCobrar > 0) {
            $scope.stepCuotaPaymentDoc();
        }
    })

    //Cuentas por cobrar 
    $scope.isPaymentOfCuentaPorCobrar = false;



    loadInitialData();
    function loadInitialData() {
        try {
            showLoader();
            let idCuentaPorCobrar = null, idCliente = 0;
            if (Object.prototype.toString.call(data) === '[object Object]') {
                idCuentaPorCobrar = data.idCuentaPorCobrar;
                idCliente = data.idCliente;
            }
            if (selectedDocumentos !== null && Array.isArray(selectedDocumentos)) {
                idCliente = selectedDocumentos[0].idCliente;
            }
            cuentaPorCobrarSvc.getDataForm(idCuentaPorCobrar, idCliente).then(response => {

                dataFormaCobro = response;

                if (selectedDocumentos && Array.isArray(selectedDocumentos)) {
                    $scope.tipoDocumentos = structuredClone(selectedDocumentos);
                    $scope.selectedDocumentos = structuredClone(selectedDocumentos);

                    let dataSelectedDoc = selectedDocumentos[0];
                    $scope.comprobante = {
                        idCliente: dataSelectedDoc.idCliente,
                        razonSocialComprador: dataSelectedDoc.razonSocialComprador,
                        codEstab: dataSelectedDoc.codEstab,
                        identificacionComprador: dataSelectedDoc.identificacionComprador
                    }

                    $uibModalInstance.rendered.then(() => {
                        stepSelectDoc = document.getElementById('stepSelectDocs');
                        stepCuotas = document.getElementById('stepCuotas');
                        getTotalesCuota();
                        $scope.stepCuotaPaymentLote();
                        $("#paymentStep a:first-child").removeClass('active').addClass('disabled')
                    })
                    $scope.isPaymentOfCuentaPorCobrar = true;
                }

                //Cobro por documento 
                if (idCuentaPorCobrar > 0) {
                    let cuentaPorCobrar = response.cuentaPorCobrar;
                    if (cuentaPorCobrar.some(item => [null, undefined].includes(item.cuotas))) {
                        fS.sweetAlert('warning', 'No posee cuotas');
                        throw 'No posee cuotas'
                    }

                    $scope.selectedDocumentos = cuentaPorCobrar;

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
                    $uibModalInstance.rendered.then(() => {
                        stepSelectDoc = document.getElementById('stepSelectDocs');
                        stepCuotas = document.getElementById('stepCuotas');
                        getTotalesCuota();
                        $scope.stepCuotaPaymentLote();
                        $("#paymentStep a:first-child").removeClass('active').addClass('disabled')
                    })
                    $scope.isPaymentOfCuentaPorCobrar = true;
                }

            }).catch(error => {
                console.log(error)
            }).finally(() => hideLoader());
        } catch (error) {
            console.log(error)
        }
    }



    //Cobro desde Documento 
    // if (data && data.idCuentaPorCobrar > 0) {
    //     try {
    //         showLoader();
    //         $scope.isPaymentDocument = true;
    //         let query = {
    //             tipo: 3,
    //             codEstab: data.codEstab,
    //             idCliente: data.idCliente,  
    //             idCuentaPorCobrar,
    //             credito: data.tiempoCredito,
    //         }
    //         cobroSvc.getCuotas(query).then(response => {
    //             hideLoader();
    //             if (response.code === "0") {
    //                 throw response;
    //             }
    //             let mainDataRepository = JSON.parse(response.payload);
    //             initDataForm(mainDataRepository);

    //             let selectedDocumentos = mainDataRepository[5].map(item => ({
    //                 ...item,
    //                 cuotas: JSON.parse(item.cuotas),
    //             }))

    //             $scope.selectedDocumentos = selectedDocumentos.map(item => {
    //                 return {
    //                     ...item,
    //                     cuotaOriginal: JSON.parse(JSON.stringify(item.cuotas))
    //                 }
    //             })  
    //             $scope.comprobante = mainDataRepository[6][0];
    //             getTotalesCuota();
    //         }).catch(error => {
    //             hideLoader();
    //             console.log(error)
    //         })
    //     } catch (error) {
    //         hideLoader();
    //     }
    // } else {
    //     $scope.isPaymentLote = false; 
    // }

    // function initiload() {
    //     commonSvc.getEstabAsign().then(response => {
    //         $scope.establecimientos = response
    //         let codEstab = $scope.establecimientos.length > 0 ? $scope.establecimientos[0].codEstab : 0;
    //         $scope.dataSearch.codEstab = codEstab;
    //         $scope.cloneCodEstab = codEstab;
    //     })
    // }


    // function resetDataStepCuota() {
    //     $scope.selectedDocumentos = [];
    //     $scope.tipoDocumentos = [];

    //     getTotalesCuota();
    // }
    function getTotalesCuota() {
        let importeTotal = 0, abono = 0, saldo = 0, totalMora = 0, totalSaldoDoc = 0;
        for (let item of $scope.selectedDocumentos) {
            importeTotal += item.importeTotal;
            saldo += item.saldo;
            abono += item.abono;
            totalMora += item.mora || 0;
            totalSaldoDoc += item.saldoDoc || 0;
        }
        $scope.data.importeTotal = fS.roundNumber(importeTotal, 5);
        $scope.data.totalSaldo = fS.roundNumber(saldo, 5);
        $scope.data.totalAbonoAnterior = fS.roundNumber(abono, 5)
        $scope.data.totalMora = fS.roundNumber(totalMora, 5)
        $scope.data.totalSaldoDoc = fS.roundNumber(totalSaldoDoc, 5)
        $scope.data.totalValorAbono = 0;
        $scope.data.valorCambio = 0;

        //cuando se realiza cobro desde modulo de comprobante ingreso 
        if ($scope.isPaymentLote || $scope.isPaymentOfCuentaPorCobrar) {
            $scope.comprobante.importeTotal = $scope.data.importeTotal
            $scope.comprobante.abono = $scope.data.totalAbonoAnterior
            $scope.comprobante.saldo = $scope.data.totalSaldo
            $scope.comprobante.totalMora = $scope.data.totalMora;
        }
    }


    // $scope.onChangeEstablecimiento = async function () {
    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //             confirmButton: 'btn btn-success',
    //             cancelButton: 'btn btn-danger ml-2'
    //         },
    //         buttonsStyling: false
    //     })

    //     let { isConfirmed } = await swalWithBootstrapButtons.fire({
    //         title: '<small>Cambiar el Establecimiento?</small>',
    //         html: "<small>Esta seguró de cambiar el Establecimiento</small>",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Si, cambiar!',
    //         cancelButtonText: 'No, cancelar!',
    //         reverseButtons: false
    //     })

    //     if (isConfirmed) {
    //         $scope.cloneCodEstab = $scope.dataSearch.codEstab;
    //         resetDataStepCuota();
    //         $scope.getTipoDocumentos();
    //         $scope.$apply()
    //     } else {
    //         $scope.dataSearch.codEstab = $scope.cloneCodEstab;
    //         $scope.$apply()
    //     }
    // }

    // $scope.clienteSearch = function (textSearch) {
    //     let query = {
    //         textSearch
    //     }

    //     if (textSearch.length > 2) {
    //         return clienteSvc.search(query).catch(error => {
    //             console.log(error)
    //         })
    //     }
    // }

    // $scope.onKeyupClienteSearch = function () {
    //     if (!$scope.modelTextSearch) {
    //         $scope.dataSearch.byCliente = 0;
    //         $scope.comprobante.idCliente = 0;

    //         resetDataStepCuota();
    //     }
    // }


    // $scope.selectedClienteSearch = function (item) {
    //     $scope.dataSearch.byCliente = item.idCliente;

    //     resetDataStepCuota();

    //     $scope.getTipoDocumentos();
    // }

    // $scope.refreshDocs = function () {
    //     $scope.selectedDocumentos = [];
    //     $scope.tipoDocumentos = [];

    //     getTotalesCuota();

    //     $scope.getTipoDocumentos();
    // }

    // $scope.getTipoDocumentos = function () {
    //     try {

    //         if (!$scope.dataSearch.codEstab) {
    //             tS.toastr('warning', 'Seleccione el Establecimiento');
    //             return
    //         }

    //         if (!($scope.dataSearch.byCliente > 0)) {
    //             tS.toastr('warning', 'Seleccione el Cliente');
    //             return
    //         }

    //         let query = {
    //             tipo: 3,
    //             codEstab: $scope.dataSearch.codEstab,
    //             idCliente: $scope.dataSearch.byCliente
    //         }

    //         showLoader();
    //         cobroSvc.getCuotas(query).then(response => {
    //             if (response.code === '0') {
    //                 throw response;
    //             }
    //             hideLoader();
    //             let mainDataRepository = JSON.parse(response.payload);
    //             let tipoDocumentos = mainDataRepository[5];


    //             if (tipoDocumentos.length == 0) {
    //                 Swal.fire({
    //                     icon: 'info',
    //                     text: 'No se encontraron los documentos de este cliente!'
    //                 })
    //                 throw 'No se encontraron los documentos de este cliente'
    //             }
    //             initDataForm(mainDataRepository);


    //             //documentos.cuotas 
    //             $scope.tipoDocumentos = mainDataRepository[5].map(item => ({
    //                 ...item,
    //                 cuotas: JSON.parse(item.cuotas),
    //             })) 

    //             //Comprobante 
    //             let comprobante = mainDataRepository[6][0];
    //             $scope.comprobante = {
    //                 codEstab: $scope.dataSearch.codEstab,
    //                 idCliente: $scope.dataSearch.byCliente,
    //                 numeroIdentificacion: comprobante.numeroIdentificacion,
    //                 nombreFiscal: comprobante.nombreFiscal
    //             }
    //         }).catch(error => {
    //             hideLoader();
    //             console.log(error)
    //         })
    //     } catch (error) {
    //         hideLoader();
    //         console.log(error)
    //     }
    // }

    $scope.hasDatosCobro = () => $scope.datosCobro.length > 0;
    //Cuando Seleccionan los documentos 

    $scope.deleteDocSeleted = function (item) {
        let index = $scope.selectedDocumentos.indexOf(item);
        $scope.selectedDocumentos.splice(index, 1);
    }
    $scope.onSelectDoc = function (item) {
        try {

            if (item.cuotas === null || item.cuotas === undefined || item.cuotas.length === 0) {
                fS.sweetAlert('warning', `Documento ${item.tipoDoc} Nro.: ${item.serieComprobante} no posee cuotas`);
                $scope.deleteDocSeleted(item);
            }

            // if($scope.hastDatosCobro()){
            //     Swal.fire({
            //         //title: 'Are you sure?',
            //         text: "Tienes formas de cobro aplicados a los documentos seleccionados, desea borrar e iniciar nuevamente!",
            //         icon: 'warning',
            //         showCancelButton: true,
            //         confirmButtonColor: '#3085d6',
            //         cancelButtonColor: '#d33',
            //         confirmButtonText: 'Si!',
            //         cancelButtonText: 'No'
            //     }).then((result) => {
            //         if (result.isConfirmed) {
            //             $scope.datosCobro = [];    
            //             cobroSvc.cobrosDetalle = [];
            //             cobroSvc.indexDatoCobro = 0;
            //             cobroSvc.selectedDocumentos = [];                  
            //         }else{
            //             $scope.deleteDocSeleted(item);
            //         }
            //     })
            // }             

            // item.showCuota = true;
            // item.cuotaOriginal = JSON.parse(JSON.stringify(item.cuotas));

            getTotalesCuota();
        } catch (error) {
            console.log(error)
        }
    }


    $scope.onDesSelectDoc = function () {
        console.log('quitado elemento')
        // if($scope.cobrosDetalle.some(ccd=>ccd.idDocumento ===item.idDocumento && ccd.idTipoDocumento && item.idTipoDocumento)){
        //     $scope.selectedDocumentos.push(item);
        //     Swal.fire({
        //         //title: 'Are you sure?',
        //         text: "Tienes formas de cobro aplicados a este documento, no puedes deseleccionar!",
        //         icon: 'warning',               
        //     })
        // }
        getTotalesCuota();
        console.log('calculando totales ')
    }

    $scope.displayCuota = (item) => {
        item.display = !item.display
    }

    $scope.stepCuotaPaymentDoc = function () {
        $("#paymentStep a:first-child").removeClass('active').addClass('disabled')
        $("#paymentStep a:last-child").addClass('active')
        stepSelectDoc.style.display = 'none';
        stepCuotas.style.display = 'block';
    }

    //===================STEP COBRO LOTE=========

    //Por ahora no disponible
    $scope.stepSelectDocPaymentLote = function () {
        //     $scope.isPaymentDocument = true;
        if ($scope.isPaymentDocument || true) {
            fS.sweetAlert('warning', 'No Disponible');
            return
        }

        // if ($scope.hasDatosCobro()) {
        //     Swal.fire({
        //         //title: 'Are you sure?',
        //         text: "Tienes formas de cobro aplicados a los documentos seleccionados, desea borrar e iniciar nuevamente!",
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#3085d6',
        //         cancelButtonColor: '#d33',
        //         confirmButtonText: 'Si!',
        //         cancelButtonText: 'No'
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             $scope.datosCobro = [];
        //             cobroSvc.cobrosDetalle = [];
        //             cobroSvc.indexDatoCobro = 0;

        //             //Todas las cuotas en su estado original                     
        //             for (let item of $scope.selectedDocumentos) {
        //                 item.cuotas = JSON.parse(JSON.stringify(item.cuotaOriginal));
        //             }

        //             cobroSvc.selectedDocumentos = $scope.selectedDocumentos;

        //             getTotalesCuota();
        //             $scope.passingStepSelectedDoc();
        //         }
        //     })
        // } else {
        //     $scope.passingStepSelectedDoc();
        // }
    }

    //Seleccionar documentos 
    $scope.passingStepSelectedDoc = function () {
        $scope.footerActionStepUno = true;
        $scope.footerActionStepDos = false;


        $("#paymentStep a:first-child").addClass('active');
        $("#paymentStep a:last-child").removeClass('active');

        stepSelectDoc.style.display = 'block';
        stepCuotas.style.display = 'none';
    }

    $scope.stepCuotaPaymentLote = function () {
        if ($scope.selectedDocumentos.length === 0) {
            tS.toastr('warning', 'Seleccione al menos un Tipo de Documento', 'Siguiente');
            return
        }

        $scope.footerActionStepUno = false;
        $scope.footerActionStepDos = true;

        $("#paymentStep a:first-child").removeClass('active');
        $("#paymentStep a:last-child").addClass('active');

        stepSelectDoc.style.display = 'none';
        stepCuotas.style.display = 'block';

        cobroSvc.selectedDocumentos = $scope.selectedDocumentos;

    }

    $scope.openModalFormaCobro = async function () {
        try {
            if ($scope.data.totalSaldo == 0) {
                fS.sweetAlert('warning', 'No hay cuotas pendientes.')
                return
            }
            let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
            let ctrl = nombreModalContabilidad.COBRO.controllers['MFC'];
            let template = nombreModalContabilidad.COBRO.templates['MFC'];
            let controller = (await import(fileCtrl))[ctrl];

            let modalRef = modalSvc.openModalCustom({
                controller,
                template,
                size: 'lg',
                params: {
                    dataFormaCobro,
                    comprobante: $scope.comprobante,
                    saldo: $scope.data.totalSaldo,
                    datosCobro: $scope.datosCobro
                },
                isRenderRazorPartial: true
            })

            modalRef.result.then(result => {
                if (typeof result === 'object') {
                    try {
                        let { isPosFechado, valorAbono } = result;

                        cobroSvc.selectedDocumentos = $scope.selectedDocumentos;

                        cobroSvc.indexDatoCobro = $scope.datosCobro.length + 1;
                        cobroSvc.esAbonoPosfechado = isPosFechado;
                        cobroSvc.valorAbono = valorAbono;



                        //--------agregando abono ---
                        cobroSvc.addFormaCobro();

                        $scope.cobrosDetalle = cobroSvc.cobrosDetalle;
                        $scope.selectedDocumentos = cobroSvc.selectedDocumentos;

                        let abonoCuota = $scope.cobrosDetalle.filter(item => item.secuencial === cobroSvc.indexDatoCobro)
                            .reduce((prev, curr) => prev + curr.abono, 0)
                        $scope.addDatosCobro(result, abonoCuota);

                        calculoTotales();

                        fS.sweetAlert('success', 'Agregado Correctamente', '', 1000);
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            html: `<small>Algo salio mal: ${error}</small>`
                        })
                        console.log(error);
                    }
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    //-----------------------------------Datos Pago---------------------
    $scope.addDatosCobro = function (obj, abonoCuota) {
        $scope.datosCobro.push({
            ...obj,
            abonoCuota,
            secuencial: cobroSvc.indexDatoCobro
        })
    }

    $scope.showCobroDetalle = function (data) {
        let tempDetails = $scope.cobrosDetalle.filter(item => item.idCuotaPorCobrar === data.idCuotaPorCobrar && item.idCuentaPorCobrar === data.idCuentaPorCobrar);
        let infoCobrosDetalle = [];

        for (let pd of tempDetails) {
            if (pd.abono > 0) {
                let datoCobro = $scope.datosCobro.find(item => item.secuencial === pd.secuencial);
                infoCobrosDetalle.push({
                    ...pd,
                    subEntidadFinanciera: datoCobro.subEntidadFinanciera,
                    posFechado: datoCobro.posFechado ? 'SI' : 'NO'
                })
            }
        }

        let index = 1;
        let message = '';

        message = `<table class="table table-bordered table-sm">
                                <thead>
                                    <tr class="small">
                                        <th>N°</th>                                
                                        <th>Entidad Financiera</th>                                
                                        <th>Abono</th>
                                        <th>Saldo</th>
                                        <th>PosFechado</th>
                                    </tr>
                                </thead>
                                <tbody>`
        for (const item of infoCobrosDetalle) {
            message += `<tr class="small">
                                    <td>${index++}</td>                                                            
                                    <td>${item.subEntidadFinanciera}</td>                                                            
                                    <td>${item.abono}</td>
                                    <td>${item.saldo}</td>
                                    <td>${item.posFechado}</td>
                                </tr>`

        }
        message += `</tbody></table>`

        Swal.fire({
            icon: 'info',
            title: `<span>Cuota ${data.nroCuota}:</span> $${data.cuota} <br> <span>Mora:</span> $${data.mora}`,
            width: 600,
            html: message
        })

    }


    $scope.displayInfoDatosCobro = (item) => {
        item.display = !item.display
    }

    //Calculo de abono y saldo una vez agregado el forma pago 
    function calculoTotales() {

        let { totalValorAbono, totalValorAbonoEfectivo } = $scope.datosCobro.reduce((prev, curr) => {
            prev.totalValorAbono += curr.valorAbono;
            if (curr.codEntidadFinanciera === "EFE") {
                prev.totalValorAbonoEfectivo += curr.valorAbono;
            }
            return prev;
        }, {
            totalValorAbono: 0,
            totalValorAbonoEfectivo: 0
        })
        let totalSaldo = $scope.selectedDocumentos.flatMap(item => item.cuotas)
            .reduce((prev, curr) => prev + curr.saldo, 0);
        let valorCambio = 0;

        $scope.data.totalValorAbono = fS.roundNumber(totalValorAbono, 5);
        $scope.data.totalSaldo = fS.roundNumber(totalSaldo, 5);


        if (totalValorAbonoEfectivo >= $scope.comprobante.saldo) {
            valorCambio = totalValorAbonoEfectivo - $scope.comprobante.saldo
        }

        $scope.data.valorCambio = fS.roundNumber(valorCambio, 5);

    }


    $scope.askToDeleteDatoPago = (item) => {
        try {
            Swal.fire({
                html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar'
            }).then(result => {
                if (result.isConfirmed) {

                    $scope.$apply(() => {

                        cobroSvc.cobrosDetalle = [];
                        $scope.cobrosDetalle = [];

                        // cobroSvc.selectedDocumentos = []
                        // $scope.selectedDocumentos = [];


                        let index = $scope.datosCobro.indexOf(item);
                        $scope.datosCobro.splice(index, 1);

                        //Todas las cuotas en su estado original                     
                        for (let item of $scope.selectedDocumentos) {
                            item.cuotas = structuredClone(item.cuotasOriginal);
                        }

                        cobroSvc.selectedDocumentos = $scope.selectedDocumentos;

                        getTotalesCuota();

                        if ($scope.datosCobro.length == 0) return

                        //Recalculamos las cuotas con los abonos restantes   
                        $scope.indexDatoCobro = 0;
                        cobroSvc.indexDatoCobro = $scope.indexDatoCobro;
                        for (let item of $scope.datosCobro) {
                            $scope.indexDatoCobro++;
                            cobroSvc.indexDatoCobro = $scope.indexDatoCobro;

                            cobroSvc.valorAbono = item.valorAbono;
                            cobroSvc.esAbonoPosfechado = item.isPosfechado;

                            //--------agregando abono ---
                            cobroSvc.addFormaCobro();
                        }

                        $scope.cobrosDetalle = cobroSvc.cobrosDetalle;

                        calculoTotales();
                    })

                }
            })
        } catch (error) {
            console.log(error)
        }
    }


    $scope.save = function () {

        try {
            if (!($scope.comprobante.idCliente > 0)) {
                fS.sweetAlert('warning', 'Seleccione el cliente')
                return
            }
            if ($scope.datosCobro.length === 0) {
                fS.sweetAlert('warning', 'Ingrese al menos un abono')
                return
            }

            if ($scope.cobrosDetalle.length === 0) {
                fS.sweetAlert('warning', 'Cobro detalle vacio!')
                return
            }

            Swal.fire({
                title: '<small>Guardar Cobro</small>',
                html: "<small class='text-muted'>Esta seguro de guardar este cobro ahora?</small>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!'
            }).then((result) => {

                if (result.isConfirmed) {

                    let historial = cobroSvc.getHistorialCobros($scope.selectedDocumentos);

                    let comprobante = {
                        idCliente: $scope.comprobante.idCliente,
                        total: $scope.datosCobro.reduce((acc, curr) => acc + curr.valorAbono, 0),
                        abono: $scope.datosCobro.reduce((acc, curr) => acc + curr.abonoCuota, 0),
                        codEstab: $scope.comprobante.codEstab,
                        numeroIdentificacion: $scope.comprobante.identificacionComprador,
                        nombreFiscal: $scope.comprobante.razonSocialComprador,
                    }

                    let cobros = $scope.datosCobro.map(item => {
                        let infoCobro = [{
                            nro: item.nro,
                            lote: item.lote,
                            aprobacion: item.aprobacion,
                            referencia: item.referencia
                        }]
                        let obj = {
                            idSubEntidadFinanciera: item.idSubEntidadFinanciera,
                            idEntidadFinanciera: item.idEntidadFinanciera,
                            idBanco: item.idBanco,
                            idCuentaBancaria: 0,
                            fechaEmision: item.fechaEmision,
                            valor: item.valorAbono,
                            posfechado: item.posFechado,
                            secuencial: item.secuencial,
                            infoCobro: item.codEntidadFinanciera === 'EFE' ? undefined : JSON.stringify(infoCobro),
                            abono: item.abonoCuota,
                            controlCaja: item.controlCaja,
                            idComprobante: item.idComprobante,
                            idTipoDocumento: item.idTipoDocumento
                        }
                        return obj;
                    })


                    let data = {
                        comprobante,
                        cobros,
                        cobroDetalle: $scope.cobrosDetalle.filter(item => (item.abono > 0)),
                        historialCobros: historial,
                    }

                    

                    let params = comprobanteIngresoSvc.mapperTo(data);

                    showLoader();
                    comprobanteIngresoSvc.post(params).then(response => {
                        hideLoader();
                        if (response.code === '0') {
                            fS.sweetAlert('warning', response.message)
                        }
                        if (response.code === '1') {
                            fS.sweetAlert('success', response.message, '', 1000)
                            $uibModalInstance.close(response)
                        }
                    }).catch(error => {
                        hideLoader();
                        console.log(error)
                    })
                }
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }



    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}

//====================================================END COBRO LOTE=====================================
//=====================================================================================================


//====================================================FORMA COBRO=====================================
//=====================================================================================================

ModalFormaCobroCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', 'params']

function ModalFormaCobroCtrl($scope, $uibModalInstance, $injector, params) {
    const fS = $injector.get('formulario');
    const tS = $injector.get('toastService');

    let { dataFormaCobro, comprobante, saldo, datosCobro } = params;
    let { documentos, entidadesFinanciera, bancos, ciudades } = dataFormaCobro;

    let cobroSvc = new CobroService(tS)
    const VALOR_ABONO_ORIGINAL = saldo;

    $scope.data = {
        posFechado: false
    }

    $scope.comprobante = comprobante;

    $scope.data.fechaEmision = new Date();
    $scope.data.valorAbono = saldo;

    //Entidad Financiera Documento 
    $scope.documentosElectronicos = [];
    $scope.selectedDocElectronico = []

    $scope.options = {
        rowSelection: true,
        multiSelect: false,
    }

    //False en caso de ser Entidad Financiera (Documento) 
    $scope.showBtnAdd = true;

    $scope.selectedIndexTab = 0;

    loadInitialData();

    function loadInitialData() {
        try {
            $scope.entidadesFinanciera = entidadesFinanciera;
            $scope.selectedIndexTab = $scope.entidadesFinanciera.findIndex(item => item.codigo === 'EFE');

            $scope.bancos = bancos;
            $scope.ciudades = ciudades;

            $scope.documentosElectronicos = documentos;
        } catch (error) {
            console.log(error)
        }
    }

    // function initialLoad() {
    //     try {
    //         $scope.entidadesFinancieras = entidadesFinancieras;

    //         $scope.selectedIndexTab = $scope.entidadesFinancieras.findIndex(item => item.codigo === 'EFE');

    //         $scope.bancos = bancos;
    //         $scope.ciudades = ciudades

    //         //Documentos Retencion Compra y Nota de Credito
    //         $scope.documentosElectronicos = documentos.map(item => {
    //             return {
    //                 ...item,
    //                 tipoDoc: item.codDoc
    //             }
    //         })

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    $scope.onChangeTabEntidadFinanciera = () => {
        try {

            let { descripcion, idEntidadFinanciera, codigo, subEntidadesFinanciera } = $scope.entidadesFinanciera.at($scope.selectedIndexTab)

            if (codigo === 'DOC') {
                document.getElementById('btnAddFormaPago').style.display = 'none';
            } else {
                document.getElementById('btnAddFormaPago').style.display = 'block';
            }

            $scope.subEntidadesFinanciera = subEntidadesFinanciera;

            $scope.data.idEntidadFinanciera = idEntidadFinanciera;
            if ($scope.subEntidadesFinanciera.length > 0) {
                $scope.data.idSubEntidadFinanciera = $scope.subEntidadesFinanciera[0].idSubEntidadFinanciera;
            } else {
                tS.toastr(`${descripcion}: No tiene SubEntidad Financiera creda`);
            }

            $scope.data.valorAbono = VALOR_ABONO_ORIGINAL
            $scope.data.idBanco = 0;
            $scope.data.idCiudad = 0;
            $scope.data.referencia = null;
            $scope.data.nro = null;
            $scope.data.lote = null;
            $scope.data.aprobacion = null;
            $scope.data.posFechado = false;
            $scope.selectedDocElectronico = [];
            $scope.data.fechaEmision = new Date();

            if (codigo === 'CHE') {
                $scope.data.referencia = $scope.comprobante.razonSocialComprador;
            }

        } catch (error) {
            console.log(error);
        }
    }



    $scope.addFormaPago = function () {
        try {
            let codigo = $scope.entidadesFinanciera[$scope.selectedIndexTab].codigo;
            if (!cobroSvc.isValidForm($scope.data, codigo)) throw 'Form Invalid';

            $uibModalInstance.close(getDataPago());

        } catch (error) {
            console.log(error)
        }

    }

    function getDataPago(item = {}) {
        try {
            let entidadFinanciera = $scope.entidadesFinanciera.find(item => item.idEntidadFinanciera === $scope.data.idEntidadFinanciera);
            let subEntidadFinanciera = entidadFinanciera.subEntidadesFinanciera.find(item => item.idSubEntidadFinanciera === $scope.data.idSubEntidadFinanciera);

            let ciudad = $scope.ciudades.find(item => item.idCiudad === $scope.data.idCiudad);
            let banco = $scope.bancos.find(item => item.idBanco === $scope.data.idBanco);

            let formattedDateTime = fS.formatDateMoment($scope.data.fechaEmision);
            return {
                //Info
                entidadFinanciera: entidadFinanciera.descripcion,
                subEntidadFinanciera: subEntidadFinanciera.descripcion,

                ciudad: ciudad && ciudad.descripcion,
                banco: banco && banco.descripcion,

                //Data
                idEntidadFinanciera: entidadFinanciera.idEntidadFinanciera,
                idSubEntidadFinanciera: subEntidadFinanciera.idSubEntidadFinanciera,
                codEntidadFinanciera: entidadFinanciera.codigo,
                idBanco: $scope.data.idBanco,
                idCiudad: $scope.data.idCiudad,
                fechaEmision: formattedDateTime,
                posFechado: $scope.data.posFechado,
                referencia: $scope.data.referencia,
                aprobacion: $scope.data.aprobacion,
                lote: $scope.data.lote,

                //Data Documento 
                nro: item.serieComprobante || $scope.data.nro,
                idTipoDocumento: item.idTipoDocumento,
                idComprobante: item.idDocumento,
                tipoDocumento: item.tipoDocumento || item.codDoc,
                valorAbono: item.saldo || $scope.data.valorAbono,
                controlCaja: subEntidadFinanciera.controlCaja
            }
        } catch (error) {
            console.log(error);
        }
    }


    $scope.addDocumentoElectronico = function (item) {
        if (item.saldo === 0) {
            tS.toastr('warning', 'El Valor de Abono tiene que ser mayor a 0', 'Cobro');
            return
        }

        if (datosCobro.some(dataCobro => dataCobro.idTipoDocumento === item.idTipoDocumento && dataCobro.idComprobante === item.idDocumento)) {
            $scope.selectedDocElectronico = [];
            fS.sweetAlert('warning', 'Este documento ya fue aplicado al cobro');
            $(".swal2-container").css("z-index", "999999");
            return
        }
        Swal.fire({
            html: `<small>Abonar el valor <h3>$${item.saldo}</h3> del Documento ${item.codDoc == 'A' ? item.serieComprobante : item.tipoDoc}?</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, abonar',
            cancelButtonText: 'No, cancelar'
        }).then(result => {
            if (result.isConfirmed) {


                $uibModalInstance.close(getDataPago(item))
            } else {
                $scope.selectedDocElectronico = [];
                $scope.$apply();
            }
        })
        $(".swal2-container").css("z-index", "999999");
    }



    $scope.closeModal = function () {
        $uibModalInstance.close();
    }


}




//======================================================DETALLE COBRO====================================
ModalCobroDetalleCtrl.$inject = ['$scope', '$mdDialog', 'mainService', 'toastService', 'formulario', 'params']

function ModalCobroDetalleCtrl($scope, $mdDialog, mS, tS, fS, params) {
    // let cobroSvc = new CobroService(tS, mS, fS);

    $scope.showDetalleCompIngreso = false;
    $scope.showDetalleCompIngresoByDoc = false;

    $scope.comprobante = {};
    $scope.cobros = [];
    $scope.cobroDetalles = [];


    initialLoad();
    function initialLoad() {
        try {
            showLoader();
            if (params && params.idComprobanteIngreso > 0) {
                $scope.showDetalleCompIngreso = true;
                let query = {
                    tipo: 2,
                    idComprobanteIngreso: params.idComprobanteIngreso
                }
                mS.getData('get', 'Contabilidad/ComprobanteIngreso/?json=' + JSON.stringify(query), null, true).then(response => {
                    hideLoader();
                    if (response.code === '0') {
                        throw response;
                    }
                    let mainDataRepository = JSON.parse(response.payload);

                    $scope.comprobante = mainDataRepository[0][0],
                        $scope.cobros = mainDataRepository[1],
                        $scope.cobroDetalles = mainDataRepository[2]

                    for (let item of $scope.cobros) {
                        item.infoCobro = JSON.parse(item.infoCobro)
                        item.cobroDetalles = $scope.cobroDetalles.filter(itemDetalle => itemDetalle.idCobro === item.idCobro);
                        item.showInfoCobro = item.codPago !== 'EFE'
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            } else if (params && params.idCuentaPorCobrar > 0) {
                $scope.showDetalleCompIngresoByDoc = true;

                let query = {
                    tipo: 3,
                    idCuentaPorCobrar: params.idCuentaPorCobrar
                }
                mS.getData('get', 'Contabilidad/ComprobanteIngreso/?json=' + JSON.stringify(query), null, true).then(response => {
                    hideLoader();
                    if (response.code === '0') {
                        throw response;
                    }

                    let mainDataRepository = JSON.parse(response.payload);
                    $scope.comprobante = mainDataRepository[0][0];
                    let comprobanteIngresos = mainDataRepository[1];

                    let cobros = mainDataRepository[2];
                    $scope.cobroDetalles = mainDataRepository[3];



                    for (let item of $scope.cobros) {
                        item.infoCobro = JSON.parse(item.infoCobro)
                        item.cobroDetalles = $scope.cobroDetalles.filter(itemDetalle => itemDetalle.idCobro === item.idCobro);

                    }

                    $scope.comprobanteIngresos = comprobanteIngresos.map(item => {
                        item.cobros = cobros.filter(cc => cc.idComprobanteIngreso === item.idComprobanteIngreso)
                            .map(cobro => {
                                cobro.infoCobro = JSON.parse(cobro.infoCobro)
                                cobro.showInfoCobro = cobro.codPago !== 'EFE'
                                return cobro;
                            })
                        return item;
                    })


                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }

        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }
    // let {comprobante, cobros, cobroDetalles} = params;
    // $scope.comprobante = comprobante;

    // $scope.cobros = cobros;


    $scope.expandDetalle = (data) => {
        data.showDetalle = !data.showDetalle;
    }

    $scope.showInfo = function (item) {
        let info = item.infoCobro && item.infoCobro[0] || {};

        Swal.fire({
            icon: 'info',
            html: `<div class="table-responsive">
            <table class="table table-hover table-borderless table-sm">
                <tbody>
                    <tr>
                        <td><b>Número:</b></td>
                        <td>${info.nro || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Referencia:</b></td>
                        <td>${info.referencia || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Lote:</b></td>
                        <td>${info.lote || '...'}</td>
                    </tr>
                    <tr>
                        <td><b>Aprobación:</b></td>
                        <td>${info.aprobacion || '...'}</td>
                    </tr>                       
                </tbody>
            </table>
        </div>`
        })

    }

    $scope.showCuotas = function (data) {
        let cobroDetalles = $scope.cobroDetalles.filter(item => item.idCobro === data.idCobro);

        let html = `<div class="table-responsive">
                    <table class="table table-hover table-bordered table-sm">
                        <thead>
                            <tr>
                                <th><small>N°</small></th>                              
                                <th><small>Nro. Cuota</small></th>                              
                                <th><small>Fecha Vcto.</small></th>
                                <th><small>Cuota</small></th>
                                <th><small>Abono</small></th>
                                <th><small>Saldo</small></th>
                            </tr>
                        </thead>
                        <tbody>`;

        let index = 1;
        for (let itemDetalle of cobroDetalles) {
            html += ` <tr>
                        <td>${index++}</td>
                        <td>${itemDetalle.nroCuota}</td>
                        <td>${itemDetalle.fechaVencimiento}</td>
                        <td>$${itemDetalle.cuota}</td>
                        <td>$${itemDetalle.abono}</td>
                        <td>$${itemDetalle.saldo}</td>
                    </tr>
                `
        }
        html += '</tbody></table></div>'
        Swal.fire({
            title: '<small>Detalle Cobro</small>',
            icon: 'info',
            html,
            with: 700
        })

    }

    $scope.closeDialog = function () {
        $mdDialog.cancel();
    };
}

