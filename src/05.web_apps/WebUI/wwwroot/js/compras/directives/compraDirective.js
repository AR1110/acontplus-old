(function(){

    'use strict';

    app.directive('btnDataAdicionalArticulo', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {                
                entity: '=',
                getDataEtiqueta:'&',
                datosAdicionales:'='
            },
            link: function (scope, element, attrs) {

                element.on('click', async function () {
                    console.log(scope)
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
                        params: {
                            entity: scope.entity,
                            datosAdicionales: scope.datosAdicionales
                        },
                        isRenderRazorPartial: true
                    })  
                    
                    modalRef.result.then(function (result) {
                        if(typeof result ==='object'){

                            //Cuando es editar 
                            if(scope.datosAdicionales.some(item=>item.idArticulo ===scope.entity.idArticulo)){
                                for(let label of scope.datosAdicionales){
                                    if(label.idArticulo===scope.entity.idArticulo){
                                        label.adicionales = result.data;                                     
                                    }
                                }
                            }else {

                                scope.datosAdicionales.push({
                                    idArticulo: scope.entity.idArticulo,
                                    idEtiqueta: scope.entity.etiquetas[0].idEtiqueta,
                                    adicionales: result.data
                                });
                            }                            
                        }
                       
                        // scope.getDataEtiqueta({
                        //     items: result
                        // })
                        console.log(scope.datosAdicionales)
                    })
                });
            }
        };
    });



})(window.angular)