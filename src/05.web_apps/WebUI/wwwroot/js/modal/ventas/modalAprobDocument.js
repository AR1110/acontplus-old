let UiGridOptions = {};
async function loadImport() {
    ({
        UiGridOptions
    } = await import('./../factElect/uiGridOptions.min.js' + CHANGE_VERSION()));
}
loadImport();


class ModalBaseCtrl {
    /**
     * 
     * @param {Object} _commonSvc 
     * @param {String} codDoc 
     */
    constructor(_commonSvc) {
        this._commonSvc = _commonSvc;
        this.data = {};
    }

    static set setCodDocTipoDoc(codDoc) {
        this.tipoDoc = Object.freeze(this._commonSvc.tipoDoc[codDoc]);
    }

    async initiload() {
        return this._mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response => {
            if (response.code === '0') {
                throw response
            }
            return JSON.parse(response.payload)
        })
    }

    getDataFormEstabAsig(json = {}) {
        return this._mS.getData('get', '/EstabAsig/GetDataForm?json=' + JSON.stringify(json)).then(response => {
            if (response.code === '0') {
                throw response
            }
            return JSON.parse(response.payload)
        })
    }



    clienteSearchDynamic(textSearch) {
        return this._commonSvc.clienteSearch(textSearch)
    }

    onKeyupClienteSearchFiltro() {
        if (!this.clienteFiltro.nombreFiscal) {
            this.clienteFiltro = {};
            this.dataSearch.byCliente = 0;
        }
    }

    selectedClienteSearchFiltro(item) {
        this.clienteFiltro = item;
        this.dataSearch.byCliente = item.idCliente;
    }


    onChangeFecha() {
        this.dataSearch.tipoFecha = 'FE'
        this.dataSearch.mes = new Date().getMonth() + 1;
        if (this.dataSearch.checkBoxFecha) {
            this.getFechaInicioFinFilter(this.dataSearch.mes)
        }
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Buscador AVanzado
    getFechaInicioFinFilter(mes) {
        let {
            fechaInicio,
            fechaFin
        } = this._form.getFechaInicioFinFilter(mes);
        this.dataSearch.fechaInicio = fechaInicio;
        this.dataSearch.fechaFin = fechaFin;
    }







    async onChangeEstablecimiento() {
        try {

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
                title: '<small>Cambiar Establecimiento?</small>',
                html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, cambiar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            if (!isConfirmed) {
                this.data.codEstab = this.cloneCodEstab;
                this.$scope.$apply();
                return
            }

            this.cloneCodEstab = this.data.codEstab;

            const dataEstab = this.establecimientos.find(item => item.codEstab === this.data.codEstab);

            //Obtenemos Puntos de Emision y Bodegas 
            let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

            this.puntosEmision = resultsDataFormEstab[0];
            this.data.idPuntoEmision = this.puntosEmision.length > 0 ? this.puntosEmision[0].idPuntoEmision : 0;

            this.bodegas = resultsDataFormEstab[1];
            this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
            this.cloneIdBodega = this.idBodega;

            //Impuesto Tarifas            
            this.impuestoTarifas = resultsDataFormEstab[2]; //Impuesto tarifas dependiendo el tipo Actividad
            this.actividadTipoIva = resultsDataFormEstab[2][0];
            this.data.tarifa = this.actividadTipoIva.tarifa;

            let indexColumn = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idBodega');

            this.gridOptionsDetailDocument.columnDefs[indexColumn].editDropdownOptionsArray = this.bodegas;

            for (let item of this.gridOptionsDetailDocument.data) {
                item.idBodega = this.idBodega;
            }

            //Recalculamos los valos de subtotales 

            this.uiGridInvoice.actividadTipoIva = this.actividadTipoIva;
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            this.$scope.$apply();
        } catch (error) {
            console.trace(error)
        }
    }


    /**
     * 
     * @param {date} fEmision 
     */
    getFechaVencimiento(fEmision) {
        try {
            let fechaEmision = fEmision || this.data.fechaEmision;

            if (!fechaEmision) {
                fechaEmision = new Date();
            }

            let dataCredito = this.tiempoCreditos.find(item => item.idTiempoCredito === this.data.idTiempoCredito);
            let diasCredito = dataCredito && dataCredito.diasCredito || 0

            this.data.fechaEmision = fechaEmision;
            this.data.fechaVencimiento = this._fS.getFechaVencimiento(fechaEmision, diasCredito);

            this.fechaEmisionEscrita = this._fS.getFechaEscrita(fechaEmision);
            this.fechaVencimientoEscrita = this._fS.getFechaEscrita(this.data.fechaVencimiento);

        } catch (error) {
            console.log(error);
        }
    }

    async openModalInfoAdicional(isView) {
        const params = {
            isView,
            infoAdicionalDocumento: this.infoAdicionalDocumento
        }
        const {
            MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL,
            MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML
        } = this._nombreModalConst.common;
        const {
            InfoAdicionalTipoDocCtrl
        } = await import('./../../modal/' + MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL);

        const modalRef = this._modalSvc.openModalCustom({
            controller: InfoAdicionalTipoDocCtrl,
            template: 'Shared/Common/' + MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML,
            params,
            size: 'md'
        })
        modalRef.result.then(infoAdicionalDocumento => {
            this.infoAdicionalDocumento = infoAdicionalDocumento
        })
    }




    //--------------------------------Filtro-----------------------------------
    //---------------Usuario--------------------    
    usuarioSearchDynamic(textSearch) {
        return this._commonSvc.usuarioSearch({
            idRol: this.idUsuarioRol,
            busqueda: textSearch
        })
    }

    onKeyupUsuarioSearchFiltro() {
        if (this.usuarioSearchFiltro.nombreCompleto === '' || this.usuarioSearchFiltro.nombreCompleto === null || this.usuarioSearchFiltro.nombreCompleto === undefined) {
            this.usuarioSearchFiltro = {};
            this.dataSearch.byUsuario = 0;
        }
    }

    selectedUsuarioSearchFiltro(item) {
        this.usuarioSearchFiltro.nombreCompleto = item.nombreCompleto;
        this.dataSearch.byUsuario = item.idUsuario;
    }





    addRow() {
        const obj = {
            idFacturaDetalle: 0,
            n: 1,
            codigo: "",
            idArticulo: 0,
            descripcion: "",
            cantidad: 1,
            nombreMedida: "",
            codigoPorcentaje: "",
            tarifa: 0,
            nombreTipoIva: "",
            articuloTarifas: [],
            idTarifa: 0,
            precioUnitario: 0,
            precioConIva: 0,
            porcentajeDescuento: 0,
            valorDescuento: 0,
            totalDescuento: 0,
            ice: 0,
            idBodega: 0,
            subTotal: 0,
            total: 0,
            nota: "S/N",
            llevaInventario: false,
            datosAdicionales: false
        }
        this.gridOptionsDetailDocument.data.push(obj)
    }


    addItem() {
        const self = this;
        self.addRow();

        const {
            articulo,
            medidas,
            datosAdicionalesArticulo
        } = self.dataArticulo;
        let index = self.gridOptionsDetailDocument.data.findIndex(value => value.idArticulo === 0);
        let entity = self.gridOptionsDetailDocument.data[index];

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
        
        //Datos Adicionales 
        entity.datosAdicionalesArticulo = datosAdicionalesArticulo; //

        entity.articuloTarifas = JSON.parse(dataMedida.tarifas);
        let tarifa = entity.articuloTarifas.find(item => item.idTarifa === self.idTarifa);
        entity.idTarifa = self.idTarifa;
        entity.precioUnitario = self._fS.roundNumber(tarifa.precioVenta, self.decimal.nroPrecio);
        entity.precioConIva = self._fS.roundNumber(tarifa.precioConIva, self.decimal.nroPrecio);


        const objCalculo = self.uiGridInvoice.calculoColDef(entity, 0);

        objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();

        objCalculo["calculoTotalDetalle"]();

        self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

        this.focusColumnCantidad();
    }

    focusColumnCantidad() {
        const self = this;
        let index = self.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'cantidad')
        self.$scope.gridApi.cellNav.scrollToFocus(
            self.gridOptionsDetailDocument.data[0],
            self.gridOptionsDetailDocument.columnDefs[2]
        )

        self.$timeout(() => {
            self.$scope.gridApi.cellNav.scrollToFocus(
                self.gridOptionsDetailDocument.data[self.indexRow],
                self.gridOptionsDetailDocument.columnDefs[index]
            );
        }, 30)
    }

    async askToDeleteArticle(rowEntity) {
        const self = this;
        let isConfirmed = await this.uiGridInvoice.deleteRow(rowEntity.entity);        

        if(isConfirmed) {
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            self.$scope.$apply();
        }

        if (isConfirmed && rowEntity.entity.datosAdicionales) {
            this.datosAdicionalesArticulo = this.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.entity.idArticulo);
            this.historyDatosAdicionales = this.historyDatosAdicionales.filter(val => val.idArticulo !== rowEntity.entity.idArticulo);
        }

        
        
    }


    openModalArticulo(item) {
        const self = this;
        self.$scope.gridApi.cellNav.scrollToFocus(
            self.gridOptionsDetailDocument.data[0],
            self.gridOptionsDetailDocument.columnDefs[2]
        )
        self.$scope.$broadcast("editArticulo", item)
    }


    async setItemArticuloEnDetalle(dataArticulo) {

        try {

            this.dataArticulo = dataArticulo;


            // if(this.dataArticulo.articulo.llevaInventario && this.gridOptionsDetailDocument.data.some(item=>item.idArticulo===this.dataArticulo.articulo.idArticulo)){
            //     this.existArticulo();                              
            // }else{
            // }

            this.addItem();
            this.indexRow = this.gridOptionsDetailDocument.data.findIndex(val => val.idArticulo === this.dataArticulo.articulo.idArticulo);

        } catch (error) {
            console.log(error)
        }
    }


    trimDetailDoc() {
        let tempDetails = [];
        let orderIndex = 1;

        for (let item of this.gridOptionsDetailDocument.data) {
            tempDetails.push({
                orderIndex: orderIndex++,
                idFacturaDetalle: item.idFacturaDetalle || 0,
                idArticulo: item.idArticulo,
                idTarifa: item.idTarifa,
                idBodega: item.idBodega,
                idMedida: item.idMedida,
                idPresentacion: item.idPresentacion || 0,
                idTipoIva: item.idTipoIva,
                tarifa: item.tarifa,
                codigoPorcentaje: item.codigoPorcentaje,
                ice: item.ice,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precioCostoNeto: item.precioCostoNeto,
                precioUnitario: item.precioUnitario,
                precioVenta: item.precioUnitario,
                precioConIva: item.precioConIva,
                valorDescuento: item.valorDescuento,
                precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                porcentajeDescuento: item.porcentajeDescuento,
                total: item.total,
                nota: item.nota,
            })
        }
        return tempDetails;
    }

    resultModalAdicional(result) {
        let {entity, historyDatosAdicionales} = result;
        this.historyDatosAdicionales = historyDatosAdicionales;
    }


    closeModal() {
        this.$uibModalInstance.close();
    }

}



export class ModalApproveDocCtrl extends ModalBaseCtrl {
    static $inject = [
        '$scope', 
        '$timeout', 
        '$uibModalInstance', 
        'uiGridConstants', 
        'mainService', 
        'commonService', 
        'articuloService',
        'facturaService',
        'modalService', 
        'nombreModal', 
        'toastService', 
        'formulario', 
        'params', 
        'decodeToken'
    ];

    constructor(
        $scope, 
        $timeout, 
        $uibModalInstance, 
        uiGridConstants, 
        _mS, 
        _commonSvc, 
        articuloSvc,
        facturaSvc,
        _modalSvc, 
        _nombreModalConst,
        _tS, 
        _fS, 
        _params, 
        decodeToken
    ) {
        super(_commonSvc)
        const self = this;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this.uiGridConstants = uiGridConstants;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this.articuloSvc = articuloSvc;
        this.facturaSvc = facturaSvc;

        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;
        this._fS = _fS;
        this._params = _params;

        this._params = _params;
        let {comprobante, detalle, datosAdicionalesArticulo, infoAdicionalDocumento} = _params;

        this.data = comprobante;
        this.data.fechaEmision = this._fS.formatDate(this.data.fechaEmision)        
       
        this.detalleDocumento = detalle;

        this.datosAdicionalesArticulo = datosAdicionalesArticulo || [];
        this.historyDatosAdicionales = datosAdicionalesArticulo.map(item=>({
            idArticulo: item.idArticulo,
            idInfoAdicional: item.idInfoAdicional,
            selected: true,
        }))

        this.infoAdicionalDocumento = infoAdicionalDocumento;


        this.TIPO_DOC = _commonSvc.tipoDoc[this.data.docOrigen];
        this.TIPO_DOC_FV = _commonSvc.tipoDoc['FV'];

        //GridOptions Invoice 
        this.gridOptionsDetailDocument = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }
        this.gridOptionsDetailDocument.onRegisterApi = function (gridApi) {
            self.$scope.gridApi = gridApi;
            if (self.$scope.gridApi) {
                self.$timeout(() => {
                    self.$scope.gridApi.core.handleWindowResize();
                    self.$scope.gridApi.grid.refresh();
                }, 5);
            }

            gridApi.edit.on.afterCellEdit(self.$scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }

                const objCalculo = self.uiGridInvoice.calculoColDef(rowEntity, oldValue)
                objCalculo[colDef.field] && objCalculo[colDef.field]();
                objCalculo["calculoTotalDetalle"]();
                self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

            })
        }


        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    }

    async $onInit() {
        try {
            showLoader();
            let resultsDataForm = await this.initiload();

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.estab === this.data.estab);

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.puntosEmision = resultsDataFormEstab[0];

                this.data.codEstab = dataEstab.codEstab;
                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;


                this.impuestoTarifas = resultsDataFormEstab[2]; //Impuesto tarifas dependiendo el tipo Actividad                                              
            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }

            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2][0]
            this.tipoIvas = resultsDataForm[3];
            this.tarifas = resultsDataForm[4];

            this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;
            this.cloneIdTarifa = this.idTarifa;

            this.tiempoCreditos = resultsDataForm[5];

            this.actividadTipoIva = this.tipoIvas.find(ti => ti.codigoPorcentaje === this.data.codigoPorcentaje)
            this.data.tarifa = this.actividadTipoIva.tarifa;

             //Permisos             
             let userPermission = resultsDataForm[9];
             this.ventaPermission = JSON.parse(userPermission[0].jsonPermission);
 
             this.ventaComprobantePermission = Object.freeze(this.ventaPermission.comprobante);
             this.ventaDetailPermission = Object.freeze(this.ventaPermission.detail);

            //Cargamos Nombres de las Columnas del Detalle Documento  
            this.setColumnDefs();
            this.convertDetail();

            this.uiGridInvoice = new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptionsDetailDocument,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })

            //Calculo de Subtotales 
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());

            this.cloneCodEstab = this.data.codEstab;
            this.getFechaVencimiento(new Date());
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }


    setColumnDefs() {
        const self = this;

        let defaultPermission = Object.freeze({
            tarifa: {
                update: true
            },
            medida: {
                update: true
            },
            tipoIva: {
                update: true
            },
            porcentajeDescuento: {
                update: true
            },
            descuento: {
                update: true
            },
            precioUnitario: {
                update: true
            },
            precioConIva: {
                update: true
            },
        })

        const ventaDetailPermission = this.ventaDetailPermission || defaultPermission;

        this.gridOptionsDetailDocument.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '100',
                cellTemplate: `
                <button type="button" ng-click="grid.appScope.$ctrl.askToDeleteArticle(row)" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                    <i class="fa fa-trash"></i>
                </button>
                <button type="button" ng-if="articlePermission.editar" class= "btn btn-success btn-xs text-white" ng-click="grid.appScope.$ctrl.openModalArticulo(row.entity)" title = "Editar Articulo" >
                    <i class="fa fa-edit"></i>
                </button > 
                <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.$ctrl.historyDatosAdicionales" result-modal-adicional="grid.appScope.$ctrl.resultModalAdicional(result)" datos-adicionales="grid.appScope.$ctrl.datosAdicionalesArticulo" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`
            },
            {
                name: 'Cód.',
                field: 'codigo',
                width: '8%',
                minWidth: '100',
                enableCellEdit: false,
            },
            {
                name: 'Descripción',
                field: 'descripcion',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: (scope) => scope.row.entity.llevaInventario !== true,
                cellTooltip: (row) => row.entity.descripcion,
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                width: '6%',
                minWidth: '50',
            },
            {
                name: 'Medida',
                field: 'idMedida',
                 enableCellEdit: ventaDetailPermission.medida.update,
                enableCellEditOnFocus: ventaDetailPermission.medida.update,
                allowCellFocus: ventaDetailPermission.medida.update,
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity, colDef) => rowEntity.medidas.map(val => ({
                    id: val.idMedida,
                    value: val.descripcion
                })),
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: ventaDetailPermission.tipoIva.update,
                allowCellFocus: ventaDetailPermission.tipoIva.update,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva.update,
                type: 'number',
                width: '8%',
                minWidth: '100',
                //    visible: config.porcentajeIva
            },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity, colDef) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
                enableCellEdit: ventaDetailPermission.tarifa.update,
                enableCellEditOnFocus: ventaDetailPermission.tarifa.update,
                allowCellFocus: ventaDetailPermission.tarifa.update,
                type: 'number',
                width: '12%',
                minWidth: '100',
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '8%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario.update : true;
                },
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '7%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva.update : true;
                },
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: ventaDetailPermission.porcentajeDescuento.update,
                allowCellFocus: ventaDetailPermission.porcentajeDescuento.update,
                enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento.update,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: self.configDetalle.porcentajeDescuento || false,
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento.update,
                enableCellEditOnFocus: ventaDetailPermission.descuento.update,
                allowCellFocus: ventaDetailPermission.descuento.update,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: self.configDetalle.descuento || false
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: self.configDetalle.totalDescuento || false
            },
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '5%',
                minWidth: '100'
            },
            {
                name: 'Nota',
                field: 'nota',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '15%',
                minWidth: '100'
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                type: 'number',
                width: '11%',
                minWidth: '100'
            },
        ]

        let indexTipoIva = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idTipoIva');
        let indexBodega = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idBodega');
        this.gridOptionsDetailDocument.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        this.gridOptionsDetailDocument.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;
    }

    convertDetail() {
        for (let item of this.detalleDocumento) {
            item.valorDescuento = item.descuento;
            item.ice = 0;
            item.nota = null;
            item.idBodega = this.idBodega;

            let totalDescuento = item.cantidad * item.valorDescuento;
            let subTotal = item.cantidad * item.precioUnitario;


            item.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle)
            item.subTotal = this._fS.roundNumber(subTotal, 5);
            item.total = item.precioTotalSinImpuesto;
            // item.total          = this._fS.roundNumber(item.precioTotalSinImpuesto, this.decimal.nroTotalDetalle);

            let query = {
                idArticulo: item.idArticulo,
            }
            //Obteniendo datos del articulo 
            this.articuloSvc.findForSale(query).then(response => {
                let  {articulo, medidas, datosAdicionalesArticulo} = response;
                item.medidas = medidas;
                item.datosAdicionalesArticulo = datosAdicionalesArticulo;

                let dataMedida = medidas.find(m => m.idMedida === item.idMedida) || {};
                item.articuloTarifas = JSON.parse(dataMedida.tarifas);
            }).catch(err => {
                console.log('error al cargar articulo en el detalle-> modal-aprob-comprobante')
                console.log(err);
            })

            this.gridOptionsDetailDocument.data.push(item);
        }
    }


    async askToDeleteArticle(rowEntity) {
        const self = this;
        let isConfirmed = await this.uiGridInvoice.deleteRow(rowEntity.entity);        

        if(isConfirmed) {
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
            self.$scope.$apply();
        }

        if (isConfirmed && rowEntity.entity.datosAdicionales) {
            this.datosAdicionalesArticulo = this.datosAdicionalesArticulo.filter(val => val.idArticulo !== rowEntity.entity.idArticulo);
            this.historyDatosAdicionales = this.historyDatosAdicionales.filter(val => val.idArticulo !== rowEntity.entity.idArticulo);
        }
       
       
    }


    async askToSaveInvoice() {
        try {

            let textAccion = 'Guardar';
            if (this._fS.campo(this.data.codEstab) || this.data.codEstab === 0) {
                this._tS.toastr('warning', 'Seleccione la Sucursal', textAccion)
                return
            }

            if (this._fS.campo(this.data.idCliente) || this.data.idCliente === 0) {
                this._tS.toastr('warning', 'Seleccione el Cliente', textAccion)
                return
            }

            if (this._fS.campo(this.data.idPuntoEmision) || this.data.idPuntoEmision === 0) {
                this._tS.toastr('warning', 'Seleccione el Punto de Emisión', textAccion)
                return
            }

            if (this._fS.campo(this.data.idTiempoCredito) || this.data.idTiempoCredito === 0) {
                this._tS.toastr('warning', 'Seleccione el Tiempo de Crédito', textAccion)
                return
            }

            if (this._fS.campo(this.data.fechaEmision)) {
                this._tS.toastr('warning', 'Ingrese la Fecha de Emisión', textAccion)
                return
            }

            if (this._fS.campo(this.data.fechaVencimiento)) {
                this._tS.toastr('warning', 'Ingrese la Fecha de Vencimiento', textAccion)
                return
            }

            if (this.data.fechaEmision > this.data.fechaVencimiento) {
                this._tS.toastr('warning', 'Fecha de Vencimiento no puede ser menor a Fecha de Emisión', textAccion)
                return
            }


            if (this.data.identificacionComprador === '9999999999999' && this.data.total > 50) {
                Swal.fire({
                    icon: 'warning',
                    html: `<small>La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del <b>CONSUMIDOR FINAL</b></small>`,
                    confirmButtonText: 'Aceptar'
                })
                return
            }

            if (this.data.total <= 0) {
                this._tS.toastr('warning', 'No se puede generar una factura con valor 0')
                return
            }

            const nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoVenta({
                idPuntoEmision: this.data.idPuntoEmision,
                codigoDocumento: this.TIPO_DOC_FV.codigo,
            })

            if (!nroDocumentoSecuencial) return

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger m-l-5'
                },
                buttonsStyling: false
            })

            const {
                isConfirmed
            } = await swalWithBootstrapButtons.fire({
                html: `<small>Esta Ud. seguro de ${textAccion} esta <b> Factura de Venta</b> N° ${nroDocumentoSecuencial}</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `<small><i class='ti-save'></i> Sí, ${textAccion}!</small>`,
                cancelButtonText: '<small>&times; No, cancelar!</small>',
                reverseButtons: false,
                allowOutsideClick: false,
                focusConfirm: true
            })


            if (isConfirmed) {
                showLoader();
                 //Tarifa Aplicada al Documento
                let factura = Object.assign({}, this.data);
                factura.tarifa = this.uiGridInvoice.actividadTipoIva.tarifa;
                factura.codigoPorcentaje = this.uiGridInvoice.actividadTipoIva.codigoPorcentaje;
                

                let params = this.facturaSvc.queryMapper({
                    data: factura, 
                    cliente: {
                        idCliente: this.data.idCliente
                    },
                    detalles: this.gridOptionsDetailDocument.data, 
                    infoAdicionalDocumento: this.infoAdicionalDocumento,
                    historyDatosAdicionales: this.historyDatosAdicionales
                })
  
                this.facturaSvc.save(params).then(response => {
                    hideLoader();
                    if (response.code === "0") {
                        this._fS.sweetAlert('warning', response.message);
                    }
                    if (response.code === '1') {                   
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        this.$uibModalInstance.close(response);
                    }
                }).catch(error => {
                    hideLoader();
                    console.error(error)
                })
            }
        } catch (error) {
            hideLoader();
            console.trace(error)
        }
    }



}




export class ModalApproveDocEditCtrl extends ModalBaseCtrl {
    static $inject = [
        '$scope', 
        '$timeout', 
        '$uibModalInstance', 
        'uiGridConstants', 
        'mainService', 
        'commonService', 
        'aprobacionDocService',
        'articuloService',
        'modalService', 
        'nombreModal', 
        'toastService', 
        'formulario', 
        'params', 
        'decodeToken'
    ];

    constructor(
        $scope, 
        $timeout, 
        $uibModalInstance, 
        uiGridConstants, 
        _mS, 
        _commonSvc, 
        aprobacionDocSvc,
        articuloSvc,
        _modalSvc, 
        _nombreModalConst, 
        _tS, 
        _fS, 
        _params, 
        decodeToken
    ) {
        super(_commonSvc, 'FV')
        const self = this;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this.uiGridConstants = uiGridConstants;
        this._mS = _mS;

        this.aprobacionDocSvc = aprobacionDocSvc;
        this.articuloSvc = articuloSvc;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;
        this._fS = _fS;

        this._params = _params;
        let {comprobante, detalle, datosAdicionalesArticulo} = _params;

        //Data Params 
        this.data = comprobante;
        this.data.fechaEmision = this._fS.formatDate(this.data.fechaEmision)
        this.detalleDocumento = detalle;

        this.datosAdicionalesArticulo = datosAdicionalesArticulo || [];
        this.historyDatosAdicionales = datosAdicionalesArticulo.map(item=>({
            idArticulo: item.idArticulo,
            idInfoAdicional: item.idInfoAdicional,
            selected: true,
        }))

        this.TIPO_DOC = this._commonSvc.tipoDoc[this.data.docOrigen]

        this.dataDisabled = {
            isDisabledSucursal: true,
            isDisabledPuntoEmision: true
        }

        //GridOptions Invoice 
        this.gridOptionsDetailDocument = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            showGridFooter: false,
        }
        this.gridOptionsDetailDocument.onRegisterApi = function (gridApi) {
            self.$scope.gridApi = gridApi;
            if (self.$scope.gridApi) {
                self.$timeout(() => {
                    self.$scope.gridApi.core.handleWindowResize();
                    self.$scope.gridApi.grid.refresh();
                }, 5);
            }

            gridApi.edit.on.afterCellEdit(self.$scope, (rowEntity, colDef, newValue, oldValue) => {
                //Validar campos
                if ([null, "", undefined].includes(rowEntity[colDef.field])) {
                    rowEntity[colDef.field] = oldValue;
                }

                const objCalculo = self.uiGridInvoice.calculoColDef(rowEntity, oldValue)
                objCalculo[colDef.field] && objCalculo[colDef.field]();
                objCalculo["calculoTotalDetalle"]();
                self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

            })
        }

        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    }

    async $onInit() {

        try {

            showLoader();
            let resultsDataForm = await this.initiload();

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.estab === this.data.estab);

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.data.codEstab = dataEstab.codEstab;
                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                this.impuestoTarifas = resultsDataFormEstab[2];
            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }

            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas = resultsDataForm[4];

            this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;
            this.cloneIdTarifa = this.idTarifa;

            this.actividadTipoIva = this.tipoIvas.find(ti => ti.codigoPorcentaje === this.data.codigoPorcentaje);

            this.data.tarifa = this.actividadTipoIva.tarifa

              //Permisos             
              let userPermission = resultsDataForm[9];
              this.ventaPermission = JSON.parse(userPermission[0].jsonPermission);
  
              this.ventaComprobantePermission = Object.freeze(this.ventaPermission.comprobante);
              this.ventaDetailPermission = Object.freeze(this.ventaPermission.detail);

            //Cargamos Nombres de las Columnas del Detalle Documento  
            this.setColumnDefs();
            this.convertDetail();

            this.uiGridInvoice = new UiGridOptions({
                $scope: this.$scope,
                gridOptions: this.gridOptionsDetailDocument,
                _fS: this._fS,
                _mS: this._mS,
                _tS: this._tS,
                tipoIvas: this.tipoIvas
            })

            this.uiGridInvoice.setInitiload({
                bodegas: this.bodegas,
                tipoIvas: this.tipoIvas,
                decimal: this.decimal,
                actividadTipoIva: this.actividadTipoIva
            })

            //Calculo de Subtotales 
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());


        } catch (error) {
            hideLoader();
            console.log(error)
        } finally {
            hideLoader();
        }
    }


    setColumnDefs() {
        const self = this;

        let defaultPermission = Object.freeze({
            tarifa: {
                update: true
            },
            medida: {
                update: true
            },
            tipoIva: {
                update: true
            },
            porcentajeDescuento: {
                update: true
            },
            descuento: {
                update: true
            },
            precioUnitario: {
                update: true
            },
            precioConIva: {
                update: true
            },
        })

        const ventaDetailPermission = this.ventaDetailPermission || defaultPermission;

        this.gridOptionsDetailDocument.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '100',
                cellTemplate: `
                <button type="button" ng-click="grid.appScope.$ctrl.askToDeleteArticle(row)" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                    <i class="fa fa-trash"></i>
                </button>
                <button type="button" ng-if="articlePermission.editar" class= "btn btn-success btn-xs text-white" ng-click="grid.appScope.$ctrl.openModalArticulo(row.entity)" title = "Editar Articulo" >
                    <i class="fa fa-edit"></i>
                </button > 
                <a  btn-dato-adicional-articulo-fact-elect entity="row.entity" style="cursor:pointer;" ng-if='row.entity.datosAdicionales' history-datos-adicionales="grid.appScope.$ctrl.historyDatosAdicionales" result-modal-adicional="grid.appScope.$ctrl.resultModalAdicional(result)" datos-adicionales="grid.appScope.$ctrl.datosAdicionalesArticulo" class= "btn btn-warning btn-xs text-white" title = "Agregar dato Adicional" > <i class="fas fa-tags"></i></a >`
            },
            {
                name: 'Cód.',
                field: 'codigo',
                width: '8%',
                minWidth: '100',
                enableCellEdit: false,
            },
            {
                name: 'Descripción',
                field: 'descripcion',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: (scope) => scope.row.entity.llevaInventario !== true,
                cellTooltip: (row) => row.entity.descripcion,
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                width: '6%',
                minWidth: '50',
            },
            {
                name: 'Medida',
                field: 'idMedida',
                 enableCellEdit: ventaDetailPermission.medida.update,
                enableCellEditOnFocus: ventaDetailPermission.medida.update,
                allowCellFocus: ventaDetailPermission.medida.update,
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity, colDef) => rowEntity.medidas.map(val => ({
                    id: val.idMedida,
                    value: val.descripcion
                })),
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: ventaDetailPermission.tipoIva.update,
                allowCellFocus: ventaDetailPermission.tipoIva.update,
                enableCellEditOnFocus: ventaDetailPermission.tipoIva.update,
                type: 'number',
                width: '8%',
                minWidth: '100',
                //    visible: config.porcentajeIva
            },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity, colDef) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
                enableCellEdit: ventaDetailPermission.tarifa.update,
                enableCellEditOnFocus: ventaDetailPermission.tarifa.update,
                allowCellFocus: ventaDetailPermission.tarifa.update,
                type: 'number',
                width: '12%',
                minWidth: '100',
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '8%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioUnitario.update : true;
                },
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '7%',
                minWidth: '100',
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario ? ventaDetailPermission.precioConIva.update : true;
                },
            },
            {
                name: '%',
                field: 'porcentajeDescuento',              
                enableCellEdit: ventaDetailPermission.porcentajeDescuento.update,
                allowCellFocus: ventaDetailPermission.porcentajeDescuento.update,
                enableCellEditOnFocus: ventaDetailPermission.porcentajeDescuento.update,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: self.configDetalle.porcentajeDescuento || false,
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: ventaDetailPermission.descuento.update,
                enableCellEditOnFocus: ventaDetailPermission.descuento.update,
                allowCellFocus: ventaDetailPermission.descuento.update,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: self.configDetalle.descuento || false
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: self.configDetalle.totalDescuento || false
            },
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '5%',
                minWidth: '100'
            },
            // {
            //     name: 'Nota',
            //     field: 'nota',
            //     enableCellEdit: true,
            //     allowCellFocus: true,
            //     enableCellEditOnFocus: true,
            //     type: 'string',
            //     width: '15%',
            //     minWidth:'100'
            // },
            // {
            //     name: 'bodega',
            //     field: 'idBodega',   
            //     enableCellEdit: true,
            //     allowCellFocus: true,
            //     enableCellEditOnFocus: true,                 
            //     editableCellTemplate: 'ui-grid/dropdownEditor',
            //     cellFilter: 'cellFilterBodega:this',
            //     editDropdownValueLabel: 'descripcion',
            //     editDropdownIdLabel: 'idBodega',                
            //     type: 'number',
            //     width: '11%',
            //     minWidth:'100'
            // }, 
        ]

        let indexTipoIva = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idTipoIva');
        // let indexBodega  = this.gridOptionsDetailDocument.columnDefs.findIndex(item=>item.field==='idBodega');
        this.gridOptionsDetailDocument.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        // this.gridOptionsDetailDocument.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;             
    }


    convertDetail() {
        for (let item of this.detalleDocumento) {
            item.precioConIva = item.precioConIva;
            item.porcentajeDescuento = 0;
            item.valorDescuento = item.descuento;
            item.ice = 0;
            item.nota = null;
            item.idBodega = this.idBodega;

            let total = (item.precioUnitario - item.valorDescuento) * item.cantidad;
            let totalDescuento = item.cantidad * item.valorDescuento;
            let subTotal = item.cantidad * item.precioUnitario;


            item.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle)
            item.subTotal = this._fS.roundNumber(subTotal, 5);
            item.total = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);

            let query = {
                idArticulo: item.idArticulo,
            }
            //Obteniendo datos del articulo 
            this.articuloSvc.findForSale(query).then(response => {
                let  {articulo, medidas, datosAdicionalesArticulo} = response;
                item.medidas = medidas;
                item.datosAdicionalesArticulo = datosAdicionalesArticulo;

                let dataMedida = medidas.find(m => m.idMedida === item.idMedida) || {};
                item.articuloTarifas = JSON.parse(dataMedida.tarifas);
            }).catch(err => {
                console.log(err);
            })
           

            this.gridOptionsDetailDocument.data.push(item);
        }

    }



    existArticulo() {
        const self = this;
        const {
            articulo,
            medidas,
            datosAdicionales
        } = this.dataArticulo;
        const entity = this.gridOptionsDetailDocument.data.find(item => item.idArticulo === articulo.idArticulo);
        const obj = {
            cantidad: entity.cantidad + 1,
            idArticulo: entity.idArticulo,
            presentacion: entity.presentacion,
            idPresentacion: entity.idPresentacion
        }

        // const response = await this.uiGridInvoice.checkStock(obj);        
        let dataMedida = medidas[0];

        entity.articuloTarifas = JSON.parse(dataMedida.tarifas);
        let tarifa = entity.articuloTarifas.find(item => item.idTarifa === this.idTarifa);

        entity.idTarifa = self.idTarifa;
        entity.precioUnitario = self._fS.roundNumber(tarifa.precioVenta, self.decimal.nroPrecio);
        entity.precioConIva = self._fS.roundNumber(tarifa.precioConIva, self.decimal.nroPrecio);
        entity.adicional = datosAdicionales;
        entity.cantidad = obj.cantidad;


        const objCalculo = self.uiGridInvoice.calculoColDef(entity, 0);
        objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();
        objCalculo["calculoTotalDetalle"]();
        self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

        this.focusColumnCantidad();
    }



    async askToUpdate() {
        try {

            let textAccion = 'Actualizar';
            if (this._fS.campo(this.data.codEstab) || this.data.codEstab === 0) {
                this._tS.toastr('warning', 'Seleccione la Sucursal', textAccion)
                return
            }

            if (this._fS.campo(this.data.idCliente) || this.data.idCliente === 0) {
                this._tS.toastr('warning', 'Seleccione el Cliente', textAccion)
                return
            }

            if (this._fS.campo(this.data.idPuntoEmision) || this.data.idPuntoEmision === 0) {
                this._tS.toastr('warning', 'Seleccione el Punto de Emisión', textAccion)
                return
            }

            if (this._fS.campo(this.data.fechaEmision)) {
                this._tS.toastr('warning', 'Ingrese la Fecha de Emisión', textAccion)
                return
            }

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger m-l-5'
                },
                buttonsStyling: false
            })

            const {
                isConfirmed
            } = await swalWithBootstrapButtons.fire({
                html: `<small>Esta Ud. seguro de <b>${textAccion}</b> este Aprobación <b>N° ${this.data.serie}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `<small><i class='ti-pencil'></i> Sí, ${textAccion}!</small>`,
                cancelButtonText: '<small>&times; No, cancelar!</small>',
                reverseButtons: false,
                allowOutsideClick: false,
                focusConfirm: true
            })


            if (isConfirmed) {
                showLoader();

                const jsonHeader = {
                    ...this.data,
                    totalSinImpuestos: this.data.subTotalSinImpuestos,
                    totalConImpuestos: this.data.total,
                    importeTotal: this.data.total,
                    fechaEmision: this._fS.formatDateTimeZone(this.data.fechaEmision, "YYYY-MM-DD h:mm A"),
                }

                //Tarifa Aplicada al Documento
                jsonHeader.tarifa = this.uiGridInvoice.actividadTipoIva.tarifa;
                jsonHeader.codigoPorcentaje = this.uiGridInvoice.actividadTipoIva.codigoPorcentaje;

                let tempDetail = [];
                let orderIndex = 1;
                for (let item of this.gridOptionsDetailDocument.data) {
                    const precioTotalSinImpuesto = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                    const obj = {
                        orderIndex: orderIndex++,
                        idAprob_Document_Detailt: item.idAprob_Document_Detailt,
                        idTarifa: item.idTarifa,
                        idArticulo: item.idArticulo,
                        idTipoIva: item.idTipoIva,
                        idMedida: item.idMedida,
                        cantidad: item.cantidad,
                        descripcion: item.descripcion,
                        precioUnitario: item.precioUnitario,
                        precioConIva: item.precioConIva,
                        valorDescuento: item.valorDescuento,
                        descuento: item.valorDescuento,
                        precioTotalSinImpuesto: this._fS.roundNumber(precioTotalSinImpuesto, this.decimal.nroTotalDetalle),
                        baseImponible: this._fS.roundNumber(precioTotalSinImpuesto, this.decimal.nroTotalDetalle),
                        nota: item.nota,
                        codigoPorcentaje: item.codigoPorcentaje,
                        tarifa: item.tarifa
                    }
                    tempDetail.push(obj);
                }

                const data = {
                    comprobante: JSON.stringify(jsonHeader),
                    detalle: JSON.stringify(tempDetail),
                    historialVenta: JSON.stringify(this.historyDatosAdicionales)
                }
                console.log(this.TIPO_DOC_FV)

                this.aprobacionDocSvc.update(this.data.idAprob_Document, data).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        this._fS.sweetAlert('warning', response.message);
                    }
                    if (response.code === '1') {
                        hideLoader();
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        this.$uibModalInstance.close(response);
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }
        } catch (error) {
            hideLoader();
            console.trace(error)
        }
    }

}


