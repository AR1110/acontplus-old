class PagoService {
    constructor(tS, fS) {
        this.tS = tS;
        this.fS = fS;

        this.selectedDocumentos = [];
        this.pagosDetalle = [];
        this.historialCuentas = [];
        this.valorAbono = 0;

        this.esAbonoPosfechado = false;
        this.secuencial = 0;

        this.MAX_NUMBER_ROUND_GENERAL = 3;
        this.MAX_NUMBER_ROUND_CUOTA_ABONO = 5;
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
    isValidForm(data, codigoEntidad) {
        if (!data.idSubEntidadFinanciera > 0) {
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

        if (!data.valorAbono > 0) {
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
            if (!data.idBanco > 0) {
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
            if (!data.idBanco > 0) {
                this.tS.toastr('warning', 'Ingrese el Banco')
                return
            }
            if (!data.nro) {
                this.tS.toastr('warning', 'Ingrese el Número')
                return
            }

            if (!data.idCiudad > 0) {
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



    addHistorialCuentas() {
        let valorMovimientoSaldo = 0, historialAbono = 0;

        const pagosDetalleFiltered = this.pagosDetalle.filter(cd => cd.idCuentaPorPagar === this.group.idCuentaPorPagar)

        const totalAbonoCuenta = this.fS.roundNumber(pagosDetalleFiltered.reduce((acc, curr) => acc + curr.abono, 0), this.MAX_NUMBER_ROUND_GENERAL);

        if (pagosDetalleFiltered.length === 0) {

            let historialCuentasFiltered = this.historialCuentas.filter(cd => (
                cd.idCuentaPorPagar === this.group.idCuentaPorPagar && cd.secuencial === this.secuencial
            ));

            let dataUltimoCobroDetalle = historialCuentasFiltered.pop();

            if (dataUltimoCobroDetalle) {
                valorMovimientoSaldo = dataUltimoCobroDetalle.saldo - dataUltimoCobroDetalle.abono;
            } else {
                valorMovimientoSaldo = this.group.saldo;
            }

            if (this.valorAbono <= this.group.saldo) {
                historialAbono = this.valorAbono;

            } else if (this.valorAbono >= this.group.saldo) {
                historialAbono = this.group.saldo;
            }

            this.historialCuentas.push({
                secuencial: this.secuencial,
                idCuentaPorPagar: this.group.idCuentaPorPagar,
                abono: this.fS.roundNumber(historialAbono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                saldo: this.fS.roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
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
                    valorMovimientoSaldo = dataUltimoCobroDetalle.saldo - dataUltimoCobroDetalle.abono;
                } else {
                    valorMovimientoSaldo = group.saldo;
                }

                if (this.valorAbono <= valorMovimientoSaldo) {
                    historialAbono = this.valorAbono;

                } else {
                    historialAbono = valorMovimientoSaldo
                }

                this.historialCuentas.push({
                    secuencial: this.secuencial,
                    idCuentaPorPagar: this.group.idCuentaPorPagar,
                    abono: this.fS.roundNumber(historialAbono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
                    saldo: this.fS.roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
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

                item.cuota = this.fS.roundNumber(item.cuota, this.MAX_NUMBER_ROUND_GENERAL);
                item.abono = this.fS.roundNumber(item.abono, this.MAX_NUMBER_ROUND_GENERAL);
                item.abonoPosfechado = this.fS.roundNumber(item.abonoPosfechado, this.MAX_NUMBER_ROUND_GENERAL);
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
            item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND_GENERAL);
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
            item.saldo = this.fS.roundNumber(valorSaldo, this.MAX_NUMBER_ROUND_GENERAL);
            // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);

            this.addPagoDetalle(item, this.valorAbono, item.saldo)
            this.valorAbono = 0;

        } else if (item.saldo <= this.valorAbono) {

            //Si el Abono pago no es Posfechado
            item.abono = this.esAbonoPosfechado ? 0 : item.saldo;

            //Si el abono pago es posfechado
            item.abonoPosfechado = this.esAbonoPosfechado ? item.saldo : 0;

            this.valorAbono = this.valorAbono - item.saldo;

            this.addPagoDetalle(item, item.saldo, 0)
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
            item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND_GENERAL);
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
            item.saldo = this.fS.roundNumber(valorSaldo, this.MAX_NUMBER_ROUND_GENERAL);
            // item.saldoCta = this.fS.roundNumber(valorSaldoCta, this.MAX_NUMBER_ROUND);

            this.addPagoDetalle(item, this.valorAbono, item.saldo);
            this.valorAbono = 0;


        } else if (item.saldo <= this.valorAbono) {
            let abonoCuota = item.saldo;
            if (this.esAbonoPosfechado) {
                item.abonoPosfechado = item.abonoPosfechado + item.saldo;
            } else {
                item.abono = item.abono + item.saldo;
            }

            this.valorAbono = this.valorAbono - item.saldo;
            this.valorAbono = this.fS.roundNumber(this.valorAbono, this.MAX_NUMBER_ROUND_GENERAL);
            this.addPagoDetalle(item, abonoCuota, 0);
            item.saldo = 0;
        }
    }


    /**
     * 
     * @param {object} item 
     * @param {number} abono 
     * @returns void
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
            valorMovimientoSaldo = dataUltimoCobroDetalle.saldoOriginal - dataUltimoCobroDetalle.abono;
        } else {
            valorMovimientoSaldo = item.saldoOriginal;
        }


        this.pagosDetalle.push({
            idCuentaPorPagar: this.group.idCuentaPorPagar,
            idCuotaPorPagar: item.idCuotaPorPagar,
            abono: this.fS.roundNumber(abono, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
            interes: item.interes,
            diasMora: item.diasMora,
            mora: item.mora,
            cuota: this.fS.roundNumber(item.cuota, this.MAX_NUMBER_ROUND_CUOTA_ABONO),
            saldo,
            secuencial: this.secuencial,
            saldoOriginal: this.fS.roundNumber(valorMovimientoSaldo, this.MAX_NUMBER_ROUND_CUOTA_ABONO)
        })
        item.saldo = this.fS.roundNumber(item.saldo, this.MAX_NUMBER_ROUND_GENERAL);
        item.saldoOriginal = this.fS.roundNumber(item.saldoOriginal - abono, this.MAX_NUMBER_ROUND_GENERAL);
    }

    /**
     * 
     * @param {object} item item cuota  
     * @returns number
     */
    getValorSaldo(item) {
        // let total = item.abono + item.abonoPosfechado;
        // return this.fS.roundNumber(total, 5) === this.fS.roundNumber(item.cuota, 5) ? 0 : this.fS.roundNumber(item.saldo, 5);
        return this.fS.roundNumber(item.saldo, this.MAX_NUMBER_ROUND_GENERAL);
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


    getTotalesCuota();
    function getTotalesCuota() {
        //let groupCuotas = $scope.selectedDocumentos.flatMap(item=>item.cuotas);
        let totalCuota = 0, totalAbonoAnterior = 0, totalSaldo = 0;

        for (let item of $scope.selectedDocumentos) {
            totalCuota += item.importeTotal;
            totalAbonoAnterior += item.abono;
            totalSaldo += item.saldo;
        }

        $scope.data.importeTotal = fS.roundNumber(totalCuota, 5);
        $scope.data.totalSaldo = fS.roundNumber(totalSaldo, 5);
        $scope.data.totalSaldoOriginal = fS.roundNumber(totalSaldo, 5);
        $scope.data.totalAbonoAnterior = fS.roundNumber(totalAbonoAnterior, 5)
        $scope.data.totalValorAbono = 0;
        $scope.data.valorCambio = 0;
    }



    //Calculo de abono y saldo una vez agregado el forma pago 
    function calculoTotales() {

        let totalValorAbono = $scope.pagos.map(item => item.valorAbono).reduce((prev, curr) => prev + curr, 0)
        let totalSaldo = $scope.selectedDocumentos.flatMap(item => item.cuotas).map(item => item.saldo).reduce((prev, curr) => prev + curr, 0);
        let valorCambio = 0;

        $scope.data.totalValorAbono = fS.roundNumber(totalValorAbono, 5);
        $scope.data.totalSaldo = fS.roundNumber(totalSaldo, 5);


        if ($scope.data.totalValorAbono >= $scope.data.totalSaldoOriginal) {
            valorCambio = $scope.data.totalValorAbono - $scope.data.totalSaldoOriginal;
        }

        $scope.data.valorCambio = fS.roundNumber(valorCambio, 5);

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

                        let abonoCuota = $scope.pagosDetalle.filter(item => item.secuencial === pagoSvc.secuencial)
                            .reduce((prev, curr) => prev + curr.abono, 0);

                        console.log($scope.pagosDetalle)
                        console.log(pagoSvc)
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
            abonoCuota: fS.roundNumber(abonoCuota, 2),
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
                        let comprobante = {
                            idProveedor: $scope.proveedor.idProveedor,
                            total: fS.roundNumber($scope.pagos.reduce((acc, curr) => acc + curr.valorAbono, 0), 5),
                            abono: fS.roundNumber($scope.pagos.reduce((acc, curr) => acc + curr.abonoCuota, 0), 5),
                            codEstab: $scope.data.codEstab,
                            identificacionComprador: $scope.proveedor.identificacionComprador,
                            razonSocialComprador: $scope.proveedor.razonSocialComprador
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
                            }
                            return obj;
                        })


                        let data = {
                            comprobante,
                            pagos,
                            pagosDetalle: $scope.pagosDetalle.filter(item => (item.abono > 0)),
                            historialCuentas: pagoSvc.historialCuentas,
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

    const cuentaPorPagarSvc = $injector.get('cuentaPorPagarService');
    const fS = $injector.get('formulario');
    const tS = $injector.get('toastService');
    let pagoSvc = new PagoService(tS)



    let { saldo, proveedor } = params;
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
            showLoader();
            cuentaPorPagarSvc.getDataFormaPago($scope.proveedor.idProveedor).then(response => {
                const {
                    entidadesFinancieras,
                    bancos,
                    ciudades,
                    docs
                } = response;
                $scope.entidadesFinancieras = entidadesFinancieras;

                $scope.selectedIndexTab = $scope.entidadesFinancieras.findIndex(item => item.codigo === 'EFE');
                $scope.bancos = bancos;
                $scope.ciudades = ciudades;
                $scope.documentosElectronicos = docs;


            }).finally(() => hideLoader())
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
            if(codigo==='CHE'){
                $scope.data.referencia = $scope.proveedor.razonSocialComprador;            
            }else{
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
                $uibModalInstance.close($scope.getDataPago(item))
            }
        })
    }




    $scope.closeModal = function () {
        $uibModalInstance.close();
    }
}