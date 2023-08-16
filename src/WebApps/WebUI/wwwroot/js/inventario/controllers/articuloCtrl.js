(function() {

    'use strict'

    app.controller('articuloCtrl', articuloCtrl)

    articuloCtrl.$inject = ['$scope', 'mainService', 'articuloService', 'modalService', 'nombreModal', 'formulario'];


    function articuloCtrl($scope, mS, articuloSvc, modalSvc, nombreModalConst, form) { 
 
        const {
            MODAL_CTRL,
            MODAL_NUEVO,  
            MODAL_ARTICULO_IMAGEN,
            MODAL_IMAGEN_DETALLE
        } = nombreModalConst.articulo;

        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            tipo: 1,
            pageSize: 50,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
            busqueda: "", 
            status: 1
        };

        $scope.subFamilias = []
        $scope.medidas = [];
        $scope.marcas = [];
        $scope.modelos = [];
        $scope.tiposIva = [];

        $scope.articulos = [];


        //Nuevo Articulo
        $scope.openModalNew = async () => {
            try {

                let modalParams = {
                    controller: (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']],
                    template: MODAL_NUEVO['template'],
                    reload: true,
                    params: null
                }

                $scope.openModal(modalParams);
            } catch (error) {
                console.log(error);
            }
        } 

        $scope.searchArticulo = () => {
            $scope.articulos = [];

            $scope.getArticulos();
        }



        $scope.getArticulos = () => {
            try {
                showLoader();
                $scope.articulos = [];

                const dataSearch = {
                    tipo: 1, 
                    bySearch: $scope.dataSearch.bySearch,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize, 

                    checkBoxSubFamilia: $scope.dataSearch.idSubFamilia > 0,
                    bySubFamilia: $scope.dataSearch.idSubFamilia,

                    checkBoxMedida: $scope.dataSearch.idMedida > 0,                    
                    byMedida: $scope.dataSearch.idMedida,

                    checkBoxMarca: $scope.dataSearch.idMarca > 0,
                    byMarca: $scope.dataSearch.idMarca,

                    checkBoxModelo: $scope.dataSearch.idModelo > 0,
                    idModelo: $scope.dataSearch.idModelo,

                    checkBoxTipoIva: $scope.dataSearch.idTipoIva > 0,
                    byTipoIva: $scope.dataSearch.idTipoIva,

                    checkBoxStatus: [0, 1].includes($scope.dataSearch.status),
                    status: $scope.dataSearch.status,

                    checkBoxStock: [1, 2].includes( $scope.dataSearch.byStock),
                    byStock: $scope.dataSearch.byStock,                    

                    checkBoxFraccionado: $scope.dataSearch.checkBoxFraccionado,
                    checkBoxInventario: $scope.dataSearch.checkBoxInventario,
                  };
    

                articuloSvc.getAll(dataSearch).then(response=>{
                    hideLoader();
                    let {
                        totalRecords, 
                        articulos, 
                        subFamilias,  
                        medidas,  
                        marcas,
                        modelos,
                        tiposIva
                    } = response;

                    $scope.articulos = articulos;
                    $scope.dataSearch.totalRecords = totalRecords;

                    //Data Filters 
                    $scope.subFamilias = subFamilias;
                    $scope.medidas = medidas;
                    $scope.marcas = marcas;
                    $scope.modelos = modelos;
                    $scope.tiposIva = tiposIva;

                }).catch(error=>{
                    hideLoader();
                    $scope.dataSearch.totalRecords = 0;
                    console.log(error);
                })              
            } catch (error) {
                $scope.dataSearch.totalRecords = 0;
                hideLoader();                
                console.log(error);
            }
        }

        $scope.getArticulos();

        $scope.pagechanged = function () {
            $scope.getArticulos();
          };
        
          $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getArticulos();
          };


        $scope.openModalEditar = async (params) => {
            try {
                let modalParams = {
                    controller: (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']],
                    template: MODAL_NUEVO['template'],
                    reload: true,
                    params
                }

                $scope.openModal(modalParams);
            } catch (error) {
                console.log(error)
            }
        }



        $scope.openModal = ({
            controller,
            template,
            size = 'xl',
            params,
            reload = false
        }) => {
            try {

                const modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    size,
                    params
                })

                modalRef.result.then(result => {
                    if (typeof result === 'object' && reload) {
                        $scope.getArticulos();
                    }
                })


            } catch (error) {
                console.log(error);
            }
        }


        $scope.expandDetalle = (item) => {
            try {
                showLoader();
                item.expanded = !item.expanded;
                item.view = {};

                articuloSvc.getId(item.idArticulo).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        console.log(response)
                    }
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload) || {};

                        item.view = mainData[0][0];

                        if (item.view.caducidad) {

                            item.view.fechaCaducidad = new Date(item.view.fechaCaducidad)

                        } else {
                            item.view.fechaCaducidad = null;
                        }

                        if (item.view.datosLote) {
                            item.view.fechaCreacion = new Date(item.view.fechaCreacion);
                            item.view.fechaCaducidadLote = new Date(item.view.fechaCaducidadLote)
                        } else {
                            item.view.fechaCreacion = null;
                            item.view.fechaCaducidadLote = null
                        }
                        item.tarifas = mainData[1]
                        hideLoader();
                    }
                }).catch(error => {
                    hideLoader()
                    item.view = {}
                    console.log(error)
                })

            } catch (error) {
                item.view = {}
                console.log(error);
                hideLoader()
            }
        } 


        $scope.askToDelete = async (item) => {
            try {
                let {isConfirmed} = await Swal.fire({
                    icon: 'warning',
                    html: `<small>Está seguro de elimiar este Artículo: <strong>${item.descripcion}</strong> ahora</small>`,
                    confirmButtonText: 'Sí, eliminar',
                    showDenyButton: true,
                    denyButtonText: 'No, cancelar',
                    allowOutsideClick: false
                })
                
                if (isConfirmed) {                
                    showLoader();
                    mS.getData('get', `/Articulo/Delete?idArticulo=${item.idArticulo}`).then(
                        response => {
                            if (response.code === "0" || response.id === "0") {
                                hideLoader();
                                form.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.code === "1" || response.id === "1") {
                                hideLoader();
                                $scope.getArticulos();
                                form.sweetAlert('success', response.message, response.titleSms, 1000);
                            }

                        }
                    ).catch(error => {
                        hideLoader()
                        console.log(error);                        
                    })
                }
            } catch (error) {
                hideLoader()
                console.log(error);
            }
            
        }  


        //-------------------------------Gestión de Imagenes -------------------------------
        $scope.openModalArticuloImagen = async (params) => {
            try {
                let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_ARTICULO_IMAGEN['controller']];
                let template = MODAL_ARTICULO_IMAGEN['template']
                let modalParams = {
                    controller,
                    template,
                    size: 'lg',
                    params,
                    reload: true
                }
                $scope.openModal(modalParams)
            } catch (error) {
                console.log(error)
            }
        }


        //     //Presentacion del imagen 
        $scope.openModalImagen = async (params) => {
            try {
                let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_IMAGEN_DETALLE['controller']];
                let template = MODAL_IMAGEN_DETALLE['template'];
                let modalParams = {
                    controller,
                    template,
                    size: 'xl',
                    params,
                    reload: false
                }
                $scope.openModal(modalParams)
            } catch (error) {
                console.log(error);
            }
        }

        $scope.updateStockArticle = async (item) => {
            let {
                isConfirmed
            } = await Swal.fire({
                icon: 'warning',
                html: `<small>Está seguro de actualizar el Stock del articulo: <b>${item.descripcion}</b></small>`,
                confirmButtonText: 'Sí, actualizar',
                showDenyButton: true,
                denyButtonText: 'No, cancelar',
                allowOutsideClick: false
            })

            if (isConfirmed) {
                mS.getData('get', '/ControlStock/Update?id=' + item.idArticulo).then(
                    response => {
                        if (response.id === '0' || response.code === '0') {
                            form.sweetAlert('warning', response.message, response.titleSms);
                        }
                        if (response.id === '1' || response.code === '1') {
                            $scope.getArticulos();
                            form.sweetAlert('success', response.message, response.titleSms, 1000);
                        }
                    }
                )
            }
        }



        $scope.openModalHistorialCompra = async (item) => {
            try {
                let {
                    MODAL_FILE_CTRL,
                    MODAL_HISTORIAL_COMPRA
                } = nombreModalConst.doc_recibido;
                let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_HISTORIAL_COMPRA['controller']];
                let template = MODAL_HISTORIAL_COMPRA['template'];

                modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'xl',
                    params: item,
                    isRenderRazorPartial: true
                })
            } catch (error) {
                console.log(error);
            }
        }






    }


})(window.angular) 