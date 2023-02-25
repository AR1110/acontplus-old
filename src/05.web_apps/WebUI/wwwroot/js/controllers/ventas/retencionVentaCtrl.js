app.controller('retencionVentaCtrl', retencionVentaCtrl);

retencionVentaCtrl.$inject = [    
    '$scope',
    'mainService',    
    "$filter",    
    'commonService',        
    'modalService',
    'nombreModal',
    'toastService',
    'formulario'
];

function retencionVentaCtrl($scope, _mS, $filter, _commonSvc, _modalSvc, _nombreModal, toast, form) {
    let accion = JSON.parse(localStorage.getItem("accion"));
    if (accion === null) {
        location.href = "/Home/Index";
    } else {
        $scope.accion = accion[0];
    }

    const TIPO_DOC = _commonSvc.tipoDoc["RV"];

    $scope.data = {};
    $scope.retencion = {};
    $scope.gridOptions = {};
    $scope.sucursal = {};
    $scope.cliente = {};
    $scope.pageIndex = 1;
    $scope.pageSize = 10000000;
   

        //Filtro        
    $scope.meses = form.meses();
    $scope.mes = $scope.meses[new Date().getMonth() + 1].numero;
    $scope.dataSearch = {};
    $scope.dataSearch.pageIndex = 1;
    $scope.dataSearch.pageSize  = 10000000;

    $scope.openModalNew = async()=>{

        try {
            let {MODAL_FILE_CTRL, MODAL_NUEVO} = _nombreModal.retencion_venta;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_NUEVO['controller']];
            let template = MODAL_NUEVO['template'];
            
            $scope.openModalParam({
                controller,
                template,
                params: {
                    TIPO_REGISTRO: 'NUEVO'
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    $scope.openModalDetalle = async(item)=>{
        try {
            let {MODAL_FILE_CTRL, MODAL_DETALLE} = _nombreModal.retencion_venta;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
            let template = MODAL_DETALLE['template'];

            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idRetencionVenta,
                codigoDocumento: TIPO_DOC.codigo
            })
            
            if(!response.isComplete) return
            
            let params = {
                TIPO_REGISTRO: "DETALLE",
                data: response,                
            }
            hideLoader();
            $scope.openModalParam({
                controller,
                template,
                params
            })
        } catch (error) {
            
        }
    }

    $scope.openModalEditar = async(item)=>{
        try {
            showLoader();
            let {MODAL_FILE_CTRL, MODAL_EDITAR} = _nombreModal.retencion_venta;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_EDITAR['controller']];        
            let template = MODAL_EDITAR['template'];
            let response = await _commonSvc.getDataTipoDocVenta({
                id: item.idRetencionVenta,
                codigoDocumento: TIPO_DOC.codigo
            })
            console.log(response)
            if(!response.isComplete) return
            
            let params = {
                TIPO_REGISTRO: "EDITAR",
                data: response,                
            }
            hideLoader();
            $scope.openModalParam({
                controller,
                template,
                params
            })
        } catch (error) {
            hideLoader();
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
            params
        })
    }

  

    $scope.clienteSearch = (textSearch)=>{
        return _commonSvc.clienteSearch(textSearch)
    }

    //---------------------------------------------------FILTRO AVANZADO ----------------------------------------
    $scope.openModalFiltroRetencionVenta = ()=> {            
        $("#modalFiltroRetencionVenta").modal('show');            
    }

    $scope.clienteFiltro = {};
    $scope.onKeyupClienteSearchFiltro = ()=>{
        if(form.campo($scope.clienteFiltro.nombreFiscal)){
            $scope.clienteFiltro  = {};
            $scope.dataSearch.byCliente = null;
        } 
    }

    $scope.selectedClienteSearchFiltro = (item) => {
        $scope.dataSearch.byCliente = item.idCliente;
    }

    $scope.onChangeFechaFiltro =()=>{
        $scope.mes = new Date().getMonth() + 1;
        $scope.dataSearch.tipoFecha = 'FE' //Por Defecto por fecha Emisión de la Factura Venta 
        $scope.getFechaInicioFinFilter($scope.mes)
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro AVanzado
    $scope.getFechaInicioFinFilter = (mes)=> {
        let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter(mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;            
    }

    $scope.dataUsuarioSearch = {}
    $scope.usuarioSearch = (textSearch)=>{
        return _commonSvc.usuarioSearch({
            idRol: document.getElementById('idRol').value,
            busqueda: textSearch
        })
    }

    $scope.onKeyupUsuarioSearchFilter = ()=>{
        if(form.campo($scope.dataUsuarioFilter.nombreCompleto)){
            $scope.dataSearch.byUsuario = null;
        }
    } 

    $scope.selectedUsuarioSearchFilter = (item)=>{        
        $scope.dataSearch.byUsuario = item.idUsuario;            
    }

    $scope.filtrarRetencionVenta = ()=>{
        let titutoToast = "Búsqueda";
        if (form.campo($scope.dataSearch.codEstab)) {
            toast.toastr('warning', 'Por favor seleccione una Sucursal', titutoToast);
            return;
        };
        if ($scope.dataSearch.checkBoxCliente) {
            if (form.campo($scope.dataSearch.byCliente) || $scope.dataSearch.byCliente === 0) {
                toast.toastr('warning', 'Seleccione el Cliente', titutoToast);
                return;
            };
        }
        if ($scope.dataSearch.checkBoxEstado) {
            if (form.campo($scope.dataSearch.byEstado) || $scope.dataSearch.byEstado===0) {
                toast.toastr('warning', 'Por favor seleccione el Estado', titutoToast);
                return
            }
        }
        if ($scope.dataSearch.checkBoxFecha) {
            if (form.campo($scope.dataSearch.fechaInicio)) {
                toast.toastr('warning', 'Ingrese la Fecha Inicio', titutoToast);
                return;
            };
            if (form.campo($scope.dataSearch.fechaFin)) {
                toast.toastr('warning', 'Ingrese la Fecha Fin');
                return;
            };
            if($scope.dataSearch.fechaFin < $scope.dataSearch.fechaInicio){
                toast.toastr('warning', 'Fecha Fin no puede se menor a Fecha Inicio');
                return;
            }
        }

        if($scope.dataSearch.checkBoxUsuario){
            if(form.campo($scope.dataSearch.byUsuario)){
                toast.toastr('warning', '   Ingrese el Usuario', titutoToast);
                return;
            }
        }

        $scope.getRetencionesVenta();
        $("#modalFiltroRetencionVenta").modal('hide');           
    }

    $scope.getRetencionesVenta = ()=> {
        try {
            showLoader();
            
            $scope.retencionesVenta  = []
            _mS.getData('get', '/RetencionVenta/Get?json=' + JSON.stringify($scope.dataSearch)).then(response => {
                console.log(response)
                if (response.id === "0") {
                    hideLoader();
                    console.log(response)
                    return
                }                
                
                $scope.retencionesVenta = JSON.parse(response.data) || [];                
                $scope.copiaRetencionesVenta = JSON.parse(JSON.stringify($scope.retencionesVenta));
                $scope.getTotalesColumna(); 
                hideLoader();            
            })          
        } catch (error) {
            hideLoader();
            console.error(error)
        }       
    }

    $scope.initiload = ()=>{
        _mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
            let results = JSON.parse(response.payload) || [];
            $scope.establecimientos = results[0];
            let codEstab = $scope.establecimientos.length>0?$scope.establecimientos[0].codEstab: 0;            
            $scope.dataSearch.codEstab = codEstab;
            $scope.getRetencionesVenta();

            _commonSvc.getEstadoDocByCodDoc(TIPO_DOC.codigo).then(response=>{
                $scope.estadoPagos = response;
            })  
        })
    }
    $scope.initiload();

    $scope.getTotalesColumna = ()=> {
        try {
            let totalIva = 0, totalRenta = 0, total = 0;
            for (let val of $scope.retencionesVenta) {
                totalIva += val.totalIva;
                totalRenta += val.totalRenta;
                total += val.total;
            }
            $scope.totalIva = form.roundNumber(totalIva, 5);
            $scope.totalRenta = form.roundNumber(totalRenta, 5);
            $scope.total = form.roundNumber(total,5)
        } catch (error) {
            hideLoader()
            console.log(error)
        }
    };

    $scope.filterLocalRVenta = ()=> {
        let retenciones = JSON.parse(JSON.stringify($scope.copiaRetencionesVenta));
        $scope.retencionesVenta = $filter("filter")(retenciones, $scope.textFilterLocal);
        $scope.getTotalesColumna();            
    }

    
    $scope.askToDelete = async (item)=> {
        let { isConfirmed } = await Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de Eliminar este Retención Nro. <b>${item.nroDoc}</b> ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        });

        if (isConfirmed) {
            $scope.delete(item);                
        };
    }


    //Eliminar Retencion Venta
    $scope.delete = (item)=> {
        try {
            showLoader();
            _mS.getData('delete', '/RetencionVenta/Delete?id=' + item.idRetencionVenta).then(response=>{
                if (response.id == "0") {
                    hideLoader()
                    form.sweetAlert('warning', response.message, response.titleSms);                    
                }
                if (response.id == "1") {
                    hideLoader()
                    form.sweetAlert('success', response.message, response.titleSms, 1000);
                    $scope.getRetencionesVenta();                    
                }
            })
        } catch (error) {
            hideLoader()
        }        
    }

   
    $scope.getReport = function(){
        Swal.fire({
            icon:'info',
            html: `<small>No Disponible</small>`
        })
    }
}
