(function() {

    'use strict';

    const URL = 'TiempoCredito/';

    app.controller('tiempoCreditoCtrl', tiempoCreditoCtrl);

    tiempoCreditoCtrl.$inject = ['$scope', 'mainService', 'modalService', 'nombreModalConfig', 'toastService'];

    function tiempoCreditoCtrl($scope, mS, modalSvc, nombreModalConfig, tS) {
       
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10000;
        $scope.recordsQuantity = [5, 10, 25, 50];
        $scope.dataSearch = {
            pageIndex: $scope.pageIndex,
            pageSize: $scope.pageSize
        };

        $scope.openModal = async function(params) {
            try {
                let fileCtrl = nombreModalConfig.TIEMPO_CREDITO.fileCtrl;
                let ctrl = nombreModalConfig.TIEMPO_CREDITO.controller;
                let template = nombreModalConfig.TIEMPO_CREDITO.template;
                let controller = (await import(fileCtrl))[ctrl];
                
                let modalRef = modalSvc.openModalCustom({
                    controller,
                    template,
                    size:'md',
                    params: Object.assign({}, params) || {},
                    isRenderRazorPartial: true
                })
                modalRef.result.then(result => {
                    if(typeof result==='object'){
                        $scope.getTiempoCreditos();
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

        $scope.getTiempoCreditos = function() {
            try {
                showLoader();
                mS.getData('get', URL +'?json=' + JSON.stringify($scope.dataSearch), null,true).then(response=>{
                    hideLoader();
                    if(response.code==='0'){                        
                        console.log(response)
                    }
                    if(response.code==='1'){ 
                        $scope.tiempoCreditos = JSON.parse(response.payload) || [];
                        $scope.totalRecords =$scope.tiempoCreditos.length > 0 ? $scope.tiempoCreditos.totalRecords : 0; 
                    }
                }).catch(error=>{
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }
        $scope.getTiempoCreditos();


        //Eliminar Tiempo Credito
        $scope.askToDelete = function(item) {
            try {
                Swal.fire({
                    html: `<small>Esta seguro/a de eliminar este registro ahora?</small> `,
                    icon: 'warning',
                    confirmButtonText: `Sí, eliminar!`,
                    showCancelButton: true,
                    cancelButtonText: 'No, cancelar!',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        showLoader();
                        mS.getData('delete', URL+ 'Delete/' + item.idTiempoCredito, null, true).then(response => {
                            hideLoader();
                            if (response.code == "0") {
                                tS.toastr('warning', response.message, response.titleSms);
                            }
                            if (response.code == "1") {
                                tS.toastr('success', response.message, response.titleSms);
                                $scope.getTiempoCreditos();                                
                            }
                        }).catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                    }
                })            
            } catch (error) {
                hideLoader();            
            }
        }
    }


})(window.angular)