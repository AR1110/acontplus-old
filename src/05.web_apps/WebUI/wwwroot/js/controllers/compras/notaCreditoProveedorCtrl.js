

app.controller('notaCreditoProvCtrl', notaCreditoProvCtrl);

notaCreditoProvCtrl.$inject = ['$scope', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'decodeToken']

function notaCreditoProvCtrl($scope, _mS, _commonSvc, _modalSvc, _nombreModalConst, _form, _tS, decodeToken){

    let accion = JSON.parse(localStorage.getItem("accion"));  
    if(accion===null){
        location.href ="/Home/Index";
        return
    }else{
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc['NCP'];
    let idUsuarioRol= parseInt(decodeToken.idUsuarioRol);

    $scope.dataSearch = {
        pageIndex: 1,
        pageSize: 100
    }

    $scope.meses = _form.meses();
    $scope.mes = $scope.meses[new Date().getMonth() + 1].numero;
    $scope.proveedorFilter = {};


    $scope.notasCredito = [];

    $scope.getNotasCredito = async()=>{
        try {
            showLoader();
            await _mS.getData('get', '/NotaCreditoProveedor/Get?json=' + JSON.stringify($scope.dataSearch)).then(response=>{
                if(response.code==="0"){
                    console.warn(response)                    
                }
            
                $scope.notasCredito =  JSON.parse(response.data) || [];                
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
            $scope.getNotasCredito();
        })

        _commonSvc.getEstadoDocByCodDoc('NCP').then(response=>{
            $scope.estadoPagos = response;
        })
    }
    $scope.initiload();

    

    //--------------------------------------------FILTRO----------------------------------

    $scope.openModalFiltro = ()=>{        
        $("#modalFiltroNotaCredito").modal('show');            
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
    
    
    $scope.searchProveedorFilter = (textSearch)=>{
        return _commonSvc.proveedorSearch(textSearch)
    }

    //Proveedor filter        
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
    $scope.busquedaAvanzada =()=> {
        if (_form.campo($scope.dataSearch.codEstab)) {
            toastr.warning('Seleccione una Sucursal');
            return;
        };
        if ($scope.dataSearch.checkBoxProveedor) {
            if (_form.campo($scope.dataSearch.byProveedor)) {
                toastr.warning('Seleccione el Proveedor');
                return;
            };
        }

        if ($scope.dataSearch.checkBoxFecha) {
            if (_form.campo($scope.dataSearch.fechaInicio)) {
                toastr.warning('Seleccione la Fecha Inicio');
                return;
            };
            if (_form.campo($scope.dataSearch.fechaFin)) {
                toastr.warning('Seleccione la Fecha Fin');
                return;
            };
        }

        if ($scope.dataSearch.checkBoxUsuario) {
            if (_form.campo($scope.dataSearch.byUsuario)) {
                toastr.warning('Seleccione el Usuario');
                return
            }
        }

        if ($scope.dataSearch.checkBoxEstado) {
            if (_form.campo($scope.dataSearch.byEstado)) {
                toastr.warning('Seleccione el Estado');
                return
            }
        }
                
        $scope.getNotasCredito();
        $("#modalFiltroNotaCredito").modal('hide');                     
    }


    $scope.openModalNew = async()=>{

        let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModalConst.nota_credito_prov;
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
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModalConst.nota_credito_prov;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];        
            let template   = MODAL_DETALLE['template'];
         
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idNotaCreditoProveedor,
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
            
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModalConst.nota_credito_prov;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template   = MODAL_EDITAR['template'];
            
            let response = await _commonSvc.getDataTipoDocCompra({
                id: item.idNotaCreditoProveedor,
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
                $scope.getNotasCredito()
            }
        })        
    }



    $scope.askToDelete = async(item)=>{

        let {isConfirmed} = await Swal.fire({
            title: '<small>Anular Documento?</small>',
            html: `<small>Este proceso no puedes revertir</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, anular!',
            cancelButtonText:'No, cancelar'
        })

        if(isConfirmed){
            showLoader();
            _mS.getData('delete', '/NotaCreditoProveedor/Delete?id=' + item.idNotaCreditoProveedor).then(response=>{
                console.log(response)
                if(response.id==="0"){
                    hideLoader();
                    _form.sweetAlert('warning', response.message, response.titleSms);            
                }
                if(response.id==="1"){
                    hideLoader();
                    _form.sweetAlert('success', response.message, response.titleSms, 1000);                    
                    $scope.getNotasCredito();
                }
            })           
        }       
    }



    //Reporte 
    $scope.getReport = function (item) {
        let format = 'pdf';
        let dataParms = {
            idNotaCreditoProveedor: item.idNotaCreditoProveedor,
            codEstab: item.codEstab
        }
       
        const parameters = {
            reportParams: JSON.stringify({
                codigo: 'RNCP', 
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