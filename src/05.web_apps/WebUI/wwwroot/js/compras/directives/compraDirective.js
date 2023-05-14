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
                    
                    if(!Number.isInteger(scope.entity.cantidad)){
                        Swal.fire({
                            title: 'Datos Adicionales',
                            icon:'warning',
                            html: 'El valor de la cantidad del artículo tiene que ser un número entero!'
                        })
                        return
                    }

                    let {fileCtrl, controller, template} = nombreModal.compra.MODAL_DATO_ADICIONAL_ARTICULO;                    
                    let ctrl = (await import(fileCtrl))[controller]
                    
                    let modalRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
                        size:'lg',
                        params: {
                            entity: scope.entity,
                            datosAdicionales: scope.datosAdicionales
                        },
                        isRenderRazorPartial: true
                    })  
                    
                    modalRef.result.then(function (results) {
                        if(angular.isArray(results)){

                            //Cuando es editar 
                            if(scope.datosAdicionales.some(item=>item.idArticulo ===scope.entity.idArticulo)){
                                scope.datosAdicionales = scope.datosAdicionales.filter(item=>item.idArticulo !==scope.entity.idArticulo);
                                
                                for(let item of results){
                                    scope.datosAdicionales.push(item);
                                }
                                // for(let label of scope.datosAdicionales){
                                //     if(label.idArticulo===scope.entity.idArticulo){
                                //         label.adicionales = result.data;                                     
                                //     }
                                // }
                            }else {
                                for(let item of results){
                                    scope.datosAdicionales.push(item);
                                }
                            }
                            console.log(scope.datosAdicionales)                            
                        }
                    })
                });
            }
        };
    });



})(window.angular)