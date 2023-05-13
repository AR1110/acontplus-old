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
    app.directive('btnAddUpdateFamilia', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {fileCtrl, controller, template} = nombreModalInventario.FAMILIA;
                    let ctrl = (await import(fileCtrl))[controller];
                    
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
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
    app.directive('btnAddUpdateSubFamilia', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {fileCtrl, controller, template} = nombreModalInventario.SUBFAMILIA;
                    let ctrl = (await import(fileCtrl))[controller];
                    
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
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


    //Se usa en medida, articulo 
    app.directive('btnAddUpdateMedida', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {fileCtrl, controller, template} = nombreModalInventario.MEDIDA;
                    let ctrl = (await import(fileCtrl))[controller];
                   
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
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

    //Se usa en marca, articulo, modelo
    app.directive('btnAddUpdateMarca', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {fileCtrl, controller, template} = nombreModalInventario.MARCA;
                    let ctrl = (await import(fileCtrl))[controller];
                    
                    
                    const modalDialogRef = modalService.openModalCustom({
                        controller: ctrl,
                        template,
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


     //Se usa en modelo, articulo 
     app.directive('btnAddUpdateModelo', function (modalService, nombreModalInventario) {
        return {
            restrict: 'A',
            scope: {
                params: '=',   
                results:'&'             
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                    const {fileCtrl, controller, template} = nombreModalInventario.MODELO;
                    let ctrl = (await import(fileCtrl))[controller];
                    
                    const modalDialogRef = modalService.openModalCustom({
                        controller:ctrl,
                        template,
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