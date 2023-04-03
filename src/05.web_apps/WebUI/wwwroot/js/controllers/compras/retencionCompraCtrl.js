

app.controller('retencionCompraCtrl', retencionCompraCtrl);

retencionCompraCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'decodeToken']

function retencionCompraCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form, _tS, decodeToken){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['RC'], VERSION_COMPROBANTE = '1.0.0'
    let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 100
    }

     //Filters     
    $scope.dataSearch = {};
    $scope.meses = _form.meses();
    $scope.dataSearch.mes = new Date().getMonth() + 1;


    $scope.retenciones = [];


    $scope.getTotalesColumna = function(){
        $scope.totalIva = 0, $scope.totalRenta = 0, $scope.total = 0;
        for(let val of $scope.retenciones){
            $scope.totalIva+=val.totalIva;
            $scope.totalRenta +=val.totalRenta;
            $scope.total +=val.total
        }
    }

    $scope.filterLocalRetencion = function(){
        let retenciones = JSON.parse(JSON.stringify($scope.copiaRetenciones));
        $scope.retenciones = $filter("filter")(retenciones, $scope.textFilterLocal);
        $scope.getTotalesColumna();            
    }



    $scope.getRetenciones = async()=>{
        try {
            showLoader();

            $scope.retenciones = [];

            await _mS.getData('get', '/RetencionCompra/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.code==="0"){
                    console.warn(response)                    
                } 
                           
                $scope.retenciones =  JSON.parse(response.data) || [];    
                $scope.copiaRetenciones = JSON.parse(JSON.stringify($scope.retenciones))        
                $scope.getTotalesColumna();    
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
            let codEstab = $scope.establecimientos.length>0? $scope.establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getRetenciones();
        })
    }
    $scope.initiload();




    //-------------------------------------------FILTRO---------------------------------
    $scope.openModalFiltro = function(){
        $("#modalFiltroRetencion").modal('show');
    }

    $scope.onChangeFechaFilter = function(){
        $scope.mes = new Date().getMonth() + 1;
        $scope.getFechaInicioFinFilter();
    }


    $scope.getFechaInicioFinFilter = function(){                       
        let { fechaInicio, fechaFin } = _form.getFechaInicioFinFilter($scope.dataSearch.mes);            
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
    }

    //------------------------Proveedor ----------------------
    $scope.onChangeProveedorFiltro = function () {
        if (!$scope.dataSearch.checkBoxProveedor) {
            $scope.dataSearch.byProveedor = 0;
            $scope.selectedProvPersonalizado = '';
        }
    }

    $scope.searchProveedorFilter = function (text) {
        return _commonSvc.proveedorSearch(text);
    }

    $scope.onKeyupSearchProvPersonalizado = function (text) {
        if (_form.campo($scope.selectedProvPersonalizado)) {
            $scope.dataSearch.byProveedor = 0;
        }
    };

    $scope.searchProveedorFilterChange = function (item) {        
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor;
    }
    
    //---------------------------------USUARIO-----------------------------------------------------
    $scope.dataUsuarioFilter = {}
    
    $scope.usuarioSearch = (textSearch) => {
        return _commonSvc.usuarioSearch({
            idRol: idUsuarioRol,
            busqueda: textSearch
        })
    }

    $scope.onKeyupUsuarioSearchFilter = () => {
        if (_form.campo($scope.dataUsuarioFilter.nombreCompleto)) {
            $scope.dataSearch.byUsuario = null;
        }
    }

    $scope.selectedUsuarioSearchFilter = (item) => {
        $scope.dataSearch.byUsuario = item.idUsuario;
    }

    $scope.filter = function(){
        if($scope.dataSearch.checkBoxFecha){
            if(_form.campo($scope.dataSearch.fechaInicio)){
                _tS.toastr('warning', 'Ingrese Fecha de Emisión');
                return
            }
            if(_form.campo($scope.dataSearch.fechaFin)){
                _tS.toastr('warning', 'Ingrese Fecha Fin');
                return
            }
        }

        if($scope.dataSearch.checkBoxProveedor){
            if(_form.campo($scope.dataSearch.byProveedor) || $scope.dataSearch.byProveedor===0){
                _tS.toastr('warning', 'Seleccione el Proveedor');
                return
            }
        }

        if($scope.dataSearch.checkBoxUsuario){
            if(_form.campo($scope.dataSearch.byUsuario) || $scope.dataSearch.byUsuario===0){
                _tS.toastr('warning', 'Seleccione el Usuario');
                return
            }
        }

        if($scope.dataSearch.checkBoxEstado){
            if(_form.campo($scope.dataSearch.byEstado) || $scope.dataSearch.byEstado===0){
                _tS.toastr('warning', 'Seleccione el Estado');
                return
            }
        }
        $scope.getRetenciones();
        $("#modalFiltroRetencion").modal('hide');

    }


    




    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.retencion_compra;
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


    $scope.filterOrdenCompras = ()=>{

    }

    $scope.openModalDetalle = async(item)=>{
        try {
            showLoader();
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.retencion_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
         
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idRetencionCompra,
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
        }finally{
            hideLoader();
        }
    }

    $scope.openModalEditar = async(item)=>{
        try {
            showLoader();
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.retencion_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idRetencionCompra,
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

    $scope.openModalParam = async({controller, template, size='xl', params})=>{
        _modalSvc.openModalCustom({
            controller,
            template,
            size,
            params,
            windowClass:'uibModalFullScreen'
        }).result.then(result=>{
            if(typeof result ==='object'){
                $scope.getRetenciones()
            }
        })        
    }



    $scope.askToDelete = async(item)=>{

        try {            
            let {isConfirmed} = await Swal.fire({
                title: '<small>Anular Documento?</small>',
                html: `<small>Esta Ud. seguro de eliminar este Documento <b> N° ${item.nroDoc}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, anular!',
                cancelButtonText:'No, cancelar'
            })
    
            if(isConfirmed){
                Swal.fire({
                    title: `<small>Espere</small>`,
                    html: 'Anulando...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                        _mS.getData('delete', '/RetencionCompra/Delete?id=' + item.idRetencionCompra).then(response=>{                            
                            if(response.code==="0"){
                                _form.sweetAlert('warning', response.message, response.titleSms);            
                            }
                            if(response.code==="1"){
                                _form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                                $scope.getRetenciones();
                            }
                        })  
                    }
                })                                         
            }
        } catch (error) {
            Swal.fire();
            console.log(error)
        } finally{
          
        }      
    }



                
        
    //Reporte 
    $scope.getReport = async (item)=> {                       
        try {
                        
            let format = 'pdf';
            let dataParms = {
                versionComp: VERSION_COMPROBANTE,
                id: item.idRetencionCompra,            
                codEstab: item.codEstab,
                codigo: 'RRC', 
                format,            
            }
       
            const parameters = {               
                dataParams: JSON.stringify(dataParms)
            }
            
            _commonSvc.getReportDynamic({
                parameters, 
                format
            })                              
        } catch (error) {
            hideLoader();
        } finally{
            
        } 
    }    





}