
app.controller('notaCreditoClienteCtrl', notaCreditoClienteCtrl);

notaCreditoClienteCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService']

function notaCreditoClienteCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS){

    'use strict';

    let accion = JSON.parse(localStorage.getItem("accion"));

    if (accion === null) {
        location.href = "/Home/Index";
        return
    } else {
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['NC'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }

    $scope.clienteFiltro = {}
    $scope.usuarioSearchFiltro = {};

    $scope.meses = _fS.meses();
    $scope.mes = new Date().getMonth() + 1;
    $scope.notaCreditos = [];

    //---------------------------------Busqueda Avanzada ----------------------------------
    $scope.opemModalFiltroNotaCredito = ()=> {
        $("#modalFiltroNotaCredito").modal('show');        
    }

     /**
     * 
     * @param {string} textSearch 
     * @returns 
     */
    $scope.clienteSearch = function(textSearch){
        try {            
            return _commonSvc.clienteSearch(textSearch);   
            
        } catch (error) {
            console.log(error)
        }
    }

    $scope.onChangeFechaFiltro=()=>{
        $scope.dataSearch.tipoFecha = 'FE';
        $scope.mes = new Date().getMonth() + 1;
        $scope.getFechaInicioFinFilter($scope.mes)
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Buscador AVanzado
    $scope.getFechaInicioFinFilter = function (mes) {
        let { fechaInicio, fechaFin } = _fS.getFechaInicioFinFilter(mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
    }

    //----------------------------------CLIENTE FILTRO------------------------------
    $scope.clienteFiltro = {};
    $scope.onKeyupClienteSearchFiltro = ()=>{
        if(_fS.campo($scope.clienteFiltro.nombreFiscal)){
            $scope.clienteFiltro  = {};
            $scope.dataSearch.byCliente = null;
        } 
    }

    $scope.selectedClienteSearchFiltro = (item) => {
        $scope.dataSearch.byCliente = item.idCliente;
    }

    

    //Busqueda Avanzada 
    $scope.busquedaAvanzada = function () {
        if (_fS.campo($scope.dataSearch.codEstab)) {
            _tS.toastr('warning', 'Por favor seleccione el Establecimiento');
            return;
        };
        if ($scope.dataSearch.checkBoxCliente) {
            if (_fS.campo($scope.dataSearch.byCliente)) {
                _tS.toastr('warning', 'Seleccione el Cliente');
                return;
            };
        }
        
        if ($scope.dataSearch.checkBoxFecha) {
            if (_fS.campo($scope.dataSearch.fechaInicio)) {
                _tS.toastr('warning', 'Ingrese la Fecha Inicio');
                return;
            };
            if (_fS.campo($scope.dataSearch.fechaFin)) {
                _tS.toastr('warning', 'Ingrese la Fecha Fin');
                return;
            };
        };
        
        if ($scope.dataSearch.checkBoxEstado) {
            if (_fS.campo($scope.dataSearch.byEstado)) {
                _tS.toastr('warning', 'Por favor seleccione el Estado');
                return
            }
        }            
        $scope.getNotaCreditos();
        $("#modalFiltroNotaCredito").modal('hide');        
    }

    $scope.getNotaCreditos = async()=>{
        try {
            showLoader();
               
            if($scope.dataSearch.checkBoxCliente ||
                $scope.dataSearch.checkBoxFecha || 
                $scope.dataSearch.checkBoxUsuario || 
                $scope.dataSearch.checkBoxEstado){              
                    $scope.dataSearch.checkBoxDefault = false
                }else{                                
                    $scope.dataSearch.checkBoxDefault = true;
                }

            await _mS.getData('get', '/NotaCreditoCliente/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.code==="0"){
                    $scope.notaCreditos = [];
                    console.warn(response.message);
                    return
                }
                $scope.notaCreditos = JSON.parse(response.data) || []
                console.log(response)
            })
        } catch (error) {

            console.log(error)

        }finally{

            hideLoader();

        }
    }

    $scope.initiload = ()=>{
        _mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
            let results = JSON.parse(response.payload) || [];
            $scope.establecimientos = results[0];
            let codEstab = $scope.establecimientos.length>0?$scope.establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getNotaCreditos();
        })

        _commonSvc.getEstadoDocByCodDoc('NC').then(response=>{
            $scope.estadoPagos = response;
        })  

    }
    $scope.initiload();

    $scope.openModalFiltro = async()=>{
        
        let {MODAL_FILE_CTRL, MODAL_FILTRO} = _nombreModalConst.nota_entrega;
        let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_FILTRO['controller']];
        let template   = MODAL_FILTRO['template'];

        let params = {
            dataSearch: $scope.dataSearch,
            clienteFiltro: $scope.clienteFiltro,
            usuarioSearchFiltro: $scope.usuarioSearchFiltro,
            mes: $scope.mes
        }
        
        let modalRef = _modalSvc.openModalCustom({
            controller,
            template,
            params,
            size:'lg'
        })
        
        modalRef.result.then(result=>{
            let {dataSearch, clienteFiltro, usuarioSearchFiltro, mes, isSearch} = result;
            $scope.dataSearch = dataSearch;
            $scope.clienteFiltro = clienteFiltro;
            $scope.usuarioSearchFiltro =  usuarioSearchFiltro;
            $scope.mes = mes;
            if(isSearch){
                $scope.getNotaCreditos();
            }
        })
    }


    $scope.openModalNew = async()=>{
        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.nota_credito_cliente;
        let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        let params = {
            TIPO_REGISTRO: 'NUEVO'
        }
        $scope.openModalParam({
            controller,
            template,
            params
        })
    }
   

    $scope.openModalDetalle = async(item)=>{
        try {
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.nota_entrega;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
            let template   = MODAL_DETALLE['template'];
            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idNotaCredito,
                codigoDocumento: TIPO_DOC.codigo
            })

            if(!response.isComplete) return

            let params = {
                TIPO_REGISTRO: 'DETALLE',
                data: response
            }
            
            $scope.openModalParam({
                controller,
                template,
                params
            })
        } catch (error) {
            console.log(error)
        }
    }

    $scope.openModalEdit = async(item)=>{
        try {
            showLoader();            
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.nota_entrega;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
            let template   = MODAL_EDITAR['template'];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idNotaEntrega,
                codigoDocumento: TIPO_DOC_NE.codigo
            })

            
            if(!response.isComplete) return
            
            let params = {
                TIPO_REGISTRO: 'EDITAR',
                data: response
            }
            $scope.openModalParam({
                controller,
                template,
                params
            })
        } catch (error) {
         
            console.log(error)
        }finally{
            hideLoader();
        }        
    }

    $scope.openModalParam = ({controller, template, size='xl', params})=>{

        _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params,
            windowClass: 'uibModalFullScreen'
        }).result.then(result=>{  
            console.log(result)          
            if(typeof result==='object'){
                $scope.getNotaCreditos();
            }
        })
    }


    $scope.askToDelete = async(item)=>{
        try {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await  swalWithBootstrapButtons.fire({
                title: '<small>Anular Nota Credito?</small>',
                html: `<small>Esta Ud. seguro/a de anular este documento <b>N° ${item.nroDoc}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false
            })
    
            if(isConfirmed){
                Swal.fire({
                    title: `<small>Espere</small>`,
                    html: 'Anulando...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: async () => {
                        Swal.showLoading();
                        await _mS.getData('delete', '/NotaCreditoCliente/Delete?id=' + item.idNotaCredito).then(response=> {
                            console.log(response)
                            if (response.id === "0") {
                                _fS.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.id === "1") {
                                _fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                $scope.getNotaCreditos();
                            }
                        })
                    }
                })
            }
        } catch (error) {          
            console.log(error)
        }finally{
            Swal.close()
        }

    }


    $scope.getReport = (item)=>{
        try {
                           
            let format = 'pdf';
            let dataParms = {
                id: item.idNotaCredito,            
                codEstab: item.codEstab,
                codigo: 'RNCC', 
                format,            
            }
               
            const parameters = {               
                dataParams: JSON.stringify(dataParms)
            }       
            
            _commonSvc.getReportDynamic({parameters, format})
        } catch (error) {
            console.log(error)
        }        
    }


}