//@ts-check
export {
    modalInfoAdicionalArticuloCtrl
}
modalInfoAdicionalArticuloCtrl.$inject = ['$scope', '$uibModalInstance', 'facturaService', 'params'];
function modalInfoAdicionalArticuloCtrl($scope, $uibModalInstance,facturaSvc, params) {
    let { entity, datosAdicionales, historyDatosAdicionales } = params;
    let { datosAdicionalesArticulo } = entity;

    $scope.articulo = entity;
    console.log(entity)
    $scope.data = [];
    $scope.etiquetas = [];
    let infoAdicionalDocumento = [];

    //Datos adicionales del articulo desde compra 
    let dataInfo = datosAdicionalesArticulo.find(item => item.idArticulo === $scope.articulo.idArticulo);

    if (dataInfo) {
        $scope.etiquetas = Object.keys(angular.copy(dataInfo.jsonAdicional))
        $scope.data = datosAdicionalesArticulo;
    }

    console.log(datosAdicionales)
    //Verificamos si el articulo tiene datos adicionales ingresados al registrar documento
    if (datosAdicionales.some(item => item.idArticulo === $scope.articulo.idArticulo)) {

        let info = datosAdicionales.filter(item => item.idArticulo === $scope.articulo.idArticulo);

        //Generamos columna de la tabla a partir de key de etiquetas
        if ($scope.etiquetas.length === 0) {
            $scope.etiquetas = Object.keys(angular.copy(info[0].jsonAdicional))
        }


        //unimos datos adicionales registradas para factura y no registradas
        $scope.data = $scope.data.concat(info); 
    } 

    $scope.onCheck = function (item) {
        let cantidad = parseInt($scope.articulo.cantidad);
        
        historyDatosAdicionales = historyDatosAdicionales.filter(h => h.idInfoAdicional !== item.idInfoAdicional);

        if (item.selected) {

            if (historyDatosAdicionales.length == cantidad) {
                item.selected = false;
                Swal.fire({
                    title: 'Datos Adicionales',
                    icon: 'warning',
                    html: `El número de datos adicionales proporcionados no debe exceder la cantidad de artículo: <b>${$scope.articulo.descripcion}</b>!`
                })
                return
            }

            showLoader();
            facturaSvc.getGroupInfoAdicionalArticulo(item.idInfoAdicional).then(response=>{
                let datosAdicionalesResponse = response.map(item=>({
                    ...item,
                    uuid: $scope.articulo.uniqueRowId
                }))

                infoAdicionalDocumento = [...infoAdicionalDocumento, ...datosAdicionalesResponse]
                historyDatosAdicionales.push({
                    uuid: $scope.articulo.uniqueRowId,
                    idArticulo: item.idArticulo,
                    idInfoAdicional: item.idInfoAdicional,
                    selected: true,
                }); 
            }).finally(()=>hideLoader())
             


        } 
    }


    
    $scope.closeModal = function () {
        $uibModalInstance.close({
            entity,
            historyDatosAdicionales,
            infoAdicionalDocumento
        });
    }
}