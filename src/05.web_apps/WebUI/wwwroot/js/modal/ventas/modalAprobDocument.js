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


export class ModalSelectDocumentoCtrl extends ModalBaseCtrl {
    static $inject = [
        '$scope', 
        '$uibModalInstance', 
        'uiGridConstants', 
        'mainService', 
        'commonService', 
        'aprobacionDocService', //Aprobacion Comprobante Service
        'notaEntregaService', //NotaEntrega Service
        'proformaService',
        'modalService', 
        'nombreModal', 
        'nombreModalVenta',
        'toastService', 
        'formulario', 
        'params', 
        'decodeToken'
    ];

    constructor(
        $scope, 
        $uibModalInstance, 
        uiGridConstants, 
        _mS, 
        _commonSvc, 
        aprobacionDocSvc,
        notaEntregaSvc,
        proformaSvc,
        _modalSvc, 
        _nombreModalConst, 
        nombreModalVenta,
        _tS, 
        _fS, 
        _params, 
        decodeToken
    ) {
        super(_commonSvc)
        const self = this;
        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this.uiGridConstants = uiGridConstants;
        this._mS = _mS;

        this.aprobacionDocSvc = aprobacionDocSvc;
        this.notaEntregaSvc = notaEntregaSvc;
        this.proformaSvc = proformaSvc;

        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this.nombreModalVenta = nombreModalVenta;

        this._tS = _tS;
        this._fS = _fS;

        let {
            TIPO_DOC
        } = _params;

        this.TIPO_DOC = TIPO_DOC;
        this.TIPO_DOC_FV = this._commonSvc.tipoDoc['FV'];

        //Filter        
        this.dataSearch = {
            pageIndex: 1,
            pageSize: 1000,
            checkBoxDefault: false
        }

        this.clienteFiltro = {}
        this.usuarioSearchFiltro = {};
        this.mes = new Date().getMonth() + 1;


        this.data = {};
        this.data.total = 0;
        this.data.propina = 0;
        // this.data.transporte   = 0;
        // this.data.recargo      = 0;
        this.data.fechaEmision = new Date();
        this.cliente = {};

        this.documentos = [];

        this.historialVentas = [];
        this.infoAdicionalDocumento = [];

        this.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableGridMenu: true,

            enableRowSelection: true,
            enableSelectAll: true,

            showColumnFooter: true,
            showGridFooter: true,
            expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" ui-grid-resize-columns ></div>',
            expandableRowScope: {
                subGridVariable: 'subGridScopeVariable'
            },
            expandableRowHeight: 150,
            isRowSelectable: function (row) {
                if (["AC", "PE"].includes(row.entity.codEstado)) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        this.gridOptions.onRegisterApi = function (gridApi) {
            self.$scope.gridApi = gridApi;
            self.$scope.gridApi.core.notifyDataChange(self.uiGridConstants.dataChange.OPTIONS);


            gridApi.selection.on.rowSelectionChanged(self.$scope, (row) => {
                //------
            })


            gridApi.selection.on.rowSelectionChangedBatch(self.$scope, function () {})
        }


        //GridOptions Invoice 
        this.gridOptionsDetailDocument = {
            enableSorting: true,
            suppressMultiSort: true,
        }

        this.infoAdicionalDocumento = [];


        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

    }

    async $onInit() {
        try {

            let resultsDataForm = await this.initiload();

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos[0];
                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];
                this.data.idPuntoEmision = this.puntosEmision.length > 0 ? this.puntosEmision[0].idPuntoEmision : 0;

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

                this.impuestoTarifas = resultsDataFormEstab[2]; //Impuesto tarifas dependiendo el tipo Actividad
                this.actividadTipoIva = resultsDataFormEstab[2][0];
                this.data.tarifa = this.actividadTipoIva.tarifa;
                this.data.codigoPorcentaje = this.actividadTipoIva.codigoPorcentaje
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

              //Permisos             
            //   let userPermission = resultsDataForm[9];
            //   this.ventaPermission = JSON.parse(userPermission[0].jsonPermission);
  
            //   this.ventaComprobantePermission = Object.freeze(this.ventaPermission.comprobante);
            //   this.ventaDetailPermission = Object.freeze(this.ventaPermission.detail);

            //Creamos columna de Factura 
            this.columnDefsInvoice();

        } catch (error) {
            console.error(error)
        } finally {
            hideLoader();
        }




        this.$uibModalInstance.rendered.then(() => {
            this.stepUno();
        })

    }

    columnDefsInvoice() {
        // let defaultPermission = Object.freeze({
        //     tarifa: {
        //         update: true
        //     },
        //     medida: {
        //         update: true
        //     },
        //     tipoIva: {
        //         update: true
        //     },
        //     porcentajeDescuento: {
        //         update: true
        //     },
        //     descuento: {
        //         update: true
        //     },
        //     precioUnitario: {
        //         update: true
        //     },
        //     precioConIva: {
        //         update: true
        //     },
        // })

        // const ventaDetailPermission = this.ventaDetailPermission || defaultPermission;
        
        this.gridOptionsDetailDocument.columnDefs = [{
                name: 'N°',
                field: 'n',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '5%',
                minWidth: '50'
            },
            {
                name: 'cód.',
                field: 'codigo',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'idArticulo',
                field: 'idArticulo',
                visible: false
            },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario !== true;
                },
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '6%',
                minWidth: '50'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: function (rowEntity, colDef) {
                    return rowEntity.medidas.map(function (val) {
                        return {
                            id: val.idMedida,
                            value: val.descripcion
                        }
                    })

                },
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            {
                name: 'codigoTipoIva',
                field: 'codigoTipoIva',
                enableCellEdit: false,
                width: '8%',
                visible: false
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',
                width: '8%',
                minWidth: '100',
                type: 'number',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                //    visible: config.porcentajeIva
            },
            {
                name: 'tarifas',
                field: 'articuloTarifas',
                visible: false
            },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                width: '12%',
                minWidth: '100',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: (rowEntity, colDef) => {
                    return rowEntity.articuloTarifas.map(val => ({
                        id: val.idTarifa,
                        value: val.tarifa + ' - $' + val.precioConIva
                    }))
                },
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                min: 0,
                type: 'number',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                width: '7%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
                min: 0,
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'%'",
                visible: this.configDetalle.porcentajeDescuento || false,
                type: 'number',
                /*cellFilter: "limitTo:3",*/
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: this.configDetalle.descuento || false
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                min: 0,
                type: 'number',
                width: '7%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: this.configDetalle.totalDescuento || false
            },
            {
                name: 'sub Total',
                field: 'subTotal',
                enableCellEdit: false,
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: false,
                // cellFilter: "currency:'$'",
            },
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '5%',
                minWidth: '100',
                visible: true,
            },
            {
                name: 'Ice',
                field: 'ice',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: this.configDetalle.ice || false
            },
            {
                name: 'Nota',
                field: 'nota',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '15%',
                minWidth: '100'
            },
            {
                name: 'bodega',
                field: 'idBodega',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '11%',
                minWidth: '100'
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
            },
        ]

        let indexTipoIva = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idTipoIva');
        let indexBodega = this.gridOptionsDetailDocument.columnDefs.findIndex(item => item.field === 'idBodega');
        this.gridOptionsDetailDocument.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        this.gridOptionsDetailDocument.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;
    }


    async openModalFiltroDocumento() {
        let fileCtrl, controller, template, ctrl;

        if (this.TIPO_DOC.codigo === "NE") {
            fileCtrl = this.nombreModalVenta.APROB_COMPROBANTE.fileCtrl;
            ctrl = this.nombreModalVenta.APROB_COMPROBANTE.controllers['MF_NE'];
            template = this.nombreModalVenta.APROB_COMPROBANTE.templates['MF_NE'];
        
            controller = (await import(fileCtrl))[ctrl]          

        }

        if (this.TIPO_DOC.codigo === 'PR') {

            fileCtrl = this.nombreModalVenta.APROB_COMPROBANTE.fileCtrl;
            ctrl = this.nombreModalVenta.APROB_COMPROBANTE.controllers['MF_PR'];
            template = this.nombreModalVenta.APROB_COMPROBANTE.templates['MF_PR'];
        
            controller = (await import(fileCtrl))[ctrl] 

        }


        let params = {
            TIPO_DOC: this.TIPO_DOC,
            dataSearch: this.dataSearch,
            clienteFiltro: this.clienteFiltro,
            usuarioSearchFiltro: this.usuarioSearchFiltro,
            mes: this.mes
        }

        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            params,
            size: 'lg'
        })

        modalRef.result.then(result => {
            let {
                dataSearch,
                clienteFiltro,
                usuarioSearchFiltro,
                mes,
                isSearch
            } = result;
            this.dataSearch = dataSearch;
            this.clienteFiltro = clienteFiltro;
            this.cliente = Object.assign({}, clienteFiltro)
            this.usuarioSearchFiltro = usuarioSearchFiltro;
            this.mes = mes;
            if (isSearch) {
                this.getDocumentos()
            }

        })

    }

    async getDocumentos() {
        try {

            let timerInterval;

            Swal.fire({
                title: 'Espere por favor...',
                html: 'Cargando Datos',
                timer: 5000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        let content = Swal.getHtmlContainer()
                        if (content) {
                            let b = content.querySelector('b')
                            if (b) {
                                b.textContent = Swal.getTimerLeft()
                            }
                        }
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            })



            if (this.TIPO_DOC.codigo === 'NE') {
                this.getNotaEntregas();
            }

            if (this.TIPO_DOC.codigo === 'PR') {
                this.getProformas();
            }

        } catch (error) {
            this.documentos = [];
            console.trace(error);
        }
    }

    getNotaEntregas() {
        try {
            const self = this;
            this.documentos = [];
            this.notaEntregaSvc.getAll(this.dataSearch).then(async response=>{
                this.gridOptions.columnDefs = [{
                    name: 'Nro. Doc',
                    field: 'nroDocumento'
                },
                {
                    name: 'F. Emisión',
                    field: 'fechaEmision'
                },
                {
                    name: 'F. Vcto',
                    field: 'fechaVencimiento'
                },
                {
                    name: 'Cliente',
                    field: 'nombreFiscal',
                    cellTemplate: `<div class="grid-tooltip"  tooltip-placement="left" uib-tooltip="{{row.entity.nombreFiscal }}">
                        <div class="ui-grid-cell-contents">
                        {{ COL_FIELD }}
                        </div>
                    </div>`
                },
                {
                    name: 'Total',
                    field: 'total',
                    cellTemplate: ` <div class="grid-tooltip"><div class="ui-grid-cell-contents">$ {{ COL_FIELD }}</div></div>`,
                    aggregationType: self.uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationLabel: "Total: ",
                    aggregationHideLabel: true,
                    footerCellFilter: 'number:2',
                },
                {
                    name: 'Estado',
                    field: 'estadoFinanciero'
                },
                {
                    name: 'Usuario',
                    field: 'usuario'
                },
            ];

            this.documentos = response;
            await this.setDataGridOptionsChildren();

            Swal.close();
            }).catch(error => {
                console.log(error);
            })                    
        } catch (error) {
            console.log(error);
        }       
    }


    getProformas() {
        try {
            const self = this;
            this.proformaSvc.getAll(this.dataSearch).then(async response => {             
                this.gridOptions.columnDefs = [{
                        name: 'Nro. Doc',
                        field: 'nroDocumento'
                    },
                    {
                        name: 'F. Emisión',
                        field: 'fechaEmision'
                    },
                    {
                        name: 'F. Vcto',
                        field: 'fechaVencimiento',
                        visible: false
                    },
                    {
                        name: 'Cliente',
                        field: 'nombreFiscal',
                        cellTemplate: `<div class="grid-tooltip"  tooltip-placement="left" uib-tooltip="{{row.entity.nombreFiscal }}">
                    <div class="ui-grid-cell-contents">
                      {{ COL_FIELD }}
                    </div>
                  </div>`
                    },
                    {
                        name: 'Total',
                        field: 'total',
                        cellTemplate: ` <div class="grid-tooltip"><div class="ui-grid-cell-contents">$ {{ COL_FIELD }}</div></div>`,
                        aggregationType: self.uiGridConstants.aggregationTypes.sum,
                        customTreeAggregationFinalizerFn: function (aggregation) {
                            aggregation.rendered = aggregation.value;
                        },
                        aggregationLabel: "Total: ",
                        aggregationHideLabel: true,
                        footerCellFilter: 'number:2',
                    },
                    {
                        name: 'Estado',
                        field: 'estadoDoc',
                        visible: true
                    },
                    {
                        name: 'Usuario',
                        field: 'usuario'
                    },
                ];
    
                this.documentos = response;
                await this.setDataGridOptionsChildren();
    
                Swal.close();
            }).catch(error => {
                Swal.close();
                console.log(error)
            })       
        } catch (error) {
            Swal.close();
            console.log(error);        
        }
    }


    async setDataGridOptionsChildren() {

        const self = this;
        let tempHistorialInfoAdicional = []; //
        let tempInfoAdicionalDocumento = []; //

        for (let item of this.documentos) {
            let id;
            item.subGridOptions = this.columnDefsSubGridOptions();

            if (this.TIPO_DOC.codigo === 'NE') {
                id = item.idNotaEntrega
            }

            if (this.TIPO_DOC.codigo === 'PR') {
                id = item.idProforma;
            }

            //Obtenemos detalle de Nota de Entrega
            let {detalleDocumento, datosAdicionalesArticulo, infoAdicionalDocumento} = await self._commonSvc.getDataTipoDocVenta({
                id,
                codigoDocumento: self.TIPO_DOC.codigo
            })
            item.subGridOptions.data = detalleDocumento;

            //Historial Ventas de Nota Entrega 
            tempHistorialInfoAdicional.push(datosAdicionalesArticulo);
            tempInfoAdicionalDocumento.push(infoAdicionalDocumento)
        }

        this.gridOptions.data = this.documentos;
        this.historialVentas = tempHistorialInfoAdicional.flat();
        this.infoAdicionalDocumento = tempInfoAdicionalDocumento.flat();
        console.log(tempHistorialInfoAdicional);
        console.log(tempInfoAdicionalDocumento);
        if (this.documentos.length === 0) {
            this._tS.toastr('info', 'No se encontraron los Documentos');
        }

    }

    columnDefsSubGridOptions() {
        const self = this;
        return {
            showColumnFooter: true,
            columnDefs: [{
                    name: 'Cód.',
                    field: 'codigo',
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'Descripción',
                    field: 'descripcion',
                    cellTooltip: (row) => row.entity.descripcion,
                    width: '25%',
                    minWidth: '100'
                },
                {
                    name: 'Cant.',
                    field: 'cantidad',
                    width: '6%',
                    minWidth: '50',
                    aggregationType: self.uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${self.decimal.nroCantidad}`,
                },
                {
                    name: 'Medida',
                    field: 'idMedida',
                    cellFilter: 'mapMedida:row.entity.medidas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    enableCellEdit: true,
                    enableCellEditOnFocus: true,
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return rowEntity.medidas.map(function (val) {
                            return {
                                id: val.idMedida,
                                value: val.descripcion
                            }
                        })

                    },
                    type: 'number',
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'IVA',
                    field: 'tipoIva',
                    width: '8%',
                    minWidth: '100'
                },
                {
                    name: 'Tarifa',
                    field: 'idTarifa',
                    width: '12%',
                    minWidth: '100',
                    cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return rowEntity.articuloTarifas.map(val => ({
                            id: val.idTarifa,
                            value: val.tarifa + ' - $' + val.precioConIva
                        }))
                    }
                },
                {
                    name: 'Precio U.',
                    field: 'precioUnitario',
                    width: '8%',
                    minWidth: '100',
                    aggregationType: self.uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${self.decimal.nroPrecio}`,
                },
                {
                    name: 'P. Iva',
                    field: 'precioConIva',
                    width: '7%',
                    minWidth: '100',
                    aggregationType: self.uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${self.decimal.nroPrecio}`,
                },
                {
                    name: '%',
                    field: 'porcentajeDescuento',
                    width: '6%',
                    minWidth: '100',
                },
                {
                    name: 'dsto.',
                    field: 'valorDescuento',
                    width: '6%',
                    minWidth: '100',
                    aggregationType: self.uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${self.decimal.nroDescuento}`,
                },
                {
                    name: 'T. Dsto.',
                    field: 'totalDescuento',
                    width: '7%',
                    minWidth: '100',
                    aggregationType: self.uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${self.decimal.nroDescuentoDetalle}`
                },
                {
                    name: 'Total',
                    field: 'total',
                    width: '5%',
                    minWidth: '100',
                    aggregationType: self.uiGridConstants.aggregationTypes.sum,
                    customTreeAggregationFinalizerFn: function (aggregation) {
                        aggregation.rendered = aggregation.value;
                    },
                    aggregationHideLabel: true,
                    footerCellFilter: `number:${self.decimal.nroTotalDetalle}`
                },
            ]
        }
    }


    // Step Uno
    stepUno() {
        this.footerActionStepUno = true;
        this.footerActionStepDos = false;

        $("#step a:first-child").addClass('active');
        $("#step a:last-child").removeClass('active');

        const stepNotaEntrega = document.getElementById("notas-de-entrega");
        const stepFactura = document.getElementById("factura");

        stepNotaEntrega.style.display = "block";
        stepFactura.style.display = "none";
    }

    stepDos() {
        try {


            if (!this.cliente.idCliente > 0) {
                this._tS.toastr('warning', 'Seleccione el Cliente');
                return
            }

            this.selectedDocuments = this.$scope.gridApi.selection.getSelectedRows() || []
            if (this.selectedDocuments.length === 0) {
                this._tS.toastr('warning', 'Seleccione al menos un Documento', 'Siguiente', 'toast-bottom-center');
                return
            }

            showLoader();
            //UNIMOS TODOS LOS DETALLES DEL COMPROBANTE

            let resultJoinDetails = this.selectedDocuments.flatMap(item => item.subGridOptions.data);


            //Si la Opcion es Agrupar Articulos del Detalle 
            if (this.groupByArticle) {
                resultJoinDetails = resultJoinDetails.reduce((arrGroup, current) => {
                    let thatItem = arrGroup.find(item => item.codigo == current.codigo);
                    if (thatItem == undefined) arrGroup = [...arrGroup, {
                        ...current
                    }]
                    else {
                        thatItem.cantidad += current.cantidad;

                        let precioVenta = thatItem.precioVenta += current.precioVenta;
                        let precioConIva = thatItem.precioConIva += current.precioConIva;
                        let porcentajeDescuento = thatItem.porcentajeDescuento += current.porcentajeDescuento;
                        let valorDescuento = thatItem.valorDescuento += current.valorDescuento;
                        let totalDescuento = thatItem.totalDescuento += current.totalDescuento;
                        let subTotal = thatItem.subTotal += current.subTotal;
                        let total = thatItem.total += current.total;

                        thatItem.precioVenta = this._fS.roundNumber(precioVenta, this.decimal.nroPrecio);
                        thatItem.precioConIva = this._fS.roundNumber(precioConIva, this.decimal.nroPrecio);
                        thatItem.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroPorcentaje);
                        thatItem.valorDescuento = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuento);
                        thatItem.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle);
                        thatItem.subTotal = this._fS.roundNumber(subTotal, 5);
                        thatItem.total = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);
                    }
                    return arrGroup
                }, [])
            }

            //Agregamos Bodega e Indice
            let index = 1;
            this.gridOptionsDetailDocument.data = resultJoinDetails.map(item => {
                item.idBodega = this.idBodega;
                item.n = index++;
                return item;
            })

            //Creamos objeto GridOptions para calculos de totales y subtotales             
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

            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());

            this.getImporteTotal();

            this.footerActionStepUno = false;
            this.footerActionStepDos = true;

            $("#step a:first-child").removeClass('active');
            $("#step a:last-child").addClass('active');

            const stepNotaEntrega = document.getElementById("notas-de-entrega");
            const stepFactura = document.getElementById("factura");

            stepNotaEntrega.style.display = "none";
            stepFactura.style.display = "block";
            hideLoader();
        } catch (error) {
            hideLoader();
            console.trace(error);
        }


    }

    getImporteTotal() {
        let total = Number(this.data.total);
        // let transporte   = Number(this.data.transporte);
        // let recargo      = Number(this.data.recargo);
        // let importeTotal = total + transporte + recargo;        
        this.data.total = this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
    }

    async askToSaveInvoice() {
        try {

            if (!this.data.codEstab) {
                this._tS.toastr('warning', 'El Establecimiento es obligatorio');
                return
            }

            let textAccion = 'Guardar';

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
                html: `<small>Esta Ud. seguro de ${textAccion} este Aprobación de <b>${this.TIPO_DOC.descripcion}</b> a <b>${this.TIPO_DOC_FV.descripcion}</b></small>?`,
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

                const jsonHeader = {
                    ...this.data,
                    codDoc: '01',
                    idCliente: this.cliente.idCliente,
                    fechaEmision: this._fS.formatDateTimeZone(this.data.fechaEmision),
                    docOrigen: this.TIPO_DOC.codigo,
                    total: this.selectedDocuments.map(item => item.total).reduce((prev, acc) => prev + acc, 0)
                }

                //Tarifa Aplicada al Documento
                //jsonHeader.tarifa = this.actividadTipoIva.tarifa;

                let tempDetail = [];
                let orderIndex = 1;
                for (let item of this.gridOptionsDetailDocument.data) {

                    let precioTotalSinImpuesto = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                    let obj = {
                        orderIndex: orderIndex ++,
                        idAprob_Document_Detailt: 0,
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
                        baseImponible:  this._fS.roundNumber(precioTotalSinImpuesto, this.decimal.nroTotalDetalle),
                        codigoPorcentaje: item.codigoPorcentaje,
                        tarifa: item.tarifa
                    }
                    tempDetail.push(obj);
                }

                let infoAdicional = this.infoAdicionalDocumento.filter(item => {
                    if(item){
                        return this.selectedDocuments.some(docs => docs.idComprobante===item.idDocumento)
                    }else{
                        return false;
                    }
                })

                let historialVenta = this.historialVentas.filter(item => {
                    if(item){
                        return this.selectedDocuments.some(docs => docs.idNotaEntrega===item.idDocumento)
                    }else{
                        return false;
                    }
                })

                

                const data = {
                    comprobante: JSON.stringify(jsonHeader),
                    detalle: JSON.stringify(tempDetail),
                    historial: JSON.stringify(this.selectedDocuments.map(item => ({
                        idDocumento: item.idNotaEntrega || item.idProforma,
                        serie: item.nroDocumento,
                    }))),
                    infoAdicional: JSON.stringify(infoAdicional),
                    historialVenta: JSON.stringify(historialVenta),
                }

                this.aprobacionDocSvc.save(data).then(response => {
                    if (response.code === "0") {
                        hideLoader();
                        this._fS.sweetAlert('warning', response.message);
                    }
                    if (response.code === '1') {
                        hideLoader();
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        this.$uibModalInstance.close(response);
                    }
                })
            }
        } catch (error) {
            hideLoader();
            console.trace(error)
        }
    }

    closeModal() {
        this.$uibModalInstance.close();
    }
}



export class ModalNotaEntregaFiltroCtrl extends ModalBaseCtrl {
    static $inject = ['$scope', 'mainService', 'commonService', 'toastService', 'formulario', '$uibModalInstance', 'params', 'decodeToken']

    constructor($scope, _mS, _commonSvc, _toastr, _form, $uibModalInstance, _params, decodeToken) {
        super(_commonSvc)
        this.$scope = $scope;
        this._mS = _mS;
        this._toastr = _toastr
        this._form = _form;
        this.$uibModalInstance = $uibModalInstance;


        let {
            TIPO_DOC,
            dataSearch,
            clienteFiltro,
            usuarioSearchFiltro,
            mes
        } = _params;
        this.TIPO_DOC = TIPO_DOC;

        this.dataSearch = dataSearch || {};
        this.dataSearch.checkBoxCliente = true;
        this.dataSearch.checkBoxEstado = true;

        this.clienteFiltro = clienteFiltro || {}
        this.usuarioSearchFiltro = usuarioSearchFiltro || {};

        this.meses = this._form.meses();
        this.mes = mes;

        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    }

    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            this.estadoDocumentos = await this._commonSvc.getEstadoDocByCodDoc(this.TIPO_DOC.codigo);

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos[0];
                this.dataSearch.codEstab = dataEstab.codEstab;
            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }

            //Por Defecto No Cobrada
            this.codEstado = "NCBR";
            this.dataSearch.byEstado = this.estadoDocumentos.find(item => item.codigo === this.codEstado).idEstadoPago

            // this.dataSearch = Object.assign(this.dataSearch, this.dataSearch)

            this.$scope.$apply();

            this.$uibModalInstance.rendered.then(() => {
                $("#clienteSearchFiltro").focus();
            })
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }


    busquedaAvanzada() {
        let titutoToast = "Búsqueda";
        if (this._form.campo(this.dataSearch.codEstab)) {
            this._toastr.toastr('warning', 'Seleccione el Establecimiento', titutoToast);
            return
        }

        if (this._form.campo(this.dataSearch.byCliente) || this.dataSearch.byCliente === 0) {
            this._toastr.toastr('warning', 'Seleccione el Cliente', titutoToast);
            return;
        }


        if (this.dataSearch.checkBoxFecha) {
            if (this._form.campo(this.dataSearch.fechaInicio)) {
                this._toastr.toastr('warning', 'Ingrese la Fecha Inicio', titutoToast);
                return
            }

            if (this._form.campo(this.dataSearch.fechaFin)) {
                this._toastr.toastr('warning', 'Ingrese la Fecha Fin');
                return;
            };
            if (this.dataSearch.fechaFin < this.dataSearch.fechaInicio) {
                this._toastr.toastr('warning', 'Fecha Fin no puede se menor a Fecha Inicio');
                return
            }
        }

        if (this.dataSearch.checkBoxUsuario) {
            if (this._form.campo(this.dataSearch.byUsuario) || this.dataSearch.byUsuario === 0) {
                this._toastr.toastr('warning', '   Ingrese el Usuario', titutoToast);
                return;
            }
        }

        if (this.dataSearch.byEstado !== this.estadoDocumentos.find(item => item.codigo === this.codEstado).idEstadoPago) {
            this._toastr.toastr('warning', 'El Estado tiene que ser No Cobrada', titutoToast);
            return
        }


        this.$uibModalInstance.close({
            dataSearch: this.dataSearch,
            clienteFiltro: this.clienteFiltro,
            usuarioSearchFiltro: this.usuarioSearchFiltro,
            mes: this.mes,
            isSearch: true
        })
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


export class ModalProformaFiltroCtrl extends ModalBaseCtrl {
    static $inject = ['$scope', 'mainService', 'commonService', 'toastService', 'formulario', '$uibModalInstance', 'params', 'decodeToken']

    constructor($scope, _mS, _commonSvc, _toastr, _form, $uibModalInstance, _params, decodeToken) {
        super(_commonSvc)
        this.$scope = $scope;
        this._mS = _mS;
        this._toastr = _toastr
        this._form = _form;
        this.$uibModalInstance = $uibModalInstance;

        let {
            TIPO_DOC,
            dataSearch,
            clienteFiltro,
            usuarioSearchFiltro,
            mes
        } = _params;
        this.TIPO_DOC = TIPO_DOC;

        this.dataSearch = dataSearch || {};
        this.dataSearch.checkBoxCliente = true;
        this.dataSearch.checkBoxEstado = true;

        this.clienteFiltro = clienteFiltro || {}
        this.usuarioSearchFiltro = usuarioSearchFiltro || {};

        this.meses = this._form.meses();
        this.mes = mes;


        this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
    }

    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();
            this.estadoDocumentos = await this._commonSvc.getEstadoDocByCodDoc(this.TIPO_DOC.codigo);

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos[0];
                this.dataSearch.codEstab = dataEstab.codEstab;
            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }

            //Por Defecto No Cobrada
            this.codEstado = "AC";
            this.dataSearch.byEstado = this.estadoDocumentos.find(item => item.codigo === this.codEstado).idEstadoPago

            // this.dataSearch = Object.assign(this.dataSearch, this.dataSearch)

            this.$scope.$apply();

            this.$uibModalInstance.rendered.then(() => {
                $("#clienteSearchFiltro").focus();
            })
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error)
        }
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




export class ModalApproveDocDetalleCtrl extends ModalBaseCtrl {
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'uiGridConstants', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params'];

    constructor($scope, $timeout, $uibModalInstance, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreModalConst, _tS, _fS, _params) {
        super(_commonSvc, 'FV')
        const self = this;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this.uiGridConstants = uiGridConstants;
        this._mS = _mS;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;
        this._fS = _fS;
        this._params = _params;

        //Data Params 
        this.data = this._params[0][0];
        this.data.fechaEmision = this._fS.formatDate(this.data.fechaEmision)
        this.detalleDocumento = this._params[1];

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


            })
        }
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



            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }

            this.decimal = resultsDataForm[1][0]
            this.configDetalle = resultsDataForm[2];
            this.tipoIvas = resultsDataForm[3];
            this.tarifas = resultsDataForm[4];

            this.idTarifa = this.tarifas.length > 0 ? this.tarifas[0].idTarifa : 0;
            this.cloneIdTarifa = this.idTarifa;

            this.actividadTipoIva = this.tipoIvas.find(ti => ti.codigoPorcentaje === this.data.codigoPorcentaje)

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
        this.gridOptionsDetailDocument.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '100',
                cellTemplate: `
                <button type="button" disabled class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                    <i class="fa fa-trash"></i>
                </button>
                <button type="button" ng-if="articlePermission.editar" class= "btn btn-success btn-xs text-white" disabled title = "Editar Articulo" >
                    <i class="fa fa-edit"></i>
                </button > `
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
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                cellEditableCondition: (scope) => scope.row.entity.llevaInventario !== true,
                cellTooltip: (row) => row.entity.descripcion,
                width: '25%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                width: '6%',
                minWidth: '50',
            },
            {
                name: 'Medida',
                field: 'idMedida',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
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
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
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
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '12%',
                minWidth: '100',
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '6%',
                minWidth: '100',
                visible: self.configDetalle.porcentajeDescuento || false,
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                enableCellEditOnFocus: false,
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

            this._commonSvc.getDataArticuloParaVenta({
                json: item
            }).then(response => {

                const results = JSON.parse(response.data);

                const responseMsg = results[0][0];
                if (responseMsg.code === '1' || responseMsg.code === '2') {
                    item.medidas = results[1];
                    let dataMedida = item.medidas.find(m => m.idMedida === item.idMedida) || {};
                    item.articuloTarifas = JSON.parse(dataMedida.tarifas);
                }
            })

            this.gridOptionsDetailDocument.data.push(item);
        }
    }
}





export class ModalApproveDocFiltroCtrl extends ModalBaseCtrl {

    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'formulario', 'toastService', 'params', 'decodeToken']

    constructor($scope, $uibModalInstance, _mS, _commonSvc, _fS, _tS, _params, decodeToken) {
        super(_commonSvc)


        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._fS = _fS;
        this._tS = _tS;

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
            this.estadoDocumentos = await this._commonSvc.getEstadoDocByCodDoc('PRE');
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
        if (this.usuarioSearchFiltro.nombreCompleto === '' || this.usuarioSearchFiltro.nombreCompleto === null || this.usuarioSearchFiltro.nombreCompleto === undefined) {
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