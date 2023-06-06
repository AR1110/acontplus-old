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
            this._mS.getData('get', 'TipoEntidad/ListForSelect', null, true).then(response => {
                if(response.code=='0'){
                    console.log(response)
                    return [];
                }
                if(response.code==='1'){
                    return JSON.parse(response.payload) || [];
                }                
            }),
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
            // if (this._form.campo(this.data.idCiudad)) {
            //     this._tS.toastr('warning', 'Seleccione la Ciudad', tituloModal);
            //     return;
            // }
            // if (this._form.campo(this.data.idTipoClienteProveedor)) {
            //     this._tS.toastr('warning', 'Seleccione el Tipo Proveedor', tituloModal)
            //     return;
            // }
            // if (this._form.campo(this.data.idTipoEntidad)) {
            //     this._tS.toastr('warning', 'Seleccione el Tipo Entidad', tituloModal)
            //     return;
            // }

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