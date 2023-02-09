

app.controller('guiaRemisionCtrl', guiaRemisionCtrl);

guiaRemisionCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario']

function guiaRemisionCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['GR'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }
    
    $scope.clienteFiltro = {};
    $scope.usuarioSearchFiltro = {};
    $scope.mes = new Date().getMonth() + 1;


    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.guia_remision;
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


    $scope.openModalFiltro = async()=>{
        try {
            let {MODAL_FILE_CTRL, MODAL_FILTRO} = _nombreModalConst.guia_remision;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_FILTRO['controller']];        
            let template   = MODAL_FILTRO['template'];
           
            let modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size:'lg',
                params: {                    
                    dataSearch: $scope.dataSearch, 
                    clienteFiltro: $scope.clienteFiltro, 
                    usuarioSearchFiltro: $scope.usuarioSearchFiltro, 
                    mes: $scope.mes
                }
            })
            
            modalRef.result.then(response=>{
                let {isSearch, dataSearch, clienteFiltro, usuarioSearchFiltro, mes }= response;
                $scope.dataSearch = dataSearch;
                $scope.clienteFiltro = clienteFiltro;
                $scope.usuarioSearchFiltro = usuarioSearchFiltro;
                $scope.mes = mes;

                if(isSearch){
                    $scope.getGuiasRemision();
                }
            })
            
           
        } catch (error) {
            console.log(error)
        }
    }

    $scope.getGuiasRemision = async()=>{
        try {
            showLoader();
            await _mS.getData('get', '/GuiaRemision/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                
                if(response.code==="0"){
                    console.warn(response)                    
                }

                $scope.guiasRemision =  JSON.parse(response.payload) || [];
                $scope.cloneGuiasRemision = JSON.parse(JSON.stringify($scope.guiasRemision))                
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
            $scope.getGuiasRemision();
        })
    }
    $scope.initiload();


    $scope.searchGuiaRemision =()=>{
        let guiasRemision = JSON.parse(JSON.stringify($scope.cloneGuiasRemision));
        $scope.guiasRemision = $filter("filter")(guiasRemision, $scope.dataSearch.bySearch);
    }

    


    

    $scope.openModalDetalle = async(item)=>{
        try {
            showLoader();
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.guia_remision;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
            
            let response = await _commonSvc.getDataGuiaRemision(item.idGuiaRemision)

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
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.guia_remision;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            let response = await _commonSvc.getDataGuiaRemision(item.idGuiaRemision)

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
            if(typeof result ==='object'){
                $scope.getGuiasRemision()
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
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Anular Documento?</small>',
                html: "<small>Este proceso no se puede revertir!</small>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, anular!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
            })
    
            if(isConfirmed){
                showLoader();
                _mS.getData('delete', '/GuiaRemision/Delete?id=' + item.idGuiaRemision).then(response=>{
                    console.log(response)
                    if(response.code==="0"){
                        hideLoader()
                        _form.sweetAlert('warning', response.message, response.titleSms);            
                    }
                    if(response.code==="1"){
                        hideLoader()
                        _form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                        $scope.getGuiasRemision();
                    }
                }).catch(err=>{
                    Swal.close();
                    console.log(err)
    
                })           
            }
        } catch (error) {
            console.log(error)            
        }       
    }



    //Reporte 
    $scope.getReport = (item)=> {          
        try {
            
            let format = 'pdf';
            let dataParms = {
                id: item.idGuiaRemision,            
                codEstab: item.codEstab,
                codigo: 'RGR', 
                format,            
            }
       
            let parameters = {               
                dataParams: JSON.stringify(dataParms)
            }

            _commonSvc.getReportDynamic({
                parameters,
                format
            })

                  
        } catch (error) {
            hideLoader()
            console.log(error)
        }     
    }




}