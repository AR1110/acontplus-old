

export {
    ModalDatoAdicionalArticuloCtrl
}

ModalDatoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance',  'params'];

function ModalDatoAdicionalArticuloCtrl($scope, $uibModalInstance, params){

    let {entity, datosAdicionales} = params 

    $scope.etiquetas = entity.etiquetas[0].etiquetas;
        
    $scope.articulo = entity; // Datos generales del articulo 
     
    //let dataEtiqueta =  entity.etiquetas[0] 
    
    //$scope.etiquetas = JSON.parse(dataEtiqueta.etiquetas[0]); //etiqueta asignado al articulo 

    
    $scope.data = [{}];
        
    let dataInfo = datosAdicionales.find(item=>item.idArticulo===$scope.articulo.idArticulo);
    
    if(dataInfo){
       $scope.data = dataInfo.adicionales
    }
    
    $scope.addColumn = function(){
        try {
            Swal.fire({
                title: 'Ingrese el nombre de la columna',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Ingresar',
                cancelButtonText: 'Cancelar',                
                inputValidator: (value) => {
                    if(!value) return 'Ingrese el nombre de la columna';

                    if($scope.etiquetas.some(item=>item===value.trim())) return 'El nombre de la columna proporcionada ya existe';                    
                },               
                allowOutsideClick: false
            }).then(result => {
               if(result.isConfirmed){
                $scope.etiquetas.push(result.value);
                $scope.$apply();
               }
            })
        } catch (error) {
            console.log(error);
        }        
    }

    

    $scope.updateNameColumn = function(index, column){
        try {
            
            let columnOriginal = column;
            
            Swal.fire({
                title: 'Modificar el nombre de la columna',
                input: 'text',
                inputValue: column,
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Ingresar',
                cancelButtonText: 'Cancelar',                
                inputValidator: (value) => {
                    if(!value) return 'Ingrese el nombre de la columna';

                    if($scope.etiquetas.some(item=>item===value.trim())) return 'El nombre de la columna proporcionada ya existe';                    
                },               
                allowOutsideClick: false
            }).then(result => {
                if(result.isConfirmed){
                 
                    $scope.etiquetas[index] = result.value;

                    $scope.data = $scope.data.map(obj => {
                    
                        const newObj = {};

                        for (let key in obj) {
                          if (key === columnOriginal) {
                            newObj[result.value] = obj[key];
                          } else {
                            newObj[key] = obj[key];
                          }
                        }
                        return newObj;
                    });

                    $scope.$apply();
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
       


    //Nuevo Dato Adicional
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


    //Quitar Dato Adicional del Articulo 
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

    $scope.removeColumn = function(row) {
        let index = $scope.etiquetas.indexOf(row);
        $scope.etiquetas.splice(index, 1);
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
                data: $scope.data.map(item=>{
                    let {$$hashKey, ...rest} = item;
                    return rest;
                })
            })
        } catch (error) {
            console.log(error);
        }
        
    }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}

