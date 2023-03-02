

app.controller('liquidacionCompraCtrl', liquidacionCompraCtrl);

liquidacionCompraCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService']

function liquidacionCompraCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form, _tS){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['LC'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }
    $scope.meses = _form.meses();
    $scope.dataSearch.mes = $scope.meses[new Date().getMonth() + 1].numero;  


    $scope.getLiquidacionesCompra = async()=>{
        try {
            showLoader();
            await _mS.getData('get', '/LiquidacionCompra/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                
                if(response.code==="0"){
                    console.warn(response)   
                    throw response                                     
                }
            
                $scope.liquidacionesCompra =  JSON.parse(response.payload) || [];    
                $scope.copiaLiquidacionCompras = JSON.parse(JSON.stringify($scope.liquidacionesCompra)) 
                $scope.sumTotalColumna();             
            })
        } catch (error) {
            console.log(error)
            $scope.liquidacionesCompra = [];
            console.log(error)
        }finally{
            hideLoader();
        }
    }

    $scope.initiload = ()=>{
        _mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
            let results = JSON.parse(response.payload)  || [];
            $scope.establecimientos = results[0];
            let codEstab = $scope.establecimientos.length>0? $scope.establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getLiquidacionesCompra();
        })

        _commonSvc.getEstadoDocByCodDoc(TIPO_DOC.codigo).then(response=>{
            $scope.estadoPagos = response;
        })

    }
    $scope.initiload();



    //--------------------------Busqueda Avanzada ---------------------------
    $scope.openModalFiltro = function(){
        $("#modalFiltroAvanzado").modal('show');        
    }

    $scope.searchProveedorFilter = (textSearch)=>{            
        return _commonSvc.proveedorSearch(textSearch);
    } 

    $scope.onChangeFechaFilter = function(){
        $scope.dataSearch.tipoFecha = "FE";
        $scope.getFechaInicioFinFilter();
    }

    $scope.getFechaInicioFinFilter = function(){                       
        let { fechaInicio, fechaFin } = _form.getFechaInicioFinFilter($scope.dataSearch.mes);            
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
    }

    $scope.selectedProvPersonalizadoChange = function(item){
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor;
    }

        //---------------------------------USUARIO-----------------------------------------------------
    $scope.dataUsuarioFilter = {}
    $scope.usuarioSearch = (textSearch) => {
        return _commonSvc.usuarioSearch({
            idRol: document.getElementById('idRol').value,
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

    
    $scope.filtrarLiqCompra = function(){
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
        $scope.getLiquidacionesCompra();
        $("#modalFiltroAvanzado").modal('hide');
    };
    
    $scope.filterLocalLCompras = function(){
        let liquidacionCompras = JSON.parse(JSON.stringify($scope.copiaLiquidacionCompras));
        $scope.liquidacionCompras = $filter("filter")(liquidacionCompras, $scope.txtFilter);
        $scope.sumTotalColumna();        
    }
    
    $scope.sumTotalColumna = function(){
        let total = $scope.liquidacionesCompra.map(val=>val.total).reduce((acc, curr)=>acc + curr, 0);
        $scope.total = _form.roundNumber(total, 5);        
    }


    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.liquidacion_compra;
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
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.liquidacion_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
         
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idLiquidacionCompra,
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
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.liquidacion_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idLiquidacionCompra,
                codigoDocumento: TIPO_DOC.codigo
            })

            console.log(response)
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
                $scope.getLiquidacionesCompra()
            }
        })        
    }



    $scope.askToDelete = async(item)=>{

        let {isConfirmed} = await Swal.fire({
            title: 'Eliminar Documento?',
            html: `<small>Esta Ud. seguro de eliminar este Factura</b> N° ${item.nroDocumento}</small>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText:'No, cancelar'
        })

        if(isConfirmed){
            _form.showLoaderAnular();
            _mS.getData('delete', '/FacturaCompra/Delete?id=' + item.idFacturaCompra).then(response=>{
                if(response.code==="0"){
                    _form.sweetAlert('warning', response.message, response.titleSms);            
                }
                if(response.code==="1"){
                    _form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                    $scope.getFacturaCompras();
                }
            })           
        }       
    }



     //Reporte 
     $scope.getReport = function (item) {                   
        let dataParms = {
            codEstab: item.codEstab,
            idLiquidacionCompra: item.idLiquidacionCompra,            
        }
        
        let parameters = {
            reportParams: JSON.stringify({
                codigo: 'RLC', 
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