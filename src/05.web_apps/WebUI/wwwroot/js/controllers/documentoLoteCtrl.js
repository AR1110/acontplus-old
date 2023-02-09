(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('documentoLoteCtrl', documentoLoteCtrl);

    documentoLoteCtrl.$inject = ['$scope', 'mainService', 'toastService'];

    function documentoLoteCtrl($scope, mS, tS) {
        $scope.tipoDocumentos = [];
        $scope.lotes = [];
        $scope.data = {};

        $scope.initialLoad = function () {
            try {
                mS.getData('get', '/TipoDocumento/Get').then(
                    response => {
                        var data = JSON.parse(response.data);
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].codigoSri != null) {
                                $scope.tipoDocumentos.push(data[i]);
                            }
                        }
                    }
                );
            } catch (e) {
                console.log(e);
            }
        };
        $scope.initialLoad();

        $scope.get = function (codDoc) {
            try {
                $scope.lotes = [];
                mS.getData('get', '/DocumentoLote/Get?json=' + JSON.stringify({
                    codDoc: codDoc
                })).then(
                    response => {
                        if (response.id == "0") {
                            tS.toastr('warning', response.message);
                            return;
                        };
                        if (response.id == "1") {
                            $scope.lotes = JSON.parse(response.data);
                            return;
                        };
                    }
                );
            } catch (e) {
                console.log(e);
            };
        };

        $scope.askToPost = function () {
            Swal.fire({
                icon: 'warning',
                title: 'Generar Lotes',
                text: 'Esta seguro de generar facturación por lotes para este tipo de documento?',
                showDenyButton: true,
                confirmButtonText: `Si`,
                denyButtonText: `No`,
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    $scope.post();
                    return;
                };
            });
        };

        $scope.post = function () {
            try {
                var codDoc = $('#codDoc').val();
                mS.getData('post', '/DocumentoLote/Post?codDoc=' + codDoc).then(
                    response => {
                        if (response.id == "0") {
                            tS.toastr('warning', response.message);
                            return;
                        };
                        if (response.id == "1") {
                            tS.toastr('success', response.message);
                            $scope.lotes = [];
                            $scope.lotes = JSON.parse(response.data);
                            return;
                        };
                    }
                );
            } catch (error) {
                console.log(error);
            };
        };
        $scope.askToAuthorize = function (item) {
            Swal.fire({
                icon: 'warning',
                title: 'Lote',
                text: 'Esta seguro de enviar al SRI este lote?',
                showDenyButton: true,
                confirmButtonText: `Si`,
                denyButtonText: `No`,
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    $scope.authorize(item);
                    return;
                };
            });
        };
        $scope.authorize = function (item) {
            try {
                var codDoc = $('#codDoc').val();
                mS.getData('post', '/DocumentoLote/Authorize?idDocumentoLote=' + item.idDocumentoLote).then(
                    response => {
                        if (response.estado != "AUTORIZADO") {
                            Swal.fire({
                                icon: 'warning',
                                title: response.estado,
                                text: response.message
                            });
                            return;
                        } else {
                            tS.toastr('success', response.message, response.estado);
                            return;
                        };
                    }
                );
            } catch (error) {
                console.log(error);
            };
        };

        $scope.askToDelete = function (item) {
            Swal.fire({
                icon: 'warning',
                title: 'Lote',
                text: 'Esta seguro de eliminar este lote, de manera permanente ?',
                showDenyButton: true,
                confirmButtonText: `Si`,
                denyButtonText: `No`,
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    $scope.delete(item);
                    return;
                };
            });
        };

        $scope.delete = function (item) {
            try {
                mS.getData('delete', '/DocumentoLote/Delete?idDocumentoLote=' + item.idDocumentoLote).then(
                    response => {
                        if (response.id == "0") {
                            tS.toastr('warning', response.message);
                            return;
                        };
                        if (response.id == "1") {
                            tS.toastr('success', response.message);
                            $scope.get($scope.data.codDoc);
                            return;
                        };
                    }
                );
            } catch (error) {
                console.log(error);
            };
        };
        $scope.documents = [];
        $scope.getDetails = function (item) {
            try {
                $scope.documents = [];
                $scope.loteSelected = item;
                mS.getData('get', '/DocumentoLoteDetalle/Get?idDocumentoLote=' + item.idDocumentoLote).then(
                    response => {
                        if (response.id == "0") {
                            tS.toastr('warning', response.message);
                            return;
                        };
                        if (response.id == "1") {
                            $scope.documents = JSON.parse(response.data);
                            $('#docsModal').modal('show');
                            return;
                        };
                    }
                );
            } catch (error) {
                console.log(error);
            };
        };

        $scope.askToDeleteDoc = function (item) {
            Swal.fire({
                icon: 'warning',
                title: 'Documento',
                text: 'Esta seguro de eliminar este documento del lote, de manera permanente ?',
                showDenyButton: true,
                confirmButtonText: `Si`,
                denyButtonText: `No`,
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    $scope.deleteDoc(item);
                    return;
                };
            });
        };

        $scope.deleteDoc = function (item) {
            try {
                mS.getData('delete', '/DocumentoLoteDetalle/Delete?id=' + item.idDocLoteDetalle).then(
                    response => {
                        if (response === false) {
                            tS.toastr('warning', "Error al eliminar el documento");
                            return;
                        } else {
                            tS.toastr('success', "Eliminado Exitosamente");
                            let index = $scope.documents.indexOf(item);
                            $scope.documents.splice(index, 1);
                            for (const lote of $scope.lotes) {
                                if (lote.idDocumentoLote === $scope.loteSelected.idDocumentoLote) {
                                    lote.cantDocs = $scope.documents.length;
                                    break;
                                };
                            };
                            return;
                        };
                    }
                );
            } catch (error) {
                console.log(error);
            };
        };
    }
})(window.angular);