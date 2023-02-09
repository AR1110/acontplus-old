
app.controller('familiaCtrl', familiaCtrl);

familiaCtrl.$inject = ['$http','$filter', '$scope','modalService', 'nombreModal', 'toastService'];

function familiaCtrl($http, $filter, $scope, _modalSvc, _nombreModal, toast) {
    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10
    }
    $scope.familias = [];

    $scope.maxSize = 5;
    $scope.totalRecords = 0;  
    $scope.recordsQuantity = [5, 10, 25, 50, 100, 500, 1000];


    $scope.getFamilias = ()=> {
        showLoader();
        $http.get('/Familia/Get?json=' + JSON.stringify($scope.dataSearch))
        .then(({data:response}) => {
            if (response.id == "0") {
                hideLoader();
                toast.toastr('warning', response.message, response.titleSms);
                return
            }

            $scope.familias = JSON.parse(response.data);
            $scope.totalRecords = $scope.familias.length > 0 ? $scope.familias[0].totalRecords : 0; 
            hideLoader();
        }).catch(error=>{
            hideLoader();
            console.error(error)
        })
    }

    $scope.getFamilias();

    $scope.pagechanged = ()=> $scope.getFamilias();
    
    $scope.changePageSize = ()=> {
        $scope.dataSearch.pageIndex = 1;
        $scope.getFamilias();
    }


    $scope.openModal = async (item)=>{
        const {familia} = _nombreModal;
        const {ModalFamiliaCtrl} = await import('./../../modal/' + familia.MODAL_FAMILIA_CTRL);
        const modalDialogRef = _modalSvc.openModalSecond(ModalFamiliaCtrl, `Familia/${familia.MODAL_FAMILIA_CSHTML}`,'md', item);
        modalDialogRef.result.then(result=>{
            if(typeof result==="object" && result.id==="1"){
                $scope.getFamilias();
            }                
        })
    }

    $scope.onKeyupSearch = ()=>{
        if(["", null, undefined].includes($scope.dataSearch.bySearch)){
            $scope.changePageSize();
            return
        }
        $scope.familias = $filter('filter')($scope.familias, $scope.dataSearch.bySearch);
        $scope.totalRecords = 0;  
    }
    


    $scope.delete = async (item)=>{
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar esta Familia ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        });
        
        if(isConfirmed){
            $http.post('/Familia/Delete?idFamilia=' + item.idFamilia)
            .then(({data:response}) => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);                    
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getFamilias();                    
                }
            })
        }                   
    }

}

