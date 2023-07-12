(function(){
    'use strict';
    
    const URL_TEMPLATE = '~/Areas/TipoEntidad/Pages/Shared/'
    let mS = {};
    let tS = {}
    app.controller('tipoEntidadCtrl', tipoEntidadCtrl);

    tipoEntidadCtrl.$inject = ['$scope', '$injector', 'modalService'];

    function tipoEntidadCtrl($scope, $injector, modalSvc){
        mS = $injector.get('mainService');
        tS = $injector.get('toastService');

        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 100
        }

        $scope.openModal = function(params){
            try {
                let modalRef = modalSvc.openMdDialog({
                    controller: ModalCtrl,
                    templateUrl: URL_TEMPLATE + '_ModalAddUpdate.cshtml',
                    params: params || {}
                });
                
                modalRef.then(result => {
                    if(typeof result==='object'){
                        $scope.initiLoad();
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }

        $scope.initiLoad = function () {
            try {
                showLoader();
                mS.getData('get', 'TipoEntidad/?json=' + JSON.stringify($scope.dataSearch), null, true).then(response => {
                    hideLoader();
                    if (response.code == "0") {
                        console.log(response)
                    }
                    if(response.code == "1") {
                        $scope.tipoEntidades = JSON.parse(response.payload)
                        $scope.totalRecords = $scope.tipoEntidades[0].totalRecords;
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            } catch (error) {
                hideLoader();
            }
        }

        $scope.initiLoad();

        
        $scope.askToDelete =  function(item) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Tipo Entidad ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    showLoader();
                    mS.getData('delete', 'TipoEntidad/Delete/' + item.idTipoEntidad, null, true).then(response => {
                        hideLoader();
                        if (response.code == "0") {
                            tS.toastr('warning', response.message, response.titleSms);
                        }
                        if (response.code == "1") {
                            tS.toastr('success', response.message, response.titleSms);
                            $scope.initiLoad();
                        }
                    }).catch(error =>{
                        hideLoader();
                        console.log(error)
                    })
                }
            })
        }

    }


    function ModalCtrl($scope, $mdDialog, params){
        $scope.tipoRegistro = 1;
        $scope.data = {};

        if(params.idTipoEntidad>0){
            $scope.tipoRegistro = 2;
            $scope.data = Object.assign({}, params)
        }

        $scope.onKeyupDescripcion = function(){
            if($scope.tipoRegistro!==1) return;

            if($scope.data.descripcion){
                $scope.data.codigo = $scope.data.descripcion.slice(0, 3);
            }else{
                $scope.data.codigo = null;
            }
        }

        $scope.save = function(){
            try {
                var regex = /^(null|undefined|\s*)$/;
                
                if(regex.test($scope.data.descripcion)){
                    tS.toastr('warning', 'Ingrese la descripcion')
                    return
                }
                if(regex.test($scope.data.codigo)){
                    tS.toastr('warning', 'Ingrese el código')
                    return
                }
                showLoader();
                
                let url = $scope.tipoRegistro == 1 ? 'TipoEntidad/Insert' : 'TipoEntidad/Update/' + $scope.data.idTipoEntidad;
                let method = $scope.tipoRegistro == 1 ? 'post':'put';
                mS.getData(method, url + '?json=' + JSON.stringify($scope.data), null, true).then(response => {
                    
                    hideLoader();
                    if (response.code == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $mdDialog.hide(response)
                    }
                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
     
    }

})(window.angular)

