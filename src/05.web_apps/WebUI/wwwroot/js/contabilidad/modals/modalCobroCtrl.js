
//====================================================SERVICIO COMPRATIDO=====================================
//=====================================================================================================

class CobroService {
    constructor(tS, mS){
        this.tS = tS;
        this.mS = mS;
        this.cobroDetalle = [];
        this.historialCobros = []

        this.url = 'Comprobante/'
    }

    isDateValid(dateString) {
        var date = new Date(dateString);
        console.log(dateString);
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
        return this.mS.getData('post', this.url + 'Insert', {data : data}, true)
        .catch(error=>{
            throw error;
        }) 
    }

    getCuotas(query){
        return this.mS.getData('get', 'CuentaPorCobrar/?json=' + JSON.stringify(query), null, true)
        .catch(error=>{
            throw error;
        })        
    }

}


export {
    ModalCobroRapidoCtrl,
    ModalCobroLoteCtrl,
    ModalFormaCobroCtrl
}



//====================================================START COBRO RAPIDO=====================================
//=====================================================================================================
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
    let {data}= params;
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
            cobroSvc.getCuotas(query).then(response=>{
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
//====================================================END COBRO RAPIDO=====================================
//=====================================================================================================



//====================================================START COBRO LOTE=====================================
//=====================================================================================================
ModalCobroLoteCtrl.$inject = [
    '$scope',         
    '$uibModalInstance', 
    'mainService',
    'commonService',
    'modalService',
    'nombreModalContabilidad',
    'toastService', 
    'formulario', 
    'params'
]
function ModalCobroLoteCtrl($scope, $uibModalInstance, mS, commonSvc, modalSvc, nombreModalContabilidad, tS, fS, params){
    let cobroSvc = new CobroService(tS, mS);
    let {data} = params;
    

    let dataFormaCobro = {};
    $scope.comprobante = {};


    let paymentStep = null;
    let stepSelectDoc = null;
    let stepCuotas = null;

    $scope.isPaymentDocument = false;
    $scope.isPaymentLote = false;


    $scope.data = {};
    $scope.data.totalAbonoAnterior = 0;
    $scope.data.totalValorAbono = 0;                
    $scope.data.totalSaldo = 0
    $scope.data.valorCambio = 0; 


    $scope.datosCobro = [];        
    $scope.cobrosDetalle = [];
    $scope.historialCobros = [];


    $scope.selectedDocumentos = [];
    $scope.cloneSelectedDocumentos = [];

   
    $uibModalInstance.rendered.then(()=>{
        stepSelectDoc = document.getElementById('stepSelectDocs');
        stepCuotas = document.getElementById('stepCuotas');

        if(data.id>0){
            $scope.stepCuotaPaymentDoc();
        }     
    })

    // $scope.footerActionStepUno=false;
    // $scope.footerActionStepDos=true;



    //Cobro desde Documento 
    if(data.id>0){
       try {
            showLoader();
            $scope.isPaymentDocument = true;
            let query = {
                tipo: 3,
                codEstab: data.codEstab,
                idCliente: data.idCliente,
                idDocumento: data.idDocumento,
                idTipoDocumento: data.idTipoDocumento,
                credito: data.gestion,
            }
            cobroSvc.getCuotas(query).then(response=>{
                hideLoader();
                let mainDataRepository = JSON.parse(response.payload);

                //Forma Pago 
                dataFormaCobro.entidadesFinancieras = mainDataRepository[0];
                dataFormaCobro.subEntidadesFinancieras = mainDataRepository[1];
                dataFormaCobro.bancos = mainDataRepository[2];
                dataFormaCobro.ciudades = mainDataRepository[3];
                dataFormaCobro.documnetos = mainDataRepository[4];

                //documentos.cuotas 
                let selectedDocumentos = mainDataRepository[5].map(item=>({
                    ...item,
                    cuotas: JSON.parse(item.cuotas)
                }))

                $scope.selectedDocumentos =     JSON.parse(JSON.stringify(selectedDocumentos));        
                $scope.cloneSelectedDocumentos = JSON.parse(JSON.stringify($scope.selectedDocumentos));
            

                //Comprobante 
                $scope.comprobante = mainDataRepository[6][0];
                console.log($scope.comprobante)

                //Totales
                $scope.data.importeTotal       = fS.roundNumber($scope.comprobante.total, 5);
                $scope.data.totalSaldo         = fS.roundNumber($scope.comprobante.saldo, 5);
                // $scope.data.totalSaldoOriginal = fS.roundNumber($sc, 5);
                $scope.data.totalAbonoAnterior = fS.roundNumber($scope.comprobante.abono, 5)                  
                $scope.data.totalValorAbono    = 0;        
                $scope.data.valorCambio          = 0;

            }).catch(error=>{
                hideLoader();
                console.log(error)
            })
       } catch (error) {
        hideLoader();
       }
    }else{
        
        initiload();
    }

    function initiload(){

    }

    $scope.displayCuota = (item)=>{
        item.display = !item.display
    }

    $scope.stepCuotaPaymentDoc = function(){
        $("#paymentStep a:first-child").removeClass('active').addClass('disabled') 
        $("#paymentStep a:last-child").addClass('active')
        stepSelectDoc.style.display ='none';
        stepCuotas.style.display = 'block';
    }

    //===================STEP COBRO LOTE=========

    $scope.stepSelectDocPaymentLote = function(){
        if($scope.isPaymentDocument){
            fS.sweetAlert('warning', 'No Disponible');
            return
        }
    }

    $scope.stepCuotaPaymentLote = function(){

    }

    $scope.openModalFormaCobro = async function(){
        try {
            // if($scope.cobro.saldo===0){
            //     alert(0)
            //     return
            // }
            let fileCtrl = nombreModalContabilidad.COBRO.fileCtrl;
            let ctrl = nombreModalContabilidad.COBRO.controllers['MFC'];
            let template = nombreModalContabilidad.COBRO.templates['MFC']; 
            let controller = (await import(fileCtrl))[ctrl];

            modalSvc.openModalCustom({            
                controller,
                template,
                size:'lg',
                params: {
                    dataFormaCobro,
                    cobro: $scope.cobro
                },
                isRenderRazorPartial: true
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}

//====================================================END COBRO LOTE=====================================
//=====================================================================================================




//====================================================FORMA COBRO=====================================
//=====================================================================================================

ModalFormaCobroCtrl.$inject = ['$scope', '$uibModalInstance', 'formulario', 'toastService', 'params']

function ModalFormaCobroCtrl ($scope, $uibModalInstance, fS, tS, params){
    let {dataFormaCobro, comprobante} = params;
    let {documentos, entidadesFinancieras, subEntidadesFinancieras, bancos, ciudades} = dataFormaCobro;
  
    let cobroSvc = new CobroService(tS)
    //const VALOR_ABONO_ORIGINAL = saldo;

    $scope.data = {};
    $scope.data.posFechado = false
    $scope.comprobante = comprobante;

    $scope.data.fechaEmision = new Date();        
    //$scope.data.valorAbono = params.saldo;

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

    initialLoad();

    function initialLoad(){
        try {
            $scope.entidadesFinancieras = entidadesFinancieras;            
            
            $scope.selectedIndexTab = $scope.entidadesFinancieras.findIndex(item=>item.codigo==='EFE');

            $scope.bancos =bancos;
            $scope.ciudades = ciudades

            //Documentos Retencion Compra y Nota de Credito
            $scope.documentosElectronicos = documentos; 
    
        } catch (error) {
            
        }
    }

    $scope.onChangeTabEntidadFinanciera = (item)=>{
        try {
                         
            let {idEntidadFinanciera, codigo} = $scope.entidadesFinancieras.at($scope.selectedIndexTab)

            if(codigo==='DOC'){
               document.getElementById('btnAddFormaPago').style.display = 'none';
            }else{
               document.getElementById('btnAddFormaPago').style.display = 'block';
            }
                     
            $scope.subEntidadesFinancieras = subEntidadesFinancieras.filter(item=>item.idEntidadFinanciera===idEntidadFinanciera);
            
            $scope.data.idEntidadFinanciera    = idEntidadFinanciera;
            $scope.data.idSubEntidadFinanciera = $scope.subEntidadesFinancieras[0].idSubEntidadFinanciera;            
             
            $scope.data.valorAbono =0;
            $scope.data.idBanco    = 0;
            $scope.data.idCiudad   = 0;
            $scope.data.referencia = null;
            $scope.data.nro        = null;
            $scope.data.lote       = null;   
            $scope.data.aprobacion = null;    
            $scope.data.posFechado = false;
            $scope.selectedDocElectronico = [];

           
        } catch (error) {           
            console.log(error);
        }                
    }
    

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }


    $scope.addFormaPago = function(){            
        try {
            let codigo = $scope.entidadesFinancieras[$scope.selectedIndexTab].codigo;
            if(!cobroSvc.isValidForm($scope.data, codigo)) throw 'Form Invalid';

            console.log($scope.getDataPago())
            $uibModalInstance.close($scope.getDataPago());
            
        } catch (error) {
            console.log(error)
        }

    }

    $scope.getDataPago = function(item = {}) {
        let entidadFinanciera = $scope.entidadesFinancieras.find(item=>item.idEntidadFinanciera===$scope.data.idEntidadFinanciera);
        let subEntidadFinanciera = $scope.subEntidadesFinancieras.find(item=>item.idSubEntidadFinanciera===$scope.data.idSubEntidadFinanciera);
        
        let ciudad = $scope.ciudades.find(item=>item.idCiudad===$scope.data.idCiudad);
        let banco = $scope.bancos.find(item=>item.idBanco===$scope.data.idBanco);

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
            fechaEmision: new Date(),
            posFechado: $scope.data.posFechado,
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

    $scope.addDocumentoElectronico = function(item) {
        if (item.saldo===0) {
            tS.toastr('warning', 'El Valor de Abono tiene que ser mayor a 0', 'Cobro');
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



}

// export class ModalFormaCobroCtrl extends ModalBaseCtrl {


//     addFormaCobro() {
//         if (this.validarAbono()) {
//             this.data.secuencial = this.abonoEntidadesFinancieras.length + 1;
//             this.sharedDataCloseModal();
//         }
//     }

//     agregarCobroDocumento(item) {
//         if (this.abonoEntidadesFinancieras.some(val => val.idComprobante == item.idComprobante)) {
//             this._form.sweetAlert('warning', 'Este documento ya se agregó al cobro!')
//             return
//         }

//         this.data.valorAbono = item.total
//         this.data.nro = item.nroDocumento;
//         this.data.tipoDocumento = item.tipoDocumento;
//         this.data.idTipoDocumento = item.idTipoDocumento;
//         this.data.idComprobante = item.idComprobante;
//         this.data.secuencial = this.abonoEntidadesFinancieras.length + 1;

//         this.sharedDataCloseModal();
//     }


//     sharedDataCloseModal() {
//         let data = {
//             entidad: this.entidadFinanciera.descripcion,
//             subEntidad: this.subEntidadFinanciera.descripcion,
//             idEntidadFinanciera: this.entidadFinanciera.idEntidadFinanciera,
//             idSubEntidadFinanciera: this.subEntidadFinanciera.idSubEntidadFinanciera,
//             idBanco: this._form.campo(this.banco.idBanco) ? 0 : this.banco.idBanco,
//             idCuentaBancaria: this._form.campo(this.cuentaBancaria.idCuentaBancaria) ? 0 : this.cuentaBancaria.idCuentaBancaria,
//             valor: this.data.valorAbono,
//             posFechado: this.data.posFechado,
//             fechaEmision: this.data.fechaEmision,
//             nro: this.data.nro,
//             tipoDocumento: this.data.tipoDocumento,
//             referencia: this.data.referencia,
//             aprobacion: this.data.aprobacion,
//             lote: this.data.lote,
//             idCiudad: this._form.campo(this.data.idCiudad) ? 0 : this.data.idCiudad,
//             idTipoDocumento: this.data.idTipoDocumento,
//             idComprobante: this.data.idComprobante,
//             secuencial: this.data.secuencial,
//             abono: 0,
//             controlCaja: this.subEntidadFinanciera.controlCaja
//         }

//         this.$uibModalInstance.close(data);
//         this.data = {};
//     }



//     closeModal() {
//         this.$uibModalInstance.close()
//     }

// }