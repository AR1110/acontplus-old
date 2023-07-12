

app.controller('impuestoRentaCtrl', impuestoRentaCtrl);


impuestoRentaCtrl.$inject = ['$scope', 'mainService', 'toastService', 'modalService', 'nombreModal',];


function impuestoRentaCtrl($scope, _mS, _tS, _modalSvc, _nombreModalConst){

    $scope.showImpuestoRentaV2 = true;

    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if (accion === null) {
    //     location.href = "/Home/Index";
    // } else {
    //     $scope.accion = accion[0];
    // }

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10
    }

    $scope.maxSize = 5;
    $scope.totalRecords = 0;   
    $scope.recordsQuantity = [5, 10, 25, 50]


    $scope.impuestosRenta = [];

    $scope.initiload = function(){

        try {
            showLoader();
            $scope.impuestosRenta = [];
            _mS.getData('get', '/ImpuestoRenta/GetAll?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.code==="0"){
                    console.log(response)
                    $scope.impuestosRenta = [];
                    hideLoader();
                    return
                }

                $scope.impuestosRenta = JSON.parse(response.payload) || [];
                $scope.totalRecords = $scope.impuestosRenta[0].totalRecords
                console.log($scope.impuestosRenta)
                hideLoader();

            })
        } catch (error) {
            hideLoader()
            $scope.impuestosRenta = [];	
            console.log(error)
        }

    }

    $scope.initiload();


    $scope.pagechanged = () => {
        $scope.initiload();
    }

    $scope.changePageSize = () => {
        $scope.dataSearch.pageIndex = 1;
        $scope.initiload();
    }


    $scope.openModalNew = async function() {
        console.log(_nombreModalConst.codigo_retencion)
        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.impuesto_renta;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
        let template = MODAL_NUEVO['template'];
        $scope.openModalParam({
            controller,
            template,
            size:'md'
        })
    }


    $scope.openModalUpdate = async function(params) {
        let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.impuesto_renta;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
        let template = MODAL_EDITAR['template'];
        $scope.openModalParam({
            controller,
            template,
            size:'md',
            params
        })
    }


    $scope.openModalParam = (json)=>{
        let modalRef = _modalSvc.openModalCustom(
            json
        )

        modalRef.result.then(result=>{
            if(typeof result === 'object'){
                $scope.initiload();
            }
        })
    }


    $scope.askToDelete = function(data){
        Swal.fire({
            text: "Esta seguro de eliminar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText:'No, cancelar!',
        }).then((result) => {
            if (result.isConfirmed) {
                _mS.getData('delete', '/ImpuestoRenta/Delete?id=' + data.idCodigoRetencion).then(
                    response =>{
                        if(response.code==="0"){
                            _tS.toastr('warning', response.message);
                        }
    
                        if(response.code==="1"){
                            _tS.toastr('success', response.message);
                            $scope.initiload()
                        }
                    }
                )
              
            }
        })
    }


}