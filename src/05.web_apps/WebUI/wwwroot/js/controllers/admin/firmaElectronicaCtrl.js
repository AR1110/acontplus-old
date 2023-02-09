app.controller('firmaElectronicaCtrl', firmaElectronicaCtrl);

firmaElectronicaCtrl.$inject = ['$scope', 'mainService', 'toastService'];

function firmaElectronicaCtrl($scope, mS, tS) {
    'use strict';
    let accion = JSON.parse(localStorage.getItem("accion"));
    if (accion === null) {
        location.href = "/Home/Index";
        return
    } else {
        $scope.accion = accion[0];
    }

    let url = '/FirmaElectronica/';

    $scope.firma = {};
    $scope.fileSign = {};
    $scope.entidades = [];
    $scope.firmas = [];

    $scope.tipoOperacion = 0;

    $scope.openModal = function (data = null, type) {
        $scope.tipoOperacion = type;
        if (type == 1) {
            $('#modalFirma').modal('show');
            return;
        }
        if (type == 2) {
            $scope.firma = data;
            $('#modalUpdate').modal('show');
        }
    };

    $scope.initialLoad = function () {
        mS.getData('get', '/Entidad/OptionEntidad').then(function (response) {
            $scope.entidades = response.data;
        }, error => console.log(error));

        mS.getData('get', url + 'Get').then(function (response) {
            if (response.id == 0) {
                tS.toastr('warning', response.message, response.titleSms);
                return;
            }
            $scope.firmas = response.data.map(val => {
                val.contraseniaEncryp = val.contrasenia.replace(val.contrasenia, '*'.repeat(val.contrasenia.length));
                return val;
            });

        }, error => console.log(error));
    };
    $scope.initialLoad();

    //Encryp Pass
    $scope.contraseniaEncryp = function (val) {
        val.contraseniaEncryp = val.contrasenia.replace(val.contrasenia, '*'.repeat(val.contrasenia.length))
    };

    $scope.verContrasenia = function (item) {
        item.contraseniaEncryp = item.contrasenia;
    }

    $scope.post = function () {
        showLoader();
        let file = $scope.fileSign;
        if (file == null || file == undefined) {
            hideLoader();
            tS.toastr('warning', 'Por favor suba el archivo de la firma');
            return
        }
        if (!$scope.firma.contrasenia) {
            hideLoader();
            tS.toastr('warning', 'Por favor ingrese la contraseña');
            return;
        }
        if (!$scope.firma.fechaCaducidad) {
            hideLoader();
            tS.toastr('warning', 'Por seleccione la fecha caducidad');
            return;
        }
        mS.getDataFile(url + 'Post', file, $scope.firma).then(response => {
            if (response.id == 0) {
                hideLoader();
                tS.toastr('warning', response.message, response.titleSms);
                return;
            };
            if (response.id == 1) {
                hideLoader();
                tS.toastr('success', response.message, response.titleSms);
                $scope.initialLoad();
                $('#modalFirma').modal('hide');
            }
            hideLoader();
        }, error => console.log(error));
    };

    $scope.put = function () {
        mS.getData('put', url + 'Put', $scope.firma).then(function (response) {
            if (response.id == 0) {
                tS.toastr('warning', response.message, response.titleSms);
                return;
            }
            if (response.id == 1) {
                tS.toastr('success', response.message, response.titleSms);
                $scope.initialLoad();
                $('#modalUpdate').modal('hide');
            }
        }, error => console.log(error));
    };

    $scope.askToDelete = function (item) {
        Swal.fire({
            icon: 'warning',
            //title: 'Insumos',
            text: 'Esta seguro/a de eliminar esta firma electronica ahora?',
            showDenyButton: true,
            confirmButtonText: `Si`,
            denyButtonText: `No`,
            allowOutsideClick: false
        }).then((response) => {
            if (response.value) {
                $scope.delete(item);
            }
        });
    };

    $scope.delete = function (item) {
        mS.getData('delete', url + 'Delete?idFirmaElectronica=' + item.idFirmaElectronica).then(response => {
            if (response.id == 0) {
                tS.toastr('warning', response.message, response.titleSms);
                return;
            };
            if (response.id == 1) {
                tS.toastr('success', response.message, response.titleSms);
                $('#modalFirma').modal('hide');
            }
        }, error => console.log(error));
    };

    $("#modalFirma, #modalUpdate").on('hide.bs.modal', e => {
        $scope.firma = {};
        $scope.fileSign = {};
    })
}
