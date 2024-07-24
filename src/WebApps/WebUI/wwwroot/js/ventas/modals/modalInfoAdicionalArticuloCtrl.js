//@ts-check
export {
    modalInfoAdicionalArticuloCtrl
}
modalInfoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance', 'facturaService', 'params'];
function modalInfoAdicionalArticuloCtrl($scope, $uibModalInstance,facturaSvc, params) {
    let {
         entity,  
         infoAdicionalDoc 
        } = params; 

    $scope.articulo = entity;
    console.log(entity)
    $scope.data = [];
    $scope.etiquetas = []; 

    //Datos adicionales del articulo desde compra 
    let dataInfo = entity.datosAdicionalesArticulo.find(item => item.uniqueRowDetalle === $scope.articulo.uniqueRowDetalle);

    if (dataInfo) {
        $scope.etiquetas = Object.keys(structuredClone(dataInfo.jsonAdicional))
        $scope.data = entity.datosAdicionalesArticulo;
    }

    
    //Verificamos si el articulo tiene datos adicionales ingresados al registrar documento
    // if (historyDatosAdicionales.some(item => item.uniqueRowId === $scope.articulo.uniqueRowId)) {

    //     let info = historyDatosAdicionales.filter(item => item.uniqueRowId === $scope.articulo.uniqueRowId);

        
    //     if ($scope.etiquetas.length === 0) {
    //         $scope.etiquetas = Object.keys(angular.copy(info[0].jsonAdicional))
    //     }
 
    //     $scope.data = $scope.data.concat(info); 
    // } 

    $scope.onCheck = function (item) { 
        let cantidad = parseInt($scope.articulo.cantidad);
        
        let cantidadAgregada = entity.datosAdicionalesArticulo.filter(h => h.selected && h.uniqueRowDetalle === item.uniqueRowDetalle).length;
 
        if (item.selected) {

            if (cantidadAgregada > cantidad) {
                item.selected = false;
                Swal.fire({
                    title: 'Datos Adicionales',
                    icon: 'warning',
                    html: `El número de datos adicionales proporcionados no debe exceder la cantidad de artículo: <b>${$scope.articulo.descripcion}</b>!`
                })
                return
            };

            showLoader();
            facturaSvc.getGroupInfoAdicionalArticulo(item.idInfoAdicional).then(response=>{
                let datosAdicionalesResponse = response.map(item=>({ 
                    ...item,
                    uniqueRowDetalle: $scope.articulo.uniqueRowDetalle,
                    idInfoAdicional: item.idInfoAdicional
                }))

              //  infoAdicionalDocumento = [...infoAdicionalDocumento, ...datosAdicionalesResponse]
                infoAdicionalDoc = [...infoAdicionalDoc, ...datosAdicionalesResponse]

                params.datosAdicionalesArticulo.push({
                    uniqueRowDetalle: $scope.articulo.uniqueRowDetalle,
                    idArticulo: item.idArticulo,
                    idInfoAdicional: item.idInfoAdicional,
                    selected: true,
                }); 
            }).finally(()=>hideLoader()) 
        }else{
            infoAdicionalDoc = infoAdicionalDoc.filter(ia=>ia.idInfoAdicional!==item.idInfoAdicional); 
            params.datosAdicionalesArticulo = params.datosAdicionalesArticulo.filter(ia => ia.idInfoAdicional !== item.idInfoAdicional) 
        }
    }


    
    $scope.closeModal = function () {
        $uibModalInstance.close({
            entity,
            datosAdicionalesArticulo: params.datosAdicionalesArticulo,
            infoAdicionalDoc
        });
    }
}