 
class CobroService {
    constructor(tS, mS, fS) { 
        this.tS = tS;
        this.mS = mS;
        this.fS = fS;

        this.selectedDocumentos = [];
        this.cobrosDetalle = [];
        this.historialCuentas = [];

        this.cuentasPorCobrarEstado = [];
        this.cuotasPorCobrarEstado = [];

        this.estadosPago = [];
        this.valorAbono = 0;

        this.esAbonoPosfechado = false;
        this.indexDatoCobro = 0; 

        this.MAX_NUMBER_ROUND = 5;
        this.MAX_NUMBER_ROUND_GENERAL = 3;
        this.MAX_NUMBER_ROUND_CUOTA_ABONO = 5;
        
    }
    set setEstadosPago(estadosPago){
        this.estadosPago = estadosPago;
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
     * @param {*} historialCuentas 
     * @param {*} cobros 
     * @param {*} cobrosDetalle 
     */
    generarCuentasPorCobrarEstado({historialCuentas, cobrosDetalle}){
        // Your existing code snippet with modifications for decimal.js
        let cuentasPorCobrarAgrupado = historialCuentas.reduce((acc, curr) => {
            let existeDato = acc.find(dataCxc => dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar);
            if (!existeDato) {
                acc.push({
                    idCuentaPorCobrar: curr.idCuentaPorCobrar,
                    valorSaldoLectura: new Decimal(curr.valorSaldoLectura),
                    abono: new Decimal(curr.abono),
                    diasMora: curr.diasMora,
                    mora: curr.mora
                });
            } else {
                existeDato.abono = new Decimal(existeDato.abono).plus(curr.abono);
            }
            return acc;
        }, []);

        let cuentasPorCobrarEstado = [];

        for (let item of cuentasPorCobrarAgrupado) {
            let valorSaldo = new Decimal(item.valorSaldoLectura);
            let totalPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && cd.posfechado)
                .reduce((acc, curr) => acc.plus(curr.abono), new Decimal(0));

            let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === item.idCuentaPorCobrar && !cd.posfechado)
                .reduce((acc, curr) => acc.plus(curr.abono), new Decimal(0));

          

            valorSaldo = valorSaldo.minus(totalNoPosfechado).toNumber()

            let dataEstadoPago;
            if (totalPosfechado.gt(0)) {
                dataEstadoPago = this.getEstadoCuota({
                    esPosfechado: true
                });
            } else {
                dataEstadoPago = this.getEstadoCuota({
                    saldo: valorSaldo,
                    abono: totalNoPosfechado.toNumber()
                });
            }

            cuentasPorCobrarEstado.push({
                idCuentaPorCobrar: item.idCuentaPorCobrar,
                idEstadoPago: dataEstadoPago.idEstadoPago,
                abono: totalNoPosfechado.toNumber()
            });
        }

        return cuentasPorCobrarEstado;

    }

    generarHistorialCuentaPorCobrar(){  
    }

    generarCuotasPorCobrarEstado({ cobrosDetalle }){ 

        let cuotasPorCobrarAgrupado = cobrosDetalle.reduce((acc, curr) => {
            let existeDato = acc.find(dataCxc => (dataCxc.idCuentaPorCobrar === curr.idCuentaPorCobrar) && (dataCxc.idCuotaPorCobrar === curr.idCuotaPorCobrar));
            if (!existeDato) {
                acc.push({
                    idCuentaPorCobrar: curr.idCuentaPorCobrar,
                    idCuotaPorCobrar: curr.idCuotaPorCobrar,
                    valorSaldoLectura: curr.valorSaldoLectura,
                    abono: new Decimal(curr.abono)
                });
            } else {
                existeDato.abono = new Decimal(existeDato.abono).plus(curr.abono);
            }
            return acc;
        }, []);

        let cuotasPorCobrarEstado = [];

        for (let item of cuotasPorCobrarAgrupado) {
            let totalNoPosfechado = cobrosDetalle.filter(cd => cd.idCuotaPorCobrar === item.idCuotaPorCobrar && !cd.posfechado)
                .reduce((acc, curr) => {
                    return new Decimal(acc).plus(curr.abono);
                }, new Decimal(0));

            let valorSaldoLectura = this.fS.roundNumber(item.valorSaldoLectura, 3);
            let valorSaldo = new Decimal(valorSaldoLectura)
                .minus(this.fS.roundNumber(totalNoPosfechado.toNumber(),3))
                .toNumber();

            let dataEstadoPago = this.getEstadoCuota({
                saldo: valorSaldo,
                abono: item.abono.toNumber() // Convert Decimal back to number if needed
            });

            cuotasPorCobrarEstado.push({
                idEstadoPago: dataEstadoPago.idEstadoPago,
                abono: totalNoPosfechado.toNumber(),
                idCuotaPorCobrar: item.idCuotaPorCobrar
            });
        }

        return cuotasPorCobrarEstado;

    }
    
    
    addFormaCobro() {

        for (let group of this.selectedDocumentos) {

            this.group = group;

            if (typeof this.valorAbono !== 'number' || this.valorAbono > 0) {
                //let valorMovimientoSaldo = 0, historialAbono = 0;
                let valorMovimientoSaldo = new Decimal(0), historialAbono = new Decimal(0);

                const cobrosDetalleFiltered = this.cobrosDetalle.filter(cd => cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar)

                //const totalAbonoCuenta = this.fS.roundNumber(cobrosDetalleFiltered.reduce((acc, curr) => acc + curr.abono, 0), this.MAX_NUMBER_ROUND_GENERAL);

                const totalAbonoCuenta = cobrosDetalleFiltered.reduce((acc, curr) => acc.plus(curr.abono), new Decimal(0));



                if (cobrosDetalleFiltered.length === 0) {

                    let historialCuentasFiltered = this.historialCuentas.filter(cd => (
                        cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar && cd.secuencial === this.indexDatoCobro
                    ));

                    let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                    if (dataUltimoCobroDetalle) {

                        valorMovimientoSaldo = new Decimal(dataUltimoCobroDetalle.saldo).minus(dataUltimoCobroDetalle.abono).toNumber();

                       // valorMovimientoSaldo = dataUltimoCobroDetalle.saldo - dataUltimoCobroDetalle.abono;
                    } else {
                       // valorMovimientoSaldo = group.saldo;
                        valorMovimientoSaldo = new Decimal(this.group.saldo).toNumber();
                    }

                    if (this.valorAbono <= this.group.saldo) {
                        historialAbono = this.valorAbono;

                    } else if (this.valorAbono >= this.group.saldo) {
                        historialAbono = this.group.saldo;
                    }

                      

                    this.historialCuentas.push({
                        secuencial: this.indexDatoCobro,
                        valorSaldoLectura: this.group.valorSaldoLectura,
                        idCuentaPorCobrar: this.group.idCuentaPorCobrar,
                      //  abono: this.fS.roundNumber(historialAbono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                      //  saldo: this.fS.roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                        abono: new Decimal(historialAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                        saldo: new Decimal(valorMovimientoSaldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                        diasMora: this.group.diasMora,
                        mora: this.group.mora,
                    })

                }
                if (cobrosDetalleFiltered.length > 0) {
                    if (totalAbonoCuenta !== this.fS.roundNumber(this.group.saldo, this.MAX_NUMBER_ROUND_GENERAL)) {

                        let historialCuentasFiltered = this.historialCuentas.filter(cd => (
                            cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar
                        ));

                        let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                        if (dataUltimoCobroDetalle) {

                            valorMovimientoSaldo = new Decimal(dataUltimoCobroDetalle.saldo).minus(dataUltimoCobroDetalle.abono).toNumber();
 
                        } else {
                            valorMovimientoSaldo = new Decimal(this.group.saldo).toNumber();
                        }

                        if (this.valorAbono <= valorMovimientoSaldo) {
                            historialAbono = this.valorAbono;

                        } else {
                            historialAbono = valorMovimientoSaldo
                        }
 

                        this.historialCuentas.push({
                            secuencial: this.indexDatoCobro,
                            valorSaldoLectura: this.group.valorSaldoLectura,
                            idCuentaPorCobrar: this.group.idCuentaPorCobrar,
                     
                            abono: new Decimal(historialAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                            saldo: new Decimal(valorMovimientoSaldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
                            diasMora: this.group.diasMora,
                            mora: this.group.mora,
                        })
                    }
                } 
              
            }



            for (let item of group.cuotas) {

                item.abonoPosfechado = 0;


                if (typeof this.valorAbono !== 'number' || this.valorAbono === 0) return;

                //Si la cuota no tiene ningún abono

                if (item.abono > 0) {
                    this.cuotaConAbono(item)
                } else {
                    this.cuotaSinAbono(item)
                }

                // item.cuota = this.fS.roundNumber(item.cuota, this.MAX_NUMBER_ROUND);
                // item.abono = this.fS.roundNumber(item.abono, this.MAX_NUMBER_ROUND);
                // item.abonoPosfechado = this.fS.roundNumber(item.abonoPosfechado, this.MAX_NUMBER_ROUND);

                item.cuota = new Decimal(item.cuota).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
                item.abono = new Decimal(item.abono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
                item.abonoPosfechado = new Decimal(item.abonoPosfechado).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
               
                let dataEstadoPago = this.getEstadoCuota({
                    saldo: item.saldo,
                    abono: item.abono
                });
                item.estado = dataEstadoPago.descripcion;


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
          //  let valorSaldoCta = item.saldoCta - this.valorAbono;

            item.saldoCta = new Decimal(item.saldoCta).minus(this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();


          //  item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);
        } else if (item.saldoCta <= this.valorAbono) {
            item.saldoCta = 0;
        }

        //Validaciones Saldo 
        if (item.saldo >= this.valorAbono) {

            //Si el Abono pago no es Posfechado
            item.abono = this.esAbonoPosfechado ? 0 : this.valorAbono;

            //Si el abono pago es posfechado
            item.abonoPosfechado = this.esAbonoPosfechado ? this.valorAbono : 0;

            //let valorSaldo = item.saldo - this.valorAbono;
            item.saldo = new Decimal(item.saldo).minus(this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

            // let valorSaldoCta = item.saldoCta - this.valorAbono;
            //item.saldo = this.fS.roundNumber(valorSaldo, this.MAX_NUMBER_ROUND);
            // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);

            this.addCobroDetalle(item, this.valorAbono, item.saldo)
            this.valorAbono = 0;

        } else if (item.saldo <= this.valorAbono) {

            //Si el Abono pago no es Posfechado
            item.abono = this.esAbonoPosfechado ? 0 : new Decimal(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

            //Si el abono pago es posfechado
            item.abonoPosfechado = this.esAbonoPosfechado ? new Decimal(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber() : 0;

            //this.valorAbono = this.valorAbono - item.saldo;
            this.valorAbono = new Decimal(this.valorAbono).minus(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

            this.addCobroDetalle(item, item.saldo, 0)
            item.saldo = 0; 
        }

    }

    /**
    * 
    * @param {object} item 
    */
    cuotaConAbono(item) {

        //Validaciones Saldo Cuota 
        if (item.saldoCta >= this.valorAbono) {
         //   let valorSaldoCta = item.saldoCta - this.valorAbono;
         //   item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);

            item.saldoCta = new Decimal(item.saldoCta).minus(this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();

        } else if (item.saldoCta <= this.valorAbono) {
            item.saldoCta = 0;
        }

        //Validaciones Saldo 

        if (item.saldo >= this.valorAbono) {

            item.abono = this.esAbonoPosfechado ? item.abono : new Decimal(item.abono).plus(this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
            item.abonoPosfechado = this.esAbonoPosfechado ? new Decimal(item.abonoPosfechado).plus(this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber() : item.abonoPosfechado;

            item.saldo = new Decimal(item.saldo).minus(this.valorAbono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
 

            this.addCobroDetalle(item, this.valorAbono, item.saldo);
            this.valorAbono = 0;


        } else if (item.saldo <= this.valorAbono) {
            item.abono = this.esAbonoPosfechado ? item.abono : new Decimal(item.abono).plus(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
            item.abonoPosfechado = this.esAbonoPosfechado ? new Decimal(item.abonoPosfechado).plus(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber() : item.abonoPosfechado;

            this.addCobroDetalle(item, item.saldo, 0);

            this.valorAbono = new Decimal(this.valorAbono).minus(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
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
        if (item.cuota === 0 || abono === 0) return;

        let valorMovimientoSaldo = 0;
        let cobrosDetalleFiltered = this.cobrosDetalle.filter(cd => (
            cd.idCuentaPorCobrar === this.group.idCuentaPorCobrar &&
            cd.idCuotaPorCobrar === item.idCuotaPorCobrar
        ))

        let dataUltimoCobroDetalle = cobrosDetalleFiltered.pop();
        if (dataUltimoCobroDetalle) {
            valorMovimientoSaldo = new Decimal(dataUltimoCobroDetalle.saldoOriginal).minus(dataUltimoCobroDetalle.abono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
        } else {
            valorMovimientoSaldo = new Decimal(item.saldoOriginal).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber();
        }

 
        this.cobrosDetalle.push({
            idCuentaPorCobrar: this.group.idCuentaPorCobrar,
            idCuotaPorCobrar: item.idCuotaPorCobrar,
            abono,
          //  abono: this.fS.roundNumber(abono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
            interes: item.interes,
            diasMora: item.diasMora,
            mora: item.mora,
            cuota: new Decimal(item.cuota).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
          //  cuota: this.fS.roundNumber(item.cuota, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
            saldo: new Decimal(saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
            secuencial: this.indexDatoCobro,
            valorSaldoLectura: item.valorSaldoLectura,
          //  saldoOriginal: this.fS.roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
            saldoOriginal: new Decimal(valorMovimientoSaldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber(),
            posfechado: this.esAbonoPosfechado
        })
      //  item.saldo = this.fS.roundNumber(item.saldo, this.MAX_NUMBER_ROUND);
      //  item.saldoOriginal = this.fS.roundNumber(item.saldoOriginal - abono, this.MAX_NUMBER_ROUND);
        item.saldo = new Decimal(item.saldo).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber() 
        item.saldoOriginal = new Decimal(item.saldoOriginal).minus(abono).toDecimalPlaces(this.MAX_NUMBER_ROUND).toNumber()
    }

  


    /**
     * 
     * @param {*} saldo 
     * @param {*} abono 
     * @returns 
     */
    getEstadoCuota({saldo, abono, esPosfechado}) {
        let estado = '';
        let dataEstadoPago = {};

        if(esPosfechado){
            dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PFC');
        }else{
            if (saldo === 0) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'CBR');
                estado = 'COBRADA'
            }
            if (saldo > 0) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PP');
                estado = "PENDIENTE PARCIAL";
            }
            if (abono === 0) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PE');
                estado = "PENDIENTE";
            }

        }
        

        return {
            idEstadoPago: dataEstadoPago.idEstadoPago,
            descripcion: estado
        }
    }
 

}


export {
    ModalCobroRapidoCtrl,
    ModalCobroLoteCtrl,
    ModalFormaCobroCtrl, 
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
            comprobanteIngresoSvc.getDataForm(idCuentaPorCobrar).then(response => {
                let {
                    entidadesFinanciera,
                    bancos,
                    ciudades,
                    cuentaPorCobrar,
                    estadosPago
                } = response;
                $scope.entidadesFinancieras = entidadesFinanciera;
                let dataEntidadFinanciera = $scope.entidadesFinancieras.find(val => val.codigo === 'EFE');


                $scope.bancos = bancos;

                $scope.ciudades = ciudades;

                cobroSvc.setEstadosPago = estadosPago;

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
                        }]

                        cobroSvc.valorAbono = $scope.cobro.valorAbono;

                        for (let item of $scope.selectedDocumentos) {
                            item.cuotas = JSON.parse(JSON.stringify(item.cuotasOriginal))
                        }


                        cobroSvc.cobrosDetalle = [];
                        cobroSvc.historialCuentas = [];
                        cobroSvc.selectedDocumentos = $scope.selectedDocumentos;
                        cobroSvc.esAbonoPosfechado = $scope.cobro.posFechado;
                        cobroSvc.indexDatoCobro = 0;

                        cobroSvc.addFormaCobro(); 

                        if (cobroSvc.cobrosDetalle.length === 0) {
                            fS.sweetAlert('warning', 'Cobro detalle vacio')
                            throw 'Cobro detalle vacio';
                        }

                        let cobrosDetalle = cobroSvc.cobrosDetalle.filter(item => (item.abono > 0));
                        let historialCobros = cobroSvc.historialCuentas;

                        let cuentasPorCobrarEstado = cobroSvc.generarCuentasPorCobrarEstado({
                            historialCuentas: historialCobros,
                            cobros,
                            cobrosDetalle
                        })

                        let cuotasPorCobrarEstado = cobroSvc.generarCuotasPorCobrarEstado({
                            cobrosDetalle
                        })

                        let data = {
                            comprobante,
                            cobros,
                            cobroDetalle: cobrosDetalle,
                            historialCobros,
                            cuentasPorCobrarEstado,
                            cuotasPorCobrarEstado
                        }

                        const params = comprobanteIngresoSvc.mapperTo(data);

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
                    } catch (error) {
                        hideLoader();
                        console.log(error)
                    }

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
    let cuentasPorCobrarEstado = [];
    let cuotasPorCobrarEstado = [];


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
            comprobanteIngresoSvc.getDataForm(idCuentaPorCobrar, idCliente).then(response => {
               
                dataFormaCobro = response;
                cobroSvc.setEstadosPago = dataFormaCobro.estadosPago;

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
 
   

    function getTotalesCuota() {
        let importeTotal = new Decimal(0), abono = new Decimal(0), saldo = new Decimal(0), totalMora = new Decimal(0), totalSaldoDoc = new Decimal(0);

        for (let item of $scope.selectedDocumentos) {
            importeTotal = importeTotal.plus(item.importeTotal);
            saldo = saldo.plus(item.saldo);
            abono = abono.plus(item.abono);
            totalMora = totalMora.plus(item.mora || 0);
            totalSaldoDoc = totalSaldoDoc.plus(item.saldoDoc || 0);
        }

        $scope.data.importeTotal = importeTotal.toNumber();
        $scope.data.totalSaldo = saldo.toNumber();
        $scope.data.totalAbonoAnterior = abono.toNumber();
        $scope.data.totalMora = totalMora.toNumber();
        $scope.data.totalSaldoDoc = totalSaldoDoc.toNumber();
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
 

            getTotalesCuota();
        } catch (error) {
            console.log(error)
        }
    }


    $scope.onDesSelectDoc = function () { 
        getTotalesCuota(); 
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
        if ($scope.isPaymentDocument || true) {
            fS.sweetAlert('warning', 'No Disponible');
            return
        }
       
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
                        let { posFechado, valorAbono } = result;

                        cobroSvc.selectedDocumentos = $scope.selectedDocumentos;

                        cobroSvc.indexDatoCobro = $scope.datosCobro.length + 1;
                        cobroSvc.esAbonoPosfechado = posFechado;
                        cobroSvc.valorAbono = valorAbono;



                        //--------agregando abono ---
                        cobroSvc.addFormaCobro();

                        $scope.cobrosDetalle = cobroSvc.cobrosDetalle;
                        $scope.selectedDocumentos = cobroSvc.selectedDocumentos;

                        cuentasPorCobrarEstado = cobroSvc.cuentasPorCobrarEstado;
                        cuotasPorCobrarEstado = cobroSvc.cuotasPorCobrarEstado;

                        let abonoCuota = $scope.cobrosDetalle
                            .filter(item => item.secuencial === cobroSvc.indexDatoCobro)
                            .reduce((prev, curr) => new Decimal(prev).plus(curr.abono), new Decimal(0))
                            .toNumber();



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
            abonoCuota: fS.roundNumber(new Decimal(abonoCuota).toNumber(), 2),
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
            prev.totalValorAbono = new Decimal(prev.totalValorAbono).plus(curr.valorAbono).toNumber();
            if (curr.codEntidadFinanciera === "EFE") {
                prev.totalValorAbonoEfectivo = new Decimal(prev.totalValorAbonoEfectivo).plus(curr.valorAbono).toNumber();
            }
            return prev;
        }, {
            totalValorAbono: 0,
            totalValorAbonoEfectivo: 0
        });

        let totalSaldo = $scope.selectedDocumentos.flatMap(item => item.cuotas)
            .reduce((prev, curr) => new Decimal(prev).plus(curr.saldo).toNumber(), 0);
        let valorCambio = 0;

        $scope.data.totalValorAbono = fS.roundNumber(totalValorAbono, 5);
        $scope.data.totalSaldo = fS.roundNumber(totalSaldo, 5);

        if (totalValorAbonoEfectivo >= $scope.comprobante.saldo) {
            valorCambio = new Decimal(totalValorAbonoEfectivo).minus($scope.comprobante.saldo).toNumber();
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
                        cobroSvc.historialCuentas = [];
                        cobroSvc.cuotasPorCobrarEstado = [];

                        cuentasPorCobrarEstado = [];
                        cuotasPorCobrarEstado = [];

                        $scope.cobrosDetalle = []; 


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
                            cobroSvc.esAbonoPosfechado = item.posFechado;

                            //--------agregando abono ---
                            cobroSvc.addFormaCobro();
                        }

                        $scope.cobrosDetalle = cobroSvc.cobrosDetalle;

                        cuentasPorCobrarEstado = cobroSvc.cuentasPorCobrarEstado ;                    
                        cuotasPorCobrarEstado = cobroSvc.cuotasPorCobrarEstado;

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

                    let totalValorAbono = $scope.datosCobro.reduce((acc, curr) => new Decimal(acc).plus(curr.valorAbono), new Decimal(0)).toNumber();
                    let totalAbonoCuota = $scope.datosCobro.reduce((acc, curr) => new Decimal(acc).plus(curr.abonoCuota), new Decimal(0)).toNumber();

                    let comprobante = {
                        idCliente: $scope.comprobante.idCliente,
                        total: totalValorAbono,
                        abono: totalAbonoCuota,
                        codEstab: $scope.comprobante.codEstab,
                        numeroIdentificacion: $scope.comprobante.identificacionComprador,
                        nombreFiscal: $scope.comprobante.razonSocialComprador,
                        observacion: $scope.comprobante.observacion
                    };


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
                            cobro: item.cobro,
                            secuencial: item.secuencial,
                            infoCobro: item.codEntidadFinanciera === 'EFE' ? undefined : JSON.stringify(infoCobro),
                            abono: item.abonoCuota,
                            controlCaja: item.controlCaja,
                            idComprobante: item.idComprobante,
                            idTipoDocumento: item.idTipoDocumento,
                            observacion: item.observacion
                        }
                        return obj;
                    })

                    
                    let cobrosDetalle = $scope.cobrosDetalle.filter(item => (item.abono > 0))
                    let historialCobros = cobroSvc.historialCuentas;

                  

                    let cuentasPorCobrarEstado = cobroSvc.generarCuentasPorCobrarEstado({
                        historialCuentas: historialCobros,
                        cobros,
                        cobrosDetalle
                    })

                    let cuotasPorCobrarEstado = cobroSvc.generarCuotasPorCobrarEstado({
                        cobrosDetalle
                    })

                    let data = {
                        comprobante,
                        cobros,
                        cobroDetalle: cobrosDetalle,
                        historialCobros,
                        cuentasPorCobrarEstado,
                        cuotasPorCobrarEstado
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
    const VALOR_ABONO_ORIGINAL = fS.roundNumber(saldo, 3);

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
                
                cobro: !$scope.data.posFechado,
                referencia: $scope.data.referencia,
                aprobacion: $scope.data.aprobacion,
                lote: $scope.data.lote,

                //Data Documento 
                nro: item.serieComprobante || $scope.data.nro,
                idTipoDocumento: item.idTipoDocumento,
                idComprobante: item.idDocumento,
                tipoDocumento: item.tipoDocumento || item.codDoc,
                valorAbono: item.saldo || $scope.data.valorAbono,
                controlCaja: subEntidadFinanciera.controlCaja,
                observacion: $scope.data.observacion
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

 