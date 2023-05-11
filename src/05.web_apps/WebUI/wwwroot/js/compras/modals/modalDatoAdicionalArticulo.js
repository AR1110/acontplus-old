

export {
    ModalDatoAdicionalArticuloCtrl
}

ModalDatoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance',  'params'];

function ModalDatoAdicionalArticuloCtrl($scope, $uibModalInstance, params){

    let {entity, datosAdicionales} = params 

    let dataEtiqueta = entity.etiquetas[0];
    
    $scope.articulo = entity;
    $scope.etiquetas = dataEtiqueta.etiquetas; //etiqueta asignado al articulo 

    
    $scope.data = [];

   
   let dataInfo = datosAdicionales.info.find(item=>item.idArticulo===$scope.articulo.idArticulo);

   if(dataInfo){
        $scope.data = dataInfo.adicionales
   }
       
   

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
            Swal.fire({
                title: 'Eliminar Dato Adicional',
                icon:'warning',
                html: `Esta seguro de eliminar este dato adicional?`,
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                confirmButtonText:'Si, eliminar'
            }).then(result => {
                if(result.isConfirmed){
                    let index = $scope.data.indexOf(row);
                    $scope.data.splice(index, 1);
                    $scope.$apply();
                }
            })
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

            
            $uibModalInstance.close({
                isAdd: true,
                data: $scope.data
            })
        } catch (error) {
            console.log(error);
        }
        
    }
    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}