import './modalCompraBaseCtrl.min.js?v=0.9'

class ModalCompraNoHabitualCtrl extends window.modalCompraBaseCtrl {

    constructor({
        $scope,
        $timeout,
        $uibModalInstance,
        _mS,
        _commonSvc,
        _modalSvc,
        _nombreModalConst,
        _tS,
        _fS
    }) {

        super({
            _mS,
            _fS
        })

        const self = this;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;

        this._commonSvc = _commonSvc;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;

        this.TIPO_DOC = this._commonSvc.tipoDoc['IB']
        this.proveedor = {}

        this.gridOptions = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }

        this.gridOptions.onRegisterApi = function (gridApi) {
            self.$scope.gridApi = gridApi;
            if (self.$scope.gridApi) {
                self.$timeout(() => {
                    self.$scope.gridApi.core.handleWindowResize();
                    self.$scope.gridApi.grid.refresh();
                }, 5);
            }


            gridApi.grid.element.on('keyup', function (ev) {
                if (ev.which == 13 || ev.keyCode == '13') {
                    self.setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit(self.$scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }

                const objCalculo = self.uiGridInvoice.calculoColDef(rowEntity, oldValue)
                objCalculo[colDef.field] && objCalculo[colDef.field]();
                objCalculo["calculoTotalDetalle"]();
                self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

                if (rowEntity.datosAdicionales && Number.isInteger(rowEntity.cantidad) && rowEntity.cantidad > 0) {
                    //  $scope.abrirModalDatoAdicional(rowEntity);                           
                }

            })
        }

        this.datosAdicionalesArticulo = [];
    }

    /**
     * 
     * @param {*} entity Datos del Articulo 
     */
    async deleteRow(entity) {

        let isConfirmed = await this.uiGridInvoice.deleteRow(entity);

        if (isConfirmed && entity.datosAdicionales) {
            this.datosAdicionalesArticulo = this.datosAdicionalesArticulo.filter(val => val.idArticulo !== entity.idArticulo);
        }

        if (isConfirmed) {
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            this.$scope.$apply();
        }

    }


    calcularPorcentajeDescuento() {
        this.data.porcentajeDescuento = this.data.porcentajeDescuento || 0;
        if (typeof this.data.porcentajeDescuento !== "number" || this.data.porcentajeDescuento === "") {
            this._tS.toastr('warning', 'Ingrese un Número Válido');
            return
        }

        if (this.data.porcentajeDescuento <= 100) {
            //redondeo del numero porcentaje 
            this.data.porcentajeDescuento = this._fS.roundNumber(this.data.porcentajeDescuento, this.decimal.nroTotalSubTotal)
            this.setPorcentajeDescuentoAll(this.data.porcentajeDescuento);
        } else {
            this.toast.toastr('warning', 'El Porcentaje de Descuento tiene que ser menor o igual a 100');
        }
    }

    //Calcular Porcentaje  Descuento 
    calcularDescuento() {
        try {
            this.data.totalDescuento = this.data.totalDescuento || 0;
            if (typeof this.data.totalDescuento !== 'number' || this.data.totalDescuento === "") {
                this._tS.toastr('warning', 'Ingrese un númeto válido', 'Valor Descuento');
                return
            }

            if (this.data.totalDescuento <= this.uiGridInvoice.getSubTotalSinImpuesto()) {
                let porcentajeDescuento = (this.data.totalDescuento * 100) / this.uiGridInvoice.getSubTotalSinImpuesto() || 0;
                this.data.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroDescuentoDetalle);
                this.setPorcentajeDescuentoAll(this.data.porcentajeDescuento)
            } else {
                this._tS.toastr('warning', 'El Valor Descuento no puede ser mayor al total');
            }
        } catch (error) {
            console.log("CALCULO DE TOTAL DESCUENTO", error)
        }
    }


    getImporteTotal() {
        if (!this.decimal) return
        let total = Number(this.data.total)
        // let transporte   = Number(this.data.transporte);
        // let recargo      = Number(this.data.recargo);
        // let importeTotal = total + transporte + recargo;
        // this.data.total  = importeTotal;

        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
    }


    deleteColumnIce() {
        let indexColumn = this.gridOptions.columnDefs.findIndex(item => item.field === "ice");
        this.gridOptions.columnDefs.splice(indexColumn, 1);
    }



    changeEstablecimiento() {
        try {

            if (this.establecimientos.length > 0) {


                this.puntosEmision = this.puntosEmisionTemporal.filter(item => item.codEstab === this.data.codEstab)
                this.data.idPuntoEmision = this.puntosEmision.find(item => (item.predeterminado)).idPuntoEmision;


                this.bodegas = this.bodegasTemporal.filter(item => item.codEstab === this.data.codEstab);
                this.idBodega = this.bodegas.find(item => (item.predeterminado)).idBodega;

                //Actividad Tipo iVA 
                this.actividadTipoIva = this.actividadTipoIvaTemporal.find(item => item.codEstab === this.data.codEstab)

                let indexBodega = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
                this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;

                for (let item of this.gridOptions.data) {
                    item.idBodega = this.idBodega;
                }

                //Recalculamos los valos de subtotales 

                this.uiGridInvoice.actividadTipoIva = this.actividadTipoIva;
                this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());

            }


        } catch (error) {
            console.log(error)
        }
    }



    async onSave() {
        try {



            let textAccion = this.data.idDocumentoIngreso > 0 ? 'Actualizar' : 'Guardar';
            let serieComprobante = this.data.ptoEmi + '-' + this.data.secuencial;

            //Validaciones
            if (!this.isValidaForm()) return;

            //Generar el Numero de Secuencial
            if (!this.data.idDocumentoIngreso) {
                showLoader();
                serieComprobante = await this.compraNoHabSvc.generateNroSecuencial(this.data.idPuntoEmision);
                hideLoader();
                if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"
            }


            let { isConfirmed } = await Swal.fire({
                title: `<small>${textAccion} Documento no Habitual</small>`,
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento <b> Nro. ${serieComprobante}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Si, ${textAccion}!`,
                cancelButtonText: 'No, cancelar!',
            })


            if (isConfirmed) {

                showLoader();
                let idEstablecimiento, estab, ptoEmi, query;

                this.data.tarifa = this.actividadTipoIva.tarifa;

                idEstablecimiento = this.establecimientos.find(item => item.codEstab === this.data.codEstab).idEstablecimiento;

                estab = this.establecimientos.find(item => item.codEstab === this.data.codEstab).estab;

                ptoEmi = this.puntosEmision.find(item => item.idPuntoEmision === this.data.idPuntoEmision)

                query = this.compraNoHabSvc.queryMapper({
                    data: this.data,
                    details: this.gridOptions.data,
                    proveedor: this.proveedor,
                    idEstablecimiento,
                    estab,
                    ptoEmi: ptoEmi ? ptoEmi.puntoEmi : null,
                    datosAdicionalesArticulo: this.datosAdicionalesArticulo
                })

                //Actualizar
                if (this.data.idDocumentoIngreso > 0) {
                    this.compraNoHabSvc.update(this.data.idDocumentoIngreso, query).then(this.successReponse)
                        .catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                } else {
                    this.compraNoHabSvc.create(query).then(this.successReponse)
                        .catch(error => {
                            hideLoader();
                            console.log(error);
                        })
                }
            }


        } catch (error) {
            hideLoader()
            console.log(error)
        }
    }


    successReponse = (response) => {
        if (response.code == '0') {
            hideLoader();
            this._fS.sweetAlert('warning', response.message, response.titleSms);
        }

        if (response.code == "1") {
            hideLoader();
            this._fS.sweetAlert('success', response.message, response.titleSms, 1000);

            this.$uibModalInstance.close(response)
        }
    }


    selectedItemProveedor(item) {
        try {
            this.proveedor = item;
            this.searchProveedorOptions.showBtnEdit = true;
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }
    }

    getDataEtiqueta(item) {
        console.log(item)
        console.log(entity)
    }


    async closeModal() {

        if (this.gridOptions.data.length > 0) {
            //
            this.$uibModalInstance.close();
        } else {
            this.$uibModalInstance.close();
        }
    }
}


export class ModalAddCtrl extends ModalCompraNoHabitualCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'compraNoHabitualService', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario']

    constructor($scope, $timeout, $uibModalInstance, compraNoHabSvc, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _tS,
            _fS
        });

        this.compraNoHabSvc = compraNoHabSvc;

        this.searchProveedorOptions = {}
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;

        this.data.fechaEmision = new Date();

        this.datosAdicionalesArticulo = []

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                          
                           <a  btn-data-adicional-articulo entity="row.entity" get-data-etiqueta="$ctrl.getDataEtiqueta(item)" datos-adicionales="grid.appScope.$ctrl.datosAdicionalesArticulo" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;

        this.CAMPOS = ["codEstab", "idProveedor", "idPuntoEmision", "fechaEmision", "gridOptions", "gridOptionsBodega"];
    }

    async $onInit() {

        try {
            showLoader();

            let {
                UiGridOptionsCompra
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.compraNoHabSvc.get({
                typeList: 2
            }).then(response => {
                let {
                    estabs,
                    puntosEmision,
                    bodegas,
                    decimal,
                    tarifasImpuesto,
                    tarifasImpuestoVigente,
                    config,
                } = response;
                this.establecimientos = estabs;
                this.data.codEstab = this.establecimientos.find(item => (item.predeterminado)).codEstab;

                this.puntosEmisionTemporal = puntosEmision;
                this.bodegasTemporal = bodegas;
                this.actividadTipoIvaTemporal = tarifasImpuestoVigente;

                this.decimal = decimal;
                this.tipoIvas = tarifasImpuesto;
                this.data.inventory = config.inventory;  

                this.puntosEmision = this.puntosEmisionTemporal.filter(item => item.codEstab === this.data.codEstab)
                this.data.idPuntoEmision = this.puntosEmision.find(item => (item.predeterminado)).idPuntoEmision;


                this.bodegas = this.bodegasTemporal.filter(item => item.codEstab === this.data.codEstab);
                this.idBodega = this.bodegas.find(item => (item.predeterminado)).idBodega;

                //Actividad Tipo iVA 
                this.actividadTipoIva = this.actividadTipoIvaTemporal.find(item => item.codEstab === this.data.codEstab)
 
                this.setColumnDefs();

                //Eliminar Mas Adelante 

                this.gridOptions.columnDefs[7] = {
                    name: 'I.V.A',
                    field: 'codigoPorcentaje',
                    width: '8%',
                    minWidth: '100',
                    type: 'text',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'cellFilterTipoIva:this',
                    editDropdownValueLabel: 'descripcion',
                    editDropdownIdLabel: 'codigoPorcentaje',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    //    visible: config.porcentajeIva
                }

                let indexTipoIva = this.gridOptions.columnDefs.findIndex(item => item.field === 'codigoPorcentaje');
                this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;

                let indexBodega = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
                this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;


                this.uiGridInvoice = new UiGridOptionsCompra({
                    $scope: this.$scope,
                    gridOptions: this.gridOptions,
                    _fS: this._fS,
                    _tS: this._tS,
                    tipoIvas: this.tipoIvas,
                    decimal: this.decimal,
                    actividadTipoIva: this.actividadTipoIva
                })  
            }).finally(()=>hideLoader());

            this.$scope.$apply();

        } catch (error) {
            hideLoader();
            console.log(error)
        }  
    }





}


export class ModalUpdateCtrl extends ModalCompraNoHabitualCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'articuloService', 'compraNoHabitualService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, articuloSvc, compraNoHabSvc, _modalSvc, _nombreModalConst, _tS, _fS, params) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _tS,
            _fS
        });

        this.articuloSvc = articuloSvc;
        this.compraNoHabSvc = compraNoHabSvc;
        this.params = params;

        this.searchProveedorOptions = {};
        this.proveedor = this.params.proveedor;
        this.datosAdicionalesArticulo = this.params.datosAdicionales || [];

        this.puntosEmision = [];
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;
        this.searchProveedorOptions.showBtnEdit = true;

        this.data.fechaEmision = new Date();

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >  

                           <a  btn-data-adicional-articulo entity="row.entity" datos-adicionales="grid.appScope.$ctrl.datosAdicionalesArticulo" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;

        this.CAMPOS = ["codEstab", "idProveedor", "idPuntoEmision", "fechaEmision", "gridOptions", "gridOptionsBodega"];
    }

    async $onInit() {

        try {
            showLoader();

            let {
                UiGridOptionsCompra
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());



            this.data = this.params.comprobante;
            this.data.fechaEmision = this._fS.formatDate(this.data.fechaEmision)




            this.actividadTipoIva = {
                tarifa: this.data.tarifa,
                codigoPorcentaje: this.data.codigoPorcentaje
            }

            this.establecimientos = [{
                codEstab: this.data.codEstab,
                nombreComercial: this.data.nombreComercial
            }]




            //Detalle
            let index = 1;
            this.gridOptions.data = this.params.detalles;
            for (let item of this.gridOptions.data) {
                item.n = index++;

                this.articuloSvc.findForPurchase({
                    idArticulo: item.idArticulo
                }).then(response => {
                    item.medidas = response.medidas
                    item.etiquetas = response.etiquetas;
                })

                //Por Anlizar 
                item.subTotal = item.cantidad * item.precioUnitario;
                item.ice = 0;
                item.totalIce = 0;
            }



            //Bodegas 
            this.bodegas = this.params.bodegas.filter(item => item.codEstab === this.data.codEstab);
            this.idBodega = this.bodegas.find(item => (item.predeterminado)).idBodega;


            //Ddecimal 
            this.decimal = this.params.decimal;

            //Impuestos al Iva
            this.tipoIvas = this.params.tipoIvas;

            this.data.inventory = this.params.inventario.inventory;

            //Calculos
            let porcentajeDescuento = (((this.data.subTotalSinImpuestos - this.data.total) / 100) * this.data.subTotalSinImpuestos)
            this.data.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroTotalSubTotal)

            this.setColumnDefs();

            //Eliminar Mas Adelante 
            this.gridOptions.columnDefs[7] = {
                name: 'I.V.A',
                field: 'codigoPorcentaje',
                width: '8%',
                minWidth: '100',
                type: 'text',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'codigoPorcentaje',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                //    visible: config.porcentajeIva
            }

            let indexTipoIva = this.gridOptions.columnDefs.findIndex(item => item.field === 'codigoPorcentaje');
            this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;

            this.uiGridInvoice = new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })


            this.$scope.$apply();

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    } 

}




export class ModalDetalleCtrl extends ModalCompraNoHabitualCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, params) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _tS,
            _fS
        });

        this.params = params;

        this.searchProveedorOptions = {}
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;
        this.searchProveedorOptions.showBtnEdit = true;

        this.data.fechaEmision = new Date();

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                           <a  ng-click="grid.appScope.$ctrl.abrirModalDatoAdicional(row.entity)" style="cursor:pointer;" ng-show='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;


    }

    async $onInit() {

        try {
            showLoader();

            let {
                UiGridOptionsCompra
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());



            this.data = this.params[0][0];
            this.data.fechaEmision = this._fS.formatDate(this.data.fechaEmision)




            this.actividadTipoIva = {
                tarifa: this.data.tarifa,
                codigoPorcentaje: this.data.codigoPorcentaje
            }

            this.establecimientos = [{
                codEstab: this.data.codEstab,
                nombreComercial: this.data.nombreComercial
            }]

            this.proveedor = this.params[1][0];


            //Detalle
            this.gridOptions.data = this.params[2];
            for (let item of this.gridOptions.data) {

                const data = {
                    idArticulo: item.idArticulo
                }

                this._commonSvc.getDataArticuloParaCompra({
                    json: data
                }).then(response => {
                    const results = JSON.parse(response.payload);
                    item.medidas = results[1]
                    item.etiquetas = results[2]
                })

                //Por Anlizar 
                item.subTotal = item.cantidad * item.precioUnitario;
                item.ice = 0;
                item.totalIce = 0;
            }



            //Bodegas 
            this.bodegas = this.params[4].filter(item => item.codEstab === this.data.codEstab);
            this.idBodega = this.bodegas.find(item => (item.predeterminado)).idBodega;


            //Ddecimal 
            this.decimal = this.params[5][0]

            //Impuestos al Iva
            this.tipoIvas = this.params[6];

            this.data.inventory = this.params[7][0].inventory;

            //Calculos
            let porcentajeDescuento = (((this.data.subTotalSinImpuestos - this.data.total) / 100) * this.data.subTotalSinImpuestos)
            this.data.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroTotalSubTotal)

            this.setColumnDefsView();

            //Eliminar Mas Adelante 
            this.gridOptions.columnDefs[7] = {
                name: 'I.V.A',
                field: 'codigoPorcentaje',
                width: '8%',
                minWidth: '100',
                type: 'text',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'codigoPorcentaje',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                //    visible: config.porcentajeIva
            }

            let indexTipoIva = this.gridOptions.columnDefs.findIndex(item => item.field === 'codigoPorcentaje');
            this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;

            this.uiGridInvoice = new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })


            this.$scope.$apply();

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }


    getReport() {
        try {

            let format = 'excel';

            const parameters = {
                dataParams: JSON.stringify({
                    id: this.data.idDocumentoIngreso,
                    codDoc: 'CNH',
                }),
                reportParams: JSON.stringify({
                    codigo: 'RCD',
                    codEstab: this.data.codEstab,
                    format,

                }),
                hasService: true,
            }

            this._commonSvc.getReport({
                parameters,
                formatType: format
            })
        } catch (error) {
            console.log(error)
        }
    }


}