(function() {
    'use strict';

    app.controller('subFamiliaCtrl', subFamiliaCtrl);

    subFamiliaCtrl.$inject = ['$scope', 'modalService', 'commonService', 'nombreModal', 'mainService', 'toastService', 'formulario'];

    function subFamiliaCtrl($scope, _modalSvc, _commonSvc, _nombreModal, mS, toast, form) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];            
        // }   
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 10,
            maxSize: 5
        }
        
        $scope.totalRecords = 0;
        $scope.recordsQuantity = [5, 10, 25, 50, 100, 200, 500]

        $scope.getSubFamilias = function() {
            try {
                showLoader();
                mS.getData('get', '/SubFamilia/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=> {
                    if (response.id == "0") {
                        hideLoader();
                        toast.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    $scope.subFamilias = JSON.parse(response.data) ||[];                
                    $scope.totalRecords = $scope.subFamilias.length > 0 ? $scope.subFamilias[0].totalRecords : 0;   
                    hideLoader();
                })
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        };

        $scope.getSubFamilias();

        $scope.pagechanged = function() {
            $scope.getSubFamilias();
        }

        $scope.changePageSize = function() {
            $scope.dataSearch.pageIndex = 1;
            $scope.getSubFamilias();
        }
      
        $scope.exportTableToExcel = () => {       
            try {
                showLoader();
                const subFamilias = $scope.subFamilias.map(item=>({
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                }))                          
                _commonSvc.exportTableToExcel({
                    arr: subFamilias,
                    fileName: 'SubFamilias'
                })               
            } catch (error) {
                hideLoader();
                console.log(error)
            }
            
        }

        $scope.openModalAdd = async function(){  
            const {subFamilia} = _nombreModal;          
            const {ModalSubFamiliaCtrl} = await import(`./../../modal/${subFamilia.MODAL_CTRL}`);
            
            const modalDialogRef = _modalSvc.openModalCustom({
                controller: ModalSubFamiliaCtrl,
                template: `SubFamilia/${subFamilia.MODAL_CSHTML}`,
                size: 'md',
            })
                        
            modalDialogRef.result.then(result=>{
                if(typeof result==='object'){
                    $scope.getSubFamilias();
                }
            });           
        }       

        $scope.openModalUpdate = async function(data){
            const {subFamilia} = _nombreModal; 
            const {ModalSubFamiliaCtrl} = await import(`./../../modal/${subFamilia.MODAL_CTRL}`);
            const modalDialogRef = _modalSvc.openModalCustom({
                controller: ModalSubFamiliaCtrl,
                template: `SubFamilia/${subFamilia.MODAL_CSHTML}`,
                size: 'md',
                params: data
            })             
            
            modalDialogRef.result.then(result=>{
                if(typeof result==='object'){
                    $scope.getSubFamilias();
                }
            });     
        }

        $scope.delete = async function({ idSubFamilia }) {
            let {isConfirmed} = await Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar esta subfamilia ahora?</small>`,
                showCinfirmButton: true,
                confirmButtonText: 'Si, eliminar',
                showCancelButton: true,
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            });
            
            if(isConfirmed){
                mS.getData('delete', '/SubFamilia/Delete?id=' + idSubFamilia).then(response => {
                    if (response.code == "0") {
                        toast.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    if (response.code == "1") {
                        toast.toastr('success', response.message, response.titleSms);
                        $scope.getSubFamilias();                        
                    }
                })
            }
        }          
    }
})(window.angular);