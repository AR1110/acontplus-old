

app.controller('notaEntregaCtrl', notaEntregaCtrl);

notaEntregaCtrl.$inject =['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario'];

function notaEntregaCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS){
    'use strict';

    let accion = JSON.parse(localStorage.getItem("accion"));

    if (accion === null) {
        location.href = "/Home/Index";
        return
    } else {
        $scope.accion = accion[0];
    }

    const TIPO_DOC_NE = _commonSvc.tipoDoc['NE'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }

    $scope.clienteFiltro = {}
    $scope.usuarioSearchFiltro = {};
    $scope.mes = new Date().getMonth() + 1;
    $scope.notaEntregas = [];


    $scope.isPrintDocument = false; //Para impresiones termicas al registra el documento 
    $scope.parametersPrint = {};



    $scope.getTotales = function () {
        try {
            let total = 0, totalAbono = 0, totalSaldo = 0;
            for (let val of $scope.notaEntregas) {
                total += val.total;
                totalAbono += val.abono;
                totalSaldo += val.saldo;
            };
            $scope.total = _fS.roundNumber(total, 5);
            $scope.totalAbono = _fS.roundNumber(totalAbono, 5);
            $scope.totalSaldo = _fS.roundNumber(totalSaldo, 5);
        } catch (error) {
            console.log(error)
        }
    }

    $scope.getNotaEntregas = async()=>{
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

            await _mS.getData('get', '/NotaEntrega/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                $scope.notaEntregas = [];
                if(response.code==="0"){
                    $scope.getTotales();
                    console.warn(response.message);
                    return
                }
                $scope.notaEntregas = JSON.parse(response.data) || [];
                
                $scope.cloneNotaEntregas = JSON.parse(JSON.stringify($scope.notaEntregas));
                $scope.getTotales();
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
            $scope.getNotaEntregas();
            
        })

    }
    $scope.initiload();


     //Filtro de Nota de Entregas localmente 
     $scope.searchLocalNotaEntregas = function () {
        let notaEntregas = JSON.parse(JSON.stringify($scope.cloneNotaEntregas));
        $scope.notaEntregas = $filter("filter")(notaEntregas, $scope.dataSearch.bySearch);        
        $scope.getTotales();            
    }

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
                $scope.getNotaEntregas();
            }
        })
    }


    $scope.openModalNew = async()=>{
        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.nota_entrega;
        let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        let params = {
            TIPO_REGISTRO: 'NUEVO'
        }
        
        _modalSvc.openModalCustom({
            controller,
            template,
            size: 'xl',
            params,
            windowClass: 'uibModalFullScreen'
        }).result.then(result=>{  
            
            if(typeof result !=='object') return                
            
            // $scope.getNotaEntregas();

            $scope.isPrintDocument = true;
            if(result.TIPO_DOC.codigo==="FV"){
                $scope.parametersPrint = {
                    ...result.data,
                    idDocument: result.data.id,
                    codigo: 'RFPT',
                };
            }else{
                $scope.parametersPrint = {
                    ...result.data,
                    idDocument: result.data.id,
                    codigo: 'RNEPT',
                }
            }

            if(result.data.esContado){
                $scope.openModalRapido(result)
            }else{
                $scope.openModalCobroDocumento(result)
            }                                                
        })
    }
   

     /**
     * 
     * @param {*} id 
     * @returns 
     */

     $scope.getDataDocumento = (id)=>{
        return _commonSvc.getDataTipoDocVenta({
            id,
            codigoDocumento: TIPO_DOC_NE.codigo
        })
    }

    $scope.openModalDetalle = async(item)=>{
        let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.nota_entrega;
        let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
        let template   = MODAL_DETALLE['template'];
        let response = await _commonSvc.getDataTipoDocVenta({
            id: item.idNotaEntrega,
            codigoDocumento: TIPO_DOC_NE.codigo
        })

        if(!response.isComplete) return

        let params = {
            TIPO_REGISTRO: 'DETALLE',
            data: response
        }
        
        $scope.openModalInvoiceParam({
            controller,
            template,
            params
        })
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
            $scope.openModalInvoiceParam({
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
            let {MODAL_FILE_CTRL, MODAL_DUPLICAR} = _nombreModalConst.nota_entrega;
            let controller = (await import('../../' + MODAL_FILE_CTRL))[MODAL_DUPLICAR['controller']];
            let template   = MODAL_DUPLICAR['template'];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idNotaEntrega,
                codigoDocumento: TIPO_DOC_NE.codigo
            })

            if(!response.isComplete) return
            
            let params = {
                TIPO_REGISTRO: 'DUPLICAR',
                data: response
            }
           
            _modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                params,
                windowClass: 'uibModalFullScreen'
            }).result.then(result=>{  
                
                if(typeof result !=='object') return                
                
                $scope.getNotaEntregas();
    
                let parameters = {}
                if(result.TIPO_DOC.codigo==="FV"){
                    parameters = {
                        ...result.data,
                        idDocument: result.data.id,
                        codigo: 'RFPT',
                    };
                }else{
                    parameters = {
                        ...result.data,
                        idDocument: result.data.id,
                        codigo: 'RNEPT',
                    }
                }
    
                _commonSvc.askToReportII({
                    parameters: JSON.stringify(parameters)
                })   
    
                                                  
            })

        } catch (error) {
         
            console.log(error)
        }finally{
            hideLoader();
        }        

    }

    $scope.openModalInvoiceParam = ({controller, template, size='xl', params})=>{

        _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params,
            windowClass: 'uibModalFullScreen'
        }).result.then(result=>{  
                  
            if(typeof result==='object'){
                $scope.getNotaEntregas();
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
                title: '<small>Anular Nota de Entrega?</small>',
                html: `<small>Esta Ud. seguro/a de anular este Documento <b>N° ${item.nroDocumento
                }</b></small>?`,
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
                        _mS.getData('delete', '/NotaEntrega/Delete?id=' + item.idNotaEntrega).then(response=> {
                            
                            if (response.code === "0") {
                                _fS.sweetAlert('warning', response.message, response.titleSms);
                            }
                            if (response.code === "1") {
                                _fS.sweetAlert('success', response.message, response.titleSms, 1000);
                                $scope.getNotaEntregas();
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



    //--------------------------------------------------COBROS----------

    $scope.opcionCobro = (item)=>{
        
        if (item.estadoFinanciero === "Cobrada") {
            _fS.sweetAlert('warning', '<small>Este documento ya se encuentra cobrada!</small>')
            return
        }

        let params = {
            data: {
                ...item,                
                id: item.idNotaEntrega,
                codEstab: item.codEstab,                
                esContado: item.credito,                
                razonSocialComprador: item.nombreFiscal,                                         
            }  ,
            TIPO_DOC: TIPO_DOC_NE                                  
        }
        
        if(params.data.esContado){
            $scope.openModalRapido(params);
        }else{
            $scope.openModalCobroDocumento(params)
        }
    }




    $scope.openModalCobroDocumento = async(params)=>{
        let {MODAL_FILE_CTRL, MODAL_COBRO_DOCUMENTO} = _nombreModalConst.cobro;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_COBRO_DOCUMENTO['controller']];
        let template   = MODAL_COBRO_DOCUMENTO['template'];

        $scope.openModalCobro({
            controller,
            template,
            params,
            size:'xl'
        })
    }



    /**
     * 
     * @param {object} params 
     */
    $scope.openModalRapido = async(params)=>{
        
        let {MODAL_FILE_CTRL, MODAL_COBRO_RAPIDO} = _nombreModalConst.cobro;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_COBRO_RAPIDO['controller']];
        let template   = MODAL_COBRO_RAPIDO['template'];

        $scope.openModalCobro({
            controller,
            template,
            params
        })

    }

    /**
     * 
     * @param {object} param0 
     */

    $scope.openModalCobro = ({controller, template, size='lg', params})=>{
        let $modalRef = _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params
        })

        $modalRef.result.then(result=>{

            if($scope.isPrintDocument){
                $scope.getNotaEntregas()
                _commonSvc.askToReportII({
                    parameters: JSON.stringify($scope.parametersPrint)
                }) 
            }

            if(typeof result =='object') {
                $scope.getNotaEntregas();
            }
        })
    }  


    $scope.openModalCuota = async(item)=>{
        try {
            let {MODAL_FILE_CUOTA, MODAL_CUOTA_VENTA} = _nombreModalConst.cobro;
            let controller = (await import('./../../' + MODAL_FILE_CUOTA))[MODAL_CUOTA_VENTA['controller']];
            let template   = MODAL_CUOTA_VENTA['template'];

            let params = {}
            
            let response = await _mS.getData('get', `/CuotaXCobrar/GetByDocument?idComprobante=${item.idNotaEntrega}&idTipoDoc=${TIPO_DOC_NE.idTipoDocumento}`)

            if(response.id==="0"){
                _fS.sweetAlert('warning', response.message, response.titleSms)
                return
            }

            if(response.id==="1"){
                params = {
                    cuotas: response.data,
                    data: {
                        ...item,                
                        id: item.idNotaEntrega,
                        codEstab: item.codEstab,                
                        esContado: item.credito,                
                        razonSocialComprador: item.nombreFiscal,                                         
                    }  ,
                    TIPO_DOC: TIPO_DOC_NE                                  
                }
            }
        

            let $modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size:'xl',
                params
            })

            $modalRef.result.then(result=>{
                if(typeof result==='object'){
                    $scope.getNotaEntregas();
                }
            }) 
        } catch (error) {
            console.log(error)
        }       
    }





    $scope.openModalHistorialCobro = async(item)=>{
        try {
            let {MODAL_FILE_HISTORIAL_COBRO, MODAL_HISTORIAL_COBRO} = _nombreModalConst.cobro;
            let controller = (await import('./../../' + MODAL_FILE_HISTORIAL_COBRO))[MODAL_HISTORIAL_COBRO['controller']] ;
            let template   = MODAL_HISTORIAL_COBRO['template'];
            let params = {}
            

            await _mS.getData('get', `/ComprobanteIngreso/GetByDocument?idTipoDocumento=${TIPO_DOC_NE.idTipoDocumento}&idComprobante=${item.idNotaEntrega}`).then(response => {                                
                if(response.id===null){
                    _fS.sweetAlert('error', "Ups! algo salio mal <i class='far fa-frown'></i>!", response.titleSms); 
                    return
                }
                if (response.id == "0") {                
                    _fS.sweetAlert('warning', response.message, response.titleSms);                   
                    throw response
                }
                
                if(response.id==="1"){
                    params = {
                        historialCobros: response.data,
                        data: {
                            ...item,                
                            id: item.idNotaEntrega,
                            codEstab: item.codEstab,                
                            esContado: item.credito,                
                            razonSocialComprador: item.nombreFiscal,                                         
                        }  ,
                        TIPO_DOC: TIPO_DOC_NE
                    }
                }
            })
            
            let $modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size:'xl',
                params
            })
        } catch (error) {
            console.log(error)
        }


    }




    $scope.getReportII = function (item) {                   
        let parameters = {
            isPrint: 1,
            idDocument: item.idNotaEntrega,           
            idTipoDocumento : item.idTipoDocumento,
            codEstab: item.codEstab,
            codDoc: TIPO_DOC_NE.codigo,
            nroIdentificacion : item.nroIdentificacion,
            codigo: 'RNEPT'
        }
        
        _commonSvc.askToReportII({
            parameters: JSON.stringify(parameters)
        })
        
    }





    $scope.askToSendEmail = async (item)=> {
        let { isConfirmed } = await Swal.fire({
            title: '<small>Enviar por Correo</small>',
            icon: 'warning',
            html: '<small>¿Está seguro de enviar por correo esté documento?</small>',
            showDenyButton: true,
            confirmButtonText: `Si, enviar`,
            denyButtonText: `No, cancelar`,
            allowOutsideClick: false
        });

        if (isConfirmed) {
            $scope.getSendEmail(item);            
        }
    }


    
    $scope.getSendEmail = function (item) {
        try {
            _fS.showLoaderSendEmail();
            let format = 'pdf';
            let dataParms = {
                codEstab: item.codEstab,
                idNotaEntrega: item.idNotaEntrega        
            }
           
            const parameters = {
                reportParams: JSON.stringify({
                    codigo: 'RNE', 
                    format,
                    codEstab: item.codEstab,
                    aditionalParams: [
                        
                    ]
                }),
                dataParams: JSON.stringify(dataParms),
                sendEmail: true
            }
           
            _mS.getFile('post', '/NotaEntrega/Download', parameters).then(response => {
                Swal.close();
                let fileBlob = new Blob([response.data], { type: response.data.type });
                let objectUrl = window.URL || window.webkitURL;
                let urlFile = objectUrl.createObjectURL(fileBlob);
                window.open(urlFile, '_blank');
                return;
            }, error => console.log(error));
        } catch (error) {
            Swal.close();
            console.log(error)
        }
    }



    $scope.getReport = function (item) {           
        let format = 'pdf';
        let dataParms = {
            codEstab: item.codEstab,
            idNotaEntrega: item.idNotaEntrega        
        }
       
        const parameters = {
            reportParams: JSON.stringify({
                codigo: 'RNE', 
                codEstab: item.codEstab,
                format,
                aditionalParams: [
                    
                ]
            }),
            dataParams: JSON.stringify(dataParms)
        }

        _commonSvc.getReport({
            parameters,
            formatType: format
        })           
        // let format = 'pdf';
        // let dataParms = {
        //     id: item.idNotaEntrega,            
        //     idSucursal: item.idSucursal,
        //     codigo: 'RNE', 
        //     format,            
        // }

        // let parameters = {               
        //     dataParams: JSON.stringify(dataParms)
        // }

        // _commonSvc.getReportDynamic({
        //     parameters,
        //     format
        // })              
    }


}