

(function () {

    'use strict';

    const FILE_PATH_PARTIAL_UI = '~/Areas/CuentaPorPagar/Pages/'

    app.controller('cuentaPorPagarCtrl', cuentaPorPagarCtrl)

    cuentaPorPagarCtrl.$inject = ['$scope', 'toastService', 'mainService', 'screenSize', '$timeout' ,'modalService', 'formulario']

    function cuentaPorPagarCtrl($scope, _tS, _mS, _sS, $timeout, _modalSvc, _form) {

        $scope.selectedDocumentos = [];
    
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
                let modalParams = {
                    controller: 'modalCuotaCtrl',
                    template: FILE_PATH_PARTIAL_UI + 'Shared/_ModalCuota.cshtml',
                    size: 'xl',
                    isRenderRazorPartial: true
                }

                let spParams = { idCuentaPorPagar : item.idCuentaPorPagar, tipo: 2 }
               
                showLoader();
                _mS.getData('get', 'CuentaPorPagar/' + JSON.stringify(spParams), null, true).then(response => {
                    
                    let cuotas = response.payload ? JSON.parse(response.payload)[0] : []
                    
                    modalParams.params = {
                        cuotas,
                        data: {
                            ...item,
                            id: item.idCuentaPorPagar,  
                            codPago : item.codPago,              
                            numeroIdentificacion: item.identificacion
                        },
                    }  

                    let modalRef = _modalSvc.openModalCustom(modalParams);
                    modalRef.result.then(res=>{
                        if(typeof res ==='object'){
                            $scope.initialLoad();                    
    
                        }
                    })
                    hideLoader()
                })
               
            } catch (error) {
                hideLoader()
                console.log(error)
            }                        
        }


        $scope.openModalPago = async(item)=>{
            try {
                console.log(item)
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

    modalCuotaCtrl.$inject = ["$scope", "$uibModalInstance", "mainService", "commonService", "formulario", "toastService", "params"];

    function modalCuotaCtrl($scope, $uibModalInstance, mS, commonSvc, fS, tS, params) {
        
        let {data, cuotas} = params;
        
        const NUM_MAX_ROUND = 3;

        $scope.tiempoCreditos = [];

        $scope.data = Object.assign({}, data);
        
        $scope.cloneIdTiempoCredito = $scope.data.idTiempoCredito; //Clonamos tiempo de credito agregado al documento 
        $scope.configFecha     = fS.formatDate($scope.data.fechaEmision);
        $scope.totalDiferencia = 0;
        $scope.totalCuota = 0;   
        
        
        $scope.initialLoad = ()=>{
            
            commonSvc.getAllTiempoCredito(false).then(response=>{            
                $scope.tiempoCreditos = response;       
            })
    
            
            $scope.cuotas = cuotas.map(item=>{
                let fechaVencimiento = item.fechaVencimiento.split(" ")[0].split("/").reverse().join("/");                           
                item.fechaVencimiento = new Date(fechaVencimiento);
                return item;
            })
            let totalCuota = $scope.cuotas.map(val => parseFloat(val.cuota)).reduce((prev, curr) =>prev + curr, 0);
            $scope.totalCuota = fS.roundNumber(totalCuota, NUM_MAX_ROUND);

        }

        $scope.initialLoad();


        //Obtenemos fecha escrita de fecha vencimiento de la cuota 
        $scope.getFechaVencimientoEscrita = (fechaVencimiento)=>{
            return fS.getFechaEscritaCompleta(fechaVencimiento)
        }

        
        //Generar Nueva cuota 
        $scope.generarNuevaCuota = ()=>{  
            let tiempoCredito = $scope.tiempoCreditos.find(item=>item.idTiempoCredito===$scope.data.idTiempoCredito);

            Swal.fire({
                icon: 'warning',
                html: `<small>Está seguro/a de generar <h3><b>${tiempoCredito.numeroCuota} </b></h3> ${tiempoCredito.numeroCuota===1?'Cuota':'Cuotas'} del Comprobante <b>N°. ${$scope.data.serieComprobante}</b></small>`,
                showDenyButton: true,
                confirmButtonText: `Si, generar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false,
                allowEscapeKey:false                        
            }).then(result=>{
                if(result.isConfirmed){
                    let data = {
                        idCuentaPorPagar: $scope.data.id,
                        idTiempoCredito: $scope.data.idTiempoCredito,
                        codPago: $scope.data.codPago
                    };
        
                    mS.getData('post', 'CuentaPorPagar/'+ JSON.stringify(data), null, true).then(response => {
                        if (response.code === "0") {
                            fS.sweetAlert('warning', response.message, response.titleSms);                                                                                       
                        }
                        if (response.code == "1") {
                          
                            fS.sweetAlert('success', response.message, response.titleSms, 1000); 
                          
                            let cuotas = response.payload ? JSON.parse(response.payload) : []
                          
                            $scope.cuotas = cuotas.map(item=>{
                                item.fechaVencimiento = fS.formatDate(item.fechaVencimiento);
                                return item
                            })  
                                            
                        }
                    })
                }else{
                    $scope.data.idTiempoCredito = $scope.cloneIdTiempoCredito;                
                }
            })
        }



        $scope.getConfigFechaCuota = (validacion)=>{
            try {
                if(!$scope.configFecha){
                    fS.sweetAlert('warning', 'Fecha Inválida', 'Configuración de Fecha');
                    return
                }
                if ($scope.configFecha.getFullYear().toString().length !== 4) {
                    fS.sweetAlert('warning', 'El Formato del Año es incorrecto', 'Configuración de Fecha');
                    return                       
                }
        
                if (!validacion && $scope.configFecha.getDate() >= 28) {
                    fS.sweetAlert('warning', 'Para la opción <code>Mismo Día</code>, el día tiene que ser menor a 28 días!', 'Configuración de Fecha');                        
                    return
                }
                
                showLoader();
                let configFecha = fS.formatDate($scope.configFecha);                       
                
        
                mS.getData('post', `/CuotaXPagar/NuevaFechaCuota?validacion=${validacion}&fecha=${configFecha}`, $scope.cuotas).then(
                    response => {
                        if (response.id === "0") {
                            hideLoader()
                            fS.sweetAlert('warning', response.message, response.titleSms);
                            return                            
                        }
                        if (response.id === "1") {
                            hideLoader()
                            fS.sweetAlert('success', 'Fecha de las cuotas configurado correctamente', 'Configuración Fecha', 1000)                
                            $scope.$uibModalInstance.close(response)
                        }
                    })
            } catch (error) {
               console.log(error) 
            }
        }
        
        
        $scope.setValorEntrada = (valorEntrada)=> {    
            try {
            
            
                if([null, undefined, '0', ""].includes(valorEntrada)){
                    setTimeout(() => {
                        $("#valorEntrada").select();
                    }, 50);
                    valorEntrada = 0;
                    return                
                }

                let total = 0;
                let valorCuota = 0;
                let numeroCuota = $scope.tiempoCreditos.find(item=>item.idTiempoCredito===$scope.data.idTiempoCredito).numeroCuota;
                

                total = $scope.data.importeTotal - parseFloat(valorEntrada);
                total = fS.roundNumber(total, 5);
                
                valorCuota = total / numeroCuota
                valorCuota = fS.roundNumber(valorCuota, 5);

                
                for (let item of $scope.cuotas) {
                    if (item.nroCuota === "E") {
                        item.cuota = valorCuota === 0 ? $scope.data.importeTotal : valorEntrada;
                    }
                    if (item.nroCuota !== "E") {
                        item.cuota = valorCuota;
                    }
                }

                let totalCuota = $scope.cuotas.map(val => parseFloat(val.cuota)).reduce((prev, curr) =>prev + curr, 0);
                $scope.totalCuota = fS.roundNumber(totalCuota, $scope.NUM_MAX_ROUND)
            
            } catch (error) {
                console.log(error)              
            }                
        }
        
        //Set valor por cuota 
        $scope.setValorCuota = (cuota)=> {  
            try {
                                        
                if ([null, undefined, "", "0", "-"].includes(cuota.cuota)) {            
                    setTimeout(() => {
                        $("#setValcuota" + cuota.idCuotaXPagar).select();
                    }, 50);
                    return
                }
            

                let cuotasIndexMenor = $scope.cuotas.filter((val, index, arrayCuota) => index <= arrayCuota.indexOf(cuota));
                let cuotasIndexMayor = $scope.cuotas.filter((val, index, arrayCuota) => index > arrayCuota.indexOf(cuota));
                let totalCuotaIndexMenor = cuotasIndexMenor.map(val => Number(val.cuota)).reduce((prev, curr) => prev + curr, 0);

                if (totalCuotaIndexMenor > $scope.data.importeTotal) {
                    tS.toastr('warning', 'El valor de la Cuota tiene que ser menor al Total del Documento');                    
                }

                if (cuotasIndexMayor.length > 0) {
                    let total = $scope.data.importeTotal - totalCuotaIndexMenor; //Total Cuota - total Factura  
                    
                    let numeroCuota = cuotasIndexMayor.length;
                    let valorCuota = total / numeroCuota;

                    
                    angular.forEach($scope.cuotas, (val, index, arrayCuotas) => {
                        //Si la Cuota tiene entrada 
                        if (val.nroCuota !== "E" && index > arrayCuotas.indexOf(cuota)) {
                            val.cuota = fS.roundNumber(valorCuota, 5);
                        } else if (index > arrayCuotas.indexOf(cuota)) {
                            val.cuota = fS.roundNumber(valorCuota, 5);
                        }
                    });

                }

                let totalCuota = $scope.cuotas.map(val => parseFloat(val.cuota)).reduce((prev, curr) =>prev + curr, 0);
                $scope.totalCuota = fS.roundNumber(totalCuota, NUM_MAX_ROUND) //Suma Total Cuota            
                
                let diferencia = $scope.data.importeTotal - $scope.totalCuota;
                $scope.totalDiferencia = fS.roundNumber(diferencia, NUM_MAX_ROUND)     
            } catch (error) {
                console.log(error)    
            }   
        }

        //Set date fecha Vencimiento by cuota 
        $scope.setFechaVencimientoCuota = (cuota)=>{
            let inputFvcto = $("#fechaVencimiento" + cuota.idCuotaXPagar);

            if (!cuota.fechaVencimiento) {
                inputFvcto.removeClass('is-valid');
                inputFvcto.addClass('is-invalid');
                return
            } else {
                inputFvcto.addClass('is-valid');
                inputFvcto.removeClass('is-invalid');
            }

            for (let i = 0; i < $scope.cuotas.length; i++) {
                if (i < $scope.cuotas.indexOf(cuota)) {
                    if (cuota.fechaVencimiento <= $scope.cuotas[i].fechaVencimiento) {
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
        $scope.guardarCuota = ()=> {            
            try {

                if ($scope.cuotas.some(val => val.nroCuota === "E" && [null, undefined, "", 0, "0", ".", "-"].includes(val.cuota))) {
                    tS.toatsr('warning', 'Ingrese el Valor de la Entrada', 'Guardar Cuotas');
                    return
                }
    
                if ($scope.cuotas.some(val => [null, undefined, "", 0, "0", ".", "-"].includes(val.cuota) || val.cuota < 0)) {
                    tS.toastr('warning', 'Verifique el valor de las Cuotas', 'Guardar Cuotas');
                    return
                }
    
                if ($scope.cuotas.some(val => [null, undefined, ""].includes(val.fechaVencimiento) 
                    || $("#fechaVencimiento" + val.idCuotaPorPagar).hasClass('is-invalid'))
                ) {
                    tS.toatsr('warning', 'Ingrese las fechas de vencimiento correctamente');
                    return
                }
                
                if (fS.roundNumber($scope.totalCuota) !== fS.roundNumber($scope.data.importeTotal)) {
                    fS.sweetAlert('warning', 'El valor total del Documento no coincide con el valor total de la Cuota')            
                    return
                }
    
                Swal.fire({
                    icon: 'warning',
                    html: `<small>Está seguro/a de guardar las cuotas de este Comprobante
                            N°: <b>${$scope.data.serieComprobante}</b></small>`,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, guardar',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then(result => {
                   
                    if(result.isConfirmed){

                        showLoader();
                        mS.getData('put', 'CuentaPorPagar/' + $scope.data.id + '?json=' + JSON.stringify($scope.cuotas), null, true)
                        .then(response => {
                            if (response.code === "0") {
                                hideLoader()
                                fS.sweetAlert('warning', response.message, response.titleSms);
                                return
                            }
                            if (response.code === "1") {
                                hideLoader()
                                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                let cuotas = response.payload ? JSON.parse(response.payload) : []
                                $scope.cuotas = cuotas.map(item=>{
                                    item.fechaVencimiento = fS.formatDate(item.fechaVencimiento);
                                    return item
                                })                                    
                            }
                        });

                    }
                })               
            } catch (error) {
                console.log(error);
            }                        
        }

        $scope.closeModal = ()=>{
            $uibModalInstance.close()
        }
    }
    //---------------------------------------------END CUOTAS--------------------------------------------------







    //---------------------------------------------START PAYMENT--------------------------------------

    app.controller("modalPagoCtrl", modalPagoCtrl);

    modalPagoCtrl.$inject = ['$scope', '$uibModalInstance', 'mainService', 'modalService', 'formulario',  'params'];

    function modalPagoCtrl($scope, $uibModalInstance, mS, _modalSvc, fS, params){

        let {data, cuotas}  = params;

        $scope.data = Object.assign({}, data);

        $scope.data.totalAbonoAnterior = 0;
        $scope.data.abono = 0;
        $scope.data.abonoPosfechado = 0;
        $scope.data.abonoTotal = 0;
        $scope.data.saldo = $scope.data.importeTotal;
        $scope.data.valorCambio = 0;  

        $scope.datosPago = [];        
        $scope.pagosDetalle = [];
        $scope.historialPagos = [];

        
    
    
        $scope.selectedDocumentos = [{
            ...data,
            cuotas        
        }]

        $scope.cloneSelectedDocumentos = JSON.parse(JSON.stringify($scope.selectedDocumentos));



        $scope.displayCuota = (item)=>{
            item.display = !item.display
        }


        $scope.getTotalesCuota = ()=>{
            //let groupCuotas = $scope.selectedDocumentos.flatMap(item=>item.cuotas);
            let totalCuota = 0, totalAbonoAnterior = 0, totalSaldo = 0;

            for(let item of $scope.selectedDocumentos){
                totalCuota         += item.importeTotal;
                totalAbonoAnterior += item.abono;
                totalSaldo         += item.saldo;
            }

            $scope.data.importeTotal       = fS.roundNumber(totalCuota, 5);
            $scope.data.totalSaldo         = fS.roundNumber(totalSaldo, 5);
            $scope.data.totalSaldoOriginal = fS.roundNumber(totalSaldo, 5);
            $scope.data.totalAbonoAnterior = fS.roundNumber(totalAbonoAnterior, 5)                  
            $scope.data.totalValorAbono    = 0;        
            $scope.data.valorCambio          = 0;
        }
        $scope.getTotalesCuota();

        

        //Calculo de abono y saldo una vez agregado el forma pago 
        $scope.calculoTotales = ()=>{
           
            let totalValorAbono = $scope.datosPago.map(item=>item.valorAbono).reduce((prev, curr) => prev + curr, 0)                           
            let totalSaldo = $scope.selectedDocumentos.flatMap(item => item.cuotas).map(item => item.saldo).reduce((prev, curr) => prev + curr, 0);
            let valorCambio = 0;            
        
            $scope.data.totalValorAbono = fS.roundNumber(totalValorAbono, 5);              
            $scope.data.totalSaldo = fS.roundNumber(totalSaldo, 5);

            
            if ($scope.data.totalValorAbono >= $scope.data.totalSaldoOriginal) {
                valorCambio = $scope.data.totalValorAbono - $scope.data.totalSaldoOriginal;
            }                

            $scope.data.valorCambio = fS.roundNumber(valorCambio, 5);              
                               
        }


        $scope.openModalFormaPago = ()=>{
            try {

                if ($scope.data.totalSaldo == 0) {
                    fS.sweetAlert('warning', 'No hay cuotas pendientes.')
                    return
                }

                let params = {
                    proveedor: {
                        idProveedor: $scope.data.idProveedor,
                        nombreFiscal: $scope.data.nombreFiscal
                    },
                    importeTotal: $scope.data.importeTotal,                    
                    saldo: $scope.data.totalSaldo,
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
                            $scope.indexDatoPago       = $scope.datosPago.length + 1;
                            $scope.esAbonoPosfechado   = result.isPosfechado;
                            $scope.valorAbonoFormaPago = result.valorAbono;
                                                      
                            $scope.addFormaPago();

                            let abonoCuota = $scope.pagosDetalle.filter(item=>item.secuencial===$scope.indexDatoPago)
                                                                .reduce((prev, curr) => prev + curr.abono, 0)
                            $scope.addDatosPago(result, abonoCuota);
                        
                            $scope.calculoTotales();
                            fS.sweetAlert('success', 'Agregado Correctamente', '', 1000);
                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                html:`<small>Algo salio mal: ${error}</small>`
                            })
                            console.log(error);
                        }
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }


        //Add 
        $scope.addFormaPago = ()=>{
                       
            for(let group of $scope.selectedDocumentos){
             
                $scope.group = group;
             
                for(let item of group.cuotas){
                    
                    if(typeof $scope.valorAbonoFormaPago !=='number' || $scope.valorAbonoFormaPago===0) return;

                    //Si la cuota no tiene ningún abono
                    if((item.cuota ===item.saldo)  && (item.abono === 0 || item.abonoPosfechado === 0)){
                       
                        $scope.cuotaSinAbono(item)
    
                    } else if(item.cuota !== item.saldo && item.saldo > 0) {
    
                        $scope.cuotaConAbono(item)
                    }
                  
    
                    item.cuota = fS.roundNumber(item.cuota, 5);
                    item.abono = fS.roundNumber(item.abono, 5);
                    item.abonoPosfechado = fS.roundNumber(item.abonoPosfechado, 5);
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

            if(item.saldo >=$scope.valorAbonoFormaPago){

                //Si el Abono pago no es Posfechado
                item.abono = $scope.esAbonoPosfechado ? 0: $scope.valorAbonoFormaPago;

                //Si el abono pago es posfechado
                item.abonoPosfechado =  $scope.esAbonoPosfechado ? $scope.valorAbonoFormaPago : 0;
                item.saldo = item.saldo - $scope.valorAbonoFormaPago;

                $scope.addPagoDetalle(item, $scope.valorAbonoFormaPago)
                $scope.valorAbonoFormaPago = 0;

            }else if(item.saldo <= $scope.valorAbonoFormaPago) {

                //Si el Abono pago no es Posfechado
                item.abono = $scope.esAbonoPosfechado ? 0 : item.cuota;
                
                //Si el abono pago es posfechado
                item.abonoPosfechado = $scope.esAbonoPosfechado ? item.cuota : 0; 

                item.saldo = $scope.valorAbonoFormaPago -= item.saldo;

                $scope.addPagoDetalle(item, item.cuota)
            }

        }


        /**
         * 
         * @param {object} item 
         */
        $scope.cuotaConAbono = (item)=>{

            if (item.saldo >= $scope.valorAbonoFormaPago) {
                
                if ($scope.esAbonoPosfechado) {
                    item.abonoPosfechado = $scope.valorAbonoFormaPago + item.abonoPosfechado;
                } else {
                    item.abono = $scope.valorAbonoFormaPago + item.abono;
                }

                item.saldo = item.saldo - $scope.valorAbonoFormaPago;
                $scope.addPagoDetalle(item, $scope.valorAbonoFormaPago);
                $scope.valorAbonoFormaPago = 0;
        
               
            } else if (item.saldo <= $scope.valorAbonoFormaPago) {
               
                if ($scope.esAbonoPosfechado) {
                    item.abonoPosfechado = item.abonoPosfechado + item.saldo;
                } else {
                    item.abono = item.abono + item.saldo;
                }
                
                let resultValorAbono = $scope.valorAbonoFormaPago -= item.saldo;
                $scope.valorAbonoFormaPago = fS.roundNumber(resultValorAbono, 10);
                
                $scope.addPagoDetalle(item, item.saldo);
            }
        }


        /**
         * 
         * @param {object} item 
         * @param {number} abono 
         * @returns void
         */
        $scope.addPagoDetalle = (item, abono)=>{
            if(item.cuota==0) return;

            $scope.pagosDetalle.push({
                idCuentaPorPagar: $scope.group.idCuentaPorPagar,
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
            let total = item.abono + item.abonoPosfechado;
            return fS.roundNumber(total, 5) === fS.roundNumber(item.cuota, 5) ? 0 : fS.roundNumber(item.saldo, 5);
        }


        /**
         * 
         * @param {object} item  cuota
         * @returns {string} estado 
         */
        $scope.getEstadoCuota = (item)=> {
            let estado = '';
            if (item.cuota === (item.abono + item.abonoPosfechado)) estado = 'PAGADA'
            if (item.saldo > 0) estado = "PENDIENTE PARCIAL";
            if (item.cuota === item.saldo) estado = "PENDIENTE";
            return estado
        }


        $scope.showPagoDetalle = (data) => {
            
            let tempPagosDetalle = $scope.pagosDetalle.filter(item=>item.idCuotaPorPagar===data.idCuotaPorPagar);
            let infoPagosDetalle = [];
          
            for(let pd of tempPagosDetalle){
                let dataPago = $scope.datosPago.find(item=>item.secuencial===pd.secuencial);
                infoPagosDetalle.push({
                    ...pd,
                    subEntidadFinanciera: dataPago.subEntidadFinanciera,
                    posFechado: dataPago.posFechado?'SI':'NO'
                })
            }
            
            let index = 1;
            Swal.fire({
                icon:'info',
                title:`<span>Cuota:</span> $${data.cuota}`,
                width: 600,
                html:`<table class="table table-striped table-sm color-bordered-table info-bordered-table">
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


        //-----------------------------------Datos Pago---------------------
        $scope.addDatosPago = (obj, abonoCuota) => {
            $scope.datosPago.push({ 
                ...obj,
                abonoCuota,
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

                    $scope.$apply(()=>{

                        $scope.pagosDetalle = [];
    
                        let index = $scope.datosPago.indexOf(item);
                        $scope.datosPago.splice(index, 1);
                        
                        //Todas las cuotas en su estado original 
                        $scope.selectedDocumentos = JSON.parse(JSON.stringify($scope.cloneSelectedDocumentos));
                        $scope.getTotalesCuota();    
    
                        if ($scope.datosPago.length == 0) return
                    
                        //Recalculamos las cuotas con los abonos restantes   
                        $scope.indexDatoPago = 0
                        for(let item of $scope.datosPago) {
                            $scope.indexDatoPago++;
                            $scope.valorAbonoFormaPago = item.valorAbono;
                            $scope.esAbonoPosfechado   = item.isPosfechado;
                            $scope.addFormaPago();
                        }
                       
                        $scope.calculoTotales();


                    })

                    
                }
            })
        }




        $scope.save = ()=>{
        
            try {
                if($scope.datosPago.length===0) {
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
                        showLoader();
                        let historialPagos = [];

                        for(let item of $scope.selectedDocumentos){
                            let totalAbono = $scope.pagosDetalle.filter(pd =>pd.idCuentaPorPagar===item.idCuentaPorPagar)
                                                                .map(fpd=>fpd.abono).reduce((prev, curr)=>prev + curr, 0);
                            if(totalAbono > 0){
                                historialPagos.push({
                                    idCuentaPorPagar: item.idCuentaPorPagar,
                                    abono: totalAbono
                                })
                            }else break;
                        }

                        
                        let spParams = {
                            comprobante: JSON.stringify({
                                idProveedor: $scope.data.idProveedor,
                                total: $scope.data.totalValorAbono,
                                codEstab: $scope.data.codEstab,
                                numeroIdentificacion: $scope.data.identificacion,
                                nombreFiscal: $scope.data.nombreFiscal
                            }),
                            pago: JSON.stringify($scope.datosPago.map(item=>({
                                idEntidadFinanciera: item.idEntidadFinanciera,
                                idSubEntidadFinanciera: item.idSubEntidadFinanciera,
                                idBanco: item.idBanco,
                                idCuentaBancaria: item.idCuentaBancaria,
                                idTipoDocumento: item.idTipoDocumento,
                                idComprobante: item.idComprobante,
                                fechaEmision: item.fechaEmision,
                                nro: item.nro,
                                valor: item.valorAbono,
                                abono: item.abonoCuota,
                                secuencial: item.secuencial,
                                lote: item.lote,
                                aprobacion: item.aprobacion,
                                referencia: item.referencia,
                                controlCaja: item.controlCaja,
                                posfechado: item.posFechado,
                            }))),
                            pagoDetalle: JSON.stringify($scope.pagosDetalle.map(item=>({
                                idCuotaPorPagar: item.idCuotaPorPagar,
                                abono: item.abono,
                                secuencial: item.secuencial                            
                            }))),
                            historial: JSON.stringify(historialPagos),
                        }
                        mS.getData('post', '/ComprobanteEgreso/Post', spParams).then(response=>{
                            console.log(response)
                            if(response.code==="0"){
                                hideLoader();
                                fS.sweetAlert('warning', response.message)
                            }

                            if(response.code==="1"){
                                hideLoader();
                                fS.sweetAlert('success', response.message, '', 1000);
                                $uibModalInstance.close(response)
                            }
                        }).catch(error=>{
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


        $scope.closeModal = ()=>{
            $uibModalInstance.close();
        }

    }
    //--------------------------------------------END PAYMENT------------------------------------------------------





    //-----------------------------------------START FORMA PAGO--------------------------------------------------
    app.controller("formaPagoCtrl", formaPagoCtrl);

    formaPagoCtrl.$inject = ["$scope", "$uibModalInstance", "mainService", "toastService", "params"];

    function formaPagoCtrl($scope, $uibModalInstance, mS, tS, params){

        let {saldo, proveedor} = params;
        const VALOR_ABONO_ORIGINAL = saldo;
       
        $scope.data = {};
        $scope.data.posFechado = false
        $scope.proveedor = proveedor;

        $scope.data.fechaEmision = new Date();        
        $scope.data.valorAbono = params.saldo;

        

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

            mS.getData('get', 'CuentaPorPagar/' + JSON.stringify({tipo: 3, idProveedor: $scope.proveedor.idProveedor}), null, true).then(response=>{
              
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
                controlCaja: subEntidadFinanciera.controlCaja
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
