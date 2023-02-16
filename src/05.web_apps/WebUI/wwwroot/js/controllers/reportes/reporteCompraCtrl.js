app.controller('reporteCompraCtrl', reporteCompraCtrl);

reporteCompraCtrl.$inject = ['$http', '$scope', 'commonService', 'mainService', 'toastService', 'formulario', 'FileSaver', 'Blob'];

function reporteCompraCtrl($http, $scope, _commonSvc, mS, toast, form, FileSaver, Blob) {
    $scope.dataSearch = {};

    //Filters        
    $scope.meses = form.meses();
    $scope.mes = new Date().getMonth() + 1;
    $scope.dataSearch = {};
    $scope.dataSearch.tipoReporte = '';
    $scope.dataSearch.radioFechaFiltro = true;

    $scope.dataSearch.checkboxProveedorFiltro = false;
    $scope.dataSearch.checkboxEstadoFiltro = false;
    $scope.dataSearch.checkboxUsuarioFiltro = false;

    $scope.dataSearch.byOrderCampo = 'fc.fechaEmision';
    $scope.dataSearch.byOrder = 'ASC';
    $scope.dataSearch.byTipoFormato = 'pdf'; 

    $scope.tipoDocumentos = [
        { codigo: 'FC', descripcion: 'Factura Compra',        codigoReporte: 'FCRG'},
        { codigo: 'LC', descripcion: 'Liquidación de Compra', codigoReporte: 'LCRG' },
        { codigo: 'NCP',descripcion: 'Nota de Crédito',      codigoReporte: 'NCPRG' },
        { codigo: 'RC', descripcion: 'Retención de Compra',   codigoReporte: 'RCRG' },
        { codigo: 'IB', descripcion: 'Ingreso Bodega',   codigoReporte: 'IBRG' },
        { codigo: 'OC', descripcion: 'Orden de Compra',   codigoReporte: 'OCRG' }
    ];

    $scope.dataSearch.tipoDoc = 'FC';

    //Estado Pago Factura de Venta 
    const estadoPagosFC = [
        { id: 3, descripcion: 'Pagada' },
        { id: 1, descripcion: 'Diferente de Pagada' }          
    ];

    const estadoPagosRC = [
        {id: 1, descripcion:'Autorizada'},
        {id: -1, descripcion:'Diferente de Autorizada'},
        {id: 0, descripcion:'Anulada'},
        {id: -0, descripcion:'Diferente de Anulada'},
    ];

    $scope.estadoPagos = estadoPagosFC;

    $scope.getFechaInicioFinFilter = function () {
        let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter($scope.mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
        return
    }

    $scope.getAsignacionByRol = async()=>{
        console.log($scope.sucursales)
        let dataEstab = $scope.sucursales.find(item=>item.codEstab===$scope.dataSearch.codEstab)        
        _commonSvc.getDataFormEstabAsig(dataEstab).then(response=>{
            $scope.puntosEmisiones = response[0];
            $scope.bodegas = response[1];
        })
    
    }

    $scope.load = function () {
        _commonSvc.getEstabAsign().then(response=>{            
            $scope.sucursales = response;  
            if($scope.sucursales.length>0){
                let dataEstab = $scope.sucursales[0]
                $scope.dataSearch.codEstab = dataEstab.codEstab; //Para Filtro avanzado 
                _commonSvc.getDataFormEstabAsig(dataEstab).then(response=>{
                    $scope.puntosEmisiones = response[0];
                    $scope.bodegas = response[1];
                })
            }else{
                toastr.warning('NO TIENES ASIGNADO NINGUNA SUCURSAL')
            }        
        })    

        mS.getData('get', '/CategoriaCompra/GetAll').then(response => {                
            $scope.categoriaCompras = response.data;
        }, error => console.log(error));

        $scope.getFechaInicioFinFilter()
    };
    $scope.load();

  
    $scope.openModalReporte = function () {
        $("#modalFiltroReporteCompra").modal('show');
        return
    };

    //------------------------Tipo Documento  -----------------
    $scope.onChangeTipoReporte = function () {

        //FACTURA DE COMPRA 
        if ($scope.dataSearch.tipoDoc === "FC") {
            $scope.dataSearch.checkboxPuntoEmisionFiltro = false;
            $scope.dataSearch.byOrderCampo = 'fc.nroDocumento';
            $scope.estadoPagos = estadoPagosFC;
            return
        }

        //LIQUIDACIÓN DE COMPRA 
        if ($scope.dataSearch.tipoDoc === "LC") {
            $scope.dataSearch.byOrderCampo = 'lc.fechaEmision';
            $scope.dataSearch.checkboxCategoriaFiltro = false;                
            $scope.dataSearch.checkboxRetencionFiltro = false;
            $scope.dataSearch.checkboxDevolucionFiltro = false;
            $scope.estadoPagos = estadoPagosRC;
            return
        }

        //NOTA DE CREDITO PROVEEDOR 
        if ($scope.dataSearch.tipoDoc === "NCP") {
            $scope.dataSearch.checkboxPuntoEmisionFiltro = false;
            $scope.dataSearch.byOrderCampo = "ncp.nroDoc";
            $scope.dataSearch.checkboxCategoriaFiltro = false;                
            $scope.dataSearch.checkboxRetencionFiltro = false;
            $scope.dataSearch.checkboxDevolucionFiltro = false;
            $scope.dataSearch.radioFechaFiltro = true;
            $scope.estadoPagos = estadoPagosFC;
            return
        }

        //RETENCION DE COMPRA 
        if ($scope.dataSearch.tipoDoc === "RC") {
            $scope.dataSearch.byOrderCampo = "rc.nroDocumento";
            $scope.dataSearch.checkboxCategoriaFiltro = false;                
            $scope.dataSearch.checkboxRetencionFiltro = false;
            $scope.dataSearch.checkboxDevolucionFiltro = false;
            $scope.dataSearch.radioFechaFiltro = true;
            $scope.estadoPagos = estadoPagosRC;
            return
        }

        //INGRESO DE BODEGA 
        if ($scope.dataSearch.tipoDoc === "IB") {
            $scope.dataSearch.byOrderCampo = "ib.fechaEmision";
            $scope.dataSearch.checkboxCategoriaFiltro = false;                
            $scope.dataSearch.checkboxRetencionFiltro = false;
            $scope.dataSearch.checkboxDevolucionFiltro = false;
            $scope.dataSearch.radioFechaFiltro = true;
            $scope.estadoPagos = estadoPagosFC;
            return
        }

        //ORDEN DE COMPRA 
        if ($scope.dataSearch.tipoDoc === "OC") {
            $scope.dataSearch.byOrderCampo = "oc.fechaEmision";
            $scope.dataSearch.checkboxCategoriaFiltro = false;                
            $scope.dataSearch.checkboxRetencionFiltro = false;
            $scope.dataSearch.checkboxDevolucionFiltro = false;
            $scope.dataSearch.radioFechaFiltro = true;
            $scope.estadoPagos = estadoPagosRC;
            return
        }


    }

    //---------------Sucursal------------
    $scope.onChangeSucursalFiltro = function(){
        if(!$scope.dataSearch.checkboxSucursalFiltro){
            $scope.dataSearch.checkboxPuntoEmisionFiltro = false;
        }
    }

    //------------------------Cliente ----------------------
    $scope.onChangeProveedorFiltro = function () {
        if (!$scope.dataSearch.checkboxProveedorFiltro) {
            $scope.dataSearch.byProveedor = 0;
            $scope.selectedProvPersonalizado = '';
        }
    };

    $scope.searchProveedorFilter = function (text) {
        return mS.getData('get', `/Proveedor/SearchProveedor?busqueda=${text}`).then(response => {
            return response.data;
        })
    }

    $scope.onKeyupSearchProvPersonalizado = function (text) {
        if (form.campo($scope.selectedProvPersonalizado)) {
            $scope.dataSearch.byProveedor = 0;
        }
    };

    $scope.selectedProvPersonalizadoChange = function (item) {
        $scope.dataSearch.byProveedor = item.proveedor.idProveedor;
    }

    //------------------------Usuario----------------------------
    $scope.onChangeUsuarioFiltro = function () {
        if (!$scope.dataSearch.checkboxUsuarioFiltro) {
            $scope.dataSearch.byUsuario = 0;
            $scope.modelUsuarioFilter = '';
        }
    }

    $scope.dataUsuarioFilter = {}
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


    //----------------------Fecha ---------------------------
    $scope.onChangeFechaFiltro = function () {
        $scope.mes = new Date().getMonth() + 1;

        let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter($scope.mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;
        return

    };

    //-------------------Estado---------------------------------
    $scope.onChangeEstadoFiltro = function () {
        if (!$scope.dataSearch.checkboxEstadoFiltro) {
            $scope.dataSearch.byEstado = 0;
        }
    }

    $scope.filtrarReporteCompra = async function () {
        let tituloToast = 'Filtro';
        
        if (form.campo($scope.dataSearch.tipoDoc)) {
            toast.toastr('warning', 'Seleccione el Tipo Documento', tituloToast);
            return
        }

        if (form.campo($scope.dataSearch.codEstab) || $scope.dataSearch.codEstab === 0) {
            toast.toastr('warning', 'Seleccione la Sucursal', tituloToast);
            return
        }

        if($scope.dataSearch.tipoDoc==='LC' || $scope.dataSearch.tipoDoc==='NCP'){

            if($scope.dataSearch.checkboxPuntoEmisionFiltro){
                if (form.campo($scope.dataSearch.byPuntoEmision) || $scope.dataSearch.byPuntoEmision === 0) {
                    toast.toastr('warning', 'Seleccione el Punto de Emisión', tituloToast);
                    return
                }
            }
        }

        if ($scope.dataSearch.checkboxProveedorFiltro) {
            if (form.campo($scope.dataSearch.byProveedor) || $scope.dataSearch.byProveedor === 0) {
                toast.toastr('warning', 'Seleccione el Proveedor', tituloToast);
                return
            }
        }

        if ($scope.dataSearch.checkboxUsuarioFiltro) {
            if (form.campo($scope.dataSearch.byUsuario) || $scope.dataSearch.byUsuario === 0) {
                toast.toastr('warning', 'Seleccione el Usuario', tituloToast);
                return
            }
        }


        if (form.campo($scope.dataSearch.fechaInicio)) {
            toast.toastr('warning', 'Seleccione la Fecha de Inicio', tituloToast);
            return
        }

        if (form.campo($scope.dataSearch.fechaFin)) {
            toast.toastr('warning', 'Seleccione la Fecha de Inicio', tituloToast);
            return
        }

        if($scope.dataSearch.checkboxCategoriaFiltro){
            if(form.campo($scope.dataSearch.byCategoria)){
                toast.toastr('warning', 'Seleccione la Categoria', tituloToast);
                return                    
            }
        }

        if ($scope.dataSearch.checkboxEstadoFiltro) {
            if (form.campo($scope.dataSearch.byEstado)) {
                toast.toastr('warning', 'Seleccione el Estado', tituloToast);
                return
            }
        };

        if ($scope.dataSearch.checkboxRetencionFiltro) {
            if ([null, undefined, ""].includes($scope.dataSearch.retencion)) {
                toast.toastr('warning', 'Seleccion la Retención', tituloToast);
                return
            }
        }

        if ($scope.dataSearch.checkboxDevolucionFiltro) {
            if ([null, undefined, ""].includes($scope.dataSearch.notaCredito)) {
                toast.toastr('warning', 'Seleccion la Devolución', tituloToast);
                return
            }
        };

        
        let loaderGif = $scope.dataSearch.byTipoFormato === "pdf" ? 'document-office.gif' : 'transfer-file.gif'
        form.showLoaderForm('Descargando...', 'Espere', `/assets/images/gif/${loaderGif}`)
        $scope.getReport();
        return
        
    };    

    $scope.getReport = function() {  
        let dataReporte = $scope.tipoDocumentos.find(val=>val.codigo===$scope.dataSearch.tipoDoc);

        const parameters = {
            reportParams: JSON.stringify({
                codigo: dataReporte.codigoReporte, 
                format: $scope.dataSearch.byTipoFormato,
                aditionalParams: []
            }),
            dataParams: JSON.stringify($scope.dataSearch)
        }
       
        mS.getFile('post', '/Reporte/Download', parameters).then(response=>{
            Swal.close();
            
            if ($scope.dataSearch.byTipoFormato == 'pdf' || $scope.dataSearch.byTipoFormato == 'excel') {
                let fileBlob = new Blob([response.data], {
                    type: response.data.type
                });
                let objectUrl = window.URL || window.webkitURL;
                let urlFile = objectUrl.createObjectURL(fileBlob);
                window.open(urlFile, '_blank');
                return;
            } else {
                let serverData = new Blob([response.data], { type: response.headers()['content-type'] });
                let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1];
                FileSaver.saveAs(serverData, fileName);                    
                return;
            };
        }, error=>console.log(error));
    };






































}










