

app.controller('actividadEtiquetaCtrl', actividadEtiquetaCtrl);

actividadEtiquetaCtrl.$inject = ['$scope', '$http', 'modalService'];

function actividadEtiquetaCtrl($scope, $http, _modalSvc){
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    }

    $scope.data = {};

    $scope.openModalActividadEmpresa =async(item)=>{
        const modalRef = _modalSvc.openModalSecond(ModalActividadEmpresaCtrl, 'ActividadEtiqueta/_ModalActividadEtiqueta', 'md', item)
    }



}


class ModalActividadEmpresaCtrl{
    static $inject = ['$http', '$uibModalInstance', 'params']
    constructor($http, $uibModalInstance, _params){
        this.$http  = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._params           = _params;

        this.tipoRegistro      = 1;
        this.data              = {};
    }

    $onInit(){

    }
}