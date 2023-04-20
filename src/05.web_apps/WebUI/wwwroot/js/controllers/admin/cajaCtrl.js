app.controller('cajaCtrl', cajaCtrl);

cajaCtrl.$inject = ['$scope', 'modalService', 'nombreModal', 'mainService', 'modalService', 'toastService'];

function cajaCtrl($scope, _modalSvc, _nombreModal, mS, _modalSvc, toast) {
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if(accion===null){
    //     location.href = "/Home/Index";
    // }else{
    //     $scope.accion = accion[0];
    // }

    const GESTION_CAJA_CTRL = './gestionCajaCtrl.min.js';
    
    $scope.data = {};
    $scope.entidadFinanciera = {};
    $scope.cajas = [];
    $scope.usuarioCaja = {};
    
    //Pagination 
    $scope.maxSize = 5;
    $scope.totalRecords = 0;
    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.recordsQuantity = [5, 10, 25, 50];

    $scope.getCajas = function() {
        try {
            showLoader();
            mS.getData('get', '/Caja/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == 0) {
                    hideLoader();
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }
                $scope.cajas = response.data;                              
                hideLoader();
            }).catch(error=>{
                console.log(error);
            })         
        } catch (error) {
            hideLoader();
            console.error(error)            
        }
       
    }

    $scope.getCajas();

    $scope.pagechanged = function() {
        $scope.getCajas();
    }
    $scope.changePageSize = function() {
        $scope.pageIndex = 1;
        $scope.getCajas();
    }
    

    $scope.openModalCaja = async(item)=>{        
        const {MODAL_CTRL, MODAL_CAJA_CSHTML} = _nombreModal.caja;        
        const {ModalCajaCtrl} = await import('./../../modal/' + MODAL_CTRL);
        const modalRef = _modalSvc.openModalCustom({
            controller: ModalCajaCtrl,
            template: MODAL_CAJA_CSHTML,
            size: 'md',
            params: item
        })             
        modalRef.result.then(result=>{
            if(typeof result==='object'){
                $scope.getCajas();
            }
        })
    }

    $scope.detalleHorario = (idTurno)=>{  
        $scope.horarios=[];
        mS.getData('get', '/Horario/GetByIdTurno?idTurno=' + idTurno).then(response => {                
            $scope.horarios = response.data;
        })
    }
   

    $scope.askToDeleteCaja = async (data)=>{
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',            
            html: `<small>Esta seguro/a de eliminar esta caja ahora?</small>`,
            showDenyButton: true,
            confirmButtonText: `Si, eliminar`,
            denyButtonText: `No, cancelar`,
            allowOutsideClick: false
        })
        
        if (isConfirmed) {
            mS.getData('delete', '/Caja/Delete?idCaja=' + data.caja.idCaja).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);                    
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getCajas();                    
                }
            })                     
        }
    }



    //----------------------------APERTURA DE CAJA----------------------------------------------
    $scope.openModalApertura = async(data)=> {
        const {MODAL_CTRL, MODAL_APERTURA_CAJA_CSHTML} = _nombreModal.caja;        
        const {ModalAperturaCtrl} = await import('./../../modal/' + MODAL_CTRL);
        const modalRef = _modalSvc.openModalCustom({
            controller: ModalAperturaCtrl,
            template: MODAL_APERTURA_CAJA_CSHTML,
            size: 'md',
            params: data
        })                                 
        modalRef.result.then(result=>{
            if(typeof result==='object'){
                $scope.getCajas();
            }
        })            
    }      



    //----------------------------------Asignacion de Usuario/Turno -------------------------------
    $scope.openModalAsignUsuarioTurno = async(data)=> {
        const {MODAL_CTRL, MODAL_ASIGNACION_USUARIO_CAJA_CSHTML} = _nombreModal.caja;        
        const {ModalAsignacionUsuarioTurnoCtrl} = await import('./../../modal/' + MODAL_CTRL);        
        const modalRef = _modalSvc.openModalCustom({
            controller: ModalAsignacionUsuarioTurnoCtrl,
            template: MODAL_ASIGNACION_USUARIO_CAJA_CSHTML,
            size: 'md',
            params: data
        })                                
        modalRef.result.then(result=>{
            if(typeof result==='object'){
                $scope.getCajas();
            }
        })                                         
    }

    
    //----------------------------------------MOVIMIENTO CAJA -------------------------------------
    $scope.openModalMovimientoCaja = async(idCaja)=>{     
        const {MODAL_CTRL, MODAL_MOVIMIENTO_CAJA_CSHTML} = _nombreModal.caja;        
        const {MovimientoCajaCtrl} = await import('./../../modal/' + MODAL_CTRL);        

        const modalRef = _modalSvc.openModalCustom({
            controller: MovimientoCajaCtrl,
            template: MODAL_MOVIMIENTO_CAJA_CSHTML, 
            size: 'xl',
            params: {
                idCaja                
            }
        })                                
        modalRef.result.then(result=>{

            if(result){
                $scope.getCajas();
            }
        })                                 
    }

        

    
}
