

(function () {
    angular.module('acontPlusApp')
        .controller('articuloComposicionCtrl', articuloComposicionCtrl);

    articuloComposicionCtrl.$inject = ['$scope', '$interval', '$timeout', 'toastService', 'formulario'];

    function articuloComposicionCtrl($scope, $interval, $timeout, toast, form) {
        
        $scope.data = {};
        $scope.articuloCompuesto = {};
        $scope.articuloDetalle = {};
        $scope.pvpArtCompuesto = {}; //PvP de Articulo Compuesto Principal 
        $scope.articuloPvPDetalle = {}; //PvP del Articulo Simple Detalle
        $scope.composicionArticuloDetalle = {};
        $scope.composicionArticulo = {};

        $scope.composicionArticulos = [];


        $scope.articuloCompuestos = []; //List Articulo Compuesto 
        $scope.articuloSimples = []; //List Articulo Simple
        
        $scope.pvpArtCompuestos = []; //List PVP articulo Compuesto 
        $scope.pvpArtSimples = [];  //List Pvp Articulo Simple 
        $scope.pvpCampos = true;
        $scope.campoArticulo = true;
        $scope.total = 0;

        //Paginacion
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50];


        $scope.searchArticulo = function () {
            aS.searchArticulo().then(function (data) {
                console.log(data)
                const esCompuesto = articulo => articulo.articulo.idTipoArticulo == 3; 
                const esSimple = articulo => !esCompuesto(articulo);

                $scope.articuloCompuestos = data.filter(esCompuesto); //Articulo compuesto 
                $scope.articuloSimples = data.filter(esSimple); //Articulo Simple
                
            })
        }
        $scope.searchArticulo();


        $scope.articuloTarifa = function (articulo, tipoArticulo) {
            $scope.data.articulo = articulo;
            aS.listTarifaArticulo($scope.data).then(function (data) {
                //Tarifa Articulo Compuesto
                if (tipoArticulo == 3) {
                    $scope.pvpArtCompuestos = data;
                    $scope.pvpArtCompuesto = $scope.pvpArtCompuestos[0];
                }
                if (tipoArticulo == 2) {
                    $scope.pvpArtSimples = data;
                    $scope.articuloPvPDetalle = $scope.pvpArtSimples[0];
                }
            })
        }

       

        $scope.$watch("articuloCompuesto", function (articulo) {
            if (articulo.articulo) {
                $scope.articuloTarifa(articulo.articulo, 3);
                $scope.campoArticulo = false;
            }
        });

        $scope.$watch("articuloDetalle", function (articulo) {
            if (articulo.articulo) {
                $scope.articuloTarifa(articulo.articulo, 2)
                $scope.pvpCampos = false;
            }
        })

        $scope.$watch('articuloPvPDetalle', function (pvp) {
            if (pvp !== null) {
                if (pvp.articuloPvP) {
                    $scope.composicionArticuloDetalle.precioVenta = pvp.articuloPvP.precioVenta;
                    $scope.subTotal($scope.composicionArticuloDetalle);

                }
            }
        });

        $scope.$watch('pvpArtCompuesto', function (pvp) {
            if (pvp.articuloPvP) {
                $scope.pvpArtCompuesto.articuloPvP.precioVenta = pvp.articuloPvP.precioVenta;
            }
        })
        $scope.showFormulario = function (tipoOperacion) {
            $scope.data.tipoOperacion = tipoOperacion;
            $("#formArticuloCompuesto").show();
            $("#tablaComposicionArticulo").hide();
        }

        $scope.cerrarFormulario = function () {
            $scope.data.tipoOperacion=''
            $("#formArticuloCompuesto").hide();
            $("#tablaComposicionArticulo").show('fast');
        }

        $scope.selectArticuloCompuesto = function ($item) {
            $scope.articuloCompuesto = $item.articulo;            
            $scope.gridOptions.data.push({})
        }
        $scope.selectArticuloSimple = function (entity, $item) {
            $scope.articuloSimple = $item.articulo;
            $scope.gridOptions.data.push({})
        }

        $scope.addItem = function () {
            $scope.gridOptions.data.push({})
        }

        $interval(function () {
            
            if (form.campo($("#articuloCompuesto").val()) && $scope.data.tipoOperacion==1) {
                logger.info('Todavia no has seleccionado el Articulo Compuesto', 'Seleccionar el Articulo Compuesto');
                $scope.articuloCompuesto = {};
                $("#articuloCompuesto").focus();
                $scope.gridOptions.data.forEach((val)=>{
                    if (form.campo(val.articuloSimple)) {
                        $scope.gridOptions.data = [];
                    }
                },0)
                return;
            }            
        }, 6000)
        //$scope.addItem = function () {
        //    if (form.campo($scope.articuloDetalle.articulo)) {
        //        logger.warning('Por favor, seleccione el articulo simple', 'Agregar Articulo Simple');
        //        return;
        //    }
        //    if (form.campo($scope.articuloPvPDetalle.articuloPvP)) {
        //        logger.warning('Por favor, seleccione el articulo simple', 'Agregar Articulo Simple');
        //        return;
        //    }
        //    if (form.campo($scope.composicionArticuloDetalle.cantidad)) {
        //        logger.warning('Por favor, ingrese la Cantidad', 'Agregar Articulo Simple');
        //        return;
        //    }
        //    if (form.campo($scope.composicionArticuloDetalle.precioVenta)) {
        //        logger.warning('Por favor, ingrese la Precio Venta', 'Agregar Articulo Simple');
        //        return;
        //    }


        //    let obj = {
        //        articuloDetalle: $scope.articuloDetalle.articulo,
        //        articuloPvPDetalle: $scope.articuloPvPDetalle.articuloPvP,
        //        composicionArticuloDetalle: $scope.composicionArticuloDetalle,
        //        total: $scope.total
        //    }

        //    //Add Articulo Compluesto Detalle
        //    $scope.gridOptions.data.push(obj);

        //    $scope.getTotal(); //Calculamos Total de Item

        //    $scope.composicionArticuloDetalle = {};
        //    $scope.pvpArtSimples = [];
        //    $scope.articuloDetalle = {};
        //    $scope.total = '';
        //    $scope.pvpCampos = true;

        //    if ($scope.gridApi) {
        //        $timeout(() => {
        //            $scope.gridApi.core.handleWindowResize();
        //            $scope.gridApi.grid.refresh();
        //        }, 5);
        //    };
        //}

        $scope.gridOptions = {
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            columnDefs: [
                {
                    name: "descripción",
                    field: "articuloSimple",
                    allowCellFocus: false,
                    editableCellTemplate: "articuloTemplate.html",
                    cellTemplate: "articuloTemplate.html",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    enableColumnMenu: false,
                    headerCellClass: 'grid-header-center',
                    width: '25%'
                },               
                { name: 'tarifa', field: 'articuloPvPDetalle.descripcion', enableCellEdit: true, width: '20%' },
                { name: 'cantidad', field: 'composicionArticuloDetalle.cantidad', enableCellEdit: true, type: 'number', width: '20%' },
                { name: 'precio venta', field: 'composicionArticuloDetalle.precioVenta', enableCellEdit: true,type:'number', width: '20%' },
                { name: 'total', field: 'total', enableCellEdit: false, width: '15%' },
                {
                    name: 'Op.',
                    cellTemplate: '<a   ng-click="grid.appScope.deleteRow(row)" class="btn btn-danger btn-sm text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>',
                    width: '10%'
                }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
            //,
            //data: 'subjectsAdded'
        };

        ///

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;

            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //let result = rowEntity.composicionArticuloDetalle;
                //let totalItem = Number(result.cantidad) * Number(result.precioVenta)

                //var index = $scope.gridOptions.data.indexOf(rowEntity);
               
                //$scope.gridOptions.data.forEach((valor, indice) => {
                //    if (indice == index) {
                //        $scope.gridOptions.data[index].total = totalItem;
                //    }
                //});

                //$scope.getTotal();
                
            });
        };

        //Eliminar Item Art. Compuesto Detalle
        $scope.deleteRow = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.gridOptions.data.splice(index, 1);
            $scope.getTotal();
        };

        if ($scope.gridApi) {
            $timeout(() => {
                $scope.gridApi.core.handleWindowResize();
                $scope.gridApi.grid.refresh();
            }, 5);
        };


        $scope.subTotal = function (price) {
            $scope.total = Number(price.cantidad) * Number(price.precioVenta);
        }


        $scope.getTotal = function () {
            let total = 0;
            angular.forEach($scope.gridOptions.data, function (value, key) {
                total = total + Number(value.total);
            });
            $scope.precioVenta = total + $scope.pvpArtCompuesto.articuloPvP.precioVenta;
        }

      

        $scope.crudArticuloCompuesto = function (tipoOperacion) {
           
            $scope.data.articulo = $scope.articuloCompuesto.articulo;
            $scope.data.articuloPvP = $scope.pvpArtCompuesto.articuloPvP;
            $scope.data.composicionArticulo = $scope.composicionArticulo;
            
            if (tipoOperacion == 1) $scope.url = '/ComposicionArticulo/CreateComposicionArticulo';
         
            
            if (form.campo($scope.articuloCompuesto.articulo)) {
                logger.warning('Por favor, seleccione el Articulo Compuesto', $scope.tituloModal);
                return;
            }

            if ($scope.gridOptions.data.length == 0) {
                logger.warning('Por favor, al menos agregue un Articulo Simple', $scope.tituloModal);
                return;
            }
            if (form.campo($scope.precioVenta)) {
                logger.warning('Por favor, ingrese el PVP del Articulo Compuesto', $scope.tituloModal);
                return;
            }

            mS.getData('post', $scope.url, { data: $scope.data, dataDetalle: $scope.gridOptions.data }).then(response=>{
                if(response.id=="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == 1) {
                    toast.toastr('success', response.message, response.titleSms)
                    $("#agregar").modal('hide');
                }
            })
            
                
        }

        $scope.abrirModal = function (data, tipoOperacion) {
            if (tipoOperacion == 1) {
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.iconoModal = 'fas fa-box-open';
                $scope.colorHeader = 'bg-info';
                $scope.tituloModal = ' Agregar Composición';
                $scope.icono = 'fa fa-save';
                $scope.btnModal = ' Guardar';
                $("#agregar").modal('show');
                return;
            }
            if (tipoOperacion == 2) {
                $scope.data.tipoOperacion = tipoOperacion;
                $scope.iconoModal = 'fas fa-box-open';
                $scope.colorHeader = 'bg-success';
                $scope.tituloModal = ' Actualizar Composición';
                $scope.icono = 'fa fa-edit';
                $scope.btnModal = ' Actualizar';
                $("#agregarComposicion").modal('show');
                return;
            }
        }


        $("#agregar").on('hide.bs.modal',function (e) {
            $scope.data = {};
            $scope.articuloCompuesto = {};
            $scope.articuloDetalle = {};
            $scope.pvpArtCompuesto = {};
            $scope.articuloPvPDetalle = {};
            $scope.composicionArticuloDetalle = {};
        })
    }


})(window.angular)