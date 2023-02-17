(() => {

    'use strict';

    let app = angular.module('acontPlusApp');

    app.controller('reporteVentaCtrl', reporteVentaCtrl);
    reporteVentaCtrl.$inject = ['$scope', 'commonService', 'mainService', 'toastService', 'formulario', 'FileSaver', 'Blob'];

    function reporteVentaCtrl($scope, _commonSvc, mS, toast, form, FileSaver, Blob) {
        //Filters        
        $scope.meses = form.meses();
        $scope.mes = new Date().getMonth() + 1;
        $scope.dataSearch = {};
        $scope.dataSearch.tipoReporte = '';
        $scope.dataSearch.radioFechaFiltro = true;

        $scope.dataSearch.checkboxClienteFiltro = false;
        $scope.dataSearch.checkboxEstadoFiltro = false;
        $scope.dataSearch.checkboxUsuarioFiltro = false;

        $scope.dataSearch.byOrderCampo = 'fv.fechaEmision';
        $scope.dataSearch.byOrder = 'ASC';
        $scope.dataSearch.byTipoFormato = 'pdf';

        $scope.tipoDocumentos = [
            { codigo: 'FV', descripcion: 'Factura Venta', codigoReporte: 'FVRG' },
            { codigo: 'NE', descripcion: 'Nota de Entrega', codigoReporte: 'NERG' },
            { codigo: 'NC', descripcion: 'Nota de Crédito', codigoReporte: 'NCRG' },
            { codigo: 'RV', descripcion: 'Retencion Venta', codigoReporte: 'RVRG' },
            { codigo: 'PR', descripcion: 'Proforma', codigoReporte: 'PRRG' },
            { codigo: 'FVNE', descripcion: 'Consolidado Venta', codigoReporte: 'RFVNE' }
        ];

        $scope.dataSearch.codDoc = 'FV';

        //Estado Pago Factura de Venta 
        $scope.estadoPagosFV = [
            { id: 4, descripcion: 'Cobrada' },
            { id: -4, descripcion: 'Diferente de Cobrada' },
            { id: 5, descripcion: 'Anulada' },
            { id: -5, descripcion: 'Diferente de Anulada' },
            { id: 1, descripcion: 'Autorizada' },
            { id: -1, descripcion: 'Diferente de Autorizada' },
        ];

        //Estado Pago Nota de Entrega 
        $scope.estadoPagosNE = [
            { id: 4, descripcion: 'Cobrada' },
            { id: -4, descripcion: 'Diferente de Cobrada' },
            { id: 5, descripcion: 'Anulada' },
            { id: -5, descripcion: 'Diferente de Anulada' },
        ];

        //Estado de Nota de Credito
        $scope.estadoPagosNC = [
            { id: 5, descripcion: 'Anulada' },
            { id: -5, descripcion: 'Diferente de Anulada' },
            { id: 1, descripcion: 'Autorizada' },
            { id: -1, descripcion: 'Diferente de Autorizada' },
        ];

        $scope.estadoPagosNC = [
            // {id: 4, descripcion: 'Pendiente'},
            {id: 4, descripcion: 'Cobrada'},
        ]

        $scope.dataSearch.byAnio = new Date().getFullYear().toString();
        $scope.dataSearch.checkboxTipoDocRG = false;
        $scope.dataSearch.byTipoDocRG = 0;

        $scope.getFechaInicioFinFilter = function () {
            let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter($scope.mes);
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

            //Listar Tipo Cliente
            mS.getData('get', '/TipoClienteProveedor/TipoClienteProveedorSelect?tipoValidacion=CL').then(response => {
                $scope.tipoClientes = response.data;
            }, error => console.log(error));

            $scope.getFechaInicioFinFilter();

            mS.getData('get', '/AnioFiscal/GetAll').then(response => {
                $scope.anios = response.data;
            });

            mS.getData('get', '/TipoDocumento/Get').then(response => {
                $scope.tipoDocs = JSON.parse(response.data).filter(val => ['FV', 'NE', 'RV', 'NC'].includes(val.codigo));
                $scope.tipoDocs.push({
                    codigo: '1',
                    descripcion: 'Ventas(FV y NE)'
                });
                return
            }
            );
        };
        $scope.load();



        $scope.openModalFiltroReporteVenta = function () {
            $("#modalFiltroReporteVenta").modal('show');
            return
        };

        $scope.openModalReporteGraficoVenta = function () {
            $("#modalReporteGraficoVenta").modal('show');
            return
        }
        //------------------------Tipo Reporte -----------------
        $scope.onChangeTipoReporte = function () {
            if ($scope.dataSearch.codDoc === "FV") {
                $scope.dataSearch.byOrderCampo = 'fv.nroFactura';
                return
            }

            if ($scope.dataSearch.codDoc === "NE") {
                $scope.dataSearch.byOrderCampo = 'ne.fechaEmision';
            }

            if ($scope.dataSearch.codDoc === "NC") {
                $scope.dataSearch.byOrderCampo = "nc.nroDocumento";
            }

            if ($scope.dataSearch.codDoc === "RV") {
                $scope.dataSearch.byOrderCampo = "rv.nroDoc";
                $scope.dataSearch.checkboxPuntoEmisionFiltro = false;
            }

            if ($scope.dataSearch.codDoc === "PR") {
                $scope.dataSearch.byOrderCampo = "pr.fechaEmision";
                $scope.dataSearch.radioFechaFiltro = true;
                $scope.dataSearch.checkboxRetencionFiltro = false;
                $scope.dataSearch.checkboxDevolucionFiltro = false;
                return
            }

            if($scope.dataSearch.codDoc==="FVNE"){

            }

        };

        $scope.onChangeSucursal = function () {
            if (!$scope.dataSearch.checkboxSucursalFiltro) {
                $scope.dataSearch.checkboxPuntoEmisionFiltro = false;
            }
        }

        //------------------------Cliente ----------------------
        $scope.onChangeClienteFiltro = function () {
            if (!$scope.dataSearch.checkboxClienteFiltro) {
                $scope.dataSearch.byCliente = 0;
                $scope.selectedClientePersonalizado = '';
            }
        };

        $scope.clienteSearch = (textSearch) => _commonSvc.clienteSearch(textSearch)

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

        //------------------------Usuario----------------------------
        $scope.dataUsuarioFilter = {}
        $scope.usuarioSearch = (textSearch) => {
            return _commonSvc.usuarioSearch({
                idRol: document.getElementById('idRol').value,
                busqueda: textSearch
            })
        }

        $scope.onKeyupUsuarioSearchFilter = () => {
            if (form.campo($scope.dataUsuarioFilter.nombreCompleto)) {
                $scope.dataSearch.byUsuario = null;
            }
        }

        $scope.selectedUsuarioSearchFilter = (item) => {
            $scope.dataSearch.byUsuario = item.idUsuario;
        }

        $scope.onChangeUsuarioFiltro = function () {
            if (!$scope.dataSearch.checkboxUsuarioFiltro) {
                $scope.dataSearch.byUsuario = 0;
                $scope.modelUsuarioFilter = '';
            }
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

        $scope.filtrarReporteVenta = async function () {
            let tituloToast = 'Filtro';

            if (form.campo($scope.dataSearch.codDoc)) {
                toast.toastr('warning', 'Seleccione el Tipo Documento', tituloToast);
                return
            }

            if ($scope.dataSearch.checkboxSucursalFiltro) {
                if (form.campo($scope.dataSearch.codEstab) || $scope.dataSearch.codEstab === 0) {
                    toast.toastr('warning', 'Seleccione la Sucursal', tituloToast);
                    return
                }
            }

            if ($scope.dataSearch.checkboxPuntoEmisionFiltro) {
                if (form.campo($scope.dataSearch.byPuntoEmision)) {
                    toast.toastr('warning', 'Seleccione el Punto de Emisión', tituloToast);
                    return
                }
            }
           

            if ($scope.dataSearch.checkboxClienteFiltro) {
                if (form.campo($scope.dataSearch.byCliente) || $scope.dataSearch.byCliente === 0) {
                    toast.toastr('warning', 'Seleccione el Cliente', tituloToast);
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


            if ($scope.dataSearch.checkboxEstadoFiltro) {
                if (form.campo($scope.dataSearch.byEstado) || $scope.dataSearch.byEstado === 0) {
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
         
            $scope.getReport();
            return

        }




        $scope.getReport = function () {
            let dataReporte = $scope.tipoDocumentos.find(val => val.codigo === $scope.dataSearch.codDoc);

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: dataReporte.codigoReporte,
                    format: $scope.dataSearch.byTipoFormato,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify($scope.dataSearch)
            }

            _commonSvc.getReport({
                parameters,
                formatType: $scope.dataSearch.byTipoFormato
            })            
        }


        $scope.getEstadistica = function () {
            const tituloEstadistica = 'Estadistica';

            if ($scope.dataSearch.checkboxSucursalFG) {
                if (form.campo($scope.dataSearch.codEstab)) {
                    toast.toastr('warning', 'Seleccione la Sucursal', tituloEstadistica);
                    return
                }
            }

            if ($scope.dataSearch.checkboxPtoEmisionFG) {
                if (form.campo($scope.dataSearch.byPtoEmisionRG)) {
                    toast.toastr('warning', 'Seleccione el Punto de Emisión', tituloEstadistica);
                    return
                }
            }

            if ($scope.dataSearch.checkboxTipoDocRG) {
                if (form.campo($scope.dataSearch.byTipoDocRG)) {
                    toast.toastr('warning', 'Seleccione el Tipo de Documento', tituloEstadistica);
                    return
                }
            }

            $scope.getEstadisticas();
            $("#modalReporteGraficoVenta").modal('hide');
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
            $scope.dataSearch.idRol = Number($("#idRol").val());
            $scope.dataSearch.anio = Number($scope.dataSearch.byAnio);

            mS.getData('get', `/EstadisticaVenta/Get?json=${JSON.stringify($scope.dataSearch)}`).then(response => {
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

            let datasets = [], groupMeses = [], unionMeses = [];

            //Eliminamos datos duplicados de tipo documento 
            const tipoDocumentosChart = $scope.estadisticas.map(val => val.doc).filter((valor, indice, array) => array.indexOf(valor) === indice);
            //Eliminamos datos duplicados de meses 
            const mesesChart = $scope.estadisticas.map(val => val.nombreMes).filter((valor, indice, array) => array.indexOf(valor) === indice);

            //Agrupamos los datos por meses 
            // for(let mes of mesesChart){                
            //     groupMeses.push($scope.estadisticas.filter(item=>item.nombreMes===mes))            
            // }

            // //Unimos los meses 
            // for(let indexDoc=0; indexDoc < tipoDocumentosChart.length; indexDoc++){
            //     for(let group of groupMeses){                   
            //         unionMeses.push(group.at(indexDoc))
            //     }
            // }                

            //Armamos los valores de barras 
            for (let index = 0; index < tipoDocumentosChart.length; index++) {
                datasets.push({
                    label: tipoDocumentosChart[index],//Tipo Documento (FV, NE, NC, RV)
                    data: $scope.estadisticas.filter(val => val.doc === tipoDocumentosChart[index]).map(val => val.total),
                    fill: false,
                    backgroundColor: CHART_COLORES[index],
                    borderColor: CHART_COLORES[index],
                    borderWidth: 1
                });
            }

            let myChartBar = document.getElementById("chartBarAnualVentas").getContext('2d');
            // let myChartPie = document.getElementById("chartPieAnualVentas").getContext('2d');
            $scope.myChart(myChartBar, 'bar', mesesChart, datasets);
            //$scope.nyChart(myChartPie, 'pie', labels, datasets);           


        };

        $scope.myChart = function (chart, type, labels, datasets) {
            chartAnual = new Chart(chart, {
                type,
                data: {
                    labels,
                    datasets
                }, options: {
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
                            text: `Reporte Venta ${$scope.dataSearch.byAnio}`,
                            padding: {
                                top: 10,
                                bottom: 30
                            }
                        }
                    }
                },
                responsive: true
            });
        }





        $scope.reportTest = () => {
            let dataReporte = $scope.tipoDocumentos.find(val => val.codigo === $scope.dataSearch.codDoc);

            const parameters = {
                reportParams: JSON.stringify({
                    codigo: dataReporte.codigoReporte,
                    format: 'Image',
                    aditionalParams: []
                }),
                dataParams: JSON.stringify($scope.dataSearch)
            };

            mS.getFile('post', '/Reporte/DownloadTest', parameters).then(response => {
                hideLoader();


                let fileBlob = new Blob([response.data], {
                    type: response.data.type,
                })

                let objectUrl = window.URL || window.webkitURL;
                let urlFile = objectUrl.createObjectURL(fileBlob);

                // Ajuste horizontal
                let x = parseInt((screen.width - 1200) / 2);
                // Ajustae vertical
                let y = parseInt((screen.height - 650) / 4);

                window.open(
                    urlFile,
                    "_blank",
                    `resizable=yes
                    width=1200
                    height=650
                    screenY=${y}
                    screenX=${x}`
                )

            })

        }
    }
})(window.angular)