import {
    CalculoTarifaHelper
} from './calculoTarifaHelper.min.js?v=0.3';

export class ArticuloTarifaGridOption {

    constructor(_form) {
        this.form = _form;
        this.config = {};
        this.precioCosto = 0;
        this.porcentajeIva = 0;
    }

    /**
     * @param {{}} config
     */
    set setConfigDecimal(config) {
        this.config = config;
    }

    /**
     * @param {any} precioCosto
     */
    set setPrecioCosto(precioCosto) {
        this.precioCosto = precioCosto;
    }



    get getPrecioCosto() {
        return this.precioCosto;
    }

    /**
     * @param {number} porcentajeIva
     */
    set setPorcentajeIva(porcentajeIva) {
        this.porcentajeIva = porcentajeIva;
    }

    get getPorcentajeIva() {
        return this.porcentajeIva;
    }

    checkPrecioCosto() {
        return !([null, undefined, "", 0].includes(this.getPrecioCosto));
    }

    getTarifaGrid($scope, $interval) {
        this.$scope = $scope;
        this.$interval = $interval;

        this.gridOptions = {
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            enableCellEdit: false,
            cellEditableCondition: () => {
                return this.checkPrecioCosto();
            },
            appScopeProvider: this,
            onRegisterApi: this.registerGridApi,
            columnDefs: this.getColumnDefs()
        };
        return this.gridOptions;
    }

    //Definimos los nombres de la columna de Tarifa 
    getColumnDefs = () => {
        return [{
                name: 'idTarifa',
                field: 'idTarifa',
                visible: false,
            },
            {
                name: 'tarifa',
                field: 'tarifa',
                enableCellEdit: false,
                width: '15%',
                minWidth: 100
            },
            {
                name: 'Tipo Iva',
                field: 'porcentajeIva',
                type: 'number',
                enableCellEdit: false,
                width: '5%',
                minWidth: 100
            },
            {
                name: 'precioVenta',
                field: 'precioVenta',
                enableCellEditOnFocus: true,
                enableCellEdit: true,
                allowCellFocus: true,
                type: 'number',
                width: '15%',
                minWidth: 100
            },
            {
                name: 'precioConIva',
                field: 'precioConIva',
                enableCellEditOnFocus: true,
                enableCellEdit: true,
                allowCellFocus: true,
                type: 'number',
                width: '15%',
                minWidth: 100
            },
            {
                name: 'porcentajeUtilidad',
                field: 'porcentajeUtilidad',
                type: 'number',
                enableCellEditOnFocus: true,
                enableCellEdit: true,
                allowCellFocus: true,
                width: '18%',
                minWidth: 100
            },

            {
                name: 'Utilidad',
                field: 'ganancia',
                type: 'number',
                enableCellEditOnFocus: true,
                width: '10%',
                minWidth: 100
            },
            {
                name: 'P. precioPredeterminado',
                field: 'precioPredeterminado',
                visible: false
            },
            {
                name: 'Estado',
                field: 'predeterminadaVal',
                enableCellEdit: false,
                type: 'checkbox',
                //cellTemplate: '<div class="text-center"><input type="checkbox"' +
                //    'name="radio" value="radio" ng-click="grid.appScope.updateDefault(row.entity)"/></div>', //'<md-switch style="display:inline;" title="Actualizar estado" aria-label="Predeterminado" ng-click="grid.appScope.updateDefault(row)"></md-switch>',

                width: '15%',
                minWidth: 100,
                cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (row.entity.precioPredeterminado) {

                        row.entity.predeterminadaVal = 'Predeterminado'
                        return 'blue';
                    }
                }
            }
        ]
    }

    registerGridApi(gridApi) {
        this.grdApi = gridApi;
        let _self = this.appScopeProvider;

        if (this.gridApi) {
            _self.$interval(() => {
                this.gridApi.core.handleWindowResize();
                this.gridApi.grid.refresh();
            }, 5);
        }

        gridApi.edit.on.afterCellEdit(_self.$scope, _self.afterCellEdit);
    }

    afterCellEdit(rowEntity, colDef, newValue, oldValue) {
        const _self = this.grid.appScope; //Get Scope         
        const index = _self.gridOptions.data.indexOf(rowEntity); //Obtenemos indice 

        let precioConIva = 0;
        let precioVenta = 0;
        let porcentajeUtilidad = 0;
        let ganancia = 0;

        //Validacion de Campos 
        if ([null, undefined, "", 0].includes(_self.getPrecioCosto) || isNaN(_self.precioCosto)) {
            toastr.warning('Ingrese el Precio de Costo');
            return
        }

        if (colDef.field === "precioVenta" && newValue === undefined || newValue === null) {
            rowEntity.precioVenta = oldValue;
        }

        if (colDef.field === "precioConIva" && newValue === undefined || newValue === null) {
            rowEntity.precioConIva = oldValue;
        }

        if (colDef.field === "porcentajeUtilidad" && newValue === undefined || newValue === null) {
            rowEntity.porcentajeUtilidad = oldValue;
        }




        console.log('test price')
        if (["precioVenta", "precioConIva"].includes(rowEntity[colDef.field]) && rowEntity[colDef.field] < 0) {
            // toastr.warning('El valor ingresado no tiene que ser menor a 0', '<h5>Hola</h5>');                        
            rowEntity[colDef.field] = oldValue;
            return
        }


        if (["precioVenta", "precioConIva"].includes(colDef.field) && rowEntity[colDef.field] < _self.precioCosto) {
            // toastr.warning('El valor no tiene que ser menor a Precio Costo');
            toastr.options.preventDuplicates = true;
            toastr.options.progressBar = true;
            rowEntity[colDef.field] = oldValue;
            return
        }





        //Calculos 
        switch (colDef.field) {
            case "precioVenta":
                precioConIva = CalculoTarifaHelper.calcularPrecioConIva(rowEntity.precioVenta, rowEntity.porcentajeIva);
                porcentajeUtilidad = CalculoTarifaHelper.campoPorcentajeUtilidad(_self.getPrecioCosto, rowEntity.precioVenta);

                _self.gridOptions.data[index].precioVenta = _self.form.roundNumber(rowEntity.precioVenta, _self.config.nroPrecio);
                _self.gridOptions.data[index].precioConIva = _self.form.roundNumber(precioConIva, _self.config.nroPrecio);
                _self.gridOptions.data[index].porcentajeUtilidad = _self.form.roundNumber(porcentajeUtilidad, 5);

                break;

            case "precioConIva":
                precioVenta = CalculoTarifaHelper.calcularPrecioVenta(rowEntity.precioConIva, rowEntity.porcentajeIva);
                porcentajeUtilidad = CalculoTarifaHelper.campoPorcentajeUtilidad(_self.getPrecioCosto, precioVenta);

                _self.gridOptions.data[index].precioConIva = _self.form.roundNumber(rowEntity.precioConIva, _self.config.nroPrecio);
                _self.gridOptions.data[index].precioVenta = _self.form.roundNumber(precioVenta, _self.config.nroPrecio);
                _self.gridOptions.data[index].porcentajeUtilidad = _self.form.roundNumber(porcentajeUtilidad, 5);

                break;
            case "porcentajeUtilidad":
                precioVenta = CalculoTarifaHelper.calcularPorcentajeUtilidad(_self.getPrecioCosto, rowEntity.porcentajeUtilidad);
                precioConIva = CalculoTarifaHelper.calcularPrecioConIva(precioVenta, rowEntity.porcentajeIva);

                _self.gridOptions.data[index].precioVenta = _self.form.roundNumber(precioVenta, _self.config.nroPrecio);
                _self.gridOptions.data[index].precioConIva = _self.form.roundNumber(precioConIva, _self.config.nroPrecio);
                break;
        }

        //alexis ramirez
        ganancia = rowEntity.precioVenta - _self.getPrecioCosto;
        _self.gridOptions.data[index].ganancia = _self.form.roundNumber(ganancia, 5);

    }

    getTarifaGanacia(precioVenta, precioCosto) {
        return precioVenta - precioCosto;
    }

    /**
     * @param {any} precioCosto
     */
    recalculateTarifaAdd() {

        if ([null, undefined, ""].includes(this.getPrecioCosto) || isNaN(this.getPrecioCosto)) {
            toastr.warning('Ingrese un número válido');
            return
        }
        if (this.getPrecioCosto === 0) {
            toastr.warning('El valor mínimo en el precio de costo es 0.01');
            return
        }

        //this.tarifaInstance.setPrecioCosto = this.data.precioCosto; 
        try {
            angular.forEach(this.gridOptions.data, (val, index) => {
                this.gridOptions.data[index].porcentajeIva = this.getPorcentajeIva;

                let precioVenta = CalculoTarifaHelper.calcularPrecioVenta(val.precioConIva, val.porcentajeIva);
                this.gridOptions.data[index].precioVenta = this.form.roundNumber(precioVenta, this.config.nroPrecio);

                let precioConIva = CalculoTarifaHelper.calcularPrecioConIva(val.precioVenta, val.porcentajeIva);
                this.gridOptions.data[index].precioConIva = this.form.roundNumber(precioConIva, this.config.nroPrecio);


                let porcentajeUtilidad = CalculoTarifaHelper.campoPorcentajeUtilidad(this.getPrecioCosto, precioVenta);
                this.gridOptions.data[index].porcentajeUtilidad = this.form.roundNumber(porcentajeUtilidad, 5);

                let ganancia = this.getTarifaGanacia(val.precioVenta, this.getPrecioCosto)
                this.gridOptions.data[index].ganancia = this.form.roundNumber(ganancia, 5);
            })
        } catch (error) {
            toastr.error(error)
        }

    }

    recalculateTarifaUpdate(opcionCalculate) {
        if ([null, undefined, 0].includes(this.getPrecioCosto) || isNaN(this.getPrecioCosto)) {
            toastr.warning('Ingrese un número válido');
            return
        }

        if (this.getPrecioCosto === 0) {
            toastr.warning('El valor mínimo en el precio de costo es 0.01');
            return
        }


        try {

            angular.forEach(this.gridOptions.data, (val, index) => {
                let precioConIva = 0,
                    porcentajeUtilidad = 0,
                    ganancia = 0;

                let precioVenta = CalculoTarifaHelper.calcularPorcentajeUtilidad(this.getPrecioCosto, val.porcentajeUtilidad)

                if (opcionCalculate === "optionPorcentaje") {
                    this.gridOptions.data[index].precioVenta = this.form.roundNumber(precioVenta, this.config.nroPrecio);

                    precioConIva = CalculoTarifaHelper.calcularPrecioConIva(val.precioVenta, val.porcentajeIva);
                    this.gridOptions.data[index].precioConIva = this.form.roundNumber(precioConIva, this.config.nroPrecio);
                }

                if (opcionCalculate === "optionPvp") {
                    porcentajeUtilidad = CalculoTarifaHelper.campoPorcentajeUtilidad(this.getPrecioCosto, val.precioVenta);
                    this.gridOptions.data[index].porcentajeUtilidad = this.form.roundNumber(porcentajeUtilidad, 5);
                }

                ganancia = this.getTarifaGanacia(val.precioVenta, this.getPrecioCosto)
                this.gridOptions.data[index].ganancia = this.form.roundNumber(ganancia, 5);
            })

        } catch (error) {
            toastr.error(error);
        }
    }
}