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