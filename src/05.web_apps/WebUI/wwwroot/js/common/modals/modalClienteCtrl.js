export {
    ModalClienteCtrl
}

ModalClienteCtrl.$inject = ["$uibModalInstance", "$scope", "clienteService", "toastService", "params"]

function ModalClienteCtrl($uibModalInstance, $scope, clienteSvc, tS, params) {

    $scope.tipoRegistro = params.idCliente > 0 ? 'EDITAR' : 'NUEVO';


    $scope.tabContent = 0; //Por defecto tab general
    $scope.data = {};

    $scope.correos = [];
    $scope.telefonos = [];
    $scope.placas = [];

    $scope.isDisableInputIdentificacion = false;
    $scope.isDisableSelectIdentificacion = false;

    $scope.onKeyupEmail = clienteSvc.onKeyupEmail
    $scope.transformChipEmail = clienteSvc.transformChipEmail


    $scope.initiload = function () {
        try {
            clienteSvc.getDataForm().then(response => {

                let {
                    tiposIdentificacion,
                    tipoContribuyentes,
                    tiempoCreditos,
                    ciudades
                } = response;

                $scope.tiposIdentificacion = tiposIdentificacion;
                $scope.tipoContribuyentes = tipoContribuyentes;
                $scope.tiempoCreditos = tiempoCreditos;
                $scope.ciudades = ciudades;

                if ($scope.tipoRegistro === 'NUEVO') {
                    $scope.data.idTipoIdentificacion = $scope.tiposIdentificacion[0].idTipoIdentificacion;
                    $scope.data.codigoIdentificacion = $scope.tiposIdentificacion[0].codigo;

                    $scope.data.idTiempoCredito = $scope.tiempoCreditos.length > 0 ? $scope.tiempoCreditos[0].idTiempoCredito : 0
                }

                console.log($scope.data)
            }).catch(error => {
                console.log(error);
            })


            if ($scope.tipoRegistro === 'EDITAR') {
                clienteSvc.findById(params.idCliente).then(response => {

                    let {
                        correos,
                        telefonos,
                        placas,
                        empleado,
                        estado
                    } = response;

                    $scope.isDisableInputIdentificacion = false;

                    $scope.data = response;

                    $scope.correos = correos;
                    $scope.telefonos = telefonos;
                    $scope.placas = placas;

                    $scope.selectedEmpleado = empleado;

                    //Cuando el estado este Inactivo se presenta el estado para activar
                    $scope.showEstado = !estado;

                    $("#nombreComercial").focus();

                }).catch(error => {
                    console.log(error);
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

    $scope.initiload();


    $scope.dataFindByIdTipoIdentificacion = function () {
        return $scope.tiposIdentificacion.find(item => item.idTipoIdentificacion === $scope.data.idTipoIdentificacion) || {}
    }

    $scope.onChangeTipoIdentificacion = function () {
        $scope.data.codigoIdentificacion = $scope.dataFindByIdTipoIdentificacion().codigo;

        $scope.typeNotify = '';
        $scope.message = ''
        $scope.data.numeroIdentificacion = '';

        $scope.isDisableInputIdentificacion = false;
        $scope.data.validationSri = false;

        //Tipo Identificacion Consumir Final
        if ($scope.data.codigoIdentificacion === 'CF') {
            $scope.isDisableInputIdentificacion = true;
            $scope.data.numeroIdentificacion = '9'.repeat(13)
        }
    }

    $scope.validarNumeroIdentificacion = function () {

        try {
            let codigoIdentificacion = $scope.dataFindByIdTipoIdentificacion().codigo;

            let inputTextNumeroIdentificacion = $("#numeroIdentificacion");

            let query = {
                dataExists: 1,
                bySearch: $scope.data.numeroIdentificacion,
                codigoIdentificacion
            }

            $scope.data.validationSri = false;

            if (!$scope.data.numeroIdentificacion) return

            if (codigoIdentificacion === 'C') {
                inputTextNumeroIdentificacion.attr("maxlength", 10);

                if ($scope.data.numeroIdentificacion.toString().length < 10) {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'Número de Cédula debe tener 10 dígitos';
                    return
                }
            }

            if (codigoIdentificacion === 'R') {
                inputTextNumeroIdentificacion.attr('maxlength', 13);
                if ($scope.data.numeroIdentificacion.toString().length < 13) {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'Número de RUC debe tener 13 dígitos';
                    return
                }

                if ($scope.data.numeroIdentificacion.slice($scope.data.numeroIdentificacion.length - 3) !== '001') {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'Número de RUC tiene que contener (001) en últimos dígitos';
                    return
                }
            }

            $scope.typeNotify = '';
            $scope.message = '';

            clienteSvc.checkClientByIdentification(query, codigoIdentificacion, $scope.consultaIdentificacionSRI)
        } catch (error) {
            console.log(error);
        }

    }

    $scope.consultaIdentificacionSRI = function (codigoIdentificacion) {
        if (codigoIdentificacion === 'R') {
            showLoader();
            clienteSvc.checkClientSRIByRUC($scope.data.numeroIdentificacion).then(response => {
                hideLoader();
                if (result.numeroRuc) {

                    let {
                        razonSocial,
                        establecimientos
                    } = response;

                    $scope.data.nombreComercial = razonSocial.replaceAll('"', '');
                    $scope.data.nombreFiscal = razonSocial.replaceAll('"', '');
                    $scope.data.direccion = establecimientos.find(item => item.matriz === 'SI').direccionCompleta

                    $scope.data.validationSri = true;

                    $scope.typeNotify = 'is-valid';
                    $scope.message = 'Número de RUC correcta';

                } else {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'No se encontró los datos';
                }
            }).catch(error => {
                hideLoader();
                console.log(error);
                $scope.typeNotify = 'is-invalid';
                $scope.message = 'No se encontró los datos';
            })
        }

        if (codigoIdentificacion === 'C') {
            showLoader();
            clienteSvc.checkClientSRIByCedula($scope.data.numeroIdentificacion).then(response => {
                hideLoader();
                if (response.numeroRuc || response.nombreCompleto) {

                    let {
                        nombreCompleto
                    } = response;
                    $scope.data.nombreComercial = nombreCompleto.replaceAll('"', '');
                    $scope.data.nombreFiscal = nombreCompleto.replaceAll('"', '');
                    $scope.data.validationSri = true;

                    $scope.typeNotify = 'is-valid';
                    $scope.message = 'Número de Cédula correcta';
                } else {
                    $scope.typeNotify = 'is-invalid';
                    $scope.message = 'No se encontró los datos';
                }
            }).catch(error => {
                hideLoader();
                console.log(error);
                $scope.typeNotify = 'is-invalid';
                $scope.message = 'No se encontró los datos';
            })

        }
    }



    $scope.copiarNombreComercial = function () {
        if ($scope.tipoRegistro === 'NUEVO') {
            $scope.data.nombreComercial = $scope.data.nombreFiscal;
        }
    }





    $scope.save = function () {
        try {
            let params = {
                ...$scope.data,
                correos: $scope.correos,
                telefonos: $scope.telefonos,
                placas: $scope.placas
            }

            if (!clienteSvc.validateForm(params)) return

            console.log(params)
            showLoader();


            if ($scope.tipoRegistro === 'NUEVO') {
                clienteSvc.save(params).then($scope.saveResponse).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }

            if ($scope.tipoRegistro === 'EDITAR') {
                clienteSvc.update($scope.data.idCliente, params).then($scope.saveResponse).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }

        } catch (error) {
            hideLoader();
            console.log(error);
        }
    }

    $scope.saveResponse = async function (response) {
        if (response.code === "0" || response.id === "0") {
            hideLoader();
            tS.toastr('warning', response.message);
        }
        if (response.code === "1" || response.id === "1") {
            hideLoader();
            tS.toastr('success', response.message);

            let idCliente = $scope.tipoRegistro === 'NUEVO' ? response.payload : $scope.data.idCliente;
            let dataCliente = await clienteSvc.findById(idCliente) || {};
            $uibModalInstance.close(dataCliente);
        }
    }


    $scope.closeModal = function () {
        $uibModalInstance.close();
    }

}