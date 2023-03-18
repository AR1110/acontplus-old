
app.controller('compraNoHabitualCtrl', compraNoHabitualCtrl);


compraNoHabitualCtrl.$inject = ['$scope', 'commonService', 'mainService', 'toastService', 'modalService', 'nombreModal', 'formulario', 'toastService']


function compraNoHabitualCtrl($scope, commonSvc, mS, tS, modalSvc, nombreModal, _fS, _tS){
    
    //Variables Generales
    const {MODAL_FILE_PATH} = nombreModal.compra_no_habitual; 
    const {MODAL_NUEVO, MODAL_EDITAR, MODAL_DETALLED} =nombreModal.compra_no_habitual;
    
    //Filtro 
    $scope.dataSearch = {
        checkBoxFecha: true,
    };
    $scope.meses = _fS.meses();
    $scope.mes = new Date().getMonth() + 1;
    $scope.proveedorFilter = {};
    
    $scope.estadoDocs = [
        {estado: 'AC', descripcion: 'Activo'} ,{estado: 'A', descripcion: 'Anulado', }
    ]
    $scope.openModalFiltro = ()=>{        
        $("#modalFiltro").modal('show');        
    }

    $scope.onChangeFechaFiltro =()=>{
        $scope.dataSearch.tipoFecha = 'FE';
        $scope.mes = new Date().getMonth() +1;
        $scope.getFechaInicioFinFilter($scope.mes)
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Buscador AVanzado
    $scope.getFechaInicioFinFilter = function(mes) {
        if(!mes){
            $scope.dataSearch.fechaInicio = new Date();
            $scope.dataSearch.fechaFin = new Date()       
        }else{
            let { fechaInicio, fechaFin } = _fS.getFechaInicioFinFilter(mes);
            $scope.dataSearch.fechaInicio = fechaInicio;
            $scope.dataSearch.fechaFin = fechaFin;
        }
    }
    $scope.getFechaInicioFinFilter()
        
    //-------------------------------------------Proveedor filter------------------------------
    $scope.searchProveedorFilter = (textSearch)=> {
        return commonSvc.proveedorSearch(textSearch);
    }

    $scope.proveedorFilte={};
    $scope.searchProveedorFilterChange = function(item) {                  
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor        
    }

    //Busqueda Avanzada 
    $scope.busquedaAvanzada =()=> {     
        if ($scope.dataSearch.checkBoxProveedor) {
            if (_fS.campo($scope.dataSearch.byProveedor)) {
                _tS.toastr('warning', 'Por favor seleccione el Proveedor');
                return;
            };
        }

        if ($scope.dataSearch.checkBoxFecha) {
            if (_fS.campo($scope.dataSearch.fechaInicio)) {
                _tS.toastr('warning', 'Por favor seleccione la Fecha Inicio');
                return;
            };
            if (_fS.campo($scope.dataSearch.fechaFin)) {
                _tS.toastr('warning', 'Por favor seleccione la Fecha Fin');
                return;
            };
        }

        console.log($scope.dataSearch.byEstado)
        if ($scope.dataSearch.checkBoxEstado) {
            if ($scope.dataSearch.byEstado===null || $scope.dataSearch.byEstado===undefined) {
                _tS.toastr('warning', 'Por favor seleccione el Estado');
                return
            }
        }
                
        $scope.getComprasNoHabitual();
        $("#modalFiltro").modal('hide');                     
    }
    
    
    
    
    /**
     * 
     * @param {object} {controller, template, params}
     */
    $scope.openModal = ({controller, template, params, isRenderRazorPartial})=>{
        let modalRef = modalSvc.openModalCustom({controller, template, params, size:'xl', windowClass:'uibModalFullScreen', isRenderRazorPartial})

        modalRef.result.then(result=>{
            if(typeof result === 'object'){
                $scope.getComprasNoHabitual();
            }
        })
    }


    //Formulario Nuevo
    $scope.openModalNew = async ()=>{
        console.log(MODAL_FILE_PATH)
        let modalParms = {
            controller: (await import('./../../' + MODAL_FILE_PATH))[MODAL_NUEVO['controller']],
            template:  MODAL_NUEVO['template'],
            params: {
                data: {}
            },
            isRenderRazorPartial: true
        }      
       
        $scope.openModal(modalParms)                
    }

    //Formulario Nuevo
    $scope.openModalEditar = async (item)=>{
        try {

            let modalParams = {
                controller: (await import('./../../' + MODAL_FILE_PATH))[MODAL_EDITAR['controller']],
                template:  MODAL_EDITAR['template'],
                isRenderRazorPartial: true
            }
            
            mS.getData('get', 'CompraNoHabitual/' + JSON.stringify({ idDocumentoIngreso : item.idDocumentoIngreso ,typeList : 4 }), null, true).then(response=>{
                if(response.code==="0"){
                    console.log(response)
                    hideLoader();
                }
    
                if(response.code==="1"){
                    
                    modalParams.params = JSON.parse(response.payload);
                    $scope.openModal(modalParams) 

                    hideLoader();
                }
            })
        } catch (error) {
            console.log(error)
        }
       
       
                       
    }


    //Obtenemos Datos 
    $scope.getComprasNoHabitual = ()=>{
        try {
            showLoader();

            let json =JSON.stringify ({
                typeList : 1,
                checkBoxFecha: true,
                checkBoxEstab : $scope.dataSearch.checkBoxEstab,
                checkBoxProveedor : $scope.dataSearch.checkBoxProveedor,
                checkBoxEstado : $scope.dataSearch.checkBoxEstado,
                dateStart : $scope.dataSearch.fechaInicio,
                dateEnd : $scope.dataSearch.fechaFin,
                codEstab : $scope.dataSearch.codEstab,
                idProveedor : $scope.dataSearch.byProveedor,
                estado : $scope.dataSearch.byEstado,
            });

            $scope.documentoIngreso = [];
            mS.getData('get', 'CompraNoHabitual/' + json, null, true).then(response=>{
                if(response.code==="0"){
                    console.log(response)
                    hideLoader();
                }

                if(response.code==="1"){
                    $scope.documentoIngreso = JSON.parse(response.payload)[0] || []; //
                    hideLoader();
                }
            })

        } catch (error) {
            $scope.documentoIngreso = [];
            console.log(error)
        }
    }


    //Cancelar un Documento
    $scope.askToDelete = async(item)=>{
        console.log('delet')
        try {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await  swalWithBootstrapButtons.fire({
                title: '<small>Anular Compra no Habitual?</small>',
                html: `<small>Esta Ud. seguro/a de anular esta Compra No Habitual <b>N° ${item.serieComprobante}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false
            })
    
            if(isConfirmed){              
                mS.getData('put', 'CompraNoHabitual/Cancel/' + item.idDocumentoIngreso,null,true).then(response=> {
               
                    if (response.code === "0") {
                        _fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        _fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        $scope.getComprasNoHabitual();
                    }
                })
            }
        } catch (error) {
            Swal.close();
            console.log(error)
        }finally{

        }

    }

    $scope.initiload = ()=>{
        try {
            commonSvc.getEstabAsign().then(response=>{  
                $scope.establecimientos = response;
                let codEstab = $scope.establecimientos.length>0 ? $scope.establecimientos[0].codEstab: 0;            
                $scope.dataSearch.codEstab = codEstab;
                $scope.getComprasNoHabitual();
            })
        } catch (error) {
            console.log(error);
        }
    }
    $scope.initiload();

   

}