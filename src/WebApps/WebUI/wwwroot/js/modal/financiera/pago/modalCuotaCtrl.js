


export class ModalCompraCuotaCtrl{
    
    static $inject = ['$http', '$scope', '$uibModalInstance', 'mainService', 'commonService', 'formulario', 'params']
    constructor($http, $scope, $uibModalInstance, _mS, _commonSvc, _form, _params){
        this.$http      = $http;
        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._mS               = _mS;
        this._form             = _form;       
        this._commonSvc        = _commonSvc;

        let {TIPO_DOC, data, cuotas}= _params;

        this.TIPO_DOC = TIPO_DOC;
        this.data = data;
        this.cuotasTemp = cuotas;

        // this.data              = {};
        // this.data.idTiempoCredito = this.dataTipoDocumento.idTiempoCredito;
        this.cloneIdTiempoCredito = this.data.idTiempoCredito; //Clonamos tiempo de credito agregado al documento 
        this.configFecha     = this._form.formatDate(this.data.fechaEmision);
        this.totalDiferencia = 0;
        this.totalCuota = 0;   
        
        this.NUM_MAX_ROUND = 3;
    }

    $onInit(){        
        this._commonSvc.getAllTiempoCredito(false).then(response=>{            
            this.tiempoCreditos = response;       
        })

        
        this.cuotas = this.convertirCuota();
        this.totalCuota = this.getTotalCuota();   

    }


    convertirCuota(){
        return this.cuotasTemp.map((val)=>{
            let fechaVencimiento = val.fechaVencimiento.split(" ")[0].split("/").reverse().join("/");                           
            val.fechaVencimiento = new Date(fechaVencimiento);
            return val;
        })
    }

    //Obtenemos fecha escrita de fecha vencimiento de la cuota 
    getFechaEscritaCuota(fechaVencimiento){
        return this._form.getFechaEscritaCompleta(fechaVencimiento)
    }

    getTotalCuota(){            
        let total = this.cuotas.map(val => parseFloat(val.cuota)).reduce((prev, curr) =>prev + curr, 0);
        return this._form.roundNumber(total, this.NUM_MAX_ROUND);
    }

    getNumeroCuota(){
        const numeroCuota = this.tiempoCreditos.find(item=>item.idTiempoCredito===this.data.idTiempoCredito).numeroCuota;
        return numeroCuota;
    }


    //Generar Nueva cuota 
    async generarNuevaCuota(){  
        let tiempoCredito = this.tiempoCreditos.find(item=>item.idTiempoCredito===this.data.idTiempoCredito);

        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>Está seguro/a de generar <h3><b>${tiempoCredito.numeroCuota} </b></h3> 
                   ${tiempoCredito.numeroCuota===1?'Cuota':'Cuotas'} del Comprobante 
                   <b>N°. ${this.data.serieComprobante}</b></small>`,
            showDenyButton: true,
            confirmButtonText: `Si, generar`,
            denyButtonText: `No, cancelar`,
            allowOutsideClick: false,
            allowEscapeKey:false                        
        })

        if(isConfirmed){        
            let data = {
                idCuentaPorPagar: this.data.id,
                idTiempoCredito: this.data.idTiempoCredito,
                codPago: this.data.codPago
            };

            this._mS.getData('post','CuentaPorPagar/'+ JSON.stringify(data), null, true).then(response => {
                if (response.code === "0") {
                    this._form.sweetAlert('warning', response.message, response.titleSms);                                                               
                    return
                }
                if (response.code == "1") {
                    this._form.sweetAlert('success', response.message, response.titleSms, 1000); 
                    let cuotas = response.payload ? JSON.parse(response.payload) : []
                    this.cuotas = cuotas.map(item=>{
                        item.fechaVencimiento = this._form.formatDate(item.fechaVencimiento);
                        return item
                    })  
                                       
                }
            })

        }else{            
            this.data.idTiempoCredito = this.cloneIdTiempoCredito;
            this.$scope.$apply();
        }
    }

    async getConfigFechaCuota(validacion){
        try {
            if(this._form.campo(this.configFecha)){
                this._form.sweetAlert('warning', 'Fecha Inválida', 'Configuración de Fecha');
                return
            }
            if (this.configFecha.getFullYear().toString().length !== 4) {
                this._form.sweetAlert('warning', 'El Formato del Año es incorrecto', 'Configuración de Fecha');
                return                       
            }
    
            if (!validacion && this.configFecha.getDate() >= 28) {
                this._form.sweetAlert('warning', 'Para la opción <code>Mismo Día</code>, el día tiene que ser menor a 28 días!', 'Configuración de Fecha');                        
                return
            }
            
            showLoader();
            let configFecha = this._form.formatDate(this.configFecha);                       
            let cuotas = this.cuotas.map(({cxp})=>cxp);                
    
            await this._mS.getData('post', `/CuotaXPagar/NuevaFechaCuota?validacion=${validacion}&fecha=${configFecha}`, cuotas).then(response => {
                if (response.id === "0") {
                    this._form.sweetAlert('warning', response.message, response.titleSms);
                    return                            
                }
                if (response.id === "1") {
                    this._form.sweetAlert('success', 'Fecha de las cuotas configurado correctamente', 'Configuración Fecha', 1000)                
                   this.$uibModalInstance.close(response)               
                }
            })
        } catch (error) {
           console.log(error) 
        }finally{
            hideLoader();
        }
    }

    //Set Valor Entrada de las cuotas de una Factura 
    setValorEntrada(valorEntrada) {    
        // try {
            
            
            if([null, undefined, '0', ""].includes(valorEntrada)){
                setTimeout(() => {
                    $("#valorEntrada").select();
                }, 50);
                valorEntrada = 0;
                return                
            }

            let total = 0, valorCuota = 0;

            total = this.data.importeTotal - parseFloat(valorEntrada);
            total = this._form.roundNumber(total, 5);
            
            valorCuota = total / this.getNumeroCuota();
            valorCuota = this._form.roundNumber(valorCuota, 5);

            
            for (let val of this.cuotas) {
                if (val.nroCuota === "E") {
                    val.cuota = valorCuota === 0 ? this.data.importeTotal : valorEntrada;
                }
                if (val.nroCuota !== "E") {
                    val.cuota = valorCuota;
                }
            }

            this.totalCuota = this._form.roundNumber(this.getTotalCuota(), this.NUM_MAX_ROUND)
            
        // } catch (error) {
        //     console.log(error)              
        // }                
    }


    //Set valor por cuota 
    setValorCuota(cuota) {  
        // try {
                                        
            if ([null, undefined, "", "0", "-"].includes(cuota.cuota)) {            
                setTimeout(() => {
                    $("#setValcuota" + cuota.idCuotaXPagar).select();
                }, 50);
                return
            }
        

            let menorCuotas = this.cuotas.filter((val, index, arrayCuota) => index <= arrayCuota.indexOf(cuota));
            let mayorCuotas = this.cuotas.filter((val, index, arrayCuota) => index > arrayCuota.indexOf(cuota));
            let rowTotalCuota = menorCuotas.map(val => Number(val.cuota)).reduce((prev, curr) => prev + curr, 0);

            if (rowTotalCuota > this.data.importeTotal) {
                toastr.warning('El valor de la Cuota tiene que ser menor al Total del Documento');                    
            }

            if (mayorCuotas.length > 0) {
                let total = this.data.importeTotal - rowTotalCuota; //Total Cuota - total Factura  
                console.log(rowTotalCuota, this.data.importeTotal)
                let numeroCuota = mayorCuotas.length;
                let valorCuota = total / numeroCuota;

                console.log(this.cuotas)
                console.log(valorCuota)
                angular.forEach(this.cuotas, (val, index, arrayCuotas) => {
                    //Si la Cuota tiene entrada 
                    if (val.nroCuota !== "E" && index > arrayCuotas.indexOf(cuota)) {
                        val.cuota = this._form.roundNumber(valorCuota, 5);
                    } else if (index > arrayCuotas.indexOf(cuota)) {
                        val.cuota = this._form.roundNumber(valorCuota, 5);
                    }
                });

            }

            this.totalCuota = this._form.roundNumber(this.getTotalCuota(), this.NUM_MAX_ROUND) //Suma Total Cuota            
            let diferencia = this.data.importeTotal - this.totalCuota;
            this.totalDiferencia = this._form.roundNumber(diferencia, this.NUM_MAX_ROUND)     
        // } catch (error) {
        //    console.log(error)    
        // }   
    }

    //Set date fecha Vencimiento by cuota 
    setFechaVencimientoCuota(cuota) {
        let inputFvcto = $("#fechaVencimiento" + cuota.idCuotaXPagar);

        if (this._form.campo(cuota.fechaVencimiento)) {
            inputFvcto.removeClass('is-valid');
            inputFvcto.addClass('is-invalid');
            return
        } else {
            inputFvcto.addClass('is-valid');
            inputFvcto.removeClass('is-invalid');
        }

        for (let i = 0; i < this.cuotas.length; i++) {
            if (i < this.cuotas.indexOf(cuota)) {
                if (cuota.fechaVencimiento <= this.cuotas[i].fechaVencimiento) {
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
    async guardarCuota() {            
        if (this.cuotas.some(val => val.nroCuota === "E" && [null, undefined, "", 0, "0", ".", "-"].includes(val.cuota))) {
            toastr.warning('Ingrese el Valor de la Entrada', 'Guardar Cuotas');
            return
        }

        if (this.cuotas.some(val => [null, undefined, "", 0, "0", ".", "-"].includes(val.cuota) || val.cuota < 0)) {
            toastr.warning('Verifique el valor de las Cuotas', 'Guardar Cuotas');
            return
        }

        if (this.cuotas.some(val => [null, undefined, ""].includes(val.fechaVencimiento) || $("#fechaVencimiento" + val.idCuotaPorPagar).hasClass('is-invalid'))) {
            toastr.warning('Ingrese las fechas de vencimiento correctamente');
            return
        }
        
        if (this._form.roundNumber(this.totalCuota) !== this._form.roundNumber(this.data.importeTotal)) {
            this._form.sweetAlert('warning', 'El valor total del Documento no coincide con el valor total de la Cuota')            
            return
        }

        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>Está seguro/a de guardar las cuotas de este Comprobante
                    N°: <b>${this.data.serieComprobante}</b></small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si, guardar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        })
        
        if(isConfirmed){
            let cuotas = this.cuotas;

            this._mS.getData('put', 'CuentaPorPagar/' + this.data.id + '?json=' + JSON.stringify(cuotas), null, true)
            .then(response => {
                if (response.code === "0") {
                    this._form.sweetAlert('warning', response.message, response.titleSms);
                    return
                }
                if (response.code === "1") {
                    this._form.sweetAlert('success', response.message, response.titleSms, 1000);
                    let cuotas = response.payload ? JSON.parse(response.payload) : []
                    this.cuotas = cuotas.map(item=>{
                        item.fechaVencimiento = this._form.formatDate(item.fechaVencimiento);
                        return item
                    })                                    
                }
            });
        }            
    }



    closeModal(){
        this.$uibModalInstance.close();
    }


}