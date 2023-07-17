app.controller('firmaElectronicaCtrl', firmaElectronicaCtrl);

firmaElectronicaCtrl.$inject = ['$scope', 'mainService', 'toastService'];

function firmaElectronicaCtrl($scope, mS, tS) {
    'use strict';
    // let accion = JSON.parse(localStorage.getItem("accion"));
    // if (accion === null) {
    //     location.href = "/Home/Index";
    //     return
    // } else {
    //     $scope.accion = accion[0];
    // }

    let url = 'FirmaElectronica/';

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
        showLoader();
        $scope.firmas = [];
        mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 1 }), null, true).then(function (response) {
            hideLoader();
            if (response.code == 0) {
                console.log(response)
                return;
            }
            if(response.code=='1'){
                let firmas = JSON.parse(response.payload)[0] || [];
                $scope.firmas = firmas.map(val => {
                val.contraseniaEncryp = val.contrasenia.replace(val.contrasenia, '*'.repeat(val.contrasenia.length));
                return val;
            });
            }
           

        }).catch(error=>{
            hideLoader()
            console.log(error)
        })
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
        console.log(file)
        if (!file || Object.keys(file.length)===0) {
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
        mS.getDataFile(url + 'Post', file, $scope.firma, true).then(response => {
            if (response.code == 0) {
                hideLoader();
                tS.toastr('warning', response.message, response.titleSms);
                return;
            };
            if (response.code == 1) {
                hideLoader();
                tS.toastr('success', response.message, response.titleSms);
                $scope.initialLoad();
                $('#modalFirma').modal('hide');
            }
            hideLoader();
        }).catch(error=>{
            hideLoader();
            console.log(error)
        })
    };

    $scope.put = function () {
       
        mS.getData('put', url + 'Put', $scope.firma, true).then(function (response) {
            if (response.code == 0) {
                tS.toastr('warning', response.message, response.titleSms);
                return;
            }
            if (response.code == 1) {
                tS.toastr('success', response.message, response.titleSms);
                $scope.initialLoad();
                $('#modalUpdate').modal('hide');
            }
        }).catch(error=>{
            hideLoader();
            console.log(error)
        })
    };

    $("#modalFirma, #modalUpdate").on('hide.bs.modal', e => {
        $scope.firma = {};
        $scope.fileSign = {};
    })
}
