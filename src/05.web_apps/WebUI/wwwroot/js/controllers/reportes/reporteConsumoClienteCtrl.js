app.controller('reporteConsumoClienteCtrl', reporteConsumoClienteCtrl);

reporteConsumoClienteCtrl.$inject=['$scope', 'commonService', 'mainService', 'formulario', 'toastService', 'FileSaver', 'Blob', 'decodeToken'];


function reporteConsumoClienteCtrl($scope, _commonSvc, mS, form, toast, FileSaver, Blob, decodeToken){

    let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

    $scope.dataSearch = {};
    $scope.dataSearch.byTipoFormato = 'pdf';
    $scope.dataSearch.byOrder = 'ASC';
    $scope.dataSearch.byOrderCampo = 'fechaEmision'
    //Filters        
    $scope.meses = form.meses();
    $scope.mes = new Date().getMonth() + 1;

    $scope.dataSearch.byAnio = new Date().getFullYear().toString();

    $scope.tipoDocs = [
        {codigoDoc: 'FV', descripcion:'Factura Venta'},
        {codigoDoc: 'NE', descripcion:'Nota Entrega'},
        {codigoDoc: 'NC', descripcion:'Nota Crédito'}
    ]

    

    $scope.getFechaInicioFinFilter = function(){
        let {fechaInicio, fechaFin} = form.getFechaInicioFinFilter($scope.mes);
        $scope.dataSearch.fechaInicio = fechaInicio;
        $scope.dataSearch.fechaFin = fechaFin;            
        return
    };

  

    $scope.getAsignaciones = function(){
        let dataEstab = $scope.sucursales.find(item=>item.codEstab===$scope.dataSearch.codEstab)        
        _commonSvc.getDataFormEstabAsig(dataEstab).then(response=>{
            $scope.puntosEmisiones = response[0];
            $scope.bodegas = response[1];
        })
    }

    
    
    $scope.load = function(){
        
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
        
            //Listar Tipo Cliente
        mS.getData('get', '/TipoClienteProveedor/TipoClienteProveedorSelect?tipoValidacion=CL').then(response => {
            $scope.tipoClientes = response.data;                
        }, error => console.log(error));
        
        $scope.getFechaInicioFinFilter();

        mS.getData('get','/AnioFiscal/GetAll').then(response=>{
            $scope.anios = response.data;
            return                
        });

        mS.getData('get', '/TipoDocumento/Get').then(response => {
            $scope.tipoDocumentos = JSON.parse(response.data).filter(val=>['FV', 'NE'].includes(val.codigo));
            $scope.tipoDocumentos.push({
                codigo: '0',
                descripcion: 'Ventas(FV y NE)'
            });                                                         
            return
        });
    };
    $scope.load();

    


    $scope.openModalReporte = function(){
        $("#modalReporteConsumoCliente").modal('show');
        return
    };

    $scope.openModalReporteGrafico = function(){
        $("#ModalReporteGraficoVentaCliente").modal('show');
        return
    }

    $scope.onChangeSucursal = function(){
        if($scope.dataSearch.checkboxSucursalFiltro){
            $scope.dataSearch.checkboxPuntoEmisionFiltro = false;
        }
    };

    $scope.clienteSearch = function(text){
        return _commonSvc.clienteSearch((text))
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

    $scope.onChangeCheckboxTipoDocFiltro = function(){
        if(!$scope.dataSearch.checkboxTipoDocFiltro){
            $scope.dataSearch.byTipoDoc = ''
        }
    }

    $scope.filtrar = function(){
        const tituloToast = "Reporte";
        
        if(form.campo($scope.dataSearch.byCliente) || $scope.dataSearch.byCliente === 0){
            toast.toastr('warning', 'Seleccione el Cliente', tituloToast);
            return
        }

        if($scope.dataSearch.checkboxSucursalFiltro){
            if(form.campo($scope.dataSearch.codEstab)){
                toast.toastr('warning', 'Seleccione la Sucursal', tituloToast);
                return
            }
        }

        if($scope.dataSearch.checkboxPuntoEmisionFiltro){
            if(form.campo($scope.dataSearch.byPuntoEmision)){
                toast.toastr('warning', 'Seleccione el Punto de Emisión', tituloToast);
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

        if($scope.dataSearch.checkboxTipoDocFiltro){
            if(form.campo($scope.dataSearch.byTipoDoc)){
                toast.toastr('warning', 'Seleccione el Tipo Dpcumento', tituloToast);
                return
            }
        };

        let loaderGif = $scope.dataSearch.byTipoFormato === "pdf" ? 'document-office.gif' : 'transfer-file.gif'
        form.showLoaderForm('Descargando...', 'Espere', `/assets/images/gif/${loaderGif}`)
        $scope.getReport();
        return

    };

    $scope.getReport = function() {            
        const parameters = {
            reportParams: JSON.stringify({
                codigo: 'RCCRG', 
                format: $scope.dataSearch.byTipoFormato,
                aditionalParams: []
            }),
            dataParams: JSON.stringify($scope.dataSearch)
        };
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


    $scope.getEstadisticaCliente = function(){
        const tituloToast = 'Obtener Estadistica';

        if(form.campo($scope.dataSearch.byCliente)){
            toast.toastr('warning', 'Seleccione el Cliente', tituloToast);
            return
        }

        if($scope.dataSearch.checkboxSucursalRG){
            if(form.campo($scope.dataSearch.codEstab)){
                toast.toastr('warning', 'Seleccione la Sucursal', tituloToast);
                return
            }
        }

        if($scope.dataSearch.checkboxPtoEmisionRG){
            if(form.campo($scope.dataSearch.byPuntoEmisionRG)){
                toast.toastr('warning', 'Seleccione el Punto de Emisión', tituloToast);
                return
            }
        }

        if($scope.dataSearch.checkboxTipoDocRG){
            if(form.campo($scope.dataSearch.byTipoDocRG)){
                toast.toastr('warning', 'Seleccione el Tipo de Documento', tituloToast);
                return
            }
        };
        
        $scope.getEstadisticas();
        $("#ModalReporteGraficoVentaCliente").modal('hide');
        return
    }

    $scope.estadisticas = [];
    let chartAnual = null;
    const CHART_COLORES = {
        0: 'rgb(255, 99, 132)',
        1: 'rgb(255, 159, 64)',
        2: 'rgb(255, 205, 86)',
        3: 'rgb(75, 192, 192)',
        4: 'rgb(54, 162, 235)',
        5: 'rgb(153, 102, 255)',
        6: 'rgb(231,233,237)'
    };


    $scope.estadisticas = [];
    $scope.getEstadisticas = function () {
        $scope.estadisticas = [];
        $scope.dataSearch.idRol =  idUsuarioRol,
        $scope.dataSearch.anio = Number($scope.dataSearch.byAnio);

        mS.getData('get', `/EstadisticaVenta/GetClienteVenta?json=${JSON.stringify($scope.dataSearch)}`).then(response => {
            console.log(response)
            $scope.estadisticas = response; 
                        
            if ($scope.estadisticas.length > 0) {
                $scope.drawChartAnual();
            }
        }, error => console.log(error));
        
        return
    }
    $scope.getEstadisticas();

    $scope.drawChartAnual = function () {
        if (chartAnual != null) {
            chartAnual.destroy();
        }
        let datasets = [], groupClientes = [], unionClientes = [];

        //Eliminamos datos duplicados de tipo documento 
        const tipoDocumentosChart = $scope.estadisticas.map(val=>val.tipoDocumento).filter((item, indice, array)=>array.indexOf(item)===indice);
        //Eliminamos datos duplicados de meses 
        const clientesChart = $scope.estadisticas.map(val=>val.cliente).filter((item, indice, array)=>array.indexOf(item)===indice);                                         
            
        //Armamos los valores de barras 
        for (let index = 0; index < tipoDocumentosChart.length; index++) {                
            datasets.push({
                label: tipoDocumentosChart[index],//Tipo Documento (FV, NE, NC, RV)
                data: $scope.estadisticas.filter(val=>val.tipoDocumento===tipoDocumentosChart[index]).map(val=>val.total),
                fill: false,
                backgroundColor: CHART_COLORES[index],
                borderColor: CHART_COLORES[index],
                borderWidth: 1        
            });               
        }


        let myChartBar = document.getElementById("chartBarVentaClienteNetas").getContext('2d');
        
        $scope.myChart(myChartBar, 'bar', clientesChart, datasets);      
        //$scope.nyChart(myChartPie, 'pie', labels, data);           

    };

    $scope.myChart = function(chart, type, labels, datasets){
        chartAnual = new Chart(chart, {
            type,
            data: {
                labels,
                datasets                                                       
            }, options: {   
                indexAxis: 'y',                 
                scales: {
                    y: {
                        ticks: { 
                            beginAtZero: true 
                        }
                    },
                    x: {
                        ticks: {
                            beginAtZero: true,
                            autoSkip: false
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `POR VENTAS NETAS ${$scope.dataSearch.byAnio}`,
                        padding: {
                            top: 5,
                            bottom: 5
                        }
                    }
                }                   
            },
            responsive: true                
        });
    }





}





