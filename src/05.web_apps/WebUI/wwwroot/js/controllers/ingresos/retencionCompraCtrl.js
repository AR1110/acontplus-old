

(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('retencionCompraCtrl', retencionCompraCtrl);

    retencionCompraCtrl.$inject = [
        '$rootScope',
        '$scope', 
        '$http', 
        '$timeout', 
        'uiGridConstants',
        'mainService', 
        'docManagementService', 
        'proveedorService',        
        'formulario', 
        'toastService'
    ];

    function retencionCompraCtrl($rootScope, $scope, $http, $timeout, uiGridConstants, mS, docMS, proveedorSvc, form, toast) {
        const ID_TIPO_DOC=1;
        $scope.data = {};
        $scope.retencionCompra = {};
        $scope.sucursal = {};
        $scope.proveedor = {}
        $scope.retenciones = [];


        $scope.retencionCompra.fechaEmision = new Date();

        //Informacion Factura
        $scope.dataFactura = {};
        $scope.restoreDataFactura = {}
       
        //Tipo Documento
        $scope.tipoDocumento = {};
        $scope.tipoDocumentos = [];

        //Sustento Tributario 
        $scope.sustentoTributario = {}
        $scope.sustentoTributarios = [];

        //Tiempo Credito 
        $scope.tiempoCredito = {};
        $scope.tiempoCreditos = [];

        //Categoria Compra 
        $scope.categoriaCompra = {};
        $scope.categoriaCompras = [];

        $scope.searchProveedorFilter = proveedorSvc.searchProveedorFilter; //Busqueda Proveedor
       
        $scope.searchSupplier={
            showOption:true,
            isOptionNew:false,
            isOptionUpdate:false,
            isOptionSearch:false,
            isOptionDetalle: true
        }

        //Paginacion 
        $scope.maxSize = 5;
        $scope.totalRecords = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 10;
        $scope.recordsQuantity = [5, 10, 25, 50]

        $scope.options = {
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            // order: 'proveedor',
            limit: 9000,
            page: 1
        };
    
        $scope.getRetCompra = function () {
            mS.getData('get', '/RetencionCompra/Get?pageIndex=' + $scope.pageIndex + '&pageSize=' + $scope.pageSize).then(response => {
                if (response.id == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return;
                }                
                $scope.retenciones = response.data;
            }, error => console.log(error));
        }
        $scope.getRetCompra();



        $scope.load = function () {
            //Get Acceso  Sucursal 
            mS.getData('get', '/Sucursal/GetSucursalByRol').then(response => {
                if(response.id=="0"){
                    toast.toastr('warning',response.message);
                    return
                }                
                $scope.sucursales = response;
                $scope.sucursal = $scope.sucursales[0];
            }, error=>console.error(error));

            // mS.getData('get', '/TipoDocumento/GetByTT?codTransaccion=C').then(response => {
            //     $scope.tipoDocumentos = response.data;
            //     $scope.tipoDocumento = $scope.tipoDocumentos.find(val => val.codigo == 'FC');
            // }, error=>console.log(error));

            
            mS.getData('get', '/SustentoTributario/ReadSustentoTributario').then(response => {
                $scope.sustentoTributarios = response.data;
            }, error=>console.log(error))

            
            mS.getData('get', '/TiempoCredito/OptionTiempoCredito?gestion=C',).then(response => {
                $scope.tiempoCreditos = response.data;
                $scope.tiempoCredito = $scope.tiempoCreditos[0];
            }, error=>console.log(error));

            
            mS.getData('get', '/CategoriaCompra/selectCategoriaCompra').then(response => {
                $scope.categoriaCompras = response.data;
            }, error=>console.log(error));

            //Get Type Impost 
            mS.getData('get', '/TipoImpuesto/OptionTipoImpuesto').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }                
                $scope.tipoImpuestos = response.data;
            }, error => console.log(error));

            //Remove Data Factura of LocalStorage 
            localStorage.removeItem("dataFactura");
        }
        $scope.load();

        $scope.$watch('sucursal', s=> {
            if (!form.campo(s.idSucursal)) {                
                mS.getData('get', '/PuntoEmision/GetByIdSucursal?idSucursal=' + s.idSucursal).then(response => {
                    $scope.puntosEmisiones = response.data;
                    $scope.puntoEmision = response.data[0];
                }, error=>console.log(error));
            }
        });

        $scope.openModalRetention=function(){          
            $scope.tipoRegistro=1;
            $timeout(() => {
                $scope.gridApi.core.handleWindowResize();
                $scope.gridApi.grid.refresh();
            }, 5);
            $("#modalRetentionPurchase").modal('show');
            return
        };

        $scope.onKeyupSearchProveedor = function(text) {
            if (text === undefined || text === null){
                $scope.proveedor = {};
                $scope.selectedInvoice={};
                $scope.supplierInvoiceSelect=[];
                $scope.gridOptions.data=[];

            } 
        };

         //Abrir Modal Proveedor
        $scope.abrirModalProveedor = function(opcion) {           
            if (opcion ==="nuevoProveedor") {
                $scope.$broadcast("abrirModalProveedor", {idProveedor: null, opcion});
                return
            }
            if (opcion === "editarProveedor") {                
                $scope.$broadcast("abrirModalProveedor", {idProveedor: $scope.proveedor.idProveedor, opcion});
                return                
            }
            if(opcion==="listaProveedor"){
                $scope.$broadcast("abrirModalProveedor", {idProveedor:null, opcion});
                return
            }
            if(opcion==="detalleProveedor"){
                $scope.$broadcast("abrirModalProveedor", {idProveedor:$scope.proveedor.idProveedor, opcion});
                return
            }
        }

        $scope.$on('sharedDataProveedor', function(event, res) {
            $scope.data.noResults=false;
            $scope.selectedProveedorChange(res);
        });        

        //Seleccionar Proveedor 
        $scope.selectedProveedorChange = function(data) {
            if (!form.campo(data)) {
                $scope.selectedProveedor = data;
                $scope.proveedor = data.proveedor;                            
                // $scope.searchProveedorText = data.proveedor.nombreFiscal
                $scope.tiempoCredito = {
                    idTiempoCredito: data.proveedor.idTiempoCredito
                }
               
                //Get Invoice
                $scope.getInvoiceBySupplier(data.proveedor.idProveedor);
                $scope.getFechaVencimiento(new Date(), $scope.getDiaCredito(data.proveedor.idTiempoCredito));
                $scope.disabledModalInformation={};
                localStorage.removeItem('dataFactura');
                
                if(localStorage.getItem('dataFactura')!==null){
                    //var dataFactura=JSON.parse(localStorage.removeItem('dataFactura'));
                    // dataFactura.idTiempoCredito=data.proveedor.idTiempoCredito;
                    // localStorage.setItem("dataFactura", JSON.stringify(dataFactura));
                }
                
            } else {
                $scope.proveedor = {};
            }
        };

        $scope.supplierInvoiceSelect=[];
        $scope.getInvoiceBySupplier=function(id){
            mS.getData('get','/FacturaCompra/GetByProveedor?idProveedor='+id).then(response=>{
                if(response.id==="0"){
                    toast.toastr('warning', response.message);
                    return
                }
                if(response.id==="1"){                    
                    $scope.supplierInvoiceSelect = response.data;
                }
            })
        };

        $scope.selectedInvoice={};
        $scope.validateSelectedSupplierInvoice=function(){
            if(form.campo($scope.proveedor.idProveedor)){
                toast.toastr('warning','Seleccione el Proveedor');
                return
            }            
            $scope.generateRetention();
            localStorage.removeItem('dataFactura');
            $scope.gridOptions.data=[];
        };

        $scope.generateRetention=function(){
            mS.getData('get','/RetencionCompra/GenerateRetencion?idTipoDoc='+ID_TIPO_DOC+'&idComprobante='+$scope.selectedInvoice.idFacturaCompra).then(response=>{
                
                if(response.id==="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if(response.id==="1"){
                    $scope.gridOptions.data=response.data;                                      
                    $scope.countIndex();                    
                }
                if(response.id=="2"){ 
                    var data={
                        idProveedor:$scope.proveedor.idProveedor,
                        idSubContribuyente: response.gestion,
                        idFactura: $scope.selectedInvoice.idFacturaCompra
                    }
                    
                    $scope.$broadcast("modalAddImpuestoArticulo", data);                                     
                }
            });       
        };

        $scope.$on("generateRetencion", ()=>{
            $scope.generateRetention();
        })

       

       
       
        //Detalle Factura

        $scope.openDocument = function () {    
            
            // $scope.data.nroDocumento = data.nroDocumento; 
            // $scope.data.usuario=data.usuario;             
            $scope.data.nroDocumento=  $scope.supplierInvoiceSelect.find(val=>val.factura.idFacturaCompra===$scope.selectedInvoice.idFacturaCompra).nroDocumento;
            docMS.document["FC"]($scope.selectedInvoice.idFacturaCompra);
        }
        
        
        // $scope.$watch('proveedor', (prov) => {
        //     if (!form.campo(prov.numeroIdentificacion)) {
        //         //Validar RUC
        //         form.validarIdentificacion(prov).then(function (response) {
        //             $scope.id = response.id;
        //             $scope.typeNotify = response.typeNotify;
        //             $scope.message = response.message;
        //         });
        //     }
        // })

       

        $scope.getDiaCredito=function(idTiempoCredito){
            let tiempoCredito= $scope.tiempoCreditos.find(val=>val.idTiempoCredito===idTiempoCredito);
            return tiempoCredito.diasCredito;

        }

        //Modal Para Agregar Informacion de Factura 
        $scope.openModalInfoTipoDoc = function () {                           
            if(localStorage.getItem('dataFactura')===null){
                $scope.dataFactura={};
                $scope.sustentoTributario={};
                $scope.categoriaCompra={};
                $scope.getFechaVencimiento(new Date(), $scope.getDiaCredito($scope.tiempoCredito.idTiempoCredito));                
                $scope.dataFactura.subTotalSinImpuestos = 0;
                $scope.dataFactura.subTotalIva = 0;
                $scope.dataFactura.subTotalNetoIva = 0;
    
                $scope.dataFactura.subTotalIvaCero = 0;
                $scope.dataFactura.subTotalNetoIvaCero = 0;
    
                $scope.dataFactura.subTotalExentoIva = 0;
                $scope.dataFactura.subTotalNetoExentoIva = 0;
    
                $scope.dataFactura.subTotalNoObjetoIva = 0;
                $scope.dataFactura.subTotalNetoNoObjetoIva = 0;
    
                $scope.dataFactura.totalDescuento = 0;
                $scope.dataFactura.porcentajeDescuento = 0;
                $scope.dataFactura.totalIce = 0;
                $scope.dataFactura.irbpnr = 0
                $scope.dataFactura.propina = 0;
                $scope.dataFactura.transporte=0;
                $scope.dataFactura.recargo=0;
                $scope.dataFactura.iva = 0
                $scope.dataFactura.total = 0;
            }else{
                var dataFactura=JSON.parse(localStorage.getItem("dataFactura")); //Recuperamos Informacion de la Factura
                
                $scope.sustentoTributario = dataFactura;
                $scope.categoriaCompra=dataFactura;   
                $scope.tiempoCredito=dataFactura;    
                         
                $scope.dataFactura=dataFactura;
               
                var fechaEmision = form.formatDate(dataFactura.fechaEmision); //Fecha Emision 
                var fechaVencimiento = form.formatDate(dataFactura.fechaVencimiento); //Fecha Vencimiento 
                $scope.dataFactura.fechaEmision=fechaEmision;
                $scope.dataFactura.fechaVencimiento=fechaVencimiento;
            }        
            $("#ModalInfoTipoDoc").modal('show');                                   
            return
        }
        
        //Sumar dias a Fecha de Emision para obtener Fecha de Vencimiento;
        $scope.getFechaVencimiento = function(fecha) {
            if (!form.campo(fecha)) {
                $scope.dataFactura.fechaEmision = fecha;
                $scope.dataFactura.fechaVencimiento = form.getFechaVencimiento(fecha, $scope.getDiaCredito($scope.tiempoCredito.idTiempoCredito));
                $scope.fechaEmisionEscrita = form.getFechaEscrita($scope.dataFactura.fechaEmision);
                $scope.fechaVencimientoEscrita = form.getFechaEscrita($scope.dataFactura.fechaVencimiento);
            }
        };


        //Guadar Informacion Factura
        $scope.saveDataFactura = function () {
            var titulo = $scope.tipoRegistro==1? 'Guardar Información Factura': 'Actualizar Información Factura';
           
            if (form.campo($scope.sustentoTributario.idSustentoTributario)) {
                toast.toastr('warning', 'Seleccione el Sustento Tributario', titulo);
                return
            }
            if (form.campo($scope.categoriaCompra.idCategoriaCompra)) {
                toast.toastr('warning', 'Seleccione la Categoria Compra', titulo);
                return
            }
            if (form.campo($scope.dataFactura.puntoEmision)) {
                toast.toastr('warning', 'Ingrese el Punto de Emisión', titulo);
                return
            }
            if (form.campo($scope.dataFactura.nroDocumento)) {
                toast.toastr('warning', 'Ingrese el N° Documento', titulo);
                return
            }
            if (form.campo($scope.dataFactura.nroAutorizacion)) {
                toast.toastr('warning', 'Ingrese el N° de Autorización', titulo);
                return
            }
            if (form.campo($scope.dataFactura.fechaEmision)) {
                toast.toastr('warning', 'Ingrese la Fecha de Emisión', titulo);
                return
            }
            if(form.campo($scope.dataFactura.subTotalSinImpuestos)){
                toast.toastr('warning','Ingrese el Sub Total Sin Impuesto');
                return
            }
            
           
            Swal.fire({
                icon:'warning',
                html:`<small>¿Esta seguro/a de guardar la Información de la Factura ahora?</small>`,
                showConfirmButton:true,
                confirmButtonText:'Si, guardar',
                showCancelButton:true,
                cancelButtonText:'No, cancelar',
                allowOutsideClick:false,                
            }).then(result=>{
                if(result.isConfirmed){                    
                    $scope.dataFactura.idTipoDocumento = ID_TIPO_DOC; //Tomar En Cuenta El Tipo Documento 
                    $scope.dataFactura.idSustentoTributario = $scope.sustentoTributario.idSustentoTributario;
                    $scope.dataFactura.idCategoriaCompra = $scope.categoriaCompra.idCategoriaCompra;
                    $scope.dataFactura.idSucursal = $scope.sucursal.idSucursal;
                    $scope.dataFactura.idTiempoCredito = $scope.tiempoCredito.idTiempoCredito;
                    $scope.dataFactura.idProveedor = $scope.proveedor.idProveedor;

                    const data = {
                        factura: $scope.dataFactura,
                        detalle:[]
                    }
                    // '/FacturaCompra/PostQuick'
                    const url = '/Compra/PostFacturaCompra?tipo=1';
                    mS.getData('post', url, data).then(response=>{
                        if(response.id==="0"){
                            Swal.fire({
                                title:`<small>${response.titleSms}</small>`,
                                icon:'warning',
                                html:`<small>${response.message}</small>`
                            });                           
                            return
                        }
                        if(response.id==="1"){
                            toast.toastr('success', response.message, response.titleSms);
                            localStorage.setItem("dataFactura", JSON.stringify($scope.dataFactura));                                                        
                            $scope.getInvoiceBySupplier($scope.proveedor.idProveedor);
                            console.log(response.lastId)
                            $scope.selectedInvoice={
                                idFacturaCompra: response.lastId
                            } 
                            $scope.generateRetention();                            
                            $scope.disabledModalInformation={
                                "opacity": "10",
                                "pointer-events": "none"
                            }
                            $("#ModalInfoTipoDoc").modal('hide');
                        };
                    })
                }
            });                                    
        }

        
         //Buscar Impuesto
         $scope.searchImpuesto = function (busqueda, tipoImpuesto) {
            return $http.get('/RetencionCompra/GetIdByManual?busqueda=' + busqueda).then(response=>{  
                if(!form.campo(tipoImpuesto))                           {
                    return response.data.data.filter(val=>val.tipoImpuesto===tipoImpuesto);
                }else{
                    return response.data.data;
                }                
            });

        }

        //Seleccionar Impuesto 
        $scope.seleccionarImpuesto = function (entity, item) {
            if (!form.campo(item)) {  
                console.log(item)
                entity.impuesto= item.impuesto,
                entity.tipoImpuesto=item.tipoImpuesto,
                entity.codigoImpuesto= item.codigoImpuesto,
                entity.retencionCompraDetalle.idRetencion=item.retencionCompraDetalle.idRetencion,
                entity.retencionCompraDetalle.idImpuesto=item.retencionCompraDetalle.idImpuesto,
                // entity.retencionCompraDetalle.baseImponible= item.retencionCompraDetalle.baseImponible,
                entity.retencionCompraDetalle.porcentajeRetencion=  item.retencionCompraDetalle.porcentajeRetencion,
                entity.retencionCompraDetalle.valorRetenido= item.retencionCompraDetalle.valorRetenido
               
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[0],
                    $scope.gridOptions.columnDefs[1]
                );
                $scope.gridApi.cellNav.scrollToFocus(
                    $scope.gridOptions.data[$scope.gridOptions.data.indexOf(entity)],
                    $scope.gridOptions.columnDefs[4]
                );                                  
            }            
        };

        $scope.addItem=function(){
            var data = {
                num: 1,
                impuesto: '',
                // tipoImpuesto: '',
                // codigoImpuesto: '',
                // retencionCompraDetalle:{
                //     idRetencion: 0,
                //     idImpuesto:0,
                //     baseImponible: 0,
                //     porcentajeRetencion:  0,
                //     valorRetenido: 0
                // }                                            
            }
            $scope.gridOptions.data.push({num:1, impuesto:''});
            $scope.countIndex();
        }

        //Añadir Fila en Tabla Ingreso de Retencion Compra Fisica
        // $scope.addRow = function (item) {
        //     var data = {
        //         num: 1,
        //         impuesto: item.impuesto,
        //         tipoImpuesto: item.tipoImpuesto,
        //         codigoImpuesto: item.codigoImpuesto,
        //         retencionCompraDetalle:{
        //             idRetencion: item.retencionCompraDetalle.idRetencion,
        //             idImpuesto:item.retencionCompraDetalle.idImpuesto,
        //             baseImponible: item.retencionCompraDetalle.baseImponible,
        //             porcentajeRetencion:  item.retencionCompraDetalle.porcentajeRetencion,
        //             valorRetenido: item.retencionCompraDetalle.estadoImpuesto
        //         }                                            
        //     }
        //     $scope.gridOptions.data.push(data);
        //     $timeout(()=>{
        //         $scope.gridApi.cellNav.scrollToFocus(
        //             $scope.gridOptions.data[$scope.gridOptions.data.length-1],
        //             $scope.gridOptions.columnDefs[4]
        //         ); 
        //     },10)                                                                       
        //     $scope.countIndex();
        //     $scope.data.selectedImpuesto=''      ;
        // };
        
    
        //Contar Indice del Item Articulo 
        $scope.countIndex = function () {
            var num=1;
            $scope.gridOptions.data.forEach((v, i) => {              
                $scope.gridOptions.data[i].num = num++;
            });
            $scope.gridOptionsRetVista.data.forEach((v, i) => {              
                $scope.gridOptionsRetVista.data[i].num = num++;
            });
        }

       

        // { name: 'idRetencion', field: 'idRetencion', visible: false },
        // { name: 'idImpuesto', field: 'idImpuesto', visible: false },
        
        //Tabla Retencion  
        $scope.gridOptions = {
            enableColumnMenus:false,
            showColumnFooter: true,
            enableCellEdit: false,
            // showColumnFooter: true,
            // enableSorting: true,
            columnDefs: [
                { 
                    name: 'N°', field: 'num', visible: true,
                    enableCellEdit: false, 
                    allowCellFocus:false,
                    width: '2%', minWidth: '50', 
                }, 
                {
                    name: 'Impuesto',
                    field: 'tipoImpuesto',                    
                    type: 'string',
                    width: '10%',
                    minWidth: '100',
                    allowCellFocus:false,
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',
                },
                {
                    name: 'Cod. Imp.',
                    field: 'codigoImpuesto',
                    type: 'string',
                    width: '10%',
                    minWidth: '100',
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',                    
                    allowCellFocus:false,
                },                              
                {
                    name: "descripción",
                    field: "impuesto",
                    allowCellFocus: false,                    
                    cellTemplate:'impuesto.html'                                                   ,
                    editableCellTemplate:'impuesto.html',
                    width: '40%',
                    minWidth:'100'
                },
                {
                    name: 'B. Imponible',
                    field: 'retencionCompraDetalle.baseImponible',
                    enableColumnMenu: false,
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    min: 0,
                    minWidth: 110,
                    footerCellFilter: 'number:2',
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.impuesto !==''
                    },
                    cellFilter: "currency:'$'",
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                {
                    name: 'porcentaje',
                    field: 'retencionCompraDetalle.porcentajeRetencion',
                    enableColumnMenu: false,
                    cellFilter: "currency:'%'",
                    enableCellEdit: false,
                    allowCellFocus:false,
                    minWidth: 110,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                {
                    name: 'V. Retenido',
                    field: 'retencionCompraDetalle.valorRetenido',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'number:2',
                    cellFilter: "currency:'$'",
                    enableCellEdit: false,
                    allowCellFocus:false,
                    enableCellEditOnFocus: true,
                    enableColumnMenu: false,
                    minWidth: 110,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                {
                    name: 'estado Impuesto',
                    field: 'estadoImpuesto',
                    visible: false,
                    enableColumnMenu: false,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                //{
                //    name: 'Total', field: 'retencionCompraDetalle.total', enableColumnMenu: false,
                //    cellFilter: "currency:'$'",
                //    enableCellEdit: false,
                //    type: 'number', width: '8%'
                //},
                {
                    name: 'Op',
                   // headerCellTemplate: ' <button type="button" ng-click="grid.appScope.addItem()" class="btn btn-secondary  btn-sm"><i class="fa fa-plus-circle"></i></button>',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    width: '2%',
                    minWidth:'50',
                    cellTemplate: '<a class="btn btn-danger btn-xs text-white disabled" ng-show="false"  style="cursor:pointer;" title="Eliminar Retencion agregada" ng-click="grid.appScope.deleteRowRetManual(row)"><i class="ti-trash"></i></a>',
                }
            ],
            onRegisterApi: function (grid) {
                $scope.gridApi = grid;
            }
        }

        $scope.gridOptions.onRegisterApi = function (grid) {

            $scope.gridApi = grid;
            if ($scope.gridApi) {
                $timeout(() => {
                    $scope.gridApi.core.handleWindowResize();
                    $scope.gridApi.grid.refresh();
                }, 10);
            }

            grid.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                var index = $scope.gridOptions.data.indexOf(rowEntity);              
                if (colDef.field === "retencionCompraDetalle.baseImponible") {

                    if ([null, "", undefined, oldValue].includes(rowEntity.retencionCompraDetalle.baseImponible)) {
                        rowEntity.retencionCompraDetalle.baseImponible = oldValue;
                    }
                    $scope.calcularValorRetenido(rowEntity, index);                    
                }
                return               
            });
        }

         

        //Eliminar Item Impuesto
        $scope.deleteRowRetManual = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.gridOptions.data.splice(index, 1);
            $scope.countIndex();
        }

        //Calcular Valor de Retención
        $scope.calcularValorRetenido = function (row, index) {
            let baseImponible = row.retencionCompraDetalle.baseImponible || 0;
            let porcentajeRetencion = Number(row.retencionCompraDetalle.porcentajeRetencion);
            let porcentaje = 0,
                result = 0;

            porcentaje = Number(porcentajeRetencion) / 100;
            result = porcentaje * baseImponible;
            $scope.gridOptions.data[index].retencionCompraDetalle.valorRetenido = form.roundNumber(result);
        }


        function uiGridInfoAdicional(){
            return [
                {
                    name: 'Op.',
                    headerCellTemplate: ' <button type="button" ng-click="grid.appScope.addRowInfoAdicional()" class="btn btn-secondary  btn-sm"><i class="fa fa-plus-circle"></i></button>',
                    enableCellEdit: false,
                    width: '5%',
                    minWidth:'30',
                    cellTemplate: `
                            <a  ng-click="grid.appScope.deleteRowInfoAdicional(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>                           
                            `,
                },                        
                {
                    name: 'N°',
                    field: 'n',
                    enableCellEdit: false,
                    allowCellFocus: false,
                    width: '5%',
                    minWidth:'50'
                },
                {
                    name: 'Nombre',
                    field: 'nombre',
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
                    type:'string',
                    width: '50%',
                    minWidth:'100'
                },  
                {
                    name: 'Valor',
                    field: 'valor',
                    enableCellEdit: true,
                    allowCellFocus: true,
                    enableCellEditOnFocus: true,
                    type:'string',
                    width: '25%',
                    minWidth:'100'
                },                
            ]
        }



        
         //-------------------------------------------------Informacion Adicional del Documento  -----------------------------------
         $scope.gridOptionsInfoAdicionalRC = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            columnDefs: uiGridInfoAdicional(),
            showGridFooter: false,
            onRegisterApi: function (gridApi) {
                $scope.gridApiDos = gridApi;
            }
        }

        //Open Modal Adicional 
        $scope.openModalInfoAdicional = function(){                        
            $("#modalInfoAdicional").modal('show');
            return
        };

        //Enumeracion de filas 
        $scope.enumGridOptionsInfoAdicional =function(){
            let n=1;
            angular.forEach($scope.gridOptionsInfoAdicionalRC.data, (v, i)=>{
                $scope.gridOptionsInfoAdicionalRC.data[i].n = n++;               
            });
            return
        }

        //Funcion que añade una nueva fila 

        $scope.addRowInfoAdicional = function(){              
            $scope.gridOptionsInfoAdicionalRC.data.push({
                n:0,
                nombre:'',
                valor:''
            });
            $scope.enumGridOptionsInfoAdicional();
        }
    
        //Elimina una fila de la tabla gridOptions Info Adicional 
        $scope.deleteRowInfoAdicional = function(row){
            let index = $scope.gridOptionsInfoAdicionalRC.data.indexOf(row.entity);
            $scope.gridOptionsInfoAdicionalRC.data.splice(index, 1);
            $scope.enumGridOptionsInfoAdicional();
            return
        };

        //Cierra modal de infor adicional 
        $scope.cerrarModalInfoAdicional =function(){            
            let validacion = (val)=>form.campo(val.nombre) || form.campo(val.valor);  

            if($scope.gridOptionsInfoAdicionalRC.data.some(validacion)){
                toast.toastr('warning', 'Llene todos campos', 'Cerrar');
                return
            }           
            $("#modalInfoAdicional").modal('hide');
        }




        //Guardar Retencion 
        $scope.saveUpdate = function (tipo) {
            $scope.tituloModal = tipo===1?'Guardar':'Actualizar';                    

            if (form.campo($scope.proveedor.idProveedor)) {
                toast.toastr('warning', 'Seleccione el Proveedor', $scope.tituloModal);
                return;
            }

            if (form.campo($scope.puntoEmision.idPuntoEmision)) {
                toast.toastr('warning', 'Seleccione el Punto de Emisión', $scope.tituloModal);
                return;
            }
            // if (form.campo($scope.retencionCompra.nroRetencion)) {
            //     toast.toastr('warning', 'Ingrese el Número de Retención', $scope.tituloModal);
            //     return;
            // }

            if (form.campo($scope.retencionCompra.fechaEmision)) {
                toast.toastr('warning', 'Ingrese la Fecha de Emisión', $scope.tituloModal);
                return;
            }
                               
            if ($scope.gridOptions.data.length == 0) {
                toast.toastr('warning', 'Ingrese al menos un Tipo Impuesto en el Detalle');
                return;
            }
            if ($scope.gridOptions.data.some(val => [null, undefined, ""].includes(val.impuesto))) {
                toast.toastr('warning', 'Complete los campos en el Detalle', $scope.tituloModal);
                return;
            };

            let urlGenerarNroDoc = 'GenerarNroDocCompra?idPuntoEmision=' + $scope.puntoEmision.idPuntoEmision+'&codigoDocumento=RC';
            mS.getData('get','/GenerarNroDoc/' + urlGenerarNroDoc).then(response=>{
                if(response.id==="0"){
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }

                Swal.fire({
                    icon:'warning',
                    html:`<small>Desea guardar esta Retención Nro. <b>${response.data}</b> ahora?</small>`,
                    showConfirmButton:true,
                    confirmButtonText:`Si, ${tipo==1?'Guardar':'Actualizar'}`,
                    showCancelButton:true,
                    cancelButtonText:'No, cancelar',
                    allowOutsideClick:false
                }).then(result=>{
                    if(result.value){
                        $scope.postRetencion(tipo);
                    }
                });

            });                                   
        };


        $scope.postRetencion=function(tipo){
            $scope.retencionCompra.idFacturaCompra=$scope.selectedInvoice.idFacturaCompra;
            $scope.retencionCompra.idProveedor=$scope.proveedor.idProveedor;
            $scope.retencionCompra.idPuntoEmision=$scope.puntoEmision.idPuntoEmision;
            $scope.retencionCompra.total=$scope.gridOptions.data.map(val=>val.retencionCompraDetalle.valorRetenido).reduce((curr, prev)=>curr+prev, 0);           
            //$scope.retencionCompra.concepto = $scope.retencionCompra.concepto||'';
                        
            $scope.data.retencionCompra = $scope.retencionCompra;
            $scope.data.dataDetalle = $scope.gridOptions.data.map(({retencionCompraDetalle})=>retencionCompraDetalle);
            $scope.data.adicional = $scope.gridOptionsInfoAdicionalRC.data;
            //$scope.data.dataFactura = $scope.restoreDataFactura;

            var url=tipo===1? '/RetencionCompra/Post':'/RetencionCompra/Put?idRetencionCompra='+$scope.retencionCompra.idRetencionCompra;   
            mS.getData('post', url, $scope.data).then(response=>{
                if (response.id === "0") {
                    Swal.fire({
                        icon:'warning',
                        html:`<small>${response.message}</small>`,
                        allowOutsideClick:false
                    })
                    return;
                }
                if (response.id === "1") {                    
                    if(tipo==1)                  {
                        $scope.autorizar(response.lastId); //Autorizar
                    }                        
                    if(tipo==2){
                        toast.toastr('success', response.message, response.titleSms)
                    }
                    $scope.getRetCompra();                                                        
                    $("#modalRetentionPurchase").modal('hide');  
                }
            }, error => console.log(error));
        }


        $scope.editarRetencionCompra=function(idRetencionCompra){
            mS.getData('get','/RetencionCompra/GetId?idRetencionCompra='+idRetencionCompra).then(response=>{
                if(response.id=="0"){
                    Swal.fire({
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    });
                    return
                }
                if(response.id=="1"){
                    $scope.tipoRegistro=2;

                    let {retencionCompra:data, dataDetalle, infoAdicional}=response.data;
                    $scope.proveedor={
                        idProveedor: data.retencionCompra.idProveedor,
                        nombreFiscal: data.proveedor,
                        numeroIdentificacion: data.numeroIdentificacion
                    }
                    $scope.selectedInvoice={
                        idFacturaCompra: data.retencionCompra.idFacturaCompra,
                        nroFactura: data.nroFactura
                    }
                    $scope.retencionCompra=data.retencionCompra;                   
                    $scope.retencionCompra.fechaEmision = form.formatDate(data.retencionCompra.fechaEmision); 
                   
                    //Cargar Retencion Detalle 
                    $scope.gridOptions.data=dataDetalle;                    
                    $scope.countIndex();

                    //Cargar Informacion Adicional del Tipo Documento Retencion Compra 
                    $scope.gridOptionsInfoAdicionalRC.data = infoAdicional;
                    $scope.enumGridOptionsInfoAdicional();
                    $("#modalRetentionPurchase").modal('show');                      
                }
            })
        }

        //Eliminar Retencion Compra
        $scope.delete = function (data) {
            Swal.fire({
                icon:'warning',
                html:`<small>Está seguro/a de Eliminar esta Retencion ahora?</small>`,
                showConfirmButton:true,
                confirmButtonText:'Si, eliminar',
                showCancelButton:true,
                cancelButtonText:'No, cancelar',
                allowOutsideClick: false
            }).then(result => {
                if (result.value) {
                    mS.getData('post', '/RetencionCompra/Delete?idRetencionCompra=' + data.retencionCompra.idRetencionCompra).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getRetCompra();
                            return
                        }
                    }, error=>console.log(error));
                }
            })
        }



        //Retencion Detalle
        $scope.gridOptionsRetVista = {
            enableColumnMenus:false,
            showColumnFooter: true,
            enableCellEdit: false,
            // showColumnFooter: true,
            // enableSorting: true,
            columnDefs: [
                { 
                    name: 'N°', field: 'num', visible: true,
                    enableCellEdit: false, 
                    allowCellFocus:false,
                    width: '2%', minWidth: '50', 
                }, 
                {
                    name: 'Impuesto',
                    field: 'tipoImpuesto',                    
                    type: 'string',
                    width: '10%',
                    minWidth: '100',
                    allowCellFocus:false,
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',
                },
                {
                    name: 'Cod. Imp.',
                    field: 'codigoImpuesto',
                    type: 'string',
                    width: '10%',
                    minWidth: '100',
                    headerCellClass: 'header-text-retencion',
                    cellClass: 'body-text-retencion',                    
                    allowCellFocus:false,
                },                              
                {
                    name: "descripción",
                    field: "impuesto",
                    allowCellFocus: false,                                       
                    width: '45%',
                    minWidth:'100'
                },
                {
                    name: 'B. Imponible',
                    field: 'retencionCompraDetalle.baseImponible',
                    enableColumnMenu: false,
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    min: 0,
                    minWidth: 110,
                    footerCellFilter: 'number:2',
                    cellEditableCondition: function (scope) {
                        return scope.row.entity.impuesto !==''
                    },
                    cellFilter: "currency:'$'",
                    enableCellEdit: false,
                    enableCellEditOnFocus: false,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                {
                    name: 'porcentaje',
                    field: 'retencionCompraDetalle.porcentajeRetencion',
                    enableColumnMenu: false,
                    cellFilter: "currency:'%'",
                    enableCellEdit: false,
                    allowCellFocus:false,
                    minWidth: 110,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                {
                    name: 'V. Retenido',
                    field: 'retencionCompraDetalle.valorRetenido',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'number:2',
                    cellFilter: "currency:'$'",
                    enableCellEdit: false,
                    allowCellFocus:false,
                    enableCellEditOnFocus: false,
                    enableColumnMenu: false,
                    minWidth: 110,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                {
                    name: 'estado Impuesto',
                    field: 'estadoImpuesto',
                    visible: false,
                    enableColumnMenu: false,
                    type: 'number',
                    width: '10%',
                    minWidth:'100'
                },
                //{
                //    name: 'Total', field: 'retencionCompraDetalle.total', enableColumnMenu: false,
                //    cellFilter: "currency:'$'",
                //    enableCellEdit: false,
                //    type: 'number', width: '8%'
                //},               
            ],           
        }

        $scope.openModalRetencionDetalle=function(idRetencionCompra){            
            mS.getData('get','/RetencionCompra/GetId?idRetencionCompra='+idRetencionCompra).then(response=>{
                if(response.id=="0"){
                    Swal.fire({
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    });
                    return
                }
                if(response.id=="1"){
                    $scope.tipoRegistro=2;

                    let {retencionCompra:data, dataDetalle}=response.data;
                    $scope.proveedor={
                        idProveedor: data.retencionCompra.idProveedor,
                        nombreFiscal: data.proveedor,
                        numeroIdentificacion: data.numeroIdentificacion
                    }
                    $scope.selectedInvoice={
                        idFacturaCompra: data.retencionCompra.idFacturaCompra,
                        nroFactura: data.nroFactura
                    }
                    $scope.retencionCompra=data.retencionCompra;
                    let fechaEmision = form.formatDate(data.retencionCompra.fechaEmision);
                    $scope.retencionCompra.fechaEmision= fechaEmision;
                    $scope.gridOptionsRetVista.data=dataDetalle;
                    $scope.countIndex();
                    $("#retentionCompraDetalle").modal('show');                    
                }
            })            
            return
        }

        let loader = $('.loader');
        $scope.autorizar = function (idRetencionCompra) {            
            Swal.fire({
                icon:'warning',
                html:`<small>Desea autorizar este Retencion Ahora?</small>`,
                showConfirmButton:true,
                confirmButtonText:'Si, autorizar',
                showCancelButton:true,
                cancelButtonText:'No, cancelar',
                allowOutsideClick:false
            }).then(result=>{
                if(result.value){
                    loader.show();   

                    let url = '/RetencionCompra/getAuthorizateRetencion?idRetencionCompra=' + idRetencionCompra;
                    mS.getData('get', url).then(response => {
                        if (response.id === "0") {
                            loader.hide(); //Hide loading                             
                            Swal.fire({
                                icon: 'warning', 
                                html: `<small>${response.message}</small>`
                            });
                            return;
                        }
                        if (response.id == "1") {
                            loader.hide(); //Hide loading
                            Swal.fire({
                                icon: 'success', 
                                html: `<small>${response.message}</small>`, 
                                timer: 2000 
                            });

                            $scope.getRetCompra()   
                            return;
                        }
                    }, error => console.log(error));
                }
            })            
        };



         //Reporte 
         $scope.getReport = function (idRetencionCompra) {
            var format = 'pdf';

            var reportParams = {
                codigo: 'RRC',
                format
            };
            var dataParmas = {
                idRetencionCompra

            };
            var parameters = {
                format: format,
                reportParams: JSON.stringify(reportParams),
                dataParams: JSON.stringify(dataParmas),
                sendEmail: false
            };
            mS.getFile('post', '/RetencionCompra/Download', parameters).then(response => {                                
                let fileBlob = new Blob([response.data], { type: response.data.type });                
                let objectUrl = window.URL || window.webkitURL;
                let urlFile = objectUrl.createObjectURL(fileBlob);               
              
            //    let height = (parseInt(window.innerHeight) / 2);
            //     let width = (parseInt(window.innerWidth) / 2);

                // Ajuste horizontal
                let x = parseInt((screen.width - 1200) / 2);
                // Ajustae vertical
                let y = parseInt((screen.height - 650) / 4);
                        
                window.open(urlFile, "_blank",             
                                 `resizable=yes
                                 width=1200
                                 height=650
                                 screenY=${y}
                                 screenX=${x}`
                         );   
             
                return;
                
            }, error => console.log(error));
        };


        $("#modalTaxProduct").on('hide.bs.modal',e=>{
            $scope.articulos=[];
        });

       

        $("#viewFactura, #viewIngresoBodega, #viewNotaEntrega").on('hide.bs.modal',e=>{                        
            $rootScope.header={};
            $rootScope.detalle=[];
            $rootScope.footer={};
        })

        //Cerrar Modal Retencion y Retencion Fisica 
        $("#modalRetentionPurchase, #retentionCompraDetalle").on('hide.bs.modal', e => {
            $scope.data = {}
            $scope.proveedor = {};            
            $scope.retencionCompra = {};            
            $scope.selectedProveedor = '';
            $scope.selectedInvoice={};
            $scope.gridOptions.data = [];
            $scope.gridOptionsRetVista.data = [];
            //Informacion Factura
            $scope.dataFactura = {};                                
            $scope.sustentoTributario = {}            
            $scope.tiempoCredito = {};            
            $scope.categoriaCompra = {};
            $scope.retencionCompra.fechaEmision = new Date();
            $scope.id = '';
            $scope.typeNotify = ''
            $scope.message = '';
            $scope.load();
        });

    }
})(window.angular);