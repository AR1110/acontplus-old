
app.controller('rolCtrl', rolCtrl);

rolCtrl.$inject = ['$http', '$scope', 'commonService', 'formulario', 'apiUrl'];

function rolCtrl($http, $scope, _commonSvc, form, apiUrl) {
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    }

    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.recordsQuantity = [5, 10, 25, 50]

    let jsonParams = {
        idRol: document.getElementById('idRol').value
    }        

    $scope.getRoles = ()=>{
        showLoader();
        $http.get(`${apiUrl.admin}api/Rol/Get/${JSON.stringify(jsonParams)}`).then(({data:response})=>{                
            hideLoader();
            if(response.id==="0"){
                toastr.warning(response.message, response.titleSms);
                return
            }
            $scope.roles = JSON.parse(response.data) || []                
        }).catch(error=>{                
            hideLoader();
            const msg = error.config?error.config.url: error
            toastr.error(msg)
        })
    }
    $scope.getRoles();





}            

