
app.controller('empleadoCtrl', empleadoCtrl);
empleadoCtrl.$inject = ['$scope', 'mainService', 'modalService', 'nombreModal', 'toastService','formulario'];

function empleadoCtrl($scope, mS, _modalSvc, _nombreModal, toast, form) {
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if(accion===null){
    //     location.href = "/Home/Index";
    // }else{
    //     $scope.accion = accion[0];
    // }
    
    $scope.empleados = [];

    //Paginacion 
    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.recordsQuantity = [5, 10, 25, 50]

    $scope.openModalAddUpdate = async(params)=>{
        const {MODAL_CTRL, MODAL_CSHTML} = _nombreModal.empleado;
        const {ModalEmpleadoCtrl} = await import('./../../modal/' + MODAL_CTRL);

        const _modalRef = _modalSvc.openModalCustom({
            controller: ModalEmpleadoCtrl,
            template: 'Empleado/' + MODAL_CSHTML,
            size:'md',
            params
        })

        _modalRef.result.then(response=>{
            if(typeof response==='object'){
                $scope.getEmpleados();
            }
        })
    }
    

    $scope.getEmpleados = function () {
        try {
            showLoader();
            mS.getData('get', '/Empleado/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {               
                if (response.id == "0") {
                    hideLoader();
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.empleados = response.data;                
                if (response.data.length > 0) $scope.totalRecords = response.data[0].totalRecords;
                hideLoader();
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


    $scope.openModalEdit = (item)=>{
        $scope.openModalAddUpdate(item.empleado)        
    }

    
    $scope.askToDelete = async (item)=> {
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            title: '',
            html: '<small>Esta seguro/a de eliminar este Empleado <b>' + item.empleado.nombreCompleto + '</b>?</small> ',
            showDenyButton: true,
            confirmButtonText: 'Si,eliminar!',
            denyButtonText: 'No, cancelar!',
            allowOutsideClick: false
        })
        
        if(isConfirmed){
            showLoader();
            mS.getData('post', '/Empleado/Delete?idEmpleado=' + item.empleado.idEmpleado).then(response => {
                if (response.id == "0") {
                    hideLoader();
                    toast.toastr('warning', response.message, response.titleSms);                        
                }
                if (response.id == "1") {
                    hideLoader();
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getEmpleados();                        
                }
            })
        }         
    }        
}

