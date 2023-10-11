class ModalBaseCtrl {
    constructor(_params) {
        this._params = _params;

    }

    requestInitiload() {
        return [this._mS.getData('get', 'Config/Establecimiento/GetDataForm', null, true)]
    }

    onKeyupEmail(item) {
        let textChip = item.target.value || "";
        textChip = this._fS.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();
    }

    transformChipEmail(item) {
        if (!this.validarEmail(item)) {
            this._tS.toastr('warning', 'La dirección de email es incorrecta.')
        }
    }

    validarEmail(valor) {
        return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
    }

    closeModal() {
        this.$uibModalInstance.close();
    }

}



class ModalEstablecimientoCtrl extends ModalBaseCtrl {
    static $inject = ['$uibModalInstance', '$scope', 'mainService', 'toastService', 'params', 'formulario']
    constructor($uibModalInstance, $scope, _mS, _tS, _params, _fS) {
        super(_params)
        this.$uibModalInstance = $uibModalInstance;
        this.$scope = $scope;
        this._mS = _mS;
        this._tS = _tS;
        this._fS = _fS;
        this.tipoRegistro = this._params.tipoRegistro;
        this.data = {};

        this.data = {
            canton: null,
            actividad: null,
            agenteRetencion: null,
            contribuyente: null,
            estab: null,
            contribuyenteEspecial: null,
            obligadoContabilidad: 'NO',
            nombreComercial: null,
            dirEstablecimiento: null,
            contribuyenteRimpe: null
        }
        this.isDisabledRetencion = false;

        this.correos = [];
        this.telefonos = [];
    }

    async $onInit() {
        try {
            showLoader();
            let request = this.requestInitiload();
            //Editar
            if (this.tipoRegistro === 'E') {
                let json = {
                    id: this._params.idEstablecimiento
                }
                request.push(this._mS.getData('get', 'Config/Establecimiento/GetId?json=' + JSON.stringify(json), null, true))
            }

            let responses = await Promise.all(request);
            let results = JSON.parse(responses[0].payload) || [];
            this.cantones = results[0];
            this.actividadesEconomicas = results[1];
            this.agenteRetenciones = results[2];
            this.tipoContribuyentes = results[3];

            if (this.tipoRegistro === 'E') {
                this.data = JSON.parse(responses[1].payload)[0][0];
                this.canton = this.cantones.find(item => item.codigo === this.data.canton).descripcion;

                this.correos = this.data.correo ? this.data.correo.split(';') : [];
                this.telefonos = this.data.telefono ? this.data.telefono.split(';') : []

                this.$scope.$apply();
            }


        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    onChangeTipoContribuyente() {
        this.isDisabledAgenteRetencion = this.data.contribuyente == '03';
        if (this.isDisabledAgenteRetencion) {
            this.data.agenteRetencion = undefined;
        }
    }

    filterCanton(textFilter) {
        return this.cantones.filter(item => item.descripcion.toLowerCase().indexOf(textFilter.toLowerCase()) != -1)
    }

    onSelectCanton(item) {
        this.data.canton = item.codigo;
    }

    showInfoTipoContribuyente() {
        let dataInfo = this.tipoContribuyentes.find(item => item.codigo === this.data.contribuyente);
        if (!this.data.contribuyente || !dataInfo.contribuyenteRimpe) return

        Swal.fire({
            icon: 'info',
            html: `<small>${dataInfo.contribuyenteRimpe}</small>`
        })
    }

    showInfoActividadEc() {
        if (!this.data.actividad) return
        const groupActEconomica = this.actividadesEconomicas.find(item => item.codigo === this.data.actividad).grupo;
        Swal.fire({
            icon: 'info',
            html: `<small>${groupActEconomica}</small>`
        })
    }

    async onSave() {
        try {

            let tituloToast = this.tipoRegistro === 'N' ? 'Guardar' : 'Actualizar', method = this.tipoRegistro === 'N' ? 'post' : 'put';
            let url = '';

            if (!this.data.nombreComercial) {
                this._tS.toastr('warning', 'Ingrese Nombre Comercial', tituloToast)
                return
            }

            if (!this.data.estab) {
                this._tS.toastr('warning', 'Ingrese Nro. de Establecimiento', tituloToast)
                return
            }

            if (this.data.estab.length !== 3) {
                this._tS.toastr('warning', 'El Nro. de Establecimiento tiene que tener tres dígitos', tituloToast)
                return
            }

            if (!this.data.contribuyente) {
                this._tS.toastr('warning', 'Seleccione el Tipo Contribuyente', tituloToast)
                return
            }

            if (!this.data.actividad) {
                this._tS.toastr('warning', 'Seleccione la Actividad', tituloToast)
                return
            }

            if (this.correos.length > 0) {
                if (!this.correos.every(item => this.validarEmail(item))) {
                    this._tS.toastr('warning', 'Verifique que los correos  esten ingresado correctamente', tituloToast);
                    return
                }
            }

            if (!this.data.canton) {
                this._tS.toastr('warning', 'Seleccione el Cantón', tituloToast)
                return
            }

            if (!this.data.dirEstablecimiento) {
                this._tS.toastr('warning', 'Ingrese la Dirección', tituloToast)
                return
            }

            showLoader();
            this.data.contribuyenteRimpe = this.tipoContribuyentes.find(item => item.codigo === this.data.contribuyente).contribuyenteRimpe;

            this.data.telefono = this.telefonos.length > 0 ? this.telefonos.join(';') : "";
            this.data.correo = this.correos.length > 0 ? this.correos.join(';') : "";

            if (this.tipoRegistro === 'N') {
                url = `Config/Establecimiento/Insert?json=${encodeURIComponent(JSON.stringify(this.data))}`
            } else {
                url = `Config/Establecimiento/Update/${this._params.idEstablecimiento}/?json=${encodeURIComponent(JSON.stringify(this.data))}`;
            }

            console.log(url)

            await this._mS.getData(method, url, null, true).then(response => {
                console.log(response)
                if (response.code === '0') {
                    this._tS.toastr('warning', response.message, response.titleSms)
                }
                if (response.code === '1') {
                    this._tS.toastr('success', response.message, response.titleSms)
                    this.$uibModalInstance.close(response)
                }
            })
        } catch (error) {
            console.trace(error)
        } finally {
            hideLoader();
        }
    }
}


class ModalEstablecimientoConfigCtrl extends ModalBaseCtrl {

    static $inject = ['$uibModalInstance', '$q', '$scope', 'mainService', 'modalService', 'nombreModal', 'toastService', 'params']

    constructor($uibModalInstance, $q, $scope, _mS, _modalSvc, _nombreModalConst, _tS, _params) {
        super(_params)
        this.$uibModalInstance = $uibModalInstance;
        this.$q = $q;
        this.$scope = $scope;
        this._mS = _mS;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;

        this.tipoRegistro = this._params.tipoRegistro;
        this.data = {};
        this.dataLogo = {}; 
        this.file = null;

        this.patternImg = "'.jpg,.png'"

        let json = {
            id: this._params.idEstablecimiento,
            typeList: 1
        }
        this.urlEstabGet = 'Config/Establecimiento/GetId?json=' + JSON.stringify(json);
    }

    async $onInit() {
        try {
            showLoader();
            let request = this.requestInitiload();
            request.push(this._mS.getData('get', this.urlEstabGet, null, true));

            let requestResults = await Promise.all(request);
            let results = JSON.parse(requestResults[0].payload);
            let resultsDataEstab = JSON.parse(requestResults[1].payload)

            this.cantones = results[0];
            this.actividadesEconomicas = results[1];
            this.tipoContribuyentes = results[3];

            this.data = resultsDataEstab[0][0];

            this.canton = this.cantones.find(item => item.codigo === this.data.canton).descripcion;
            this.actividadEconomica = this.actividadesEconomicas.find(item => item.codigo === this.data.actividad).descripcion
            this.tipoContribuyente = this.tipoContribuyentes.find(item => item.codigo === this.data.contribuyente).descripcion

            //Logo
            if (resultsDataEstab[1][0]) {
                this.dataLogo = resultsDataEstab[1][0];
                this.file = `data:${this.dataLogo.mimeType};base64,${this.dataLogo.imagen}`
            }
            //Puntos Emisiones 
            this.puntosEmision = resultsDataEstab[2];
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }


    async onSave() {
        try {

            if (!this.file) {
                this._tS.toastr('warning', 'Por favor suba el archivo del logo');
                return
            }

            showLoader();
            const data = {
                codEstab: this.data.codEstab
            }

            await this._mS.getDataFile('/EstabLogo/Insert', this.file, data).then(response => {
                if (response.code == 0) {
                    this._tS.toastr('warning', response.message, response.titleSms);
                    return;
                };
                if (response.code == 1) {
                    this._tS.toastr('success', response.message)

                }
            })


        } catch (error) {
            this.dataLogo = {};
            this.file = null;
            console.log(error)
        } finally {
            hideLoader();
        }

    }


    async removeImg() {
        if (!this.dataLogo.idEstab_Logo) {
            this.file = null;
            return
        }

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ml-2'
            },
            buttonsStyling: false
        })

        let { isConfirmed } = await swalWithBootstrapButtons.fire({
            title: '<small>Eliminar Logo</small>',
            html: "<small>Esta seguro de eliminar logo?</small>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: false,
            allowOutsideClick: false
        })

        if (isConfirmed) {
            this._mS.getData('delete', '/EstabLogo/Delete?id=' + this.dataLogo.idEstab_Logo).then(response => {
                if (response.code === '0') {
                    this._tS.toastr('warning', response.message)
                }
                if (response.code === '1') {
                    this._tS.toastr('success', 'Eliminado Correctamente');
                    this.dataLogo = {};
                    this.file = null;
                }
            })
        }
    }

    configSaveFactElect() {
        this._mS.getData('put', `Config/Establecimiento/PutSriAuth/${this.data.idEstablecimiento}/${this.data.autoSriAuth}`, null, true).then(
            response => {
                if (response.code === '0') {
                    this._tS.toastr('warning', response.message)
                }
                if (response.code === '1') {
                    this._tS.toastr('success', response.message)
                }
            }
        )
    }



    //--------------------------------------------------------PTO EMISIÓN----------------------------------------------


    async openModalPtoEmisionNew() {
        let { MODAL_CTRL, MODAL_NUEVO } = this._nombreModalConst.pto_emision;

        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']]
        let template = MODAL_NUEVO['template'];
        let props = {
            params: this.data,
            tipoRegistro: 'N',
            data: {}
        }
        this.openModalPtoEmisiom(controller, template, props, 'md');
    }

    async openModalPtoEmisionEdit(item) {
        let { MODAL_CTRL, MODAL_EDIT } = this._nombreModalConst.pto_emision;

        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_EDIT['controller']]
        let template = MODAL_EDIT['template'];
        let props = {
            params: this.data,
            tipoRegistro: 'E',
            data: item
        }
        this.openModalPtoEmisiom(controller, template, props, 'md');
    }

    /**
     * 
     * @param {*} controller 
     * @param {*} template 
     */
    openModalPtoEmisiom(controller, template, params, size = 'lg') {
        this._modalSvc.openModalCustom({
            controller,
            template,
            params,
            size,
            isRenderRazorPartial: true
        }).result.then(result => {
            if (typeof result === 'object') {
                this._mS.getData('get', this.urlEstabGet).then(response => {
                    let results = JSON.parse(response.payload) || [];
                    this.puntosEmision = results[3];
                })
            }
        })
    }

    askToDeletePtoEmision(item) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ml-2'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: '<small>Anular Punto Emision?</small>',
            html: "<small>¡No podrás revertir esto!</small>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar',
            reverseButtons: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                this._mS.getData('delete', '/PtoEmision/Delete?id=' + item.idPuntoEmision).then(response => {
                    if (response.code == "0") {
                        this._tS.toastr('warning', response.message, response.titleSms);;
                    }
                    if (response.code == "1") {
                        this._tS.toastr('success', response.message, response.titleSms);
                        this._mS.getData('get', this.urlEstabGet).then(response => {
                            let results = JSON.parse(response.payload) || [];
                            this.puntosEmision = results[3];
                        })
                    }
                })
            }
        })
    }
}



/**
 * ----------------------------------------------------PUNTO DE EMISIÓN------------------------------------
 */
class ModalPtoEmisionCtrl extends ModalBaseCtrl {
    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'params'];
    constructor($scope, $uibModalInstance, _mS, _tS, _props) {
        super()
        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._tS = _tS;
        let { params, tipoRegistro, data } = _props;

        this._params = params;
        this.tipoRegistro = tipoRegistro;
        this.data = Object.assign({}, data)
        this.data.codEstab = this._params.codEstab;
        this.showEstado = !this.data.estado

    }

    $onInit() {
        Promise.all(this.requestInitiload()).then(response => {
            let results = JSON.parse(response[0].payload)
            this.tipoAmbientes = results[4].map(item => ({ ...item, ambiente: item.ambiente.toString() }))
            this.$scope.$apply();
        })

        console.log(this.data.ambiente)
    }

    closeModal() {
        this.$uibModalInstance.close();
    }

    onSave() {
        try {
            let tituloModal = this.tipoRegistro === 'N' ? 'Guardar' : 'Actualizar';
            if (!this.data.codEstab) {
                this._tS.toastr('warning', 'Seleccione la Sucursal')
                return
            }

            if (!this.data.ptoEmi) {
                this._tS.toastr('warning', 'Ingrese el Punto Emisión')
                return
            }

            if (this.data.ptoEmi.length !== 3) {
                this._tS.toastr('warning', 'El Punto de Emisión tiene que tener 3 dígitos', tituloModal);
                return
            }

            if (!this.data.ambiente) {
                this._tS.toastr('warning', 'Seleccione el Tipo Ambiente')
                return
            }


            let url = this.tipoRegistro === 'N' ? '/PtoEmision/Insert' : '/PtoEmision/Update?id=' + this.data.idPuntoEmision;
            let method = this.tipoRegistro === 'N' ? 'post' : 'put';
            showLoader();
            this._mS.getData(method, url, this.data).then(response => {
                if (response.code == "0") {
                    hideLoader();
                    this._tS.toastr('warning', response.message, response.titleSms);
                }
                if (response.code == "1") {
                    hideLoader();
                    this._tS.toastr('success', response.message, response.titleSms);
                    this.$uibModalInstance.close(response)
                }
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }



}

export {
    ModalEstablecimientoCtrl,
    ModalEstablecimientoConfigCtrl,
    ModalPtoEmisionCtrl
}