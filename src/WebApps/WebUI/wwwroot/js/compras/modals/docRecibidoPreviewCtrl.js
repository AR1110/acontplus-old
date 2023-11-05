
export {
    docRecibidoPreviewCtrl
}

docRecibidoPreviewCtrl.$inject = ['$scope', '$uibModalInstance', 'mainService', 'params'];

function docRecibidoPreviewCtrl($scope, $uibModalInstance, mS, params){ 

    initiload();
    function initiload (){
        showLoader()
        mS.getData('get', 'Compra/DocumentoRecibido/Preview/' + params.idDocumento, null, true).then(
            response => { 
                $('#facturaModal').modal('show')
                $('#bodyFactura').html(response.payload)
            }
        ).catch(error => { 
            console.log(error)
        }).finally(()=>hideLoader())

    }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}