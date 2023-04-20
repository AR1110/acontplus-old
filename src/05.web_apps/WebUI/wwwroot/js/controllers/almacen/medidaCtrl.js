(() => {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('medidaCtrl', medidaCtrl);

    medidaCtrl.$inject = ['$scope',  'mainService', 'modalService', 'FileSaver', 'nombreModal', 'toastService'];

    function medidaCtrl($scope, mS, _modalSvc, FileSaver, _nombreModal, toast) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // };
        
        $scope.data = {};
        $scope.medidas = [];
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10
        }
        //Paginacion
        $scope.totalRecords = 0;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.getMedidas = () => {
            mS.getData('get', '/Medida/Get?json=' + JSON.stringify($scope.dataSearch)).then((response) => {
                if (response.code == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.medidas = JSON.parse(response.data) || [];                
                $scope.totalRecords = $scope.medidas.length > 0 ? $scope.medidas[0].totalRecords : 0;
                return;
            })
        }
        $scope.getMedidas();
        $scope.pagechanged = () => {
            $scope.getMedidas();
        }

        $scope.changePageSize = () => {
            $scope.dataSearch.pageIndex = 1;
            $scope.getMedidas();
        }

       
        $scope.exportTableToExcel = () => {       
            try {
                showLoader();
                const medidas = $scope.medidas.map(item=>({
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                }))                          
                _commonSvc.exportTableToExcel({
                    arr: medidas,
                    fileName: 'SubFamilias'
                })   
            } catch (error) {
                hideLoader();
                console.log(error)
            }
            
        }

        $scope.openModalNew = async()=>{
            let {medida} = _nombreModal;
            const {ModalMedidaCtrl} = await import(`./../../modal/${medida.MODAL_CTRL}`);

            const modalDialogRef = _modalSvc.openModalCustom({
                controller: ModalMedidaCtrl,
                template: `Medida/${medida.MODAL_CSHTML}`,
                size: 'md'
            })     
            
            modalDialogRef.result.then(result => {                
                if(typeof result ==='object'){
                    $scope.getMedidas();
                }
            })

        }

        $scope.openModalUpdate = async(item)=>{
            let {medida} = _nombreModal;
            const {ModalMedidaCtrl} = await import(`./../../modal/${medida.MODAL_CTRL}`);
            const uibModalRef = _modalSvc.openModalSecond(ModalMedidaCtrl, `Medida/${medida.MODAL_CSHTML}`, 'md', item);
            uibModalRef.result.then(result=>{
                if(typeof result ==='object'){
                    $scope.getMedidas();
                }
            })            
        }
       

        $scope.delete = function (data) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar esta Medida ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('delete', '/Medida/Delete?id=' + data.idMedida).then(response => {
                        if (response.code == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.code == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getMedidas();
                            return
                        }
                    })

                }
            })
        }

        $("#agregar").on('hide.bs.modal', e => {
            $scope.get();
            $scope.data = {};
        })
    }
})(window.angular);