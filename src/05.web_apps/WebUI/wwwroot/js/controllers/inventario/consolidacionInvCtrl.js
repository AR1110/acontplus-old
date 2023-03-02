


app.controller('consolidacionInvCtrl', consolidacionInvCtrl);

consolidacionInvCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario']

function consolidacionInvCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    $scope.inputDisabledFechaEmision = true;
    $scope.btnEditDisabled = false;

    const TIPO_DOC = _commonSvc.tipoDoc['CIV'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }

    $scope.getConsolidaciones = async()=>{
        try {
            showLoader();
            $scope.consolidaciones = [];

            await _mS.getData('get', '/ConsolidacionInventario/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.code==="0"){
                    console.warn(response)                    
                }

                $scope.consolidaciones =  JSON.parse(response.payload) || []; 
                $scope.cloneConsolidaciones = JSON.parse(JSON.stringify($scope.consolidaciones)) 
                let total = $scope.consolidaciones.map(val=>val.total).reduce((acc, curr)=>acc+curr, 0);
                $scope.total = _form.roundNumber(total, 5);                 
            })
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
    }

    $scope.initiload = ()=>{
        _commonSvc.getEstabAsign().then(response=>{            
            let establecimientos = response;
            let codEstab = establecimientos.length>0?establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getConsolidaciones();

        })                
    }
    $scope.initiload();


    $scope.getListaFilter= ()=>{
        let consolidaciones = JSON.parse(JSON.stringify($scope.cloneConsolidaciones))
        $scope.consolidaciones = $filter("filter")(consolidaciones, $scope.dataSearch.bySearch);  
        let total = $scope.consolidaciones.map(val=>val.total).reduce((acc, curr)=>acc+curr, 0);
        $scope.total = _form.roundNumber(total, 5);        
    }

    


    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.consolidacion_inv;
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
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.consolidacion_inv;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
         
            const response = await _commonSvc.getDataConsolidacionInventario(item.idConsolidacionInventario)

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
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.consolidacion_inv;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            const response = await _commonSvc.getDataConsolidacionInventario(item.idConsolidacionInventario)

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
            windowClass:'uibModalFullScreen'
        }).result.then(result=>{
            console.log('test')
            if(typeof result ==='object'){
                $scope.getConsolidaciones()
            }
        })        
    }



    $scope.askToDelete = async(item)=>{

        let {isConfirmed} = await Swal.fire({
            title: '<small>Anular Documento?</small>',
            html: `<small>Este proceso no se puede revertir!</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, anular!',
            cancelButtonText:'No, cancelar'
        })

        if(isConfirmed){
            showLoader();
            _mS.getData('delete', '/ConsolidacionInventario/Delete?id=' + item.idConsolidacionInventario).then(response=>{
                if(response.id==="0"){
                    hideLoader();
                    _form.sweetAlert('warning', response.message, response.titleSms);            
                }
                if(response.id==="1"){
                    hideLoader();
                    _form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                    $scope.getConsolidaciones();
                }
            })           
        }       
    }



    //Reporte 
    $scope.getReport = function (item) {
        let dataParms = {
            idConsolidacionInventario: item.idConsolidacionInventario,            
        }
        const parameters = {
            reportParams: JSON.stringify({
                codigo: 'RCI', 
                format: 'pdf',
                codEstab: item.codEstab,
                aditionalParams: []
            }),
            dataParams: JSON.stringify(dataParms),
            sendEmail:false
        }
        
        _commonSvc.getReport({
            parameters,
            formatType:'pdf'
        })               
    }





}

