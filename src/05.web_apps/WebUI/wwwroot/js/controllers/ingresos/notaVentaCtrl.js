(function() {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('notaVentaCtrl', notaVentaCtrl);

    notaVentaCtrl.$inject = ['$scope', '$rootScope', '$http', '$timeout', 'mainService', 'compraService', 'formulario', 'toastService'];

    function notaVentaCtrl($scope, $rootScope, $http, $timeout, mS, cS, form, toast) {
        var ui_grid = cS.uiGrid(); //Template ui-grid
        cS.init(); //load querys 
        $scope.data = {};
        $scope.formData = {}; //Datos de Formularios
        $scope.notaVenta = {};
        $scope.sucursal = {};
        $scope.categoriaCompra = {};
        $scope.proveedor = {};
        $scope.tiempoCredito = {};
        $scope.gridOptionsCompra = {};
        $scope.bodega = {}

        $scope.ingresoBodegas = [];
        $scope.decimal = 2;

        //Paginacion
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50];

        //Get Factura Compra
        $scope.getNotaVenta = function() {
            mS.getData('get', '/NotaVenta/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.notaVentas = response.data;
            }, error => console.log(error));
        }

        $scope.getNotaVenta();

        $scope.nuevo = function() {
            $scope.load();
            $scope.tipo = 1;
            $scope.titulo = 'Registrar'
            $scope.formData = cS.dataForm('NV', 1);
            $rootScope.miniSidebar = "mini-sidebar";
            $("#nombreEmpresa").hide();
            $("#btnAgregar").hide();
            $("#listNotaVenta").hide();
            $("#formNotaVenta").show();
        }

        $scope.load = function() {
                $scope.sucursales = cS.usuarioSucursales;
                $scope.sucursal = $scope.sucursales[0];
                $scope.categoriaCompras = cS.categoriaCompras;
                $scope.tiempoCreditos = cS.tiempoCreditos;
                $scope.tiempoCredito = $scope.tiempoCreditos[0];
                $scope.getFechaVencimiento(new Date());
            }
            //Sumar dias a Fecha de Emision para obtener Fecha de Vencimiento;
        $scope.getFechaVencimiento = function(fecha) {
            if (!form.campo(fecha)) {
                $scope.data.fechaEmision = fecha;
                $scope.data.fechaVencimiento = cS.getFechaVencimiento(fecha, cS.getDiaCredito($scope.tiempoCredito.idTiempoCredito));
                $scope.fechaEmisionEscrita = form.getFechaEscrita($scope.data.fechaEmision);
                $scope.fechaVencimientoEscrita = form.getFechaEscrita($scope.data.fechaVencimiento);
            }
        }
        $scope.$watch('sucursal', function(s) {
            if (!form.campo(s.idRol)) {
                $scope.getBodega(s.idRol);
            }
        });

        //Listar Bodega asignado a usuario
        $scope.getBodega = function(idRol) {
            mS.getData('get', '/AsignacionUsuario/ListAsignacionBodega?idRol=' + idRol).then(response => {
                $scope.bodegas = response.data;
                $scope.bodega = response.data[0];
                ui_grid.idBodega = $scope.bodega.idBodega;
                $scope.gridOptionsCompra.columnDefs[16].editDropdownOptionsArray = response.data;
            }, error => console.log(error))
        }

        //Buscar Proveedor
        $scope.searchProveedor = function(busqueda) {
            return $http.get('/Proveedor/SearchProveedor?busqueda=' + busqueda).then(function(response) {
                return response.data.data;
            });
        };

        //Seleccionar Proveedor 
        $scope.selectProveedor = function(data) {
            if (!form.campo(data)) {
                $scope.selectedProveedor = data;
                $scope.proveedor = data.proveedor;
                $scope.searchProveedorText = data.proveedor.nombreFiscal
                    //Validar RUC
                    /* $scope.validarNumIdentificacion(data.proveedor.numeroIdentificacion);*/
                $scope.tiempoCredito = {
                    idTiempoCredito: data.proveedor.idTiempoCredito
                }
                $scope.getFechaVencimiento(new Date());
            } else {
                $scope.id = ''
                $scope.typeNotify = ''
                $scope.message = '';
                $scope.proveedor = {};
            }
        }

        //AbrirModalCliente
        $scope.abrirModalProveedor = function(idProveedor) {
            if (idProveedor == null) {
                $scope.$broadcast('abrirModalProveedor', 1); //Crear Proveedor
            } else if (idProveedor == 4) {
                $scope.$broadcast('abrirModalProveedor', 4); //Listar Proveedor
            } else {
                $scope.$broadcast('abrirModalProveedor', idProveedor); //Actualizar Provedor
            }
        }

        $scope.$on('dataProveedor', function(event, res) {
            $scope.selectProveedor(res);
        });

        //Buscar Articulo para agregar en el detalle
        $scope.searchArticuloFilter = function(busqueda) {
            return $http.get('/Articulo/SearchArticuloFilter?busqueda=' + busqueda + '&condicion=' + $scope.isSearchCodigo).then(function(response) {
                if (response.data.data.filter.length > 0) {

                    //response.data.data[0].showHeader = true; //Para presentar una sola vez el header   en la Tabla             
                    //response.data.data.map(value => {
                    //    value.showDetalle = function () {
                    //        aS.historyEntradaArticulo(this.articulo.idArticulo).then(function (response) {
                    //            value.historialEntrada = response;
                    //        })
                    //    }
                    //    value.templateUrl = 'viewPoperHistorialPago.html'
                    //    return value;
                    //})
                    return response.data.data.filter;
                }
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
        };

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

        $scope.getDataIdArticulo = function(idArticulo) {
            mS.getData('get', '/Articulo/SearchArticulo?idArticulo=' + idArticulo).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    let data = response.data.articulo;
                    ui_grid.setDataArticulo(data, idArticulo);
                    $scope.gridOptionsCompra.data = ui_grid.gridOptions;

                    $timeout(() => {
                        $scope.gridApi.cellNav.scrollToFocus(
                            $scope.gridOptionsCompra.data[ui_grid.getFindIndexIdArticuloExists(idArticulo)],
                            $scope.gridOptionsCompra.columnDefs[5]
                        );
                    }, 50);
                }
            }, error => console.log(error))
        }

        //Cambiar Bodega en todo el documento 
        $scope.seleccionarBodega = function(idBodega) {
            ui_grid.setBodega(idBodega);
        }
        $scope.$watch(function() {
            return ui_grid.bodegaAll;
        }, function(newValue) {
            if (newValue) {
                $scope.bodega = {
                    idBodega: ui_grid.idBodega
                }
                ui_grid.bodegaAll = false;
            }
        })


        //Aplicar Decimal a todo el Documento 
        $scope.seleccionarDecimal = function(decimal) {
            ui_grid.setDecimal(decimal);
        }
        $scope.$watch(function() {
            return ui_grid.noDecimalAll;
        }, function(newValue, oldValue) {
            if (newValue) {
                $scope.decimal = ui_grid.decimal;
                ui_grid.noDecimalAll = false;
            }
        })

        //Height
        $scope.getHeight = function() {
            var h = $scope.gridOptionsCompra.data.length > 1 ? $scope.gridOptionsCompra.data.length * 6 * $scope.gridOptionsCompra.data.length : 0;
            return { height: (h + 90) + "px" };
        };

        //Eliminar Fila
        $scope.deleteRow = function(row) {
            ui_grid.deleteRow(row);
        }
        $scope.$watch(function() {
            return ui_grid.isDeleteRow
        }, function(newValue) {
            if (newValue) {
                $scope.getTotales();
                ui_grid.isDeleteRow = false;
            }
        })

        //ui_grid detalle compra
        $scope.gridOptionsCompra = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: true,
            enableColumnReordering: true,
            showGridFooter: true,
            columnDefs: ui_grid.columnDefs,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
            }
        }

        $scope.gridOptionsCompra.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 5);
            }

            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                let index = ui_grid.getIndexRow(rowEntity); //Indice Row

                //Validar campos
                if (rowEntity[colDef.field] == "" || rowEntity[colDef.field] == undefined || rowEntity[colDef.field] == null || rowEntity[colDef.field] === oldValue) {
                    rowEntity[colDef.field] = oldValue;
                }

                let descuento = ui_grid.getDescuento(rowEntity.porcentajeDescuento, rowEntity.precioCosto);

                switch (colDef.field) {
                    case 'precioCosto':
                        ui_grid.setPrecioCosto(rowEntity, descuento, index);
                        break;
                    case 'porcentajeDescuento':
                        ui_grid.setPorcentajeDescuentoRow(rowEntity, descuento, index, oldValue);

                        break
                    case 'valorDescuento':
                        ui_grid.setDescuentoRow(rowEntity, index, oldValue);
                        break
                    case 'nota':
                        $scope.data.addNewRow = true;
                        $scope.focusSearchArticulo();
                        break;
                }

                ui_grid.setTotalRow(rowEntity, index);
                $scope.getTotales();
            })

        }

        //Focus en Input Search Articulo 
        $scope.focusSearchArticulo = function() {
            if ($scope.isSearchCodigo) {
                $timeout(() => {
                    $("#isSearchCodigo").focus();
                }, 600)
            } else {
                var getIdTemplate = document.getElementById('searchArticulo').getElementsByTagName('input')[0];
                $timeout(function() {
                    $("#" + getIdTemplate['id']).focus();
                }, 600);
            }
        }

        //Desplazamos barra horizontal al Inicio de la Fila
        $scope.$watch('data.addNewRow', function(newRow) {
            if (!form.campo(newRow) || newRow) {
                $scope.gridApi.core.scrollTo($scope.gridOptionsCompra.data[0], $scope.gridOptionsCompra.columnDefs[0]);
                $scope.data.addNewRow = false;
            }
        })

        $scope.getTotales = function() {
            /*TOTAL IVAs */
            $scope.data.subTotalSinImpuestos = ui_grid.getSubTotalSinImpuesto(); //Total Sin Impuesto            

            $scope.data.subTotalIva = ui_grid.getTotalIva("IVA12").total; //Total IVA 12
            $scope.data.subTotalNetoIva = ui_grid.getTotalIva("IVA12").totalNetoIva //Sub Total Neto IVA 12

            $scope.data.subTotalIvaCero = ui_grid.getTotalIva("IVA0").total; //Total IVA 0
            $scope.data.subTotalNetoIvaCero = ui_grid.getTotalIva("IVA0").totalNetoIva; //SUB TOTAL NETO IVA 0

            $scope.data.subTotalExentoIva = ui_grid.getTotalIva("EXENIVA").total; //Total Exento IVA
            $scope.data.subTotalNetoExentoIva = ui_grid.getTotalIva("EXENIVA").totalNetoIva //SUB TOTAL EXENTO IVA

            $scope.data.subTotalNoObjetoIva = ui_grid.getTotalIva("NOIVA").total; //Total NO objeto IVA
            $scope.data.subTotalNetoNoObjetoIva = ui_grid.getTotalIva("NOIVA").totalNetoIva //SUB TOTAL NO OBJETO IVA


            $scope.data.totalDescuento = ui_grid.getTotalDescuento(); //Valor Total Descuento

            $scope.data.porcentajeDescuento = form.roundNumber(ui_grid.getPorcentajeDescuento()) //Total Porcentaje Descuento
            $scope.data.totalIce = ui_grid.getTotalIce(); //TOTAL ICE
            $scope.data.irbpnr = 0
            $scope.data.propina = 0;

            var iva = ($scope.data.subTotalNetoIva * cS.getIva().valorTipoIva) / 100;
            $scope.data.iva = form.roundNumber(iva); //IVA 12            
            var total = $scope.data.iva + ui_grid.getSubTotal() + ui_grid.getTotalIce() //Suma Total de Articulo + IVA 12
            $scope.data.total = form.roundNumber(total);

            //Set Total Neto Iva
            ui_grid.setTotalNetoIva($scope.data);

        }

        //Calcular Porcentaje Descuento 
        $scope.calcularPorcentajeDescuento = function() {
            if (!form.campo($scope.data.porcentajeDescuento) && $scope.data.porcentajeDescuento <= 100) {
                $scope.data.total = $scope.data.iva + ui_grid.getValorDescuento($scope.data.porcentajeDescuento);
                ui_grid.setPorcentajeDescuentoAll($scope.data.porcentajeDescuento);
                $scope.getTotales();
            } else {
                toast.toastr('warning', 'El Porcentaje de Descuento tiene que ser menor o igual a 100');
                return
            }
        }

        //Calcular Descuento 
        $scope.calcularDescuento = function() {
                if (!form.campo($scope.data.totalDescuento) && $scope.data.totalDescuento <= ui_grid.getSubTotalSinImpuesto()) {
                    let porcentaje = (Number($scope.data.totalDescuento) * 100) / ui_grid.getSubTotalSinImpuesto();
                    let descuento = ui_grid.getTotalNeto() - $scope.data.totalDescuento;
                    $scope.data.porcentajeDescuento = form.roundNumber(porcentaje);
                    $scope.data.total = $scope.data.iva + descuento;
                    ui_grid.setPorcentajeDescuentoAll($scope.data.porcentajeDescuento);
                    $scope.getTotales();
                } else {
                    toast.toastr('warning', 'El Valor de Descuento no puede ser mayor al total');
                    return
                }
            }
            //Guardar Ingreso Bodega
        $scope.guardar = function(tipo) {
            if (form.campo($scope.categoriaCompra.idCategoriaCompra)) {
                toast.toastr('warning', "Seleccion la Categoria de Compra", $scope.formData.tituloModal);
                return;
            }
            if (form.campo($scope.tiempoCredito.idTiempoCredito)) {
                toast.toastr('warning', "Seleccion el Tiempo Crédito", $scope.formData.tituloModal);
                return;
            }
            if (form.campo($scope.proveedor.idProveedor)) {
                toast.toastr('warning', "Seleccione el Proveedor", $scope.formData.tituloModal);
                return;
            }
            if (form.campo($scope.data.puntoEmision)) {
                toast.toastr('warning', "Ingrese el Punto de Emisión", $scope.formData.tituloModal);
                return;
            }
            if (form.campo($scope.data.nroDocumento)) {
                toast.toastr('warning', "Ingrese N°. de Documento", $scope.formData.tituloModal);
                return;
            }
            if (form.campo($scope.data.nroAutorizacion)) {
                toast.toastr('warning', "Ingrese N°. de Autorización", $scope.formData.tituloModal);
                return;
            }
            if (form.campo($scope.data.fechaEmision)) {
                toast.toastr('warning', "Fecha de Emisión requerida", $scope.formData.tituloModal);
                return;
            }
            if ($scope.gridOptionsCompra.data.length == 0) {
                toast.toastr('warning', 'Agregue al menos un Articulo en el Detalle ', $scope.formData.tituloModal);
                return;
            }

            $scope.data.idCategoriaCompra = $scope.categoriaCompra.idCategoriaCompra;
            $scope.data.idTiempoCredito = $scope.tiempoCredito.idTiempoCredito;
            $scope.data.idProveedor = $scope.proveedor.idProveedor
            $scope.data.idSucursal = $scope.sucursal.idRol // idRol            
                !form.campo($scope.data.transporte) ? $scope.data.transporte : 0;
            !form.campo($scope.data.recargo) ? $scope.data.recargo : 0;
            !form.campo($scope.data.observacion) ? $scope.data.observacion : "";
            !form.campo($scope.data.porcentajeDescuento) ? $scope.data.porcentajeDescuento : 0;
            !form.campo($scope.data.totalDescuento) ? $scope.data.totalDescuento : 0;

            $scope.notaVenta.notaVenta = $scope.data;
            $scope.notaVenta.detalle = $scope.gridOptionsCompra.data; //Detalle

            //Generar Numero de Documento de Compra
            mS.getData('get', '/Compra/GenerarNroCompra?puntoEmision=' + $scope.data.puntoEmision + '&idPuntoEmision=0' + '&nroDocumento=' + $scope.data.nroDocumento).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                }
                Swal.fire({
                    /*title: 'Factura',*/
                    html: `<small>Esta Ud. seguro de ${$scope.formData.btnModal} este <b>${$scope.formData.tituloModal}</b> N° ${response.data}</small>?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: `Sí, ${$scope.formData.btnModal}!`,
                    cancelButtonText: 'No, cancelar!',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        if (tipo == 1) $scope.url = '/NotaVenta/Post';
                        if (tipo == 2) $scope.url = '/NotaVenta/Put?idNotaVenta=' + $scope.data.idNotaVenta;
                        mS.getData('post', $scope.url, $scope.notaVenta).then(function(response) {
                            if (response.id == "0") {
                                toast.toastr('warning', response.message, response.titleSms);
                                return
                            }
                            if (response.id == "1") {
                                toast.toastr('success', response.message, response.titleSms);
                                $scope.getNotaVenta();
                                $scope.load();
                                $scope.resetData();
                                $("#btnAgregar").show();
                                $("#listNotaVenta").show();
                                $("#formNotaVenta").hide();
                                return
                            }
                        }, error => console.log(error))
                    }
                });
            });
        }

        $scope.editar = function(idNotaVenta) {
            $scope.tipo = 2;
            $scope.load();
            $scope.titulo = 'Actualizar'
            $scope.formData = cS.dataForm('NV', 2);
            $rootScope.miniSidebar = "mini-sidebar";
            $scope.getDataIdNotaVenta(idNotaVenta);
            $("#nombreEmpresa").hide();
            $("#btnAgregar").hide();
            $("#listNotaVenta").hide();
            $("#formNotaVenta").show();
        }

        $scope.getDataIdNotaVenta = function(idNotaVenta) {
            mS.getData('get', '/NotaVenta/GetId?idNotaVenta=' + idNotaVenta).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    let { notaVenta: data, detalle: detalleNotaVenta } = response.data;
                    $scope.categoriaCompra = data.notaVenta;
                    $scope.tiempoCredito = data.notaVenta;
                    $scope.proveedor = {
                        idProveedor: data.notaVenta.idProveedor,
                        nombreFiscal: data.nombreFiscal,
                        numeroIdentificacion: data.nroIdentificacion,
                        direccion: data.direccion,
                        correo: data.correo
                    }
                    $scope.data = data.notaVenta;
                    $scope.data.fechaEmision = new Date($scope.data.fechaEmision);
                    $scope.data.fechaVencimiento = new Date($scope.data.fechaVencimiento);
                    ui_grid.setDetalle(detalleNotaVenta);
                    $scope.gridOptionsCompra.data = ui_grid.gridOptions;
                }
            }, error => console.log(error))
        }

        //Delete 
        $scope.eliminar = function(data) {
            Swal.fire({
                /*title: 'Factura',*/
                html: `<small>Esta Ud. seguro de eliminar este Nota de Venta <b> N° ${data.nroDocumento}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: `Sí, eliminar!`,
                cancelButtonText: 'No, cancelar!',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    var url = '/NotaVenta/Delete?idNotaVenta=' + data.notaVenta.idNotaVenta;
                    mS.getData('post', url).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getNotaVenta();
                            return
                        }
                    }, error => console.log(error))
                }
            });
        }

        $scope.cerrar = function() {
            if ($scope.gridOptionsCompra.data.length > 0) {
                Swal.fire({
                    /*        title: 'Salir',*/
                    html: `<small>Tienes una <b>${$scope.formData.tituloModal}</b> en proceso, desea salir ahora?</small>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: `Sí!`,
                    cancelButtonText: 'No!',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        $scope.resetData();
                    }
                });
            } else {
                $scope.resetData();
            }

        };

        $scope.resetData = function() {
            $scope.load();
            $scope.data = {};
            $scope.sucursal = {};
            $scope.categoriaCompra = {};
            $scope.proveedor = {}
            $scope.tiempoCredito = {};
            $scope.decimal = 2;
            ui_grid.decimal = 2;
            ui_grid.gridOptions = [];
            $scope.gridOptionsCompra.data = [];
            $scope.searchTextProveedor = '';
            $scope.searchTextArticulo = ''
            $scope.formData = {}
            $("#nombreEmpresa").show();
            $("#btnAgregar").show();
            $("#listNotaVenta").show();
            $("#formNotaVenta").hide();
        }
    }
})(window.angular);