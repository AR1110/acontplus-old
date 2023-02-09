app.controller/

(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('kardexCtrl', kardexCtrl);

    kardexCtrl.$inject = ['$scope', '$timeout', '$http', 'mainService', 'toastService', 'formulario'];

    function kardexCtrl($scope, $timeout, $http, mS, toast, form) {
        $scope.search = {};
        $scope.data = {};
        $scope.dataSearch = {};
        $scope.dataSearch.consolidacion = 0;

        $timeout(() => {
            $('body').addClass('mini-sidebar');














            
            //$("#toggleButton").hide(); 
            $("#nombreEmpresa").hide();
        }, 10);
        
        // $(".sidebar-nav").on('mouseover', toogleSideBar).on('mouseout',toogleSideBar )

        // function toogleSideBar(){
        //     if($('body').hasClass('mini-sidebar')){
        //         $('body').removeClass('mini-sidebar'); 
        //         $("#nombreEmpresa").show(); 
        //     }else{
        //         $('body').addClass('mini-sidebar');  
        //         $("#nombreEmpresa").hide();
        //     }   
        // }



        $scope.init = function () {
            mS.getData('get', '/Sucursal/GetSucursalByRol').then(response => {
                if (response.id === "0") {
                    toast.toastr('warning', response.message);
                    return;
                }
                $scope.sucursales = response;
                $scope.search.idSucursal = response[0].idSucursal;
                $scope.getBodegaByIdSucursal(response[0].idSucursal);
            }, error => console.log(error));


            mS.getData('get', '/TipoDocumento/GetAll').then(response => {
                $scope.tipoDocumentos = response.data;
            });

        }
        $scope.init();


        $scope.getBodegaByIdSucursal = idSucursal => {
            mS.getData('get', '/Bodega/GetByIdSucursal?idSucursal=' + idSucursal).then(response => {
                if (response.id === "0") {
                    toast.toastr('warning', response.message);
                    return
                }
                $scope.bodegas = response.data;
                // $scope.search.idBodega = response.data[0].idBodega
            })
        };

        //Open Modal
        $scope.abrirModalSearch = function () {
            $("#modalSearch").modal('show');
            $("input[name='clienteAutocomplete']").focus();
        }

        $scope.onChangeBodega = function () {
            if (!$scope.dataSearch.bodegaFilterKardex) {
                $scope.dataSearch.byBodega = 0;
            }
        }

        $scope.onChangeFecha = function () {
            if ($scope.dataSearch.fechaFilterKardex) {
                let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter(0);
                $scope.dataSearch.fechaInicio = fechaInicio;
                $scope.dataSearch.fechaFin = fechaFin;
            } else {
                $scope.dataSearch.fechaInicio = null;
                $scope.dataSearch.fechaFin = null;
            }
        }

        $scope.onChangeConsolidacionUno = function () {
            $scope.dataSearch.consolidacion = 0
            if ($scope.dataSearch.consolidacionUno === 1) {
                $scope.dataSearch.consolidacion = 1;
                $scope.dataSearch.consolidacionDos = 0;

                $scope.dataSearch.fechaFilterKardex = false;
                $scope.dataSearch.fechaInicio = null;
                $scope.dataSearch.fechaFin = null;
                return
            };
        }

        $scope.onChangeConsolidacionDos = function () {
            $scope.dataSearch.consolidacion = 0
            if ($scope.dataSearch.consolidacionDos === 2) {
                $scope.dataSearch.consolidacion = 2;
                $scope.dataSearch.consolidacionUno = 0;
                return
            }

        }

        //Search product 
        $scope.searchArticuloFilter = function (search) {
            return $http.get('/Articulo/SearchArticuloFilter?busqueda=' + search).then(response => {
                if (response.data.id == "0") {
                    console.log(response.data)
                    return;
                }
                let { filter: data } = response.data.data;
                return data;
            })
        };

        $scope.onKeyupSearchArticulo = function (text) {
            if (text == null || text === undefined || text === "") {
                $scope.data = {};
                $scope.articulo = {};
                $scope.search.selectedArticulo = undefined;
                $scope.dataSearch.idArticulo = undefined;
                $scope.kardexs = [];
                table.clearData();
                return
            }
        }

        $scope.selectedArticuloChange = function (item) {
            if (!form.campo(item)){
                $scope.articulo = item.articulo;
                $scope.search.selectedArticulo = item;
                $scope.dataSearch.byArticulo = item.articulo.idArticulo;
                return
            };            
        };



        //Table Tabulator Test 
        let table = new Tabulator("#tabla-kardex", {
            height: "400px",
            width: "100%",
            // layout:"fitDataFill",
            // layout: "fitDataStretch",
            // layout:"fitColumns", 
            layout:"fitDataFill",
            
            //layout:"fitDataTable",           
            //renderHorizontal:"virtual",
            // autoColumns:true,
            columnHeaderVertAlign: "bottom",
            // movableRows:true,
            tooltipGenerationMode: "hover",
            rowFormatter: function (row) {                
                 if (row.getData().tipoDoc === 'CIV') {                    
                    // row.getElement().classList().add(row.getData().style);                                        
                     row.getElement().style.backgroundColor = "#fedf7e";
                }
                if(row.getData().style === 'table-danger'){
                    row.getElement().style.backgroundColor = "#F5BCB0";
                }
            },
            columnDefaults: {
                tooltip: true,
            },
            columns: [
                {
                    //create column group ---frozen:true,
                    title: "Descripcion", widthGrow:2, frozen:true,
                    columns: [
                        {
                            title: "F. Emision", field: "fechaEmision", hozAlign: "center",    headerSort: false, sorter: "date", width: 120
                        },
                        {
                            title: "T. Doc", field: "tipoDoc", hozAlign: "center",  headerSort: false, width: 60
                        },
                        {
                            title: "Nro. Doc", field: "nroDocumento", hozAlign: "left",  headerSort: false, width: 130
                        },
                        {
                            title: "Cliente/Proveedor", field: "clienteProveedor", headerSort: false, hozAlign: "left",  width: 150, tooltip: true
                        },
                        {
                            title: "Bodega", field: "bodega", hozAlign: "center",  headerSort: false, width: 150
                        },
                        {
                             title:"Usuario", field:"usuario", hozAlign:"center",  headerSort:false, width:150
                        },

                    ],
                },
                {//create column group
                    title: "Entradas",
                    columns: [
                        {
                            title: "Medida", field: "medidaEntrada", width: 70, headerSort: false, cssClass: "table-entradas",
                        },
                        {
                            title: "Cant.", field: "cantidadEntrada", bottomCalc: sumCantidadEntrada, width: 60, headerSort: false, cssClass: "table-entradas",
                        },
                        {
                            title: "Costo U.", field: "costo", hozAlign: "center", headerSort: false, sorter: "date", width: 75, cssClass: "table-entradas",
                        },
                        {
                            title: "Total", field: "totalEntrada", bottomCalc: sumTotalEntrada, hozAlign: "center", headerSort: false, sorter: "date", width: 75, cssClass: "table-entradas",
                        },
                    ],
                },
                {//create column group
                    title: "Salidas",
                    columns: [
                        {
                            title: "Medida", field: "medidaSalida", width: 70, headerSort: false, cssClass: "table-salidas",
                        },
                        {
                            title: "Cant.", field: "cantidadSalida", bottomCalc: sumCantidadSalida, width: 60, headerSort: false, cssClass: "table-salidas",
                        },
                        {
                            title: "P. Venta", field: "venta", hozAlign: "center", headerSort: false, sorter: "date", width: 75, cssClass: "table-salidas",
                        },
                        {
                            title: "Total", field: "totalSalida", bottomCalc: sumTotalSalida, hozAlign: "center", headerSort: false, width: 75, cssClass: "table-salidas",
                        },
                    ],
                },
                {//create column group
                    title: "Saldos",
                    columns: [
                        {
                            title: "Cant. ", field: "saldo", width: 60, headerSort: false, bottomCalc: sumTotalCantSaldo, cssClass: "table-saldos",
                        },
                        {
                            title: "Costo U.", field: "precioCosto", width: 70, headerSort: false, bottomCalc: sumTotalPrecioCostoSaldo, sorter: "number", cssClass: "table-saldos",
                        },
                        {
                            title: "Total", field: "totalGenetal", hozAlign: "center", width: 60, headerSort: false, sorter: "number", bottomCalc: sumTotalGeneral, bottomCalcParams: { precision: 3 }, cssClass: "table-saldos",
                        },
                    ],
                },
            ],
        });

        table.on("rowClick", function (e, row) {
            
        });

        function sumCantidadEntrada(values, data, calcParams) {                                                
            return $scope.data.cantTotalEntrada;            
        }

        function sumTotalEntrada(values, data, calcParams) {          
            return $scope.data.totalEntrada;                     
        }

        function sumCantidadSalida(values, data, calcParams) {           
            return $scope.data.cantTotalSalida
        }

        function sumTotalSalida(values, data, calcParams) {            
            return $scope.data.totalSalida;
        }

        function sumTotalCantSaldo(values, data, calcParams) {
            return $scope.data.stock;
        }

        function sumTotalPrecioCostoSaldo(){
            return $scope.precioCostoSaldo;
        }

        function sumTotalGeneral(){
            return $scope.totalGenetal;
        }


        //Search Kardex 
        $scope.searchKardex = function () {
            let tituloToast = 'Buscar';
            if (form.campo($scope.dataSearch.byArticulo)) {
                toast.toastr('warning', 'Seleccione el Articulo', tituloToast);
                return
            }

            if ($scope.dataSearch.bodegaFilterKardex) {
                if (form.campo($scope.dataSearch.byBodega) || $scope.dataSearch.byBodega === 0) {
                    toast.toastr('warning', 'Seleccione la Bodega', tituloToast);
                    return
                }
            }

            if ($scope.dataSearch.fechaFilterKardex) {
                if (form.campo($scope.dataSearch.fechaInicio)) {
                    toast.toastr('warning', 'Ingrese la Fecha de Inicio', tituloToast);
                    return
                }
                if (form.campo($scope.dataSearch.fechaFin)) {
                    toast.toastr('warning', 'Ingrese la Fecha Fin', tituloToast);
                    return
                }
            }

            showLoader(); //Loader 
            $scope.getKardex();

        };

        $scope.getKardex = function () {
            mS.getData('get', '/Kardex/GetKardexTotales?idArticulo=' + $scope.dataSearch.byArticulo).then(response => {
                if (response.id === "0") {
                    hideLoader(); //Loader 
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id === "1") {
                    let { cantTotalEntrada, totalEntrada, cantTotalSalida, totalSalida, stock } = response.data;
                    table.cantTotalEntrada = cantTotalEntrada;
                    $scope.data.cantTotalEntrada = cantTotalEntrada;
                    $scope.data.totalEntrada = totalEntrada;
                    $scope.data.cantTotalSalida = cantTotalSalida;
                    $scope.data.totalSalida = totalSalida;
                    $scope.data.stock = stock;

                    mS.getData('post', '/Kardex/GetKardex', $scope.dataSearch).then(response => {                        
                        if(response.id===null){
                            form.sweetAlert('warning', 'Ups! Algo salio mal <i class="far fa-frown"></i>!', response.titleSms);
                            return                           
                        }
                        if (response.id === "0") {
                            hideLoader(); //Loader Hide
                            Swal.fire({
                                icon: 'warning',
                                html: `<small>No existen Datos</small>`
                            });
                            return
                        };

                      
                        $scope.kardexs = JSON.parse(response.data);      
                                            
                        $scope.getTotalesSaldo();        
                        table.setData(response.data); //                        
        
                        if (form.campo(response.data) || response.data.length === 0) {
                            hideLoader(); //Loader Hide
                            Swal.fire({
                                icon: 'info',
                                html: `<small>No se encontrarón los resultados</small>`
                            });
                            return
                        } else {
                            $("#modalKardexArticulo").modal('show');
                            $("#modalSearch").modal('hide');
                        }
                        return
        
        
                    })
                }
            });            
        }

        $scope.getTotalesSaldo = function () {            
            if(form.campo($scope.kardexs) && $scope.kardexs.length===0) return 

            let obj = $scope.kardexs[$scope.kardexs.length - 1];
            
            $scope.precioCostoSaldo = form.roundNumber(obj.precioCosto, 5);
            $scope.totalGenetal = form.roundNumber(obj.totalGenetal, 5);
            
            return

            // if(!form.campo($scope.kardexs) && $scope.kardexs.length>0){                
                
            //     //Verificar si hay consolidaciones de inventario del Articulo 
            //     if($scope.kardexs.some(val=>val.tipoDoc==="CIV")){
            //         $scope.kardexs.forEach((val, index)=>{
            //             if(val.tipoDoc==="CIV"){
            //                 //Obtenemos los indices de todas la consolidaciones;
            //                 anuladas.push(index);
            //             };
            //         });
            //         //Obtenemos el indice maximo de la consolidacioón  
            //         let indexMaximo =  Math.max(...anuladas.map(o => o));                                      
     
            //         //Obtenemos todos lo valores del total General pertenecimientos al indice maximo obtenido
            //         kardexs = $scope.kardexs.filter((val, index, array) =>indexMaximo<index).map(val=>val.totalGenetal);
            //     }else{
            //         kardexs = $scope.kardexs.map(val=>val.totalGenetal);
            //     };
                
            //     precioCostoSaldo = $scope.kardexs.map(val => val.precioCosto).reduce((prev, curr) => prev + curr, 0);                
            //     totalGenetal =  kardexs.reduce((prev, curr) => prev + curr, 0);   

            //     $scope.precioCostoSaldo = form.roundNumber(precioCostoSaldo, 5);
            //     $scope.totalGenetal = form.roundNumber(totalGenetal, 5);
            //     return
            // }
        }

        $scope.openModalTipoDocumentoDetalle = function (item) {
            const data = {
                id: item.idComprobante,
                codigoTipoDocumento: item.tipoDoc
            };

            //Enviar Id y Codigo al Controlador File: shared/docManagementCtrl.js
            $scope.$broadcast("openModalDetalleTipoDocumento", data);
            return
        }


        //Recibimos datos del articulo desde el Controlador Almacen/ArticuloCtl.js                
        $scope.$on("dataArticuloParaKardex", (e, value) => {
            let { fechaInicio, fechaFin } = form.getFechaInicioFinFilter(0);
            $scope.dataSearch.fechaInicio = fechaInicio;
            $scope.dataSearch.fechaFin = fechaFin;

            $scope.articulo = value;
            $scope.dataSearch.byArticulo = $scope.articulo.idArticulo;

            $scope.getKardex();
        });


        $("#modalKardexArticulo").on('hide.bs.modal', e => {
            $scope.articulo = {};
            $scope.kardexs = [];
        });






        $("#modalSearch").on('hide.bs.modal', function () {
            hideLoader();
        });
    }
})(window.angular);
