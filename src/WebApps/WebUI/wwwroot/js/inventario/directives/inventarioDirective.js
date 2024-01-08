(function () {

    'use strict';

    app.directive('btnArticleAddUpdate', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
                    let ctrl = (await import(fileCtrl))[controllers['M']];
                    let template = templates['M'];
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params: scope.params || {},
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                });
            }
        }
    })

    app.directive('btnArticuloGeneral', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
                    let ctrl = (await import(fileCtrl))[controllers['LG']];
                    let template = templates['LG'];
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params: scope.params,
                        windowClass: 'uibModalFullScreen'
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                item: result
                            })
                        }
                    })
                });
            }
        }
    })



    //Se usa en familia, articulo 
    app.directive('btnAddUpdateFamilia', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                results: '&'
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    const { fileCtrl, controller, template } = nombreModalInventario.FAMILIA;
                    let ctrl = (await import(fileCtrl))[controller];

                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'md',
                        params: scope.params,
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.results({
                                item: result
                            })
                        }
                    })
                });
            }
        }
    })


    //Se usa en sub-familia, articulo 
    app.directive('btnAddUpdateSubFamilia', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                results: '&'
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    const { fileCtrl, controller, template } = nombreModalInventario.SUBFAMILIA;
                    let ctrl = (await import(fileCtrl))[controller];

                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'md',
                        isRenderRazorPartial: true,
                        params: scope.params || {},
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.results({
                                item: result
                            })
                        }
                    })
                });
            }
        }
    })


    //Se usa en medida, articulo 
    app.directive('btnAddUpdateMedida', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                results: '&'
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    const { fileCtrl, controller, template } = nombreModalInventario.MEDIDA;
                    let ctrl = (await import(fileCtrl))[controller];

                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'md',
                        params: scope.params || {},
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.results({
                                item: result
                            })
                        }
                    })
                });
            }
        }
    })

    //Se usa en marca, articulo, modelo
    app.directive('btnAddUpdateMarca', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                results: '&'
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    const { fileCtrl, controller, template } = nombreModalInventario.MARCA;
                    let ctrl = (await import(fileCtrl))[controller];


                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'md',
                        params: scope.params || {},
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.results({
                                item: result
                            })
                        }
                    })
                });
            }
        }
    })


    //Se usa en modelo, articulo 
    app.directive('btnAddUpdateModelo', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                results: '&'
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    const { fileCtrl, controller, template } = nombreModalInventario.MODELO;
                    let ctrl = (await import(fileCtrl))[controller];

                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'md',
                        params: scope.params || {}
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.results({
                                item: result
                            })
                        }
                    })
                });
            }
        }
    })



    //............................Inventario-------------------------------------------------
    //permiso para ver kardex en documentos de ventas 
    app.directive('viewKardex', function ($rootScope, modalService, nombreModalInventario) {
        return {
            scope: {
                params: "=",
                btnTitle: "=",
                sizeBtn: "="
            },
            template: ' <a style="cursor:pointer;" ng-if="kardex.view" class= "btn btn-info btn-xs text-white" title="Ver Kardex de Artículo"> <i class="mdi mdi-timetable"></i></a >',
            link: function (scope, element) {
                let {
                    ventaPermiso
                } = $rootScope.usuarioPermiso;

                scope.kardex = ventaPermiso.additional.kardex;

                element.on('click', async function () {

                    let { fileCtrl, controllers, templates } = nombreModalInventario.KARDEX;
                    let ctrl = (await import(fileCtrl))[controllers['M']];
                    let template = templates['M']

                    const params = {
                        idArticulo: scope.params.idArticulo,
                        codigo: scope.params.codigo,
                        descripcion: scope.params.descripcion,
                    }

                    modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params,
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })

                })
            }
        };
    })


    app.directive('viewKardexBtn', function (modalService, nombreModalInventario) {
        return {
            scope: {
                params: "=",
                btnTitle: "=",
                sizeBtn: "="
            },
            link: function (scope, element) {

                element.on('click', async function () {


                    let { fileCtrl, controllers, templates } = nombreModalInventario.KARDEX;
                    let ctrl = (await import(fileCtrl))[controllers['M']];
                    let template = templates['M']


                    const params = {
                        idArticulo: scope.params.idArticulo,
                        codigo: scope.params.codigo,
                        descripcion: scope.params.descripcion,
                    }


                    modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params,
                        windowClass: 'uibModalFullScreen',
                        isRenderRazorPartial: true
                    })

                })
            }
        };
    })


    app.directive('btnArticuloHistorialCompra', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
                    let ctrl = (await import(fileCtrl))[controllers['HC']];
                    let template = templates['HC'];
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'xl',
                        params: scope.params || {},
                        isRenderRazorPartial: true
                    })

                    modalDialogRef.result.then(result => {
                        if (typeof result === "object") {
                            scope.resultModal({
                                result
                            })
                        }
                    })
                });
            }
        }
    })



})(window.angular)