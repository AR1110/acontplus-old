

app.controller('ordenCompraCtrl', ordenCompraCtrl);

ordenCompraCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'decodeToken']

function ordenCompraCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form, _tS, decodeToken){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['OC'];
    let idUsuarioRol= parseInt(decodeToken.idUsuarioRol)
    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 100
    }

    //Filters        
    $scope.meses = _form.meses();
    $scope.mes = $scope.meses[new Date().getMonth() + 1].numero;
    $scope.proveedorFilter = {};

    $scope.ordenCompras = [];

    $scope.getOrdenCompras = async()=>{
        try {
            showLoader();
            await _mS.getData('get', '/OrdenCompra/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.code==="0"){
                    console.warn(response)                    
                }
                console.log(JSON.parse(response.data))
                $scope.ordenCompras =  JSON.parse(response.data) || [];                
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
            $scope.getOrdenCompras();
        })

        _commonSvc.getEstadoDocByCodDoc('OC').then(response=>{
            $scope.estadoPagos = response;
        }) 


    }
    $scope.initiload();



    //-------------------------------FILTRO------------------------
    $scope.openModalFiltro = function () {
        $("#modalFiltroOrdenCompra").modal('show');        
    }

    $scope.searchProveedorFilter = (textSearch)=>{
        return _commonSvc.proveedorSearch(textSearch)
    }

    $scope.onChangeFechaFiltro =()=>{
        $scope.dataSearch.tipoFecha = 'FE';
        $scope.mes = new Date().getMonth() +1;
        $scope.getFechaInicioFinFilter($scope.mes)
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Buscador AVanzado
    $scope.getFechaInicioFinFilter = (mes)=> {
        let { fechaInicio, fechaFin } = _form.getFechaInicioFinFilter(mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
    }


        
    //Proveedor filter        
    $scope.onKeyupSearchProveedorFilter = ()=>{
        if(_form.campo($scope.dataSearch.selectedProveedor)){
            $scope.dataSearch.byProveedor = null;
        }
    }

    $scope.searchProveedorFilterChange = (item)=> {            
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor            
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

    //Busqueda Avanzada 
    $scope.busquedaAvanzada = () => {            
        if (_form.campo($scope.dataSearch.codEstab)) {
            _tS.toastr('warning', 'Seleccione una Sucursal');
            return;
        };
        if ($scope.dataSearch.checkBoxProveedor) {
            if (_form.campo($scope.dataSearch.byProveedor)) {
                _tS.toastr('warning', 'Seleccione el Proveedor');
                return;
            };
        }

        if ($scope.dataSearch.checkBoxFecha) {
            if (_form.campo($scope.dataSearch.fechaInicio)) {
                _tS.toastr('warning', 'Seleccione la Fecha Inicio');
                return;
            };
            if (_form.campo($scope.dataSearch.fechaFin)) {
                _tS.toastr('warning', 'Seleccione la Fecha Fin');
                return;
            };
        }

        if($scope.dataSearch.checkBoxUsuario){
            if(_form.campo($scope.dataSearch.byUsuario)){
                _tS.toastr('warning', 'Seleccione el Usuario');
                return;
            }
        }

     
        $scope.getOrdenCompras();
        $("#modalFiltroOrdenCompra").modal('hide');
    }


    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.orden_compra;
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
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.orden_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
         
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idOrdenCompra,
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
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.orden_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idOrdenCompra,
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
                $scope.getOrdenCompras()
            }
        })        
    }



    $scope.askToDelete = async(item)=>{

        try {            
            let {isConfirmed} = await Swal.fire({
                title: '<small>Eliminar Documento?</small>',
                html: `<small>Esta Ud. seguro de eliminar este Documento <b> N° ${item.nroDoc}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!',
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
                        _mS.getData('delete', '/OrdenCompra/Delete?id=' + item.idOrdenCompra).then(response=>{
                            
                            if(response.code==="0"){
                                _form.sweetAlert('warning', response.message, response.titleSms);            
                            }
                            if(response.code==="1"){
                                _form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                                $scope.getOrdenCompras();
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
     $scope.getReport = function (item) {       
        let format = 'pdf';
        let dataParms = {
            codEstab: item.codEstab,
            idOrdenCompra: item.idOrdenCompra
        }
       
        const parameters = {
            reportParams: JSON.stringify({
                codigo: 'ROC',  
                codEstab: item.codEstab,               
                format,
                aditionalParams: [                  
                ]
            }),
            dataParams: JSON.stringify(dataParms),
            sendEmail: false
        }

        _commonSvc.getReport({
            parameters,
            formatType:'pdf'
        })            
        
    }





}