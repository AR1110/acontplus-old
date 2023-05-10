(function(){

    'use strict';

    app.directive('btnDataAdicionalArticulo', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {                
                entity: '=',
                getDataEtiqueta:'&'
            },
            link: function (scope, element, attrs) {

                element.on('click', async function () {

                    if(!Number.isInteger(scope.entity.cantidad)){
                        Swal.fire({
                            title: 'Datos Adicionales',
                            icon:'warning',
                            html: 'El valor de la cantidad del artículo tiene que ser un número entero!'
                        })
                        return
                    }

                    let {ModalDatoAdicionalArticuloCtrl} = await import('/js/compras/modals/modalDatoAdicionalArticulo.js' + CHANGE_VERSION());
                    
                    let modalRef = modalService.openModalCustom({
                        controller: ModalDatoAdicionalArticuloCtrl,
                        template: '~/Areas/Compra/Pages/Shared/_ModalDatoAdicionalArticulo.cshtml',
                        size:'lg',
                        params: scope.entity,
                        isRenderRazorPartial: true
                    })  
                    
                    modalRef.result.then(function (result) {
                        console.log(result);  
                        console.log(scope)                  
                        scope.getDataEtiqueta({
                            items: result
                        })
                    })
                });
            }
        };
    });



})(window.angular)