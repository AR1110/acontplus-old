(() => {
    "strict";
    app.controller('impresoraCtrl', impresoraCtrl)
    impresoraCtrl.$inject = ['$scope', 'commonService', 'mainService', 'toastService', '$q']
    function impresoraCtrl($scope, _commonSvc, mS, tS, $q) {
        $scope.printersTo = [];
        $scope.printers = [];
        $scope.localPrinters = []
        $scope.documents = []
        $scope.data = {};

        let url = 'Config/Printer/'
        function initialLoad() {
            showLoader();
            let promises = []
            let requests = [
                {
                    method: 'get',
                    url: `${url}?json=${JSON.stringify({ tipo: 1 })}`,
                },
                {
                    method: 'get',
                    url: `${url}?json=${JSON.stringify({ tipo: 2 })}`,
                }
            ]
            angular.forEach(requests, (value) => {
                let promise = mS.getData(value.method, value.url, null, true).catch(error => { console.log(error) })
                promises.push(promise)
            })
            $q.all(promises).then(
                response => {
                    if (response[0]) {
                        let printersResponse = response[0]
                        $scope.printers = printersResponse['printers']
                        $scope.printers = $scope.printers.map(item => {
                            item.default = item.isDefault ? 'Si' : 'No';
                            item.server = item.serverDevice ? 'Si' : 'No';
                            item.labelEnabled = item.enabled ? 'Activa' : 'Inactiva';
                            return item
                        })
                    }
                    if (response[1]) {
                        let dataForm = response[1]
                        $scope.sucursales = dataForm['estabs'];
                        $scope.tipoImpresoras = dataForm['printerTypes'];
                        $scope.documents = dataForm['documents'];
                        $scope.documents.map(item => {
                            item.copies = 1
                            return item
                        })
                        if ($scope.sucursales.length > 0) {
                            $scope.data.establecimientoId = $scope.sucursales.idEstablecimiento;
                        } else {
                            tS.toastr('info', 'No tienes asignado las Sucursales')
                            document.getElementById('buttonNew').atrib('disabled', true)
                        }
                    }
                    hideLoader()
                })
        }
        initialLoad();

        async function getLocalPrinters() {
            mS.getData('get', `https://acontplusprint.com:9200/GetPrinters`, null, true, true).then(
                response => {
                    if (response.code == "1" && $scope.tipoRegistro == 1) {
                        $scope.localPrinters = JSON.parse(response.payload)
                        $scope.data.machine = $scope.localPrinters[0].machine
                        $scope.$apply();
                    }
                }
            ).catch(error => {
                console.log(error)
                tS.toastr('warning', 'Por favor instale el programa Acontplus Print, para obtener el listado de impresoras')
            })
        }

        $scope.openModalNew = async () => {
            $scope.tipoRegistro = 1;
            if ($scope.printers.every(item => !item.isDefault)) {
                $scope.data.isDefault = true;
            }
            $scope.printers.length > 0 ? $scope.data.ipAddress = $scope.printers[0].ipAddress : $scope.data.ipAddress = '127.0.0.1:9200'
            await getLocalPrinters();
            $('#addUpdatePrinter').modal('show')
        }

        async function getDataEdit(id, all = true) {
            mS.getData("get", `${url}?json=${JSON.stringify({ tipo: 3, id })}`, null, true).then(response => {
                hideLoader();
                if (response) {
                    if (all) {
                        $scope.data = response['printer'][0];
                    }
                    $scope.documents = response['documents']
                }
            }).catch(error => {
                console.log(error)
            })
        }

        $scope.openEdit = async (id) => {
            showLoader();
            await getLocalPrinters();
            await getDataEdit(id);
            $scope.tipoRegistro = 2;
            $('#addUpdatePrinter').modal('show')
        }
        $scope.updateDocument = async (data) => {
            if (!data.enabled) {
                data.copies = 1;
            }
            if ($scope.tipoRegistro == 2) {
                showLoader();
                let urlPrinterDoc;
                let method;
                if (data.id > 0) {
                    method = 'PUT'
                    urlPrinterDoc = 'Config/PrinterDocument/' + data.id
                    !data.enabled ? data.labelEnabled = 'Inactiva' : 'Activa'
                } else {
                    method = 'POST'
                    urlPrinterDoc = 'Config/PrinterDocument'
                    data.printerId = $scope.data.id
                }
                mS.getData(method, urlPrinterDoc, data, true).then(
                    response => {
                        hideLoader();
                        if (response.code == "0") {
                            tS.toastr("warning", response.message);
                        }
                        if (response.code == "1") {
                            getDataEdit(data.printerId, false);
                            tS.toastr("success", response.message);
                        }
                    }
                ).catch(error => {
                    hideLoader();
                    console.log(error)
                })
            }
        }
        $scope.updateStatus = (item) => {
            mS.getData('put', url + item.id, item, true).then(response => {
                if (response.code == "0") {
                    if (item.enabled) {
                        item.enabled = false;
                    } else {
                        item.enabled = true
                    }
                    hideLoader()
                    tS.toastr('warning', response.message)
                }
                if (response.code == "1") {
                    if (item.enabled) {
                        item.labelEnabled = 'Activa'
                    } else {
                        item.labelEnabled = 'Inactiva'
                    }
                    hideLoader();
                    tS.toastr('success', response.message)
                }
            }).catch(error => {
                if (item.enabled) {
                    item.enabled = false;
                } else {
                    item.enabled = true
                }
                hideLoader()
                console.log(error)
            })
        }
        $scope.saveEdit = () => {
            if (!$scope.data.establecimientoId || $scope.data.establecimientoId == 0) {
                tS.toastr('warning', 'Seleccione el Establecimiento')
                return
            }
            if (!$scope.data.name) {
                tS.toastr('warning', 'Se necesita ingresar el nombre de la Impresora')
                return
            }
            if (!$scope.data.printerTypeId || $scope.data.printerTypeId == 0) {
                tS.toastr('warning', 'Seleccione el Tipo Impresora')
                return
            }
            if ($scope.data.serverDevice && (!$scope.data.macAddress || $scope.data.macAddress.length == 0)) {
                tS.toastr('warning', 'Ingreso la dirección Mac del equipo')
                return
            }
            if (!$scope.data.ipAddress) {
                tS.toastr('warning', 'Ingrese el Ip de la máquina')
                return
            }
            if ($scope.documents.every(item => !item.enabled)) {
                tS.toastr('warning', 'Seleccione al menos un documento')
                return
            }
            let method = $scope.tipoRegistro === 1 ? 'post' : 'put';
            let codDoc = "";
            if ($scope.documents.some(item => item.codDoc === "FV" && item.enabled)) {
                codDoc = "FV"
            }
            if ($scope.documents.some(item => item.codDoc === "NE" && item.enabled)) {
                codDoc = "NE";
            }
            if ($scope.documents.every(item => item.enabled)) {
                codDoc = "A";
            }
            $scope.data.codDoc = codDoc;

            $scope.data.documents = $scope.documents.filter(x => x.enabled);
            showLoader();
            let urlPrinter;
            if ($scope.tipoRegistro == 2) {
                urlPrinter = url + $scope.data.id
            } else {
                urlPrinter = url
            }
            mS.getData(method, urlPrinter, $scope.data, true).then(response => {
                if (response.code == "0") {
                    hideLoader()
                    tS.toastr('warning', response.message)
                }
                if (response.code == "1") {
                    hideLoader();
                    initialLoad()
                    $('#addUpdatePrinter').modal('hide')
                    tS.toastr('success', response.message)
                }
            }).catch(error => {
                hideLoader()
                console.log(error)
            })
        }

        $scope.askToDelete = async (item) => {
            let { isConfirmed } = await Swal.fire({
                title: '¿Está seguro de eliminar esta impresora?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar',
                allowOutsideClick: false
            })
            if (isConfirmed) {
                $scope.delete(item);
            }
        }

        $scope.delete = (item) => {
            showLoader()
            mS.getData('delete', url + item.id, null, true).then(response => {
                if (response.code == "0") {
                    hideLoader()
                    tS.toastr('warning', response.message)
                }
                if (response.code == "1") {
                    hideLoader()
                    tS.toastr('success', response.message)
                }
            }, error => {
                hideLoader()
                console.log(error)
            })
        }
        /**Validations */
        $scope.existsDefault = false
        $scope.validateDefault = (item) => {
            for (const printer of $scope.printersTo) {
                printer.isDefault = false
            }
            item.isDefault = !item.isDefault;
        }

        $('#addUpdatePrinter').on('hidden.bs.modal', function () {
            $scope.data = {};
        });
    }
})(window.angular)
