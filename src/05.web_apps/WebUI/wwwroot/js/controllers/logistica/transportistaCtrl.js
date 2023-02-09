(() => {
    "use strict";

    angular
        .module("acontPlusApp")
        .controller("transportistaCtrl", transportistaCtrl);

    transportistaCtrl.$inject = ["$scope", '$http', "modalService", 'nombreModal', "formulario"];

    function transportistaCtrl($scope, $http, _modalSvc, _nombreModal, _form) {        
        $scope.json = {
            typeList:0
        }
        $scope.openModal = async(item)=> {
            const {transportista} = _nombreModal;
            const {ModalTransportistaCtrl} = await import('./../../modal/' + transportista.MODAL_CTRL);
            const modalRef = _modalSvc.openModalSecond(ModalTransportistaCtrl, 'Transportista/'+transportista.MODAL_CSHTML, 'md', item);
            modalRef.result.then(result=>{
                if(typeof result==='object'){
                    $scope.getTransportistas();
                }
            })           
        }

        $scope.getTransportistas = function () {
            showLoader();
            $http.get("/Transportista/Get?json=" + JSON.stringify($scope.json)).then(({data:response}) => {
                if (response.id === "0") {
                    hideLoader();
                    toastr.warning(response.message, response.titleSms);
                    return
                }
                $scope.transportistas = JSON.parse(response.data);                
                hideLoader();                
            }).catch(error=>{
                hideLoader();
                toastr.error(error)
            })
        }
        $scope.getTransportistas();

        $scope.eliminar = async(item)=> {
            let { isConfirmed } = await Swal.fire({
                icon: "warning",
                html: `<small>Esta seguro/a de eliminar este registro ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: "Sí, eliminar",
                showCancelButton: true,
                cancelButtonText: "No, cancelar",
                allowOutsideClick: false,
            })

            if (isConfirmed) {
                const url = "/Transportista/Delete?id=" + item.idTransportista;
                $http.post(url).then(({data:response}) => {
                    if (response.id == "0") {
                        toastr.warning(response.message);
                        return;
                    }
                    if (response.id == "1") {
                        toastr.success(response.message);
                        $scope.getTransportistas();
                        return;
                    }
                });
            }
        }





    }
})(window.angular);
