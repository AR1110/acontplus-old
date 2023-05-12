import './modalCompraBaseCtrl.min.js'

class ModalNotaCreditoCtrl extends window.modalCompraBaseCtrl {

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

        this.TIPO_DOC = this._commonSvc.tipoDoc['NCP']
        this.TIPO_DOC_FC = this._commonSvc.tipoDoc['FC']
        this.proveedor = {}

        this.factura = {}
        this.facturas = [];

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


    async openModalDetalleFactura() {
        try {

            showLoader();

            if (!(this.factura.idFactura > 0)) {
                this._tS.toastr('warning', 'Seleccione la Factura Compra')
                return
            }
            let {
                MODAL_FILE_CTRL,
                MODAL_DETALLE
            } = this._nombreModalConst.factura_compra;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_DETALLE['controller']];
            let template = MODAL_DETALLE['template'];

            let response = await this._commonSvc.getDataTipoDocCompra({
                id: this.factura.idFactura,
                codigoDocumento: this.TIPO_DOC_FC.codigo
            })

            if (!response.isComplete) return

            let params = {
                TIPO_REGISTRO: 'DETALLE',
                data: response
            }

            this._modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                windowClass: 'uibModalFullScreen',
                params
            })
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }





    /**
     * 
     * @param {*} entity Datos del Articulo 
     */
    async deleteRow(entity) {

        let isConfirmed = await this.uiGridInvoice.deleteRow(entity);

        if (isConfirmed) {
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            this.$scope.$apply();
        }

    }

    trimDetail() {
        return this.gridOptions.data.map(item => {
            let data = {
                idNotaCreditoProveedorDetalle: item.idNotaCreditoProveedorDetalle || 0,
                idBodega: item.idBodega,
                idArticulo: item.idArticulo,
                idMedida: item.idMedida,
                idTipoIva: item.idTipoIva,

                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                precioCostoNeto: item.precioCostoNeto,
                porcentajeDescuento: item.porcentajeDescuento,
                valorDescuento: item.valorDescuento,
                ice: item.ice,
                iva: item.iva,

                codigoPorcentaje: item.codigoPorcentaje,
                tarifa: item.tarifa,
                nota: item.nota || null,
                total: item.total,
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


    saveNotaCredito(id) {

        let notaCredito = Object.assign({}, this.data);

        notaCredito.idProveedor = this.proveedor.idProveedor;
        notaCredito.idFacturaCompra = this.factura.idFactura;

        //Tarifa Aplicada al Documento
        notaCredito.tarifa = this.actividadTipoIva.tarifa;
        notaCredito.fechaEmision = this._fS.formatDateTimeZone(this.data.fechaEmision)

        let data = {
            notaCredito,
            detalle: this.trimDetail()
        };


        if (id > 0) {
            return this._mS.getData('put', '/NotaCreditoProveedor/Update?id=' + id, data).then(response => response)
                .catch(errorResponse => {
                    throw new Error(errorResponse)
                })
        } else {

            return this._mS.getData('post', '/NotaCreditoProveedor/Insert', data).then(response => response)
                .catch(errorResponse => {
                    throw new Error(errorResponse)
                })
        }
    }



    closeModal() {
        this.$uibModalInstance.close();
    }
}


export class ModalNotaCreditoNuevoCtrl extends ModalNotaCreditoCtrl {

    static $inject = [
        '$scope', 
        '$timeout', 
        '$uibModalInstance', 
        'mainService', 
        'commonService', 
        'facturaCompraService',
        'modalService', 
        'nombreModal', 
        'toastService', 
        'formulario'
    ]

    constructor(
        $scope, 
        $timeout, 
        $uibModalInstance, 
        _mS, 
        _commonSvc, 
        factCompraSvc,
        _modalSvc,
        _nombreModalConst, 
        _tS, 
        _fS
    ) {
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

        this.factCompraSvc = factCompraSvc;
        this.searchProveedorOptions = {}
        this.searchProveedorOptions.showBtnNew = true;
        this.searchProveedorOptions.showBtnList = true;

        this.data.fechaEmision = new Date();

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                                                         
                        `;

        this.CAMPOS = ["codEstab", "ptoEmision", "nroDocumento", "nroAutho", "fechaEmision", "idProveedor", "idFactura", "gridOptions", "gridOptionsBodega"];
    }

    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {
                UiGridOptionsCompra
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos[0];
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.puntosEmision = resultsDataFormEstab[0];

                if (this.puntosEmision.length > 0) {
                    this.data.idPuntoEmision = this.puntosEmision[0].idPuntoEmision
                } else {
                    this._tS.toastr('warning', 'No tienes asignado ningún Punto de Emisión')
                }

                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]
            } else {
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.decimal = resultsDataForm[1][0]
            this.tipoIvas = resultsDataForm[2];

            this.setColumnDefs();

            this.uiGridInvoice = new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })

            this.data.fechaEmision = new Date();

            this.deleteColumnIce();

            this.$scope.$apply();

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }




    selectedItemProveedor(item) {
        this.proveedor = item;
        this.searchProveedorOptions.showBtnEdit = true;
        this.factura = {};
        this.facturas = [];
        this.getFacturas();
        this.$scope.$apply();
    }


    getFacturas() {
        try {
            showLoader();
            this.factCompraSvc.findByProveedor(this.proveedor.idProveedor).then(response=> {
                if(response.code==='0'){
                    hideLoader();
                    Swal.fire({
                        icon:'warning',
                        html: response.message
                    })
                }
                if(response.code==='1'){
                    hideLoader();
                    this.facturas = response.payload;
                }                
            }).catch(error=>{
                hideLoader();
                console.log(error);
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }

    }





    async getDetalleFacturaCompra() {
        const self = this;

        try {
            showLoader();
            let response = await this._commonSvc.getDataTipoDocCompra({
                id: this.factura.idFactura,
                codigoDocumento: this.TIPO_DOC_FC.codigo
            })

            if (response.isComplete) {
                this.gridOptions.data = response.detalleDocumento;
                self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

            }


        } catch (error) {
            console.error(error)
        } finally {
            hideLoader();
        }
    }


    async onSave() {
        try {

            showLoader();

            let textAccion = 'Guardar';

            if (!this.isValidaForm(textAccion)) return

            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoCompra({
                puntoEmision: this.data.ptoEmision,
                nroDocumento: this.data.nroDoc,
                codigoDocumento: this.TIPO_DOC.codigo,
            })


            hideLoader();

            if (!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"


            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            let {
                isConfirmed
            } = await swalWithBootstrapButtons.fire({
                title: '<small>Guardar Nota Crédito</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento <b> Nro. ${this.nroDocumentoSecuencial}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })


            if (isConfirmed) {
                showLoader();
                this.saveNotaCredito().then(response => {

                    if (response.id === '0' || response.code === '0') {
                        hideLoader();
                        this._fS.sweetAlert('warning', response.message, response.titleSms);
                    }

                    if (response.id == "1" || response.code == "1") {
                        hideLoader();
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);

                        this.$uibModalInstance.close(response)
                    }
                }).catch(error => {
                    hideLoader();
                    console.error(error)
                })
            }
        } catch (error) {
            hideLoader()
            console.log(error)
        }
    }

}




export class ModalNotaCreditoEditarCtrl extends ModalNotaCreditoCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params) {
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

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  ng-click="grid.appScope.$ctrl.openModalArticleEdit(row.entity)" style="cursor:pointer;" class="btn btn-success btn-xs text-white" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                                                            
                        `;

        this.CAMPOS = ["codEstab", "ptoEmision", "nroDocumento", "nroAutho", "fechaEmision", "idProveedor", "idFactura", "gridOptions", "gridOptionsBodega"];

        let {
            TIPO_REGISTRO,
            data
        } = _params;
        let {
            dataDocumento,
            factura,
            proveedor,
            detalleDocumento
        } = data;
        this.dataDocumento = dataDocumento;
        this.factura = factura;

        this.proveedor = proveedor;
        this.detalleDocumento = detalleDocumento;

        this.TIPO_REGISTRO = TIPO_REGISTRO;
    }

    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {
                UiGridOptionsCompra
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.codEstab === this.dataDocumento.codEstab)

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]

            } else {
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.decimal = resultsDataForm[1][0]
            this.tipoIvas = resultsDataForm[2];


            this.setColumnDefs();

            this.uiGridInvoice = new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })

            this.data = Object.assign({}, this.dataDocumento);
            // this.nroDocumentoSecuencial = this.data.puntoEmision + '-'+ this.data.nroDocumento.toString()
            this.gridOptions.data = this.detalleDocumento;


            this.deleteColumnIce();

            this.$scope.$apply();

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }


    async onSave() {
        try {

            let textAccion = 'Actualizar';

            if (!this.isValidaForm(textAccion)) return



            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            let {
                isConfirmed
            } = await swalWithBootstrapButtons.fire({
                title: '<small>Actualizar Nota Crédito</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento ahora</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si, ${textAccion}`,
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })


            if (isConfirmed) {
                showLoader();
                this.saveNotaCredito(this.data.idNotaCreditoProveedor).then(response => {

                    if (response.id === '0' || response.code === '0') {
                        hideLoader();
                        this._fS.sweetAlert('warning', response.message, response.titleSms);
                    }

                    if (response.id == "1" || response.code == "1") {
                        hideLoader();
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);

                        this.$uibModalInstance.close(response)
                    }
                }).catch(error => {
                    hideLoader();
                    console.error(error)
                })
            }
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }


}



export class ModalNotaCreditoDetalleCtrl extends ModalNotaCreditoCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params) {
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

        this.CELL_TEMPLATE_OPTION = `<a   style="cursor:pointer;" class="btn btn-danger btn-xs text-white disabled" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                           <a  style="cursor:pointer;" class="btn btn-success btn-xs text-white disabled" title = "Editar Articulo" ><i class="fa fa-edit"></i></a >                                  
                           <a  ng-click="grid.appScope.$ctrl.abrirModalDatoAdicional(row.entity)" style="cursor:pointer;" ng-show='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar Dato Adicional al Articulo" > <i class="fas fa-tags"></i></a >                                  
                        `;


        let {
            TIPO_REGISTRO,
            data
        } = _params;
        let {
            dataDocumento,
            factura,
            proveedor,
            detalleDocumento
        } = data;
        this.dataDocumento = dataDocumento;
        this.factura = factura;

        this.proveedor = proveedor;
        this.detalleDocumento = detalleDocumento;


        this.TIPO_REGISTRO = TIPO_REGISTRO;
    }

    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {
                UiGridOptionsCompra
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.codEstab === this.dataDocumento.codEstab)

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                this.actividadTipoIva = resultsDataFormEstab[2][0]

            } else {
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }

            this.decimal = resultsDataForm[1][0]
            this.tipoIvas = resultsDataForm[2];


            this.setColumnDefsView();

            this.uiGridInvoice = new UiGridOptionsCompra({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })

            this.data = Object.assign({}, this.dataDocumento);
            // this.nroDocumentoSecuencial = this.data.puntoEmision + '-'+ this.data.nroDocumento.toString()
            this.gridOptions.data = this.detalleDocumento;


            this.deleteColumnIce();

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
                id: this.data.idIngresoBodega,
                codEstab: this.data.codEstab,
                codigo: 'RCD',
                codDoc: this.TIPO_DOC.codigo,
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