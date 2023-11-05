export class ModalBaseCtrl {
    constructor({
        _mS,
        $timeout,
        $uibModalInstance,
        _form,
        _toast,
        _params
    }) {
        this._mS = _mS;
        this.$timeout = $timeout
        this.$uibModalInstance = $uibModalInstance;
        this._form = _form;
        this._toast = _toast;
        this._params = _params;
        this.data = {};
    }

    initiload() {
        return Promise.all([
            this._mS.getData('get', '/EntidadFinanciera/OptionEntidadFinanciera').then(response => response.data),
            this._mS.getData('get', '/Banco/GetByAll').then(response => response.data),
            this._mS.getData('get', '/Ciudad/ReadCiudadProvincia').then(response => response.data)
        ])
    }

    async getSubEntidadFinanciera() {
        const idEntidadFinanciera = this.entidadFinanciera.idEntidadFinanciera
        this.subEntidadesFinancieras = await this._mS.getData('get', `/SubEntidadFinanciera/GetByIdEntidadFinanciera?idEntidadFinanciera=${idEntidadFinanciera}`)
            .then(response => response.data);
        if (this.subEntidadesFinancieras.length > 0) {
            this.$timeout(() => {
                this.subEntidadFinanciera = this.subEntidadesFinancieras[0];
            })
        }
    }

    validarAbono() {
        if (this._form.campo(this.data.valorAbono)) {
            this._toast.toastr('warning', 'Ingrese el Valor Abono');
            return
        }

        if (Number(this.data.valorAbono) === 0) {
            this._toast.toastr('warning', 'El Valor a cancelar debe ser mayor 0');
            return
        }

        if (this._form.campo(this.data.fechaEmision)) {
            this._toast.toastr('warning', 'Ingrese la Fecha de Emisión')
            return
        }

        if (this.entidadFinanciera.codigo === "CHE") {
            if (this._form.campo(this.data.idCiudad) || this.data.idCiudad === 0) {
                this._toast.toastr('warning', 'Seleccione la Ciudad');
                return
            }

            if (this._form.campo(this.banco.idBanco)) {
                this._toast.toastr('warning', 'Seleccione el Banco', 'Pago');
                return
            }
            if (this._form.campo(this.data.nro)) {
                this._toast.toastr('warning', 'Ingrese el Número', 'Pago');
                return
            }
        }

        //Si es tarjeta de credito 
        if (this.entidadFinanciera.codigo === "TAR") {
            if (this._form.campo(this.data.nro)) {
                this._toast.toastr('warning', 'Ingrese el Número');
                return
            }

            if (this._form.campo(this.data.idCiudad) || this.data.idCiudad === 0) {
                this._toast.toastr('warning', 'Seleccione la Ciudad');
                return
            }
            if (this._form.campo(this.data.referencia)) {
                this._toast.toastr('warning', 'Ingrese la Referencia');
                return
            }
            if (this._form.campo(this.data.aprobacion)) {
                this._toast.toastr('warning', 'Ingrese la Aprobación');
                return
            }
            if (this._form.campo(this.data.lote)) {
                this._toast.toastr('warning', 'Ingrese el Lote');
                return
            }

        }

        //Si es tranferencia 
        if (this.entidadFinanciera.codigo == "TRA") {
            if (this._form.campo(this.banco.idBanco)) {
                this._toast.toastr('warning', 'Seleccione el Banco');
                return
            }
            if (this._form.campo(this.data.nro)) {
                this._toast.toastr('warning', 'Ingrese el Número');
                return
            }
        }

        return true
    }

    closeModal() {
        this.$uibModalInstance.close();
    }
}


export class FormaCobroPagoCtrl extends ModalBaseCtrl {
    static $inject = ['mainService', '$timeout', '$uibModalInstance', 'formulario', 'toastService', 'params']
    constructor(_mS, $timeout, $uibModalInstance, _form, _toast, _params) {
        super({
            _mS,
            $timeout,
            $uibModalInstance,
            _form,
            _toast,
            _params
        })

        this._params = _params;
        this.tituloModal = this._params.tituloModal;
        this.data = this._params.data;
        this.documentos = this._params.documentos;
        this.data.valorAbono = this.data.saldo;
        this.data.fechaEmision = new Date();
        this.data.posFechado = false;

        this.banco = {};
        this.cuentaBancaria = {};
        this.abonoEntidadesFinancieras = this._params.abonoEntidadesFinancieras;


    }

    $onInit() {

        this.$timeout(async () => {
            const results = await this.initiload();
            let entidadesFinancieras = results[0];

            if (!this._params.isPaymentDocument) {
                entidadesFinancieras = entidadesFinancieras.filter(item => item.codigo !== 'DOC');
            }

            this.entidadesFinancieras = entidadesFinancieras;
            this.entidadFinanciera = this.entidadesFinancieras.find(val => val.codigo == 'EFE');
            this.selectedIndex = this.entidadesFinancieras.findIndex(item => item.codigo === this.entidadFinanciera.codigo)
            this.getSubEntidadFinanciera();



            this.bancos = results[1];
            this.ciudadProvincias = results[2];
        }, 0)
    }

    onChangeTabEntidadFinanciera() {
        this.entidadFinanciera = this.entidadesFinancieras[this.selectedIndex];
        this.getSubEntidadFinanciera();
        this.resetData();

        if (this.entidadFinanciera.codigo !== 'CHE') return

        //Pago 
        if (this._params.typePayment === 'P') {
            this.data.referencia = this._params.referencia;
        } else {
            this.data.referencia = JSON.parse(localStorage.getItem('userData')).tradeName
        }

    }

    resetData() {
        this.data.valorAbono = this.data.saldo;
        this.data.idCiudad = 0;
        this.data.nro = '';
        this.data.posFechado = false;
        this.data.aprobacion = '';
        this.data.lote = '';
        this.data.referencia = '';
        this.banco = {};
        this.data.fechaEmision = new Date();
        this.data.tipoDocumento = null;
        this.data.idTipoDocumento = null;
        this.data.idComprobante = null;

    }


    addFormaCobroPago() {
        if (this.validarAbono()) {
            this.data.secuencial = this.abonoEntidadesFinancieras.length + 1;
            this.sharedDataCloseModal();
        }
    }

    agregarCobroPagoDocumento(item) {
        if (this.abonoEntidadesFinancieras.some(val => val.idComprobante == item.idComprobante)) {
            Swal.fire({
                icon: 'warning',
                html: `<small>Este documento ya se agregó.</small>`
            });
            return
        }

        this.data.valorAbono = item.total
        this.data.nro = item.nroDocumento;
        this.data.tipoDocumento = item.tipoDocumento;
        this.data.idTipoDocumento = item.idTipoDocumento;
        this.data.idComprobante = item.idComprobante;
        this.data.secuencial = this.abonoEntidadesFinancieras.length + 1;

        this.sharedDataCloseModal();
    }

    sharedDataCloseModal() {
        const data = {
            entidad: this.entidadFinanciera.descripcion,
            subEntidad: this.subEntidadFinanciera.descripcion,
            idEntidadFinanciera: this.entidadFinanciera.idEntidadFinanciera,
            idSubEntidadFinanciera: this.subEntidadFinanciera.idSubEntidadFinanciera,
            idBanco: this._form.campo(this.banco.idBanco) ? 0 : this.banco.idBanco,
            idCuentaBancaria: this._form.campo(this.cuentaBancaria.idCuentaBancaria) ? 0 : this.cuentaBancaria.idCuentaBancaria,
            valor: this.data.valorAbono,
            posFechado: this.data.posFechado,
            fechaEmision: this.data.fechaEmision,
            nro: this.data.nro,
            tipoDocumento: this.data.tipoDocumento,
            referencia: this.data.referencia,
            aprobacion: this.data.aprobacion,
            lote: this.data.lote,
            idCiudad: this._form.campo(this.data.idCiudad) ? 0 : this.data.idCiudad,
            idTipoDocumento: this.data.idTipoDocumento,
            idComprobante: this.data.idComprobante,
            secuencial: this.data.secuencial,
            abono: 0,
            controlCaja: this.subEntidadFinanciera.controlCaja
        }

        this.$uibModalInstance.close(data);
        this.data = {};
    }
}




export class ModalFormaCobroCtrl extends ModalBaseCtrl {
    static $inject = ['mainService', '$timeout', '$uibModalInstance', 'formulario', 'toastService', 'params']
    constructor(_mS, $timeout, $uibModalInstance, _form, _toast, _params) {
        super({
            _mS,
            $timeout,
            $uibModalInstance,
            _form,
            _toast,
            _params
        })

        this._params = _params || {}
        this.tituloModal = this._params.tituloModal;
        this.data = this._params.data;
        this.documentos = this._params.documentos;
        this.data.valorAbono = this.data.saldo;
        this.data.fechaEmision = new Date();
        this.data.posFechado = false;

        this.banco = {};
        this.cuentaBancaria = {};
        this.abonoEntidadesFinancieras = this._params.abonoEntidadesFinancieras


    }


    async $onInit() {
        try {

            const results = await this.initiload();
            let entidadesFinancieras = results[0];

            if (!this._params.isPaymentDocument) {
                entidadesFinancieras = entidadesFinancieras.filter(item => item.codigo !== 'DOC');
            }


            this.entidadesFinancieras = entidadesFinancieras;
            this.entidadFinanciera = this.entidadesFinancieras.find(val => val.codigo == 'EFE');
            this.selectedIndex = this.entidadesFinancieras.findIndex(item => item.codigo === this.entidadFinanciera.codigo)
            this.getSubEntidadFinanciera();

            //Limpiar datos
            this.resetData();

            this.bancos = results[1];
            this.ciudadProvincias = results[2];
        } catch (error) {
            console.log(error)
        }
    }


    onChangeTabEntidadFinanciera() {
        this.entidadFinanciera = this.entidadesFinancieras[this.selectedIndex];
        this.getSubEntidadFinanciera();
        this.resetData();

        if (this.entidadFinanciera.codigo !== 'CHE') return

        this.data.referencia = JSON.parse(localStorage.getItem('userData')).tradeName


    }

    resetData() {
        this.data.valorAbono = this.data.saldo;
        this.data.idCiudad = 0;
        this.data.nro = null;
        this.data.posFechado = false;
        this.data.aprobacion = null;
        this.data.lote = null;
        this.data.referencia = null;
        this.banco = {};
        this.data.fechaEmision = new Date();
        this.data.tipoDocumento = null;
        this.data.idTipoDocumento = 0;
        this.data.idComprobante = 0;
    }


    addFormaCobro() {
        if (this.validarAbono()) {
            this.data.secuencial = this.abonoEntidadesFinancieras.length + 1;
            this.sharedDataCloseModal();
        }
    }

    agregarCobroDocumento(item) {
        if (this.abonoEntidadesFinancieras.some(val => val.idComprobante == item.idComprobante)) {
            this._form.sweetAlert('warning', 'Este documento ya se agregó al cobro!')
            return
        }

        this.data.valorAbono = item.total
        this.data.nro = item.nroDocumento;
        this.data.tipoDocumento = item.tipoDocumento;
        this.data.idTipoDocumento = item.idTipoDocumento;
        this.data.idComprobante = item.idComprobante;
        this.data.secuencial = this.abonoEntidadesFinancieras.length + 1;

        this.sharedDataCloseModal();
    }


    sharedDataCloseModal() {
        let data = {
            entidad: this.entidadFinanciera.descripcion,
            subEntidad: this.subEntidadFinanciera.descripcion,
            idEntidadFinanciera: this.entidadFinanciera.idEntidadFinanciera,
            idSubEntidadFinanciera: this.subEntidadFinanciera.idSubEntidadFinanciera,
            idBanco: this._form.campo(this.banco.idBanco) ? 0 : this.banco.idBanco,
            idCuentaBancaria: this._form.campo(this.cuentaBancaria.idCuentaBancaria) ? 0 : this.cuentaBancaria.idCuentaBancaria,
            valor: this.data.valorAbono,
            posFechado: this.data.posFechado,
            fechaEmision: this.data.fechaEmision,
            nro: this.data.nro,
            tipoDocumento: this.data.tipoDocumento,
            referencia: this.data.referencia,
            aprobacion: this.data.aprobacion,
            lote: this.data.lote,
            idCiudad: this._form.campo(this.data.idCiudad) ? 0 : this.data.idCiudad,
            idTipoDocumento: this.data.idTipoDocumento,
            idComprobante: this.data.idComprobante,
            secuencial: this.data.secuencial,
            abono: 0,
            controlCaja: this.subEntidadFinanciera.controlCaja
        }

        this.$uibModalInstance.close(data);
        this.data = {};
    }



    closeModal() {
        this.$uibModalInstance.close()
    }

}