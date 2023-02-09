

app.controller('transferenciaBodegaCtrl', transferenciaBodegaCtrl);

transferenciaBodegaCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario']

function transferenciaBodegaCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['TRA'];
    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }

    $scope.getTransferenciaBodegas = async()=>{
        try {
            showLoader();
            await _mS.getData('get', '/TransferenciaBodega/Get?json=' + JSON.stringify({})).then(response=>{
                if(response.code==="0"){
                    console.warn(response)                    
                }
                
                $scope.transferencias = JSON.parse(response.payload) || [];
                $scope.cloneTransferencias = JSON.parse(JSON.stringify($scope.transferencias));           
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
            let establecimientos = results[0];
            let codEstab = establecimientos.length>0?establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getTransferenciaBodegas();
        })
    }
    $scope.initiload();

    $scope.getFilterTransferencia = ()=>{
        let transferencias = JSON.parse(JSON.stringify($scope.cloneTransferencias))
        $scope.transferencias = $filter("filter")(transferencias, $scope.dataSearch.bySearch);
    }
    


    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.transferencia_bodega;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];        
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
            showLoader();
                        
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.transferencia_bodega;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
         
            let response = await _commonSvc.getDataTransferenciaBodega(item.idTransferenciaBodega)
            
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
        }finally{
            hideLoader();
        }
    }

    $scope.openModalEditar = async(item)=>{
        try {
            showLoader();
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.transferencia_bodega;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            let response = await _commonSvc.getDataTransferenciaBodega(item.idTransferenciaBodega);

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

    $scope.openModalParam = async({controller, template, size='xl', params})=>{
        _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params,
            // windowClass:'uibModalFullScreen'
        }).result.then(result=>{
            if(typeof result ==='object'){
                $scope.getTransferenciaBodegas()
            }
        })        
    }



    $scope.askToDelete = async(item)=>{

        let {isConfirmed} = await Swal.fire({
            title: '<small>Anular Transferencia?</small>',
            html: `<small>Esta Ud. seguro de eliminar esta Transferencia <b>N° ${item.nroDoc}</b></small>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, anular!',
            cancelButtonText:'No, cancelar'
        })

        if(isConfirmed){
            showLoader();
            _mS.getData('delete', '/TransferenciaBodega/Delete?id=' + item.idTransferenciaBodega).then(response=>{
                if(response.code==="0"){
                    hideLoader()
                    _form.sweetAlert('warning', response.message, response.titleSms);            
                }
                if(response.code==="1"){
                    hideLoader()
                    _form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                    $scope.getTransferenciaBodegas();
                }
            })           
        }       
    }



     //Reporte 
     $scope.getReport = function (item) {                   
        let dataParms = {
            codEstab: item.codEstab,
            idFacturaCompra: item.idFacturaCompra,            
        }
        
        let parameters = {
            reportParams: JSON.stringify({
                codigo: 'RFC', 
                codEstab: item.codEstab,
                format: 'pdf',
                aditionalParams: []
            }),
            dataParams: JSON.stringify(dataParms),
            sendEmail:false
        }
        showLoader();
        _commonSvc.getReport({
            parameters,
            formatType:'pdf'
        })        
    }





}