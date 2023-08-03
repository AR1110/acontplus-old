app.controller('configDocCtrl', configDocCtrl);

configDocCtrl.$inject = ['$scope', 'commonService', 'mainService', 'toastService'];

function configDocCtrl($scope, _commonSvc, mS, tS) {
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if(accion===null){
    //     location.href = "/Home/Index";
    // }else{
    //     $scope.accion = accion[0];
    // }

    $scope.configurationDocs = [];

    $scope.puntosEmision = [];

    $scope.initiload = ()=>{
        showLoader();
        _commonSvc.getEstabAsign().then(response => {
           
            $scope.establecimientos = response; 
            
            if($scope.establecimientos.length>0){
                $scope.dataEstab = $scope.establecimientos.length>0?$scope.establecimientos[0]: {};
                $scope.codEstab = $scope.dataEstab.codEstab;            
                $scope.getPuntoEmision();
                hideLoader();
            }else{
                hideLoader();
                tS.toastr('warning', 'No tienes asignado ningún Establecimiento')
            }
        }).catch(err => {
            hideLoader();
            console.error(err);
        }) 
    }

    $scope.initiload();

    $scope.onChangeEstab = ()=>{
        $scope.dataEstab = $scope.establecimientos.find(item=>item.codEstab===$scope.codEstab)         
        $scope.getPuntoEmision();
    }

    $scope.getPuntoEmision = ()=>{
        _commonSvc.getDataFormEstabAsig($scope.dataEstab).then(results=>{ 
            $scope.puntosEmision = results[0];            
            if($scope.puntosEmision.length>0){          
                $scope.idPuntoEmision = $scope.puntosEmision[0].idPuntoEmision;
                $scope.getConfigDocs();
            }else{
                tS.toastr('warning','No tienes asignado ningún punto de Emisión')
            }           
        })
    }
  
    $scope.getConfigDocs = function () {   
        showLoader();
        mS.getData('get', '/TipoDocumento/GetConfiguration?idPuntoEmision=' + $scope.idPuntoEmision).then(function (response) {                
            hideLoader();
            if (response.id == 0) {
                toast.toastr('warning', response.message);
            };
            $scope.configurationDocs = response.data;
        }).catch(error => {
            hideLoader();
            console.log(error)
        })
    }

    $scope.saveConfig = function (item) {
        if ($scope.idPuntoEmision === undefined || $scope.idPuntoEmision == null || $scope.idPuntoEmision == 0) {
            toast.toastr('warning', 'Seleccione el punto de emisión');
            return;
        }
        if (item.configDoc.ultimaSecuencia === undefined || item.configDoc.ultimaSecuencia == null || item.configDoc.ultimaSecuencia == 0) {
            toast.toastr('warning', 'Ingrese el número de secuencia');
            return;
        }

        const data = {
            idConfiguracionDocumento: item.configDoc.idConfiguracionDocumento,
            idPuntoEmision: $scope.idPuntoEmision,
            idTipoDocumento: item.configDoc.idTipoDocumento,
            generacionNro: item.configDoc.generacionNro,
            ultimaSecuencia: item.configDoc.ultimaSecuencia
        };

        showLoader();
        mS.getData('post', '/TipoDocumento/SaveConfig', data).then(response=>{
            hideLoader();
            if (response.id == 0) {
                toast.toastr('warning', response.message);
                return;
            };
            if (response.id == 1) {
                toast.toastr('success', response.message);
                $scope.getConfigDocs();
            };
        }).catch(error => {
            hideLoader();
            console.log(error)
        })
    };

    $scope.configDoc = function () {
        $('#configDocModal').modal('show');
    };
}
