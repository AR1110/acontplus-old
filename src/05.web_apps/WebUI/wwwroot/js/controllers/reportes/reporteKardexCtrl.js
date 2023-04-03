

app.controller('reporteKardexCtrl', reporteKardexCtrl);

reporteKardexCtrl.$inject=['$scope', 'commonService', 'mainService', 'formulario', 'toastService', 'FileSaver', 'Blob'];


function reporteKardexCtrl($scope, _commonSvc, mS, form, toast, FileSaver, Blob){
    $scope.dataSearch = {};
    $scope.dataSearch.byTipoFormato = 'pdf';
    $scope.dataSearch.byOrder = 'ASC';
    $scope.dataSearch.byOrderCampo = 'fechaEmision'
    
    //Filters        
    $scope.meses = form.meses();
    $scope.mes = new Date().getMonth() + 1;
 
    $scope.tipoDocumentos = [
        {idTipoDocumento: 1, descripcion: 'Compras'},
        {idTipoDocumento: 2, descripcion: 'Ventas'},
        {idTipoDocumento: 3, descripcion: 'Transferencias'},
        {idTipoDocumento: 4, descripcion: 'Movimiento de Inventario'},
    ]

    

    $scope.getFechaInicioFinFilter = function(){
        let {fechaInicio, fechaFin} = form.getFechaInicioFinFilter($scope.mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;            
        return
    };

   

    $scope.load = function(){
        
        _commonSvc.getEstabAsign().then(response=>{            
            $scope.sucursales = response;  
            if($scope.sucursales.length>0){
                let dataEstab = $scope.sucursales[0]
                $scope.dataSearch.codEstab = dataEstab.codEstab; //Para Filtro avanzado 
                _commonSvc.getDataFormEstabAsig(dataEstab).then(response=>{
                    $scope.puntosEmisiones = response[0];
                    $scope.bodegas = response[1]
                })
            }else{
                toastr.warning('NO TIENES ASIGNADO NINGUNA SUCURSAL')
            }        
        })
        
        
            //Listar Tipo Cliente
        mS.getData('get', '/TipoClienteProveedor/TipoClienteProveedorSelect?tipoValidacion=CL').then(response => {
            $scope.tipoClientes = response.data;                
        }, error => console.log(error));
        
        $scope.getFechaInicioFinFilter()
    };
    $scope.load();


    $scope.openModalReporte = function(){
        $("#modalReporteKardex").modal('show');        
    }

    $scope.searchArticuloFilter = (textSearch)=> {
        return  _commonSvc.articuloSearchGeneral({
            textSearch,           
        })
    }

    $scope.selectedArticuloChange = function($item){
        $scope.dataSearch.byArticulo = $item.idArticulo;  
        $scope.selectedArticulo = $item.descripcion;                  
    }

    $scope.filtrar = function(){
        const tituloToast = 'Reporte';
        if(form.campo($scope.dataSearch.byArticulo)){
            toast.toastr('warning', 'Seleccione el Articulo', tituloToast);
            return
        }

        if($scope.dataSearch.checkboxSucursalFiltro){
            if(form.campo($scope.dataSearch.codEstab)){
                toast.toastr('warning', 'Seleccione la Sucursal', tituloToast);
                return
            }
        }

        if($scope.dataSearch.checkboxTipoDocFiltro){
            if(form.campo($scope.dataSearch.byTipoDoc)){
                toast.toastr('warning', 'Seleccione el Tipo Documento', tituloToast);
                return
            }
        }

        if(form.campo($scope.dataSearch.fechaInicio)){
            toast.toastr('warning', 'Ingrese la Fecha Inicio', tituloToast);
            return
        }

        if(form.campo($scope.dataSearch.fechaFin)){
            toast.toastr('warning', 'Ingrese la Fecha Fin', tituloToast);
            return
        }

        if(form.campo($scope.dataSearch.byOrderCampo)){
            toast.toastr('warning', 'Seleccione el Campor a Ordenar', tituloToast);
            return
        }

        if(form.campo($scope.dataSearch.byOrder)){
            toast.toastr('warning', 'Seleccione el Tipo Orden(ASC/DES)', tituloToast);
            return
        }

        if(form.campo($scope.dataSearch.byTipoFormato)){
            toast.toastr('warning', 'Seleccione el Tipo Formato', tituloToast);
            return
        }

        let loaderGif = $scope.dataSearch.byTipoFormato === "pdf" ? 'document-office.gif' : 'transfer-file.gif'
        form.showLoaderForm('Descargando...', 'Espere', `/assets/images/gif/${loaderGif}`)
        $scope.getReport();
        return

    }

    $scope.getReport = function() {            
        const parameters = {
            reportParams: JSON.stringify({
                
                codigo: 'KRG', 
                format: $scope.dataSearch.byTipoFormato,
                aditionalParams: []
            }),
            dataParams: JSON.stringify($scope.dataSearch)
        }
        
        mS.getFile('Post', '/Reporte/Download', parameters).then(response=>{
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


