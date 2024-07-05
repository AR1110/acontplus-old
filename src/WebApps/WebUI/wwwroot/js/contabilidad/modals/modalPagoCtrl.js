//@ts-check

/**
 * 
 * @param {*} num 
 * @param {*} max por defecto 0 
 * @returns 
 */
function instanceDecimal(num, max = 0) {
    if (max > 0) {
        return new Decimal(num).toDecimalPlaces(max).toNumber()
    }
    return new Decimal(num);
}

/**
 * 
 * @param {*} num1 
 * @param {*} num2 
 * @param {*} max 
 * @returns 
 */
function plus(num1, num2, max = 0) {
    let instanceDecimal = new Decimal(num1).plus(num2)
    if (max > 0) {
        return instanceDecimal.toDecimalPlaces(max).toNumber()
    }

    return instanceDecimal;

}
/**
 * 
 * @param {*} num1 
 * @param {*} num2 
 * @param {*} max 
 * @returns 
 */

function minus(num1, num2, max = 0) {
    let instanceDecimal = new Decimal(num1).minus(num2)
    if (max > 0) {
        return instanceDecimal.toDecimalPlaces(max).toNumber()
    }

    return instanceDecimal;

}
class PagoService {
    constructor(tS, fS) {
        this.tS = tS;
        this.fS = fS;

        this.selectedDocumentos = [];
        this.pagosDetalle = [];
        this.historialCuentas = [];

        this.estadosPago = [];

        this.valorAbono = 0;

        this.esAbonoPosfechado = false;
        this.secuencial = 0;

        this.MAX_NUMBER_ROUND_GENERAL = 3;
        this.MAX_NUMBER_ROUND_CUOTA_ABONO = 5;
        this.MAX_NUMBER_ROUND = 5;
    }

    set setEstadosPago(estadosPago) {
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
     * @param {*} data 
     * @param {*} codigoEntidad 
     * @returns 
     */
    isValidForm(data, codigoEntidad) {
        if (!(data.idSubEntidadFinanciera > 0)) {
            this.tS.toastr('warning', 'Seleccione la SubEntidad Financiera')
        }

        if (!data.fechaEmision) {
            this.tS.toastr('warning', 'Ingrese la fecha de emisión')
            return
        }
        if (!this.isDateValid(data.fechaEmision)) {
            this.tS.toastr('warning', 'Ingrese una fecha válida')
            return
        }

        if (!(data.valorAbono > 0)) {
            this.tS.toastr('warning', 'Ingrese el valor de abono')
            return
        }

        // =================== TARJETA DE CREDITO / DEBITO  =================================== //
        if (codigoEntidad === 'TAR') {
            // if (!data.nro) {
            //     this.tS.toastr('warning', 'Ingrese el Número')
            //     return
            // }

            // if (!data.idCiudad > 0) {
            //     this.tS.toastr('warning', 'Ingrese la Ciudad')
            //     return
            // }
            // if (!data.referencia) {
            //     this.tS.toastr('warning', 'Ingrese la referencia')
            //     return
            // }
            // if (!data.aprobacion) {
            //     this.tS.toastr('warning', 'Ingrese la Aprobación')
            //     return
            // }
            // if (!data.lote) {
            //     this.tS.toastr('warning', 'Ingrese el Lote')
            //     return
            // }
        }

        // =================== TRANSFERENCIAS  =================================== //

        if (codigoEntidad === 'TRA') {
            if (!(data.idBanco > 0)) {
                this.tS.toastr('warning', 'Ingrese el Banco')
                return
            }
            if (!data.nro) {
                this.tS.toastr('warning', 'Ingrese el Número')
                return
            }
        }

        // =================== CHEQUES  =================================== //

        if (codigoEntidad === 'CHE') {
            if (!(data.idBanco > 0)) {
                this.tS.toastr('warning', 'Ingrese el Banco')
                return
            }
            if (!data.nro) {
                this.tS.toastr('warning', 'Ingrese el Número')
                return
            }

            if (!(data.idCiudad > 0)) {
                this.tS.toastr('warning', 'Ingrese la Ciudad')
                return
            }
            if (!data.referencia) {
                this.tS.toastr('warning', 'Ingrese a quien va dirigido el Cheque')
                return
            }
        }

        return true;
    }


    /**
     * 
     * @param {*} param0 
     * @returns 
     */

    generarCuentasPorPagarEstado({ historialCuentas, pagosDetalle }) {
        // Your existing code snippet with modifications for decimal.js
        let cuentasPorPagarAgrupado = historialCuentas.reduce((acc, curr) => {
            let existeDato = acc.find(item => item.idCuentaPorPagar === curr.idCuentaPorPagar);
            if (!existeDato) {
                acc.push({
                    idCuentaPorPagar: curr.idCuentaPorPagar,
                    valorSaldoLectura: instanceDecimal(curr.valorSaldoLectura),
                    abono: instanceDecimal(curr.abono),
                    diasMora: curr.diasMora,
                    mora: curr.mora
                });
            } else {
                existeDato.abono = plus(existeDato.abono, curr.abono);
            }
            return acc;
        }, []);

        let cuentasPorPagarEstado = [];

        for (let item of cuentasPorPagarAgrupado) {
            let valorSaldo = instanceDecimal(item.valorSaldoLectura);

            let totalPosfechado = pagosDetalle.filter(cd => cd.idCuentaPorPagar === item.idCuentaPorPagar && cd.posfechado)
                .reduce((acc, curr) => acc.plus(curr.abono), instanceDecimal(0));

            let totalNoPosfechado = pagosDetalle.filter(cd => cd.idCuentaPorPagar === item.idCuentaPorPagar && !cd.posfechado)
                .reduce((acc, curr) => acc.plus(curr.abono), instanceDecimal(0));

            valorSaldo = valorSaldo.minus(totalNoPosfechado).toNumber()

            let dataEstadoPago = {};
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

            cuentasPorPagarEstado.push({
                idCuentaPorPagar: item.idCuentaPorPagar,
                idEstadoPago: dataEstadoPago.idEstadoPago,
                abono: totalNoPosfechado.toNumber()
            });
        }

        return cuentasPorPagarEstado;

    }


    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    generarCuotasPorPagarEstado({ pagosDetalle }) {

        let cuotasPorPagarAgrupado = pagosDetalle.reduce((acc, curr) => {
            let existeDato = acc.find(item => (item.idCuentaPorPagar === curr.idCuentaPorPagar) && (item.idCuotaPorPagar === curr.idCuotaPorPagar));
            if (!existeDato) {
                acc.push({
                    idCuentaPorPagar: curr.idCuentaPorPagar,
                    idCuotaPorPagar: curr.idCuotaPorPagar,
                    valorSaldoLectura: curr.valorSaldoLectura,
                    abono: instanceDecimal(curr.abono)
                });
            } else {
                existeDato.abono = plus(existeDato.abono, curr.abono);
            }
            return acc;
        }, []);

        let cuotasPorPagarEstado = [];

        for (let item of cuotasPorPagarAgrupado) {
            let totalNoPosfechado = pagosDetalle.filter(cd => cd.idCuotaPorPagar === item.idCuotaPorPagar && !cd.posfechado)
                .reduce((acc, curr) => {
                    return plus(acc, curr.abono);
                }, instanceDecimal(0));

            let valorSaldoLectura = this.fS.roundNumber(item.valorSaldoLectura, 3);
            let totalNoPosfechadoTemp = this.fS.roundNumber(totalNoPosfechado.toNumber(), 3);

            let valorSaldo = minus(valorSaldoLectura, totalNoPosfechadoTemp).toNumber();

            let dataEstadoPago = this.getEstadoCuota({
                saldo: valorSaldo,
                abono: item.abono.toNumber() // Convert Decimal back to number if needed
            });

            cuotasPorPagarEstado.push({
                idEstadoPago: dataEstadoPago.idEstadoPago,
                abono: totalNoPosfechado.toNumber(),
                idCuotaPorPagar: item.idCuotaPorPagar
            });
        }

        return cuotasPorPagarEstado;

    }

    addHistorialCuentas() {
        let valorMovimientoSaldo = instanceDecimal(0), historialAbono = instanceDecimal(0);

        const pagosDetalleFiltered = this.pagosDetalle.filter(cd => cd.idCuentaPorPagar === this.group.idCuentaPorPagar)


        const totalAbonoCuenta = pagosDetalleFiltered.reduce((acc, curr) => acc.plus(curr.abono), instanceDecimal(0));

        if (pagosDetalleFiltered.length === 0) {

            let historialCuentasFiltered = this.historialCuentas.filter(cd => (
                cd.idCuentaPorPagar === this.group.idCuentaPorPagar && cd.secuencial === this.secuencial
            ));

            let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

            if (dataUltimoCobroDetalle) {
                valorMovimientoSaldo = minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono).toNumber();

            } else {
                valorMovimientoSaldo = instanceDecimal(this.group.saldo).toNumber();
            }

            if (this.valorAbono <= this.group.saldo) {
                historialAbono = this.valorAbono;

            } else if (this.valorAbono >= this.group.saldo) {
                historialAbono = this.group.saldo;
            }

            this.historialCuentas.push({
                secuencial: this.secuencial,
                idCuentaPorPagar: this.group.idCuentaPorPagar,
                valorSaldoLectura: this.group.valorSaldoLectura,

                abono: instanceDecimal(historialAbono, this.MAX_NUMBER_ROUND),
                saldo: instanceDecimal(valorMovimientoSaldo, this.MAX_NUMBER_ROUND),


                diasMora: this.group.diasMora,
                mora: this.group.mora,
            })

        }
        if (pagosDetalleFiltered.length > 0) {
            if (totalAbonoCuenta !== this.fS.roundNumber(this.group.saldo, this.MAX_NUMBER_ROUND_GENERAL)) {

                let historialCuentasFiltered = this.historialCuentas.filter(cd => (
                    cd.idCuentaPorPagar === this.group.idCuentaPorPagar
                ));

                let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

                if (dataUltimoCobroDetalle) {
                    valorMovimientoSaldo = minus(dataUltimoCobroDetalle.saldo, dataUltimoCobroDetalle.abono).toNumber();
                } else {
                    valorMovimientoSaldo = instanceDecimal(this.group.saldo).toNumber();
                }

                if (this.valorAbono <= valorMovimientoSaldo) {
                    historialAbono = this.valorAbono;

                } else {
                    historialAbono = valorMovimientoSaldo
                }

                this.historialCuentas.push({
                    secuencial: this.secuencial,
                    idCuentaPorPagar: this.group.idCuentaPorPagar,
                    valorSaldoLectura: this.group.valorSaldoLectura,

                    abono: instanceDecimal(historialAbono, this.MAX_NUMBER_ROUND),
                    saldo: instanceDecimal(valorMovimientoSaldo, this.MAX_NUMBER_ROUND),

                    diasMora: this.group.diasMora,
                    mora: this.group.mora,
                })
            }
        }
    }

    //--------------
    addFormaCobro() {

        for (let group of this.selectedDocumentos) {

            this.group = group;

            if (typeof this.valorAbono !== 'number' || this.valorAbono > 0) {
                this.addHistorialCuentas();
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

                item.cuota = instanceDecimal(item.cuota, this.MAX_NUMBER_ROUND)
                item.abono = instanceDecimal(item.abono, this.MAX_NUMBER_ROUND)
                item.abonoPosfechado = instanceDecimal(item.abonoPosfechado, this.MAX_NUMBER_ROUND)


                let dataEstadoPago = this.getEstadoCuota({
                    saldo: item.saldo,
                    abono: item.abono
                });
                item.estado = dataEstadoPago.descripcion;
                item.descripcion = dataEstadoPago.descripcion;

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
            item.saldoCta = minus(item.saldoCta, this.valorAbono, this.MAX_NUMBER_ROUND);

        } else if (item.saldoCta <= this.valorAbono) {
            item.saldoCta = 0;
        }

        //Validaciones Saldo 
        if (item.saldo >= this.valorAbono) {

            //Si el Abono pago no es Posfechado
            item.abono = this.esAbonoPosfechado ? 0 : this.valorAbono;

            //Si el abono pago es posfechado
            item.abonoPosfechado = this.esAbonoPosfechado ? this.valorAbono : 0;

            item.saldo = minus(item.saldo,this.valorAbono,this.MAX_NUMBER_ROUND);


            this.addPagoDetalle(item, this.valorAbono, item.saldo)
            this.valorAbono = 0;

        } else if (item.saldo <= this.valorAbono) {

            //Si el Abono pago no es Posfechado
            item.abono = this.esAbonoPosfechado ? 0 : instanceDecimal(item.saldo, this.MAX_NUMBER_ROUND);

            //Si el abono pago es posfechado
            item.abonoPosfechado = this.esAbonoPosfechado ? instanceDecimal(item.saldo, this.MAX_NUMBER_ROUND) : 0;

            //this.valorAbono = this.valorAbono - item.saldo;
            this.valorAbono = minus(this.valorAbono, item.saldo, this.MAX_NUMBER_ROUND);

            this.addPagoDetalle(item, item.saldo, 0)
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
            item.saldoCta = minus(item.saldoCta, this.valorAbono, this.MAX_NUMBER_ROUND);
        } else if (item.saldoCta <= this.valorAbono) {
            item.saldoCta = 0;
        }

        //Validaciones Saldo 

        if (item.saldo >= this.valorAbono) {

            item.abono = this.esAbonoPosfechado ? item.abono : plus(item.abono, this.valorAbono, this.MAX_NUMBER_ROUND);
            item.abonoPosfechado = this.esAbonoPosfechado ? plus(item.abonoPosfechado, this.valorAbono, this.MAX_NUMBER_ROUND) : item.abonoPosfechado;

            item.saldo = minus(item.saldo, this.valorAbono, this.MAX_NUMBER_ROUND);

            this.addPagoDetalle(item, this.valorAbono, item.saldo);
            this.valorAbono = 0;


        } else if (item.saldo <= this.valorAbono) {
            item.abono = this.esAbonoPosfechado ? item.abono : plus(item.abono, item.saldo, this.MAX_NUMBER_ROUND);

            item.abonoPosfechado = this.esAbonoPosfechado ? plus(item.abonoPosfechado, item.saldo, this.MAX_NUMBER_ROUND) : item.abonoPosfechado;

            this.addPagoDetalle(item, item.saldo, 0);

            this.valorAbono = minus(this.valorAbono, item.saldo, this.MAX_NUMBER_ROUND);

            item.saldo = 0;
        }
    }


    /**
     * 
     * @param {*} item 
     * @param {*} abono 
     * @param {*} saldo 
     * @returns 
     */
   
    addPagoDetalle(item, abono, saldo) {
        if (item.cuota === 0 || abono === 0) return;

        let valorMovimientoSaldo = 0;
        let pagosDetalleFiltered = this.pagosDetalle.filter(cd => (
            cd.idCuentaPorPagar === this.group.idCuentaPorPagar &&
            cd.idCuotaPorPagar === item.idCuotaPorPagar
        ))

        let dataUltimoCobroDetalle = pagosDetalleFiltered.pop();
        if (dataUltimoCobroDetalle) {
            valorMovimientoSaldo = minus(dataUltimoCobroDetalle.saldoOriginal, dataUltimoCobroDetalle.abono, this.MAX_NUMBER_ROUND)
        } else {
            valorMovimientoSaldo = instanceDecimal(item.saldoOriginal, this.MAX_NUMBER_ROUND);
        }


        this.pagosDetalle.push({
            idCuentaPorPagar: this.group.idCuentaPorPagar,
            idCuotaPorPagar: item.idCuotaPorPagar,
            abono,
            interes: item.interes,
            diasMora: item.diasMora,
            mora: item.mora,
            cuota: instanceDecimal(item.cuota, this.MAX_NUMBER_ROUND),
            saldo: instanceDecimal(saldo, this.MAX_NUMBER_ROUND),
            secuencial: this.secuencial,
            valorSaldoLectura: item.valorSaldoLectura,

            saldoOriginal: instanceDecimal(valorMovimientoSaldo, this.MAX_NUMBER_ROUND),
            posfechado: this.esAbonoPosfechado
        })
        item.saldo = instanceDecimal(item.saldo, this.MAX_NUMBER_ROUND);

        item.saldoOriginal = minus(item.saldoOriginal, abono, this.MAX_NUMBER_ROUND);

    }

   

    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    getEstadoCuota({ saldo, abono, esPosfechado }) {
        let estado = '';
        let dataEstadoPago = {};

        if (esPosfechado) {
            dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PFC');
        } else {
            if (saldo === 0) {
                dataEstadoPago = this.estadosPago.find(ep => ep.codigo === 'PA');
                estado = 'PAGADA'
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
    modalPagoLoteCtrl,
    modalFormaPagoCtrl
}

modalPagoLoteCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', 'params'];
function modalPagoLoteCtrl($scope, $uibModalInstance, $injector, params) {
    const fS = $injector.get('formulario');
    const tS = $injector.get('toastService');
    const modalSvc = $injector.get('modalService');
    const nombreModalContabilidad = $injector.get('nombreModalContabilidad');
    const comprobanteEgresoSvc = $injector.get('comprobanteEgresoService');

    let pagoSvc = new PagoService(tS, fS);

    let { data, selectedDocumentos } = params;

    $scope.proveedor = {
        idProveedor: data.idProveedor,
        razonSocialComprador: data.razonSocialComprador,
        identificacionComprador: data.identificacionComprador
    };

    $scope.data = {
        codEstab: data.codEstab,
    }

    $scope.data.totalAbonoAnterior = 0;
    $scope.data.totalValorAbono = 0;
    $scope.data.totalSaldo = 0
    $scope.data.valorCambio = 0;

    $scope.pagos = [];
    $scope.pagosDetalle = [];
    $scope.historialCuentas = [];


    $scope.selectedDocumentos = [];
    $scope.cloneSelectedDocumentos = [];

    $scope.selectedDocumentos = JSON.parse(JSON.stringify(selectedDocumentos));
    $scope.cloneSelectedDocumentos = JSON.parse(JSON.stringify($scope.selectedDocumentos));



    $scope.displayCuota = (item) => {
        item.display = !item.display
    }

    let mainDataFormPago = {};

    //Se inicializa al abrir modal 
    initLoad();
    function initLoad() {

        try {
            showLoader();
            comprobanteEgresoSvc.getDataFormaPago($scope.proveedor.idProveedor).then(response => {
                mainDataFormPago = response;

                pagoSvc.setEstadosPago = mainDataFormPago.estadosPago;

            })
            .catch(error=>{
                console.log(error)
            })
            .finally(() => hideLoader())
        } catch (error) {
            console.log(error);
        }

    }


    getTotalesCuota();
    function getTotalesCuota() {
        //let groupCuotas = $scope.selectedDocumentos.flatMap(item=>item.cuotas);
        let totalCuota = instanceDecimal(0);
        let totalAbonoAnterior = instanceDecimal(0);
        let totalSaldo = instanceDecimal(0);

        for (let item of $scope.selectedDocumentos) {
            totalCuota = totalCuota.plus(item.importeTotal)
            totalAbonoAnterior = totalAbonoAnterior.plus(item.abono);
            totalSaldo = totalSaldo.plus(item.saldo);
        }

        $scope.data.importeTotal = totalCuota.toNumber();
        $scope.data.totalSaldo = totalSaldo.toNumber();
        $scope.data.totalSaldoOriginal = totalSaldo.toNumber();
        $scope.data.totalAbonoAnterior = totalAbonoAnterior.toNumber();
        $scope.data.totalValorAbono = 0;
        $scope.data.valorCambio = 0;
    }



    //Calculo de abono y saldo una vez agregado el forma pago 
    function calculoTotales() { 

        let totalValorAbono = $scope.pagos.map(item => item.valorAbono)
            .reduce((prev, curr) => instanceDecimal(prev).plus(curr).toNumber(), 0);

        let totalSaldo = $scope.selectedDocumentos.flatMap(item => item.cuotas)
            .reduce((prev, curr) => instanceDecimal(prev).plus(curr.saldo).toNumber(), 0); 
        let valorCambio = 0;

        $scope.data.totalValorAbono = fS.roundNumber(totalValorAbono, 5);
        $scope.data.totalSaldo = fS.roundNumber(totalSaldo, 5);


        if ($scope.data.totalValorAbono >= $scope.data.totalSaldoOriginal) {
            valorCambio = minus($scope.data.totalValorAbono, $scope.data.totalSaldoOriginal, 5)
        }

        $scope.data.valorCambio = valorCambio;

    }



    $scope.openModalFormaPago = async () => {
        try {

            if ($scope.data.totalSaldo == 0) {
                fS.sweetAlert('warning', 'No hay cuotas pendientes.')
                return
            }

            let params = {
                proveedor: $scope.proveedor,
                importeTotal: $scope.data.importeTotal,
                saldo: $scope.data.totalSaldo,
                mainDataFormPago
            };

            let fileCtrl = nombreModalContabilidad.PAGO.fileCtrl;
            let ctrl = nombreModalContabilidad.PAGO.controllers['MFP'];
            let template = nombreModalContabilidad.PAGO.templates['MFP'];
            let controller = (await import(fileCtrl))[ctrl];

            let modalRef = modalSvc.openModalCustom({
                controller,
                template,
                size: 'lg',
                isRenderRazorPartial: true,
                params
            })

            modalRef.result.then(result => {

                if (result !== null && typeof result === 'object') {

                    try {

                        let { isPosFechado, valorAbono } = result;

                        pagoSvc.selectedDocumentos = $scope.selectedDocumentos;

                        pagoSvc.secuencial = $scope.pagos.length + 1;
                        pagoSvc.esAbonoPosfechado = isPosFechado;
                        pagoSvc.valorAbono = valorAbono;



                        //--------agregando abono ---
                        pagoSvc.addFormaCobro();

                        $scope.pagosDetalle = pagoSvc.pagosDetalle;
                        $scope.selectedDocumentos = pagoSvc.selectedDocumentos; 

                        let abonoCuota = $scope.pagosDetalle
                            .filter(item => item.secuencial === pagoSvc.secuencial)
                            .reduce((prev, curr) =>instanceDecimal(prev).plus(curr.abono), instanceDecimal(0))
                            .toNumber();


                        $scope.addDataPayment(result, abonoCuota);

                        calculoTotales();

                        fS.sweetAlert('success', 'Agregado Correctamente', '', 1000);

                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    }


    //-----------------------------------Datos Pago---------------------
    $scope.addDataPayment = function (obj, abonoCuota) {
        $scope.pagos.push({
            ...obj,
            abonoCuota: instanceDecimal(abonoCuota, 2),
            secuencial: pagoSvc.secuencial
        })
    }

    $scope.showPagoDetalle = (data) => {
        let tempPagosDetalle = $scope.pagosDetalle.filter(item => item.idCuotaPorPagar === data.idCuotaPorPagar);
        let infoPagosDetalle = [];

        for (let pd of tempPagosDetalle) {
            let dataPago = $scope.pagos.find(item => item.secuencial === pd.secuencial);
            infoPagosDetalle.push({
                ...pd,
                subEntidadFinanciera: dataPago.subEntidadFinanciera,
                posFechado: dataPago.posFechado ? 'SI' : 'NO'
            })
        }

        let index = 1;
        Swal.fire({
            icon: 'info',
            title: `<span>Cuota:</span> $${data.cuota}`,
            width: 600,
            html: `<table class="table table-striped table-sm color-bordered-table info-bordered-table">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Entidad Financiera</th>                                
                                <th>Abono</th>
                                <th>Saldo</th>
                                <th>PosFechado</th>
                            </tr>
                        </thead
                        <tbody>
                            ${infoPagosDetalle.map((item) => (`<tr>
                                                            <td>${index++}</td>
                                                            <td>${item.subEntidadFinanciera}</td>                                                            
                                                            <td>${item.abono}</td>
                                                            <td>${item.saldo}</td>
                                                            <td>${item.posFechado}</td>
                                                        </tr>`)
            )}
                           
                        </tbody>
                    </table>`
        })

    }


    $scope.displayInfoDatosPago = (item) => {
        item.display = !item.display
    }

    $scope.askToDeleteDatoPago = (item) => {
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

                    pagoSvc.pagosDetalle = [];
                    pagoSvc.historialCuentas = [];
                    $scope.pagosDetalle = [];

                    let index = $scope.pagos.indexOf(item);
                    $scope.pagos.splice(index, 1);

                    //Todas las cuotas en su estado original 
                    //Todas las cuotas en su estado original                     
                    for (let item of $scope.selectedDocumentos) {
                        item.cuotas = structuredClone(item.cloneCuotas);
                    }

                    pagoSvc.selectedDocumentos = $scope.selectedDocumentos;

                    getTotalesCuota();

                    if ($scope.pagos.length == 0) return

                    //Recalculamos las cuotas con los abonos restantes   
                    let secuencial = 0;
                    pagoSvc.secuencial = secuencial;
                    for (let item of $scope.pagos) {
                        secuencial++;
                        pagoSvc.secuencial = secuencial;

                        pagoSvc.valorAbono = item.valorAbono;
                        pagoSvc.esAbonoPosfechado = item.isPosfechado;

                        //--------agregando abono ---
                        pagoSvc.addFormaCobro();
                    }

                    $scope.pagosDetalle = pagoSvc.pagosDetalle;

                    calculoTotales();


                })


            }
        })
    }



    $scope.save = () => {

        try {
            if ($scope.pagos.length === 0) {
                fS.sweetAlert('warning', 'Ingrese al menos un Pago')
                return
            }

            Swal.fire({
                title: '<small>Guardar Pago</small>',
                html: "<small class='text-muted'>Esta seguro de guardar este pago ahora?</small> !",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!'
            }).then((result) => {

                if (result.isConfirmed) {
                    try {

                        let totalValorAbono = $scope.pagos.reduce((acc, curr) => instanceDecimal(acc).plus(curr.valorAbono), instanceDecimal(0)).toNumber();
                        let totalAbonoCuota = $scope.pagos.reduce((acc, curr) => instanceDecimal(acc).plus(curr.abonoCuota), instanceDecimal(0)).toNumber();


                        let comprobante = {
                            idProveedor: $scope.proveedor.idProveedor,
                            total: totalValorAbono,
                            abono: totalAbonoCuota,
                            codEstab: $scope.data.codEstab,
                            identificacionComprador: $scope.proveedor.identificacionComprador,
                            razonSocialComprador: $scope.proveedor.razonSocialComprador,
                            observacion: $scope.data.observacion
                        }

                        let pagos = $scope.pagos.map(item => {
                            let infoCobro = [{
                                nro: item.nro,
                                lote: item.lote,
                                aprobacion: item.aprobacion,
                                referencia: item.referencia
                            }]

                            let obj = {
                                idEntidadFinanciera: item.idEntidadFinanciera,
                                idSubEntidadFinanciera: item.idSubEntidadFinanciera,
                                idBanco: fS.isValidField(item.idBanco),
                                idCuentaBancaria: fS.isValidField(item.idCuentaBancaria),
                                idTipoDocumento: fS.isValidField(item.idTipoDocumento),
                                idComprobante: fS.isValidField(item.idComprobante),
                                fechaEmision: item.fechaEmision,
                                nro: item.nro,
                                valor: item.valorAbono,
                                abono: item.abonoCuota,
                                secuencial: item.secuencial,
                                lote: fS.isValidField(item.lote),
                                aprobacion: fS.isValidField(item.aprobacion),
                                referencia: fS.isValidField(item.referencia),
                                controlCaja: item.controlCaja,
                                posfechado: item.posFechado,
                                cobro: item.cobro,
                                infoCobro: item.codEntidadFinanciera === 'EFE' ? undefined : JSON.stringify(infoCobro),
                                observacion: item.observacion
                            }
                            return obj;
                        })

                        let pagosDetalle = $scope.pagosDetalle.filter(item => (item.abono > 0));
                        let historialCuentas = pagoSvc.historialCuentas;

                        let cuentasPorPagarEstado = pagoSvc.generarCuentasPorPagarEstado({
                            historialCuentas,
                            pagos,
                            pagosDetalle
                        })

                        let cuotasPorPagarEstado = pagoSvc.generarCuotasPorPagarEstado({
                            pagosDetalle
                        })


                        let data = {
                            comprobante,
                            pagos,
                            pagosDetalle,
                            historialCuentas,
                            cuentasPorPagarEstado,
                            cuotasPorPagarEstado
                        }



                        let params = comprobanteEgresoSvc.mapperTo(data);


                        showLoader();
                        comprobanteEgresoSvc.post(params).then(response => {
                            if (response.code === "0") {
                                fS.sweetAlert('warning', response.message)
                            }

                            if (response.code === "1") {
                                fS.sweetAlert('success', response.message, '', 1000);
                                $uibModalInstance.close(response)
                            }
                        }).catch(error => {
                            console.log(error)
                        }).finally(() => hideLoader());
                    } catch (error) {
                        hideLoader();
                        console.log(error)
                    }
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


modalFormaPagoCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', 'params'];
function modalFormaPagoCtrl($scope, $uibModalInstance, $injector, params) {
 
    const fS = $injector.get('formulario');
    const tS = $injector.get('toastService');
    let pagoSvc = new PagoService(tS)



    let { saldo, proveedor, mainDataFormPago } = params;
    const VALOR_ABONO_ORIGINAL = saldo;

    $scope.data = {};
    $scope.data.posFechado = false
    $scope.proveedor = proveedor;

    $scope.data.fechaEmision = new Date();
    $scope.data.valorAbono = fS.roundNumber(VALOR_ABONO_ORIGINAL, 3)




    //Entidad Financiera Documento 
    $scope.documentosElectronicos = [];
    $scope.selectedDocElectronico = []

    $scope.options = {
        rowSelection: true,
        multiSelect: false,
    }

    //False en caso de ser Entidad Financiera (Documento) 
    $scope.showBtnAdd = true;


    //Se inicializa al abrir modal 
    initLoad();
    function initLoad() {

        try {
            const {
                entidadesFinancieras,
                bancos,
                ciudades,
                docs
            } = mainDataFormPago;
            $scope.entidadesFinancieras = entidadesFinancieras;

            $scope.selectedIndexTab = $scope.entidadesFinancieras.findIndex(item => item.codigo === 'EFE');
            $scope.bancos = bancos;
            $scope.ciudades = ciudades;
            $scope.documentosElectronicos = docs;
        } catch (error) {
            console.log(error);
        }

    }


    $scope.onChangeTabEntidadFinanciera = () => {
        try {

            let { idEntidadFinanciera, codigo, subEntidadesFinanciera } = $scope.entidadesFinancieras.at($scope.selectedIndexTab)

            if (codigo === 'DOC') {
                document.getElementById('btnAddFormaPago').style.display = 'none';
            } else {
                document.getElementById('btnAddFormaPago').style.display = 'block';
            }

            $scope.subEntidadesFinancieras = subEntidadesFinanciera;

            $scope.data.idEntidadFinanciera = idEntidadFinanciera;
            $scope.data.idSubEntidadFinanciera = $scope.subEntidadesFinancieras[0].idSubEntidadFinanciera;

            $scope.data.valorAbono = fS.roundNumber(VALOR_ABONO_ORIGINAL, 3);
            $scope.data.idBanco = 0;
            $scope.data.idCiudad = 0;
            $scope.data.nro = null;
            $scope.data.lote = null;
            $scope.data.aprobacion = null;
            $scope.data.posFechado = false;
            $scope.selectedDocElectronico = [];
            if (codigo === 'CHE') {
                $scope.data.referencia = $scope.proveedor.razonSocialComprador;
            } else {
                $scope.data.referencia = null;
            }


        } catch (error) {
            console.log(error);
        }
    }



    $scope.addFormaPago = () => {

        let codigo = $scope.entidadesFinancieras[$scope.selectedIndexTab].codigo;
        if (!pagoSvc.isValidForm($scope.data, codigo)) throw 'Form Invalid';

        $uibModalInstance.close(getDataPago());
    }

    function getDataPago(item = {}) {
        let entidadFinanciera = $scope.entidadesFinancieras.find(item => item.idEntidadFinanciera === $scope.data.idEntidadFinanciera);
        let subEntidadFinanciera = $scope.subEntidadesFinancieras.find(item => item.idSubEntidadFinanciera === $scope.data.idSubEntidadFinanciera);

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
            idBanco: $scope.data.idBanco,
            idCiudad: $scope.data.idCiudad,
            fechaEmision: formattedDateTime,
            posFechado: $scope.data.posFechado,
            cobro: !$scope.data.posFechado,
            referencia: $scope.data.referencia,
            aprobacion: $scope.data.aprobacion,
            lote: $scope.data.lote,

            //Data Documento 
            nro: item.nroDocumento || $scope.data.nro,
            idTipoDocumento: item.idTipoDocumento,
            idComprobante: item.idComprobante,
            tipoDocumento: item.tipoDocumento,
            valorAbono: item.saldo || $scope.data.valorAbono,
            controlCaja: subEntidadFinanciera.controlCaja
        }
    }

    $scope.addDocumentoElectronico = (item) => {
        if (item.saldo === 0) {
            tS.toastr('warning', 'El Valor de Abono tiene que ser mayor a 0', 'Pago');
            return
        }

        Swal.fire({
            html: `<small>Abonar el valor <h3>$${item.saldo}</h3> del Documento ${item.tipoDocumento}?</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, abonar',
            cancelButtonText: 'No, cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                $uibModalInstance.close(getDataPago(item))
            }
        })
    }




    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}