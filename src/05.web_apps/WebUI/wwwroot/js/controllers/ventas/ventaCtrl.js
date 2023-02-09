(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('ventaCtrl', ventaCtrl);

    ventaCtrl.$inject = ['$scope', '$rootScope', '$http', '$timeout', 'uiGridValidateService', 'uiGridConstants', 'mainService', 'toastService', 'formulario'];

    function ventaCtrl($scope, $rootScope, $http, $timeout, uiGridValidateService, uiGridConstants, mS, toast, form) {
        $scope.data = {};
        $scope.invoice = {}

        $scope.branchs = [];
        //Tipo Doc
        $scope.tipoDocumento = {};
        $scope.tipoDocumentos = [];
        //Sucursal 
        $scope.sucursal = {};
        $scope.sucursales = [];
        //Tiempo Credito
        $scope.creditTime = {};
        $scope.creditTimes = [];
        //Estado pago
        $scope.paymentStatu = {};
        $scope.paymentStatus = [];
        //Punto Emision
        $scope.puntoEmision = {};
        $scope.puntosEmision = [];
        //Bodega 
        $scope.bodega = {};
        $scope.bodegas = [];
        //Tarifas 
        $scope.tarifa = [];
        $scope.tarifas = [];
        //Cliente
        $scope.cliente = {};
        //Iva
        $scope.iva = {};
        $scope.decimal = 2;

        //Paginacion
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 1000;
        $scope.recordsQuantity = [5, 10, 25, 50];

        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };


        $scope.query = {
            order: 'nombreFiscal',
            limit: 5,
            page: 1
        };


        $scope.errorResponse = error => console.log(error);

        //ui-Grid Table Invoice
        $scope.getInvoice = function() {
            var result = mS.getData('get', '/Factura/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize);
            result.then(function(response) {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                console.log(response.data)
                $scope.facturas = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;

            }, $scope.errorResponse);
        }

        $scope.getInvoice(); //Load List Invoice

        $scope.getNotaEntrega = function() {
            var result = mS.getData('get', '/NotaEntrega/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize);
            result.then(function(response) {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }

                $scope.notaEntregas = response.data;
                $scope.totalRecords = response.data.length > 0 ? response.data[0].totalRecords : 0;

            }, $scope.errorResponse);
        }


        $scope.initialLoad = function() {
            mS.getData('Get', '/TipoDocumento/GetByTT?codTransaccion=V').then(function(response) {
                $scope.tipoDocumentos = response.data;
            }, $scope.errorResponse);

            //Listar sucursal asignado al usuario 
            mS.getData('get', '/Login/ListSucursalAccesso').then(response => {
                $scope.sucursales = response.data;
                $scope.sucursal = $scope.sucursales[0];
                $scope.filterSucursal = $scope.sucursales[0];
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
            }, $scope.errorResponse);


            mS.getData('get', '/TiempoCredito/getByTT?transaction=V').then(function(response) {
                $scope.creditTimes = response.data;
                $scope.creditTime = $scope.creditTimes[0];
                $scope.getFechaVencimiento(new Date(), $scope.creditTime);
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
            }, $scope.errorResponse);

            //Get Tarifas
            mS.getData('get', '/Tarifa/Select').then(response => {
                $scope.tarifas = response.data;
                $scope.tarifa = response.data[0];
                // $scope.gridOptionsDetailInvoice.columnDefs[10].editDropdownOptionsArray = response.data;
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
            }, $scope.errorResponse)

            //Estado pago 
            mS.getData('get', '/DocumentoCompra/GetPaymentStatus').then(function(response) {
                $scope.paymentStatus = response.data;
            }, $scope.errorResponse);

            //Get Tipo IVA aignado a la Entidad 
            mS.getData('get', '/ConfigTributaria/Get').then(function(response) {
                $scope.iva = response.data[0];
            }, $scope.errorResponse);


        };

        $scope.initialLoad();

        //Se ejecuta cuando se cambia el Sucursal.
        $scope.$watch('sucursal', function(s) {
            if (!form.campo(s.idRol)) {
                $scope.getListAsignacionPuntoEmision(s.idRol);
                $scope.getListAsignacionBodega(s.idRol);
            }
        });

        //Listar Punto de Emision asignado a usuario
        $scope.getListAsignacionPuntoEmision = function(idRol) {
            mS.getData('get', '/AsignacionUsuario/ListAsignacionPuntoEmision?idRol=' + idRol).then(response => {
                $scope.puntosEmision = response.data;
                $scope.puntoEmision = response.data[0];
            }, $scope.errorResponse)
        }

        //Listar Bodega asignado a usuario
        $scope.getListAsignacionBodega = function(idRol) {
            mS.getData('get', '/AsignacionUsuario/ListAsignacionBodega?idRol=' + idRol).then(response => {
                $scope.bodegas = response.data;
                $scope.bodega = response.data[0]; //Bodega x defecto
                $scope.gridOptionsDetailInvoice.columnDefs[18].editDropdownOptionsArray = response.data;
                //if ($scope.gridOptionsDoc.data.length > 0) {
                //    angular.forEach($scope.gridOptionsDoc.data, (value, index) => {
                //        $scope.gridOptionsDoc.data[index].idBodega = $scope.bodega;
                //    })
                //}
            }, $scope.errorResponse)
        }

        //Cambiar Bodega en todo el documento 
        $scope.seleccionarBodega = function(idBodega) {
            Swal.fire({
                html: `<small>Esta seguro de cambiar la bodega en todo el Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                reverseButtons: false
            }).then((result) => {
                if (result.value) {
                    if ($scope.gridOptionsDetailInvoice.data.length > 0) {
                        angular.forEach($scope.gridOptionsDetailInvoice.data, (value, index) => {
                            $scope.gridOptionsDetailInvoice.data[index].idBodega = idBodega;
                        })
                    }
                }
            })
        }


        $scope.seleccionarTarifa = function(idTarifa) {
            Swal.fire({
                html: `<small>¿Esta seguro de cambiar los precios de venta en todo el Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false,
                reverseButtons: false
            }).then((result) => {
                if (result.value) {
                    if ($scope.gridOptionsDetailInvoice.data.length > 0) {
                        angular.forEach($scope.gridOptionsDetailInvoice.data, (value, index) => {
                            var { articuloPvP } = value.articuloTarifas.find(val => val.articuloPvP.idTarifa == idTarifa);

                            let { descuento } = $scope.getPrecioConIva(value.porcentajeDescuento, articuloPvP.precioVenta);
                            let { precioConIva } = $scope.getPrecioConIva(value.porcentajeDescuento, articuloPvP.precioConIva);

                            $scope.gridOptionsDetailInvoice.data[index].idTarifa = idTarifa;
                            $scope.gridOptionsDetailInvoice.data[index].precioVenta = articuloPvP.precioVenta;
                            $scope.gridOptionsDetailInvoice.data[index].precioConIva = precioConIva


                            if (value.porcentajeDescuento > 0) {
                                $scope.gridOptionsDetailInvoice.data[index].valorDescuento = descuento
                            }

                            let totalDescuento = value.cantidad * value.valorDescuento;
                            let subTotal = value.cantidad * value.precioConIva;
                            let total = value.cantidad * value.precioVenta;
                            let precioTotal = (value.precioVenta - value.valorDescuento) * value.cantidad;

                            $scope.gridOptionsDetailInvoice.data[index].precioTotal = precioTotal; //Precio Total
                            $scope.gridOptionsDetailInvoice.data[index].totalDescuento = totalDescuento; //Total DEscuento                            
                            $scope.gridOptionsDetailInvoice.data[index].subTotal = subTotal; //Total Precio Con Iva 
                            $scope.gridOptionsDetailInvoice.data[index].total = total; //Total Precio Venta
                        });
                        $scope.getTotales();
                    }
                } else {
                    $scope.tarifa = $scope.tarifas[0];
                }
            })
        }

        $scope.getCompras = function(item) {
            if (item.codigo == "FV") {

            }
            if (item.codigo == "NE") {
                $scope.getNotaEntrega();
            }
            $scope.tipoDocumento = item;
        };


        $scope.addNew = function() {
            $scope.tituloDocumento = 'Factura';
            $scope.tipo = 1;
            $rootScope.miniSidebar = "mini-sidebar";
            $scope.btnDocumento = 'Guardar';
            $("#btnAgregar").hide();
            $("#nombreEmpresa").show();
            $('#mainList').hide();
            $('#newInvoice').show();

        };


        $scope.closeSection = function(item) {
            if (item == 1) {
                if ($scope.gridOptionsDetailInvoice.data.length > 0) {
                    Swal.fire({
                        /*        title: 'Salir',*/
                        html: `<small>Tienes una <b>${$scope.tituloDocumento}</b> en proceso, desea salir ahora?</small>`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: `Sí!`,
                        cancelButtonText: 'No!',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            $scope.resetData();
                            $('#newInvoice').hide();
                            $('#mainList').show();
                        }
                    });
                } else {
                    $scope.resetData();
                    $('#newInvoice').hide();
                    $('#mainList').show();
                }
            };
        };

        //limpiar datos 
        $scope.resetData = function() {
            $scope.cliente = {}
            $scope.puntoEmision = {};
            $scope.creditTime = {}
            $scope.invoice = {};
            $scope.gridOptionsDetailInvoice.data = [];
            $scope.data = {};

            $scope.searchCliente = ''; //Limpiar md-autocomplete Cliente
            $scope.vendedor = '';
            $scope.seachTextArticulo = ''; //Limpiar md-autocomplete Articulo;
            $scope.initialLoad();
            $("#btnAgregar").show();
            $('#newInvoice').hide();
            $('#mainList').show();
        }

        /*Clients Search*/
        $scope.searchClient = function(search) {
            return $http.get('/Cliente/Search?textSearch=' + search).then(function(response) {
                return response.data.data;
            });
        };

        $scope.selectedClienteChange = function(item) {
                if (!form.campo(item)) {
                    $scope.selectedCliente = item;
                    $scope.cliente = item.cliente
                    $scope.searchCliente = item.cliente.nombreFiscal;
                    $scope.vendedor = item.nombreCompleto;
                    $scope.creditTime = {
                        idTiempoCredito: item.cliente.idTiempoCredito
                    }
                    $scope.getFechaVencimiento(new Date(), $scope.creditTime);
                    return
                } else {
                    $scope.cliente = {};
                }
            }
            // abrirModalCliente
        $scope.abrirModalCliente = function(idCliente) {
            if (idCliente == null) {
                $scope.$broadcast('abrirModalcliente', 1); //Crear Cliente
            } else if (idCliente == 4) {
                $scope.$broadcast('abrirModalcliente', 4); //Listar Cliente
            } else {
                $scope.$broadcast('abrirModalcliente', idCliente); //Actualizar Cliente
            }
        }

        $scope.$on('dataCliente', function(event, res) {
            $scope.selectedClienteChange(res);
        })

        //Sumar dias a Fecha de Emision para obtener Fecha de Vencimiento;
        $scope.getFechaVencimiento = function(fecha, t) {
            if (form.campo(t)) {
                t = $scope.creditTime;
            }
            //Obtener dias de Credito 
            var tarifa = $scope.creditTimes.find(r => r.idTiempoCredito == t.idTiempoCredito);

            if (!form.campo(fecha)) {
                $scope.invoice.fechaEmision = fecha;
                $scope.invoice.fechaVencimiento = new Date();
                $scope.invoice.fechaVencimiento.setDate(fecha.getDate() + tarifa.tiempoInteres);
                $scope.fechaEmisionEscrita = form.getFechaEscrita($scope.invoice.fechaEmision);
                $scope.fechaVencimientoEscrita = form.getFechaEscrita($scope.invoice.fechaVencimiento);
            }
        }


        //Articulo 
        //Buscar Articulo por nombre
        $scope.searchArticuloFilter = function(busqueda) {
            return $http.get('/Articulo/SearchArticuloFilter?busqueda=' + busqueda + '&condicion=' + $scope.isSearchCodigo).then(function(response) {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }

                //if (response.data.data.length > 0) {
                //    response.data.data[0].showHeader = true; //Para presentar una sola vez el header   en la Tabla             
                //    response.data.data.map(value => {
                //        value.showDetalle = function () {
                //            aS.historyEntradaArticulo(this.articulo.idArticulo).then(function (response) {
                //                value.historialEntrada = response;
                //            })
                //        }
                //        value.templateUrl = 'viewPoperHistorialPago.html'
                //        return value;
                //    })
                //    return response.data.data;
                //} else {
                //    return [];
                //}
                return response.data.data.filter;
            })
        }

        //Seleccionar Articulo
        $scope.selectedArticuloChange = function(idArticulo) {
            if (!form.campo(idArticulo)) {
                $scope.getDataIdArticulo(idArticulo);
                $scope.seachTextArticulo = '';
            } else {
                $scope.selectedArticulo = '';
            }
        }

        $scope.getDataIdArticulo = function(idArticulo) {
            mS.getData('get', '/Articulo/SearchArticulo?idArticulo=' + idArticulo).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    let data = response.data.articulo;
                    let pvps = response.data.pvps;
                    let codBarras = response.data.codBarras;
                    let ubicaciones = response.data.ubicaciones;

                    let entity;
                    var indexRow = $scope.gridOptionsDetailInvoice.data.findIndex((value) => value.idArticulo === idArticulo);

                    if (indexRow !== -1) {
                        entity = $scope.gridOptionsDetailInvoice.data[indexRow];
                    } else {
                        $scope.addRow(); //Añadir Fila                         
                        var index = $scope.gridOptionsDetailInvoice.data.findIndex((value) => value.idArticulo == 0);
                        entity = $scope.gridOptionsDetailInvoice.data[index];
                    }

                    $timeout(() => {
                        $scope.addItemRow(entity, data); //Datos de Articulo 
                        $scope.cargarTarifaArticulo(entity, pvps); //Tarifa Articulo                             

                        //Focus en Cantidad
                        $scope.gridApi.cellNav.scrollToFocus(
                            $scope.gridOptionsDetailInvoice.data[$scope.getIndexRow(entity)],
                            $scope.gridOptionsDetailInvoice.columnDefs[6]
                        );

                    }, 50)
                }
            }, error => console.log(error))
        }

        //Get Tarifa Articulos
        $scope.cargarTarifaArticulo = function(entity, pvps) {
            var { articuloPvP: value } = pvps.find(val => val.articuloPvP.precioPredeterminado == true);
            entity.articuloTarifas = pvps;
            entity.idTarifa = $scope.tarifa.idTarifa
            entity.precioVenta = value.precioVenta
            entity.precioConIva = value.precioConIva;
        }

        //Buscar Articulo por código de Barra
        $scope.searchArticuloCodigo = function($event, busqueda) {
            if (!form.campo(busqueda) && $event.key == 'Enter') {
                mS.getData('get', '/Articulo/SearchArticuloFilter?busqueda=' + busqueda + '&condicion=' + $scope.isSearchCodigo).then(response => {
                    if (response.id == "0") {
                        toast.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    if (response.id == "2") {
                        $scope.selectedArticuloChange(response.data.codigo.articulo.idArticulo);
                        $scope.searchCodigo = '';
                    }
                })
            }
        }

        //Add new Item
        $scope.addRow = function(row) {
            $scope.gridOptionsDetailInvoice.data.push({
                idFacturaDetalle: 0,
                n: 1,
                codigo: "",
                idArticulo: 0,
                descripcion: "",
                cantidad: 1,
                nombreMedida: "",
                codigoTipoIva: "",
                nombreTipoIva: "",
                articuloTarifas: '',
                idTarifa: 0,
                precioVenta: 0.00,
                precioConIva: 0.00,
                porcentajeDescuento: 0,
                valorDescuento: 0.00,
                totalDescuento: 0.00,
                ice: 0.00,
                idBodega: 0,
                subTotal: 0.00,
                total: 0.00,
                nota: "S/N",
                llevaInventario: "",
                datosAdicionales: ""
            });

            $scope.countIndex();
        };

        //Añadir Item Articulo
        $scope.addItemRow = function(entity, item) {
                entity.codigo = item.articulo.codigo;
                entity.idArticulo = item.articulo.idArticulo;
                entity.descripcion = item.articulo.descripcion;
                entity.nombreMedida = item.nombreMedida
                entity.codigoTipoIva = item.codigoTipoIva;
                entity.nombreTipoIva = item.nombreTipoIva;
                entity.ice = item.articulo.valorIce;
                entity.idBodega = $scope.bodega.idBodega ? $scope.bodega.idBodega : 0;
                entity.llevaInventario = item.articulo.llevaInventario;
                entity.datosAdicionales = item.articulo.datosAdicionales;
            }
            //Abrir Modal Articulo 
        $scope.abrirModalArticulo = function(idArticulo, busqueda = null) {
            if (idArticulo == null) {
                $scope.$broadcast('abrirModalArticulo', 1); //Crear Articulo
            } else if (idArticulo == 6) {
                $scope.$broadcast('abrirModalArticulo', { idArticulo, busqueda }); //Listar Articulo
            } else {
                $scope.$broadcast('abrirModalArticulo', idArticulo); //Actualizar Articulo
            }
        }

        $scope.$on('dataArticulo', function(event, idArticulo) {
            $scope.selectedArticuloChange(idArticulo);
        });


        //Contar Indice del Item Articulo 
        $scope.countIndex = function() {
            let numItem = 1;
            angular.forEach($scope.gridOptionsDetailInvoice.data, (valor, indice) => {
                $scope.gridOptionsDetailInvoice.data[indice].n = numItem++;
            });
        }

        //Eliminar el Articulo del Detalle
        $scope.deleteRow = function(row) {
            let index = $scope.getIndexRow(row.entity);
            if (!form.campo(row.entity.idArticulo)) {
                Swal.fire({
                    html: `<small>Esta Ud. seguro de eliminar este Articulo <b>${row.entity.descripcion}</b></small>?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: `Sí, eliminar!`,
                    cancelButtonText: 'No, cancelar!',
                    allowOutsideClick: false,
                    reverseButtons: false
                }).then((result) => {
                    if (result.value) {
                        $timeout(() => {
                            $scope.gridOptionsDetailInvoice.data.splice(index, 1);
                            $scope.getTotales();
                            $scope.countIndex();
                        }, 5)

                    }
                })
            } else {
                $scope.gridOptionsDetailInvoice.data.splice(index, 1);
                $scope.getTotales();
                $scope.countIndex();
            }

        };

        //uiGridValidateService.setValidator('price',
        //    function (argument) {
        //        return function (newValue, oldValue, rowEntity, colDef) {
        //            if (!newValue) {
        //                return true; // We should not test for existence here
        //            } else {
        //                return oldValue;
        //            }
        //        };
        //    },
        //    function (argument) {
        //        return 'Ingrese solo numeros ';
        //    }
        //);
        //Calcular automaticamente la Altura de Detalle Compra 
        $scope.getTableHeight = function() {
            var heigthUI = $scope.gridOptionsDetailInvoice.data.length > 3 ? $scope.gridOptionsDetailInvoice.data.length * 2 * $scope.gridOptionsDetailInvoice.data.length : 0;
            return { height: (heigthUI + 50) + "px" };
        };

        //Get Index Row
        $scope.getIndexRow = function(row) {
                return $scope.gridOptionsDetailInvoice.data.indexOf(row);
            }
            //Detail Invoice
        $scope.gridOptionsDetailInvoice = {
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: true,
            enableColumnReordering: true,
            showGridFooter: true,
            columnDefs: [{
                    name: 'Op.',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    width: '7%',
                    cellTemplate: `
                                    <a  ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                                    <a  ng-click="grid.appScope.abrirModalArticulo(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
                                    `,
                },
                { name: 'idFacturaDetalle', field: 'idFacturaDetalle', visible: false },
                { name: 'N°', field: 'n', enableCellEdit: false, width: '3%', enableColumnMenu: false, },
                { name: 'cód.', field: 'codigo', enableCellEdit: false, width: '8%', enableColumnMenu: false },
                { name: 'idArticulo', field: 'idArticulo', visible: false },
                {
                    name: "Descripción",
                    field: "descripcion",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    enableColumnMenu: false,
                    cellEditableCondition: function(row) {
                        return row.entity.llevaInventario !== true;
                    },
                    cellTooltip: function(row) {
                        return row.entity.descripcion;
                    },
                    width: '25%'
                },
                {
                    name: 'Cant.',
                    field: 'cantidad',
                    enableColumnMenu: false,
                    enableCellEditOnFocus: true,
                    min: 1,
                    type: 'number',
                    width: '6%'
                },
                {
                    name: 'Medida',
                    field: 'nombreMedida',
                    enableCellEdit: false,
                    width: '8%',
                    enableColumnMenu: false
                },
                { name: 'codigoTipoIva', field: 'codigoTipoIva', enableCellEdit: false, width: '8%', enableColumnMenu: false, visible: false },
                {
                    name: 'I.V.A',
                    field: 'nombreTipoIva',
                    enableCellEdit: false,
                    width: '8%',
                    enableColumnMenu: false,
                    type: 'string'
                },
                { name: 'tarifas', field: 'articuloTarifas', visible: false },
                {
                    name: 'Tarifa',
                    field: 'idTarifa',
                    width: '20%',
                    cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    editDropdownOptionsFunction: function(rowEntity, colDef) {
                        return $timeout(function() {
                            return rowEntity.articuloTarifas.map(function(val) {
                                //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                                //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                                //}
                                return { id: val.articuloPvP.idTarifa, value: val.tarifa + ' - $' + val.articuloPvP.precioVenta }
                            })
                        }, 100);
                    }
                },
                {
                    name: 'P. Venta',
                    field: 'precioVenta',
                    enableCellEditOnFocus: true,
                    enableColumnMenu: false,
                    type: 'number',
                    width: '7%',
                    cellFilter: "currency:'$'",
                },
                {
                    name: 'P. IVA',
                    field: 'precioConIva',
                    min: 0,
                    type: 'number',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    width: '7%',
                    cellFilter: "currency:'$'"
                },
                {
                    name: '%',
                    field: 'porcentajeDescuento',
                    enableCellEditOnFocus: true,
                    min: 0,
                    width: '6%',
                    enableColumnMenu: false,
                    cellFilter: "currency:'%'",
                    /*cellFilter: "limitTo:3",*/
                },
                {
                    name: 'dsto.',
                    field: 'valorDescuento',
                    enableCellEditOnFocus: true,
                    min: 0,
                    type: 'number',
                    width: '6%',
                    enableColumnMenu: false,
                    cellFilter: "currency:'$'"
                },
                {
                    name: 'T. Dsto.',
                    field: 'totalDescuento',
                    enableCellEditOnFocus: true,
                    min: 0,
                    type: 'number',
                    width: '7%',
                    enableColumnMenu: false,
                    cellFilter: "currency:'$'"
                },
                {
                    name: 'Ice',
                    field: 'ice',
                    enableCellEdit: false,
                    type: 'number',
                    width: '6%',
                    enableColumnMenu: false,
                    cellFilter: "currency:'$'"
                },
                {
                    name: 'bodega',
                    field: 'idBodega',
                    enableFiltering: false,
                    enableColumnMenu: false,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'mapBodega:grid.appScope.bodegas',
                    editDropdownValueLabel: 'descripcion',
                    editDropdownIdLabel: 'idBodega',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: 'number',
                    width: '11%'
                },
                {
                    name: 'p. Total',
                    field: 'precioTotal',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    type: 'number',
                    width: '7%',
                    visible: true,
                    cellFilter: "currency:'$'",
                },
                {
                    name: 'SubTotal',
                    field: 'subTotal',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    type: 'number',
                    width: '7%',
                    visible: false,
                    cellFilter: "currency:'$'",
                },
                {
                    name: 'Total',
                    field: 'total',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    type: 'number',
                    width: '5%',
                    visible: false,
                },
                {
                    name: 'Nota',
                    field: 'nota',
                    enableCellEdit: true,
                    enableColumnMenu: false,
                    enableCellEditOnFocus: true,
                    type: 'string',
                    width: '15%',
                    cellEditableCondition: $scope.editColumn
                },
                {
                    name: 'llevaInventario',
                    field: 'llevaInventario',
                    visible: false
                },
                {
                    name: 'datosAdicionales',
                    field: 'datosAdicionales',
                    visible: false
                }
            ],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
            }
        }


        $scope.gridOptionsDetailInvoice.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }
            //gridApi.validate.on.validationFailed($scope, function (rowEntity, colDef, newValue, oldValue) {
            //    uiGridValidateService.clearError(rowEntity, colDef, 'required');
            //    rowEntity[colDef.field] = oldValue;                
            //});


            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                let index = $scope.gridOptionsDetailInvoice.data.indexOf(rowEntity); //Indice Row

                //Validar campos 
                if (rowEntity[colDef.field] == "" || rowEntity[colDef.field] == undefined || rowEntity[colDef.field] == null) {
                    rowEntity[colDef.field] = oldValue;
                }
                switch (colDef.field) {
                    case 'idTarifa':
                        if (rowEntity.idTarifa !== oldValue) {
                            var { articuloPvP } = rowEntity.articuloTarifas.find(val => val.articuloPvP.idTarifa == rowEntity.idTarifa);
                            let { descuento } = $scope.getPrecioConIva(rowEntity.porcentajeDescuento, articuloPvP.precioVenta);
                            let { precioConIva } = $scope.getPrecioConIva(rowEntity.porcentajeDescuento, articuloPvP.precioConIva);

                            $scope.gridOptionsDetailInvoice.data[index].precioVenta = articuloPvP.precioVenta;
                            $scope.gridOptionsDetailInvoice.data[index].precioConIva = precioConIva
                            if (rowEntity.porcentajeDescuento > 0) {
                                $scope.gridOptionsDetailInvoice.data[index].valorDescuento = descuento;
                            }
                        }
                        break;
                    case 'precioVenta':
                        if (rowEntity.precioVenta !== oldValue) {
                            // $scope.gridOptionsDetailInvoice.data[index].precioVenta = form.roundNumber(rowEntity.precioVenta, $scope.decimal);
                            let { precioConIva, descuento } = $scope.getPrecioConIva(rowEntity.porcentajeDescuento, rowEntity.precioVenta);
                            $scope.gridOptionsDetailInvoice.data[index].precioConIva = precioConIva
                            if (rowEntity.porcentajeDescuento > 0) {
                                $scope.gridOptionsDetailInvoice.data[index].valorDescuento = descuento;
                            }
                        }
                        break;
                    case 'porcentajeDescuento':
                        //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
                        if (rowEntity.porcentajeDescuento <= 100 && rowEntity.porcentajeDescuento !== oldValue) {
                            var { articuloPvP } = rowEntity.articuloTarifas.find(val => val.articuloPvP.idTarifa == rowEntity.idTarifa);

                            let { descuento } = $scope.getPrecioConIva(rowEntity.porcentajeDescuento, rowEntity.precioVenta);
                            let { precioConIva } = $scope.getPrecioConIva(rowEntity.porcentajeDescuento, rowEntity.precioConIva);

                            $scope.gridOptionsDetailInvoice.data[index].valorDescuento = descuento;
                            $scope.gridOptionsDetailInvoice.data[index].precioConIva = form.roundNumber(precioConIva, $scope.decimal);

                        } else if (rowEntity.porcentajeDescuento !== oldValue && rowEntity.porcentajeDescuento > 100) {
                            toast.toastr('warning', 'El Porcentaje tiene que ser menor o igual a 100', 'Porcentaje Descuento');
                            $scope.gridOptionsDetailInvoice.data[index].porcentajeDescuento = oldValue;
                        }
                        break
                    case 'valorDescuento':
                        //Si el Descuento es un valor NUEVO
                        if (rowEntity.valorDescuento <= rowEntity.precioVenta && rowEntity.valorDescuento !== oldValue) {
                            //Valor Porcentaje
                            let porcentaje = (form.roundNumber(rowEntity.valorDescuento, $scope.decimal) / form.roundNumber(rowEntity.precioVenta, $scope.decimal)) * 100;
                            //Valor Precio = precio Costo - valor descuento 
                            let precioConIva = Number(rowEntity.precioVenta) - Number(rowEntity.valorDescuento);

                            $scope.gridOptionsDetailInvoice.data[index].porcentajeDescuento = form.roundNumber(porcentaje, $scope.decimal);
                            $scope.gridOptionsDetailInvoice.data[index].precioConIva = form.roundNumber(precioConIva, $scope.decimal);

                        } else if (rowEntity.valorDescuento > rowEntity.precioVenta && rowEntity.valorDescuento !== oldValue) {
                            toast.toastr('warning', 'El valor de Descuento tiene que ser menor o igual a Precio Venta', 'Ingreso Descuento');
                            $scope.gridOptionsDetailInvoice.data[index].valorDescuento = oldValue;
                        }
                        break
                    case 'nota':
                        $scope.focusSearchArticulo();
                        break;
                }

                /*Si el porcentaje es 0 o el valor descuento es 0 actualizamos el  precio Costo por el precio costo anterior*/
                if (rowEntity.porcentajeDescuento == 0 || rowEntity.valorDescuento == 0) {
                    $scope.gridOptionsDetailInvoice.data[index].precioVenta = rowEntity.precioVenta;
                }

                let totalDescuento = rowEntity.cantidad * rowEntity.valorDescuento;
                let subTotal = rowEntity.cantidad * rowEntity.precioConIva;
                let total = rowEntity.cantidad * rowEntity.precioVenta;
                let precioTotal = (rowEntity.precioVenta - rowEntity.valorDescuento) * rowEntity.cantidad;

                $scope.gridOptionsDetailInvoice.data[index].precioTotal = precioTotal; //Precio Total
                $scope.gridOptionsDetailInvoice.data[index].totalDescuento = totalDescuento; //Total DEscuento
                /*$scope.gridOptionsDetailInvoice.data[index].precioTotal = totalDescuento; */

                $scope.gridOptionsDetailInvoice.data[index].subTotal = subTotal; //Total Precio Con Iva 
                $scope.gridOptionsDetailInvoice.data[index].total = total; //Total Precio Venta

                //Totales 
                $scope.getTotales();

            });
        }

        //Focus en Input Search Articulo 
        $scope.focusSearchArticulo = function() {
            if ($scope.isSearchCodigo) {
                $timeout(() => {
                    $("#isSearchCodigo").focus();
                }, 600)
                return
            } else {
                var getIdTemplate = document.getElementById('searchArticulo').getElementsByTagName('input')[0];
                $timeout(function() {
                    $("#" + getIdTemplate['id']).focus();
                }, 600);
                return
            }
        }


        $scope.getPrecioConIva = function(porcentaje, precioVenta) {
            let valorPorcentaje = Number(porcentaje) / 100;
            let descuento = Number(valorPorcentaje) * Number(precioVenta);
            let precioConIva = Number(precioVenta) - Number(descuento);

            return { descuento, precioConIva }
        }

        //get Totales 
        $scope.getTotales = function(isDescuento = true) {
            /*TOTAL IVAs */

            $scope.invoice.subTotalSinImpuestos = $scope.getSubTotalSinImpuesto(); //Total Sin Impuesto 
            $scope.invoice.subTotalIva = $scope.getTotalIva("IVA12").totalIva; //IVA 12
            $scope.invoice.subTotalNetoIva = $scope.getTotalIva("IVA12").totalNetoIva;

            $scope.invoice.subTotalIvaCero = $scope.getTotalIva("IVA0").totalIva;
            $scope.invoice.subTotalNetoIvaCero = $scope.getTotalIva("IVA0").totalNetoIva;

            $scope.invoice.subTotalNoObjetoIva = $scope.getTotalIva("NOIVA").totalIva;
            $scope.invoice.subTotalNetoNoObjetoIva = $scope.getTotalIva("NOIVA").totalNetoIva;

            $scope.invoice.subTotalExentoIva = $scope.getTotalIva("EXENIVA").totalIva;
            $scope.invoice.subTotalNetoExentoIva = $scope.getTotalIva("EXENIVA").totalNetoIva;


            $scope.invoice.totalDescuento = $scope.getTotalDescuento();
            var porcentajeDescuento = (($scope.getSubTotalSinImpuesto() - $scope.getPrecioTotal()) * 100) / $scope.getSubTotalSinImpuesto();
            $scope.invoice.porcentajeDescuento = porcentajeDescuento > 0 ? form.roundNumber(porcentajeDescuento) : 0;

            $scope.invoice.irbpnr = 0;
            $scope.invoice.propina = 0;
            $scope.invoice.totalIce = $scope.getTotalIce();

            //IVA 12
            let iva = $scope.invoice.subTotalNetoIva * $scope.iva.valorTipoIva / 100;
            $scope.invoice.iva = iva;
            //Suma Total de Articulo + IVA 12
            var total = $scope.invoice.iva + $scope.getPrecioTotal() + $scope.getTotalIce();
            $scope.invoice.total = form.roundNumber(total)

        }

        //Suma Total Sim Impuesto         
        $scope.getSubTotalSinImpuesto = function() {
            let total = 0;
            angular.forEach($scope.gridOptionsDetailInvoice.data, value => {
                total = total + Number(value.total)
            });
            return form.roundNumber(total);
        }


        //Get Total Iva y Total Sub Neto 
        $scope.getTotalIva = function(codigoIva) {
            let totalIva = 0,
                totalNetoIva = 0;
            angular.forEach($scope.gridOptionsDetailInvoice.data, value => {
                if (value.codigoTipoIva === codigoIva) {
                    totalIva += Number(value.total);
                    totalNetoIva += Number(value.precioTotal);
                } else {
                    totalIva = 0;
                    totalNetoIva = 0;
                }
            });
            return { totalIva, totalNetoIva };
        };

        //Suma Total de Precio
        $scope.getPrecioTotal = function() {
            let total = 0;
            angular.forEach($scope.gridOptionsDetailInvoice.data, value => {
                total = total + Number(value.precioTotal)
            });
            return form.roundNumber(total);
        }

        //Suma Total de Precio Con IVA   
        $scope.getSubTotal = function() {
            let total = 0;
            angular.forEach($scope.gridOptionsDetailInvoice.data, value => {
                total = total + Number(value.subTotal)
            });
            return form.roundNumber(total);
        }

        //Sum Total Descuento
        $scope.getTotalDescuento = function() {
            let total = 0;
            angular.forEach($scope.gridOptionsDetailInvoice.data, value => {
                total += value.totalDescuento;
            });
            return form.roundNumber(total);
        }

        //Total Porcentaje Descuento 
        $scope.getTotalPorcentajeDescuento = function() {
            let descuentoTotal = 0,
                porcentajeDescuento = 0;
            angular.forEach($scope.gridOptionsDoc.data, value => {
                descuentoTotal += value.descuento;
            });

            if (descuentoTotal > 0) {
                porcentajeDescuento = (descuentoTotal / $scope.getSubTotalSinImpuesto()) * 100;
            }

            return form.roundNumber(porcentajeDescuento);
        }

        //Total Valor ICE
        $scope.getTotalIce = function() {
            let total = 0;
            angular.forEach($scope.gridOptionsDetailInvoice.data, function(value, key) {
                total += value.ice;
            });
            return form.roundNumber(total);
        }

        $scope.getTotalNeto = function() {
            let total = $scope.invoice.subTotalNetoIva + $scope.invoice.subTotalNetoIvaCero + $scope.invoice.subTotalNetoNoObjetoIva + $scope.invoice.subTotalNetoExentoIva;
            return total;
        }

        //Calcular Descuento 
        $scope.calcularPorcentajeDescuento = function() {
            if (!form.campo($scope.invoice.porcentajeDescuento) && $scope.invoice.porcentajeDescuento <= 100) {
                $scope.setPorcentajeDescuento();
            } else {
                toast.toastr('warning', 'El Porcentaje de Descuento tiene que ser menor o igual a 100');
            }
        }

        //Aplicar Porcentaje Descuento a todo el detalle del documento
        $scope.setPorcentajeDescuento = function() {

            $scope.gridOptionsDetailInvoice.data.forEach((value, index) => {
                var { articuloPvP } = value.articuloTarifas.find(val => val.articuloPvP.idTarifa == value.idTarifa);

                let { descuento } = $scope.getPrecioConIva($scope.invoice.porcentajeDescuento, value.precioVenta);
                let { precioConIva } = $scope.getPrecioConIva($scope.invoice.porcentajeDescuento, articuloPvP.precioConIva);

                $scope.gridOptionsDetailInvoice.data[index].valorDescuento = descuento;
                $scope.gridOptionsDetailInvoice.data[index].precioConIva = precioConIva;
                $scope.gridOptionsDetailInvoice.data[index].porcentajeDescuento = $scope.invoice.porcentajeDescuento;

                let totalDescuento = value.cantidad * value.valorDescuento;
                let subTotal = value.cantidad * value.precioConIva;
                let total = value.cantidad * value.precioVenta;
                let precioTotal = (value.precioVenta - value.valorDescuento) * value.cantidad;

                $scope.gridOptionsDetailInvoice.data[index].precioTotal = precioTotal; //Precio Total
                $scope.gridOptionsDetailInvoice.data[index].totalDescuento = totalDescuento; //Total Descuento                            
                $scope.gridOptionsDetailInvoice.data[index].subTotal = subTotal; //Total Precio Con Iva 
                $scope.gridOptionsDetailInvoice.data[index].total = total; //Total Precio Venta

            })

            $scope.getTotales();

        }

        //Calcular Porcentaje  Descuento 
        $scope.calcularDescuento = function() {
            if (!form.campo($scope.invoice.totalDescuento) && $scope.invoice.totalDescuento <= $scope.getSubTotalSinImpuesto()) {
                var totalNeto = $scope.invoice.subTotalNetoIva + $scope.invoice.subTotalNetoIvaCero + $scope.invoice.subTotalNetoNoObjetoIva + $scope.invoice.subTotalNetoExentoIva;
                let porcentaje = (Number($scope.invoice.totalDescuento) * 100) / $scope.getSubTotalSinImpuesto();

                $scope.invoice.porcentajeDescuento = form.roundNumber(porcentaje);
                let total = totalNeto - $scope.invoice.totalDescuento;
                $scope.invoice.total = $scope.invoice.iva + total;
                //Aplicamos descuento a todo el Documento 
                $scope.descuentoAllDoc($scope.invoice.totalDescuento)

            } else if ([null, undefined, ""].includes($scope.invoice.totalDescuento)) {
                $scope.invoice.porcentajeDescuento = $scope.getTotalPorcentajeDescuento();
                $scope.descuentoAllDoc($scope.invoice.totalDescuento)
            } else {
                $("#totalDescuento").attr("maxlength", $scope.invoice.totalDescuento.length)
                toast.toastr('warning', 'El Valor Descuento no puede ser mayor al total');
                $scope.invoice.porcentajeDescuento = $scope.getTotalPorcentajeDescuento();
                $scope.invoice.totalDescuento = $scope.invoice.totalDescuento;
            }

        }




        //Aplicar Descuento a todo el detalle del documento
        $scope.descuentoAllDoc = function(valorDescuento) {
            $scope.gridOptionsDetailInvoice.data.forEach((value, index) => {
                let getPorcentaje = Number($scope.invoice.porcentajeDescuento) / 100;
                let descuento = Number(getPorcentaje) * Number(value.precioVenta);
                let precioConIva = Number(value.precioVenta) - Number(descuento);


                $scope.gridOptionsDetailInvoice.data[index].descuento = form.roundNumber(descuento, $scope.decimal);
                $scope.gridOptionsDetailInvoice.data[index].precioConIva = form.roundNumber(precioConIva, $scope.decimal);
                $scope.gridOptionsDetailInvoice.data[index].porcentajeDescuento = form.roundNumber($scope.invoice.porcentajeDescuento)
                let subTotal = value.cantidad * form.roundNumber(value.precioConIva, $scope.decimal);
                $scope.gridOptionsDetailInvoice.data[index].subTotal = subTotal;
            })
            $scope.getTotales(false);
        }

        //Guardar Factura 
        $scope.saveInvoice = function(tipo) {
            var tituloModal = tipo == 1 ? 'Guardar Factura' : 'Actualizar Factura';
            if (form.campo($scope.cliente.idCliente)) {
                toast.toastr('warning', 'Seleccione el Cliente', tituloModal);
                return
            }
            if (form.campo($scope.puntoEmision.idPuntoEmision)) {
                toast.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
                return
            }
            if (form.campo($scope.invoice.nroFactura)) {
                toast.toastr('warning', 'Ingrese Nro. de Factura', tituloModal);
                return
            }
            if (form.campo($scope.creditTime.idTiempoCredito)) {
                toast.toastr('warning', 'Seleccione el Forma de Pago', tituloModal);
                return
            }

            if (form.campo($scope.invoice.fechaEmision)) {
                toast.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
                return
            }
            if (form.campo($scope.invoice.fechaVencimiento)) {
                toast.toastr('warning', 'Ingrese la Fecha de Vencimiento', tituloModal);
                return
            }
            if (form.campo($scope.bodega.idBodega)) {
                toast.toastr('warning', 'Seleccione la Bodega', tituloModal);
                return
            }
            if (form.campo($scope.tarifa.idTarifa)) {
                toast.toastr('warning', 'Seleccione la Tarifa', tituloModal);
                return
            }
            //if (form.campo($scope.cliente.idEmpleado)) {
            //    toast.toastr('warning', 'Seleccione el Empleado', tituloModal);
            //    return
            //}
            if ($scope.gridOptionsDetailInvoice.data.length === 0) {
                toast.toastr('warning', 'Ingrese al menos un Articulo en el Detalle', tituloModal);
                return
            }

            $scope.invoice.idCliente = $scope.cliente.idCliente;
            $scope.invoice.idPuntoEmision = $scope.puntoEmision.idPuntoEmision;
            $scope.invoice.idTiempoCredito = $scope.creditTime.idTiempoCredito;

            $scope.data.factura = $scope.invoice;
            $scope.data.detalle = $scope.gridOptionsDetailInvoice.data;

            //Generar Nro. Documento y luego guardar la Factura
            mS.getData('get', '/Venta/GenerarNroDoc?idPuntoEmision=' + $scope.puntoEmision.idPuntoEmision + '&nroDocumento=' + $scope.invoice.nroFactura).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }

                Swal.fire({
                    /*title: 'Factura',*/
                    html: `<small>Esta Ud. seguro de ${$scope.btnDocumento} este <b>${$scope.tituloDocumento}</b> N° ${response.data}</small>?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: `Sí, ${$scope.btnDocumento}!`,
                    cancelButtonText: 'No, cancelar!',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        $scope.url = tipo == 1 ? '/Factura/Post' : '/Factura/Put?idFactura=' + $scope.invoice.idFactura;

                        mS.getData('post', $scope.url, $scope.data).then(response => {
                            if (response.id == "0") {
                                toast.toastr("warning", response.message, response.titleSms);
                                return
                            }
                            if (response.id == "1") {
                                toast.toastr("success", response.message, response.titleSms);
                                $scope.getInvoice();
                                $scope.resetData();
                                return
                            }
                        }, $scope.errorResponse);
                    }
                });
            }, $scope.errorResponse)
        }

        // edit
        $scope.editInvoice = function(data) {
            mS.getData('get', '/Factura/GetId?idFactura=' + data.factura.idFactura).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    const { detalle, factura: data } = response.data;
                    $scope.tipo = 2; //Tipo Operacion Update                                     
                    $scope.cliente = {
                        nombreFiscal: data.nombreFiscal,
                        idCliente: data.factura.idCliente,
                        numeroIdentificacion: data.nroIdentificacion,
                        direccion: data.direccion
                    }
                    $scope.puntoEmision = data.factura;
                    $scope.creditTime = data.factura;

                    $scope.invoice = data.factura;
                    $scope.invoice.fechaEmision = new Date($scope.invoice.fechaEmision);
                    $scope.invoice.fechaVencimiento = new Date($scope.invoice.fechaVencimiento);

                    $scope.setGridDetailInvoice(detalle); //Set Detail

                    $rootScope.miniSidebar = "mini-sidebar";
                    $scope.tituloDocumento = 'Factura';
                    $scope.btnDocumento = 'Actualizar';
                    $("#nombreEmpresa").css('display', 'none');
                    $('#mainList').hide();
                    $('#newInvoice').show();
                }
            }, $scope.errorResponse)
        }

        $scope.setGridDetailInvoice = function(detalle) {
            let setData = (value) => {
                    const { detalle } = value;
                    let precioTotal = (detalle.precioVenta - detalle.valorDescuento) * detalle.cantidad;


                    mS.getData('get', '/PvPArticulo/GetId?idArticulo=' + detalle.idArticulo).then(response => {
                        detalle.articuloTarifas = response.data;
                    }, error => console.log(error))
                    detalle.precioTotal = precioTotal;
                    detalle.subTotal = detalle.cantidad * detalle.precioConIva;
                    detalle.totalDescuento = detalle.cantidad * detalle.valorDescuento;
                    detalle.codigo = value.codigo;
                    detalle.nombreMedida = value.nombreMedida;
                    detalle.nombreTipoIva = value.nombreTipoIva;
                    detalle.codigoTipoIva = value.codigoTipoIva;
                    return detalle;
                }
                //Set Detalle
            $scope.gridOptionsDetailInvoice.data = detalle.map(setData);
            $scope.countIndex();
        }

        //Delete 
        $scope.deleteInvoice = function(data) {
            Swal.fire({
                /*title: 'Factura',*/
                html: `<small>Esta Ud. seguro de eliminar esta <b>${$scope.tituloDocumento}</b> N° ${data.nroFactura}</small>?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, eliminar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    mS.getData('post', '/Factura/Delete?idFactura=' + data.factura.idFactura).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getInvoice();
                            return
                        }
                    }, error => console.log(error))
                }
            });
        }

    }
})(window.angular); 