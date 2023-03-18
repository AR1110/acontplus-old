

(function () {

    'use strict';

    const FILE_PATH_PARTIAL_UI = '~/Areas/CuentaPorPagar/Pages/'

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl)

    cuentaPorPagarCtrl.$inject = ['$scope', 'toastService', 'mainService', 'screenSize', '$timeout' ,'modalService', 'nombreModal', 'formulario']

    function cuentaPorPagarCtrl($scope, _tS, _mS, _sS, $timeout, _modalSvc, _nombreModalConst, _form) {

        $scope.selectedDocumentos = [];

        let {MODAL_PAGO_LOTE}= _nombreModalConst.pago;
        

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
            order: '',
            limit: 5,
            page: 1
        };

        
        $scope.isMobile = _sS.on('xs, sm', function (isMatch) {
            $scope.isMobile = isMatch
        })

        if ($scope.isMobile) {
            Swal.fire(
                'Dispositivo Movil Detectado!',
                'Para una mejor comodidad, le recomendamos usar una Laptop o PC.',
                'success'
            )
        } else {
            $timeout(() => {
                document.getElementById('menu_toggle').click()
            }, 1100)
        }

        $scope.cuentasPorPagar = []


        $scope.initialLoad = () => {
            try {
                showLoader();
                $scope.cuentasPorPagar = [];
                _mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({ tipo: 1 }), null, true).then((response) => {
                    if (response.code == '0') {
                        hideLoader();
                        $scope.cuentasPorPagar = [];
                        _tS.toastr('warning', response.message)
                    }
                    if (response.code == '1') {  
                        console.log(response.payload)                      
                        $scope.cuentasPorPagar = JSON.parse(response.payload)[0]
                        hideLoader();
                    }                    
                }).catch((error) => {
                    $scope.cuentasPorPagar = [];
                    console.log(error)
                })
            } catch (error) {
                $scope.cuentasPorPagar = [];
                console.log(error)
            }
        }

        $scope.initialLoad()

         //======================================MODAL CUOTA================================================
      
        $scope.openModalCuota = async(item)=>{    
            try {
                let {MODAL_FILE_CUOTA, MODAL_COMPRA_CUOTA} = _nombreModalConst.pago;
                let controller = (await import('./../../' + MODAL_FILE_CUOTA))[MODAL_COMPRA_CUOTA['controller']] 
                let template   = MODAL_COMPRA_CUOTA['template'];
                
                let params = {}

                showLoader();
                await _mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({ idCuentaPorPagar : item.idCuentaPorPagar, tipo: 2 }), null, true).then(response => {
                    let cuotas = response.payload ? JSON.parse(response.payload)[0] : []
                    params = {
                        cuotas,
                        data: {
                            ...item,
                            id: item.idCuentaPorPagar,  
                            codPago : item.codPago,              
                            numeroIdentificacion: item.identificacion
                        },
                    }  
                })

                const modalRef = _modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params
                })         
                modalRef.result.then(res=>{
                    if(typeof res ==='object'){
                        $scope.initialLoad();                    

                    }
                })

            } catch (error) {
                console.log(error)
            }finally{
                hideLoader()
            }
            
        }


        $scope.openModalPago = async(item)=>{
            try {
                
                //Params Modal
                let modalParams = {
                    controller: 'modalPagoCtrl',
                    template: FILE_PATH_PARTIAL_UI + 'Shared/_ModalPago.cshtml',
                    size: 'xl',                   
                  //  windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                }

                //Params APi 
                let spParams = JSON.stringify({
                    idCuentaPorPagar: item.idCuentaPorPagar,
                    codPago: 'PE',
                    tipo: 2
                })
                
                _mS.getData('get', 'CuentaPorPagar/' + spParams, null, true).then(response =>{
                    
                    if(response.code==="0"){
                        _form.sweetAlert('warning', response.message)
                    }

                    if(response.code==="1"){
                       
                        let cuotas = JSON.parse(response.payload)[0] || [];
                       
                        modalParams.params = {
                            data: item,
                            cuotas
                        }
                        
                        //Open Modal 
                        let modalRef = _modalSvc.openModalCustom(modalParams)
                        modalRef.result.then(result=>{
                            console.log(result)
                        })
                    }

                })
                
               

                
            } catch (error) {
                console.log(error)
            }
        }


    }




    




    //---------------------------------------------START CUOTAS----------------------------------------------------
    app.controller("modalCuotaCtrl", modalCuotaCtrl);

    modalCuotaCtrl.$inject = ["$scope", "$uibModalInstance", "params"];

    function modalCuotaCtrl($scope, $uibModalInstance, params){

    }


    //---------------------------------------------END CUOTAS--------------------------------------------------







    //---------------------------------------------START PAYMENT--------------------------------------

    app.controller("modalPagoCtrl", modalPagoCtrl);

    modalPagoCtrl.$inject = ['$scope', '$uibModalInstance', 'modalService', 'formulario',  'params'];

    function modalPagoCtrl($scope, $uibModalInstance, _modalSvc, fS, params){

        let {data, cuotas}  = params;
        console.log(params);

        $scope.data = Object.assign({}, data);

        $scope.data.totalAbonoAnterior = 0;
        $scope.data.abono = 0;
        $scope.data.abonoPosfechado = 0;
        $scope.data.abonoTotal = 0;
        $scope.data.saldo = $scope.data.importeTotal;
        $scope.data.valorCambio = 0;  

        $scope.datosPago = [];
        $scope.documentos = []; 
        $scope.pagosDetalle = [];
        
    
    
        $scope.selectedDocumentos = [{
            ...data,
            cuotas,
        }];

        $scope.cloneSelectedDocumentos = JSON.parse(JSON.stringify($scope.selectedDocumentos));



        $scope.displayCuota = (item)=>{
            item.display = !item.display
        }


        //Función para sacar totales de abono, abono posfechado
        $scope.calculoTotales = ()=>{
            try {
                let totalAbono = 0, abonoPosfechado = 0, valorSaldo = 0;

                // $scope.data.totalPago = $scope.det.map(val => val.valor).reduce((prev, curr) => prev + curr, 0);
                
                // totalAbono = $scope.cuotasAfectados.map(val=>val.detalle.abono).reduce((prev, curr)=>prev + curr, 0);    
                // $scope.pago.abono = form.roundNumber(totalAbono, 5); 
                
                // abonoPosfechado = $scope.selectedDocumentos.flatMap(item=>item.cuotas).reduce((prev, curr)=>prev+curr.abonoPosfechado, 0);
        
                // $scope.pago.abonoPosfechado = form.roundNumber(abonoPosfechado, 5);
                
                // valorSaldo = $scope.selectedDocs.flatMap(item=>item.cuotas).map(val=>val.saldo).reduce((prev, curr)=>prev+curr, 0)
                // $scope.pago.saldo = form.roundNumber(valorSaldo, 5);
                
                // $scope.pago.valorCambio = $scope.getValorCambio($scope.pago.totalPago, $scope.pago.saldoOriginal);                 
            } catch (error) {
                console.log(error);
            }                      
        }

        $scope.calculoTotales();



        
        

        $scope.openModalFormaPago = ()=>{
            try {
                let params = {
                    idProveedor: $scope.data.idProveedor,
                    importeTotal: $scope.data.importeTotal,
                    totalAbonoAnterior: $scope.data.totalAbonoAnterior,
                    abono: $scope.data.abono,
                    abonoPosfechado: $scope.data.abonoPosfechado,
                    abonoTotal: $scope.data.abonoTotal,
                    saldo: $scope.data.saldo,
                };
                let modalRef = _modalSvc.openModalCustom({
                    controller: 'formaPagoCtrl',
                    template: FILE_PATH_PARTIAL_UI + 'Shared/_ModalFormaPago.cshtml',
                    size: 'lg',   
                    isRenderRazorPartial: true,
                    params                 
                })
                modalRef.result.then(result => {
                    if(typeof result==='object') {
                        try {
                            $scope.indexDatoPago = $scope.datosPago.length + 1;
                            $scope.esAbonoPosfechado  = result.isPosfechado;
                            $scope.valorAbono    = result.valorAbono;
                            $scope.addFormaPago();
                            $scope.addDatosPago(result)
                        
                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                html:`<small>Algo salio mal: ${error}</small>`
                            })
                            console.log(error);
                        }
                    }
                    console.log('close Forma Pago')
                })
            } catch (error) {
                
            }
        }


        //Add 
        $scope.addFormaPago = ()=>{
           
            if(typeof $scope.valorAbono !=='number' || $scope.valorAbono===0) return;

            for(let group of $scope.selectedDocumentos){
                for(let item of group.cuotas){
             
                    //Si la cuota no tiene ningún abono
                    if((item.cuota ===item.saldo)  && (item.abono === 0 || item.abonoPosfechado === 0)){
                       
                        $scope.cuotaSinAbono(item)
    
                    } else if(item.cuota !== item.saldo && item.saldo > 0) {
    
                        $scope.cuotaConAbono(item)
                    }
                  
    
                    item.cuota = fS.roundNumber(item.cuota, 5);
                    item.abono = fS.roundNumber(item.abono, 5);
                   // item.abonoPosfechado = fS.roundNumber(item.abonoPosfechado, 5);
                    item.saldo = $scope.getValorSaldo(item) //Verificamos el saldo de la Cuota 
                    item.descripcion = $scope.getEstadoCuota(item);

                    item.esCuotaAfectada = true; //
                }
            }
        }


        /**
         * 
         * @param {object} item 
         */
        $scope.cuotaSinAbono = (item)=>{

            if(item.saldo >=$scope.valorAbono){

                //Si el Abono pago no es Posfechado
                item.abono = $scope.esAbonoPosfechado ? 0: $scope.valorAbono;

                //Si el abono pago es posfechado
                // item.abonoPosfechado =  $scope.esAbonoPosfechado ? $scope.valorAbono : 0;
                item.saldo = item.saldo - $scope.valorAbono;

                $scope.addPagoDetalle(item, $scope.valorAbono)
                $scope.valorAbono = 0;

            }else if(item.saldo <= $scope.valorAbono) {

                //Si el Abono pago no es Posfechado
                item.abono = $scope.esAbonoPosfechado ? 0 : item.cuota;
                
                //Si el abono pago es posfechado
                //item.abonoPosfechado = $scope.esAbonoPosfechado ? item.cuota : 0; 

                item.saldo = $scope.valorAbono -= item.saldo;

                $scope.addPagoDetalle(item, item.cuota)
            }

        }


        /**
         * 
         * @param {object} item 
         */
        $scope.cuotaConAbono = (item)=>{

            if (item.saldo >= $scope.valorAbono) {
                
                if ($scope.esAbonoPosfechado) {
                    //item.abonoPosfechado = $scope.valorAbono + item.abonoPosfechado;
                } else {
                    item.abono = $scope.valorAbono + item.abono;
                }

                item.saldo = item.saldo - $scope.valorAbono;
                $scope.addPagoDetalle(item, $scope.valorAbono);
                $scope.valorAbono = 0;
        
               
            } else if (item.saldo <= $scope.valorAbono) {
               
                if ($scope.esAbonoPosfechado) {
                    //item.abonoPosfechado = item.abonoPosfechado + item.saldo;
                } else {
                    item.abono = item.abono + item.saldo;
                }
                
                let resultValorAbono = $scope.valorAbono -= val.saldo;
                $scope.valorAbono = fS.roundNumber(resultValorAbono, 10);
                
                $scope.addPagoDetalle(item, item.saldo);
            }
        }


        /**
         * 
         * @param {object} item 
         * @param {number} abono 
         * @returns void()
         */
        $scope.addPagoDetalle = (item, abono)=>{
            if(item.cuota==0) return;

            $scope.pagosDetalle.push({
                idCuotaPorPagar: item.idCuotaPorPagar,
                abono,
                cuota: item.cuota,
                saldo: $scope.getValorSaldo(item),
                secuencial: $scope.indexDatoPago
            })

        }


        /**
         * 
         * @param {object} item item cuota  
         * @returns number
         */
        $scope.getValorSaldo = (item)=> {
            let total = item.abono //+ item.abonoPosfechado;
            return fS.roundNumber(total, 5) === fS.roundNumber(item.cuota, 5) ? 0 : fS.roundNumber(item.saldo, 5);
        }


        /**
         * 
         * @param {object} item  cuota
         * @returns {string} estado 
         */
        $scope.getEstadoCuota = (item)=> {
            let estado = '';
            if (item.cuota === (item.abono)) estado = 'PAGADA' //+ cuota.abonoPosfechado)) estado = 'Pagada';
            if (item.saldo > 0) estado = "PENDIENTE PARCIAL";
            if (item.cuota === item.saldo) estado = "PENDIENTE";
            return estado
        }


        $scope.showPagoDetalle = (data) => {
            let tempPagoDetalle = $scope.pagosDetalle.filter(item=>item.idCuentaPorPagar===data.idCuentaPorPagar);
            let pagoDetalle = [];

            console.log(tempPagoDetalle)
            console.log($scope.datosPago)
            for(let pd of tempPagoDetalle){
                let datoPago = $scope.datosPago.find(item=>item.secuencial===pd.secuencial);
                pagoDetalle.push({
                    ...pd,
                    entidadFinanciera: datoPago.entidadFinanciera
                })
            }

            Swal.fire({
                icon:'info',
                html:`<div class="table-responsive">
                        <table class="table table-striped">
                            <thead></thead
                            <tbody>
                                ${pagoDetalle.map(item=>{
                                    `<tr>
                                        <td> 
                                           ${item.abono}
                                        </td>
                                    </tr>
                                    `
                                })}
                            </tbody>
                        </table>
                      </div> 
                `
            })

        }


        //-----------------------------------Datos Pago---------------------
        $scope.addDatosPago = (obj, valorAbonoCuota) => {
            $scope.datosPago.push({ 
                ...obj,
                valorAbonoCuota,
                secuencial: $scope.indexDatoPago
            })
        }

        $scope.displayInfoDatosPago = (item)=>{
            item.display = !item.display
        }

        $scope.askToDeleteDatoPago = (item)=>{
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
                    let index = $scope.datosPago.indexOf(item);
                    $scope.datosPago.splice(index, 1);
                    $scope.$apply();
                }
            })
        }




        $scope.save = ()=>{

            if($scope.datosPago.length===0) {
                fS.sweetAlert('warning', 'Ingrese al menos un Pago')
                return
            }

            if($scope.data.importeTotal){
                fS.sweetAlert('warning', '')
            }

        }

        $scope.closeModal = ()=>{
            $uibModalInstance.close();
        }

    }
    //--------------------------------------------END PAYMENT------------------------------------------------------





    //-----------------------------------------START FORMA PAGO--------------------------------------------------
    app.controller("formaPagoCtrl", formaPagoCtrl);

    formaPagoCtrl.$inject = ["$scope", "$uibModalInstance", "mainService", "toastService", "params"];

    function formaPagoCtrl($scope, $uibModalInstance, mS, tS, params){

        const VALOR_ABONO_ORIGINAL = params.saldo;
       
        $scope.data = {};

        $scope.data.fechaEmision = new Date();        
        $scope.data.valorAbono = params.saldo;
        
       
        console.log(params);

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
        $scope.initialLoad = ()=>{

            mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({tipo: 3, idProveedor: params.idProveedor}), null, true).then(response=>{
              
                if(response.code==="0"){
                    console.log(response)
                }
              
                if(response.code==="1"){
                    
                    let tempData = JSON.parse(response.payload);

                    console.log(tempData)
                    
                    $scope.entidadesFinancieras = tempData[0];
                    $scope.tempSubEntidadesFinancieras = tempData[1];

                    $scope.selectedIndexTab = $scope.entidadesFinancieras.findIndex(item=>item.codigo==='EFE');
                                      
                    $scope.bancos = tempData[2];
                    $scope.ciudades = tempData[3];

                    //Documentos Retencion Compra y Nota de Credito
                    $scope.documentosElectronicos =  tempData[4];  

                }
            })
        }

        $scope.initialLoad();


        $scope.onChangeTabEntidadEntifiera = (item)=>{
            try {
                console.log($scope.selectedIndexTab)
                
                let {idEntidadFinanciera, codigo} = $scope.entidadesFinancieras.at($scope.selectedIndexTab)

                if(codigo==='DOC'){
                   document.getElementById('btnAddFormaPago').style.display = 'none';
                }else{
                   document.getElementById('btnAddFormaPago').style.display = 'block';
                }
                         
                $scope.subEntidadesFinancieras = $scope.tempSubEntidadesFinancieras.filter(item=>item.idEntidadFinanciera===idEntidadFinanciera);
                
                $scope.data.idEntidadFinanciera    = idEntidadFinanciera;
                $scope.data.idSubEntidadFinanciera = $scope.subEntidadesFinancieras[0].idSubEntidadFinanciera;            
                 
                $scope.data.valorAbono = VALOR_ABONO_ORIGINAL;
                $scope.data.idBanco    = 0;
                $scope.data.idCiudad   = 0;
                $scope.data.referencia = null;
                $scope.data.nro        = null;
                $scope.data.lote       = null;   
                $scope.data.aprobacion = null;    
                $scope.data.posFechado = false;
                $scope.selectedDocElectronico = [];

               
            } catch (error) {
                $scope.selectedIndexTab = 1;
                $scope.data.valorAbono = VALOR_ABONO_ORIGINAL;
                $scope.data.idBanco = 0;
                $scope.data.idCiudad = 0;
                $scope.data.referencia = null;
                $scope.data.nro = null;
                $scope.data.lote = null;   
                $scope.data.aprobacion = null;    
                $scope.data.posFechado = false;
                console.log(error);
            }                
        }

        $scope.closeModal = ()=>{
            $uibModalInstance.close();
        }



        $scope.addFormaPago = ()=>{
            
            let codigo = $scope.entidadesFinancieras[$scope.selectedIndexTab].codigo;

            //Si es Cheque            
            if (codigo === "CHE") {
                if (!$scope.data.idBanco || $scope.data.idBanco === 0) {
                    tS.toastr('warning', 'Seleccione el Banco', 'Pago');
                    return
                }
                if (!$scope.data.nro) {
                    tS.toastr('warning', 'Ingrese el Número', 'Pago');
                    return
                }
            }

            //Si es tarjeta de credito 
            if (codigo === "TAR") {
                if (!$scope.data.valorAbono) {
                    tS.toastr('warning', 'Ingrese el Valor del Abono', 'Pago');
                    return
                }

                if ($scope.data.valorAbono===0) {
                    tS.toastr('warning', 'El Valor de Abono tiene que ser mayor a 0', 'Pago');
                    return
                }

                if (!$scope.data.nro) {
                    tS.toastr('warning', 'Ingrese el Número', 'Pago');
                    return
                }
                
                if (!$scope.data.idCiudad) {
                    tS.toastr('warning', 'Seleccione la Ciudad', 'Pago');
                    return
                }
                
                if (!$scope.data.referencia) {
                    tS.toastr('warning', 'Ingrese la Referencia', 'Pago');
                    return
                }

                if (!$scope.data.aprobacion) {
                    tS.toastr('warning', 'Ingrese la Aprobación', 'Pago');
                    return
                }

                if (!$scope.data.lote) {
                    tS.toastr('warning', 'Ingrese el Lote', 'Pago');
                    return
                }                                
            }

            //Si es tranferencia 
            if (codigo == "TRA") {
                if (!$scope.data.valorAbono) {
                    tS.toastr('warning', 'Ingrese el Valor del Abono', 'Pago');
                    return
                }

                if ($scope.data.valorAbono===0) {
                    tS.toastr('warning', 'El Valor de Abono tiene que ser mayor a 0', 'Pago');
                    return
                }

                if (!$scope.data.idBanco || $scope.data.idBanco===0) {
                    tS.toastr('warning', 'Seleccione el Banco', 'Pago');
                    return
                }

                if (!$scope.data.nro) {
                    tS.toastr('warning', 'Ingrese el Número', 'Pago');
                    return
                }
            }

            if (["", null, undefined].includes($scope.data.valorAbono)) {
                tS.toastr('warning', 'Ingrese el Valor del Abono', 'Pago');
                return
            }

            if ($scope.data.valorAbono===0) {
                tS.toastr('warning', 'El Valor de Abono tiene que ser mayor a 0', 'Pago');
                return
            }

        
            console.log($scope.getDataPago())
            $uibModalInstance.close($scope.getDataPago());
        }

        $scope.getDataPago = (item = {})=>{
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
            }
        }

        $scope.addDocumentoElectronico = (item)=>{
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



})(window.angular)
