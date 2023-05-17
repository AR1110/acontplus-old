export class ModalBaseCtrl {
    constructor({
        $scope,
        _mS,
        _commonSvc,
        $uibModalInstance,
        _modalSvc,
        _nombreModal,
        _form,
        _tS,
        _params
    }) {
        this.$scope = $scope;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this.$uibModalInstance = $uibModalInstance;
        this._modalSvc = _modalSvc;
        this._nombreModal = _nombreModal;
        this._form = _form;
        this._tS = _tS;
        this._params = _params || {}
    }

    initiload({
        esCredito,
        tipoValidacion,
        tipoClienteProveedor
    }) {
        return Promise.all([
            this._mS.getData('post', '/TipoIdentificacion/ReadTipoIdentificacion', {
                tipoValidacion
            }).then(response => response.data),
            this._mS.getData('get', '/SubContribuyente/OptionSubContribuyente').then(response => response.data),
            this._mS.getData('get', '/TipoClienteProveedor/TipoClienteProveedorSelect?tipoValidacion=' + tipoClienteProveedor).then(response => response.data),
            this._mS.getData('get', '/TipoEntidad/TipoEntidadSelect').then(response => response.data),
            this._mS.getData('get', '/Ciudad/ReadCiudadProvincia').then(response => response.data),
            this._mS.getData('get', '/TiempoCredito/OptionTiempoCredito?gestion=' + esCredito).then(response => response.data),
            // this._mS.getData('get', '/Empresa/Get?json=' + JSON.stringify({ typeList: 2 })).then(response => JSON.parse(response.data)),
            // this._mS.getData('get', '/Cargo/Get?json=' + JSON.stringify({ typeList: 2 })).then(response => JSON.parse(response.data)),
        ])
    }

    async openModalTiempoCredito() {
        let {
            MODAL_CTRL,
            MODAL_CSHTML
        } = this._nombreModal.tiempo_credito;
        let {
            ModalTiempoCreditoCtrl
        } = await import('./../../modal/' + MODAL_CTRL);
        let modalRef = this._modalSvc.openModalCustom({
            controller: ModalTiempoCreditoCtrl,
            template: `TiempoCredito/${MODAL_CSHTML}`,
            size: 'md'
        })

        modalRef.result.then(async response => {
            if (typeof response === 'object') {
                let results = await this.initiload(this.initiloadParams);
                this.tiempoCreditos = results[5];
            }
        })
    }

    onKeyupEmail(item) {
        let textChip = item.target.value || "";
        textChip = this._form.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();
    }

    transformChipEmail(item) {
        
        let textChip = item || "";
        textChip = this._form.removeAccents(textChip);
        item = textChip.toLowerCase();
    }



    validarEmail(valor) {
        return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
    }


    //Verificar si numero identifcacion esta registrado en la Base de Datos
    verificarSiExisteNumIdentificacion() {

        this._mS.getData('get', `/${this.dataSearchValidacion.url}/Get?json=` + JSON.stringify(this.dataSearchValidacion)).then(response => {
            if (response.code === "0") {


                if (this.dataSearchValidacion.codigoIdentificacion === 'R') {
                    this.getRucSRI();
                }
                if (this.dataSearchValidacion.codigoIdentificacion === 'C') {
                    this.getCedulaSRI();
                }
            }
            if (response.code === "1") {
                let data = JSON.parse(response.payload)[0];

                Swal.fire({
                    title: `${this.dataSearchValidacion.titulo}`,
                    html: `
                        <small><strong>Nro. Identificación</strong></small>
                        <br>
                        <p class="text-muted small">${data.numeroIdentificacion}</p>
                        <small><strong>Nombre Fiscal</strong></small> <br>
                        <p class="text-muted small">${data.nombreFiscal}</p>

                        <small><strong>Nombre Comercial</strong></small> <br>
                        <p class="text-muted small">${data.nombreComercial}</p>
                    `,

                    icon: 'info',
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: true,
                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Validar datos!',
                    confirmButtonAriaLabel: 'Validar datos!',
                    cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancelar',
                    cancelButtonAriaLabel: 'Cancelar'
                }).then(result => {
                    if (result.isConfirmed) {
                        let codigoIdentificacion = this.dataFindByIdTipoIdentificacion().codigoIdentificacion;
                        if (codigoIdentificacion === 'R') {
                            this.getRucSRI();
                        }

                        if (codigoIdentificacion === 'C') {
                            this.getCedulaSRI();
                        }
                    }
                })
            }
        })
    }


    getRucSRI() {
        try {

            showLoader();
            this._mS.getData('get', 'Consultas/GetRucSRI?Ruc=' + this.data.numeroIdentificacion, null, true).then(result => {
                hideLoader();
                if (result.numeroRuc) {

                    let {
                        razonSocial,
                        establecimientos,
                        tipoContribuyente
                    } = result;
                    this.data.nombreComercial = razonSocial.replaceAll('"', '');
                    this.data.nombreFiscal = razonSocial.replaceAll('"', '');
                    this.data.direccion = establecimientos.find(item => item.matriz === 'SI').direccionCompleta

                    this.data.validationSri = true;

                    this.typeNotify = 'is-valid';
                    this.message = 'Número de RUC correcta';

                    let contribuyente = this.subContribuyentes.find(item => item.descripcion === tipoContribuyente);

                    if (contribuyente) {
                        this.data.idTipoIdentificacion = contribuyente.idTipoIdentificacion;
                        this.data.codigoIdentificacion = contribuyente.codigoIdentificacion;
                    }
                } else {
                    this.typeNotify = 'is-invalid';
                    this.message = 'No se encontró los datos';
                }
            }).catch(error => {
                hideLoader();
                this.typeNotify = 'is-invalid';
                this.message = 'No se encontró los datos';
                console.log(error);
            })
        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }

    getCedulaSRI() {
        try {
            showLoader();
            this._mS.getData('get', 'Consultas/GetCedulaSri?Ruc=' + this.data.numeroIdentificacion, null, true).then(result => {
                hideLoader();

                if (result.numeroRuc || result.nombreCompleto) {

                    let {
                        nombreCompleto,
                        establecimientos
                    } = result;
                    this.data.nombreComercial = nombreCompleto.replaceAll('"', '');
                    this.data.nombreFiscal = nombreCompleto.replaceAll('"', '');
                    this.data.validationSri = true;
                    // this.data.direccion = establecimientos[0].direccionCompleta
                    this.typeNotify = 'is-valid';
                    this.message = 'Número de Cédula correcta';

                    // setTimeout(() => {
                    //     let container = document.querySelector('input[ng-model="$ctrl.data.direccion"]');
                    //     container.removeAttribute("disabled");
                    // }, 500)

                } else {
                    this.typeNotify = 'is-invalid';
                    this.message = 'No se encontró los datos';
                }
            }).catch(error => {
                hideLoader();
                Swal.close();
                this.typeNotify = 'is-invalid';
                this.message = 'No se encontró los datos';
                console.log(error);
            })

        } catch (error) {
            hideLoader()
            console.log(error);
        }
    }


    dataFindByIdTipoIdentificacion() {
        return this.tipoIdentificaciones.find(item => item.idTipoIdentificacion === this.data.idTipoIdentificacion);
    }

    closeModal() {
        this.$uibModalInstance.close();
    }
}




class ModalBaseCliente extends ModalBaseCtrl {
    constructor({
        $scope,
        _mS,
        _commonSvc,
        $uibModalInstance,
        _modalSvc,
        _nombreModal,
        _form,
        _tS,
        _params
    }) {
        super({
            $scope,
            _mS,
            _commonSvc,
            $uibModalInstance,
            _modalSvc,
            _nombreModal,
            _form,
            _tS,
            _params
        })
    }

    //Depurando lista de ciudad y provincia
    getAllCiudadProvincia() {
        this._commonSvc.getAllCiudadProvincia().then(response => {
            const {
                ciudad,
                provincia
            } = JSON.parse(response.data)[0] || {}
            this.ciudades = JSON.parse(ciudad) || [];
            this.provincias = JSON.parse(provincia) || [];

        })
    }

    searchEmpleadoFilter(textSearch) {
        return this._commonSvc.querySearchEmpleado(textSearch)
    }

    searchCity(txtSearch) {
        let results = [];
        let search = txtSearch.toLowerCase()
        for (let item of this.provincias) {
            results.push({
                ...item,
                ciudades: this.ciudades.filter(ciudad => ciudad.codigo === item.codigo)
            })
        }

        return results
    }


    onChangeTipoIdentificacion() {
        this.data.codigoIdentificacion = this.dataFindByIdTipoIdentificacion().codigoIdentificacion;

        this.typeNotify = '';
        this.message = ''
        this.data.numeroIdentificacion = '';

        this.isDisableInputIdentificacion = false;
        this.data.validationSri = false;

        //Tipo Identificacion Consumir Final
        if (this.data.codigoIdentificacion === 'CF') {
            this.isDisableInputIdentificacion = true;
            this.data.numeroIdentificacion = '9'.repeat(13)
        }
    }

    validarNumeroIdentificacion() {

        let codigoIdentificacion = this.dataFindByIdTipoIdentificacion().codigoIdentificacion;

        let inputTextNumeroIdentificacion = $("#numeroIdentificacion");

        this.dataSearchValidacion = {
            url: 'Cliente',
            dataExists: 1,
            bySearch: this.data.numeroIdentificacion,
            titulo: 'Cliente Registrado.',
            codigoIdentificacion
        }

        this.data.validationSri = false;


        if (this._form.campo(this.data.numeroIdentificacion)) return

        if (codigoIdentificacion === 'C') {
            inputTextNumeroIdentificacion.attr("maxlength", 10);

            if (this.data.numeroIdentificacion.toString().length < 10) {
                this.typeNotify = 'is-invalid';
                this.message = 'Número de Cédula debe tener 10 dígitos';
                return
            }
        }

        if (codigoIdentificacion === 'R') {
            inputTextNumeroIdentificacion.attr('maxlength', 13);
            if (this.data.numeroIdentificacion.toString().length < 13) {
                this.typeNotify = 'is-invalid';
                this.message = 'Número de RUC debe tener 13 dígitos';
                return
            }

            if (this.data.numeroIdentificacion.slice(this.data.numeroIdentificacion.length - 3) !== '001') {
                this.typeNotify = 'is-invalid';
                this.message = 'Número de RUC tiene que contener (001) en últimos dígitos';
                return
            }
        }
        this.typeNotify = '';
        this.message = '';
        this.verificarSiExisteNumIdentificacion();
    }

    onChangeValidateIdentificacionSRI() {
        if (this.dataFindByIdTipoIdentificacion().codigoIdentificacion === 'R') {
            this.getRucSRI();
        }
        if (this.dataFindByIdTipoIdentificacion().codigoIdentificacion === 'C') {
            this.getCedulaSRI();
        }

    }

    copiarNombreComercial() {
        if (this.tipoRegistro === 1) {
            this.data.nombreComercial = this.data.nombreFiscal;
        }
    }

    async openModalEmpresa() {
        const {
            MODAL_CTRL,
            MODAL_CSHTML
        } = this._nombreModal.empresa;
        const {
            ModalEmpresaCtrl
        } = await import('./../../modal/' + MODAL_CTRL)
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalEmpresaCtrl,
            template: 'Empresa/' + MODAL_CSHTML,
            size: 'md'
        })

        modalRef.result.then(async res => {
            if (typeof res === 'object') {
                const results = await this.initiload(this.initiloadParams);
                this.empresas = results[5];
            }
        })
    }

    onKeyupSearchEmpleado(searchText) {
        if (this._form.campo(searchText)) {
            this.data.idEmpleado = null;
        }
    }

    selectedEmpleadoChange(item) {
        this.data.idEmpleado = item.idEmpleado;
    }


    async openModalEmpleado() {
        let {
            MODAL_CTRL,
            MODAL_CSHTML
        } = this._nombreModal.empleado;
        let {
            ModalEmpleadoCtrl
        } = await import('./../../modal/' + MODAL_CTRL)
        this._modalSvc.openModalCustom({
            controller: ModalEmpleadoCtrl,
            template: 'Empleado/' + MODAL_CSHTML,
            size: 'md'
        })


    }

    async openModalCargo() {
        const {
            MODAL_CTRL,
            MODAL_CSHTML
        } = this._nombreModal.cargo;
        const {
            ModalCargoCtrl
        } = await import('./../../modal/' + MODAL_CTRL)
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalCargoCtrl,
            template: 'Cargo/' + MODAL_CSHTML,
            size: 'md'
        })
        modalRef.result.then(async res => {
            if (typeof res === 'object') {
                const results = await this.initiload(this.initiloadParams);
                this.cargos = results[6];
            }
        })
    }



    //generate barcode

    getBarcode = function (item) {
        // console.log(item)
        if (!item) {
            this._tS.toastr('warning', "Debe ingresar la razón social y el número de identificacion del cliente para generar el código de barras")
            return
        }
        if (item == '9999999999999') {
            this._tS.toastr('warning', "No se puede generar código de barra para el consumidor final")
            return
        }
        this.data.barcodeGenerated = true
        JsBarcode("#barcode", item, {
            format: "CODE128",
            lineColor: "#000",
            width: 1.5,
            height: 75,
            displayValue: false
        });
        // this.data.barcodeCard = $('#barcode').attr('src').replace(/^data:image\/[a-z]+;base64,/, "")
        this.data.barcodeCard = document.getElementById('barcode').value

        //console.log(strImage);
        //return barcodeData
    }
    exportTpvCard = function (item) {
        // html2canvas(document.querySelector("#cardBusiness")).then(canvas => {
        //     document.body.appendChild(canvas)
        // });
        let container = document.getElementById("cardBusiness");; /* full page */
        html2canvas(container, {
            allowTaint: true
        }).then(function (canvas) {

            let link = document.createElement("a")
            document.body.appendChild(link)
            link.download = item + "_tpv.jpg"

            link.href = canvas.toDataURL()
            link.target = '_blank';
            link.click()
            link.download()
            this.data.barcodeGenerated = false
            // let image = new Image();
            // image.src = canvas.toDataURL()

            // let w = window.open("", '_blank');
            // w.document.write(image.outerHTML);
            // w.document.close();
        });
    }




    isValidForm() {
        let tituloModal = this.tipoRegistro == 1 ? 'Guardar' : 'Actualizar';
        if (this._form.campo(this.data.numeroIdentificacion)) {
            this._tS.toastr('warning', 'Ingrese Número de Identificación', tituloModal)
            return;
        };

        // if ($("#numeroIdentificacion").hasClass('is-invalid')) {
        //     this._tS.toastr('warning', 'Ingrese el número de Identificación válido', tituloModal);
        //     return
        // }

        if (this.data.codigoIdentificacion === "CF" && this.data.numeroIdentificacion.length !== 13) {
            this._tS.toastr('warning', 'Número de Consumidor Final tiene que ser de 13 dígitos', tituloModal);
            return
        }

        if (this.data.codigoIdentificacion === "C" && this.data.numeroIdentificacion.length !== 10) {
            this._tS.toastr('warning', 'Número de Cédula tiene que ser de 10 dígitos', tituloModal);
            return
        }

        if (this.data.codigoIdentificacion === "R" && this.data.numeroIdentificacion.length !== 13) {
            this._tS.toastr('warning', 'Número de RUC tiene que ser de 13 dígitos', tituloModal);
            return
        }

        if (this.data.codigoIdentificacion === "R" && this.data.numeroIdentificacion.slice(-3) !== '001') {
            this._tS.toastr('warning', 'Número de RUC tiene que contener 001', tituloModal);
            return
        }

        // if (this._form.campo(this.data.idSubContribuyente)) {
        //     this._tS.toastr('warning', 'Seleccione el Contribuyente', tituloModal)
        //     return
        // }
        if (this._form.campo(this.data.nombreFiscal)) {
            this._tS.toastr('warning', 'Ingrese el nombre Fiscal', tituloModal)
            return
        }
        if (this._form.campo(this.data.nombreComercial)) {
            this._tS.toastr('warning', 'Ingrese el nombre Comercial', tituloModal)
            return
        }
        // if (this._form.campo(this.data.idCiudad)) {
        //     toast.toastr('warning', 'Seleccione la Ciudad', tituloModal);
        //     return;
        // }
        // if (this._form.campo(this.data.idTipoClienteProveedor)) {
        //     toast.toastr('warning', 'Seleccione el Tipo Cliente', tituloModal)
        //     return;
        // }
        // if (this._form.campo(this.data.idTipoEntidad)) {
        //     toast.toastr('warning', 'Seleccione el Tipo Entidad', tituloModal)
        //     return;
        // }
        if (this.correos.length > 0) {
            if (!this.correos.every(item => this.validarEmail(item))) {
                this._tS.toastr('warning', 'Verifique que los correos  esten ingresado correctamente', tituloModal);
                return
            }
        }

        if (!(this.data.idTiempoCredito > 0)) {
            this._tS.toastr('warning', 'Seleccione el Tiempo Credito', tituloModal);
            return
        }


        this.data.direccion = this._form.campo(this.data.direccion) ? "" : this._form.letterInline(this.data.direccion);
        this.data.telefono = this.telefonos.length > 0 ? this.telefonos.join(';') : "";
        this.data.correo = this.correos.length > 0 ? this.correos.join(';') : "";
        this.data.placa = this.placas.length > 0 ? this.placas.join(';') : "";

        return true;

    }

}


/***
 *
 * ------------------------------------START CLIENTE-------------------------
 *
 */
export class ModalClienteCtrl extends ModalBaseCliente {

    static $inject = [
        '$scope',
        'mainService',
        'commonService',
        '$uibModalInstance',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'params'
    ];

    constructor($scope, _mS, _commonSvc, $uibModalInstance, _modalSvc, _nombreModal, _form, _tS, _params) {
        super({
            $scope,
            _mS,
            _commonSvc,
            $uibModalInstance,
            _modalSvc,
            _nombreModal,
            _form,
            _tS,
            _params
        })

        this.initiloadParams = {
            esCredito: true,
            tipoValidacion: 'V',
            tipoClienteProveedor: 'CL'
        };

        this.tabContent = 0; //Por defecto tab general
        this.data = {};
        this.tipoRegistro = 1;

        this.correos = [];
        this.telefonos = [];
        this.placas = [];

        this.isDisableInputIdentificacion = false;
        this.isDisableSelectIdentificacion = false;
    }



    async $onInit() {
        try {
            showLoader();
            const results = await this.initiload(this.initiloadParams);

            this.tipoIdentificaciones = results[0];
            this.data.idTipoIdentificacion = this.tipoIdentificaciones[0].idTipoIdentificacion;
            this.data.codigoIdentificacion = this.tipoIdentificaciones[0].codigoIdentificacion;

            this.subContribuyentes = results[1];
            this.tipoClientes = results[2];
            this.tipoEntidades = results[3];
            this.ciudadPronvincias = results[4];

            this.tiempoCreditos = results[5];
            this.data.idTiempoCredito = this.tiempoCreditos.length > 0 ? this.tiempoCreditos[0].idTiempoCredito : 0

            this._mS.getData('get', '/Empresa/Get?json=' + JSON.stringify({
                    typeList: 2
                })).then(response => {
                    if (response.data) {
                        this.empresas = JSON.parse(response.data)
                    }
                }),
                this._mS.getData('get', '/Cargo/Get?json=' + JSON.stringify({
                    typeList: 2
                })).then(response => {
                    if (response.data) {
                        this.cargos = JSON.parse(response.data)
                    }
                })

            //Editar
            //Cuando editamos
            if (this._params.idCliente > 0) {
                this._commonSvc.getDataCliente(this._params.idCliente).then(response => {
                    this.isDisableInputIdentificacion = false;
                    this.tipoRegistro = 2
                    this.data = response;
                    this.correos = this.data.correos;
                    this.telefonos = this.data.telefonos;

                    this.selectedEmpleado = this.data.empleado;
                    this.placas = this.data.placas;

                    //Cuando el estado este Inactivo se presenta el estado para activar
                    this.showEstado = !this.data.estado;
                    this.$scope.$apply();
                })
            }

            this.$uibModalInstance.rendered.then(result => {

                if (this.tipoRegistro === 1) {
                    $("#numeroIdentificacion").focus();
                } else {
                    $("#nombreComercial").focus();
                }
            })

            this.$scope.$apply();
            hideLoader()
        } catch (error) {
            hideLoader();
            console.log(error)
        }


    }


    saveUpdateCliente() {
        try {
            
            if (!this.isValidForm()) return;

            const url = this.tipoRegistro === 1 ? '/Cliente/Post' : '/Cliente/Put?idCliente=' + this.data.idCliente;
            const method = this.tipoRegistro === 1 ? 'post' : 'put';
            showLoader();
            this._mS.getData(method, url, this.data).then(async response => {
                
                if (response.id === "0") {
                    hideLoader();
                    this._tS.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id === "1") {
                    let idCliente = this.tipoRegistro === 1 ? response.payload : this._params.idCliente;
                    let dataCliente = await this._commonSvc.getDataCliente(idCliente);

                    this.$uibModalInstance.close(dataCliente)
                    this._tS.toastr('success', response.message, response.titleSms);
                    hideLoader();

                }
            })
        } catch (error) {
            console.error(error)
        }
    }


    closeModal() {
        this.$uibModalInstance.close();
    }


}




//-------------------------------------------NUEVO CLIENTE-------------------------------------------

export class ModalClienteNuevoCtrl extends ModalBaseCliente {

    static $inject = [
        '$scope',
        'mainService',
        'commonService',
        '$uibModalInstance',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'params'
    ];

    constructor($scope, _mS, _commonSvc, $uibModalInstance, _modalSvc, _nombreModal, _form, _tS, _params) {
        super({
            $scope,
            _mS,
            _commonSvc,
            $uibModalInstance,
            _modalSvc,
            _nombreModal,
            _form,
            _tS,
            _params
        })

        this.initiloadParams = {
            esCredito: true,
            tipoValidacion: 'V',
            tipoClienteProveedor: 'CL'
        };

        this.tabContent = 0; //Por defecto tab general
        this.data = {};
        this.tipoRegistro = 1;

        this.correos = [];
        this.telefonos = [];
        this.placas = [];

        this.isDisableInputIdentificacion = false;
        this.isDisableSelectIdentificacion = false;


    }



    async $onInit() {
        try {
            showLoader();
            const results = await this.initiload(this.initiloadParams);

            this.tipoIdentificaciones = results[0];
            this.data.idTipoIdentificacion = this.tipoIdentificaciones[0].idTipoIdentificacion;
            this.data.codigoIdentificacion = this.tipoIdentificaciones[0].codigoIdentificacion;

            this.subContribuyentes = results[1];
            this.tipoClientes = results[2];
            this.tipoEntidades = results[3];
            this.ciudadPronvincias = results[4];

            this.tiempoCreditos = results[5];
            this.data.idTiempoCredito = this.tiempoCreditos.length > 0 ? this.tiempoCreditos[0].idTiempoCredito : 0

            this._mS.getData('get', '/Empresa/Get?json=' + JSON.stringify({
                    typeList: 2
                })).then(response => {
                    if (response.data) {
                        this.empresas = JSON.parse(response.data)
                    }
                }),
                this._mS.getData('get', '/Cargo/Get?json=' + JSON.stringify({
                    typeList: 2
                })).then(response => {
                    if (response.data) {
                        this.cargos = JSON.parse(response.data)
                    }
                })


            if (this._params.typeModule === 'M_CLIENTE_LISTA') {

                let text = await navigator.clipboard.readText();

            }

            this.$scope.$apply();
            hideLoader()
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }


    saveUpdateCliente() {
        try {


            if (!this.isValidForm()) return;

            showLoader();
            this._mS.getData('post', '/Cliente/Post', this.data).then(async response => {
                if (response.id === "0") {
                    hideLoader();
                    this._tS.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id === "1") {
                    let idCliente = this.tipoRegistro === 1 ? response.payload : this._params.idCliente;
                    let dataCliente = await this._commonSvc.getDataCliente(idCliente);

                    this.$uibModalInstance.close(dataCliente)
                    this._tS.toastr('success', response.message, response.titleSms);
                    hideLoader();

                }
            })
        } catch (error) {
            hideLoader();
            console.error(error)
        }
    }


    closeModal() {
        this.$uibModalInstance.close();
    }
}


//--------------------------------------------MODAL-EDITAR-CLIENTE---------------------------------------------------------
export class ModalClienteEditarCtrl extends ModalBaseCliente {
    static $inject = [
        '$scope',
        'mainService',
        'commonService',
        '$uibModalInstance',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'params'
    ];

    constructor($scope, _mS, _commonSvc, $uibModalInstance, _modalSvc, _nombreModal, _form, _tS, _params) {
        super({
            $scope,
            _mS,
            _commonSvc,
            $uibModalInstance,
            _modalSvc,
            _nombreModal,
            _form,
            _tS,
            _params
        })

        this.initiloadParams = {
            esCredito: true,
            tipoValidacion: 'V',
            tipoClienteProveedor: 'CL'
        };

        this.tabContent = 0; //Por defecto tab general
        this.data = {};
        this.tipoRegistro = 1;

        this.correos = [];
        this.telefonos = [];
        this.placas = [];

        this.isDisableInputIdentificacion = false;
        this.isDisableSelectIdentificacion = false;

        this.tipoRegistro = 2
    }



    async $onInit() {
        try {
            showLoader();
            const results = await this.initiload(this.initiloadParams);

            this.tipoIdentificaciones = results[0];
            this.data.idTipoIdentificacion = this.tipoIdentificaciones[0].idTipoIdentificacion;
            this.data.codigoIdentificacion = this.tipoIdentificaciones[0].codigoIdentificacion;

            this.subContribuyentes = results[1];
            this.tipoClientes = results[2];
            this.tipoEntidades = results[3];
            this.ciudadPronvincias = results[4];

            this.tiempoCreditos = results[5];
            this.data.idTiempoCredito = this.tiempoCreditos.length > 0 ? this.tiempoCreditos[0].idTiempoCredito : 0

            this._mS.getData('get', '/Empresa/Get?json=' + JSON.stringify({
                    typeList: 2
                })).then(response => {
                    if (response.data) {
                        this.empresas = JSON.parse(response.data)
                    }
                }),
                this._mS.getData('get', '/Cargo/Get?json=' + JSON.stringify({
                    typeList: 2
                })).then(response => {
                    if (response.data) {
                        this.cargos = JSON.parse(response.data)
                    }
                })

            //Editar
            //Cuando editamos
            if (this._params.idCliente > 0) {
                this._commonSvc.getDataCliente(this._params.idCliente).then(response => {
                    this.isDisableInputIdentificacion = false;
                    this.data = response;
                    this.correos = this.data.correos;
                    this.telefonos = this.data.telefonos;

                    this.selectedEmpleado = this.data.empleado;
                    this.placas = this.data.placas;

                    //Cuando el estado este Inactivo se presenta el estado para activar
                    this.showEstado = !this.data.estado;

                    $("#nombreComercial").focus();
                    this.$scope.$apply();
                })
            }


            this.$scope.$apply();
            hideLoader()
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }


    saveUpdateCliente() {
        try {

            if (!this.isValidForm()) return;

            showLoader();
            this._mS.getData('put', '/Cliente/Put?idCliente=' + this.data.idCliente, this.data).then(async response => {
                if (response.id === "0") {
                    hideLoader();
                    this._tS.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id === "1") {
                    let idCliente = this.tipoRegistro === 1 ? response.payload : this._params.idCliente;
                    let dataCliente = await this._commonSvc.getDataCliente(idCliente);

                    this.$uibModalInstance.close(dataCliente)
                    this._tS.toastr('success', response.message, response.titleSms);
                    hideLoader();

                }
            })
        } catch (error) {
            console.error(error)
        }
    }


    closeModal() {
        this.$uibModalInstance.close();
    }
}




export class ModalClienteListaCtrl {

    static $inject = ['mainService', '$uibModalInstance', 'modalService', 'nombreModal', 'toastService']

    constructor(_mS, $uibModalInstance, _modalService, _nombreModalConst, _tS) {

        this._mS = _mS;
        this.$uibModalInstance = $uibModalInstance;
        this._modalService = _modalService;
        this._nombreModalConst = _nombreModalConst;
        this._tS = _tS;
        this.selected = [];
        this.dataSearch = {
            pageIndex: 1,
            pageSize: 100
        }
    }

    $onInit() {
        this.getSearchCustomer();
    }


    copyTextSearch() {
        if (!this.dataSearch.bySearch) return

        let copyText = document.getElementById("searchCliente");

        copyText.select();
        copyText.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(this.dataSearch.bySearch);
        this._tS.toastr('info', 'Copiado: ' + this.dataSearch.bySearch)
    }


    async openModalNew() {
        let {
            MODAL_CTRL,
            MODAL_NUEVO
        } = this._nombreModalConst.cliente;
        // let controller = (await import('./../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template = MODAL_NUEVO['template'];

        let params = {
            typeModule: 'M_CLIENTE_LISTA',
            data: {

            }
        }

        this.openModal({
            controller: ModalClienteNuevoCtrl,
            template,
            params
        })
    }

    openModalEditar(params) {
        let {
            MODAL_CTRL,
            MODAL_EDITAR
        } = this._nombreModalConst.cliente;
        // let controller = (await import('./../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template = MODAL_EDITAR['template'];
        this.openModal({
            controller: ModalClienteEditarCtrl,
            template,
            params
        })
    }

    openModal({
        controller,
        template,
        params
    }) {
        let modalRef = this._modalService.openModalCustom({
            controller,
            template,
            params,
            size: 'xl'
        })

        modalRef.result.then(result => {
            if (typeof result === 'object') {
                this.seleccionarCliente(result);
            }
        })
    }

    onKeyupSearchCliente() {
        this.getSearchCustomer();
    }

    resetList() {
        this.dataSearch.bySearch = this.dataSearch.bySearch || null;
        this.getSearchCustomer();
    }


    getSearchCustomer() {
        try {
            showLoader();
            this.dataSearch.bySearch = this.dataSearch.bySearch || null;
            this.clientes = [];
            this._mS.getData('get', '/Cliente/Get?json=' + JSON.stringify(this.dataSearch)).then(
                response => {
                    if (response.code === "0") {
                        this.clientes = [];
                        hideLoader();
                        console.log(response)
                        return
                    }

                    if (response.code === "1") {

                        this.clientes = JSON.parse(response.payload) || [];
                        this.totalRecords = this.clientes.length > 0 ? this.clientes[0].totalRecords : 0
                        hideLoader();
                    }
                }
            ).catch(error => {
                console.error(error)
                hideLoader()
            })

        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }



    seleccionarCliente = (item) => {
        if (!item.validationSri && ['R', 'C'].includes(item.tipoIdentificacion)) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos Incorrectos',
                html: 'Número de identificación inválido, desea editar?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Editar',
                cancelButtonText: 'Cancelar'
            }).then(async result => {
                if (result.isConfirmed) {
                    this.openModalEditar(item)
                }
            })
        }
        this.$uibModalInstance.close(item)
    }

    closeModal() {
        this.$uibModalInstance.close();
    }



}






/**
 *
 * -----------------------------------START PROVEEDOR
 *
 */

export class ModalProveedorCtrl extends ModalBaseCtrl {

    static $inject = [
        '$scope',
        'mainService',
        'commonService',
        '$uibModalInstance',
        'modalService',
        'nombreModal',
        'formulario',
        'toastService',
        'params'
    ];

    constructor($scope, _mS, _commonSvc, $uibModalInstance, _modalSvc, _nombreModal, _form, _tS, _params) {
        super({
            $scope,
            _mS,
            _commonSvc,
            $uibModalInstance,
            _modalSvc,
            _nombreModal,
            _form,
            _tS,
            _params
        })

        this.initiloadParams = {
            esCredito: false,
            tipoValidacion: 'C',
            tipoClienteProveedor: 'P'
        };
        this.data = {};
        this.tipoRegistro = 1;

        this.correos = [];
        this.telefonos = [];
    }

    async $onInit() {
        try {
            showLoader();
            const results = await this.initiload(this.initiloadParams);

            this.tipoIdentificaciones = results[0];
            this.tipoIdentificacion = this.tipoIdentificaciones[0];

            this.subContribuyentes = results[1];
            this.tipoClienteProveedores = results[2];
            this.tipoEntidades = results[3];
            this.ciudadPronvincias = results[4];

            this.tiempoCreditos = results[5];
            this.data.idTiempoCredito = this.tiempoCreditos.length > 0 ? this.tiempoCreditos[0].idTiempoCredito : 0

            //Editar

            if (typeof this._params === 'object' && this._params.idProveedor > 0) {

                this.tipoRegistro = 2;
                this._commonSvc.getDataByProveedor(this._params.idProveedor).then(response => {
                    this.data = response;
                    console.log(this.data)
                    this.tipoIdentificacion = response.tipoIdentificacion;
                    this.correos = response.correo.split(';')
                    this.telefonos = response.telefono.split(';')
                })
            }
            this.$scope.$apply();
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    onChangeTipoIdentificacion() {        
        if (this.tipoIdentificacion ) {
            this.typeNotify = '';
            this.message = ''
            this.data.numeroIdentificacion = '';
        }
    }

    onKeyupNumeroIndentificacion() {
        if (this._form.campo(this.data.numeroIdentificacion)) return

        this.data.idTipoIdentificacion = this.tipoIdentificacion.idTipoIdentificacion;
       
        let codigoIdentificacion = this.dataFindByIdTipoIdentificacion().codigoIdentificacion;

        this.dataSearchValidacion = {
            url: 'Proveedor',
            bySearch: this.data.numeroIdentificacion,
            dataExists: 1,
            titulo: 'Proveedor Registrado.',
            codigoIdentificacion
        }
       
 
        if (codigoIdentificacion === 'C') {
            $("#numeroIdentificacion").attr('maxlength', 10);
            if (this.data.numeroIdentificacion.toString().length < 10) {
                this.typeNotify = 'is-invalid';
                this.message = 'Número de Cédula debe tener 10 dígitos';
                this.id = 0;
                return
            }
        }

        
        if (codigoIdentificacion === 'R') {
            $("#numeroIdentificacion").attr('maxlength', 13);
            console.log( $("#numeroIdentificacion"))
            if (this.data.numeroIdentificacion.toString().length < 13) {
                this.typeNotify = 'is-invalid';
                this.message = 'Número de RUC debe tener 13 dígitos';
                this.id = 0;
                return
            }

            if (this.data.numeroIdentificacion.slice(this.data.numeroIdentificacion.length - 3) !== '001') {
                this.typeNotify = 'is-invalid';
                this.message = 'Número de RUC tiene que contener (001) en últimos dígitos';
                return
            }

        }
        this.typeNotify = '';
        this.message = '';
        this.verificarSiExisteNumIdentificacion();


    }


    tranformMdChipsEmail(mdChip) {
        if (mdChip === null || mdChip == undefined) return

        return mdChip.toLowerCase();
    }

    onKeyupNombreFiscal() {
        this.data.nombreComercial = this.data.nombreFiscal;
    }



    saveAndUpdate() {
        try {


            let tituloModal = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';

            if (this._form.campo(this.data.numeroIdentificacion)) {
                this._tS.toastr('warning', 'Ingrese Número de Identificación', tituloModal)
                return;
            };

            // if ($("#numeroIdentificacion").hasClass('is-invalid')) {
            //     this._tS.toastr('warning', 'Ingrese el número de Identificación válido', tituloModal);
            //     return
            // }
            if (this._form.campo(this.data.idSubContribuyente)) {
                this._tS.toastr('warning', 'Seleccione el Contribuyente', tituloModal)
                return
            }
            if (this._form.campo(this.data.nombreFiscal)) {
                this._tS.toastr('warning', 'Ingrese el nombre Fiscal', tituloModal)
                return
            }
            if (this._form.campo(this.data.nombreComercial)) {
                this._tS.toastr('warning', 'Ingrese el nombre Comercial', tituloModal)
                return
            }
            if (this._form.campo(this.data.idCiudad)) {
                this._tS.toastr('warning', 'Seleccione la Ciudad', tituloModal);
                return;
            }
            if (this._form.campo(this.data.idTipoClienteProveedor)) {
                this._tS.toastr('warning', 'Seleccione el Tipo Proveedor', tituloModal)
                return;
            }
            if (this._form.campo(this.data.idTipoEntidad)) {
                this._tS.toastr('warning', 'Seleccione el Tipo Entidad', tituloModal)
                return;
            }

            if (this.correos.length > 0) {
                if (!this.correos.every(item => this.validarEmail(item))) {
                    this._tS.toastr('warning', 'Verifique que los correos del destinatario esten ingresado correctamente', tituloModal);
                    return
                }
            }

            // const telefonos = this.telefonos.map(item=>({text: item}));
            // const correos   = this.correos.map(item=>({text: item}));

            showLoader();
            this.data.telefono = this.telefonos.join(';')
            this.data.correo = this.correos.join(';')

            this.data.idTipoIdentificacion = this.tipoIdentificacion.idTipoIdentificacion;
            const url = this.tipoRegistro === 1 ? '/Proveedor/Post' : '/Proveedor/Put?id=' + this.data.idProveedor;
            const method = this.tipoRegistro == 1 ? 'post' : 'put';

            this._mS.getData(method, url, this.data).then(response => {
                if (response.id == 0) {
                    hideLoader();
                    this._tS.toastr('warning', response.message, response.titleSms);
                }

                if (response.id == 1) {
                    hideLoader();
                    const sharedData = {
                        idProveedor: this.tipoRegistro === 1 ? response.data : this._params.idProveedor
                    }
                    this.$uibModalInstance.close(sharedData)
                    this._tS.toastr('success', response.message, response.titleSms);
                }

            })
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    closeModal() {
        this.$uibModalInstance.close();
    }


}



export class ModalProveedorListaCtrl {

    static $inject = ['mainService', '$filter', '$uibModalInstance']
    constructor(_mS, $filter, $uibModalInstance) {
        this._mS = _mS;
        this.$filter = $filter;
        this.$uibModalInstance = $uibModalInstance;
        this.selected = [];

        this.dataSearch = {
            bySearch: null,
            pageIndex: 1,
            pageSize: 250
        }
    }
    $onInit() {
        this.getAllProveedor();
    }

    onKeyupSearchProveedor() {
        let proveedores = JSON.parse(JSON.stringify(this.cloneProveedores));
        this.proveedores = this.$filter("filter")(proveedores, this.dataSearch.bySearch);
    }

    resetList() {
        this.dataSearch.bySearch = null;
        this.getAllProveedor();
    }


    getAllProveedor() {
        try {
            showLoader();
            this.proveedores = [];
            this._mS.getData('get', '/Proveedor/Get?json=' + JSON.stringify(this.dataSearch)).then(
                response => {
                    if (response.code === "0") {
                        this.proveedores = [];
                        console.log(item)
                        hideLoader();
                        return
                    }
                    if (response.code === "1") {
                        this.proveedores = JSON.parse(response.payload) || []
                        this.cloneProveedores = JSON.parse(JSON.stringify(this.proveedores));
                        hideLoader();
                    }
                }
            )
        } catch (error) {
            this.proveedores = [];
            hideLoader();
            console.error(error)
        }
    }

    selectedCustomer = (item) => {
        this.$uibModalInstance.close(item)
    }

    closeModal() {
        this.$uibModalInstance.close()
    }
}