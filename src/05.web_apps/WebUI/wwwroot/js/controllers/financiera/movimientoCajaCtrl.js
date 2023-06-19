class MovimientoCajaBase {
    constructor($http, _modalSvc, $uibModalInstance, _toastr, _form) {
        this.$http = $http;
        this._modalSvc = _modalSvc;
        this.$uibModalInstance = $uibModalInstance;
        this._toastr = _toastr;
        this._form = _form;

        this.data = {}
        this.initiload();
    }

    initiload() {
        this.$http.get('/EntidadFinanciera/OptionEntidadFinanciera').then(({
            data: response
        }) => {
            this.entidadesFinancieras = response.data;
        })
    }

    //Get Sub Entidad Financiera 
    getSubEntidadByEntidadFinanciera() {
        this.$http.get('/SubEntidadFinanciera/GetByIdEntidadFinanciera?idEntidadFinanciera=' + this.data.idEntidadFinanciera)
            .then(({
                data: response
            }) => {
                this.subEntidades = response.data;
                this.data.idSubEntidadFinanciera = this.subEntidades[0].idSubEntidadFinanciera;
            }, error => console.log(error));
    }

}

//Modal Movimiento Caja 

class ModalMovimientoCajaCtrl extends MovimientoCajaBase {
    static $inject = ['$http', '$q', 'mainService', 'commonService', 'modalService', '$uibModalInstance', 'formulario', 'toastService']
    constructor($http, $q, _mS, _commonSvc, _modalSvc, $uibModalInstance, _form, _toastr) {
        super($http, _modalSvc, $uibModalInstance, _toastr, _form)
        this.$q = $q;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this.tipoDocumentos = [];
        this.cajas = [];

        this.data = {};

        this.searchEmpleado = ModalMovimientoCajaCtrl.searchEmpleado

    }

    async $onInit() {

        try {
            let results = await Promise.all([
                this._mS.getData('get', '/TipoDocumento/GetAll').then(response => response.data),
                this._commonSvc.getEstabAsign(),
            ])

            this.tipoDocumentos = results[0].filter(val => val.codigo === "IC" || val.codigo == "EC");

            this.establecimientos = results[1];

            if (this.establecimientos.length > 0) {
                let dataEstab = this.establecimientos[0];
                this.data.codEstab = dataEstab.codEstab;

                this._commonSvc.getDataFormEstabAsig(dataEstab).then(response => {
                    this.cajas = response[3];

                    if (this.cajas.length > 0) {
                        this.data.idCaja = this.cajas[0].idCaja
                    }

                })
            } else {
                this._toastr.toastr('warning', 'No tienes asignado ningún Establecimiento!')
            }

        } catch (error) {
            console.log(error)
        }
    }

    $onDestroy() {

    }

    //Buscar Empleado 
    static searchEmpleado(busqueda) {
        return this.$http.get('/Empleado/Search?busqueda=' + busqueda).then(response => {
            return response.data.data
        })
    }

    onKeyupSearchEmpleado(text) {
        if (text === null || text === undefined || text === "") {
            this.data.idEmpleado = '';
        }
    }

    selectedEmpleadoChange(item) {
        this.data.idEmpleado = item.idEmpleado;
    }

    guardarMovCaja() {
        const tituloToast = 'Guardar';

        if (!this.data.codEstab) {
            this._toastr.toastr('warning', 'Seleccione la Caja', tituloToast);
        }

        if (this._form.campo(this.data.idCaja)) {
            this._toastr.toastr('warning', 'Seleccione la Caja', tituloToast);
            return
        }

        if (this._form.campo(this.data.idTipoDocumento)) {
            this._toastr.toastr('warning', 'Seleccione el Tipo Documento', tituloToast);
            return
        }

        if (this._form.campo(this.data.idEntidadFinanciera)) {
            this._toastr.toastr('warning', 'Seleccione la Entidad Financiera', tituloToast);
            return
        }

        if (this._form.campo(this.data.idSubEntidadFinanciera)) {
            this._toastr.toastr('warning', 'Seleccione la Entidad Financiera', tituloToast);
            return
        }

        if (this._form.campo(this.data.idEmpleado)) {
            this._toastr.toastr('warning', 'Seleccione el Empleado', tituloToast);
            return
        }

        if (this._form.campo(this.data.valor) || isNaN(this.data.valor)) {
            this._toastr.toastr('warning', 'Ingrese el Valor', tituloToast);
            return
        }

        if (Number(this.data.valor) === 0) {
            this._toastr.toastr('warning', 'El valor tiene que ser mayor a 0', tituloToast);
            return
        }

        if (this._form.campo(this.data.observaciones)) {
            this._toastr.toastr('warning', 'Ingrese la Observación', tituloToast);
            return
        }

        this._mS.getData('post', '/MovimientoCaja/Insert', this.data).then(response => {
            if (response.id === "0") {
                this._toastr.toastr('warning', response.message)
                return
            }

            if (response.id === "1") {
                this._toastr.toastr('success', response.message)
                this.$uibModalInstance.close(response);
            }
        })
    }

    closeModal() {
        this.$uibModalInstance.close();
    }
}



//Modal Anticipo 

class ModalAnticipoCtrl extends MovimientoCajaBase {
    static $inject = ['$http', 'mainService', 'commonService', '$uibModalInstance', 'modalService', 'toastService', 'formulario'];
    constructor($http, _mS, _commonSvc, $uibModalInstance, _modalSvc, _toastr, _form) {
        super($http, _modalSvc, $uibModalInstance, _toastr, _form)

        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this.tipoRegistro = 1;
        this.clienteSearch = ModalAnticipoCtrl.clienteSearch

    }

    $onInit() {
        this._commonSvc.getEstabAsign().then(response => {
            this.establecimientos = response;
            if (this.establecimientos.length > 0) {
                this.data.codEstab = this.establecimientos[0].codEstab
            } else {
                this._toastr.toastr('warning', 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO')
            }
        })
    }

    static clienteSearch(text) {
        return this._commonSvc.clienteSearch(text)
    }

    onKeyupSearchCliente(text) {
        if (text === '') {
            this.selectedClientePersonalizado = '';
            this.data.idCliente;
        }
    }

    selectedClienteChange(item) {
        this.data.idCliente = item.idCliente;
    }

    guardarAnticipo() {
        const tituloToast = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';

        if (!this.data.codEstab) {
            this._toastr.toastr('warning', 'Seleccion el Establecimiento', tituloToast);
            return
        };

        if (this._form.campo(this.data.idCliente)) {
            this._toastr.toastr('warning', 'Seleccion el Cliente', tituloToast);
            return
        };

        if (this._form.campo(this.data.idEntidadFinanciera)) {
            this._toastr.toastr('warning', 'Seleccione la Entidad Financiera', tituloToast);
            return
        }

        if (this._form.campo(this.data.idSubEntidadFinanciera)) {
            this._toastr.toastr('warning', 'Seleccione la Entidad Financiera', tituloToast)
            return
        }

        if (this._form.campo(this.data.valor) || isNaN(this.data.valor)) {
            this._toastr.toastr('warning', 'Ingrese el Valor', tituloToast)
            return
        }

        if (Number(this.data.valor) === 0) {
            this._toastr.toastr('warning', 'El valor tiene que ser mayor a 0', tituloToast);
            return
        }

        this._mS.getData('post', '/Anticipo/Insert', this.data).then(response => {
            if (response.id === "0") {
                this._toastr.toastr('warning', response.message, response.titleSms)
                return
            }

            if (response.id === "1") {
                this.$uibModalInstance.close(response);
                this._toastr.toastr('success', response.message, response.titleSms);
            }
        })
    }


    closeModal() {
        this.$uibModalInstance.close();
    }
}


class MovimientoCajaCtrl {
    static $inject = ['$http', 'mainService', '$q', 'commonService', 'modalService', 'formulario', 'toastService'];
    constructor($http, _mS, $q, _commonSvc, _modalSvc, _form, _tS) {
        this.$http = $http;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._modalSvc = _modalSvc;
        this._form = _form;
        this._tS = _tS;

        this.accion = {};

        //Filters                        
        this.dataSearch = {};
        this.dataSearchAnticipo = {};
        this.meses = _form.meses();
        this.dataSearch.mes = new Date().getMonth() + 1;
        this.dataSearchAnticipo.mes = new Date().getMonth() + 1;


        this.estados = [];
        this.movCajas = [];
        this.anticipos = [];

        this.searchEmpleado = ModalMovimientoCajaCtrl.searchEmpleado
        this.clienteSearch = ModalAnticipoCtrl.clienteSearch

    }

    async $onInit() {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     this.accion = accion[0];
        // }

        await this._commonSvc.getEstabAsign().then(response => {
            this.establecimientos = response;

            if (this.establecimientos.length > 0) {
                this.dataSearch.codEstab = this.establecimientos[0].codEstab;
                this.dataSearchAnticipo.codEstab = this.establecimientos[0].codEstab;
            } else {
                this._tS.toastr('warning', 'No tienes Asignado Ningún Establecimiento')
            }
            console.log(response)
        })

        this.getMovCajas();
        this.getAnticipos();
        this.getAllEstado();
    }


    //Get Movimientos Caja
    getMovCajas() {
        try {

            showLoader();
            this._mS.getData('get', '/MovimientoCaja/Get?json=' + JSON.stringify(this.dataSearch)).then(response => {
                if (response.id === "0") {
                    hideLoader();
                    toastr.warning(response.message, response.titleSms);
                    return
                }

                this.movCajas = JSON.parse(response.data) || [];
                hideLoader();
            })
        } catch (error) {
            hideLoader();
        }
    }


    //Get Anticipos 
    getAnticipos() {
        this._mS.getData('get', '/Anticipo/Get?json=' + JSON.stringify(this.dataSearchAnticipo)).then(response => {
            if (response.id === "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            this.anticipos = JSON.parse(response.data) || []
        })
    };

    getAllEstado() {
        this._commonSvc.getEstadoDocByCodDoc('FV').then(response => {
            this.estados = response;
        })
    }

    openModalAddUpdate() {
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalMovimientoCajaCtrl,
            template: 'MovimientoCaja/_ModalMovimientoCaja.cshtml',
            size: 'lg',

        })
        modalRef.result.then(result => {
            if (typeof result === 'object') {
                this.getMovCajas();
            }
        })
    }

    openModalFiltroMovCaja() {
        $("#modalFiltroMovimientoCaja").modal('show');
    }

    onChangeFechaFilter() {
        this.mes = new Date().getMonth() + 1;
        this.getFechaInicioFinFilter('fechaAnticipo');
    }

    onChangeFechaFilterMovimientoCaja() {
        this.mes = new Date().getMonth() + 1;
        this.getFechaInicioFinFilter();
    }


    getFechaInicioFinFilter(tipo) {
        if (tipo === "fechaAnticipo") {
            let {
                fechaInicio,
                fechaFin
            } = this._form.getFechaInicioFinFilter(this.dataSearchAnticipo.mes);
            this.dataSearchAnticipo.fechaInicio = fechaInicio;
            this.dataSearchAnticipo.fechaFin = fechaFin;
            return
        }
        let {
            fechaInicio,
            fechaFin
        } = this._form.getFechaInicioFinFilter(this.dataSearch.mes);
        this.dataSearch.fechaInicio = fechaInicio;
        this.dataSearch.fechaFin = fechaFin;
    }

    // //Buscar Empleado 
    // searchEmpleado(busqueda){
    //     return this.$http.get('/Empleado/Search?busqueda='+busqueda).then(response=>{                         
    //         return response.data.data
    //     })
    // }

    onKeyupSearchEmpleado(text) {
        if (text === null || text === undefined || text === "") {
            this.dataSearch.byEmpleado = '';
        }
    }

    selectedEmpleadoChange(item) {
        this.dataSearch.byEmpleado = item.idEmpleado;
    }

    filtrarMovimientoCaja() {
        if (this.dataSearch.checkBoxFecha) {
            if (this._form.campo(this.dataSearch.fechaInicio)) {
                toastr.warning('Ingrese Fecha de Inicio');
                return
            }
            if (this._form.campo(this.dataSearch.fechaFin)) {
                toastr.warning('Ingrese Fecha Fin')
            }
        }

        if (this.dataSearch.checkBoxEmpleado) {
            if (this._form.campo(this.dataSearch.byEmpleado)) {
                toastr.warning('Seleccione el Empleado');
                return
            }
        }

        if (this.dataSearch.checkBoxEstado) {
            if (this._form.campo(this.dataSearch.byEstado)) {
                toastr.warning('Seleccione el Estado');
                return
            }
        }

        this.getMovCajas();
        $("#modalFiltroMovimientoCaja").modal('hide');
    }


    getPrint(item) {
        let parameters = {
            isPrint: 1,
            idMovimientoCaja: item.idMovimientoCaja,
            codEstab: item.codEstab,
            codigo: 'MCPT',
        }


        this._commonSvc.askToPrint({
            parameters: JSON.stringify(parameters)
        })
    }

    //Print Section
    print(parameters) {
        try {
            showLoader();
            let url = parameters.urlPrintService;
            let dataPrint = {
                rdlcProps: {
                    printerName: parameters.printerName,
                    rdlcName: parameters.rdlName
                },
                rdlcParams: parameters.rdlcParams[0]
            }

            this._mS.getData('post', url, dataPrint).then(({
                data: response
            }) => {
                if (response.code == "1") {
                    hideLoader();
                    toastr.success(response.message, "")
                } else {
                    showLoader();
                    toastr.warning(response.message, "")
                }
            })
        } catch (error) {
            console.log(error)
        }
    }



    getReport(item) {
        try {
            let format = 'pdf';

            let dataParms = {
                id: item.idMovimientoCaja,
            }



            const parameters = {
                hasService: true,                
                reportParams: JSON.stringify({
                    hasParams: false,
                    codigo: 'RMIE',
                    format,
                    codEstab: item.codEstab,
                    aditionalParams: []
                }),
                dataParams: JSON.stringify(dataParms)
            }

            this._commonSvc.getReport({
                parameters,
                formatType: format
            })
        } catch (error) {
            console.log(error)
        }      
    }






    //-------------------------------------Tab Anticipo -----------------------
    openModalAnticipoNew() {
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalAnticipoCtrl,
            template: 'MovimientoCaja/_ModalAnticipo.cshtml',
            size: 'md'
        })

        modalRef.result.then(result => {
            if (typeof result === 'object') {
                this.getAnticipos();
            }
        })
    }


    openModalFiltroAnticipo() {
        $("#modalFiltroAnticipo").modal('show');
    }

    onKeyupSearchCliente(text) {
        if (text === '') {
            this.selectedCliente = '';
            this.dataSearchAnticipo.byCliente;
        }
    }

    selectedClienteChange(item) {
        this.dataSearchAnticipo.byCliente = item.idCliente;
    }

    filtrarAnticipo() {

        if (!this.dataSearchAnticipo.codEstab) {
            toastr.warning('Seleccione el Establecimiento');
            return
        }

        if (this.dataSearchAnticipo.checkBoxFecha) {
            if (this._form.campo(this.dataSearchAnticipo.fechaInicio)) {
                toastr.warning('Ingrese Fecha de Inicio');
                return
            }
            if (this._form.campo(this.dataSearchAnticipo.fechaFin)) {
                toastr.warning('Ingrese Fecha Fin');
                return
            }
        }

        if (this.dataSearchAnticipo.checkBoxCliente) {
            if (this._form.campo(this.dataSearchAnticipo.byCliente)) {
                toastr.warning('Seleccione el Cliente');
                return
            }
        }

        if (this.dataSearchAnticipo.checkBoxEstado) {
            if (this._form.campo(this.dataSearchAnticipo.byEstado) || this.dataSearchAnticipo.byEstado === 0) {
                toastr.warning('Seleccione el Estado');
                return
            }
        }

        this.getAnticipos();
        $("#modalFiltroAnticipo").modal('hide');

    }





}

app.controller('movimientoCajaCtrl', MovimientoCajaCtrl).name

// export { movimientoCajaCtrl}