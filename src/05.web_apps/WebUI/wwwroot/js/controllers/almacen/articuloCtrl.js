

app.controller('articuloCtrl', articuloCtrl);

articuloCtrl.$inject = ['$scope', 'mainService', 'modalService', 'nombreModal', 'toastService', 'formulario'];

function articuloCtrl($scope, _mS, _modalSvc, _nombreModal, toast, form) {
    'use strict';

    let accion = JSON.parse(localStorage.getItem("accion"));
    if (accion === null) {
        location.href = "/Home/Index";
    } else {
        $scope.accion = accion[0];
    }

    $scope.articulos = [];
    $scope.dataSearch = {        
        tipo: 1,
        bySearch : '',
        pageIndex: 1,
        pageSize: 20
    }
    $scope.totalRecords = 0;

     //--------------------------------Depurando modal registrar articulo ---
     $scope.openModalArticulo = async(item)=>{
        let obj = null;
        if(typeof item==='object'){
            obj = item
        }
        const {MODAL_CTRL, MODAL_NUEVO_CSHTML} = _nombreModal.articulo;
        const {ModalArticuloCtrl} = await import('./../../modal/' + MODAL_CTRL);
        
        const modalDialogRef = _modalSvc.openModalCustom({
            controller: ModalArticuloCtrl,
            template: 'Articulo/' + MODAL_NUEVO_CSHTML,
            size:'xl',
            params: obj
        })
        
        modalDialogRef.result.then(result=>{
            if(typeof result==='object'){
                $scope.searchArticulo();
            }
        })          
    }

    //Busqueda de ARticulo 
    $scope.searchArticulo = function () {
        $scope.articulos = [];        
        _mS.getData('get', '/Articulo/Get?json=' + JSON.stringify($scope.dataSearch)).then(
            response=>{
                $scope.articulos = JSON.parse(response.data) || []
                $scope.totalRecords = $scope.articulos.length>0? $scope.articulos[0].totalRecords: 0;            
            }
        )     
    }
    $scope.searchArticulo();
    
    
    $scope.openModalFiltro = async()=>{
        const {MODAL_CTRL, MODAL_FILTRO_CSHTML} = _nombreModal.articulo;
        const {ModalFiltroCtrl} = await import('./../../modal/' + MODAL_CTRL);
        
        const modalDialogRef = _modalSvc.openModalCustom({
            controller: ModalFiltroCtrl,
            template: 'Articulo/' + MODAL_FILTRO_CSHTML,
            size:'lg',
            params: $scope.dataSearch
        })
                
        modalDialogRef.result.then(result=>{
            $scope.dataSearch = Object.assign($scope.dataSearch, result);            
            if(result.isSearch){
                $scope.searchArticulo();           
            }
        })                
    }
    
    function success(response) {
        $scope.articulos = response.data;
        $scope.totalRecords = $scope.articulos[0].totalRecords;
        hideLoader();
    }

    $scope.getArticulos = function () {
        showLoader();
        $scope.promise = _mS.getData('get', '/Articulo/Get?json=' + JSON.stringify($scope.query)).then(success).$promise;
    }

    $scope.expandDetalle = function (a) {
        a.expanded = !a.expanded;
        _mS.getData('get','/Articulo/GetId?id=' + a.idArticulo).then(
            response=>{
                const results = JSON.parse(response.payload);                
                a.view = results[0][0]
                if (a.view.caducidad) {
                    a.view.fechaCaducidad = new Date(a.view.fechaCaducidad)
                } else {
                    a.view.fechaCaducidad = null;
                }

                if (a.view.datosLote) {
                    a.view.fechaCreacion      = new Date(a.view.fechaCreacion);
                    a.view.fechaCaducidadLote = new Date(a.view.fechaCaducidadLote)
                } else {
                    a.view.fechaCreacion = null;
                    a.view.fechaCaducidadLote = null
                }  
                a.tarifas = results[1]

            }
        )       
    }

    $scope.eliminarArticulo = async(item)=>{        
        let {isConfirmed} = await Swal.fire({
            icon:'warning',
            html:`<small>Está seguro de elimiar este Artículo: <strong>${item.descripcion}</strong> ahora</small>`,
            confirmButtonText:'Sí, eliminar',
            showDenyButton:true,
            denyButtonText:'No, cancelar',   
            allowOutsideClick:false         
        })
               
        if(isConfirmed){            
            _mS.getData('get', `/Articulo/Delete?idArticulo=${item.idArticulo}`).then(
                response=>{
                    if(response.id==="0"){
                        form.sweetAlert('warning', response.message, response.titleSms);                    
                    }
                    if(response.id==="1"){
                        $scope.searchArticulo();
                        form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                    }

                }
            )            
        }

    }





    //---------------------------------------------Articulo Impuesto --------------------------
    
    $scope.abrirModalImpuestoArticulo = async(data)=> {
        const {MODAL_CTRL, MODAL_ARTICULO_IMPUESTO_CSHTML} = _nombreModal.articulo
        const {ModalArticuloImpuestoCtrl} = await import('./../../modal/' + MODAL_CTRL);
        _modalSvc.openModalCustom({
            controller: ModalArticuloImpuestoCtrl,
            template: MODAL_ARTICULO_IMPUESTO_CSHTML,
            size:'xl',
            params: data
        })        
    }

    $scope.openModalKardex = async(item)=>{
        const articulo = {
            idArticulo: item.idArticulo,
            codigo: item.codigo,
            descripcion: item.descripcion,
        }

        const {kardex} = _nombreModal;
        const {ModalKardexCtrl} = await import('./../../modal/'+kardex.MODAL_CTRL);
        _modalSvc.openModalCustom({
            controller: ModalKardexCtrl,
            template: `Kardex/${kardex.MODAL_CSHTML}`,
            size: 'xl',
            params: articulo,
            windowClass:'uibModalFullScreen'
        })              
    }


    //-------------------------------Gestión de Imagenes -------------------------------
    $scope.openModalArticuloImagen = async(item)=> {         
        const {MODAL_CTRL, MODAL_ARTICULO_IMAGEN_CSHTML} = _nombreModal.articulo
        const {ModalArticuloImagenCtrl} = await import('./../../modal/'+ MODAL_CTRL);

        const modalRef = _modalSvc.openModalCustom({
            controller: ModalArticuloImagenCtrl,
            template: `Articulo/${MODAL_ARTICULO_IMAGEN_CSHTML}`,
            size: 'lg',
            params: item
        })         
        modalRef.result.then(
            response=>{
                if(typeof response ==='object'){
                    $scope.searchArticulo();
                }
            }
        )                   
    }    


    //Presentacion del imagen 
    $scope.openModalImagen = async(item)=> {
        const {MODAL_CTRL, MODAL_IMAGEN_DETALLE_CSHTML} = _nombreModal.articulo;
        const {ModalArticuloImagenDetalleCtrl} = await import('./../../modal/'+ MODAL_CTRL);
        _modalSvc.openModalCustom({
            controller: ModalArticuloImagenDetalleCtrl,
            template: `Articulo/${MODAL_IMAGEN_DETALLE_CSHTML}`,
            size:'xl',
            params: item
        })                     
    }

    $scope.updateStockArticle = async(item)=>{
        let {isConfirmed} = await Swal.fire({
            icon:'warning',
            html:`<small>Está seguro de actualizar el Stock del articulo: <b>${item.descripcion}</b></small>`,
            confirmButtonText:'Sí, actualizar',
            showDenyButton:true,
            denyButtonText:'No, cancelar',
            allowOutsideClick:false
        })

        if(isConfirmed){
            _mS.getData('get','/ControlStock/Update?id=' + item.idArticulo).then(
                response=>{
                    if(response.id==='0'){
                        form.sweetAlert('warning', response.message, response.titleSms);                    
                    }
                    if(response.id==='1'){
                        $scope.searchArticulo();
                        form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                    }
                }
            )                        
        }
    }





    


}


