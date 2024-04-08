(function () {

    'use strict'

    app.controller('articuloCtrl', articuloCtrl)

    articuloCtrl.$inject = [
        '$scope',
        'mainService',
        'articuloService',
        'productPhotoService',
        'modalService', 
        'nombreModalInventario',
        'formulario'
    ];


    function articuloCtrl($scope, mS, articuloSvc, productPhotoSvc, modalSvc, nombreModalInventario, form) {
        const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO

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

        $scope.resultModal = (result) => {
            if (typeof result === 'object') {
                $scope.getArticulos();
            }
        }


        $scope.searchArticulo = () => {
            $scope.articulos = [];
            $scope.getArticulos();
        }


        function validParam(campo) {
            return [""].includes(campo) ? null : campo
        }

        $scope.getArticulos = () => {
            try {

                $scope.articulos = [];

                const dataSearch = {
                    tipo: 1,
                    bySearch: $scope.dataSearch.bySearch,
                    pageIndex: $scope.dataSearch.pageIndex,
                    pageSize: $scope.dataSearch.pageSize,
                    bySubFamilia: validParam($scope.dataSearch.idSubFamilia),
                    byMedida: validParam($scope.dataSearch.idMedida),
                    byMarca: validParam($scope.dataSearch.idMarca),
                    idModelo: validParam($scope.dataSearch.idModelo),
                    byTipoIva: validParam($scope.dataSearch.idTipoIva),
                    status: validParam($scope.dataSearch.status),
                    byStock: validParam($scope.dataSearch.byStock),

                    checkBoxFraccionado: $scope.dataSearch.checkBoxFraccionado,
                    checkBoxInventario: $scope.dataSearch.checkBoxInventario,
                }

                showLoader();
                articuloSvc.getAll(dataSearch).then(response => {
                    hideLoader();
                    let {
                        totalRecords,
                        articulos,
                    } = response;
                    $scope.articulos = articulos;
                    $scope.dataSearch.totalRecords = totalRecords;
                }).catch(error => {
                    $scope.dataSearch.totalRecords = 0;
                    console.log(error);
                }).finally(() => hideLoader())
            } catch (error) {
                $scope.dataSearch.totalRecords = 0;
                hideLoader();
                console.log(error);
            }
        }

        initiload();
        function initiload() {
            articuloSvc.getDataFilter().then(response => {
                let {
                    subFamilias,
                    medidas,
                    marcas,
                    modelos,
                    tiposIva
                } = response;
                //Data Filters 
                $scope.subFamilias = subFamilias;
                $scope.medidas = medidas;
                $scope.marcas = marcas;
                $scope.modelos = modelos;
                $scope.tiposIva = tiposIva;
            })
            $scope.getArticulos();
        }


        $scope.pagechanged = function () {
            $scope.getArticulos();
        };

        $scope.changePageSize = function () {
            $scope.dataSearch.pageIndex = 1;
            $scope.getArticulos();
        };

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

                articuloSvc.findById(item.idArticulo).then(response => {
                    item.view = response.data;
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
                    item.tarifas = response.articuloTarifas;
                }).catch(error => {
                    item.view = {}
                    console.log(error)
                }).finally(() => hideLoader())

            } catch (error) {
                item.view = {}
                console.log(error);
                hideLoader()
            }
        }


        $scope.askToDelete = async (item) => {
            try {
                let { isConfirmed } = await Swal.fire({
                    icon: 'warning',
                    html: `<small>Está seguro de elimiar este Artículo: <strong>${item.descripcion}</strong> ahora</small>`,
                    confirmButtonText: 'Sí, eliminar',
                    showDenyButton: true,
                    denyButtonText: 'No, cancelar',
                    allowOutsideClick: false
                })

                if (isConfirmed) {
                    showLoader();
                    articuloSvc.delete(item.idArticulo).then(
                        response => {
                            if (response.code === "0") { 
                                form.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.code === "1") {
                                hideLoader();
                                $scope.getArticulos();
                                form.sweetAlert('success', response.message, response.titleSms, 1000);
                            }

                        }
                    ).catch(error => { 
                        console.log(error);
                    }).finally(()=>hideLoader())
                }
            } catch (error) {
                hideLoader()
                console.log(error);
            }

        }


        //-------------------------------Gestión de Imagenes -------------------------------
        $scope.openModalArticuloImagen = async (params) => {
            try {
                let controller = (await import(fileCtrl))[controllers["MAI"]];
                let template = templates["MAI"];
                let modalParams = {
                    controller,
                    template,
                    size: 'lg',
                    params,
                    reload: true,
                    isRenderRazorPartial: true,
                }
                modalSvc.openModalCustom(modalParams)
            } catch (error) {
                console.log(error)
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
                mS.getData('put', 'Inventario/Stock/' + item.idArticulo, null, true).then(
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


        $scope.previewImg = function(item){
            productPhotoSvc.previewImg(item.idArticulo)
        }
    }
})(window.angular) 