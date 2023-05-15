
(function(){

    'use strict';

    app.controller('configGeneralCtrl', configGeneralCtrl);

    configGeneralCtrl.$inject = ['$scope', 'mainService', 'commonService', 'toastService']

    function configGeneralCtrl($scope, mS, commonSvc, tS){


        $scope.data = {};
        $scope.decimales = [2,3,4,5];

        $scope.codigo = {
            CV:'CV',
            CI:'CI',
            CD:'CD',
            CS:'CS'

        }


        $scope.getDataTabs = function(codConfig){
            try {
                hideLoader();
                $scope.codConfig = codConfig;

                mS.getData('get','Sistema/Get/'+JSON.stringify({codConfig}), null, true).then(response=>{
                    if(response.code === '0'){
                        hideLoader();
                        console.log(response)
                    }

                    if(response.code === '1'){
                        hideLoader();
                        switch (codConfig) {
                            case 'CV':
                                $scope.gestionSistema = JSON.parse(response.payload)[0][0];
                                $scope.searchText = $scope.gestionSistema.nombreFiscal;
                                $scope.searchTextArticle = $scope.gestionSistema.descripcion;
                                break;
                        
                            case 'CI':
                                $scope.gestionInventario = JSON.parse(response.payload)[0][0];
                                $scope.valoracionMetodos = JSON.parse(response.payload)[1];
                                break;

                            case 'CD':
                                $scope.response =  JSON.parse(response.payload)[0];
                                $scope.decimalAlmacen = $scope.response.find(item=>item.codTransaccion === 'AL')
                                $scope.decimalVenta = $scope.response.find(item=>item.codTransaccion === 'V')
                                $scope.decimalCompra = $scope.response.find(item=>item.codTransaccion === 'C')
                                break;

                            case 'CS':
                                $scope.entidadNotificaciones = JSON.parse(response.payload)[0];
                                console.log($scope.entidadNotificaciones)
                                break;
                            default:
                                break;
                        }

                    }
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }



        $scope.getDataTabs($scope.codigo.CV);


            //------------------------Cliente-------------------------------------------------
            $scope.searchTextChange = function(textSearch){
                if(textSearch===null || textSearch===undefined || textSearch===""){
                    $scope.gestionSistema.idCliente = undefined
                }
            }
            $scope.searchCustomer = function(textSearch){    
                if(textSearch===null || textSearch===undefined || textSearch==="") return Promise.resolve([])
                return commonSvc.clienteSearch(textSearch) || Promise.resolve([])
            }

            $scope.selectedItemChangeCliente = function(item){   
                if(!item) return
                $scope.gestionSistema.idCliente = item.idCliente;                                                                          
            }
              //------------------------Cliente-------------------------------------------------

                 //---------------------------------Articulo---------------------------
    $scope.searchTextChangeArticle = (textSearch)=>{
        if(textSearch===null || textSearch===undefined || textSearch===""){            
            $scope.gestionSistema.idArticulo = undefined;
        }
    }

    $scope.searchArticle = async(textSearch)=>{
        return  commonSvc.articuloSearchGeneral({
            textSearch,
            condicion: false
        }) || []
              
    }

    $scope.selectedItemChangeArticle = (item)=>{
        if(!item) return        
        $scope.gestionSistema.idArticulo = item.idArticulo;
    }
         //---------------------------------Articulo---------------------------

        $scope.save = function(){
            try {                
                let jsonConfig = {}
                let data = {}

                //---------------------------------Configuracion de Ventas---------------------------
                if($scope.codConfig === $scope.codigo.CV){                    

                    if($scope.gestionSistema.customerDefault ){
                        if (!($scope.gestionSistema.idCliente > 0)){
                            tS.toastr('warning', 'Seleccione un Cliente')
                            return
                        }else{
                            jsonConfig.idCliente =  $scope.gestionSistema.idCliente;                            
                        }
                    }else{
                        jsonConfig.idCliente = undefined;
                    }
                    if($scope.gestionSistema.articleDefault ){
                        if (!($scope.gestionSistema.idArticulo > 0)){
                            tS.toastr('warning', 'Selecione un Articulo')
                            return
                        }else{
                            jsonConfig.idArticulo =  $scope.gestionSistema.idArticulo;                            
                        }
                    }else{
                        jsonConfig.idArticulo = undefined;
                    }

                    
                    if($scope.gestionSistema.configDeuda ){
                        if (!($scope.gestionSistema.porcentajeInteres > 0)){
                            tS.toastr('warning', 'Ingrese un porcentaje de interes')
                            return
                        }else{
                            jsonConfig.porcentajeInteres =  $scope.gestionSistema.porcentajeInteres;                            
                        }

                        if (!($scope.gestionSistema.diasGracia > 0)){
                            tS.toastr('warning', 'Ingrese los días de gracia')
                            return
                        }else{
                            jsonConfig.diasGracia =  $scope.gestionSistema.diasGracia;                            
                        }

                    }else{
                        $scope.gestionSistema.porcentajeInteres = undefined;
                        $scope.gestionSistema.diasGracia = undefined;
                    }
                
                    jsonConfig.searchCode = $scope.gestionSistema.searchCode;
                    jsonConfig.printerAutomatic = $scope.gestionSistema.printerAutomatic;
                    jsonConfig.payAutomatic = $scope.gestionSistema.payAutomatic;
                    jsonConfig.porcentajeInteres = $scope.gestionSistema.porcentajeInteres;
                    jsonConfig.diasGracia = $scope.gestionSistema.diasGracia;
                   
                    data = {
                        idSistema: $scope.gestionSistema.idSistema, 
                        jsonConfig
                    }
                }

                console.log($scope.codConfig  )
                //---------------------------------Configuracion de Inventario---------------------------
                if($scope.codConfig === $scope.codigo.CI){
                    if($scope.gestionInventario.llevaInventario ){
                        if (!($scope.gestionInventario.idMetodoValoracion > 0)){
                            tS.toastr('warning', 'Seleccione un Metodo de Valoración')
                            return
                        }else{
                            jsonConfig = $scope.valoracionMetodos.find(item=>item.idMetodoValoracion===$scope.gestionInventario.idMetodoValoracion)                            
                        }
                    }else{
                        jsonConfig.idMetodoValoracion = undefined;
                        jsonConfig.codMetodoValoracion = undefined;
                    }

                    jsonConfig.llevaInventario = $scope.gestionInventario.llevaInventario?'SI':'NO';

                    data = {
                        idSistema: $scope.gestionInventario.idSistema, 
                        jsonConfig
                    }
                }

                
                //---------------------------------Configuracion de Decimales---------------------------
                if($scope.codConfig === $scope.codigo.CD){
                    jsonConfig = [$scope.decimalAlmacen, $scope.decimalCompra, $scope.decimalVenta]

                    data = {
                        idSistema: $scope.decimalAlmacen.idSistema, 
                        jsonConfig
                    }
                }
                
                //------------------------------Configuracion de Notificaciones------------------------
                if($scope.codConfig === $scope.codigo.CS){
                    data = {
                        idSistema: $scope.entidadNotificaciones[0].idSistema,
                        jsonConfig: $scope.entidadNotificaciones.map(item=>({
                            idNotificacionSistema : item.idNotificacionSistema,
                            estado: item.estado,
                            codigo: item.codigo
                        }))
                    }
                }


                showLoader()
                mS.getData('put', 'Sistema/Put?json= '+ JSON.stringify(data), null,true).then(response=>{
                    if(response.code === '0'){
                        hideLoader();
                        tS.toastr('warning', response.message)
                        console.log(response)
                    }

                    if(response.code === '1'){
                        hideLoader();
                        tS.toastr('success', response.message)
                        $scope.getDataTabs($scope.codConfig);
                    }
                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }
        }

    }

})(window.angular)



// app.controller("configGeneralCtrl", configGeneralCtrl);

// configGeneralCtrl.$inject=['$timeout', '$q', 'mainService', '$scope', 'commonService','modalService', 'nombreModal'];

// function configGeneralCtrl($timeout, $q, _mS, $scope, _commonSvc, _modalSvc, _nombreModal){
//     // let accion = JSON.parse(localStorage.getItem("accion"));
//     // if(accion===null){
//     //     location.href = "/Home/Index";
//     // }else{
//     //     $scope.accion = accion[0];
//     // }
            
//     $scope.data = {};
//     $scope.decimales = [2,3,4,5];

//     $scope.initiload = async()=>{ 
//         try {

//             showLoader();
//             const results = await Promise.all([
//                 _commonSvc.getGestionAlmacen(),
//                 _commonSvc.getModuloDecimal(),
//                 _commonSvc.getGestionSistema(),
//                 _mS.getData('get','/TipoIva/OptionTipoIva').then(response=>response.data),
//                 _mS.getData('get','/ConfigVentaDetalle/Get?json=' + JSON.stringify({})),
//                 _mS.getData('get','/NotificacionEntidad/Get?json=' + JSON.stringify({})).then(response=>response.data),
//             ])  
//             const {valoracionMetodos}  = results[0];
//             $scope.valoracionMetodos =  valoracionMetodos;  
      
//             const moduloDecimales = results[1];
//             $scope.decimalAlmacen = moduloDecimales[0][0],
//             $scope.decimalCompra  = moduloDecimales[1][0],
//             $scope.decimalVenta   = moduloDecimales[2][0];   
    
//             $scope.gestionSistema = results[2][0];
//             $scope.searchText     = $scope.gestionSistema.nombreFiscal; //Buscar Cliente 
//             $scope.searchTextArticle = $scope.gestionSistema.descripcion;

//             //Busqueda de Articulo por Código de Barra en Ventas
//             $scope.gestionSistema.searchCode = $scope.gestionSistema.searchCode===1?true: false;
//             $scope.gestionSistema.printerAutomatic = $scope.gestionSistema.printerAutomatic===1?true: false;
//             $scope.gestionSistema.payAutomatic  = $scope.gestionSistema.payAutomatic===1?true: false;
            
//             $scope.tipoIvas       = results[3];            
//             $scope.configDetalle  = JSON.parse(results[4].payload)[0];

            
            
//             if(results[5]){
//                $scope.entidadNotificaciones = JSON.parse(results[5]);                      
//             }



//             hideLoader();
//             $scope.$apply();

//         } catch (error) {
//             hideLoader();
//             console.log(error)
//         }
//     }

//     $scope.initiload();





    
//     //------------------------------------CONFIGURACION DE SISTEMA---------------
//     $scope.updateConfigSistema= async()=>{            
//         if(!$scope.gestionSistema.taxesDefault || $scope.gestionSistema.idTipoIva<0){
//             toastr.warning("El Tipo IVA es requerido");
//             return
//         }
//         if($scope.gestionSistema.taxesDefault && !$scope.gestionSistema.idTipoIva){
//             toastr.warning('Seleccione el Tipo IVA');
//             return
//         }

       
       
//         if($scope.gestionSistema.llevaInventario && !($scope.gestionSistema.idMetodoValoracion>0)){
//             toastr.warning('Seleccione el Método de Valoración');
//             return
//         }else if(!$scope.gestionSistema.llevaInventario){
//             $scope.gestionSistema.idMetodoValoracion = 0;
//         }
    

//         if($scope.gestionSistema.customerDefault && (!$scope.gestionSistema.idCliente|| $scope.gestionSistema.idCliente==0)){
//             toastr.warning('Seleccione el Cliente');
//             return
//         }else if(!$scope.gestionSistema.customerDefault){
//             $scope.gestionSistema.idCliente = 0;
//         }

//         if($scope.gestionSistema.articleDefault && (!$scope.gestionSistema.idArticulo || $scope.gestionSistema.idArticulo===0)){
//             toastr.warning('Seleccione el Artículo');
//             return
//         }else if(!$scope.gestionSistema.articleDefault){
//             $scope.gestionSistema.idArticulo = 0;
//         }

       
    
//         Swal.fire({
//             icon:'warning',
//             html:`<small>Desea Actualizar la Configuración del Sistema?</small>`,
//             showConfirmButton: true,
//             confirmButtonText:'Si, actualizar',
//             showCancelButton:true,
//             cancelButtonText:'No, cancelar',
//             allowOutsideClick: false
//         }).then(result=>{
//             if(result.isConfirmed){

//                 let data = Object.assign({}, $scope.gestionSistema);
                
//                 data.llevaInventario = data.llevaInventario?'SI':'NO';
//                 data.searchCode = data.searchCode? 1: 0;       
//                 data.printerAutomatic = data.printerAutomatic? 1: 0;  
//                 data.payAutomatic  = data.payAutomatic? 1: 0;

                
//                 _mS.getData('put', '/GestionSistema/Put?id=' + $scope.gestionSistema.idGestionSistema, data).then(response =>{
//                     if(response.code=="0"){
//                         toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})                    
//                     }
//                     if(response.code==="1"){
//                         $scope.initiload();
                    
//                         toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
//                     }

//                 })      
//             }

//         })       
//     }
    


//     //---------------------------------------CONFIGURACIÓN DE DECIMALES------------------------------------
//     $scope.updateModuloDecimal = async()=>{
//         let {isConfirmed} = await Swal.fire({
//             icon:'warning',
//             html:`<small>Desea Actualizar los decimales generales ahora?</small>`,
//             showConfirmButton: true,
//             confirmButtonText:'Si, actualizar',
//             showCancelButton:true,
//             cancelButtonText:'No, cancelar',
//             allowOutsideClick: false
//         })

//         if(isConfirmed){
//             const moduloDecimales = [$scope.decimalAlmacen, $scope.decimalCompra, $scope.decimalVenta];
//             const response = await _mS.getData('put','/CantidadDecimal/Update?json=' + JSON.stringify(moduloDecimales))                                          
//             if(response.id==='0'){
//                 toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
//             }
//             if(response.id==='1'){
//                 $scope.initiload();
//                 toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
//             }           
//         }
//     }
    

    
//     //---------------------------------------CONFIGURACIÓN DE MOSTRAR COLUMNAS EN DETALLE VENTA ------------------------------------
//     $scope.updateConfigShowDetalle= async()=>{
//         const response = await _mS.getData('put', '/ConfigVentaDetalle/Put?json=' + JSON.stringify($scope.configDetalle));

//         console.log(response);
//         if (response.code == "0") {
//             toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
//             return
//         }
//         if (response.code == "1") {
//             $scope.initiload();                
//             toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
//         }
//     }



//     $scope.updateNotificacion = async()=>{
//         let response = await _mS.getData('put', '/NotificacionEntidad/Update?json=' + JSON.stringify($scope.entidadNotificaciones));       
//         if(response.id==='0'){
//             toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
//         }
//         if(response.id==='1'){
//             $scope.initiload();
//             toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'});
//         }
//     }






// }