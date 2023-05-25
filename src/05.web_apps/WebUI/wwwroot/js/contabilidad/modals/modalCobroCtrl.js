
class CobroService {
    constructor(tS, mS){
        this.tS = tS;
        this.mS = mS;
        this.cobroDetalle = [];
        this.historialCobros = []
    }

    isDateValid(dateString) {
        var date = new Date(dateString);
        console.log(dateString);
        if (isNaN(date.getTime())) {
            return false; // La fecha no es válida
        }
        return true; // La fecha es válida
    }
    isValidForm(cobro, codigoEntidad){
        if(!cobro.idSubEntidadFinanciera>0){
            this.tS.toastr('warning', 'Seleccione la SubEntidad Financiera')
        }

        if(!cobro.fechaEmision){
            this.tS.toastr('warning', 'Ingrese la fecha de emisión')
            return
        }
        if(!this.isDateValid(cobro.fechaEmision)){
            this.tS.toastr('warning', 'Ingrese una fecha válida')
            return
        }

        if(!cobro.valorAbono>0){
            this.tS.toastr('warning', 'Ingrese el valor de abono')
            return
        }

        // =================== TARJETA DE CREDITO / DEBITO  =================================== //
        if(codigoEntidad==='TAR'){
           if(!cobro.nro){
            this.tS.toastr('warning', 'Ingrese el Número')
            return
           }

           if(!cobro.idCiudad>0){
            this.tS.toastr('warning', 'Ingrese la Ciudad')
            return
           }
           if(!cobro.referencia){
            this.tS.toastr('warning', 'Ingrese la referencia')
            return
           }
           if(!cobro.aprobacion){
            this.tS.toastr('warning', 'Ingrese la Aprobación')
            return
           }
           if(!cobro.lote){
            this.tS.toastr('warning', 'Ingrese el Lote')
            return
           }
        }

        // =================== TRANSFERENCIAS  =================================== //

        if(codigoEntidad==='TRA'){
            if(!cobro.idBanco>0){
                this.tS.toastr('warning', 'Ingrese el Banco')
                return
            }
            if(!cobro.nro){
                this.tS.toastr('warning', 'Ingrese el Número')
                return
            }
        }

        // =================== CHEQUES  =================================== //
        
        if(codigoEntidad==='CHE'){
            if(!cobro.idBanco>0){
                this.tS.toastr('warning', 'Ingrese el Banco')
                return
            }
            if(!cobro.nro){
                this.tS.toastr('warning', 'Ingrese el Número')
                return
               }
    
            if(!cobro.idCiudad>0){
                this.tS.toastr('warning', 'Ingrese la Ciudad')
                return
               }
            if(!cobro.referencia){
                this.tS.toastr('warning', 'Ingrese a quien va dirigido el Cheque')
                return
            }
        }

        return true;
    }


    // set setValorAbono(valorAbono){
    //     this.valorAbono = valorAbono;
    // }

    // get valorAbono(){
    //     return this.valorAbono;
    // }

    // agregarFormaCobro(secuencial, isPosFechado){
        
    //     let valorAbono = 0;
        
    //     for (let i = 0; i < this.selectedDocumentos.length; i++) {
            
    //         for (let val of this.selectedDocumentos[i].cuotas) {

    //             valorAbono = ModalCobroCtrl.getValorAbono //Recuperamos el valor del Pago   
               
    //             if (valorAbono === 0) return
                
    //             if ((val.cxc.cuota === val.saldo) && (val.abono === 0 || val.abonoPosfechado === 0)) {
                    
    //                 this.ningunAbono(val, valorAbono, secuencial, isPosFechado);

    //             } else if (val.cxc.cuota !== val.saldo && val.saldo > 0) {

    //                 this.tieneAbono(val, valorAbono, secuencial, isPosFechado);

    //             }

    //             val.cxc.cuota        = this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND);
    //             val.abono            = this._fS.roundNumber(val.abono, this.NUM_MAX_ROUND);
    //             val.abonoPosfechado  = this._fS.roundNumber(val.abonoPosfechado, this.NUM_MAX_ROUND);
    //             val.saldo            = this.verificarEstadoSaldo(val) //Verificamos el saldo de la Cuota 
    //             val.estadoFinanciero = this.verificarEstadoPago(val);
    //             val.cuotaAfectado    = true;
    //         }
    //     }
    // }

    /**
     * 
     * @param {number} secuencial 
     * @param {boolean} isPosFechado 
     * @param {Array} selectedDocumentos [{ cuotas: []}]
     * @returns 
     */
    agregarFormaCobro(secuencial, isPosFechado, selectedDocumentos){
        
        let valorAbono = 0;
        
        for(let selectedItem of selectedDocumentos){
            for (let dataCuota of selectedItem.cuotas) {
                valorAbono = this.valorAbono; //valor que se Ingresa manualmente 

                if (valorAbono === 0) return
                
                if ((dataCuota.cuota === dataCuota.saldo) && (dataCuota.abono === 0 || val.abonoPosfechado === 0)) {
                    
                    this.ningunAbono(dataCuota, valorAbono, secuencial, isPosFechado);

                } else if (dataCuota.cuota !== dataCuota.saldo && dataCuota.saldo > 0) {

                    this.tieneAbono(dataCuota, valorAbono, secuencial, isPosFechado);

                }

                // val.cxc.cuota        = this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND);
                // val.abono            = this._fS.roundNumber(val.abono, this.NUM_MAX_ROUND);
                // val.abonoPosfechado  = this._fS.roundNumber(val.abonoPosfechado, this.NUM_MAX_ROUND);
                // val.saldo            = this.verificarEstadoSaldo(val) //Verificamos el saldo de la Cuota 
                // val.estadoFinanciero = this.verificarEstadoPago(val);
                // val.cuotaAfectado    = true;
            }
        }               
    }

    
//     //Si la cuota no tiene ningun abono 
    ningunAbono(val, valorAbono, secuencial, isPosFechado) {

        if (val.saldo >= valorAbono) {

            val.abono           = isPosFechado ? 0 : valorAbono;
            val.abonoPosfechado = isPosFechado ? valorAbono : 0;
            val.saldo           = val.saldo - valorAbono;

            this.setValorAbono = 0; //Set valor Abono en 0

            this.setCobroCuota(val, valorAbono, secuencial, isPosFechado);

        } else if (val.saldo <= valorAbono) {

            val.abono = isPosFechado ? 0 : val.cuota;
            val.abonoPosfechado = isPosFechado ? val.cuota : 0;
            val.saldo = valorAbono -= val.saldo;

            this.setValorAbono = valorAbono; //Set valor Abono restante
            this.setCobroCuota(val, val.cuota, secuencial, isPosFechado);
        }
    }



    tieneAbono(val, valorAbono, secuencial, isPosFechado) {
        let resultAbono = 0;

        //si el valor abono es menor al saldo 
        if (val.saldo >= valorAbono) {
            if (isPosFechado) {
                val.abonoPosfechado = valorAbono + val.abonoPosfechado;
            } else {
                val.abono = valorAbono + val.abono;
            }
            val.saldo = val.saldo - valorAbono;

            this.setValorAbono = 0; //Set valor Abono en 0
            this.setCobroCuota(val, valorAbono, secuencial, isPosFechado);

        } else if (val.saldo <= valorAbono) { //si el valor abono es mayor al saldo 
            if (isPosFechado) {
                val.abonoPosfechado = val.abonoPosfechado + val.saldo;
            } else {
                val.abono = val.abono + val.saldo;
            }

            resultAbono = valorAbono -= val.saldo;
            valorAbono = resultAbono; // redondear mas adelante 
           
            this.setValorAbono = valorAbono //Set valor Abono en 0
            this.setCobroCuota(val, val.saldo, secuencial, isPosFechado);
        }
    }


    setCobroCuota(val, valor, secuencial, isPosfechado) {            
        
        if (val.cuota !== 0) {
            this.cobroDetalle.push({
                idDocumento: val.idDocumento,
                idTipoDocumento: val.idTipoDocumento,
                idCuotaXCobrar: val.idCuotaXCobrar,
                abono: valor,            
               // cuota: this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND),
                saldo: this.verificarEstadoSaldo(val),
                isPosfechado,
                secuencial
            });
        }
    }

        
    verificarEstadoSaldo(val) {
        
        let total = val.abono + val.abonoPosfechado;

        if(total === val.cuota){
            return 0;
        }

        return  total;
    }

    /**
     * 
     * @param {Array} selectedDocumentos 
     */
    getHistorialCobros(selectedDocumentos){        
        for(let item of selectedDocumentos){
            let totalAbono = this.cobroDetalle.filter(cd =>cd.idDocumento===item.idDocumento && cd.idTipoDocumento===item.idTipoDocumento)
                                              .reduce((prev, curr)=>prev + curr.abono, 0);
            if(totalAbono > 0){
                this.historialCobros.push({
                    idDocumento: item.idDocumento,
                    idTipoDocumento: item.idTipoDocumento,
                    abono: totalAbono
                })
            }else break;
        }
    }

    save(data){
        return this.mS.getData('post', 'ComprobanteIngreso/Insert', {data : data}, true);
    }

}


export {
    ModalCobroRapidoCtrl
}

ModalCobroRapidoCtrl.$inject = [
            '$scope',         
            '$uibModalInstance', 
            'mainService',
            'commonService',
            'modalService',
            'nombreModal',
            'toastService', 
            'formulario', 
            'params'
        ]
    

function ModalCobroRapidoCtrl($scope, $uibModalInstance, mS, commonSvc, modalSvc, nombreModal, tS, fS, params){
    let {TIPO_DOC, data}= params;
    let {id, idTipoDocumento} = data;
    let cobroSvc = new CobroService(tS, mS);
        $scope.data = {}  

    $scope.cobro ={
        valorAbono: 0,
        valorSaldo: 0,
        valorCambio: 0,
        abono :0,
        fechaEmision: new Date()
    };
    

    $scope.entidadFinanciera  = {};
    $scope.banco              = {};
    $scope.cuentaBancaria     = {};
    $scope.estadoCobro        = {};

    $scope.selectedDocumentos = [];
    $scope.cloneSelectedDocumentos = [];

    const NUM_MAX_ROUND = 5;



    $scope.resetData = function () {
        $scope.cobro.valorAbono = $scope.comprobante.saldo;                    
        $scope.cobro.valorCambio = 0;            
        
        $scope.cobro.valorSaldo = 0;                                  
        $scope.cobro.fechaEmision= new Date();
        $scope.cobro.idBanco = 0; 
        $scope.cobro.nro = null;          
        $scope.cobro.referencia=null;
        $scope.cobro.idCiudad = 0;
        $scope.cobro.aprobacion = null;
        $scope.cobro.lote = null;
        $scope.cobro.posFechado = false;
    
        if($scope.entidadFinanciera.codigo==='CHE'){
            $scope.cobro.referencia = $scope.comprobante.nombreFiscal            
        }                    
    }

    $scope.findSubEntidad = function(id){
        $scope.entidadFinanciera = $scope.entidadesFinancieras.find(item=>item.idEntidadFinanciera===id);
        $scope.subEntidadesFinancieras = $scope.tempSubEntidadesFinancieras.filter(item=>item.idEntidadFinanciera===id);
        $scope.cobro.idSubEntidadFinanciera = $scope.subEntidadesFinancieras[0].idSubEntidadFinanciera;
        $scope.resetData();
    }
    
    $scope.initiload = function(){
        try {
            showLoader();
            let query = {
                tipo: 2,
                idTipoDocumento,
                idDocumento: id
            }
            mS.getData('get', 'CuentaPorCobrar/?json=' + JSON.stringify(query), null, true).then(response=>{
                let data =  JSON.parse(response.payload);
                $scope.entidadesFinancieras = data[0];
                let idEntidadFinanciera = $scope.entidadesFinancieras.find(val => val.codigo === 'EFE').idEntidadFinanciera
                $scope.tempSubEntidadesFinancieras = data[1]; //Todo los subentidades 
                $scope.bancos = data[2];
                $scope.ciudades = data[3];
                $scope.cuotas = data[4];                

                $scope.comprobante = data[5][0];

                $scope.selectedDocumentos = [{
                    ...$scope.comprobante,
                    cuotas: $scope.cuotas
                }]
                $scope.cloneSelectedDocumentos = JSON.parse(JSON.stringify($scope.selectedDocumentos))


                $scope.cobro = Object.assign($scope.cobro, {
                    valorAbono: $scope.comprobante.saldo,  
                    abono: $scope.comprobante.saldo                   
                })
                $scope.findSubEntidad(idEntidadFinanciera);
                hideLoader();

            }).catch(error=>{
                hideLoader();
                console.log(error)
            })
        } catch (error) {
            hideLoader();

            console.log(error)
        }
    }
    $scope.initiload();

    
    $scope.setValorEfectivo = function(){
        let valorCambio=0, valor=0, abono=0, saldo;
        if(!(typeof $scope.cobro.valorAbono === 'number')){
            tS.toastr('warning', 'Ingrese un número válido');
            return
        }
            
        if($scope.cobro.valorAbono>=$scope.comprobante.saldo){                
            valorCambio =  $scope.cobro.valorAbono - $scope.comprobante.saldo;
            $scope.cobro.valorCambio = fS.roundNumber(valorCambio, NUM_MAX_ROUND);
            $scope.cobro.abono = fS.roundNumber($scope.comprobante.saldo,NUM_MAX_ROUND);   
            $scope.cobro.valorSaldo = 0;
        }else{
            $scope.cobro.valorSaldo = $scope.comprobante.saldo;

            saldo = $scope.cobro.valorSaldo - $scope.cobro.valorAbono;                
            $scope.cobro.valorCambio = 0;   
            $scope.cobro.valorSaldo = fS.roundNumber(saldo, NUM_MAX_ROUND);
            $scope.cobro.abono = fS.roundNumber($scope.cobro.valorAbono, NUM_MAX_ROUND)
        }
    }

    $scope.save = function(){
        try {
            if(!cobroSvc.isValidForm($scope.cobro, $scope.entidadFinanciera.codigo)) throw 'Form invalid'

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
                        idCliente : $scope.comprobante.idCliente,
                        total : $scope.cobro.valorAbono,
                        abono : $scope.cobro.abono,
                        codEstab : $scope.comprobante.codEstab,
                        numeroIdentificacion : $scope.comprobante.numeroIdentificacion,
                        nombreFiscal : $scope.comprobante.nombreFiscal
                    }
                    
                    let cobrosPagos = {
                        idSubEntidadFinanciera : $scope.cobro.idSubEntidadFinanciera,
                        idEntidadFinanciera : $scope.entidadFinanciera.idEntidadFinanciera,   
                        idBanco : $scope.cobro.idBanco,                
                        idCuentaBancaria : 0,   
                        fechaEmision : fS.formatDateTimeZone($scope.cobro.fechaEmision),     
                        valor : $scope.cobro.valorAbono,        
                        posfechado : $scope.cobro.posFechado,             
                        secuencial : 0,          
                        infoCobro : $scope.entidadFinanciera.codigo === 'EFE' ? undefined : [{
                                                                                                nro: $scope.cobro.nro,
                                                                                                lote:$scope.cobro.lote,
                                                                                                aprobacion: $scope.cobro.aprobacion,
                                                                                                referencia: $scope.cobro.referencia
                                                                                            }],    
                        abono : $scope.cobro.abono,       
                        controlCaja : $scope.subEntidadesFinancieras.find(item=>item.idSubEntidadFinanciera===$scope.cobro.idSubEntidadFinanciera).controlCaja, 
                    }

                    cobroSvc.valorAbono = $scope.cobro.valorAbono;

                    let selectedDocumentos = JSON.parse(JSON.stringify($scope.cloneSelectedDocumentos))
                    
                    cobroSvc.cobroDetalle = [];
                    cobroSvc.historialCobros = [];
                    cobroSvc.agregarFormaCobro(0, $scope.cobro.posFechado, selectedDocumentos);
                    cobroSvc.getHistorialCobros(selectedDocumentos);

                
                    let data = {
                        comprobante : comprobante,
                        cobros : cobrosPagos,
                        cobroDetalle : cobroSvc.cobroDetalle,
                        historial: cobroSvc.historialCobros
                    }

                    showLoader();
                    cobroSvc.save(data).then(response=>{
                        hideLoader();
                        if(response.code==='0'){
                            fS.sweetAlert('warning', response.message)
                        }
                        if(response.code==='1'){
                            fS.sweetAlert('success', response.message)
                            $uibModalInstance.close(response)
                        }
                    }).catch(error=>{
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


    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}



// export class ModalCobroRapidoCtrl extends ModalCobroCtrl{
//     static $inject = [
//         '$scope',         
//         '$uibModalInstance', 
//         'mainService',
//         'commonService',
//         'modalService',
//         'nombreModal',
//         'toastService', 
//         'formulario', 
//         'params'
//     ]

//     constructor($scope, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModal, _tS, _fS, _params){
//         super({$scope, $uibModalInstance, _mS, _commonSvc, _tS, _fS})
          
//         this._modalSvc         = _modalSvc;
//         this._nombreModal      = _nombreModal;
        
//         let {TIPO_DOC, data}= _params;
        
//         this.TIPO_DOC = TIPO_DOC;
//         this.data = data;

//         // this._cobroSvc         = new CobroService($http, _form, _toast);

//         this.cobro              ={};
//         this.cobro.valorCambio  = 0; 

//         this.entidadFinanciera  = {};
//         this.banco              = {};
//         this.cuentaBancaria     = {};
//         this.estadoCobro        = {};

//         // this.cliente            = this._params.cliente;
//         // this.cliente.correos    = this._form.getTagInputAsList(this.cliente.correo);
//         // this.dataTipoDocumento  = this._params.dataTipoDocumento;    
         
//     }

//     async $onInit(){

//         try {

//             showLoader();
            
//             let resultMain = await  Promise.all([
//                 this._mS.getData('get','/EntidadFinanciera/OptionEntidadFinanciera').then(response=>response.data),
//                 this._mS.getData('get','/Banco/GetByAll').then(response=>response.data),
//                 this._mS.getData('get','/Ciudad/ReadCiudadProvincia').then(response=>response.data)
//             ])


//             this.entidadesFinancieras = resultMain[0];
//             this.entidadFinanciera = this.entidadesFinancieras.find(val => val.codigo === 'EFE');
//             this.getSubEntidadByIdEntFinanciera();

//             this.bancos = resultMain[1];
//             this.ciudadPronvincias = resultMain[2];

//             this.getAllCuota();

            

//         } catch (error) {
//             console.log(error)
//         }finally{
//             hideLoader();
//         }   
                
//         this.$uibModalInstance.rendered.then(()=>{
          
//             $("#btnSaveCobroRapido").focus();   
//             // setTimeout(()=>{
//             //     $("#btnSaveCobroRapido").focus();
//             // }, 1000)
//         })
//     }

    
//     getAllCuota(){
//         let {idTipoDocumento, id} = this.data;

//         this._mS.getData('get', `/CuotaXCobrar/GetCuotaForPayment?idComprobante=${id}&idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}`).then(response=>{
//             if(response.id==="0"){
//                 this._fS.sweetAlert('warning', response.message, response.titleSms)
//             }

//             if(response.id=="1"){
//                 let cuotas = response.data;

//                 this.cobro.abonoAnterior = cuotas.map(val=>val.abono).reduce((acc, curr)=>acc+curr, 0);
//                 this.cobro.valorAbono    = cuotas.map(val=>val.saldo).reduce((acc, curr)=>acc+curr, 0);

//                 this.cobro.valorSaldo    = this.cobro.valorAbono;
//                 this.cobro.valor         = this.cobro.valorAbono; 
//                 this.cobro.abono         = this.cobro.valorAbono;                         
//                 this.cobro.fechaEmision  = new Date();      


//             }
//         })   
//     }

//     getSubEntidadByIdEntFinanciera(){        
//         this._mS.getData('get', '/SubEntidadFinanciera/GetByIdEntidadFinanciera?idEntidadFinanciera=' + this.entidadFinanciera.idEntidadFinanciera).then(response=>{
//             if (response.id == "0") {
//                 toastr.warning(response.message, response.titleSms);
//                 return
//             }
//             this.subEntidades = response.data;
//             this.subEntidad = response.data[0]; 
//         });
//     }


//     async openModalCobroDocumento(){
//         let {MODAL_FILE_CTRL, MODAL_COBRO_DOCUMENTO} = this._nombreModal.cobro;
//         let controller = (await import('./../../../' + MODAL_FILE_CTRL))[MODAL_COBRO_DOCUMENTO['controller']];
//         let template   = MODAL_COBRO_DOCUMENTO['template'];
        
        
//         let params = {
//             data: this.data,
//             TIPO_DOC: this.TIPO_DOC            
//         }

//         let $modalRef = this._modalSvc.openModalCustom({
//             controller,
//             template,
//             size: 'xl',
//             params
//         })

//         $modalRef.result.then(result=>{
//             if(typeof result==='object'){
//                 this.$uibModalInstance.close(result);
//             }
//         })


//     }

//     // async openModalCobro(){  
//     //     const {MODAL_COBRO_DOCUMENTO_CTRL, MODAL_COBRO_DOCUMENTO_CSHTML}= this._nombreModal.cobro;
//     //     const {ModalCobroDocumentoCtrl} = await import('./../modal/' + MODAL_COBRO_DOCUMENTO_CTRL);
//     //     const modalRef = this._modalSvc.openModalCustom({
//     //         controller: ModalCobroDocumentoCtrl,
//     //         template: 'Shared/Cobro/'+MODAL_COBRO_DOCUMENTO_CSHTML,
//     //         size: 'xl',
//     //         params: this._params
//     //     })
         
//     //     modalRef.result.then(response=>{            
//     //         if(typeof response==='object'){
//     //             this.$uibModalInstance.close(response)
//     //         }
//     //     })                                    
//     // }

//     tabEntidadFinanciera(ef) {  
//         this.cobro.valorAbono = this.cobro.valorSaldo;
//         this.cobro.valor = this.cobro.valorAbono; //Todo lo que se escribe  por pantalla;
//         this.cobro.abono = this.cobro.valorAbono;                
//         this.cobro.valorCambio = 0;            
//         this.entidadFinanciera = ef;
//         this.cobro.fechaEmision= new Date();
//         this.banco = {};
//         this.getSubEntidadByIdEntFinanciera(ef.idEntidadFinanciera);
     
//         if(ef.codigo==='CHE'){
//             this.cobro.referencia = JSON.parse(localStorage.getItem('userData')).entidad            
//         }
//     }

//     setValorEfectivo() {
//         let valorCambio=0, valor=0, abono=0, saldo;
//         if(this._fS.campo(this.cobro.valorAbono) || isNaN(this.cobro.valorAbono)){
//             valor = 0;
//         }else{
//             valor = Number(this.cobro.valorAbono);
//         }
                           
//         if(valor>=this.cobro.valorSaldo){                
//             valorCambio = valor - this.cobro.valorSaldo;
//             this.cobro.valorCambio = this._fS.roundNumber(valorCambio, 5);
//             this.cobro.valor = valor; //Todo lo que se escribe  por pantalla;
//             this.cobro.abono = this.cobro.valorSaldo;   
//         }else{
//             saldo = this.cobro.valorSaldo - valor;                
//             //this.cobro.valorSaldo = form.roundNumber(valorSaldo, 5);
//             this.cobro.valor = valor; //Todo lo que se escribe  por pantalla;
//             this.cobro.abono = valor;                   
//             this.cobro.valorCambio = 0;                
//         };            
//     }


//     validarFormaCobro(){                        
//         //Si el abono es Cheque
//         if (this.entidadFinanciera.codigo === "CHE") {
//            if (this._fS.campo(this.banco.idBanco)) {
//                this._tS.toastr('warning', 'Seleccione el Banco', 'Cobro');
//                return
//            }
//            if (this._fS.campo(this.cobro.nro)) {
//                this._tS.toastr('warning', 'Ingrese el Número', 'Cobro');
//                return
//            }
//         }
       
//        //Si es tarjeta de credito 
//         if (this.entidadFinanciera.codigo === "TAR") {
//            if (this._fS.campo(this.cobro.valorAbono)) {
//                this._tS.toastr('warning', 'Ingrese el Valor del Abono', 'Cobro');
//                return
//            }
//            if (this._fS.campo(this.cobro.nro)) {
//                this._tS.toastr('warning', 'Ingrese el Número', 'Cobro');
//                return
//            }
//            if (this._fS.campo(this.cobro.idCiudad)) {
//                this._tS.toastr('warning', 'Seleccione la Ciudad', 'Cobro');
//                return
//            }
//            if (this._fS.campo(this.cobro.aprobacion)) {
//                this._tS.toastr('warning', 'Ingrese la Aprobación', 'Cobro');
//                return
//            }
//            if (this._fS.campo(this.cobro.lote)) {
//                this._tS.toastr('warning', 'Ingrese el Lote', 'Cobro');
//                return
//            }
//            if (this._fS.campo(this.cobro.referencia)) {
//                this._tS.toastr('warning', 'Ingrese la Referencia', 'Cobro');
//                return
//            }
//         }

//        //Si es tranferencia 
//         if (this.entidadFinanciera.codigo == "TRA") {
//             if (this._fS.campo(this.cobro.valorAbono)) {
//                this._tS.toastr('warning', 'Ingrese un Valor a Cancelar', 'Cobro');
//                return
//             }
//             if (this._fS.campo(this.banco.idBanco)) {
//                this._tS.toastr('warning', 'Seleccione el Banco', 'Cobro');
//                return
//             }
//             if (this._fS.campo(this.cobro.nro)) {
//                this._tS.toastr('warning', 'Ingrese el Número', 'Cobro');
//                return
//             }
//         }

//         if(isNaN(this.cobro.valorAbono)){
//            this._tS.toastr('warning', 'Ingrese un Valor válido', 'Cobro');
//            return
//         }

//         if (this._fS.campo(this.cobro.valorAbono)) {
//            this._tS.toastr('warning', 'Ingrese un Valor a Cancelar', 'Cobro');
//            return
//         }
//         if (Number(this.cobro.valorAbono) === 0) {
//            this._tS.toastr('warning', 'El Valor a cancelar debe ser mayor 0', 'Cobro');
//            return
//         }

//         return true

//     }


//     onSave() {
        
//         if(!this.validarFormaCobro()) return
        
//         Swal.fire({
//             icon: 'warning',
//             html: `<small>Desea guardar este cobro ahora?</small>`,
//             showConfirmButton: true,
//             confirmButtonText: 'Si, guardar',
//             showCancelButton: true,
//             cancelButtonText: 'No, cancelar',
//             allowOutsideClick: false,
//             focusConfirm: true
//         }).then(result => {
//             if (result.isConfirmed) {
//                 this.postCobroRapido();                
//             }
//         })
//     }

//     postCobroRapido() {
//         try {
//             showLoader();
//                 let comprobante = {                  
//                     numeroIdentificacion : this.data.numeroIdentificacion,
//                     nombreFiscal : this.data.nombreFiscal,                              
//                     codEstab: this.data.codEstab,
//                     idCliente: this.data.idCliente,
//                     total: this.cobro.valorAbono,
//                     abono: this.cobro.abono
//                 }

//                 let historialCobros = [];

//                 for(let item of this.selectedDocumentos){
//                     let totalAbono = this.cuotasAfectados.filter(pd =>pd.cobroDetalle.idCuotaXCobrar===item.idCuotaXCobrar)
//                                                         .map(fpd=>fpd.cobroDetalle.abono).reduce((prev, curr)=>prev + curr, 0);
//                     if(totalAbono > 0){
//                         historialPagos.push({
//                             idTipoDocumento: item.idTipoDocumento,
//                             idComprobante: item.idDocumento,                           
//                             abono: totalAbono
//                         })
//                     }else break;
//                 }

//                 let data = {
//                     comprobante,
//                     cobros: this.setListaAbono(),
//                     cobroDetalles: this.cuotasAfectados.map(item=>({
//                         idCuotaXCobrar: item.cobroDetalle.idCuotaXCobrar,
//                         abono: item.cobroDetalle.abono,
//                         secuencial: item.secuencial
//                     })),
//                     historial: historialCobros
//                 }


                
//                 let url = `/ComprobanteIngreso/Insert`;
//                 this._mS.getData('post', url, data).then(response => {
//                     if (response.code === "0") {                        
//                         this._fS.sweetAlert('warning', response.message, response.titleSms);                                    
//                     }
//                     if (response.code === "1") {                        
//                         this._fS.sweetAlert('success', response.message, response.titleSms, 1000);                    
//                         this.$uibModalInstance.close(response)                                
//                     }
//                 })
//         } catch (error) {
            
//         }
//         try {

          
//             showLoader();       
            
//             const url = `/ComprobanteIngreso/PostFast?idTipoDoc=${this.TIPO_DOC.idTipoDocumento}&idComprobante=${this.data.id}`;
//             this._mS.getData('post', url, data).then(response => {
//                 if (response.id == "0") {
//                     hideLoader(); 
//                     Swal.fire({
//                         title:`<small>${response.titleSms}</small>`,
//                         icon: 'warning',
//                         html: `<small>${response.message}</small>`
//                     });
//                     return
//                 }
//                 if (response.id == "1") {
//                     hideLoader(); 
//                     Swal.fire({
//                         icon: 'success',
//                         html: `<small>${response.message}</small>`,
//                         timer: 1000
//                     });
//                     this.$uibModalInstance.close(response);                    
//                 }
//             })
            
//         } catch (error) {
//             toastr.error(error)
//         }
        
//     }


//     setListaAbono() {
//         return [{
//             entidad: this.entidadFinanciera.descripcion,
//             subEntidad: this.subEntidad.descripcion,
//             idEntidadFinanciera: this.entidadFinanciera.idEntidadFinanciera,
//             idSubEntidadFinanciera: this.subEntidad.idSubEntidadFinanciera,
//             idBanco: this._fS.campo(this.banco.idBanco) ? 0 : this.banco.idBanco,
//             idCuentaBancaria: this._fS.campo(this.cuentaBancaria.idCuentaBancaria) ? 0 : this.cuentaBancaria.idCuentaBancaria,
//             idTipoDocumento: this.TIPO_DOC.idTipoDocumento,
//             idComprobante: this.data.id,
//             fechaEmision: this.cobro.fechaEmision,
//             nro: this._fS.campo(this.cobro.nro) ? null : this.cobro.nro,
//             valor: Number(this.cobro.valor),
//             abono: Number(this.cobro.abono),
//             vuelto: this.cobro.valorCambio,
//             posFechado: this.cobro.posFechado,
//             secuencial: 1,
//             lote: this._fS.campo(this.cobro.lote) ? null : this.cobro.lote,
//             aprobacion: this._fS.campo(this.cobro.aprobacion) ? null : this.cobro.aprobacion,
//             referencia: this._fS.campo(this.cobro.referencia) ? null : this.cobro.referencia,
//             idCiudad: this._fS.campo(this.cobro.idCiudad) ? 0 : this.cobro.idCiudad,
//             controlCaja: this.subEntidad.controlCaja,

//             codEstab: this.data.codEstab
//         }];
//     }


//     closeModal(){
//         this.$uibModalInstance.close();
//     }

// }














// export class ModalCobroDocumentoCtrl extends ModalCobroCtrl{
//     static $inject = [
//         '$scope',         
//         '$timeout',
//         '$uibModalInstance',
//         'mainService',
//         'commonService',
//         'modalService',
//         'nombreModal',
//         'toastService', 
//         'formulario', 
//         'params'
//     ]
//     constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModal, _tS, _fS, _params){
//         super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS})
       
//         this._modalSvc         = _modalSvc;
//         this._nombreModal      = _nombreModal;        
    
//         this.NUM_MAX_ROUND     = 5; //Número Máximo de redondeo         
        
//         this.data              = {};
//         this.data.totalCobro  = 0;
//         this.data.valorCambio = 0;
//         this.data.abonoPosfechado = 0;

//         this.entidadFinanciera = {};
//         this.subEntidad        = {};
//         this.cuentaBancaria    = {};
//         this.banco             = {};

//         let {TIPO_DOC, data} = _params;

//         this.TIPO_DOC = TIPO_DOC;
//         this.data = data;

//         this.selectedDocumentos = [];
//         this.abonoEntidadesFinancieras = [];

//         this.cuotasAfectados = []

//     }

//     async $onInit(){   
        
//         try {
//             showLoader();
//             let json = {
//                 idCliente: this.data.idCliente,
//                 codEstab: this.data.codEstab
//             }
            
//             let results = await Promise.all([
//                 this._mS.getData('get', `/CuotaXCobrar/GetCuotaForPayment?idComprobante=${this.data.id}&idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}`),
//                 this._mS.getData('get', '/GestionFinanciera/GetChargeForDocument?json=' + JSON.stringify(json))
//             ])

//             for(let response of results){
//                 if(typeof response==='object' && response.id==='0'){
//                     toastr.warning(response.message, response.titleSms);                        
//                 }
//             }


//             this.selectedDocumentos = [{
//                 nroDocumento: this.data.nroDocumento,
//                 tipoDocumento: this.TIPO_DOC.codigo,
//                 fechaEmision: this.data.fechaEmision,
//                 total: this.data.total,
//                 showCuota: true,
//                 cuotas: results[0].data,                
//                 cuotaOriginal: JSON.parse(JSON.stringify(results[0].data))
//             }]
            
//             this.documentos = results[1].data
            
//             this.paymentStepDos();                      
            
//             this.$scope.$apply();
            
//         } catch (error) {
//             console.log(error)
//         }finally{
//             hideLoader();
//         }
//     }
    
//     paymentStepDos() {
//         this.footerActionStepDos = true;

//         $("#paymentStep a:last-child").addClass('active');
//         $("#content-cuotas").show();
//         this.data.abonoPosfechado = 0;
//         this.data.totalCobro = 0;
//         this.data.valorCambio = 0;
//         this.getTotalesCuotas();        
//     }

//     getTotalesCuotas() {
//         let total = 0, totalAbonoAnterior = 0, totalAbonoPosf = 0, saldo = 0, totalAbono = 0;

//         let groupCuotas = this.selectedDocumentos.flatMap(item=>item.cuotas);

//         for(let item of groupCuotas){
//             total              += item.cxc.cuota;
//             totalAbonoAnterior += item.abono;
//             totalAbonoPosf     += item.abonoPosfechado;
//             saldo              += item.saldo;
//         }
        

//         this.data.total              = this._fS.roundNumber(total, this.NUM_MAX_ROUND);
//         this.data.totalAbonoAnterior = this._fS.roundNumber(totalAbonoAnterior, this.NUM_MAX_ROUND)
//         this.data.saldo              = this._fS.roundNumber(saldo, this.NUM_MAX_ROUND);
//         this.data.saldoOriginal      = this._fS.roundNumber(saldo, this.NUM_MAX_ROUND);
//         this.data.abono              = 0;
//         this.data.abonoPosfechado    = 0;
//         this.data.abonoTotal         = 0;
//         this.data.valorCambio        = 0;


//     }


//     async openModalFormaCobro() {
       
//         try {
//             if(this.data.saldo===0){
//                 this._fS.sweetAlert('warning', 'No hay cuotas pendientes!')
//                 return
//             }


//             let {MODAL_FILE_FORMA_COBRO, MODAL_FORMA_COBRO} = this._nombreModal.cobro;
//             let controller = (await import('./../../../' + MODAL_FILE_FORMA_COBRO))[MODAL_FORMA_COBRO['controller']];
//             let template   = MODAL_FORMA_COBRO['template'];
    
//             let params = {
//                 data: this.data,
//                 abonoEntidadesFinancieras: this.abonoEntidadesFinancieras || [],
//                 documentos: this.documentos,
//                 isPaymentDocument: true,            
//                 referencia: this.data.nombreFiscal
//             }
            
//             let $modalRef = this._modalSvc.openModalCustom({
//                 controller,
//                 template,
//                 size:'xl',
//                 params
//             })

//             $modalRef.result.then(result=>{
//                 console.log(result)
//                 if(typeof result!=='object') return
                
//                 this.dataAbono = result;
               
//                 ModalCobroCtrl.setValorAbono = result.valor;
               
//                 this.agregarFormaCobro(result.secuencial, result.posFechado);               
                
//                 this.getValorAbonoFormaPago(result.secuencial);
                
//                 this.calculoTotales();
                
//                 this._tS.toastr('success', 'Abono Agregado Correctamente');
//             })
//         } catch (error) {
//             console.log(error)
//         }finally{
            
//         }      
//     }


//     getValorCambio() {
//         let valorCambio = 0;
        
//         if (this.data.abonoTotal >= this.data.saldoOriginal) {
//             valorCambio = this.data.abonoTotal - this.data.saldoOriginal;
//         }
        
//         return this._fS.roundNumber(valorCambio, this.NUM_MAX_ROUND);
//     }

    


//     setListaAbono(valorAbono) {
//         this.listaAbonos.push({
//             entidad               : this.entidadFinanciera.descripcion,
//             subEntidad            : this.subEntidad.descripcion,
//             idEntidadFinanciera   : this.entidadFinanciera.idEntidadFinanciera,
//             idSubEntidadFinanciera: this.subEntidad.idSubEntidadFinanciera,
//             idBanco               : this._form.campo(this.banco.idBanco) ? 0 : this.banco.idBanco,
//             idCuentaBancaria      : this._form.campo(this.cuentaBancaria.idCuentaBancaria) ? 0 : this.cuentaBancaria.idCuentaBancaria,
//             valor                 : Number(this.cobro.valorAbono),
//             posFechado            : this.cobro.posFechado,
//             fechaEmision          : new Date(this.cobro.fechaEmision),
//             nro                   : this._form.campo(this.cobro.nro) ? null : this.cobro.nro,
//             referencia            : this._form.campo(this.cobro.referencia) ? null : this.cobro.referencia,
//             aprobacion            : this._form.campo(this.cobro.aprobacion) ? null : this.cobro.aprobacion,
//             lote                  : this._form.campo(this.cobro.lote) ? null : this.cobro.lote,
//             idCiudad              : this._form.campo(this.cobro.idCiudad) ? 0 : this.cobro.idCiudad,
//             secuencial            : this.listaAbonos.length + 1,
//             abono                 : valorAbono,
//             controlCaja           : this.subEntidad.controlCaja,

//             tipoDocumento         : this._form.campo(this.cobro.tipoDocumento) ? null : this.cobro.tipoDocumento,
//             idTipoDocumento       : this._form.campo(this.cobro.idTipoDocumento) ? 0 : this.cobro.idTipoDocumento,
//             idComprobante         : this._form.campo(this.cobro.idComprobante) ? 0 : this.cobro.idComprobante,
//         });
//     }

//     viewCuotaAbono(data) {
//         this.viewCuotaAbonos = this.cuotasAfectados.filter(val => val.cobroDetalle.idCuotaXCobrar === data.cxc.idCuotaXCobrar);
//     }
    
    
//      //Eliminar Pago 
//      async askToDeleteAbono(item) {
//         let {isConfirmed} = await Swal.fire({
//             icon: 'warning',
//             html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
//             showConfirmButton: true,
//             confirmButtonText: 'Si, eliminar',
//             showCancelButton: true,
//             cancelButtonText: 'No, cancelar',
//             allowOutsideClick: false
//         })

//         if (isConfirmed) {
            
            

//             this.$scope.$apply(()=>{


//                 let secuencial = 0, total = 0, totalAbonoAnterior = 0, saldo = 0; 
            
//                 this.cuotasAfectados = []; //Reset todas las cuotas afectadas            
                
//                 this.abonoEntidadesFinancieras.splice(this.abonoEntidadesFinancieras.indexOf(item), 1); //Eliminamos abono agregado                         
                
                
//                 //Todas las cuotas en su estado original 
//                 for (let i = 0; i < this.selectedDocumentos.length; i++) {
                
//                     this.selectedDocumentos[i].cuotas = JSON.parse(JSON.stringify(this.selectedDocumentos[i].cuotaOriginal));
                
//                     for (let val of this.selectedDocumentos[i].cuotaOriginal) {
//                         total              += val.cxc.cuota;
//                         totalAbonoAnterior += val.abono;
//                         saldo              += val.saldo;
//                     }
//                 }

//                 this.data.total              = this._fS.roundNumber(total, 5);
//                 this.data.totalAbonoAnterior = this._fS.roundNumber(totalAbonoAnterior, 5)
//                 this.data.saldo              = this._fS.roundNumber(saldo, 5);
//                 this.data.saldoOriginal      = this._fS.roundNumber(saldo, 5);
//                 this.data.abono              = 0;
//                 this.data.abonoPosfechado    = 0;
//                 this.data.abonoTotal         = 0;
//                 this.data.valorCambio        = 0;
                
                
//                 if (this.abonoEntidadesFinancieras.length == 0) return
                
//                 //Recalculamos las cuotas con los abonos restantes   
//                 for (var i = 0; i < this.abonoEntidadesFinancieras.length; i++) {
//                     secuencial++;
//                     ModalCobroCtrl.setValorAbono = this.abonoEntidadesFinancieras[i].valor //Set valor de abono 
//                     this.agregarFormaCobro(secuencial, this.abonoEntidadesFinancieras[i].posFechado);
//                 }
                
                
//                 this.calculoTotales();



//             });
//         }

//     }


//     //Guardar Cobro
//     async onSave(){

//         try {
//             if (this.abonoEntidadesFinancieras.length === 0) {
//                 this._tS.toastr('warning', 'Agregue al menos un Cobro', 'Cobro');
//                 return
//             }
    
//             const swalWithBootstrapButtons = Swal.mixin({
//                 customClass: {
//                   confirmButton: 'btn btn-success',
//                   cancelButton: 'btn btn-danger ml-2'
//                 },
//                 buttonsStyling: false
//             })
              
//             let {isConfirmed} = await  swalWithBootstrapButtons.fire({
//                 //title: '<small>Guardar Comprobante</small>',
//                 html: "<small>Esta seguro/a de guardar este Comprobante Ingreso?</small>",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonText: 'Si, guardar!',
//                 cancelButtonText: 'No, cancelar!',
//                 reverseButtons: false,
//                 allowOutsideClick: false            
//             })

//             if(isConfirmed){
                
//                 showLoader();
//                 let comprobante = {
//                     codEstab: this.data.codEstab,
//                     idCliente: this.data.idCliente,   
//                     numeroIdentificacion : this.data.numeroIdentificacion,
//                     nombreFiscal : this.data.nombreFiscal,             
//                     total: this.abonoEntidadesFinancieras.map(val=>val.valor).reduce((acc, curr)=>acc + curr, 0),
//                     abono: this.abonoEntidadesFinancieras.map(val=>val.abono).reduce((acc, curr)=>acc + curr, 0)
//                 }

//                 let historialCobros = [];

//                 for(let item of this.selectedDocumentos){
//                     let totalAbono = this.cuotasAfectados.filter(pd =>pd.cobroDetalle.idCuotaXCobrar===item.idCuotaXCobrar)
//                                                         .map(fpd=>fpd.cobroDetalle.abono).reduce((prev, curr)=>prev + curr, 0);
//                     if(totalAbono > 0){
//                         historialPagos.push({
//                             idTipoDocumento: item.idTipoDocumento,
//                             idComprobante: item.idDocumento,                           
//                             abono: totalAbono
//                         })
//                     }else break;
//                 }

//                 let data = {
//                     comprobante,
//                     cobros: this.abonoEntidadesFinancieras,
//                     cobroDetalles: this.cuotasAfectados.map(item=>({
//                         idCuotaXCobrar: item.cobroDetalle.idCuotaXCobrar,
//                         abono: item.cobroDetalle.abono,
//                         secuencial: item.secuencial
//                     })),
//                     historial: historialCobros
//                 }


                
//                 let url = `/ComprobanteIngreso/Insert`;
//                 await this._mS.getData('post', url, data).then(response => {
//                     if (response.code === "0") {                        
//                         this._fS.sweetAlert('warning', response.message, response.titleSms);                                    
//                     }
//                     if (response.code === "1") {                        
//                         this._fS.sweetAlert('success', response.message, response.titleSms, 1000);                    
//                         this.$uibModalInstance.close(response)                                
//                     }
//                 })
//             }

//         } catch (error) {
//             console.log(error)
//         }finally{
//             hideLoader();
//         }

//     }
    

//     closeModal(){
//         this.$uibModalInstance.close();
//     }



// }
