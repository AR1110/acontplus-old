(function () {

    'use strict';

    app.directive('btnDataAdicionalArticulo', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                entity: '=',
                getDataEtiqueta: '&',
                datosAdicionales: '=',
                codDoc: '='
            },
            link: function (scope, element) {

                element.on('click', async function () {
                    let cantidad = parseFloat(scope.entity.cantidad)
                    if (!Number.isInteger(cantidad)) {
                        Swal.fire({
                            title: 'Datos Adicionales',
                            icon: 'warning',
                            html: 'El valor de la cantidad del artículo tiene que ser un número entero!'
                        })
                        return
                    }

                    let { fileCtrl, controller, template } = nombreModal.compra.MODAL_DATO_ADICIONAL_ARTICULO;
                    let ctrl = (await import(fileCtrl))[controller]


                    let modalRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size: 'lg',
                        params: {
                            entity: scope.entity,
                            datosAdicionales: scope.datosAdicionales,
                            codDoc: scope.codDoc
                        },
                        isRenderRazorPartial: true
                    })

                    modalRef.result.then(function (results) {
                        if (angular.isArray(results)) {

                            //Cuando es editar 
                            if (scope.datosAdicionales.some(item => item.idArticulo === scope.entity.idArticulo)) {
                                scope.datosAdicionales = scope.datosAdicionales.filter(item => item.idArticulo !== scope.entity.idArticulo);

                                for (let item of results) {
                                    scope.datosAdicionales.push(item);
                                }

                            } else {
                                for (let item of results) {
                                    scope.datosAdicionales.push(item);
                                }
                            }

                            if (scope.codDoc === '01') {
                                scope.getDataEtiqueta({
                                    item: scope.datosAdicionales
                                })
                            }
                        }
                    })
                });
            }
        };
    })

    app.directive('btnProveedorAddUpdate', function (modalService, nombreModalCompra) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    const { fileCtrl, controllers, templates } = nombreModalCompra["PROVEEDOR"];
                    let ctrl = (await import(fileCtrl))[controllers['M']];
                    let template = templates['M'];
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

    app.directive('btnProveedorLista', function (modalService, nombreModalCompra) {
        return {
            restrict: 'A',
            scope: {
                params: '=',
                resultModal: '&',
            },
            link: function (scope, element) {
                element.on('click', async function () {

                    const { fileCtrl, controllers, templates } = nombreModalCompra["PROVEEDOR"];
                    let ctrl = (await import(fileCtrl))[controllers['L']];
                    let template = templates['L'];
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