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
                    let {ModalDatoAdicionalArticuloCtrl} = await import('/js/compras/modals/modalDatoAdicionalArticulo.js' + CHANGE_VERSION());
                    
                    let modalRef = modalService.openModalCustom({
                        controller: ModalDatoAdicionalArticuloCtrl,
                        template: '/js/compras/templates/modalDatoAdicionalArticulo.html',
                        size:'md',
                        params: scope.entity,
                        isRenderHtmlNormal: true
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