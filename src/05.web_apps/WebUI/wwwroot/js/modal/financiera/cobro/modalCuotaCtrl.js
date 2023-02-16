


class ModalBaseCtrl{

    constructor(){

    }


    

}


export class ModalCuotaNuevoCtrl extends ModalBaseCtrl{

    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'formulario', 'params']

    constructor($scope, $uibModalInstance, _mS, _tS, _fS, _params){
        super()

        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._tS = _tS;     
        this._fS = _fS;   

        let {cuotas, data, TIPO_DOC} = _params;

        this.cuotasTemp = cuotas;
        this.data   =Object.assign({}, data);
        this.cloneIdTiempoCredito = this.data.idTiempoCredito;

        this.TIPO_DOC = TIPO_DOC;

        this.configFecha = this._fS.formatDate(this.data.fechaEmision);
        this.totalCuota = 0;
        this.totalDiferencia = 0;

    }

    async $onInit(){
        try {

            await this._mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
                let results = JSON.parse(response.payload)
                console.log(results)
                this.tiempoCreditos = results[5];
            })
            
            this.mappedCuota();

            this.totalCuota = this.getTotalCuota();
        } catch (error) {
            console.log(error)
        }
        console.log(this)        
    }


    mappedCuota(){
        this.cuotas = this.cuotasTemp.map(val => {
            let fechaVcto = val.cxc.fechaVencimiento.split(" ")[0].split("/").reverse().join("/");                           
            val.cxc.fechaVencimiento = new Date(fechaVcto);
            return val;
        });     
    }

    getTotalCuota() {
        let total = this.cuotas.map(val => Number(val.cxc.cuota)).reduce((prev, curr) => prev + curr, 0);
        return this._fS.roundNumber(total, 3);
    }


    getFechaEscritaCuota(item) {        
        if (!this._fS.campo(item.fechaVencimiento)) {
            return item.fechaVencimiento.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });
        }            
    }



    async onChangeTiempoCredito() {
        try {

            let dataCredito = this.tiempoCreditos.find(item=>item.idTiempoCredito===this.data.idTiempoCredito);

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
              })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({            
                html: `<small>Está seguro/a de generar <h3><b> ${dataCredito.numeroCuota}</b></h3> cuotas de este Comprobante <b>N°. ${this.data.nroDocumento}</b></small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '<i class=" fas fa-arrow-alt-circle-right"></i> Si, continuar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false
            })

            if(isConfirmed){
                this.crearCuota();
                this.cloneIdTiempoCredito = this.data.idTiempoCredito;
                this.$scope.$apply()
            }else{
                this.data.idTiempoCredito = JSON.parse(JSON.stringify(this.cloneIdTiempoCredito));   
                this.$scope.$apply()
            }

        } catch (error) {
            console.log(error)
        }        
    }



    crearCuota() {
        let data = {
            cxc: {
                idComprobante: this.data.id,
                idTipoDocumento: this.TIPO_DOC.idTipoDocumento,
            },
            idTiempoCredito: this.data.idTiempoCredito,
            fechaEmision:this.data.fechaEmision,
            total: this.data.total
        };

        this._mS.getData('post', '/CuotaXCobrar/Post', data).then(response => {
            if (response.id === "0") {
                this._fS.sweetAlert('warning', response.message, response.titleSms);                                                       
            }
            if (response.id == "1") {
                this._fS.sweetAlert('success', response.message, response.titleSms, 1000);                   
                this.$uibModalInstance.close(response)                                                    
            }
        })
    }



    setNewFechaVcto(valid) {                                                 
        
        try {
            if (this.configFecha === undefined || this.configFecha === null) {
                this._fS.sweetAlert('warning', 'Fecha Inválida');              
                return
            }
    
            if (this.configFecha.getFullYear().toString().length !== 4) {
                this._fS.sweetAlert('warning', 'El Formato del Año es incorrecto');                             
                return
            }
    
            if (!valid && this.configFecha.getDate() >= 28) {
                this._fS.sweetAlert('warning','Para la opción <code>Mismo Día</code>, el día tiene que ser menor a 28 días!');               
                return
            };
            
            //console.log($scope.data.configFecha);
            let fechaConfig = this._fS.formatDate(this.configFecha);
            //let fechaConfig = cuotaVentaSvc.getFechaAsString($scope.data.configFecha);
            let cuotas = this.cuotas.map(val => {
                return {
                    idCuotaXCobrar: val.cxc.idCuotaXCobrar,
                    cuota: Number(val.cxc.cuota),
                    fechaVencimiento: val.cxc.fechaVencimiento,
                    nroCuota: val.cxc.nroCuota
                }
            })

            console.log(fechaConfig)
            
            this._mS.getData('post', '/CuotaXCobrar/GenerateNewDate?valid=' + valid + '&fecha=' + fechaConfig, cuotas).then(response => {
                if (response.id == "0") {
                    this._fS.sweetAlert('warning', response.message, response.titleSms);                   
                    return
                }
                if (response.id == "1") {
                    this._fS.sweetAlert('success', response.message, response.titleSms);    
                    this.$uibModalInstance.close(response)                                
                }
            });
        } catch (error) {
            console.log(error)
        }
    }



    setValorEntrada(valorEntrada) {
        try {
            let subTotalCuota = 0, cuota = 0;
            let dataCredito = this.tiempoCreditos.find(item=>item.idTiempoCredito===this.data.idTiempoCredito)

            this.totalDiferencia = 0;
            
            if (![null, undefined, "", "0"].includes(valorEntrada)) {
                if (Number(valorEntrada) >= this.data.total) {
                    valorEntrada = this.data.total;
                }
            } else {
                setTimeout(() => {
                    $("#valorEntrada").select();
                }, 50)
                valorEntrada = 0;
            }


            subTotalCuota = this.data.total - Number(valorEntrada);
            subTotalCuota = this._fS.roundNumber(subTotalCuota, 3);
            cuota         = subTotalCuota / dataCredito.numeroCuota;
            cuota         = this._fS.roundNumber(cuota, 3);

            for (let val of this.cuotas) {
                if (val.nroCuota === "E") {
                    val.cxc.cuota = subTotalCuota == 0 ? this.data.total : valorEntrada;
                }
                if (val.nroCuota !== "E") {
                    val.cxc.cuota = cuota;
                }
            }

            this.totalCuota = this.getTotalCuota();

        } catch (error) {
            console.log(error)
        }
    }



    setValorCuota(cuota) {
        try {
            this.totalDiferencia = 0;

            if ([null, undefined, "", "0", "-"].includes(cuota.cxc.cuota)) {
                cuota.cxc.cuota = 0;
                setTimeout(() => {
                    $("#setValcuota" + cuota.cxc.idCuotaXCobrar).select();
                }, 50);
            }

            let getCuotasIndexMenor = this.cuotas.filter((val, index, arrayCuota) => index <= arrayCuota.indexOf(cuota));
            let getCuotasIndexMayor = this.cuotas.filter((val, index, arrayCuota) => index > arrayCuota.indexOf(cuota));
            let rowTotalCuota = getCuotasIndexMenor.map(val => Number(val.cxc.cuota)).reduce((prev, curr) => prev + curr, 0);

            if (rowTotalCuota > this.data.total) {
                this._tS.toastr('warning', 'El valor de la Cuota tiene que ser menor al Total del Comprobante');                
            }

            if (getCuotasIndexMayor.length > 0) {
                let result = this.data.total - rowTotalCuota; //Total Cuota - total Factura  
                let numeroCuota = getCuotasIndexMayor.length;
                let valorCuota = result / numeroCuota;

                angular.forEach(this.cuotas, (val, index, arrayCuotas) => {
                    //Si la Cuota tiene entrada 
                    if (val.nroCuota !== "E" && index > arrayCuotas.indexOf(cuota)) {
                        val.cxc.cuota = this._fS.roundNumber(valorCuota, 3);
                    } else if (index > arrayCuotas.indexOf(cuota)) {
                        val.cxc.cuota = this._fS.roundNumber(valorCuota, 3);
                    }
                });

            }

            this.totalCuota = this.getTotalCuota();
            let result = this.data.total - this.totalCuota;
            this.totalDiferencia = this._fS.roundNumber(result, 3);

        } catch (error) {
            console.log(error)
        }

    }



    setFechaVencimientoCuota(cuota) {
        try {
            let inputFvcto = $("#fechaVencimiento" + cuota.cxc.idCuotaXCobrar);

            if (cuota.cxc.fechaVencimiento === undefined || cuota.cxc.fechaVencimiento == null) {
                inputFvcto.removeClass('is-valid');
                inputFvcto.addClass('is-invalid');
                return
            } else {
                inputFvcto.addClass('is-valid');
                inputFvcto.removeClass('is-invalid');
            }

            for (var i = 0; i < this.cuotas.length; i++) {
                if (i < this.cuotas.indexOf(cuota)) {
                    if (cuota.cxc.fechaVencimiento <= this.cuotas[i].cxc.fechaVencimiento) {
                        inputFvcto.removeClass('is-valid');
                        inputFvcto.addClass('is-invalid');
                        return;
                    } else {
                        inputFvcto.removeClass('is-invalid');
                        inputFvcto.addClass('is-valid');
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    }



    async onSave() {            

        try {
            if (this.cuotas.some(val => val.nroCuota === "E" && [null, undefined, "", 0, "0", ".", "-"].includes(val.cxc.cuota))) {
                this._tS.toastr('warning', 'Ingrese el Valor de la Entrada', 'Guardar Cuotas');
                return
            }
    
            if (this.cuotas.some(val => [null, undefined, "", 0, "0", ".", "-"].includes(val.cxc.cuota) || val.cxc.cuota < 0)) {
                this._tS.toastr('warning', 'Verifique el valor de las Cuotas', 'Guardar Cuotas');
                return
            }

            if (this.cuotas.some(val => [null, undefined, ""].includes(val.cxc.fechaVencimiento) || $("#fechaVencimiento" + val.cxc.idCuotaXCobrar).hasClass('is-invalid'))) {
                this._tS.toastr('warning', 'Verifique las Fechas de Vcto.');
                return
            }
    
            if (this._fS.roundNumber(this.totalDiferencia) > 0 || this._fS.roundNumber(this.totalDiferencia) < 0) {
                this._tS.toastr('warning', 'El valor de la Diferencia tiene que ser 0');
                return
            }

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await  swalWithBootstrapButtons.fire({                
                html: `<small>Está seguro/a de guardar las cuotas de este Comprobante N°: <b>${this.data.nroDocumento}</b></small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false
            })
            
            if(isConfirmed){
                showLoader();

                let cuotas =  this.cuotas.map(val => {
                    return {
                        idCuotaXCobrar: val.cxc.idCuotaXCobrar,
                        cuota: Number(val.cxc.cuota),
                        fechaVencimiento: val.cxc.fechaVencimiento,
                        nroCuota: val.cxc.nroCuota
                    }
                })

                await this._mS.getData('post', `/CuotaXCobrar/Put?idComprobante=${this.data.id}&idTipDoc=${this.TIPO_DOC.idTipoDocumento}`, cuotas).then(response => {
                    if (response.id === "0") {
                        this._fS.sweetAlert('warning', response.message, response.titleSms);                                           
                    }
                    if (response.id === "1") {
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);                                                               
                        this.$uibModalInstance.close(response)
                    }
                })
            }
            
        } catch (error) {
            
            console.log(error)

        }finally{

            hideLoader();

        }
        
    }


    closeModal(){
        this.$uibModalInstance.close();
    }

}