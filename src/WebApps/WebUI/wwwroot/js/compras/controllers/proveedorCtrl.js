
app.controller('proveedorCtrl', proveedorCtrl);
proveedorCtrl.$inject=['$scope', 'mainService', 'modalService', 'nombreModal', 'toastService'];

function proveedorCtrl($scope, _mS, _modalSvc, _nombreModal, toast){    
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if(accion===null){
    //     location.href = "/Home/Index";
    // }else{
    //     $scope.accion = accion[0];
    // }

    $scope.openModalNew = async(item)=>{                    
        const {MODAL_CTRL, MODAL_NUEVO_CSHTML} = _nombreModal.proveedor;
        const {ModalProveedorCtrl} = await import(`./../../modal/${MODAL_CTRL}`);            
       
        const modalRef = _modalSvc.openModalCustom({
            controller: ModalProveedorCtrl,
            template: 'Proveedor/' + MODAL_NUEVO_CSHTML,
            size: 'xl',
            params: item
        })
        
        modalRef.result.then(response=>{
            if(typeof response === 'object'){
                $scope.getProveedores();
            }
        })
    }


    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 100
    }    

    $scope.getProveedores = ()=> {
        try {
            showLoader();
            _mS.getData('get','/Proveedor/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if (response.code === "0") {
                    hideLoader();
                    $scope.proveedores = [];
                    console.log(response.message)
                    return
                }                
                $scope.proveedores = JSON.parse(response.payload) || [];                
                $scope.totalRecords = $scope.proveedores.length>0? $scope.proveedores[0].totalRecords: 0;
                hideLoader();
            })
        } catch (error) {
            hideLoader();
            console.error(error)
        }
    }

    $scope.getProveedores();

    
    $scope.onKeyupSearchProveedor =()=>{
        $scope.getProveedores();                  
    }

    $scope.openModalEdit = async(item)=>{                    
        $scope.openModalNew(item);        
    }

    $scope.reloadProveedores = ()=>{
        $scope.dataSearch.bySearch = null;
        $scope.getProveedores();
    }

    $scope.eliminarProveedor= async(item)=>{                     
        let {isConfirmed} = await Swal.fire({
            icon:'warning',
            html:`<small>Esta Ud. seguro de eliminar el Proveedor <b>${item.nombreFiscal}</b>?</small>`,
            showConfirmButton:true,
            confirmButtonText:'Si, eliminar',
            showCancelButton:true,
            cancelButtonText:'No, cancelar',
            allowOutsideclick:false               
        })
        
        if(isConfirmed){
            _mS.getData('delete','/Proveedor/Delete?id=' + item.idProveedor).then(response=>{
                if(response.id=="0"){
                    toast.toastr('warning', response.message, response.titleSms);                        
                }
                if (response.id ==="1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getProveedores();                        
                }
            })
        }          
    }
}
