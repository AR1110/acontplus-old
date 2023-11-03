export { modalProveedorCtrl, modalProveedorListaCtrl };

modalProveedorCtrl.$inject = [
    "$scope",
    "$uibModalInstance",
    "$injector",
    "params",
];

function modalProveedorCtrl($scope, $uibModalInstance, $injector, params) {
    let proveedorSvc = $injector.get("proveedorService");
    let tS = $injector.get("toastService");
    let fS = $injector.get("formulario");
    let commonSvc = $injector.get("commonService");


    $scope.data = {
        idTipoIdentificacion: 0,
        idTiempoCredito: 0,
        idSubContribuyente: 0,
        validationSri: false
    };
    $scope.tiposIdentificacion = []
    $scope.subcontribuyentes = []
    $scope.tiemposCredito = []
    $scope.tiposEntidad = []
    $scope.tiposProveedor = []
    $scope.ciudades = []

    $scope.correos = [];
    $scope.telefonos = [];

    if (params.idProveedor > 0) {
        $scope.tipoRegistro = 2;
        $scope.titleModal = "Editar";
        $scope.btnText = "Actualizar";
    } else {
        $scope.tipoRegistro = 1;
        $scope.titleModal = "Nuevo";
        $scope.btnText = "Guardar";
    }

    $scope.numeroIdentificacionValidationMessage = '';
    let numeroIdentificacionCedulaRUC = null;
    let numeroIdentificacionPasaporte = null;
    $uibModalInstance.rendered.then(() => {
        numeroIdentificacionCedulaRUC = document.getElementById("numeroIdentificacionCedulaRUC");
        numeroIdentificacionPasaporte = document.getElementById("numeroIdentificacionPasaporte");
        numeroIdentificacionCedulaRUC.style.display = 'block';
        numeroIdentificacionPasaporte.style.display = 'none';
    })

    function initiload() {
        try {
            showLoader();
            proveedorSvc
                .getDataForm()
                .then((response) => {
                    const {
                        tiposIdentificacion,
                        subcontribuyentes,
                        tiemposCredito,
                        tiposEntidad,
                        tiposProveedor,
                        ciudades,
                    } = response;

                    $scope.tiposIdentificacion = tiposIdentificacion;
                    $scope.subcontribuyentes = subcontribuyentes;
                    $scope.tiemposCredito = tiemposCredito;
                    $scope.tiposEntidad = tiposEntidad;
                    $scope.tiposProveedor = tiposProveedor
                    $scope.ciudades = ciudades;

                    let dataTipoIdentificacion = $scope.tiposIdentificacion.find(data => data.codigo === 'R');
                    if (dataTipoIdentificacion) {

                        $scope.data.idTipoIdentificacion = dataTipoIdentificacion.idTipoIdentificacion;
                    }

                    setDataSubcontribuyenteDefault();
                    setDataTiempoCreditoDefault();

                    //Cuando Si es importacion 
                    if (params.isImport) {
                        $scope.data.nombreFiscal = params.razonSocial;
                        $scope.data.nombreComercial = params.nombreComercial
                        $scope.data.numeroIdentificacion = params.ruc;
                        $scope.data.direccion = params.dirMatriz;
                        $scope.data.validationSri = true;
                        return
                    }

                    if (params.idProveedor > 0) {
                        proveedorSvc.getId(params.idProveedor).then((response) => {
                            let { correos, telefonos, ...rest } = response;
                            $scope.data = rest;
                            $scope.correos = correos;
                            $scope.telefonos = telefonos;
                            if (!($scope.data.idSubContribuyente > 0)) {
                                setDataSubcontribuyenteDefault();
                            }
                            if (!($scope.tiemposCredito.length > 0)) {
                                setDataTiempoCreditoDefault();
                            }
                        });
                    }
                })
                .finally(() => hideLoader());
        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }
    initiload();

    function setDataSubcontribuyenteDefault() {
        let dataSubContribuyente = $scope.subcontribuyentes.find(data => data.codigo === '06');
        if (dataTipoIdentificacion) {
            $scope.data.idSubContribuyente = dataSubContribuyente.idSubContribuyente;
        }
    }
    function setDataTiempoCreditoDefault() {
        $scope.data.idTiempoCredito = $scope.tiemposCredito.length > 0 ? $scope.tiemposCredito[0].idTiempoCredito : 0

    }

    $scope.onChangeTipoIdentificacion = function () {
        let dataTipoIdentificacion = $scope.tiposIdentificacion.find(data => data.idTipoIdentificacion === $scope.data.idTipoIdentificacion);
        $scope.numeroIdentificacionValidationMessage = null;
        if (dataTipoIdentificacion.codigo === "P") {
            numeroIdentificacionPasaporte.style.display = 'block';
            numeroIdentificacionCedulaRUC.style.display = 'none';

        } else {
            numeroIdentificacionCedulaRUC.style.display = 'block';
            numeroIdentificacionPasaporte.style.display = 'none';
        }
    }

    $scope.onKeyupNumeroIdentificacion = function () {
        if ($scope.data.idProveedor > 0) return;

        let dataTipoIdentificacion = $scope.tiposIdentificacion.find(data => data.idTipoIdentificacion === $scope.data.idTipoIdentificacion);
        $scope.numeroIdentificacionValidationMessage = '';
        if (!$scope.data.numeroIdentificacion) return

        if (!dataTipoIdentificacion) {
            tS.toastr('error', 'Tipo Identificacion no encontrada!')
        }

        if (dataTipoIdentificacion.codigo === "C") {
            if ($scope.data.numeroIdentificacion.length !== 10) {
                $scope.numeroIdentificacionValidationMessage = 'Número de Cádula tiene que tener 10 dígitos!';
                return
            }
            checkClientSRIByCedula();
        }

        if (dataTipoIdentificacion.codigo === "R") {
            if ($scope.data.numeroIdentificacion.length !== 13) {
                $scope.numeroIdentificacionValidationMessage = 'Número de RUC tiene que tener 13 dígitos!';
                return
            }
            if ($scope.data.numeroIdentificacion.slice(-3) !== '001') {
                $scope.numeroIdentificacionValidationMessage = 'Número de RUC tiene que contener (001) en últimos dígitos!';
                return
            }
            checkClientSRIByRUC();
        }
    }

    async function checkClientSRIByRUC() {
        try {
            showLoader();
            $scope.data.validationSri = false;
            commonSvc.checkClientSRIByRUC($scope.data.numeroIdentificacion).then(response => {
                let {
                    razonSocial,
                    direccion,
                    telefono,
                    email,
                    error
                } = response;
                if (error) {
                    tS.toastr('info', error);
                    $scope.data.nombreComercial = null;
                    $scope.data.nombreFiscal = null;
                    $scope.data.direccion = null;
                    $scope.telefonos = [];
                    $scope.correos = [];
                    return
                }

                $scope.data.nombreComercial = razonSocial;
                $scope.data.nombreFiscal = razonSocial;
                $scope.data.direccion = direccion ? direccion : null;
                $scope.telefonos = telefono ? telefono.split(';') : []
                $scope.correos = email ? email.split(';') : []
                $scope.data.validationSri = true;
            }).finally(() => hideLoader())
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    async function checkClientSRIByCedula() {
        try {
            showLoader();
            $scope.data.validationSri = false;
            commonSvc.checkClientSRIByCedula($scope.data.numeroIdentificacion).then(response => {
                let {
                    razonSocial,
                    direccion,
                    telefono,
                    email,
                    error
                } = response;
                if (error) {
                    tS.toastr('info', error);
                    $scope.data.nombreComercial = null;
                    $scope.data.nombreFiscal = null;
                    $scope.data.direccion = null;
                    $scope.telefonos = [];
                    $scope.correos = [];
                    return
                }
                $scope.data.direccion = direccion ? direccion : null;
                $scope.telefonos = telefono ? telefono.split(';') : []
                $scope.correos = email ? email.split(';') : []
                $scope.data.nombreComercial = razonSocial;
                $scope.data.nombreFiscal = razonSocial;
                $scope.data.validationSri = true;
            }).finally(() => {
                hideLoader();
            })


        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    $scope.onKeyupEmail = function (item) {
        let textChip = item.target.value || "";
        textChip = fS.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();
    };

    $scope.transformChipEmail = function (item) {
        let textChip = item || "";
        textChip = fS.removeAccents(textChip);
        item = textChip.toLowerCase();
    };

    function validarEmail(valor) {

        return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(
            valor
        );
    }

    $scope.ranformMdChipsEmail = function (mdChip) {
        if (mdChip === null || mdChip == undefined) return;

        return mdChip.toLowerCase();
    };

    $scope.onKeyupNombreFiscal = function () {
        $scope.data.nombreComercial = $scope.data.nombreFiscal;
    };

    $scope.onSave = function () {
        try {
            let dataTipoIdentificacion = $scope.tiposIdentificacion.find(data => data.idTipoIdentificacion === $scope.data.idTipoIdentificacion);
            if (!$scope.data.numeroIdentificacion) {
                tS.toastr("warning", "Ingrese Número de Identificación");
                return;
            }

            if (dataTipoIdentificacion.codigo === "C" && $scope.data.numeroIdentificacion.length !== 10) {
                tS.toastr('warning', 'Número de Cédula tiene que ser de 10 dígitos');
                return
            }

            if (dataTipoIdentificacion.codigo === "R" && $scope.data.numeroIdentificacion.length !== 13) {
                tS.toastr('warning', 'Número de RUC tiene que ser de 13 dígitos');
                return
            }

            if (dataTipoIdentificacion.codigo === "R" && $scope.data.numeroIdentificacion.slice(-3) !== '001') {
                tS.toastr('warning', 'Número de RUC tiene que contener 001');
                return
            }

            if (!($scope.data.idSubContribuyente > 0)) {
                tS.toastr("warning", "Seleccione el Contribuyente");
                return;
            }
            if (!$scope.data.nombreFiscal) {
                tS.toastr("warning", "Ingrese el nombre Fiscal");
                return;
            }
            if (!$scope.data.nombreComercial) {
                tS.toastr("warning", "Ingrese el nombre Comercial");
                return;
            }

            if ($scope.correos.length > 0) {
                if (!$scope.correos.every((item) => validarEmail(item))) {
                    tS.toastr(
                        "warning",
                        "Verifique que los correos del destinatario esten ingresado correctamente",
                    );
                    return;
                }
            }

            $scope.data.telefono = this.telefonos.join(';')
            $scope.data.correo = this.correos.join(';')

            if (!($scope.data.idProveedor > 0)) {
                showLoader();
                proveedorSvc
                    .post($scope.data)
                    .then(successResponse)
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => hideLoader());
            }

            if ($scope.data.idProveedor > 0) {
                showLoader();
                proveedorSvc
                    .put($scope.data.idProveedor, $scope.data)
                    .then(successResponse)
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => hideLoader());
            }
        } catch (error) {
            hideLoader();
            console.log(error);
        }
    };

    function successResponse(response) {
        if (response.code === "0") {
            tS.toastr("warning", response.message, response.titleSms);
        }
        if (response.code === "1") {
            tS.toastr("success", response.message, response.titleSms);
            let idProveedor = 0;
            if ($scope.data.idProveedor > 0) {
                idProveedor = $scope.data.idProveedor
            } else {
                let results = JSON.parse(response.payload);
                idProveedor = results.idProveedor;
            }
            $uibModalInstance.close({
                idProveedor,
                idTiempoCredito: $scope.data.idTiempoCredito
            });
        }
    }

    $scope.closeModal = () => {
        $uibModalInstance.close();
    };
}

modalProveedorListaCtrl.$inject = [
    "$scope",
    "$filter",
    "$uibModalInstance",
    "proveedorService",
];

function modalProveedorListaCtrl(
    $scope,
    $filter,
    $uibModalInstance,
    proveedorSvc
) {
    $scope.selected = [];
    $scope.proveedores = [];
    $scope.cloneProveedores = [];

    $scope.dataSearch = {
        textSearch: null,
        pageIndex: 1,
        pageSize: 10,
    };
    $scope.recordsQuantity = [10, 25, 50, 100];
    $scope.totalRecords = 0;
    $scope.maxSize = 5;

    $scope.getProveedores = function () {
        try {
            showLoader();
            $scope.proveedores = [];
            proveedorSvc
                .get($scope.dataSearch)
                .then((response) => {
                    $scope.proveedores = response || [];
                    $scope.cloneProveedores = JSON.parse(
                        JSON.stringify($scope.proveedores)
                    );
                })
                .finally(() => hideLoader());
        } catch (error) {
            console.log(error);
        }
    };
    $scope.getProveedores();

    $scope.pagechanged = function () {
        $scope.getProveedores();
    };

    $scope.changePageSize = function () {
        $scope.dataSearch.pageIndex = 1;
        $scope.getProveedores();
    };

    $scope.onKeyupSearchProveedor = () => {
        $scope.getProveedores();
    };

    $scope.reloadProveedores = () => {
        $scope.dataSearch.textSearch = null;
        $scope.getProveedores();
    };

    $scope.onKeyupSearchProveedor = function () {
        let proveedores = JSON.parse(JSON.stringify($scope.cloneProveedores));
        $scope.proveedores = $filter("filter")(
            proveedores,
            $scope.dataSearch.textSearch
        );
    };

    $scope.selectedCustomer = (item) => {
        $uibModalInstance.close(item);
    };

    $scope.closeModal = function () {
        $uibModalInstance.close();
    };
}
