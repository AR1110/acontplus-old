(function(){
    'use strict';

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
                    templateUrl: 'TipoEntidad/_ModalAddUpdate.cshtml',
                    params: params || {}
                });
                
            } catch (error) {
                console.log(error);
            }
        }

        $scope.initiLoad = function () {
            try {
                showLoader();
                mS.getData('get', '/TipoEntidad/Get?pageIndex=' + $scope.dataSearch.pageIndex + '&pageSize=' + $scope.dataSearch.pageSize).then(response => {
                    hideLoader();
                    if (response.id == "0") {
                        console.log(response)
                        return
                    }
                    if(response.id == "1") {
                        $scope.tipoEntidades = response.data;
                        $scope.totalRecords = response.data[0].totalRecords;
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

                $scope.askToDelete = idTipoEntidad => {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este T. Entidad ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/TipoEntidad/Delete?idEntidad=' + idTipoEntidad).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('warning', response.message, response.titleSms);
                            $scope.get();
                            return
                        }
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
                console.log($scope.data)
                let url = $scope.tipoRegistro == 1 ? '/TipoEntidad/Post' : '/TipoEntidad/Put';
                mS.getData('post', url, $scope.data).then(response => {
                    hideLoader();
                    if (response.id == "0") {
                        tS.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    if (response.id == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $mdDialog.hide(response)
                        return
                    }
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

