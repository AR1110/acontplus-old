(function () {

    'use strict';

    app.controller('reporteVentaCtrl', reporteVentaCtrl);

    reporteVentaCtrl.$inject = ['$scope', '$injector'];

    function reporteVentaCtrl($scope, $injector) {
        const reporteVentaSvc = $injector.get('reporteVentaService');
        const decodeToken = $injector.get('decodeToken');
        const tS = $injector.get('toastService');
        const fS = $injector.get('formulario');
        const commonSvc = $injector.get('commonService');

        let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
        const DOC_TYPE = $injector.get('DOC_TYPE');
        const CODE_REPORT = $injector.get('CODE_REPORT');

        let format = 'pdf'

        // Obtén el año actual
        const anioActual = new Date().getFullYear();

        // Establece la fecha de inicio al primer día de enero
        const fechaInicio = new Date(anioActual, 0, 1);

        // Establece la fecha de fin al último día de diciembre
        const fechaFin = new Date(anioActual, 11, 31);

        $scope.dataSearch = {
            idEstablecimiento: 0,
            idPuntoEmision: 0,
            idEstadoDocumento: 0
        };
        $scope.establecimientos = [];
        $scope.puntosEmision = [];
        $scope.estadosDoc = [];
        $scope.tiposDoc = [];
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
        $scope.dataSearchEstadistica = {
            byAnio: anioActual,
            fechaInicio,
            fechaFin
        }

        initiload();
        getEstadisticas()
        function initiload() {
            try {
                showLoader();
                reporteVentaSvc.getDataForm().then(response => {
                    let { estabs, estadosDoc, tiposDoc } = response;
                    $scope.establecimientos = estabs;
                    if ($scope.establecimientos.length > 0) {
                        let dataEstab = $scope.establecimientos.find(estab => (estab.defaultEstab));
                        $scope.puntosEmision = dataEstab.puntosEmision;
                        $scope.dataSearchEstadistica.codEstab = dataEstab.codEstab;
                    }
                    $scope.tiposDoc = tiposDoc;
                    const dataTipoDoc = $scope.tiposDoc.find(tipoDoc => tipoDoc.codigoSri === DOC_TYPE.FV_SRI);
                    $scope.dataSearch.idTipoDocumento = dataTipoDoc.idTipoDocumento;
                    $scope.estadosDoc = estadosDoc.map(item => ({
                        ...item,
                        idEstadoDocumento: item.idEstadoPago
                    }))
                    console.log(response)
                })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }


        $scope.resultRangeFilter = function (item) {
            $scope.dataSearch.fechaInicio = item.startDate,
                $scope.dataSearch.fechaFin = item.endDate;
        }


        $scope.getReportPDF = function () {
            format = 'pdf';
            getReport();
        }
        $scope.getReportEXCEL = function () {
            format = 'excel';
            getReport();
        }


        function getTipoDoc (codigo){
            if(codigo===DOC_TYPE.FV) return DOC_TYPE.FV_SRI;
            
            return codigo;
        }

        function getReport() {
            try {
                if (!($scope.dataSearch.idTipoDocumento > 0)) {
                    tS.toastr('warning', 'Seleccione el Tipo Documento');
                    return
                }
                let dataEstab = $scope.establecimientos.find(estab=>estab.idEstablecimiento===$scope.dataSearch.idEstablecimiento);
                let dataEstado =$scope.estadosDoc.find(estado=>estado.idEstadoDocumento===$scope.dataSearch.idEstadoDocumento);
                let dataTipoDoc = $scope.tiposDoc.find(item => item.idTipoDocumento === $scope.dataSearch.idTipoDocumento)
                let dataParams = {
                    tipo: 2,
                    ckFecha: true,
                    codDoc: getTipoDoc(dataTipoDoc.codigo),
                    codEstab: dataEstab && dataEstab.codEstab || null,
                    idCliente: $scope.dataSearch.idCliente,
                    codEstado: dataEstado && dataEstado.codigo || null,
                    fechaInicio: fS.formatDateMoment($scope.dataSearch.fechaInicio),
                    fechaFin: fS.formatDateMoment($scope.dataSearch.fechaFin), 
                }
                const parameters = {
                    hasIdUsuarioRol: true,
                    reportParams: JSON.stringify({
                        hasParams: false,
                        codigo: CODE_REPORT.FG,
                        format,
                        aditionalParams: [],
                    }),
                    dataParams: JSON.stringify(dataParams),
                }
                commonSvc.getReport({
                    parameters,
                    formatType: format
                })
            } catch (error) {
                console.log(error)
            }

        }




        function getEstadisticas() {
            $scope.estadisticas = [];

            let params = {
                byAnio: $scope.dataSearchEstadistica.byAnio,
                codEstab: $scope.dataSearchEstadistica.codEstab,
                idRol: idUsuarioRol,
                codDoc: 'FV',
                checkboxTipoDocRG: false,
                fechaInicio: $scope.dataSearchEstadistica.fechaInicio,
                fechaFin: $scope.dataSearchEstadistica.fechaFin
            }
            reporteVentaSvc.getEstadisticas(params).then(response => {
                $scope.estadisticas = response;
                if ($scope.estadisticas.length > 0) {
                    drawChartAnual();
                }
            })
        }

        function drawChartAnual() {
            if (chartAnual != null) {
                chartAnual.destroy();
            }

            let datasets = [];

            //Eliminamos datos duplicados de tipo documento
            const tipoDocumentosChart = $scope.estadisticas.map(val => val.doc).filter((valor, indice, array) => array.indexOf(valor) === indice);

            //Eliminamos datos duplicados de meses
            const mesesChart = $scope.estadisticas.map(val => val.nombreMes).filter((valor, indice, array) => array.indexOf(valor) === indice);


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
            //  let myChartPie = document.getElementById("chartPieAnualVentas").getContext('2d');
            myChart(myChartBar, 'bar', mesesChart, datasets);
            //  myChart(myChartPie, 'pie', mesesChart, datasets);


        }

        function myChart(chart, type, labels, datasets) {
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

    }

})(window.angular)