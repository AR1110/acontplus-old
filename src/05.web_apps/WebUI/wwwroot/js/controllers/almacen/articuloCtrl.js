(()=>{
    
    'use strict'

    app.controller('articuloCtrl', articuloCtrl)

    articuloCtrl.$inject = ['$scope', 'mainService', 'modalService', 'nombreModal', 'toastService', 'formulario'];


    function articuloCtrl($scope, mS, modalSvc, nombreModalConst, tS, form){        
       
        let accion = JSON.parse(localStorage.getItem("accion"));

        if (accion === null) {
            location.href = "/Home/Index";
        } else {
            $scope.accion = accion[0];
        }

        const {
            MODAL_CTRL, 
            MODAL_NUEVO, 
            MODAL_FILTRO, 
            MODAL_ARTICULO_IMAGEN,
            MODAL_IMAGEN_DETALLE
        } = nombreModalConst.articulo;

        $scope.dataSearch = {
            tipo: 1,
            bySearch : '',
            pageIndex: 1,
            pageSize: 20            
        };

        $scope.articulos = [];


        //Nuevo Articulo
        $scope.openModalNew = async()=>{
            try {

                let modalParams = {
                    controller: (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']],
                    template: MODAL_NUEVO['template'],                    
                    reload: true,
                    params: null                                                           
                }
                console.log(modalParams)
                $scope.openModal(modalParams);                                  
            } catch (error) {
                console.log(error);
            }
        }


        /**
         * 
         */
        $scope.openModalFiltro = async()=>{
            try {                
                let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_FILTRO['controller']]
                let template   = MODAL_FILTRO['template'];

                let modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    size:'lg',
                    params: $scope.dataSearch
                })
                        
                modalRef.result.then(result=>{
                    $scope.dataSearch = Object.assign($scope.dataSearch, result);            
                    if(result.isSearch){
                        $scope.getArticulos();           
                    }
                }) 
            } catch (error) {
                
            }
        }



        $scope.getArticulos = ()=>{
            try {
                showLoader();
                mS.getData('get', '/Articulo/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                    if(response.code==="0"){
                        hideLoader();
                        $scope.articulos = [];
                        console.log(response)                        
                    }
                    if(response.code==="1"){
                        $scope.articulos = JSON.parse(response.payload) || [];
                        hideLoader();
                    }
                })
            } catch (error) {
                hideLoader();
                $scope.articulos=[]
                console.log(error);
            }
        }

        $scope.getArticulos();


        $scope.openModal = ({controller, template, size='xl', params, reload=false})=>{
            try {
                
                const modalRef = modalSvc.openModalCustom({controller, template, size, params})

                modalRef.result.then(result=>{
                    if(typeof result==='object' && reload) {
                        $scope.getArticulos();
                    }
                })


            } catch (error) {
                console.log(error);
            }
        }


        $scope.getArticulos = ()=>{

        }


        $scope.expandDetalle = (item)=>{
            try {
                showLoader();
                item.expanded = !item.expanded;
                item.view = {};

                mS.getData('get', '/Articulo/GetId?id=' + item.idArticulo).then(response=>{
                    if(response.code ==="0"){
                        hideLoader();
                        console.log(response)
                    }
                    if(response.code ==="1"){
                        let mainData = JSON.parse(response.payload) || {};
                        
                        item.view = mainData[0][0];

                        if (item.view.caducidad) {
                            
                            item.view.fechaCaducidad = new Date(a.view.fechaCaducidad)

                        } else {
                            item.view.fechaCaducidad = null;
                        }

                        if (item.view.datosLote) {
                            item.view.fechaCreacion      = new Date(a.view.fechaCreacion);
                            item.view.fechaCaducidadLote = new Date(a.view.fechaCaducidadLote)
                        } else {
                            item.view.fechaCreacion = null;
                            item.view.fechaCaducidadLote = null
                        }  
                        item.tarifas = mainData[1]
                        hideLoader();
                    }
                }).catch(error=>{
                    hideLoader()
                    item.view ={}
                    console.log(error)
                })

            } catch (error) {
                item.view = {}
                console.log(error);
                hideLoader()
            }
        }


        $scope.askToDelete = (item)=>{
            Swal.fire({
                icon:'warning',
                html:`<small>Está seguro de elimiar este Artículo: <strong>${item.descripcion}</strong> ahora</small>`,
                confirmButtonText:'Sí, eliminar',
                showDenyButton:true,
                denyButtonText:'No, cancelar',   
                allowOutsideClick:false         
            }).then(result=>{
                if(result.isConfirmed){
                    try {
                        showLoader();
                        mS.getData('get', `/Articulo/Delete?idArticulo=${item.idArticulo}`).then(
                            response=>{
                                if(response.id==="0"){
                                    hideLoader();
                                    form.sweetAlert('warning', response.message, response.titleSms);                    
                                }
                                if(response.id==="1"){
                                    hideLoader();
                                    $scope.getArticulos();
                                    form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                                }
            
                            }
                        )
                    } catch (error) {
                        hideLoader()
                        console.log(error);
                    }
                }
            })                            
        }


        //---------------------------------------------Articulo Impuesto --------------------------

        $scope.abrirModalImpuestoArticulo = async(data)=> {
            try {                                
                let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_ARTICULO_IMAGEN['controller']]
                let template = MODAL_ARTICULO_IMAGEN['template']

                
                modalSvc.openModalCustom({
                    controller: ModalArticuloImpuestoCtrl,
                    template: MODAL_ARTICULO_IMPUESTO_CSHTML,
                    size:'xl',
                    params: data
                })
            } catch (error) {
                console.log(error);
            }        
        }


        
        $scope.openModalKardex = async(item)=>{
            try {
                const articulo = {
                    idArticulo: item.idArticulo,
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                }
    
                const {kardex} = nombreModalConst;
                const {ModalKardexCtrl} = await import('./../../modal/'+kardex.MODAL_CTRL);
                modalSvc.openModalCustom({
                    controller: ModalKardexCtrl,
                    template: `Kardex/${kardex.MODAL_CSHTML}`,
                    size: 'xl',
                    params: articulo,
                    windowClass:'uibModalFullScreen'
                })
            } catch (error) {
                console.log(error)
            }              
        }



        //-------------------------------Gestión de Imagenes -------------------------------
        $scope.openModalArticuloImagen = async(item)=> {               
            const {MODAL_CTRL, MODAL_ARTICULO_IMAGEN_CSHTML} = nombreModalConst.articulo
            const {ModalArticuloImagenCtrl} = await import('./../../modal/'+ MODAL_CTRL);

            const modalRef = modalSvc.openModalCustom({
                controller: ModalArticuloImagenCtrl,
                template: `Articulo/${MODAL_ARTICULO_IMAGEN_CSHTML}`,
                size: 'lg',
                params: item
            })         
            modalRef.result.then(
                response=>{
                    if(typeof response ==='object'){
                        $scope.getArticulos();
                    }
                }
            )                   
        } 


        //     //Presentacion del imagen 
        $scope.openModalImagen = async(item)=> {
            try {
                
            } catch (error) {
                
            }
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





        $scope.openModalHistorialCompra = async(item)=>{
            try {
                let {MODAL_FILE_CTRL, MODAL_HISTORIAL_COMPRA} = _nombreModal.doc_recibido;        
                let controller =  (await import('./../../' + MODAL_FILE_CTRL))[MODAL_HISTORIAL_COMPRA['controller']];
                let template = MODAL_HISTORIAL_COMPRA['template'];

                _modalSvc.openModalCustom({
                    controller,
                    template,
                    size:'xl',
                    params: item
                })
            } catch (error) {
                console.log(error);
            }
        }






    }


})(window.angular)


// app.controller('articuloCtrl', articuloCtrl);

// articuloCtrl.$inject = ['$scope', 'mainService', 'modalService', 'nombreModal', 'toastService', 'formulario'];

// function articuloCtrl($scope, _mS, _modalSvc, _nombreModal, toast, form) {
//     'use strict';

//     let accion = JSON.parse(localStorage.getItem("accion"));
//     if (accion === null) {
//         location.href = "/Home/Index";
//     } else {
//         $scope.accion = accion[0];
//     }

//     $scope.articulos = [];
//     $scope.dataSearch = {        
//         tipo: 1,
//         bySearch : '',
//         pageIndex: 1,
//         pageSize: 20
//     }
//     $scope.totalRecords = 0;
    
    




   





// }


