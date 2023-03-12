

app.controller('proformaCtrl', proformaCtrl);

proformaCtrl.$inject = ['$scope', '$filter',  'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario' ]

function proformaCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS){

    let accion = JSON.parse(localStorage.getItem("accion"));
    if (accion === null) {
        location.href = "/Home/Index";
        return
    } else { 
        $scope.accion = accion[0];
    }

    const TIPO_DOC_PR = _commonSvc.tipoDoc['PR'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 10000
    }

    $scope.clienteFiltro = {}
    $scope.usuarioSearchFiltro = {};
    $scope.mes = new Date().getMonth() + 1;
    $scope.proformas = [];


    $scope.sumarColumnaTotal = function(){
        let total = $scope.proformas.map(val=>val.total).reduce((acc, curr)=>acc + curr, 0);
        return _fS.roundNumber(total, 5);
    }



    $scope.getProformas = async()=>{
    
        try {
            showLoader();   
            if($scope.dataSearch.checkBoxCliente ||
                $scope.dataSearch.checkBoxFecha || 
                $scope.dataSearch.checkBoxUsuario){              
                    $scope.dataSearch.checkBoxDefault = false
                }else{                                
                    $scope.dataSearch.checkBoxDefault = true;
                } 
                
            await _mS.getData('get', '/Proforma/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{                              
                if(response.id==='0'){
                    $scope.proformas = []
                    console.warn(response)
                    return

                }
                $scope.proformas = JSON.parse(response.data) || [];      
                $scope.cloneProformas = JSON.parse(JSON.stringify($scope.proformas));
                $scope.total = $scope.sumarColumnaTotal();           
            })
            
        } catch (error) {

            console.log(error)

        }finally{
            hideLoader();
        }
    }    

    $scope.initiload = ()=>{
        _commonSvc.getEstabAsign().then(response=>{            
            $scope.establecimientos = response;
            let codEstab = $scope.establecimientos.length>0? $scope.establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getProformas();
            
        })
    }
    $scope.initiload();



    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.proforma;
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

    
    $scope.openModalFiltro = async()=>{

        let {MODAL_FILE_CTRL, MODAL_FILTRO} = _nombreModalConst.proforma;
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
                $scope.getProformas();
            }
        })
    }


    
    $scope.searchLocalProforma = function(){
        let proformas = JSON.parse(JSON.stringify($scope.cloneProformas));                          
        $scope.proformas = $filter('filter')(proformas, $scope.dataSearch.bySearch);
        $scope.total = $scope.sumarColumnaTotal();            
    }
    

    $scope.openModalDetalle = async(item)=>{

        let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.proforma;
        let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
        let template   = MODAL_DETALLE['template'];
        let response = await _commonSvc.getDataTipoDocVenta({
            id: item.idProforma,
            codigoDocumento: TIPO_DOC_PR.codigo
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
    }

    $scope.openModalEdit = async(item)=>{
        try {
            showLoader();
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.proforma;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];
            let template   = MODAL_EDITAR['template'];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idProforma,
                codigoDocumento: TIPO_DOC_PR.codigo
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

    $scope.openModalDuplicate = async(item)=>{
        try {
            showLoader();
            let {MODAL_FILE_CTRL, MODAL_DUPLICAR} = _nombreModalConst.proforma;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DUPLICAR['controller']];
            let template   = MODAL_DUPLICAR['template'];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idProforma,
                codigoDocumento: TIPO_DOC_PR.codigo
            })

            if(!response.isComplete) return
            
            let params = {
                TIPO_REGISTRO: 'DUPLICAR',
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
                $scope.getProformas();
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
                title: '<small>Anular Proforma?</small>',
                html: `<small>Esta Ud. seguro/a de anular este Documento <b>N° ${item.nroDocumento}</b></small>?`,
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
                    didOpen: () => {
                        Swal.showLoading();
                        _mS.getData('delete', '/Proforma/Delete?id=' + item.idProforma).then(response=> {
                            Swal.close()
                            if (response.code === "0") {
                                _fS.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.code === "1") {
                                _fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                $scope.getProformas();
                            }
                        })
                    }
                })
            }
        } catch (error) {
            Swal.close();
            console.log(error)
        }finally{

        }

    }



    $scope.askToSendEmail = async (item) =>{ 
        try { 
            let params = {
                TYPE_NOTIFICATION: 'N',
                serie: item.nroDocumento,
                correo: item.correo, 
                subject: 'Documento Proforma - Acontplus N°: ' + item.nroDocumento,
                json: {                                      
                    hasFile: true, 
                    isReport: "SI", 
                    reportParams: {
                        codEstab: item.codEstab, 
                        codigo: "PR", 
                        format: "pdf"
                    }, 
                    spParams: {
                        id: item.idProforma
                    }
                }
            }                    
            
           
            const { MODAL_SEND_MAIL_CTRL, MODAL_SEND_MAIL_CSHTML } = _nombreModalConst.common;
            const { SendMailCtrl } = await import('./../../modal/' + MODAL_SEND_MAIL_CTRL);
            _modalSvc.openModalCustom({
                controller: SendMailCtrl,
                template: 'Shared/' + MODAL_SEND_MAIL_CSHTML,
                size: 'md',
                params
            })
        } catch (error) {
            console.error(error)
        } 
    }



    //Reporte 
    $scope.getReport = function (item) {
        
        let format = 'pdf';

        let dataParms = {
            id: item.idProforma ,
            codEstab: item.codEstab           
        }
       
        const parameters = {
            reportParams: JSON.stringify({
                codigo: 'PR', 
                format,
                aditionalParams: [                    
                ]
            }),
            dataParams: JSON.stringify(dataParms),
            sendEmail: false
        }

        console.log(parameters)

        _commonSvc.getReport({
            parameters,
            formatType: format
        })                                                
    }

}
