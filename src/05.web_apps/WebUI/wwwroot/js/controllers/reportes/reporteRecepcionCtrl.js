

class ModalFiltro{

    static $inject = ["$scope", "mainService"];

    constructor(){

    }


}


app.controller('reporteRecepcionCtrl', reporteRecepcionCtrl);


reporteRecepcionCtrl.$inject = ['$scope', 'mainService', 'modalService']

function reporteRecepcionCtrl($scope, _mS, _modalSvc){


    $scope.openModalFiltro = ()=>{

        const modalRef = _modalSvc.openModalCustom({
            controller: ModalFiltro,
            templateUrl: 'Reporte/Recepcion/_ModalFiltro.cshtml'
        })

    }




}