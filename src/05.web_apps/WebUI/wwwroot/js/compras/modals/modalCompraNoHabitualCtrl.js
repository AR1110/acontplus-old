import './modalCompraBaseCtrl.min.js?v=0.8'

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

    trimDetail() {
        let index = 1
        return this.gridOptions.data.map(item => {
            let data = {
                index: index++,
                idDocumentoIngresoDetail: item.idDocumentoIngresoDetail || 0,
                idArticulo: item.idArticulo,
                idMedida: item.idMedida,
                idBodega: item.idBodega,
                codigoPrincipal: item.codigoPrincipal,
                codigoAuxiliar: item.codigoAuxiliar,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                costoNeto: item.costoNeto,
                descuento: item.valorDescuento,
                precioTotalSinImpuesto: item.total,
                codigoPorcentaje: item.codigoPorcentaje,
            }
            return data;
        })
    }

    taxes() {
        let index = 1
        return this.gridOptions.data.map(item => {
            let data = {
                index: index++,
                idArticulo: item.idArticulo,
                codigo: "2",
                codigoPorcentaje: item.codigoPorcentaje,
                tarifa: item.tarifa,
                baseImponible: item.total,
                valor: (item.tarifa / 100) * item.total,
            }
            return data;
        })
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
            let method = this.data.idDocumentoIngreso > 0 ? 'put' : 'post';
            let url = this.data.idDocumentoIngreso > 0 ? 'CompraNoHabitual/' + this.data.idDocumentoIngreso : 'CompraNoHabitual';
            let serieComprobante = this.data.ptoEmi + '-' + this.data.secuencial;

            if (!this.isValidaForm()) return;

            if (!this.data.idDocumentoIngreso) {
                console.log('generate sequemn')
                //===============================Generar el Numero de Secuencial============================
                showLoader();
                serieComprobante = await this._mS.getData('get', 'CompraNoHabitual/' + JSON.stringify({
                    idPuntoEmision: this.data.idPuntoEmision,
                    typeList: 3
                }), null, true).then(response => {
                    if (response.code === "0") {
                        console.log(response)
                        hideLoader();
                        return null;
                    }
                    if (response.code === "1") {
                        hideLoader();
                        return JSON.parse(response.payload)[0][0].serieComprobante
                    }
                })
                if (!serieComprobante) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"
            }




            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
                title: `<small>${textAccion} Documento no Habitual</small>`,
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento <b> Nro. ${serieComprobante}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si, ${textAccion}!`,
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(result => {

                if (result.isConfirmed) {
                    showLoader();


                    this.data.idProveedor = this.proveedor.idProveedor

                    //Tarifa Aplicada al Documento
                    this.data.tarifa = this.actividadTipoIva.tarifa;

                    let idEstablecimiento, estab, ptoEmi;
                    if (this.data.idDocumentoIngreso > 0) {

                    } else {
                        idEstablecimiento = this.establecimientos.find(item => item.codEstab === this.data.codEstab).idEstablecimiento;
                        estab = this.establecimientos.find(item => item.codEstab === this.data.codEstab).estab;
                        ptoEmi = this.puntosEmision.find(item => item.idPuntoEmision === this.data.idPuntoEmision).puntoEmi;
                    }

                    const data = {
                        comprobante: JSON.stringify({
                            idEstablecimiento,
                            idPuntoEmision: this.data.idPuntoEmision,
                            idProveedor: this.data.idProveedor,
                            estab,
                            ptoEmi,
                            fechaEmision: moment(this.data.fechaEmision).format('YYYY-MM-DD HH:mm:ss A'),
                            totalSinImpuestos: this.data.subTotalSinImpuestos,
                            importeTotal: this.data.total,
                            inventory: this.data.inventory
                        }),
                        detalles: JSON.stringify(this.trimDetail()),
                        impuestos: JSON.stringify(this.taxes())
                    }
                    console.log(data)
                    this._mS.getData(method, url, data, true).then(response => {
                        if (response.code == '0') {
                            hideLoader();
                            this._fS.sweetAlert('warning', response.message, response.titleSms);
                        }

                        if (response.code == "1") {
                            hideLoader();
                            this._fS.sweetAlert('success', response.message, response.titleSms, 1000);

                            this.$uibModalInstance.close(response)
                        }
                    })


                }

            })

        } catch (error) {
            hideLoader()
            console.log(error)
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

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS) {
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

        this.searchProveedorOptions = {}
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;

        this.data.fechaEmision = new Date();

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                          
                           <a  btn-data-adicional-articulo entity="row.entity" get-data-etiqueta="$ctrl.getDataEtiqueta(item)" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;

        this.CAMPOS = ["codEstab", "idProveedor", "idPuntoEmision", "fechaEmision", "gridOptions", "gridOptionsBodega"];
    }

    async $onInit() {

        try {
            showLoader();

            let {
                UiGridOptionsCompra
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());
            this._mS.getData('get', 'CompraNoHabitual/' + JSON.stringify({
                typeList: 2
            }), null, true).then(response => {
                if (response.code == "0") {
                    hideLoader();
                    console.log(response)
                }

                if (response.code === "1") {

                    let mainData = JSON.parse(response.payload);

                    this.establecimientos = mainData[0];
                    this.data.codEstab = this.establecimientos.find(item => (item.predeterminado)).codEstab;



                    this.puntosEmisionTemporal = mainData[1];
                    this.bodegasTemporal = mainData[2];
                    this.actividadTipoIvaTemporal = mainData[5]

                    this.decimal = mainData[3][0];
                    this.tipoIvas = mainData[4];
                    this.data.inventory = mainData[6][0].inventory;


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

                    hideLoader();

                }
            })

            this.$scope.$apply();

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }





}


export class ModalUpdateCtrl extends ModalCompraNoHabitualCtrl {

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

        this.searchProveedorOptions = {};
        this.proveedor = this.params[1][0];

        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;
        this.searchProveedorOptions.showBtnEdit = true;

        this.data.fechaEmision = new Date();

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                           <a  ng-click="grid.appScope.$ctrl.abrirModalDatoAdicional(row.entity)" style="cursor:pointer;" ng-show='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;

        this.CAMPOS = ["codEstab", "idProveedor", "idPuntoEmision", "fechaEmision", "gridOptions", "gridOptionsBodega"];
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
            let dataParms = {
                id: this.data.idDocumentoIngreso,
                codEstab: this.data.codEstab,
                codigo: 'RCD',
                codDoc: 'CNH',
                format,
            }

            const parameters = {
                dataParams: JSON.stringify(dataParms)
            }

            this._commonSvc.getReportDynamic({
                parameters,
                format
            })
        } catch (error) {
            console.log(error)
        }
    }


}