class ModalCompraBaseCtrl {

    /**
     * 
     * @param {object} {_mS, _fS}
     */

    constructor({
        _mS,
        _fS
    }) {
        this._mS = _mS;
        this._fS = _fS;

        this.data = {};


        this.data.subTotalIva = 0;
        this.data.subTotalIvaCero = 0;
        this.data.subTotalExentoIva = 0;
        this.data.subTotalNoObjetoIva = 0;
        this.data.subTotalNetoIva = 0;
        this.data.subTotalNetoIvaCero = 0;
        this.data.subTotalNetoExentoIva = 0;
        this.data.subTotalNetoNoObjetoIva = 0;
        this.data.totalIce = 0;
        this.data.irbpnr = 0;
        this.data.propina = 0;

        this.data.porcentajeDescuento = 0;
        this.data.transporte = 0;
        this.data.recargo = 0;
        this.data.subTotalSinImpuestos = 0;
        this.data.iva = 0;
        this.data.totalDescuento = 0;
        this.data.total = 0;

    }


    /**
     * 
     * @param {object} json 
     * @returns  array
     */

    initiload(json) {
        return this._mS.getData('get', '/FacturaCompra/GetDataForm?json=' + JSON.stringify(json)).then(response => {
            if (response.code === "0") {
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
                html: "<small>Esta seguro de cambiar el <b>Establecimiento</b> y <b>Bodega</b>?</small>",
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

            if (this.TIPO_DOC !== 'FC') {
                this.puntosEmision = resultsDataFormEstab[0];
                this.data.idPuntoEmision = this.puntosEmision[0].idPuntoEmision;
            } else {
                this.data.idPuntoEmision = 0;
                this._tS.toastr('info', 'No tienes asignado ningún Punto de Emisión')
            }

            this.bodegas = resultsDataFormEstab[1];
            this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
            this.cloneIdBodega = this.idBodega;

            this.actividadTipoIva = resultsDataFormEstab[2][0]

            let indexColumn = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');

            this.gridOptions.columnDefs[indexColumn].editDropdownOptionsArray = this.bodegas;

            for (let item of this.gridOptions.data) {
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




    getFechaVencimiento() {

        try {
            if (!this.data.fechaEmision) {
                this.data.fechaEmision = new Date();
            }
            if (this.data.fechaEmision) {
                let dataTiempoCredito = this.tiempoCreditos.find(item => item.idTiempoCredito === this.data.idTiempoCredito);
                let diasCredito = dataTiempoCredito ? dataTiempoCredito.diasCredito : 0;

                this.data.fechaVencimiento = this._fS.getFechaVencimiento(this.data.fechaEmision, diasCredito);
                this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);
                this.fechaVencimientoEscrita = this._fS.getFechaEscrita(this.data.fechaVencimiento);
            }
        } catch (error) {
            console.log(error)
        }
    }


    async askToChangeBodega() {
        try {
            let bodega = this.bodegas.find(item => item.idBodega === this.idBodega);
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
                title: '<small>Cambiar Bodega</small>',
                html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega.descripcion}</b>  en el detalle del Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            if (isConfirmed) {
                this.cloneIdBodega = this.idBodega;

                if (this.gridOptions.data.length === 0) return

                for (let item of this.gridOptions.data) {
                    item.idBodega = this.idBodega;
                }
                this.$scope.$apply();
            } else {
                this.idBodega = this.cloneIdBodega;
                this.$scope.$apply();
            }
        } catch (error) {
            console.log(error)
        }
    }


    setColumnDefs() {
        const self = this;
        this.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '100',
                cellTemplate: self.CELL_TEMPLATE_OPTION
            },
            {
                name: 'N°',
                field: 'n',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50'
            },
            {
                name: 'código',
                field: 'codigo',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100'
            },
            {
                name: "descripción",
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
                validators: {
                    required: true
                },
                min: 1,
                type: 'number',
                width: '6%',
                minWidth: '100'
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
                        //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                        //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                        //}
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
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
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
                enableCellEditOnFocus: true,
                //    visible: config.porcentajeIva
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                min: 0,
                enableCellEditOnFocus: true,
                // cellFilter: "currency:'$':5",
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: 'P. Costo Neto',
                field: 'precioCostoNeto',
                min: 0,
                allowCellFocus: false,
                enableCellEdit: false,

                type: 'number',
                width: '10%',
                minWidth: '100',
                visible: true
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEditOnFocus: true,
                min: 0,
                type: 'number',
                width: '5%',
                minWidth: '100',
                // cellFilter: "currency:'%'",
                /*cellFilter: "limitTo:3",*/
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEditOnFocus: true,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',

            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEditOnFocus: true,
                allowCellFocus: true,
                enableCellEdit: true,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',

            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                visible: true,
            },
            {
                name: 'Ice',
                field: 'ice',
                allowCellFocus: true,
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '6%',
                minWidth: '100',
                // cellFilter: "currency:'$'",
                // cellTooltip: function (row, col) {                                          
                //     if(["", null, undefined].includes(row.entity.ice)) {
                //         row.entity.ice = 0;                            
                //     }
                //     row.entity.totalIce = row.entity.cantidad * row.entity.ice;

                //     let factor = Math.pow(10, row.grid.appScope.config.nroIce);
                //     let tempNumber = row.entity.ice * factor;
                //     let roundedTempNumber = Math.round(tempNumber);
                //     return roundedTempNumber / factor;                                                                                                           
                // },
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableFiltering: false,
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
                name: 'Sub Total',
                field: 'subTotal',
                allowCellFocus: false,
                enableCellEdit: false,
                // cellFilter: "currency:'$'",
                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: false
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
                name: 'llevaInventario',
                field: 'llevaInventario',
                visible: false
            },
            {
                name: 'datosAdicionales',
                field: 'datosAdicionales',
                visible: false
            },
            {
                name: 'totalIce',
                field: 'totalIce',
                visible: false
            }
        ];

        let indexTipoIva = this.gridOptions.columnDefs.findIndex(item => item.field === 'idTipoIva');
        let indexBodega = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
        this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;
    }


    setColumnDefsView() {

        this.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth: '100',
                cellTemplate: `
                <a  class="btn btn-danger btn-xs text-white disabled" title="Eliminar Item agregada">
                    <i class="fa fa-trash"></i>
                </a>
                <a  class= "btn btn-success btn-xs text-white disabled" title = "Editar Articulo" >
                    <i class="fa fa-edit"></i>
                </a >                                  
                <a ng-click="grid.appScope.$ctrl.openModalArticuloDatoAdicional(row.entity)" ng-show='row.entity.datosAdicionales' class="btn btn-info btn-xs text-white" title="Ver Datos Adicionales de Articulo" >
                    <i class="fas fa-tags"></i>
                </a >                                                          
                `
            },
            {
                name: 'N°',
                field: 'n',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50'
            },
            {
                name: 'código',
                field: 'codigo',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100'
            },
            {
                name: "descripción",
                field: "descripcion",
                enableCellEdit: false,
                enableCellEditOnFocus: false,
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
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                validators: {
                    required: true
                },
                min: 1,
                type: 'number',
                width: '6%',
                minWidth: '100'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                editDropdownOptionsFunction: function (rowEntity, colDef) {
                    return rowEntity.medidas.map(function (val) {
                        //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                        //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                        //}
                        return {
                            id: val.medida.idMedida,
                            value: val.medida.descripcion
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
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
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
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                //    visible: config.porcentajeIva
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario',
                min: 0,
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                cellFilter: "currency:'$'",
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: 'P. Costo Neto',
                field: 'precioCostoNeto',
                min: 0,
                allowCellFocus: false,
                enableCellEdit: false,
                cellFilter: "currency:'$'",
                type: 'number',
                width: '11%',
                minWidth: '100',
                visible: true
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',
                cellFilter: "currency:'$'",
                /*cellFilter: "limitTo:3",*/
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',

            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEditOnFocus: false,
                allowCellFocus: false,
                enableCellEdit: false,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth: '100',

            },
            {
                name: 'Ice',
                field: 'ice',
                allowCellFocus: false,
                enableCellEdit: false,
                type: 'number',
                width: '6%',
                minWidth: '100',

            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableFiltering: false,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '11%',
                minWidth: '100'
            },
            {
                name: 'Sub Total',
                field: 'subTotal',
                allowCellFocus: false,
                enableCellEdit: false,

                type: 'number',
                width: '7%',
                minWidth: '100',
                visible: false
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                type: 'number',
                width: '8%',
                minWidth: '100',

                visible: true,
            },
            {
                name: 'Nota',
                field: 'nota',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                type: 'string',
                width: '15%',
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
            }
        ]

        let indexTipoIva = this.gridOptions.columnDefs.findIndex(item => item.field === 'idTipoIva');
        let indexBodega = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
        this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;
    }

    setFocusArticulo() {
        setTimeout(function () {
            document.querySelector('#custom-template-md-autocomplete-articulo').focus();
        }, 100);
    }


    //------------------------------------------------Articulo----------------------------------
    openModalArticleEdit(item) {
        this.$scope.gridApi.cellNav.scrollToFocus(
            this.gridOptions.data[0],
            this.gridOptions.columnDefs[2]
        )
        this.$scope.$broadcast("editArticulo", item)
    }




    async setItemArticuloEnDetalle(dataArticulo) {
        try {


            this.dataArticulo = dataArticulo;
            this.addItem();

            this.indexRow = this.gridOptions.data.findIndex(val => val.idArticulo === this.dataArticulo.articulo.idArticulo);

        } catch (error) {
            console.log(error)
        }
    }

    addRow() {
        const obj = {
            n: 1,
            idArticulo: 0,
            codigo: "",
            descripcion: "",
            cantidad: 1,
            codigoTipoIva: "",
            nombreTipoIva: "",
            precioUnitario: 0,
            precioCostoNeto: 0,
            porcentajeDescuento: 0,
            valorDescuento: 0,
            totalDescuento: 0,
            codIce: 0,
            ice: 0,
            totalIce: 0,
            idBodega: 0,
            subTotal: 0,
            total: 0,
            nota: null
        }
        this.gridOptions.data.push(obj)
    }

    addItem() {
        const self = this;
        self.addRow();

        const {
            articulo,
            medidas,
            etiquetas
        } = self.dataArticulo;

        console.log(etiquetas)

        let index = self.gridOptions.data.findIndex(value => value.idArticulo === 0);
        let entity = self.gridOptions.data[index];

        let dataMedida = medidas[0];
        let precioCosto = dataMedida.precioCosto;

        entity.idArticulo = articulo.idArticulo;
        entity.codigo = articulo.codigoArticulo;
        entity.descripcion = articulo.descripcion;

        //IVA
        entity.idTipoIva = articulo.idTipoIva;
        entity.codigoPrincipal = articulo.codigoPrincipal;
        entity.codigoAuxiliar = articulo.codigoAuxiliar;
        entity.costoNeto = articulo.costoNeto;
        entity.codigoPorcentaje = articulo.codigoPorcentaje;
        entity.nombreTipoIva = articulo.nombreTipoIva;
        entity.tarifa = articulo.tarifa;

        entity.cantidad = 1;
        entity.precioUnitario = this._fS.roundNumber(precioCosto, this.decimal.nroPrecio)
        entity.precioCostoNeto = this._fS.roundNumber(precioCosto, this.decimal.nroPrecio);
        entity.porcentajeDescuento = 0;
        entity.valorDescuento = 0;
        // entity.codIce                = item.codIce;
        entity.ice = articulo.valorIce;
        entity.idBodega = this.idBodega
        entity.llevaInventario = articulo.llevaInventario;
        entity.datosAdicionales = articulo.datosAdicionales;
        entity.medidas = medidas; //Lista Medida 
        entity.idMedida = dataMedida.idMedida; //Medida por defecto 
        entity.etiquetas = etiquetas; //seteamos la etiqueta     


        const objCalculo = self.uiGridInvoice.calculoColDef(entity, 0);

        objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();

        objCalculo["calculoTotalDetalle"]();

        self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());

        self.focusColumnCantidad();
        self.uiGridInvoice.countIndex();


    }


    focusColumnCantidad() {
        const self = this;
        let index = self.gridOptions.columnDefs.findIndex(item => item.field === 'cantidad')
        self.$scope.gridApi.cellNav.scrollToFocus(
            self.gridOptions.data[0],
            self.gridOptions.columnDefs[2]
        )

        self.$timeout(() => {
            self.$scope.gridApi.cellNav.scrollToFocus(
                self.gridOptions.data[self.indexRow],
                self.gridOptions.columnDefs[index]
            );
        }, 30)
    }

    sumaTransporteRecargo() {
        this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());
        let total = Number(this.data.total);
        let transporte = Number(this.data.transporte);
        let recargo = Number(this.data.recargo);
        let importeTotal = total + transporte + recargo;
        this.data.total = this._fS.roundNumber(importeTotal, this.decimal.nroTotalSubTotal);

    }






    validateForm() {
        return {
            "codEstab": {
                valor: this.data.codEstab,
                message: 'Seleccione el Establecimiento'
            },

            "idSustentoTributario": {
                valor: this.data.idSustentoTributario > 0,
                message: 'Seleccione el SustentoTributario'
            },
            "idCategoriaCompra": {
                valor: this.data.idCategoriaCompra > 0,
                message: 'Seleccione la Categoria'
            },
            "idProveedor": {
                valor: this.proveedor.idProveedor > 0,
                message: 'Seleccione el Proveedor'
            },
            "puntoEmision": {
                valor: this.data.puntoEmision,
                message: 'Ingrese el Punto de Emisión'
            },
            "ptoEmision": {
                valor: this.data.ptoEmision,
                message: 'Ingrese el Punto de Emisión'
            },
            "nroDocumento": {
                valor: this.data.nroDoc,
                message: 'Ingrese el Nro. Documento'
            },
            "nroAutho": {
                valor: this.data.nroAutho,
                message: 'Ingrese el Nro. de Autorización'
            },
            "idPuntoEmision": {
                valor: this.data.idPuntoEmision > 0,
                message: 'Seleccione el Punto de Emisión'
            },
            "nroDoc": {
                valor: this.data.nroDocumento,
                message: 'Ingrese el Número de Documento'
            },
            "nroAutorizacion": {
                valor: this.data.nroAutorizacion,
                message: 'Ingrese el Número de Autorizacion'
            },
            "idTiempoCredito": {
                valor: this.data.idTiempoCredito > 0,
                message: 'Seleccione el Tiempo de Crédito'
            },
            "fechaEmision": {
                valor: this.data.fechaEmision instanceof Date && !isNaN(this.data.fechaEmision),
                message: 'Ingrese la Fecha de Emisión'
            },
            "fechaVencimiento": {
                valor: this.data.fechaVencimiento instanceof Date && !isNaN(this.data.fechaVencimiento),
                message: 'Ingrese la Fecha de Vencimiento',
            },
            "validFechaVcto": {
                valor: (Date.parse(this.data.fechaEmision) <= Date.parse(this.data.fechaVencimiento)),
                message: 'Fecha de Vencimiento no puede ser menor a  Fecha de Emisión'
            },
            "idFactura": {
                valor: this.factura && this.factura.idFactura > 0,
                message: 'Seleccione la Factura'
            },
            "gridOptions": {
                valor: "data" in this.gridOptions ? this.gridOptions.data.length : null,
                message: 'Ingrese al menos un Articulo en el Detalle',
            },
            "gridOptionsBodega": {
                valor: "data" in this.gridOptions ? this.gridOptions.data.some(item => (item.idBodega > 0)) : null,
                message: 'Agregue  bodega a los artículos'
            }
        }
    }


    /**
     * 
     * @param {string} tituloModal Guardar || Actualizar
     * @returns 
     */
    isValidaForm(tituloModal) {

        let toastMessageForm = this.validateForm();


        for (let item of this.CAMPOS) {
            if (item in toastMessageForm) {
                let campo = toastMessageForm[item];
                if (!campo.valor) {
                    this._tS.toastr('warning', campo.message, tituloModal);
                    return
                }
            } else {
                throw `CAMPO ${item} NO DEFINIDO CORRECTAMENTE EN ESTE DOCUMENTO ${this.TIPO_DOC.descripcion}`
            }
        }

        if (this.data.total <= 0) {
            this._tS.toastr('warning', 'El importe total tiene que ser distinto a 0');
            return
        }

        return true;

    }


    setPorcentajeDescuentoAll(porcentajeDescuento) {
        const self = this;
        for (let rowEntity of this.gridOptions.data) {
            rowEntity.porcentajeDescuento = porcentajeDescuento;

            let objCalculo = self.uiGridInvoice.calculoColDef(rowEntity);

            objCalculo["porcentajeDescuento"]();

            objCalculo["calculoTotalDetalle"]();

        }
        self.data = Object.assign(self.data, self.uiGridInvoice.getTotales());
    }



}


window.modalCompraBaseCtrl = ModalCompraBaseCtrl