

export {
    ModalDatoAdicionalArticuloCtrl
}

ModalDatoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance',  'params'];

function ModalDatoAdicionalArticuloCtrl($scope, $uibModalInstance, params){

    $scope.articulo = params;    
    let dataEtiqueta = params.etiquetas[0];
    console.log(params)

    $scope.etiquetas = dataEtiqueta.etiquetas;

    $scope.columns = ['IMEI', 'SERIE'];
    $scope.data = [];


    $scope.addRow = function() {
       
        if($scope.data.length === $scope.articulo.cantidad){
            Swal.fire({
                title: 'Datos Adicionales',
                icon:'warning',
                html: `El número de datos adicionales proporcionados no debe exceder la cantidad de artículo: <b>${$scope.articulo.descripcion}</b>!`
            })
            return
        }        
        $scope.data.push({});
        
    };

    $scope.removeRow = function(row) {
        try {
            let index = $scope.data.indexOf(row);
            $scope.data.splice(index, 1);
        } catch (error) {
            console.log(error)
        }
    }


    $scope.save = function() {
        try {
            if($scope.data.length === 0) {
                Swal.fire({
                    title: 'Datos Adicionales',
                    icon:'warning',
                    html: `Ingrese los datos adicionales del artículo!`
                })
                return
            }
            for(let data of $scope.etiquetas) {
                for(let item of $scope.data) {

                    if([null, undefined, ""].includes(item[data])){
                        Swal.fire({
                            title: 'Datos Adicionales',
                            icon:'warning',
                            html: `Ingrese todos campos!`
                        })
                        return
                    }                    
                }
            }
        } catch (error) {
            console.log(error);
        }
        
    }
    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}