app.controller('usuarioCtrl', usuarioCtrl);

usuarioCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService'];

function usuarioCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, toast) {
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    }        
    
    $scope.dataSearch = {
        idRol: document.getElementById('idRol').value,
        pageIndex: 1,
        pageSize: 100
    }

    $scope.maxSize = 5;
    $scope.totalRecords = 0;   
    $scope.recordsQuantity = [5, 10, 25, 50]

    $scope.getUsuarios = function() {
        try {
            _commonSvc.getDataApi({
                method:'get',
                url: `apiCliente/Usuario/Get/${JSON.stringify($scope.dataSearch)}`,
                typeUrl: 1
            }).then(response=>{
                if (response.id == 0) {                    
                   console.warn(response)
                }
                $scope.usuarios = JSON.parse(response.data);
                $scope.$apply();
            }).catch(error=>{                
                let msg = error.config?error.config.url: error
                console.error(msg)
            })
        } catch (error) {
            console.log(error)            
        }

    }
    $scope.getUsuarios();
    $scope.pagechanged = function() {
        $scope.getUsuarios()
    }
    $scope.changePageSize = function() {
        $scope.dataSearch.pageIndex = 1;
        $scope.getUsuarios();
    }

    $scope.openModalUserNew = async()=>{
        let {MODAL_CTRL, MODAL_NUEVO} = _nombreModalConst.user;
        let controller = (await import('./../../' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        let params = {
            tipoRegistro: 'N'
        }
        $scope.openModalParam({
            controller, 
            template,   
            params           
        })
    }

    $scope.openModalUserEdit = async(item)=>{
        let {MODAL_CTRL, MODAL_EDIT} = _nombreModalConst.user;
        let controller = (await import('./../../' + MODAL_CTRL))[MODAL_EDIT['controller']];
        let template   = MODAL_EDIT['template'];
        let params = {
            data: item,
            tipoRegistro: 'E'
        }
        $scope.openModalParam({
            controller, 
            template,   
            params,
            size:'md'           
        })
    }

    $scope.openModalParam = async({controller, template, size='lg', params})=>{
        _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params
        }).result.then(result=>{
            if(typeof result==='object'){
                $scope.getUsuarios();
            }            
        })
    }

    $scope.openModalUserCompany = async(item)=>{
        let {MODAL_CTRL, MODAL_USER_COMPANY} = _nombreModalConst.user;
        let controller = (await import('./../../' + MODAL_CTRL))[MODAL_USER_COMPANY['controller']];
        let template   = MODAL_USER_COMPANY['template'];
        _modalSvc.openModalCustom({
            controller,
            template,
            size:'xl',
            params: item
        })
    }

   
    $scope.askToDelete = async(item)=>{
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ml-2'
            },
            buttonsStyling: false
        })
          
        let {isConfirmed} = await swalWithBootstrapButtons.fire({
            title: '<small>Eliminar Usuario</small>',
            html: "<small>Este proceso no puedes revertir!</small>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: false,
            allowOutsideClick:false
        })       

        if(isConfirmed){
            _mS.getData('post', '/Usuario/Delete?idUsuario=' + item.idUsuario).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);                        
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getUsuarios();                        
                }
            })
        }
    }
}




