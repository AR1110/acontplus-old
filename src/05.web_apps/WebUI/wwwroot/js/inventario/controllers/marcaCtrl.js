
app.controller('marcaCtrl', marcaCtrl);

marcaCtrl.$inject = ['mainService', '$filter', '$scope', 'commonService', 'modalService', 'nombreModal', 'toastService'];

function marcaCtrl(_mS, $filter, $scope, _commonSvc, _modalSvc, _nombreModal, toast) {
    'use strict'
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if (accion === null) {
    //     location.href = "/Home/Index";
    // } else {
    //     $scope.accion = accion[0];
    // }

    $scope.marcas = [];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10
    }

    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.recordsQuantity = [5, 10, 25, 50]

    $scope.getMarcas = () => {
        showLoader();
        _mS.getData('get', '/Marca/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
            if (response.code == "0") {
                hideLoader();
                toast.toastr('warning', response.message, response.titleSms);
                return
            }

            $scope.marcas = JSON.parse(response.data);
            $scope.totalRecords = $scope.marcas.length > 0 ? $scope.marcas[0].totalRecords : 0;
            hideLoader();
        }, error => {
            hideLoader();
            console.error(error)
        })
    }
    $scope.getMarcas();

    $scope.pagechanged = function () {
        $scope.getMarcas();
    }

    $scope.changePageSize = function () {
        $scope.dataSearch.pageIndex = 1;
        $scope.getMarcas();
    }

    $scope.exportTableToExcel = () => {       
        try {
            showLoader();
            const marcas = $scope.marcas.map(item=>({
                codigo: item.codigo,
                descripcion: item.descripcion,
            }))                          
            _commonSvc.exportTableToExcel({
                arr: marcas,
                fileName: 'Marcas'
            })               
        } catch (error) {
            hideLoader();
            console.log(error)
        }
        
    }

    $scope.onKeyupSearch = () => {
        if (['', null, undefined].includes($scope.dataSearch.bySearch)) {
            $scope.changePageSize();
            return
        }

        $scope.marcas = $filter('filter')($scope.marcas, $scope.dataSearch.bySearch)
        $scope.totalRecords = 0;
    }

    $scope.delete = async (item) => {
        let { isConfirmed } = await Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar esta Marca ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si,eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cencelar',
            allowOutsideClick: false
        })


        if (isConfirmed) {
            _mS.getData('delete', '/Marca/Delete?id=' + item.idMarca).then(response => {
                if (response.code == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                }
                if (response.code == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getMarcas();
                }
            })
        }

    }

}
