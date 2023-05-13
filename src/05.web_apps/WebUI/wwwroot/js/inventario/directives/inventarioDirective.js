(function(){

    'use strict';

    app.directive('btnDataAdicionalArticulo', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                getDataCustomer: '&',
                dataSearchCustomer: '='
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                  
                });
            }
        };
    });


    //Se usa en familia, articulo 
    app.directive('btnAddUpdateFamilia', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {MODAL_FAMILIA_CTRL, MODAL_FAMILIA_CSHTML} = nombreModal.familia;
                    const {ModalFamiliaCtrl} = await import('./../../modal/' + MODAL_FAMILIA_CTRL);
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ModalFamiliaCtrl,
                        template: `Familia/${MODAL_FAMILIA_CSHTML}`,
                        size: 'md',
                        params: scope.params
                    })       
                          
                    modalDialogRef.result.then(result=>{
                        if(typeof result==="object"){
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
    app.directive('btnAddUpdateSubFamilia', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {MODAL_CSHTML, MODAL_CTRL} = nombreModal.subFamilia;          
                    const {ModalSubFamiliaCtrl} = await import(`./../../inventario/modals/${MODAL_CTRL}`);
                    console.log(scope)
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ModalSubFamiliaCtrl,
                        template: `SubFamilia/${MODAL_CSHTML}`,
                        size: 'md',
                        params: scope.params || {},
                    })        
                          
                    modalDialogRef.result.then(result=>{
                        if(typeof result==="object"){
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
     app.directive('btnAddUpdateModelo', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {MODAL_CSHTML, MODAL_CTRL} = nombreModal.modelo
                    const {ModalModeloCtrl} = await import('./../../inventario/modals/' + MODAL_CTRL);
                    
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ModalModeloCtrl,
                        template: 'Modelo/' + MODAL_CSHTML,
                        size: 'md',
                        params: scope.params || {}
                    })          
                          
                    modalDialogRef.result.then(result=>{
                        if(typeof result==="object"){
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
    app.directive('btnAddUpdateMedida', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    let {MODAL_CTRL, MODAL_CSHTML} = nombreModal.medida
                    const {ModalMedidaCtrl} = await import(`./../../inventario/modals/${MODAL_CTRL}`);

                    const modalDialogRef = modalService.openModalCustom({
                        controller: ModalMedidaCtrl,
                        template: `Medida/${MODAL_CSHTML}`,
                        size: 'md',
                        params: scope.params || {}
                    })              
                          
                    modalDialogRef.result.then(result=>{
                        if(typeof result==="object"){
                            scope.results({
                                item: result
                            })
                        }
                    })
                });
            }
        }
    })



})(window.angular)