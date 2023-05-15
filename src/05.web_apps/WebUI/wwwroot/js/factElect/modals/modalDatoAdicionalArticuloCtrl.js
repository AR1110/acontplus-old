
export {
    ModalDatoAdicionalArticuloCtrl
}

ModalDatoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

function ModalDatoAdicionalArticuloCtrl($scope, $uibModalInstance, params) {
    let {entity, datosAdicionales, historyDatosAdicionales} = params;
    let {datosAdicionalesArticulo} = entity;
  
    $scope.articulo = entity;
    $scope.data = [];
    $scope.etiquetas = [];

    //Datos adicionales del articulo desde compra 
    let dataInfo = datosAdicionalesArticulo.find(item => item.idArticulo===$scope.articulo.idArticulo);

    if(dataInfo){
        $scope.etiquetas = Object.keys(angular.copy(dataInfo.jsonAdicional))
        $scope.data = datosAdicionalesArticulo;
    }

    console.log(datosAdicionales)
    //Verificamos si el articulo tiene datos adicionales ingresados al registrar documento
    if(datosAdicionales.some(item=>item.idArticulo===$scope.articulo.idArticulo)){

        let info = datosAdicionales.filter(item=>item.idArticulo===$scope.articulo.idArticulo);
       
        //Generamos columna de la tabla a partir de key de etiquetas
        if($scope.etiquetas.length ===0) {
            $scope.etiquetas = Object.keys(angular.copy(info[0].jsonAdicional))
        }

        console.log(info)
        //unimos datos adicionales registradas para factura y no registradas
        $scope.data = $scope.data.concat(info);
        // for(let info of datosAdicionales){
        //     if(info.idArticulo===$scope.articulo.idArticulo){
        //         $scope.data.push(info);
        //     }
        // }
    }
    console.log(params);



    // if(datosAdicionales.some(item=>item.idArticulo === $scope.articulo.idArticulo)){
    //     let dataInfo = datosAdicionales.filter(item=>item.idArticulo === $scope.articulo.idArticulo)
                           
    //     //si es editar datos adicionales tomamos las etiquetas guardadas ya en compra.infoAdicional BD
    //     $scope.etiquetas = Object.keys(angular.copy(dataInfo[0].adicionales))
    
    //     $scope.data =[...dataInfo]
    //     // $scope.data = dataInfo.map(item=>item.adicionales)
    // }else{
    //     $scope.etiquetas = entity.etiquetas[0].etiquetas;
    // } 

    $scope.onCheck = function(item) { 
        historyDatosAdicionales = historyDatosAdicionales.filter(h=>h.idInfoAdicional!==item.idInfoAdicional);
        
        if(item.selected)       {
            historyDatosAdicionales.push({
                idArticulo: item.idArticulo,
                idInfoAdicional: item.idInfoAdicional,
                selected: true,
            });
        }
        console.log(historyDatosAdicionales);
    }

    $scope.closeModal = function() {
        $uibModalInstance.close({
            entity,
            historyDatosAdicionales
        });
    }
}