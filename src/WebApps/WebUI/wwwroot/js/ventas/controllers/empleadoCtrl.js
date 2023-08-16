
app.controller('empleadoCtrl', empleadoCtrl);
empleadoCtrl.$inject = ['$scope', 'empleadoService', 'toastService'];

function empleadoCtrl($scope, empleadoSvc, tS, ) { 
    $scope.empleados = []; 

    $scope.resultModal = function(result){
        if(typeof result==='object'){
            $scope.getEmpleados();
        }        
    }
    

    $scope.getEmpleados = function () {
        try {
            showLoader();
            empleadoSvc.getAll({}).then(response => {               
                hideLoader();                 
                $scope.empleados = response;              
                $scope.totalRecords = response[0].totalRecords;
            }).catch(err => {
                hideLoader();
                console.log(err);
            })
            
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }
    $scope.getEmpleados();
    $scope.pagechanged = function () {
        $scope.getEmpleados();
    }

    $scope.changePageSize = function () {
        $scope.pageIndex = 1;
        $scope.getEmpleados();
    } 
    
    $scope.askToDelete = async (item)=> {
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            title: '',
            html: '<small>Esta seguro/a de eliminar este Empleado <b>' + item.nombreCompleto + '</b>?</small> ',
            showDenyButton: true,
            confirmButtonText: 'Si,eliminar!',
            denyButtonText: 'No, cancelar!',
            allowOutsideClick: false
        })
        
        if(isConfirmed){
            showLoader();
            empleadoSvc.deleteEmployee(item.idEmpleado).then(response => {
                hideLoader();
                if (response.code == "0") {
                    tS.toastr('warning', response.message, response.titleSms);                        
                }
                if (response.code == "1") {
                    hideLoader();
                    tS.toastr('success', response.message, response.titleSms);
                    $scope.getEmpleados();                        
                }
            }).catch(err => {
                hideLoader();
                console.log(err);
            })
        }         
    }        
}

