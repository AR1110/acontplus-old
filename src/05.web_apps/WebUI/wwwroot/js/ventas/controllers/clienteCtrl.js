app.controller('clienteCtrl', clienteCtrl);
    
clienteCtrl.$inject=['$scope','mainService', 'modalService', 'nombreModal', 'toastService',];

function clienteCtrl($scope, _mS, _modalSvc, _nombreModal, toast){
    'use strict';
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if(accion===null){
    //     location.href = "/Home/Index";
    // }else{
    //     $scope.accion = accion[0];
    // }   


    const appUrl="/Cliente/";  

     
    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 1000;
    $scope.recordsQuantity = [10, 25, 50, 100, 500, 1000];
    
    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 100    
    }

    $scope.onKeyupSearchCliente = ()=>{                        
        $scope.getClientes();
    }

    $scope.resetList = ()=>{
        $scope.dataSearch.bySearch = null;
        $scope.getClientes();
    }

    
    $scope.getClientes = ()=> {       
        try {  
            showLoader();
            $scope.dataSearch.bySearch || null;
            $scope.clientes = [];
            _mS.getData('get', appUrl+ 'Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if (response.id == 0) {                                               
                    $scope.clientes = [];
                    hideLoader();
                    console.log(response);
                    return 
                }
                $scope.clientes = JSON.parse(response.payload) || [];
                $scope.totalRecords = $scope.clientes.length > 0? $scope.clientes[0].totalRecords:0                                        
                hideLoader();
            })                         
        } catch (error) {            
            console.log(error)   
            hideLoader();
        }
        
    }
    $scope.getClientes();
    
    $scope.openModal = async(item)=>{
        const {MODAL_CTRL, MODAL_CSHTML} = _nombreModal.cliente;
        const {ModalClienteCtrl} = await import('./../../modal/' + MODAL_CTRL);
        const modalRef =_modalSvc.openModalCustom({
            controller: ModalClienteCtrl,
            template: 'Cliente/'+ MODAL_CSHTML,
            size: 'xl',
            params: item
        }) 

        modalRef.result.then(res=>{
            if(typeof res==='object'){
                $scope.getClientes();
            }
        })
    }

    //Eliminar Cliente       
    $scope.eliminarCliente = async(data)=> {                
        let {isConfirmed} = await Swal.fire({            
            html: `<small>Esta Ud. seguro de Inactivar al Cliente <b>${data.nombreFiscal}</b></small>?`,
            icon: 'warning',
            showConfirmButton:true,
            confirmButtonText: 'Sí, Inactivar!',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar!',
            allowOutsideClick: false,                
        })
        
        
        if (isConfirmed) {
            let response = await _mS.getData('delete', appUrl + 'Delete?idCliente=' + data.idCliente);
            
            if (response.id === "0") {
                toast.toastr('warning', response.message, response.titleSms);                    
            }
            if (response.id === "1") {
                toast.toastr('success', response.message, response.titleSms);
                $scope.getClientes();
            }            
        }  
        
    }
}
