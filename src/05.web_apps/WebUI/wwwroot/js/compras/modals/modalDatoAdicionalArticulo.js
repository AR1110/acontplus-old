 


export {
    ModalDatoAdicionalArticuloCtrl
}

ModalDatoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance',  'params'];

function ModalDatoAdicionalArticuloCtrl($scope, $uibModalInstance, params){

    let {entity, datosAdicionales} = params 
    console.log(entity)

    $scope.etiquetas = entity.etiquetas[0].etiquetas;
        
    $scope.articulo = entity; // Datos generales del articulo 
     
    $scope.data = [{
        idArticulo: $scope.articulo.idArticulo,
        idEtiqueta: $scope.articulo.etiquetas[0].idEtiqueta,
        idInfoAdicional: 0,
        adicionales: {}
    }];

    if(datosAdicionales.some(item=>item.idArticulo === $scope.articulo.idArticulo)){
        let dataInfo = datosAdicionales.filter(item=>item.idArticulo === $scope.articulo.idArticulo)
                           
        //si es editar datos adicionales tomamos las etiquetas guardadas ya en compra.infoAdicional BD
        $scope.etiquetas = Object.keys(angular.copy(dataInfo[0].adicionales))
    
        $scope.data =[...dataInfo]
        // $scope.data = dataInfo.map(item=>item.adicionales)
    }else{
        $scope.etiquetas = entity.etiquetas[0].etiquetas;
    }   
    
    
    //Agrupar articulos duplicados uniendo los datos adicionales
    // $scope.groupedData = function(arr){
    //     return  arr.reduce((acc, curr) => {
    //         const index = acc.findIndex(item => item.idArticulo === curr.idArticulo);
    //         if (index !== -1) {
    //           acc[index].jsonAdicional.push(curr.jsonAdicional);
    //         } else {
    //           acc.push({
    //             ...curr,
    //             jsonAdicional: [curr.jsonAdicional],
    //           });
    //         }
    //         return acc;
    //     }, []);
    // }

    // if(dataInfo){
    //    $scope.data = [...dataInfo.adicionales]
    // }
    
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
                    
                        // const newObj = {};
                        // console.log(newObj);
                        for (let key in obj.adicionales) {
                          if (key === columnOriginal) {
                            console.log(obj)
                            obj.adicionales[result.value] = obj.adicionales[key];
                            delete obj.adicionales[key];
                          } 
                        }
                        return obj;
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
        $scope.data.push({
            idArticulo: $scope.articulo.idArticulo,
            idEtiqueta: $scope.articulo.etiquetas[0].idEtiqueta,
            idInfoAdicional: 0,
            adicionales: {}
        });        
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

        for(let item of $scope.data){            
            if (item.adicionales.hasOwnProperty(row)) {
                delete item.adicionales[row];
            }
              
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
                    if(Object.keys(item.adicionales).length === 0) {
                        Swal.fire({
                            title: 'Datos Adicionales',
                            icon:'warning',
                            html: `Ingrese todos campos!`
                        })
                        return 
                    }

                    if([null, undefined, ""].includes(item.adicionales[data])){
                        Swal.fire({
                            title: 'Datos Adicionales',
                            icon:'warning',
                            html: `Ingrese todos campos!`
                        })
                        return
                    }                    
                }
            }

            console.log($scope.data)
            
            $uibModalInstance.close($scope.data)
        } catch (error) {
            console.log(error);
        }
        
    }

    $scope.closeModal = function(){
        $uibModalInstance.close();
    }
}

