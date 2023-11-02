
export {
    modalProveedorCtrl,
    modalProveedorListaCtrl
}

modalProveedorCtrl.$inject = ['$scope', '$uibModalInstance', '$injector', 'params'];

function modalProveedorCtrl($scope, $uibModalInstance, $injector, params) {
    let proveedorSvc = $injector.get('proveedorService');
    let tS = $injector.get('toastService');
    let fS = $injector.get('formulario');
    console.log(params)
    console.log('test updat')
    $scope.data = {
        idTiempoCredito: 0,
        idSubContribuyente: 0
    }
    $scope.tiposIdentificacion = [];
    $scope.tiposContribuyente = [];
    $scope.tiposProveedor = [];
    $scope.ciudades = [];
    $scope.tiemposCredito = [];
    $scope.tiposEntidad = [];
    $scope.correos = [];
    $scope.telefonos = [];

    if (params.idProveedor > 0) {
        $scope.tipoRegistro = 2;
        $scope.titleModal = 'Editar';
        $scope.btnText = 'Actualizar';
    } else {
        $scope.tipoRegistro = 1;
        $scope.titleModal = 'Nuevo';
        $scope.btnText = 'Guardar';
    }


    function initiload() {
        try {
            showLoader();
            proveedorSvc.getDataForm({ tipo: 1 }).then(response => {
                console.log(response)

                if (params.idProveedor > 0) {
                    proveedorSvc.getId({ tipo: 1 })
                }

            }).finally(() => hideLoader())
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    $scope.onKeyupEmail = function (item) {
        let textChip = item.target.value || "";
        textChip = fS.removeAccents(textChip);
        item.target.value = textChip.toLowerCase();
    }

    $scope.transformChipEmail = function (item) {
        let textChip = item || "";
        textChip = fS.removeAccents(textChip);
        item = textChip.toLowerCase();
    }

    function validarEmail(valor) {
        return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
    }

    $scope.ranformMdChipsEmail = function (mdChip) {
        if (mdChip === null || mdChip == undefined) return

        return mdChip.toLowerCase();
    }

    $scope.onKeyupNombreFiscal = function () {
        $scope.data.nombreComercial = $scope.data.nombreFiscal;
    }

    $scope.onSave = function () {
        try {
            if ($scope.data.numeroIdentificacion) {
                tS.toastr('warning', 'Ingrese Número de Identificación')
                return;
            }

            if (!($scope.data.idSubContribuyente > 0)) {
                tS.toastr('warning', 'Seleccione el Contribuyente')
                return
            }
            if (!$scope.data.nombreFiscal) {
                tS.toastr('warning', 'Ingrese el nombre Fiscal')
                return
            }
            if (!$scope.data.nombreComercial) {
                tS.toastr('warning', 'Ingrese el nombre Comercial')
                return
            }

            if ($scope.correos.length > 0) {
                if (!$scope.correos.every(item => validarEmail(item))) {
                    tS.toastr('warning', 'Verifique que los correos del destinatario esten ingresado correctamente', tituloModal);
                    return
                }
            }

            showLoader();
            // this.data.telefono = this.telefonos.join(';')
            // this.data.correo = this.correos.join(';') 

            if (!($scope.data.idProveedor > 0)) {
                proveedorSvc.post($scope.data).then(successResponse)
                    .catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
            }

            if ($scope.data.idProveedor > 0) {
                proveedorSvc.put($scope.data.idProveedor, $scope.data).then(successResponse)
                    .catch(error => {
                        console.log(error)
                    }).finally(() => hideLoader())
            }
        } catch (error) {
            hideLoader();
            console.log(error)
        }
    }

    function successResponse(response) {
        if (response.code === "0") {
            tS.toastr('warning', response.message, response.titleSms)
        }
        if (response.code === "1") {
            tS.toastr('success', response.message, response.titleSms);
            const sharedData = {
                idProveedor: $scope.data.idProveedor > 0 ? response.data : $scope.data.idProveedor
            }
            $uibModalInstance.close(sharedData)
        }
    }

    $scope.closeModal = () => {
        $uibModalInstance.close();
    }
}


modalProveedorListaCtrl.$inject = ['$scope', '$filter', '$uibModalInstance', 'proveedorService'];

function modalProveedorListaCtrl($scope, $filter, $uibModalInstance, proveedorSvc) {
    $scope.selected = [];
    $scope.proveedores = [];
    $scope.cloneProveedores = [];

    $scope.dataSearch = {
        bySearch: null,
        pageIndex: 1,
        pageSize: 250
    }

    $scope.initiload = function () {
        try {
            showLoader();
            $scope.proveedores = [];
            proveedorSvc.get().then(response => {
                $scope.proveedores = response || [];
                $scope.cloneProveedores = JSON.parse(JSON.stringify($scope.proveedores));
            }).finally(() => hideLoader())
        } catch (error) {
            console.log(error)
        }
    }

    $scope.onKeyupSearchProveedor = function () {
        let proveedores = JSON.parse(JSON.stringify($scope.cloneProveedores));
        $scope.proveedores = $filter("filter")(proveedores, $scope.dataSearch.bySearch);
    }

    $scope.resetList = function () {
        $scope.dataSearch.bySearch = null;
        $scope.initiload();
    }

    $scope.selectedCustomer = (item) => {
        $uibModalInstance.close(item)
    }

    $scope.closeModal = function() {
        $uibModalInstance.close()
    }

} 