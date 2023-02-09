

app.controller('bodegaCtrl', bodegaCtrl)

bodegaCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService'];

function bodegaCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, toast) {
    'use strict'
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    }
              
    $scope.bodegas = [];    
    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10
    }
    $scope.maxSize = 5;
    $scope.totalRecords = 0;  
    $scope.recordsQuantity = [5, 10, 25, 50]

    $scope.getBodegas = async()=> {
        try {
            showLoader();
            await _mS.getData('get', '/Bodega/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
                if (response.id == "0") {                    
                    console.warn(response)
                }
                $scope.bodegas      = JSON.parse(response.data) || []          
                $scope.totalRecords = $scope.bodegas.length > 0 ? $scope.bodegas[0].totalRecords : 0;    
                console.log($scope.bodegas)            
            })            
        } catch (error) {
           console.log(error) 
        }finally{
            hideLoader();
        }      
    }
    $scope.getBodegas();

    $scope.pagechanged = ()=>$scope.getBodegas();
    

    $scope.changePageSize = ()=> {
        $scope.dataSearch.pageIndex = 1;
        $scope.getBodegas();
    }

    $scope.openModalNew = async()=>{
        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.bodega;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        $scope.openModalParam({
            controller,
            template,
            params: {
                tipoRegistro: 'N'
            }            
        })
    }

    $scope.openModalUpdate = async(item)=>{
        let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.bodega;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
        let template   = MODAL_EDITAR['template'];
        $scope.openModalParam({
            controller,
            template,
            params: {
                data: item,
                tipoRegistro: 'E'
            }            
        })
    }

    $scope.openModalParam = async({controller, template, size='md', params})=>{
        _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params
        }).result.then(response=>{
            if(typeof response==='object'){
                $scope.getBodegas();
            }            
        })
    }   

    $scope.askToDelete = async(item)=> {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger ml-2'
            },
            buttonsStyling: false
          })
          
        let {isConfirmed} = await swalWithBootstrapButtons.fire({
            title: '<small>Eliminar Bodega</small>',
            html: '<small>Esta seguro de eliminar este bodega ahora?</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: false,
            allowOutsideClick:false
        })
        
        if (isConfirmed) {
            _mS.getData('delete','/Bodega/Delete?id=' + item.idBodega).then(response => {
                if (response.code == "0") {
                    toast.toastr('warning', response.message, response.titleSms);                    
                }
                if (response.code == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getBodegas();                    
                }
            })
        }
        
    }
}

