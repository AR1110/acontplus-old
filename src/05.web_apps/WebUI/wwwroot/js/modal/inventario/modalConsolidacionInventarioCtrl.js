class ModalBaseCtrl {
    constructor({
        $scope,
        $timeout,
        $uibModalInstance,
        _mS,
        _commonSvc,
        _modalSvc,
        _nombreConst,
        _tS,
        _fS,
        _params
    }) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._modalSvc = _modalSvc;
        this._nombreConst = _nombreConst;
        this._tS = _tS;
        this._fS = _fS;

        this.data = {};

    }

    initiload() {
        return this._mS.getData('get', '/FacturaCompra/GetDataForm?json=' + JSON.stringify({})).then(response => {
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

            let indexColumn = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');

            this.gridOptions.columnDefs[indexColumn].editDropdownOptionsArray = this.bodegas;

            for (let item of this.gridOptions.data) {
                item.idBodega = this.idBodega;
            }

            this.$scope.$apply();
        } catch (error) {
            console.trace(error)
        }
    }

    setFocusArticulo() {
        setTimeout(function () {
            document.querySelector('#custom-template-md-autocomplete-articulo').focus();
        }, 100);
    }




    closeModal() {
        this.$uibModalInstance.close();
    }
}


class ModalConsolidacionCtrl extends ModalBaseCtrl {
    constructor({
        $scope,
        $timeout,
        $uibModalInstance,
        uiGridConstants,
        _mS,
        _commonSvc,
        _modalSvc,
        _nombreConst,
        _tS,
        _fS,
        _params
    }) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            uiGridConstants,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreConst,
            _tS,
            _fS,
            _params
        })

        const self = this;

        this.uiGridConstants = uiGridConstants;

        this.TIPO_DOC = this._commonSvc.tipoDoc['CIV'];

        this.gridOptions = {
            enableColumnMenus: false,
            showColumnFooter: false,
            //enableGridMenu: true,
            // enableFiltering: false,
            // enableRowHashing: false,
            showGridFooter: true,
            enableCellEdit: false,
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
                if (rowEntity[colDef.field] === "" || rowEntity[colDef.field] === undefined || rowEntity[colDef.field] === null) {
                    rowEntity[colDef.field] = oldValue;
                    return
                }

                if (colDef.field === "precioActual") {
                    rowEntity.precioCosto = self._fS.roundNumber(rowEntity.precioCosto, self.decimal.nroPrecio)
                    rowEntity.precioActual = self._fS.roundNumber(rowEntity.precioActual, self.decimal.nroPrecio)
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);

                    rowEntity.precioCosto = self._fS.roundNumber(dataMedida.precioCosto, self.decimal.nroPrecio)
                    rowEntity.precioActual = self._fS.roundNumber(dataMedida.precioCosto, self.decimal.nroPrecio)
                }

                self.setTotalColumn(rowEntity);
                self.setTotalDetalle();

            })
        }
    }


    setTotalColumn(rowEntity) {
        let total = rowEntity.cantidad * rowEntity.precioActual;
        rowEntity.total = this._fS.roundNumber(total, this.decimal.nroTotalDetalle); //Total Precio Venta
    }

    setTotalDetalle() {
        let total = this.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);

        this.data.total = this._fS.roundNumber(total, this.decimal.nroTotalSubTotal)
    }


    async askToChangeBodega() {
        let {
            isConfirmed
        } = await Swal.fire({
            html: `<small>Esta seguro de cambiar la bodega en todo el Documento?</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: `Sí, cambiar!`,
            cancelButtonText: 'No, cancelar!',
            allowOutsideClick: false,
            reverseButtons: false,
        })

        if (isConfirmed) {
            this.cloneIdBodega = this.idBodega;
            for (let item of this.gridOptions.data) {
                item.idBodega = this.idBodega;
            }
            this.$scope.$apply()
        } else {
            this.idBodega = this.cloneIdBodega;
            this.$scope.$apply()
        }
    }


    setColumnDefs() {
        const self = this;

        this.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                        <a  ng-click="grid.appScope.$ctrl.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                        <a  ng-click="grid.appScope.$ctrl.openModalArticuloEditar(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
                        `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
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
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '7%',
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
                type: 'string',
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                enableColumnMenu: false,
                visible: false
            },
            {
                name: 'Iva',
                field: 'nombreTipoIva',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'string',
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'Stock',
                field: 'stock',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '5%',
                minWidth: '65',
                type: 'number',
                enableColumnMenu: false,
                visible: true,
                aggregationType: self.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                aggregationType: self.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo Actual',
                field: 'precioActual',
                min: 0,
                type: 'number',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                width: '12%',
                minWidth: '100',
                aggregationType: self.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                aggregationType: self._fS.roundNumber(self.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableFiltering: false,
                enableColumnMenu: false,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '11%',
                minWidth: '100'
            }
        ];
        let indexBodega = this.gridOptions.columnDefs.findIndex(item => item.field === 'idBodega');
        this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;
    }

    setColumnDefsView() {
        const self = this;

        this.gridOptions.columnDefs = [{
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                        <a  style="cursor:pointer;" class="btn btn-danger btn-xs text-white disabled" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>
                        <a style="cursor:pointer;" class= "btn btn-success btn-xs text-white disabled" title = "Editar Articulo" > <i class="fa fa-edit"></i></a >
                        `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                min: 1,
                type: 'number',
                width: '7%',
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
                name: 'Iva',
                field: 'nombreTipoIva',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'string',
                enableColumnMenu: false,
                visible: true
            },
            {
                name: 'Stock',
                field: 'stock',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '5%',
                minWidth: '65',
                type: 'number',
                enableColumnMenu: false,
                visible: true,
                aggregationType: self.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEditOnFocus: false,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',
                cellFilter: "currency:'$'",
                aggregationType: self.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'P. Costo Actual',
                field: 'precioActual',
                min: 0,
                type: 'number',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                width: '12%',
                minWidth: '100',
                cellFilter: "currency:'$'",
                aggregationType: self.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                aggregationType: self._fS.roundNumber(self.uiGridConstants.aggregationTypes.sum, 2),
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = self._fS.roundNumber(aggregation.value, 2)
                },
                aggregationLabel: "$",
            },
            {
                name: 'bodega',
                field: 'idBodega',
                enableFiltering: false,
                enableColumnMenu: false,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'mapBodega:grid.appScope.$ctrl.bodegas',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                type: 'number',
                width: '11%',
                minWidth: '100'
            }
        ];
    }


    setItemArticuloEnDetalle(item) {
        try {
            let {
                articulo
            } = item;

            if(!articulo.llevaInventario){
                Swal.fire({
                    icon:'warning',
                    html: 'Este articulo no esta configurado para llevar inventario'
                })
                return
            }

            let entity = {}
            this.indexRow = this.gridOptions.data.findIndex(value => value.idArticulo === articulo.idArticulo);
            if (this.indexRow !== -1) {

                entity = this.gridOptions.data[this.indexRow];
                entity.cantidad = entity.cantidad + 1;

            } else {
                this.addRow();
                this.indexRow = this.gridOptions.data.findIndex(value => value.idArticulo === 0);
                entity = this.gridOptions.data[this.indexRow];
                this.addItem(entity, item); // item row
            }
            this.countEnum();
            this.setTotalColumn(entity);
            this.setTotalDetalle();

            this.focusColumnaCantidad();
        } catch (error) {
            console.error(error)
        }
    }

    addRow() {

        this.gridOptions.data.push({
            num: 1,
            idArticulo: 0,
            codigo: "",
            descripcion: "",
            cantidad: 1,
            nombreMedida: "",
            codigoTipoIva: "",
            nombreTipoIva: "",
            stock: 0,
            precioCosto: 0,
            idBodega: 0,
            nota: "S/N"
        })
    }

    addItem(entity, item) {
        let {
            articulo,
            medidas
        } = item;
        let dataMedida = medidas[0];
        entity.codigo = articulo.codigoArticulo;
        entity.idArticulo = articulo.idArticulo;
        entity.descripcion = articulo.descripcion;
        entity.codigoTipoIva = articulo.codigoTipoIva;
        entity.porcentajeTipoIva = articulo.porcentajeTipoIva;
        entity.nombreTipoIva = articulo.nombreTipoIva;
        entity.stock = articulo.stock;
        entity.precioCosto = this._fS.roundNumber(dataMedida.precioCosto, this.decimal.nroPrecio)
        entity.precioActual = this._fS.roundNumber(dataMedida.precioCosto, this.decimal.nroPrecio)
        entity.total = this._fS.roundNumber(dataMedida.precioCosto, this.decimal.nroPrecio)
        entity.idBodega = this.idBodega ? this.idBodega : 0;
        entity.llevaInventario = articulo.llevaInventario;
        entity.medidas = medidas; //Lista Medida 
        entity.idMedida = dataMedida.idMedida; //Medida por defecto                                                                    
    }


    countEnum() {
        let counter = 1;
        for (let item of this.gridOptions.data) {
            item.num = counter++;
        }
    }

    focusColumnaCantidad() {
        const self = this;
        let indexColumn = self.gridOptions.columnDefs.findIndex(item => item.field === "cantidad");
        self.$scope.gridApi.cellNav.scrollToFocus(
            self.gridOptions.data[0],
            self.gridOptions.columnDefs[2]
        );

        self.$timeout(() => {
            self.$scope.gridApi.cellNav.scrollToFocus(
                self.gridOptions.data[this.indexRow],
                self.gridOptions.columnDefs[indexColumn]
            );
        }, 10)
    }


    async deleteRow(row) {
        let {
            isConfirmed
        } = await Swal.fire({
            html: `<small>Esta Ud. seguro/a de eliminar este Articulo <b>${row.entity.descripcion}</b></small>?`,
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: `Sí, eliminar!`,
            showCancelButton: true,
            cancelButtonText: 'No, cancelar!',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            let index = this.gridOptions.data.indexOf(row.entity);
            this.gridOptions.data.splice(index, 1);

            this.setTotalDetalle();
            this.countEnum();
            this.$scope.$apply();
        }
    }


    openModalArticuloEditar(item) {
        this.$scope.gridApi.cellNav.scrollToFocus(
            this.gridOptions.data[0],
            this.gridOptions.columnDefs[2]
        )
        this.$scope.$broadcast("editArticulo", item)
    }


    /**
     * 
     * @param {*} tituloModal 
     * @returns true | false
     */
    async validForm(tituloModal) {
        if (!this.data.codEstab) {
            this._tS.toastr('warning', 'Seleccione el Establecimiento', tituloModal);
            return
        }

        if (!(this.data.idPuntoEmision)) {
            this._tS.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
            return
        }

        if (!(this.data.fechaEmision)) {
            this._tS.toastr('warning', 'Ingrese la Fecha de Emisión', tituloModal);
            return
        }

        if (this.gridOptions.data.length === 0) {
            this._tS.toastr('warning', 'Al menos ingrese un Articulo en el Detalle', tituloModal);
            return
        }

        if (this.gridOptions.data.some(item => (!(item.idBodega > 0)))) {
            this._tS.toastr('warning', 'Agregue  bodega a los artículos');
            return
        }




        return true;

    }






}




export class ModalConsolidacionNuevoCtrl extends ModalConsolidacionCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'storageService', 'uiGridConstants', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params'];

    constructor($scope, $timeout, $uibModalInstance, _storageSvc, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            uiGridConstants,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreConst,
            _tS,
            _fS,
            _params
        })

        this._storageSvc = _storageSvc;

        let {
            TIPO_REGISTRO
        } = _params;

        this.TIPO_REGISTRO = TIPO_REGISTRO;

        this.data.fechaEmision = new Date();
        this.data.total = 0;

    }


    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();


            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos[0];

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];

                if (this.puntosEmision.length > 0) {
                    this.data.idPuntoEmision = this.puntosEmision[0].idPuntoEmision;
                } else {

                }

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }


            this.decimal = resultsDataForm[1][0];


            this.setColumnDefs();


            if (Object.keys(this._storageSvc.getObject("consolidacionDetail")).length > 0) {
                this._storageSvc.restoreInvoiceDetail("consolidacionDetail").then(result => {
                    if (result.isConfirmed) {
                        this.gridOptions.data = JSON.parse(result.dataInvoiceDetail[result.value]);
                        delete result.dataInvoiceDetail[result.value];

                        this._storageSvc.setObject("consolidacionDetail", result.dataInvoiceDetail)
                    }

                })
            }

            this.$scope.$apply();

        } catch (error) {

            console.log(error)

        } finally {

            hideLoader();
        }
    }



    async consolidacionArticuloImport() {
        try {

            let {
                MODAL_FILE_CTRL,
                MODAL_CONSOL_IMPORT
            } = this._nombreConst.consolidacion_inv;
            let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_CONSOL_IMPORT['controller']]
            let template = MODAL_CONSOL_IMPORT['template'];


            let modalRef = this._modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                windowClass: 'uibModalFullScreen'
            })

            // modalRef.rendered.then(()=>{
            //     this.$uibModalInstance.close();
            // })

            modalRef.result.then(result => {
                if (typeof result === 'object') {
                    this.$uibModalInstance.close(response);
                }
            })


        } catch (error) {
            console.trace(error)
        }
    }


    async onSave() {

        try {
            let tituloModal = "Guardar";

            if (!this.validForm(tituloModal)) return

            showLoader();
            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoCompra({
                idPuntoEmision: this.data.idPuntoEmision,
                codigoDocumento: this.TIPO_DOC.codigo
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
                title: '<small>Guardar Documento</small>',
                html: `<small>Esta seguro de guardar este Consolidación Nro. <b>${this.nroDocumentoSecuencial}</b>?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false
            })

            if (isConfirmed) {

                showLoader();

                let consolidacion = Object.assign({}, this.data);
                consolidacion.fechaEmision = this._fS.formatDateTimeZone(this.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                let data = {
                    consolidacion,
                    detalle: this.gridOptions.data
                }

                await this._mS.getData('post', '/ConsolidacionInventario/Post', data).then(response => {
                    if (response.id === '0') {
                        this._fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.id === "1") {
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        this.$uibModalInstance.close(response);
                    }
                })


            }

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
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
            await this._storageSvc.askToSaveDetailDoc("consolidacionDetail", this.gridOptions.data);
            this.$uibModalInstance.close();
        } catch (error) {
            console.log(error)
        }
    }

}





export class ModalConsolidacionImportacionCtrl extends ModalBaseCtrl {
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'uiGridConstants', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params'];

    constructor($scope, $timeout, $uibModalInstance, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreConst,
            _tS,
            _fS,
            _params
        })

        const self = this;

        this.TIPO_DOC = this._commonSvc.tipoDoc['CIV']
        this.uiGridConstants = uiGridConstants;
        this._params = _params;

        this.data = {};
        this.data.fechaEmision = new Date();

        this.gridOptions = {
            showColumnFooter: true,

            enableRowSelection: true,
            enableRowHeaderSelection: false,
            showGridFooter: true
        }

        this.gridOptions.columnDefs = [{
                name: 'N°',
                field: 'num',
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                width: '10%',
                minWidth: '100',
            },
            {
                name: 'Descripción',
                field: 'descripcion',
                allowCellFocus: false,
                width: '30%',
                minWidth: '100',
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
            },
            // { name: 'Tipo Articulo', field:'tipoArticulo', allowCellFocus : false },
            // { name: 'Sub Familia', field:'subFamilia', allowCellFocus : false },
            {
                name: 'Cantidad',
                field: 'cantidad',
                width: '3%',
                minWidth: '100',
            },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                width: '8%',
                minWidth: '100',
            },
            {
                name: 'Medida',
                field: 'medida',
                width: '8%',
                minWidth: '100',
            },
            {
                name: 'Iva',
                field: 'tipoIva',
                width: '8%',
                minWidth: '100',
            },
            {
                name: 'Bodega',
                field: 'idBodega',
                width: '15%',
                minWidth: '100',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'mapBodega:grid.appScope.$ctrl.bodegas',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
            },
            {
                name: 'Total',
                field: 'total',
                width: '8%',
                minWidth: '100',
                aggregationType: self.uiGridConstants.aggregationTypes.sum,
                customTreeAggregationFinalizerFn: function (aggregation) {
                    aggregation.rendered = aggregation.value;
                },
                aggregationLabel: "Total: ",
                footerCellFilter: 'number:2',
            },


        ]
    }

    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos[0];

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.data.codEstab = dataEstab.codEstab;
                this.cloneCodEstab = dataEstab.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];

                if (this.puntosEmision.length > 0) {
                    this.data.idPuntoEmision = this.puntosEmision[0].idPuntoEmision;
                } else {

                }

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }

            this.decimal = resultsDataForm[1][0]
            this.tipoIvas = resultsDataForm[3];


            let json = {
                checkBoxConsolidar: true,

            }

            this._mS.getData('get', '/Articulo/Get?json=' + JSON.stringify(json)).then(response => {

                if (response.code == "0") {
                    console.warn(response.message)
                    return
                }

                this.articulosImportados = JSON.parse(response.payload) || [];
                let num = 1;
                this.gridOptions.data = this.articulosImportados.map(item => ({
                    ...item,
                    idBodega: this.idBodega,
                    cantidad: item.stock,
                    total: item.stock * item.precioCosto,
                    num: num++
                }))
            })

            this.$scope.$apply();

        } catch (error) {

            console.log(error)

        } finally {

            hideLoader();
        }

    }

    setStyle() {
        return {}
    }


    async askToSave() {
        try {

            if (!this.data.codEstab || this.data.codEstab === 0) {
                this._tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }

            if (!this.data.idPuntoEmision || this.data.idPuntoEmision === 0) {
                this._tS.toastr('warning', 'Seleccione el Punto de Emisión');
                return
            }

            if (!this.data.fechaEmision) {
                this._tS.toastr('warning', 'Seleccione la Fecha de Emisión');
                return
            }

            if (this.gridOptions.data.length === 0) {
                this._tS.toastr('warning', 'No hay articulos a Consolidar');
                return
            }

            if (this.gridOptions.data.some(item => ["", null, undefined, 0].includes(item.idBodega))) {
                this._tS.toastr('warning', 'La bodega en el detalle es requerido');
                return
            }

            let nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoCompra({
                idPuntoEmision: this.data.idPuntoEmision,
                codigoDocumento: this.TIPO_DOC.codigo
            })

            if (!nroDocumentoSecuencial) throw "NO SE GENERÓ CORRECTAMENTE EL NÚMERO SECUENCIAL"

            let textAccion = 'Guardar';

            let {
                isConfirmed
            } = await Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro de ${textAccion} este <strong>Consolidación de Inventario</strong> Nro. <b>${nroDocumentoSecuencial}</b> ahora?</small>`,
                showConfirmButton: true,
                confirmButtonText: `Si, ${textAccion}`,
                showCancelButton: true,
                cancelButtonText: 'No, Cancelar',
                allowOutsideClick: false
            })

            if (!isConfirmed) return


            showLoader();
            let consolidacion = Object.assign({}, this.data);
            consolidacion.fechaEmision = this._fS.formatDateTimeZone(this.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

            let data = {
                consolidacion,
                detalle: this.gridOptions.data
            }

            this._mS.getData('post', '/ConsolidacionInventario/Post', data).then(response => {
                if (response.id === '0') {
                    hideLoader();
                    this._fS.sweetAlert('warning', response.message, response.titleSms);
                }
                if (response.id === "1") {
                    hideLoader();
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);

                    if (!this.isCloseModal) {
                        this.$uibModalInstance.close(response);
                        return
                    }

                    this.$onInit();
                }
            })


        } catch (error) {
            console.trace(error)
        }




    }

}




export class ModalConsolidacionEditarCtrl extends ModalConsolidacionCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'uiGridConstants', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params'];

    constructor($scope, $timeout, $uibModalInstance, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            uiGridConstants,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreConst,
            _tS,
            _fS,
            _params
        })

        let {
            TIPO_REGISTRO,
            data
        } = _params;
        let {
            dataDocumento,
            detalleDocumento
        } = data;

        this.TIPO_REGISTRO = TIPO_REGISTRO;
        this.data = dataDocumento;
        this.detalleDocumento = detalleDocumento;


        this.disabledInputFechaEmision = true;

    }


    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.codEstab === this.data.codEstab);

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.cloneCodEstab = this.data.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }


            this.decimal = resultsDataForm[1][0];

            this.setColumnDefs();

            this.gridOptions.data = this.detalleDocumento;

            this.$scope.$apply();

        } catch (error) {

            console.log(error)

        } finally {

            hideLoader();
        }
    }



    async onSave() {

        try {
            let tituloModal = "Actualizar";

            if (!await this.validForm(tituloModal)) return

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
                title: '<small>Actualizar Documento</small>',
                html: `<small>Esta seguro de actualizar la Consolidación?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, actualizar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false
            })

            if (isConfirmed) {

                showLoader();

                let consolidacion = Object.assign({}, this.data);
                consolidacion.fechaEmision = this._fS.formatDateTimeZone(this.data.fechaEmision, "YYYY-MM-DD HH:mm:ss A")

                let data = {
                    consolidacion,
                    detalle: this.gridOptions.data
                }

                await this._mS.getData('put', '/ConsolidacionInventario/Put?id=' + this.data.idConsolidacionInventario, data).then(response => {
                    if (response.id === '0') {
                        this._fS.sweetAlert('warning', response.message, response.titleSms);
                    }
                    if (response.id === "1") {
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                        this.$uibModalInstance.close(response);
                    }
                })


            }

        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }



}





export class ModalConsolidacionDetalleCtrl extends ModalConsolidacionCtrl {

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'uiGridConstants', 'mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', 'params'];

    constructor($scope, $timeout, $uibModalInstance, uiGridConstants, _mS, _commonSvc, _modalSvc, _nombreConst, _tS, _fS, _params) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            uiGridConstants,
            _mS,
            _commonSvc,
            _modalSvc,
            _nombreConst,
            _tS,
            _fS,
            _params
        })

        let {
            TIPO_REGISTRO,
            data
        } = _params;
        let {
            dataDocumento,
            detalleDocumento
        } = data;

        this.TIPO_REGISTRO = TIPO_REGISTRO;
        this.data = dataDocumento;
        this.detalleDocumento = detalleDocumento;



    }


    async $onInit() {

        try {
            showLoader();
            let resultsDataForm = await this.initiload();

            this.establecimientos = resultsDataForm[0];

            if (this.establecimientos.length > 0) {

                let dataEstab = this.establecimientos.find(item => item.codEstab === this.data.codEstab);

                let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);

                this.cloneCodEstab = this.data.codEstab;

                this.puntosEmision = resultsDataFormEstab[0];

                this.bodegas = resultsDataFormEstab[1];
                this.idBodega = this.bodegas.length > 0 ? this.bodegas[0].idBodega : 0;
                this.cloneIdBodega = this.idBodega;

            } else {
                this._tS.toastr('info', 'NO TIENE ASIGNADO NINGÚN ESTABLECIMIENTO');
            }


            this.decimal = resultsDataForm[1][0];

            this.setColumnDefsView();

            this.gridOptions.data = this.detalleDocumento;

            this.$scope.$apply();

        } catch (error) {

            console.log(error)

        } finally {

            hideLoader();
        }
    }
}




export class ModalConsolidacionFiltroCtrl extends ModalBaseCtrl {
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params']
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params) {
        super({
            $scope,
            $timeout,
            $uibModalInstance,
            _mS,
            _commonSvc,
            _tS,
            _fS,
            _params
        })

    }


    $onInit() {
        console.log(this)
    }


    closeModal() {
        this.$uibModalInstance.close()
    }
}