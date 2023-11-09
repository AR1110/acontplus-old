import {
    ModalBaseCtrl
} from "./modalBaseCtrl.min.js?v=0.90";


class ModalProformaCtrl extends ModalBaseCtrl {
    constructor({
        $scope,
        $timeout,
        $uibModalInstance,
        _mS,
        _commonSvc,
        _modalSvc,
        _nombreModalConst,
        _fS,
        _tS
    }) {
        super({
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _tS,
        })
        const self = this;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this._fS = _fS;

        this.TIPO_DOC_PR = _commonSvc.tipoDoc['PR']
        this.CAMPOS = ["idSucursal", "idPuntoEmision", "fechaEmision", "gridOptions", "gridOptionsBodega"];

        this.datosAdicionalesArticulo = [];
        this.cliente = {};

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


                    if (self.isSearchBarcode == 1) {
                        self.setFocusInputBarcode();
                    } else {
                        self.setFocusArticulo();
                    }

                    $scope.gridApi.grid.cellNav.clearFocus();
                    // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit(self.$scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }

                //Validacion de numeros negativos
                if (['cantidad', 'precioUnitario', 'precioConIva', 'valorDescuento', 'porcentajeDescuento'].includes(colDef.field) && newValue < 0) {

                    rowEntity[colDef.field] = oldValue;
                }

                if (colDef.field === 'cantidad' && rowEntity[colDef.field] === 0) {
                    rowEntity[colDef.field] = 1;
                }

                const objCalculo = self.uiGridInvoice.calculoColDef(rowEntity, oldValue)
                objCalculo[colDef.field] && objCalculo[colDef.field]();
                objCalculo["calculoTotalDetalle"]();
                self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

            })
        }
    }

    initiload() {
        return this._mS.getData('get', 'Venta/Proforma/' + 'Get?json=' + JSON.stringify({ tipo: 2 }), null, true).then(response => {
            if (response.code === "0") {
                throw response;
            }

            if (response.code === "1") {
                let mainData = JSON.parse(response.payload);
                return mainData;
            }
        })
    }


    onKeyupCustomer() {
        if (!this.cliente.nombreFiscal) {
            console.log(this.cliente)
            this.cliente = {};
        }

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

        this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
        this.counterGridOptions();
        this.$scope.$apply();
    }


    async setItemArticuloEnDetalle(dataArticulo) {
        try {
            const self = this;

            this.dataArticulo = dataArticulo;

            const {
                articulo,
                medidas,
                datosAdicionales
            } = self.dataArticulo;

            let index = 0; 
            let findIndexById = this.gridOptions.data.findIndex(item => item.llevaInventario && item.idArticulo === articulo.idArticulo);

            if (findIndexById === -1) {
                self.addRow();
                index = this.gridOptions.data.findIndex(value => value.idArticulo === 0);
            } else {
                index = findIndexById
            }  
            // if ([null, undefined].includes(this.indexRow)) {
            //     self.addRow();
            //     index = this.gridOptions.data.findIndex(value => value.idArticulo === 0);
            // } else {
            //     index = this.indexRow;
            // }

            let entity = self.gridOptions.data[index];

            let dataMedida = medidas[0];



            entity.idArticulo = articulo.idArticulo;
            entity.codigo = articulo.codigoArticulo;
            entity.descripcion = articulo.descripcion;
            entity.idTipoIva = articulo.idTipoIva;
            entity.codigoPorcentaje = articulo.codigoPorcentaje;
            entity.tarifa = articulo.tarifa;
            // entity.nombreTipoIva        = articulo.nombreTipoIva;
            entity.ice = articulo.valorIce;
            entity.idBodega = self.idBodega ? self.idBodega : 0;
            entity.llevaInventario = articulo.llevaInventario;
            entity.datosAdicionales = articulo.datosAdicionales;
            entity.productoFraccionable = articulo.productoFraccionable;
            entity.medidas = medidas; //Lista Medida 
            entity.idMedida = dataMedida.idMedida; //Medida por defecto 
            entity.adicional = datosAdicionales; //


            entity.articuloTarifas = JSON.parse(dataMedida.tarifas);
            let tarifa = entity.articuloTarifas.find(item => item.idTarifa === self.idTarifa);
            entity.idTarifa = self.idTarifa;
            entity.precioUnitario = self._fS.roundNumber(tarifa.precioVenta, self.decimal.nroPrecio);
            entity.precioConIva = self._fS.roundNumber(tarifa.precioConIva, self.decimal.nroPrecio);


            //Datos Adicionales 
            entity.cantMinimaVentaPorMayor = articulo.cantMinimaVentaPorMayor

            const objCalculo = self.uiGridInvoice.calculoColDef(entity, 0);

            objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();

            objCalculo["calculoTotalDetalle"]();

            self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

            this.indexRow = index;
            this.focusColumnCantidad();
            this.counterGridOptions();

        } catch (error) {
            console.log(error)
        }
    }

    counterGridOptions() {
        angular.forEach(this.gridOptions.data, (item, index) => {
            item.n = index + 1;
        })

    }





    calcularPorcentajeDescuento() {
        if (!this.ventaComprobantePermission.porcentajeDescuento.update) {
            this.data.porcentajeDescuento = 0;
            this._tS.toastr('warning', 'No tienes permiso para realizar esta acción');
            return
        }

        let valor = this.data.porcentajeDescuento || 0;
        this.data.porcentajeDescuento = Number(valor);
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
            if (!this.ventaComprobantePermission.descuento.update) {
                this.data.descuento = 0;
                this._tS.toastr('warning', 'No tienes permiso para realizar esta acción');
                return
            }

            let valor = this.data.totalDescuento || 0;
            this.data.totalDescuento = Number(valor)

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

    recalculateImpuestoTarifa() {
        try {
            this.uiGridInvoice.actividadTipoIva = this.impuestoTarifas.find(item => item.tarifa === this.data.tarifa);
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
        } catch (error) {
            console.log(error);
        }
    }

}



export class ModalProformaNuevoCtrl extends ModalProformaCtrl {
    static $inject = [
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'storageService',
        'mainService',
        'commonService',
        'proformaService',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'params',
        'articuloService'
    ]

    constructor(
        $scope,
        $timeout,
        $uibModalInstance,
        _storageSvc,
        _mS,
        _commonSvc,
        proformaSvc,
        _modalSvc,
        _nombreModalConst,
        _fS,
        _tS,
        _params,
        articuloSvc
    ) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _fS,
            _tS
        })
        const self = this;
        this._storageSvc = _storageSvc;
        this.proformaSvc = proformaSvc;
        this.articuloSvc = articuloSvc;

        let {
            TIPO_REGISTRO
        } = _params;
        this.TIPO_REGISTRO = TIPO_REGISTRO;

        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a  update-article ng-click="grid.appScope.$ctrl.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >`;
    }

    async $onInit() {
        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {
                UiGridOptions
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());
            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos[0];
                let resultsDataFormEstab = await this._commonSvc.getDataFormEstabAsig(dataEstab);

                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;
                this.puntosEmisiones = resultsDataFormEstab[0];
                this.data.idPuntoEmision = this.puntosEmisiones.length > 0 ? this.puntosEmisiones[0].idPuntoEmision : 0;

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                // this.actividadTipoIva = resultsDataFormEstab[2][0];
                this.impuestoTarifas = resultsDataFormEstab[2]; //Impuesto tarifas dependiendo el tipo Actividad
                this.actividadTipoIva = resultsDataFormEstab[2][0];
                this.data.tarifa = this.actividadTipoIva.tarifa;

            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }


            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas = resultsDataForm[4];

            this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];
            this.data.idTiempoCredito = this.tiempoCreditos.length > 0 ? this.tiempoCreditos[0].idTiempoCredito : 0;

            //6 articulo 
            //7 cliente 

            if (resultsDataForm[8].length > 0) {
                let { searchCode, multipleVendedor } = resultsDataForm[8][0];
                this.isSearchBarcode = searchCode;
                this.multipleVendedor = multipleVendedor;

                this.$uibModalInstance.rendered.then(result => {
                    if (this.isSearchBarcode == 1) {
                        $("#inputBarcode").focus();
                    } else {
                        $("#custom-template-md-autocomplete-articulo").focus();
                    }
                })
            }

            //Permisos             
            let userPermission = resultsDataForm[9];
            this.ventaPermission = JSON.parse(userPermission[0].jsonPermission);

            this.ventaComprobantePermission = Object.freeze(this.ventaPermission.comprobante);
            this.ventaDetailPermission = Object.freeze(this.ventaPermission.detail);

            this.usuariosVendedor = resultsDataForm[11];
            if (this.usuariosVendedor.length > 0) {
                this.data.idUsuario = this.usuariosVendedor.find(item => (item.predeterminado)).idUsuario
            } else {
                this.data.idUsuario = 0;
            }

            this.data.fechaEmision = new Date();

            this.setColumnDefs();

            this.uiGridInvoice = new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva,
                codigoDoc: 'PR',
                idBodega: this.idBodega,
                parentScope: this
            })

            this.uiGridInvoice.idTarifa = this.idTarifa;


            if (Object.keys(this._storageSvc.getObject("proformaDetail")).length > 0) {
                this._storageSvc.restoreInvoiceDetail("proformaDetail").then(result => {
                    if (result.isConfirmed) {
                        this.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value]);
                        delete result.dataInvoiceDetail[result.value];

                        this._storageSvc.setObject("proformaDetail", result.dataInvoiceDetail)

                        this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
                    }

                })
            }

            this.$scope.$apply();

        } catch (error) {

            console.error(error)

        } finally {

            hideLoader();
        }
    }

    receiveDataCustomerSRI(result) {
        if (result.idCliente === 0) {
            this.newCustomer = true;
        } else {
            this.newCustomer = false;
        }
        this.cliente = result;
    }

    async onSelectedClienteChange(item) {
        try {

            let dataCliente = await this.getClienteById(item);
            this.cliente = dataCliente;
            this.data.idTiempoCredito = this.cliente.idTiempoCredito;
            this.$scope.$apply();
        } catch (error) {
            this.cliente = {};
            console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            this.$scope.$apply();
        }
    }

    async onSave() {
        try {


            if (!this.isValidaForm()) return

            if (this.gridOptions.data.some(item => item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor))) {
                for (let item of this.gridOptions.data) {
                    if (item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor)) {
                        this._fS.sweetAlert('warning', `Artículo ${item.descripcion}: La cantidad mínima requerida para la venta al por mayor no se ajusta a la cantidad asignada al artículo.`)
                    }
                }
                return
            }

            // if(this.cliente.numeroIdentificacion === this.NUM_CONSUMIDOR_FINAL && this.data.total>50 ){
            //     this._fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>')           
            //     return
            // }

            showLoader();

            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoVenta({
                idPuntoEmision: this.data.idPuntoEmision,
                codigoDocumento: this.TIPO_DOC_PR.codigo,
            })
            hideLoader();

            if (!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"

            let textAccion = 'Guardar';
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
                title: '<small>Guardar Proforma</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento <b>N° ${this.nroDocumentoSecuencial}</b></small>?`,
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
                this.data.tarifa = this.actividadTipoIva.tarifa;

                let query = this.proformaSvc.queryMapper({
                    data: this.data,
                    cliente: this.cliente,
                    detalles: this.gridOptions.data
                })
                this.proformaSvc.save(query).then(response => {
                    hideLoader();
                    if (response.code === '0') {
                        this._fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);

                        this.$uibModalInstance.close(response)
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }
        } catch (error) {
            hideLoader();
            console.log(error)

        }
    }



    async closeModal() {

        if (this.gridOptions.data.length > 0) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    denyButton: 'btn btn-info ml-2',
                    cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
                title: 'Salir ?',
                html: "<small>Tienes un documento en proceso, desea salir ahora?</small>",
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonText: 'Apartar',
                denyButtonText: 'Si, salir',
                cancelButtonText: 'No, cancelar!',
                focusDeny: true,
                reverseButtons: false
            }).then(result => {

                if (result.isConfirmed) {
                    this.askToSaveStorage();
                }

                if (result.isDenied) {
                    this.$uibModalInstance.close();
                }

            })
            return
        }
        this.$uibModalInstance.close();
    }


    async askToSaveStorage() {
        try {
            await this._storageSvc.askToSaveDetailDoc("proformaDetail", this.gridOptions.data);
            this.$uibModalInstance.close();
        } catch (error) {
            console.log(error)
        }
    }


}


export class ModalProformaDetalleCtrl extends ModalProformaCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'modalService', 'nombreModal', 'formulario', 'toastService', 'params', 'articuloService']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModalConst, _fS, _tS, _params, articuloSvc) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _fS,
            _tS
        })
        const self = this;
        this.articuloSvc = articuloSvc;
        this.CELL_TEMPLATE_OPTION = `
        <a  ng-click="grid.appScope.$ctrl.openModalDatoAdicionalArticle(row.entity)" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' class= "btn btn-info btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`;


        this.gridOptions = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }

        let {
            dataDocumento,
            cliente,
            detalleDocumento,
            infoAdicionalDocumento,
            actividadTipoIva
        } = _params.data;
        this.dataDocumento = dataDocumento;
        this.cliente = cliente;
        this.detalleDocumento = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;
        this.actividadTipoIva = actividadTipoIva
    }

    async $onInit() {
        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {
                UiGridOptions
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.codEstab === this.dataDocumento.codEstab)

                let resultsDataFormEstab = await this._commonSvc.getDataFormEstabAsig(dataEstab);
                this.puntosEmisiones = resultsDataFormEstab[0];

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }


            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas = resultsDataForm[4];

            this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];

            this.setColumnDefsVista();

            this.uiGridInvoice = new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva,
                codigoDoc: 'PR',
                idBodega: this.idBodega,
                parentScope: this
            })
            this.uiGridInvoice.idTarifa = this.idTarifa;

            //Cargamos los Datos 
            this.data = this.dataDocumento;
            this.nroDocSecuencial = this.data.nroDocSecuencial;
            this.gridOptions.data = this.detalleDocumento;

            this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);
            this.$scope.$apply();

        } catch (error) {

            console.log(error)

        } finally {

            hideLoader();
        }
    }
}


export class ModalProformaEditarCtrl extends ModalProformaCtrl {

    static $inject = [
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'mainService',
        'commonService',
        'proformaService',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'params',
        'articuloService'
    ]

    constructor(
        $scope,
        $timeout,
        $uibModalInstance,
        _mS,
        _commonSvc,
        proformaSvc,
        _modalSvc,
        _nombreModalConst,
        _fS,
        _tS,
        _params,
        articuloSvc
    ) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _fS,
            _tS
        })
        const self = this;

        this.proformaSvc = proformaSvc;
        this.articuloSvc = articuloSvc;

        let {
            TIPO_REGISTRO,
            data
        } = _params;
        this.TIPO_REGISTRO = TIPO_REGISTRO;
        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a  update-article  ng-click="grid.appScope.$ctrl.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >`;

        let {
            dataDocumento,
            cliente,
            detalleDocumento,
            infoAdicionalDocumento,
            actividadTipoIva
        } = data;
        this.dataDocumento = dataDocumento;
        this.cliente = cliente;
        this.detalleDocumento = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;
        this.actividadTipoIva = actividadTipoIva;

        this.data.tarifa = this.actividadTipoIva.tarifa;

    }

    async $onInit() {
        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {
                UiGridOptions
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.codEstab === this.dataDocumento.codEstab)

                let resultsDataFormEstab = await this._commonSvc.getDataFormEstabAsig(dataEstab);
                this.puntosEmisiones = resultsDataFormEstab[0];

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                this.impuestoTarifas = resultsDataFormEstab[2]; //Impuesto tarifas dependiendo el tipo Actividad             
            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }


            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas = resultsDataForm[4];

            this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];

            if (resultsDataForm[8].length > 0) {
                this.isSearchBarcode = resultsDataForm[8][0].searchCode || false;

                this.$uibModalInstance.rendered.then(result => {
                    if (this.isSearchBarcode == 1) {
                        $("#inputBarcode").focus();
                    } else {
                        $("#custom-template-md-autocomplete-articulo").focus();
                    }
                })
            }

            //Permisos             
            let userPermission = resultsDataForm[9];
            this.ventaPermission = JSON.parse(userPermission[0].jsonPermission);

            this.ventaComprobantePermission = Object.freeze(this.ventaPermission.comprobante);
            this.ventaDetailPermission = Object.freeze(this.ventaPermission.detail);


            this.setColumnDefs();

            this.uiGridInvoice = new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva,
                codigoDoc: 'PR',
                idBodega: this.idBodega,
                parentScope: this
            })

            this.uiGridInvoice.idTarifa = this.idTarifa;

            //Cargamos los Datos 
            this.data = this.dataDocumento;
            this.nroDocSecuencial = this.data.nroDocSecuencial;
            this.gridOptions.data = this.detalleDocumento;

            this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);

            this.$scope.$apply();

        } catch (error) {

            console.log(error)

        } finally {

            hideLoader();
        }
    }

    async onSelectedClienteChange(item) {
        try {

            let dataCliente = await this.getClienteById(item);
            this.cliente = dataCliente;
            this.$scope.$apply();

        } catch (error) {
            this.cliente = {};
            console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            this.$scope.$apply();
        }
    }

    async onSave() {
        try {
            if (!this.isValidaForm()) return

            if (this.gridOptions.data.some(item => item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor))) {
                for (let item of this.gridOptions.data) {
                    if (item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor)) {
                        this._fS.sweetAlert('warning', `Artículo ${item.descripcion}: La cantidad mínima requerida para la venta al por mayor no se ajusta a la cantidad asignada al artículo.`)
                    }
                }
                return
            }

            // if(this.cliente.numeroIdentificacion === this.NUM_CONSUMIDOR_FINAL && this.data.total>50 ){
            //     this._fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>')           
            //     return
            // }               

            let textAccion = 'Actualizar';
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
                title: `<small>Actualizar ${this.TIPO_DOC_PR.descripcion}</small>`,
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento<b>N° ${this.nroDocSecuencial}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, actualizar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })


            if (isConfirmed) {

                showLoader();
                let query = this.proformaSvc.queryMapper({
                    data: this.data,
                    cliente: this.cliente,
                    detalles: this.gridOptions.data
                })
                this.proformaSvc.update(this.data.idProforma, query).then(response => {
                    hideLoader();
                    if (response.code === "0") {
                        this._fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        hideLoader();
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        this.isUpdate = true;
                        this.$uibModalInstance.close(response)
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    closeModal() {
        let obj = this.isUpdate ? {} : undefined;
        this.$uibModalInstance.close(obj);
    }
}


export class ModalProformaDuplicarCtrl extends ModalProformaCtrl {
    static $inject = [
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'mainService',
        'commonService',
        'proformaService',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'params',
        'articuloService'
    ]

    constructor(
        $scope,
        $timeout,
        $uibModalInstance,
        _mS,
        _commonSvc,
        proformaSvc,
        _modalSvc,
        _nombreModalConst,
        _fS,
        _tS,
        _params,
        articuloSvc
    ) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            _fS,
            _tS
        })
        const self = this;

        this.newCustomer = false;

        this.proformaSvc = proformaSvc;
        this.articuloSvc = articuloSvc;

        let {
            TIPO_REGISTRO,
            data
        } = _params;
        this.TIPO_REGISTRO = TIPO_REGISTRO;
        this.CELL_TEMPLATE_OPTION = `<a  ng-click="grid.appScope.$ctrl.deleteRow(row.entity)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>

        <a  update-article ng-click="grid.appScope.$ctrl.openModalArticle(row.entity)" id="btnEditArticuloDetalle" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >`;

        let {
            dataDocumento,
            cliente,
            detalleDocumento,
            infoAdicionalDocumento
        } = data;
        this.dataDocumento = dataDocumento;
        this.cliente = cliente;
        this.detalleDocumento = detalleDocumento;
        this.infoAdicionalDocumento = infoAdicionalDocumento;
    }

    async $onInit() {
        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            let {
                UiGridOptions
            } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION());

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.codEstab === this.dataDocumento.codEstab)

                let resultsDataFormEstab = await this._commonSvc.getDataFormEstabAsig(dataEstab);
                this.puntosEmisiones = resultsDataFormEstab[0];

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                this.impuestoTarifas = resultsDataFormEstab[2]; //Impuesto tarifas dependiendo el tipo Actividad
                this.actividadTipoIva = resultsDataFormEstab[2][0];
                this.data.tarifa = this.actividadTipoIva.tarifa;

            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }


            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas = resultsDataForm[4];

            this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];

            if (resultsDataForm[8].length > 0) {
                let { searchCode, multipleVendedor } = resultsDataForm[8][0];
                this.isSearchBarcode = searchCode;
                this.multipleVendedor = multipleVendedor;

                this.$uibModalInstance.rendered.then(result => {
                    if (this.isSearchBarcode == 1) {
                        $("#inputBarcode").focus();
                    } else {
                        $("#custom-template-md-autocomplete-articulo").focus();
                    }
                })
            }

            //Permisos             
            let userPermission = resultsDataForm[9];
            this.ventaPermission = JSON.parse(userPermission[0].jsonPermission);

            this.ventaComprobantePermission = Object.freeze(this.ventaPermission.comprobante);
            this.ventaDetailPermission = Object.freeze(this.ventaPermission.detail);

            this.usuariosVendedor = resultsDataForm[11] || [];

            this.setColumnDefs();

            this.uiGridInvoice = new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptions,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva,
                codigoDoc: 'PR',
                idBodega: this.idBodega,
                parentScope: this
            })

            this.uiGridInvoice.idTarifa = this.idTarifa;

            //Cargamos los Datos 
            this.data = this.dataDocumento;
            this.data.fechaEmision = new Date();
            this.nroDocSecuencial = this.data.nroDocSecuencial;
            this.cloneCodEstab = this.data.codEstab;

            this.gridOptions.data = this.detalleDocumento;

            if (this.usuariosVendedor.length > 0) {
                this.data.idUsuario = this.usuariosVendedor.find(item => (item.predeterminado)).idUsuario
            } else {
                this.data.idUsuario = 0;
            }

            this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);

            this.$scope.$apply();

        } catch (error) {

            console.log(error)

        } finally {

            hideLoader();
        }
    }

    receiveDataCustomerSRI(result) {
        if (result.idCliente === 0) {
            this.newCustomer = true;
        } else {
            this.newCustomer = false;
        }
        this.cliente = result;
    }

    async onSelectedClienteChange(item) {
        try {

            let dataCliente = await this.getClienteById(item);
            this.cliente = dataCliente;
            this.data.idTiempoCredito = this.cliente.idTiempoCredito;
            this.$scope.$apply();

        } catch (error) {
            this.cliente = {};
            console.log('ERROR AL OBTENER DATOS DEL CLIENTE', error)
            this.$scope.$apply();
        }
    }

    async onSave() {
        try {
            showLoader();

            if (!this.isValidaForm()) return

            if (this.gridOptions.data.some(item => item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor))) {
                for (let item of this.gridOptions.data) {
                    if (item.articuloTarifas.some(ta => (ta.ventaPorMayor) && item.cantidad < item.cantMinimaVentaPorMayor)) {
                        this._fS.sweetAlert('warning', `Artículo ${item.descripcion}: La cantidad mínima requerida para la venta al por mayor no se ajusta a la cantidad asignada al artículo.`)
                    }
                }
                return
            }

            // if(this.cliente.numeroIdentificacion === this.NUM_CONSUMIDOR_FINAL && this.data.total>50 ){
            //     this._fS.sweetAlert('warning', 'La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b>')           
            //     return
            // }

            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoVenta({
                idPuntoEmision: this.data.idPuntoEmision,
                codigoDocumento: this.TIPO_DOC_PR.codigo,
            })
            hideLoader();

            if (!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE"

            let textAccion = 'Guardar';
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
                title: '<small>Guardar Proforma</small>',
                html: `<small>Esta Ud. seguro de ${textAccion} este Documento N°. <b>${this.nroDocumentoSecuencial}</b></small>?`,
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

                let query = this.proformaSvc.queryMapper({
                    data: this.data,
                    cliente: this.cliente,
                    detalles: this.gridOptions.data
                })


                this.proformaSvc.save(query).then(response => {
                    hideLoader();
                    if (response.code === '0') {
                        this._fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.code === '1') {
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        this.$uibModalInstance.close(response)
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
            }

        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }


}



export class ModalProformaFiltroCtrl extends ModalProformaCtrl {

    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'formulario', 'toastService', 'params', 'decodeToken']

    constructor($scope, $uibModalInstance, _mS, _commonSvc, _fS, _tS, _params, decodeToken) {
        super({
            _mS,
            _commonSvc,
            _tS
        })

        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._fS = _fS;

        let {
            dataSearch,
            clienteFiltro,
            usuarioSearchFiltro,
            mes
        } = _params;

        this.dataSearch = dataSearch || {};
        this.clienteFiltro = clienteFiltro || {}
        this.usuarioSearchFiltro = usuarioSearchFiltro || {};

        this.meses = this._fS.meses();
        this.mes = mes;


        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    }

    async $onInit() {
        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            this.estadoDocumentos = await this._commonSvc.getEstadoDocByCodDoc('NE');

            this.establecimientos = resultsDataForm[0];
            // this.dataSearch.codEstab = this.establecimientos.length>0? this.establecimientos[0].codEstab: 0;

            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    onKeyupClienteSearchFiltro() {
        if (!this.clienteFiltro.nombreFiscal) {
            this.clienteFiltro = {};
            this.dataSearch.byCliente = 0;
        }
    }

    selectedClienteSearchFiltro(item) {
        this.clienteFiltro.nombreFiscal = item.nombreFiscal;
        this.dataSearch.byCliente = item.idCliente;
    }

    //---------------Fecha------------
    onChangeFechaFiltro() {
        this.mes = new Date().getMonth() + 1;
        this.dataSearch.tipoFecha = 'FE' //Por Defecto por fecha Emisión de la Factura Venta 
        this.getFechaInicioFinFilter(this.mes)
    }

    getFechaInicioFinFilter(mes) {
        let {
            fechaInicio,
            fechaFin
        } = this._fS.getFechaInicioFinFilter(mes);
        this.dataSearch.fechaInicio = fechaInicio;
        this.dataSearch.fechaFin = fechaFin;
    }


    //---------------Usuario--------------------    
    usuarioSearchDynamic(textSearch) {
        return this._commonSvc.usuarioSearch({
            idRol: this.idUsuarioRol,
            busqueda: textSearch
        })
    }

    onKeyupUsuarioSearchFiltro() {
        if (!this.usuarioSearchFiltro.nombreCompleto) {
            this.usuarioSearchFiltro = {};
            this.dataSearch.byUsuario = 0;
        }
    }

    selectedUsuarioSearchFiltro(item) {
        this.usuarioSearchFiltro.nombreCompleto = item.nombreCompleto;
        this.dataSearch.byUsuario = item.idUsuario;
    }



    getSearch() {
        let titutoToast = "Búsqueda";
        if (!this.dataSearch.codEstab || this.dataSearch.codEstab === 0) {
            this._tS.toastr('warning', 'Por favor seleccione una Sucursal', titutoToast);
            return;
        }

        if (this.dataSearch.checkBoxCliente) {
            if (!this.dataSearch.byCliente || this.dataSearch.byCliente === 0) {
                this._tS.toastr('warning', 'Seleccione el Cliente', titutoToast);
                return;
            }
        }

        if (this.dataSearch.checkBoxUsuario) {
            if (!this.dataSearch.byUsuario || this.dataSearch.byUsuario === 0) {
                this._tS.toastr('warning', '   Ingrese el Usuario', titutoToast);
                return
            }
        }


        if (this.dataSearch.checkBoxEstado) {
            if (!this.dataSearch.byEstado || this.dataSearch.byEstado === 0) {
                this._tS.toastr('warning', 'Por favor seleccione el Estado', titutoToast);
                return
            }
        }

        if (this.dataSearch.checkBoxFecha) {
            if (!this.dataSearch.fechaInicio) {
                this._tS.toastr('warning', 'Ingrese la Fecha Inicio', titutoToast);
                return
            }


            if (!moment(this.dataSearch.fechaInicio).isValid()) {
                console.log('Invalid Date');
            }

            if (!this.dataSearch.fechaInicio instanceof Date && !isNaN(this.dataSearch.fechaInicio)) {
                this._tS.toastr('warning', 'Ingrese una Fecha Válida');
                return
            }

            if (!this.dataSearch.fechaFin) {
                this._tS.toastr('warning', 'Ingrese la Fecha Fin');
                return
            }

            if (!this.dataSearch.fechaFin instanceof Date && !isNaN(this.dataSearch.fechaFin)) {
                this._tS.toastr('warning', 'Ingrese una Fecha Válida');
                return
            }

            if (!(Date.parse(this.dataSearch.fechaInicio) <= Date.parse(this.dataSearch.fechaFin))) {
                this._tS.toastr('warning', 'Fecha Fin no puede se menor a Fecha Inicio');
                return
            }
        }



        this.$uibModalInstance.close({
            dataSearch: this.dataSearch,
            clienteFiltro: this.clienteFiltro,
            usuarioSearchFiltro: this.usuarioSearchFiltro,
            mes: this.mes,
            isSearch: true
        });
    }

    closeModal() {
        this.$uibModalInstance.close({
            dataSearch: this.dataSearch,
            clienteFiltro: this.clienteFiltro,
            usuarioSearchFiltro: this.usuarioSearchFiltro,
            mes: this.mes,
            isSearch: false
        });
    }
}