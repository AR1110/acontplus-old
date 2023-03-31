
(()=>{

    'use strict';

    app.controller('resumenVentaCtrl', resumenVentaCtrl);

    resumenVentaCtrl.$inject = ['$scope', 'mainService'];

    function resumenVentaCtrl($scope, mainService){
        console.log('resumenVentaCtrl');

        let thisMoment = moment()
        let endOfMonth = moment(thisMoment).endOf('month')
        let startOfMonth = moment(thisMoment).startOf('month')
       
        //https://www.daterangepicker.com/
        $scope.dateRangePicker = {
            date: { startDate: startOfMonth, endDate: endOfMonth },
            picker: null,
            options: {
                pickerClasses: 'custom-display', //angular-daterangepicker extra
                buttonClasses: 'btn',
                applyButtonClasses: 'btn-success',
                cancelButtonClasses: 'btn-danger',
                locale: {
                    applyLabel: "Aplicar",
                    cancelLabel: 'Cancelar',
                    customRangeLabel: 'Rango Personalizado',
                    separator: ' - ',
                    format: "YYYY-MM-DD", //will give you 2017-01-06
                    //format: "D-MMM-YY", //will give you 6-Jan-17
                    //format: "D-MMMM-YY", //will give you 6-January-17
                },
                ranges: {
                    'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                    'Ultimos 30 Días': [moment().subtract(29, 'days'), moment()]
                },
                eventHandlers: {
                    'apply.daterangepicker': function (event, picker) {
                        $scope.getComprobantes()
                        console.log('applied')
                    }
                }
            }
        };


        var start = moment().subtract(29, 'days');
        var end = moment();

        function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);


        $scope.datePicker = {
            date: {
                startDate: moment().subtract(1, 'years'), 
                endDate: moment().add(1, 'years')
            }, 
            picker: null,
            options: {
                pickerClasses: 'custom-display', //angular-daterangepicker extra
                buttonClasses: 'btn',
                applyButtonClasses: 'btn-success',
                cancelButtonClasses: 'btn-danger',
                locale: {
                    applyLabel: "Aplicar",
                    cancelLabel: 'Cancelar',
                    customRangeLabel: 'Rango Personalizado',
                    separator: ' - ',
                    format: "YYYY-MM-DD", //will give you 2017-01-06
                    //format: "D-MMM-YY", //will give you 6-Jan-17
                    //format: "D-MMMM-YY", //will give you 6-January-17
                },
                ranges: {
                    'Hoy': [moment(), moment()],
                    'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Los últimos 7 días': [moment().subtract(6, 'days'), moment()],
                    'últimos 30 días': [moment().subtract(29, 'days'), moment()],
                    'Este mes': [moment().startOf('month'), moment().endOf('month')],
                    'El mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                eventHandlers: {
                    'apply.daterangepicker': function(event, picker) { console.log('applied'); }
                }
            }
        };




    }







    //------------------------------START REPORTE VENTA------------------------------

    app.controller('reporteVentaCtrl', reporteVentaCtrl);

    reporteVentaCtrl.$inject = ['$scope', 'mainService'];

    function reporteVentaCtrl($scope, mainService){


    }

    //------------------------------END REPORTE VENTA--------------------------------



    //------------------------------START REPORTE COMPRA------------------------------

    app.controller('reporteCompraCtrl', reporteCompraCtrl);

    reporteCompraCtrl.$inject = ['$scope', 'mainService'];
 
    function reporteCompraCtrl($scope, mainService){
 


    }
 
    //------------------------------END REPORTE COMPRA--------------------------------




})(window.angular)