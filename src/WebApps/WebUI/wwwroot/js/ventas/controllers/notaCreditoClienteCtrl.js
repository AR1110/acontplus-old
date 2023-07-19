
app.controller('notaCreditoClienteCtrl', notaCreditoClienteCtrl);

notaCreditoClienteCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'decodeToken']

function notaCreditoClienteCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, decodeToken){

    'use strict';

    const TIPO_DOC = _commonSvc.tipoDoc['NC'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }

    $scope.cliente = {

    }
    let idUsuarioRol = Number(decodeToken.idUsuarioRol)

    //---------------------------------Busqueda Avanzada ----------------------------------
    //========================Start Filters=================

    $scope.resultRangeFilter = function (item) {
        $scope.dataSearch.fechaInicio = item.startDate,
        $scope.dataSearch.fechaFin = item.endDate
        $scope.getNotaCreditos();
    }



    $scope.onKeyupCliente = function(e) {
        if(!$scope.cliente.nombreCliente){
            $scope.dataSearch.idCliente = 0;
        }
    }
    $scope.onSelectCliente = function(item) {
        $scope.dataSearch.idCliente = item.idCliente;
        $scope.getNotaCreditos();
    }

    $scope.usuarioSearch = function (textSearch) {
        try {
            let query = {
                idRol: idUsuarioRol,
                busqueda: textSearch
            }

            if (query.busqueda.length > 2) {
                return _commonSvc.usuarioSearch(query)
                    .catch(error => {
                        console.log(error);
                        throw error;
                    })
            }
        } catch (error) {
            console.log(error);
        }
    }

    $scope.onKeyupUsuarioSearch = function () {
        if (!$scope.modelNombreCompleto) {
            $scope.dataSearch.byUsuario = 0;
        }
    }

    $scope.selectedUsuarioSearch = function (item) {
        $scope.dataSearch.byUsuario = item.idUsuario;
    }

    $scope.onClickBtnMore = function () {
        $scope.moreSearchOptions = !$scope.moreSearchOptions;
    }

    $scope.searchFilterLocal = function () {
        let notaCreditos = JSON.parse(JSON.stringify($scope.cloneNotaCreditos));
        $scope.notaCreditos = $filter("filter")(notaCreditos, $scope.dataSearch.bySearch);
        // $scope.calculoColumnTotal();
    }

    //=====================Eend Filters=======================

    $scope.getNotaCreditos = function(){
        try {
            showLoader();
            		   

            let dataSearch = {
                codEstab: $scope.dataSearch.codEstab,
                checkBoxDefault: false,
                checkBoxCliente: $scope.dataSearch.idCliente > 0,
                byCliente: $scope.dataSearch.idCliente,
                checkBoxFecha: true,
                checkBoxUsuario: $scope.dataSearch.byUsuario > 0,
                byUsuario: $scope.dataSearch.byUsuario,
                checkBoxEstado: $scope.dataSearch.codEstado ? true : false,
                codEstado: $scope.dataSearch.codEstado,
                fechaInicio: _fS.formatDateMoment($scope.dataSearch.fechaInicio),
                fechaFin: _fS.formatDateMoment($scope.dataSearch.fechaFin)
            }


                $scope.notaCreditos = [];
            _mS.getData('get', '/NotaCreditoCliente/Get?json=' + JSON.stringify(dataSearch)).then(response=>{
                hideLoader();
                console.log(response);
                if(response.code==="0" || response.id==="0"){
                    $scope.notaCreditos = [];
                    console.warn(response.message);                    
                }
                if(response.code==="1" || response.id==="1"){
                    $scope.notaCreditos = JSON.parse(response.data) || [];
                    $scope.cloneNotaCreditos = JSON.parse(JSON.stringify($scope.notaCreditos))                
                }
            })
        } catch (error) {
            hideLoader();
            console.log(error)

        }        
    }

    $scope.initiload = ()=>{
        _commonSvc.getEstabAsign().then(response=>{                        
            $scope.establecimientos = response;
            let codEstab = $scope.establecimientos.length>0?$scope.establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getNotaCreditos();
            
        })
        
        _commonSvc.getEstadoDocByCodDoc('NC').then(response=>{
            $scope.estadoDocumentos = response;
        })  

    }
    $scope.initiload();

   
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
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.nota_credito_cliente;
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

    $scope.openModalEditar = async(item)=>{
        try {
            showLoader();            
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.nota_credito_cliente;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
            let template   = MODAL_EDITAR['template'];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idNotaCredito,
                codigoDocumento: TIPO_DOC.codigo
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