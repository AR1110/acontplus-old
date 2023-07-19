(function() {

    'use strict'

    app.controller('articuloCtrl', articuloCtrl)

    articuloCtrl.$inject = ['$scope', 'mainService', 'articuloService', 'modalService', 'nombreModal', 'toastService', 'formulario'];


    function articuloCtrl($scope, mS, articuloSvc, modalSvc, nombreModalConst, tS, form) {

        // let accion = JSON.parse(localStorage.getItem("accion"));

        // if (accion === null) {
        //     location.href = "/Home/Index";
        // } else {
        //     $scope.accion = accion[0];
        // }

        const {
            MODAL_CTRL,
            MODAL_NUEVO,
            MODAL_FILTRO,
            MODAL_ARTICULO_IMPUESTO,
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
            byStock: 0,
        };


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


        /**
         * 
         */
        $scope.openModalFiltro = async () => {
            try {
                let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_FILTRO['controller']]
                let template = MODAL_FILTRO['template'];

                let modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    size: 'lg',
                    params: $scope.dataSearch
                })

                modalRef.result.then(result => {
                    $scope.dataSearch = Object.assign($scope.dataSearch, result);
                    if (result.isSearch) {
                        $scope.getArticulos();
                    }
                })
            } catch (error) {

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
                    checkBoxFraccionado: $scope.dataSearch.checkBoxFraccionado,
                    checkBoxStock: $scope.dataSearch.checkBoxStock,
                    checkBoxSubFamilia: $scope.dataSearch.checkBoxSubFamilia,
                    checkBoxTipoIva: $scope.dataSearch.checkBoxTipoIva,
                    checkBoxInventario: $scope.dataSearch.checkBoxInventario,
                    bySubFamilia: $scope.dataSearch.bySubFamilia,
                    byTipoIva: $scope.dataSearch.byTipoIva,
                    byStock: $scope.dataSearch.byStock,                    
                    checkBoxStatus: ['0', '1'].includes($scope.dataSearch.status),
                    status: $scope.dataSearch.status
                  };
    

                articuloSvc.getAll(dataSearch).then(response=>{
                    hideLoader();
                    let {totalRecords, articulos} = response;
                    $scope.articulos = articulos;
                    $scope.dataSearch.totalRecords = totalRecords;
                    
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

                mS.getData('get', '/Articulo/GetId?id=' + item.idArticulo).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        console.log(response)
                    }
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload) || {};

                        item.view = mainData[0][0];

                        if (item.view.caducidad) {

                            item.view.fechaCaducidad = new Date(a.view.fechaCaducidad)

                        } else {
                            item.view.fechaCaducidad = null;
                        }

                        if (item.view.datosLote) {
                            item.view.fechaCreacion = new Date(a.view.fechaCreacion);
                            item.view.fechaCaducidadLote = new Date(a.view.fechaCaducidadLote)
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

        $scope.showBodegas = (item) => {
            mS.getData('get', '/Articulo/GetId?id=' + item.idArticulo).then(response => {
                const results = JSON.parse(response.payload) || [];
                $scope.branchs = results[4].map(val => {
                    val.warehouses = JSON.parse(val.warehouses)
                    return val;
                })
            })
        }


        $scope.askToDelete = (item) => {
            Swal.fire({
                icon: 'warning',
                html: `<small>Está seguro de elimiar este Artículo: <strong>${item.descripcion}</strong> ahora</small>`,
                confirmButtonText: 'Sí, eliminar',
                showDenyButton: true,
                denyButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) {
                    try {
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
                        )
                    } catch (error) {
                        hideLoader()
                        console.log(error);
                    }
                }
            })
        }


        //---------------------------------------------Articulo Impuesto --------------------------

        $scope.abrirModalImpuestoArticulo = async (params) => {
            try {
                let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_ARTICULO_IMPUESTO['controller']]
                let template = MODAL_ARTICULO_IMPUESTO['template']

                let modalParams = {
                    controller,
                    template,
                    size: 'xl',
                    reload: false,
                    params
                }
                $scope.openModal(modalParams)
            } catch (error) {
                console.log(error);
            }
        }



        $scope.openModalKardex = async (item) => {
            try {
                const articulo = {
                    idArticulo: item.idArticulo,
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                }

                const {
                    MODAL_CTRL,
                    MODAL_CSHTML
                } = nombreModalConst.kardex;
                const {
                    ModalKardexCtrl
                } = await import('./../../modal/' + MODAL_CTRL);
                modalSvc.openModalCustom({
                    controller: ModalKardexCtrl,
                    template: MODAL_CSHTML,
                    size: 'xl',
                    params: articulo,
                    windowClass: 'uibModalFullScreen',
                    isRenderRazorPartial: true
                })
            } catch (error) {
                console.log(error)
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

 












// }