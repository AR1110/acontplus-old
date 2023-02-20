

app.controller('facturaCompraCtrl', facturaCompraCtrl);

facturaCompraCtrl.$inject = ['$scope', '$filter', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario']

function facturaCompraCtrl($scope, $filter, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['FC'];

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 1000
    }

    //Filters        
    $scope.meses = _form.meses();
    $scope.mes = $scope.meses[new Date().getMonth() + 1].numero;
    $scope.proveedorFilter = {};

    $scope.filterLocalFC = async()=>{
        let facturas    = JSON.parse(JSON.stringify($scope.cloneFacturas));
        $scope.facturas = $filter("filter")(facturas, $scope.txtFilter);
        $scope.getTotalColumna();        
    }

    $scope.getTotalColumna = function(){
        let total = 0, abono = 0, saldo =0;
        for(let val of $scope.facturas){
            total+=val.total;
            abono+=val.abono;
            saldo+=val.saldo;
        }
        $scope.total = _form.roundNumber(total, 5);            
        $scope.abono = abono || 0; 
        $scope.saldo = saldo || 0;            
    }
   

    $scope.getFacturas = async()=>{
        try {
            showLoader();
            $scope.facturas = [];
            await _mS.getData('get', '/FacturaCompra/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.code==="0"){
                    console.warn(response)                    
                }

                $scope.facturas =  JSON.parse(response.payload) || [];  
                $scope.cloneFacturas = JSON.parse(JSON.stringify($scope.facturas));
                $scope.getTotalColumna();                     
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
            $scope.getFacturas();
        })

        _commonSvc.getEstadoDocByCodDoc(TIPO_DOC.codigo).then(response=>{
            $scope.estadoPagos = response;
        })
    }
    $scope.initiload();


    //----------------------------------------------FILTROS ----------------------------------------
    $scope.openModalFiltro = function() {   
                                                        
        $("#modalBusquedaAvanzadaFC").modal('show');                               
    }

    $scope.onChangeFechaFiltro =()=>{
        $scope.dataSearch.tipoFecha = 'FE';
        $scope.mes = new Date().getMonth() +1;
        $scope.getFechaInicioFinFilter($scope.mes)
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Buscador AVanzado
    $scope.getFechaInicioFinFilter = function(mes) {
        let { fechaInicio, fechaFin } = _form.getFechaInicioFinFilter(mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
    }
        
    //-------------------------------------------Proveedor filter------------------------------
    $scope.searchProveedorFilter = (textSearch)=> _commonSvc.proveedorSearch(textSearch);

    $scope.proveedorFilte={};
    $scope.searchProveedorFilterChange = function(item) {            
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor
        
    }

    //Busqueda Avanzada 
    $scope.busquedaAvanzada =()=> {
        // if (_form.campo($scope.dataSearch.bySucursal)) {
        //     toast.toastr('warning', 'Por favor seleccione una Sucursal');
        //     return;
        // };
        if ($scope.dataSearch.checkBoxProveedor) {
            if (_form.campo($scope.dataSearch.byProveedor)) {
                toast.toastr('warning', 'Por favor seleccione el Proveedor');
                return;
            };
        }

        if ($scope.dataSearch.checkBoxFecha) {
            if (_form.campo($scope.dataSearch.fechaInicio)) {
                toast.toastr('warning', 'Por favor seleccione la Fecha Inicio');
                return;
            };
            if (_form.campo($scope.dataSearch.fechaFin)) {
                toast.toastr('warning', 'Por favor seleccione la Fecha Fin');
                return;
            };
        }

        if ($scope.dataSearch.checkBoxEstado) {
            if (_form.campo($scope.dataSearch.byEstado)) {
                toast.toastr('warning', 'Por favor seleccione el Estado');
                return
            }
        }
                
        $scope.getFacturas();
        $("#modalBusquedaAvanzadaFC").modal('hide');                     
    }

    


    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.factura_compra;
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
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.factura_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
         
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idFacturaCompra,
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
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.factura_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idFacturaCompra,
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
                $scope.getFacturas()
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
                    $scope.getFacturas();
                }
            })           
        }       
    }



    $scope.retencionAutomatica = async(item)=>{
        _form.sweetAlert('warning', 'La Opción no esta disponible, realice desde modulo de Retención de Compra')
       
        // let {MODAL_FILE_CTRL, MODAL_RETENCION_AUTOMATICA} = _nombreModalConst.retencion_compra;
        // let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_RETENCION_AUTOMATICA['controller']]
        // let template   = MODAL_RETENCION_AUTOMATICA['template'];
        // let params = {        
        //     data: {
        //         ...item,
        //         id: item.idFacturaCompra,                
        //         numeroIdentificacion: item.nroIdentificacion
        //     },            
        // }    
        
        // _modalSvc.openModalCustom({
        //     controller,
        //     template,
        //     size:'xl',
        //     params            
        // })
    }


     //--------------------------MODAL CUOTA----------------------------------------------
     $scope.openModalCuota = async(item)=>{    
        try {
            let {MODAL_FILE_CUOTA, MODAL_COMPRA_CUOTA} = _nombreModalConst.pago;
            let controller = (await import('./../../' + MODAL_FILE_CUOTA))[MODAL_COMPRA_CUOTA['controller']] 
            let template   = MODAL_COMPRA_CUOTA['template'];
            
            let params = {}

            showLoader();
            await _mS.getData('get', `/CuotaXPagar/GetByDocument?idComprobante=${item.idFacturaCompra}&idTipoDoc=${TIPO_DOC.idTipoDocumento}`).then(response => {
                if(response.id===null){                  
                    _form.sweetAlert('warning', 'Ups algo salio mal <i class="fas fa-frown"></i>!', response.titleSms);
                    throw response                      
                }
                if (response.id == "0") {                    
                    _form.sweetAlert('warning', response.message, response.titleSms);                        
                    throw response;
                }

                if(response.id==="1"){
                    params = {
                        cuotas: response.data,
                        data: {
                            ...item,
                            id: item.idFacturaCompra,                
                            numeroIdentificacion: item.nroIdentificacion
                        },
                        TIPO_DOC
                    }                    
                }

            })

            const modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                params
            })         
            modalRef.result.then(res=>{
                if(typeof res ==='object'){
                    $scope.getFacturas();                    

                }
            })

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }
        
    }


     //---------------------------MODAL PAGO  --------------------------------------------
     $scope.openModalPago = async function(item){                       
        try {
            if(item.estadoFinanciero==="Pagada"){
                _form.sweetAlert('warning', 'El Documento ya esta pagado','');
                return                
            }

            let {MODAL_FILE_CTRL, MODAL_PAGO_DOCUMENTO} = _nombreModalConst.pago;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_PAGO_DOCUMENTO['controller']];
            let template   = MODAL_PAGO_DOCUMENTO['template'];

            let params = {
                data: {
                    ...item,
                    id: item.idFacturaCompra,                
                    numeroIdentificacion: item.nroIdentificacion
                },
                TIPO_DOC
            }     
            const modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                params
            })
            modalRef.result.then(response=>{
                if(typeof response!=='object') return
                $scope.getFacturas();            
            })
        } catch (error) {
           console.log(error) 
        }                              
    }



    //----------------------------------------------------HISTORIAL DE PAGO ----------------------
    $scope.openModalHistorialPago = async(item)=>{ 
        try {
            

            if(item.estadoFinanciero.toUpperCase()==='PENDIENTE'){
                _form.sweetAlert('warning', 'No tiene movimientos');
                throw '' 
            }  

            showLoader();
            
            let {MODAL_FILE_HISTORIAL_PAGO, MODAL_HISTORIAL_PAGO} = _nombreModalConst.pago;
            let controller = (await import('./../../' + MODAL_FILE_HISTORIAL_PAGO))[MODAL_HISTORIAL_PAGO['controller']];
            let template   = MODAL_HISTORIAL_PAGO['template'];

            let params = { }


            await _mS.getData('get', `/ComprobanteEgreso/GetByDocument?idTipoDocumento=${TIPO_DOC.idTipoDocumento}&idComprobante=${item.idFacturaCompra}`).then(response=>{
                if (response.id == "0") {                    
                    _form.sweetAlert('warning', response.message);               
                    throw ''
                }
                if (response.id === "1") {  
                    const pagos = JSON.parse(response.data) || [];                      
                    params = {
                        pagos,
                        data: {
                            ...item,
                            id: item.idFacturaCompra,                
                            numeroIdentificacion: item.nroIdentificacion
                        },
                        TIPO_DOC
                    }                   
                }
            })


            let $modalRef = _modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                params
            })            
            

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
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