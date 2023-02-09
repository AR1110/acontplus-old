/**
 * Type Url:
 * 1=>Ip Local
 * 2=>Ip Servidor
 */
app.controller('entidadCtrl', entidadCtrl);

entidadCtrl.$inject = ['$scope', '$http', 'commonService', 'modalService', 'toastService', 'formulario'];

function entidadCtrl($scope, $http, _commonSvc, _modalSvc, toast) {
    let accion = JSON.parse(localStorage.getItem("accion"));
    if(accion===null){
        location.href = "/Home/Index";
    }else{
        $scope.accion = accion[0];
    }        
    
    const json = {
        idRol: document.getElementById('idRol').value
    }  

    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 900000000;
    $scope.recordsQuantity = [5, 10, 25, 50]      

    $scope.getEntidades = async()=>{         
        const entidades = await _commonSvc.getDataApi({
            method:'get',
            url:`apiCliente/Entidad/Get/${JSON.stringify(json)}`,
            typeUrl: 1
        }).then(response=>JSON.parse(response.data) || [])
        
        $scope.entidades = entidades           
        $scope.totalRecords = $scope.entidades.length > 0 ? $scope.entidades[0].totalRecords : 0                
        $scope.$apply()               
    }
    $scope.getEntidades();

    $scope.pagechanged = function() {
        $scope.getEntidades();
    }

    $scope.changePageSize = function() {
        $scope.pageIndex = 1;
        $scope.getEntidades();
    }

    $scope.openModal=async(item)=>{                   
        const {ModalEntidadCtrl} = await import('../../modal/admin/modalEntidadCtrl.min.js' + CHANGE_VERSION());
        const modalRef = _modalSvc.openModalSecond(ModalEntidadCtrl, 'Entidad/_ModalEntidad.cshtml', 'lg', item);
        modalRef.result.then(result=>{
            if(typeof result==='object'){
                $scope.getEntidades();
            }
        })             
    };    
    
    $scope.openModalConfigSri = async(item)=>{
        const data = Object.assign({}, item)
        data.isConfigSri = true;
        const {ModalEntidadCtrl} = await import('../../modal/admin/modalEntidadCtrl.min.js' + CHANGE_VERSION());
        const modalRef = _modalSvc.openModalSecond(ModalEntidadCtrl, 'Entidad/_ModalEntidadConfigSri.cshtml', 'lg', data);
        modalRef.result.then(result=>{
            if(typeof result==='object'){
                $scope.getEntidades();
            }
        })          
    }

    $scope.askToDelete=function(idEntidad){
        Swal.fire({
            icon: 'warning',
            html: '<small>Esta seguro de elimnar este registro ahora?</small>',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) {
                $scope.postDelete(idEntidad);                    
            }
        })
    }

    $scope.postDelete = async(idEntidad)=> {
        const {data:response} = await $http.post( '/Entidad/Delete?idEntidad', idEntidad)
        if (response.id == "0") {
            toast.toastr('warning', response.message, response.titleSms);
            return
        }
        if (response.id == "1") {
            toast.toastr('success', response.message, response.titleSms);
            $scope.getEntidades();            
        }        
    }      
}

