app.controller("configGeneralCtrl", configGeneralCtrl);

configGeneralCtrl.$inject=['$timeout', '$q', 'mainService', '$scope', 'commonService','modalService', 'nombreModal'];

function configGeneralCtrl($timeout, $q, _mS, $scope, _commonSvc, _modalSvc, _nombreModal){
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    }
            
    $scope.data = {};
    $scope.decimales = [2,3,4,5];

    $scope.initiload = async()=>{ 
        try {

            showLoader();
            const results = await Promise.all([
                _commonSvc.getGestionAlmacen(),
                _commonSvc.getModuloDecimal(),
                _commonSvc.getGestionSistema(),
                _mS.getData('get','/TipoIva/OptionTipoIva').then(response=>response.data),
                _mS.getData('get','/ConfigVentaDetalle/Get?json=' + JSON.stringify({})),
                _mS.getData('get','/NotificacionEntidad/Get?json=' + JSON.stringify({})).then(response=>response.data),
            ])  
            const {valoracionMetodos}  = results[0];
            $scope.valoracionMetodos =  valoracionMetodos;  
            
            var min = 12,
            max = 100;            
            
           
            
    
            const moduloDecimales = results[1];
            $scope.decimalAlmacen = moduloDecimales[0][0],
            $scope.decimalCompra  = moduloDecimales[1][0],
            $scope.decimalVenta   = moduloDecimales[2][0];   
    
            $scope.gestionSistema = results[2][0];
            $scope.searchText     = $scope.gestionSistema.nombreFiscal; //Buscar Cliente 
            $scope.searchTextArticle = $scope.gestionSistema.descripcion;

            //Busqueda de Articulo por Código de Barra en Ventas
            $scope.gestionSistema.searchCode = $scope.gestionSistema.searchCode===1?true: false;
            $scope.gestionSistema.printerAutomatic = $scope.gestionSistema.printerAutomatic===1?true: false;
            $scope.gestionSistema.payAutomatic  = $scope.gestionSistema.payAutomatic===1?true: false;
            
            $scope.tipoIvas       = results[3];            
            $scope.configDetalle  = JSON.parse(results[4].payload)[0];

            
            
            if(results[5]){
               $scope.entidadNotificaciones = JSON.parse(results[5]);                      
            }



            if($scope.gestionSistema.llevaInventario){
                $scope.createOptionMetodoValoracion()
            }
           

            hideLoader();
            $scope.$apply();

        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    $scope.initiload();


    //Js eliminar posteriormente 
    setTimeout(()=>{
        $("#llevaInventario").on('change', e=>{
            $scope.createOptionMetodoValoracion();
        })
    }, 500)

    //Create option metodo valoracion 
    $scope.createOptionMetodoValoracion = ()=>{
        setTimeout(() => {
            var select = document.getElementById('metodoValoracion'), option;

            if(select===null) return;
            
            for (var i=0; i<select.length; i++) {
                select.remove(i);
            }

            

            var opt = document.createElement('option');
            opt.value = null;
            opt.innerHTML = 'Seleccione...';
            opt.selected = false;
            select.appendChild(opt);
            
            for(let item of $scope.valoracionMetodos){

                var opt = document.createElement('option');
                opt.value = item.idMetodoValoracion;
                opt.innerHTML = item.descripcion;
                opt.selected = false;
                select.appendChild(opt);
            }               

           
        }, 500)

        setTimeout(()=>{
            var select = document.getElementById('metodoValoracion'), option;
            if(select===null) return 
            
            for (var i=0; i<select.options.length; i++) {
                option = select.options[i];
                
                console.log(option.value, $scope.gestionSistema.idMetodoValoracion);
                if (option.value == $scope.gestionSistema.idMetodoValoracion) {
                
                   option.selected = true;
                   return                       
                } 
              }

        }, 500)
    }


    //------------------------Cliente-------------------------------------------------
    $scope.searchTextChange = (textSearch)=>{
        if(textSearch===null || textSearch===undefined || textSearch===""){
            $scope.gestionSistema.idCliente = 0;
        }
    }
    $scope.searchCustomer = function(textSearch){    
        if(textSearch===null || textSearch===undefined || textSearch==="") return
        return _commonSvc.clienteSearch(textSearch);
    }

    $scope.selectedItemChangeCliente = function(item){   
        if(!item) return
        $scope.gestionSistema.idCliente = item.idCliente;                                                                          
    }

    //---------------------------------Articulo---------------------------
    $scope.searchTextChangeArticle = (textSearch)=>{
        if(textSearch===null || textSearch===undefined || textSearch===""){            
            $scope.gestionSistema.idArticulo = 0;
        }
    }

    $scope.searchArticle = async(textSearch)=>{
        let results = _commonSvc.articuloSearchGeneral({
            textSearch,
            condicion: false
        })
       
        let deferred = $q.defer();
        deferred.resolve(results);      
        return deferred.promise; 
    }

    $scope.selectedItemChangeArticle = (item)=>{
        if(!item) return        
        $scope.gestionSistema.idArticulo = item.idArticulo;
    }

    $scope.editArticle = async()=>{
        if(!$scope.gestionSistema.idArticulo || $scope.gestionSistema.idArticulo ===0){
            toastr.warning('Seleccione el Artículo');
            return
        }
        const {MODAL_CTRL, MODAL_NUEVO_CSHTML} = _nombreModal.articulo
        const {ModalArticuloCtrl} = await import('./../../modal/' + MODAL_CTRL);
        
        const modalDialogRef = _modalSvc.openModalCustom({
            controller: ModalArticuloCtrl,
            template: 'Articulo/' + MODAL_NUEVO_CSHTML,
            size: 'xl',
            params: { 
                idArticulo: $scope.gestionSistema.idArticulo
            }
        })        
    }

    
    //------------------------------------CONFIGURACION DE SISTEMA---------------
    $scope.updateConfigSistema= async()=>{            
        if(!$scope.gestionSistema.taxesDefault || $scope.gestionSistema.idTipoIva<0){
            toastr.warning("El Tipo IVA es requerido");
            return
        }
        if($scope.gestionSistema.taxesDefault && !$scope.gestionSistema.idTipoIva){
            toastr.warning('Seleccione el Tipo IVA');
            return
        }

        console.log()
       
        // if($scope.gestionSistema.llevaInventario && !($scope.gestionSistema.idMetodoValoracion>0)){
        //     toastr.warning('Seleccione el Método de Valoración');
        //     return
        // }else if(!$scope.gestionSistema.llevaInventario){
        //     $scope.gestionSistema.idMetodoValoracion = 0;
        // }
        

        if($scope.gestionSistema.llevaInventario &&  $("#metodoValoracion").val()==="null"){
            toastr.warning('Seleccione el Método de Valoración');
            return
        }


        if($scope.gestionSistema.customerDefault && (!$scope.gestionSistema.idCliente|| $scope.gestionSistema.idCliente==0)){
            toastr.warning('Seleccione el Cliente');
            return
        }else if(!$scope.gestionSistema.customerDefault){
            $scope.gestionSistema.idCliente = 0;
        }

        if($scope.gestionSistema.articleDefault && (!$scope.gestionSistema.idArticulo || $scope.gestionSistema.idArticulo===0)){
            toastr.warning('Seleccione el Artículo');
            return
        }else if(!$scope.gestionSistema.articleDefault){
            $scope.gestionSistema.idArticulo = 0;
        }

       
    
        Swal.fire({
            icon:'warning',
            html:`<small>Desea Actualizar la Configuración del Sistema?</small>`,
            showConfirmButton: true,
            confirmButtonText:'Si, actualizar',
            showCancelButton:true,
            cancelButtonText:'No, cancelar',
            allowOutsideClick: false
        }).then(result=>{
            if(result.isConfirmed){

                let data = Object.assign({}, $scope.gestionSistema);
                
                data.llevaInventario = data.llevaInventario?'SI':'NO';
                data.searchCode = data.searchCode? 1: 0;       
                data.printerAutomatic = data.printerAutomatic? 1: 0;  
                data.payAutomatic  = data.payAutomatic? 1: 0;

                data.idMetodoValoracion = $scope.gestionSistema.llevaInventario? parseInt($("#metodoValoracion").val()): 0
                
                _mS.getData('put', '/GestionSistema/Put?id=' + $scope.gestionSistema.idGestionSistema, data).then(response =>{
                    if(response.code=="0"){
                        toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})                    
                    }
                    if(response.code==="1"){
                        $scope.initiload();
                    
                        toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
                    }

                })      
            }

        })       
    }
    


    //---------------------------------------CONFIGURACIÓN DE DECIMALES------------------------------------
    $scope.updateModuloDecimal = async()=>{
        let {isConfirmed} = await Swal.fire({
            icon:'warning',
            html:`<small>Desea Actualizar los decimales generales ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText:'Si, actualizar',
            showCancelButton:true,
            cancelButtonText:'No, cancelar',
            allowOutsideClick: false
        })

        if(isConfirmed){
            const moduloDecimales = [$scope.decimalAlmacen, $scope.decimalCompra, $scope.decimalVenta];
            const response = await _mS.getData('put','/CantidadDecimal/Update?json=' + JSON.stringify(moduloDecimales))                                          
            if(response.id==='0'){
                toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
            }
            if(response.id==='1'){
                $scope.initiload();
                toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
            }           
        }
    }
    

    
    //---------------------------------------CONFIGURACIÓN DE MOSTRAR COLUMNAS EN DETALLE VENTA ------------------------------------
    $scope.updateConfigShowDetalle= async()=>{
        const response = await _mS.getData('put', '/ConfigVentaDetalle/Put?json=' + JSON.stringify($scope.configDetalle));

        console.log(response);
        if (response.code == "0") {
            toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
            return
        }
        if (response.code == "1") {
            $scope.initiload();                
            toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
        }
    }



    $scope.updateNotificacion = async()=>{
        let response = await _mS.getData('put', '/NotificacionEntidad/Update?json=' + JSON.stringify($scope.entidadNotificaciones));       
        if(response.id==='0'){
            toastr.warning(response.message, response.titleSms, {positionClass: 'toast-bottom-center'})
        }
        if(response.id==='1'){
            $scope.initiload();
            toastr.success(response.message, response.titleSms, {positionClass: 'toast-bottom-center'});
        }
    }






}

