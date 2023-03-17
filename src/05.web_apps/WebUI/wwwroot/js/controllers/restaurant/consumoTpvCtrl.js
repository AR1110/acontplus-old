(function () {
    'use strict';

    app.controller('consumoTpvCtrl', consumoTpvCtrl);

    consumoTpvCtrl.$inject = [
        '$scope',
        'mainService',
        'toastService',
        'FileSaver',
        'Blob',
        'commonService'
    ]

    function consumoTpvCtrl($scope, mS, tS, FileSaver, Blob, _cS) {
        $scope.search = ''
        $scope.client = {}
        $scope.schedule = []
        $scope.configurations = []
        $scope.serviceArr = {}
        $scope.initialLoad = () => {
            try {
                let data = {
                    tipo: 4
                }
                mS.getData('get', '/consumoTpv/Get?json=' + JSON.stringify(data)).then(
                    response => {
                        if (response.code == '1') {
                            let tempArray = JSON.parse(response.payload)
                            tempArray[0].push({ idConfigTpv: 0, descripcion: 'Consolidado', onTime: false })
                            $scope.configurations = tempArray[0]
                            $scope.serviceArr = $scope.configurations.find(c => (c.onTime))
                            $scope.idConfigTpv = $scope.serviceArr.idConfigTpv
                            if ($scope.serviceArr.onTime) {
                                $scope.getActualRecords($scope.serviceArr.idConfigTpv)
                                return
                            } else {
                                $scope.getActualRecords(0)
                            }

                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
        $scope.initialLoad()

        $scope.enterKeyPressed = false
        $scope.getClient = ($event) => {
            try {
                if (!$event) {
                    $scope.enterKeyPressed = true
                } else {
                    if (!$scope.search) {
                        tS.toastr('warning', 'Debe de ingresar el número de identificación')
                        return
                    }
                }
                $scope.client = {}
                $scope.schedule = []
                let data = {
                    tipo: 3,
                    txtSearch: $scope.search
                }

                mS.getData('get', '/consumoTpv/Get?json=' + JSON.stringify(data)).then(
                    response => {
                        if (response.code == '1') {
                            $scope.search = ''
                            let tempArray = JSON.parse(response.payload)
                            $scope.client = tempArray[0][0]
                            for (const arr of tempArray[1]) {
                                $scope.schedule.push({
                                    idconsumoTpv: arr.idconsumoTpv,
                                    idConfigTpv: arr.idConfigTpv,
                                    codigo: arr.codigo,
                                    descripcion: arr.descripcion,
                                    horaInicio: formatTime(arr.horaInicio),
                                    horaFin: formatTime(arr.horaFin),
                                    estado: arr.estado,
                                    onTime: arr.onTime
                                })
                            }
                            //console.log(tempArray)
                            if ($scope.client.idEmpresa === 0) {
                                tS.toastr('warning', 'Cliente aun no tiene asignado una empresa')
                                return
                            }
                            if ($scope.enterKeyPressed && $scope.client.idEmpresa > 0) {
                                angular.forEach($scope.schedule, (value, index) => {
                                    if (value.idconsumoTpv === 0 && value.onTime) {
                                        $scope.save({
                                            idConfigTpv: value.idConfigTpv,
                                            onTime: value.onTime,
                                            cantidad: 1
                                        })
                                    }
                                })
                            }
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }

        $scope.actualRecords = []
        $scope.getActualRecords = (item) => {
            try {
                $scope.actualRecords = []

                mS.getData('get', '/ConsumoTpv/Get?json=' + JSON.stringify({ tipo: 1, idConfigTpv: Number(item) })).then(
                    response => {
                        if (response.code == '1') {
                            let tempArrayII = JSON.parse(response.payload)
                            $scope.actualRecords = tempArrayII[0]
                        } else {
                            tS.toastr('info', 'Aun no existen registros de consumos!')
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }

        $scope.askToSave = (item) => {
            if ($scope.client.idEmpresa === 0) {
                tS.toastr('warning', 'Cliente aun no tiene asignado una empresa')
                return
            }
            if (item.idConfigTpv > 0) {
                Swal.fire({
                    title: '¿Está seguro/a de guardar este consumo?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    html: `<div class="col-12"><div class="form-group"><label for="cantidadConsumo">Cantidad:</label><input type="number" id="cantidadConsumo" onfocus="this.select();" class="form-control text-center" value="1" min="1" /></div></div>`,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si!',
                    cancelButtonText: 'No',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        let cantidad = document.getElementById('cantidadConsumo').value
                        if (!cantidad) {
                            tS.toastr('warning', 'Debe ingresar una cantidad')
                        } else {
                            $scope.save(item, cantidad)
                        }
                    } else {
                        let indexArray = $scope.schedule.indexOf(item)
                        angular.forEach($scope.schedule, (value, index) => {
                            if (indexArray === index) {
                                value.estado = false
                            }
                            $scope.$digest()
                        });
                    }
                })
            } else {
                tS.toastr('warning', 'Aun no se ha guardado este servicio!')
            }
        }

        function startAgain() {
            //$scope.getClient('No Enter')
            $scope.initialLoad()
            $scope.playSound()
        }
        $scope.save = (item, cantidad = null) => {
            try {
                let data = {
                    tipo: 1,
                    idConfigTpv: item.idConfigTpv,
                    idCliente: $scope.client.idCliente,
                    onTime: item.onTime,
                    cantidad: (cantidad > 0 ? cantidad : item.cantidad)
                }
                mS.getData('post', '/consumoTpv/Post?json=' + JSON.stringify(data)).then(
                    response => {
                        if (response.code == '1') {
                            if ($scope.enterKeyPressed) {
                                $scope.enterKeyPressed = false
                            }
                            _cS.print(JSON.parse(response.payload))
                            startAgain()
                            tS.toastr('success', response.message)
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            } catch (error) {
                console.log(error)
            }
        }

        function formatDateTimeZone(fecha) {
            const formatDateMoment = moment.tz(fecha, "America/Guayaquil")
            return formatDateMoment.format("YYYY-MM-DD h:mm A");
        }

        $scope.otherRecord = {}
        $scope.addOther = (item) => {
            $scope.otherRecord = {
                idConfigTpv: item.idConfigTpv,
                servicio: item.descripcion,
                idCliente: $scope.client.idCliente,
                razonSocial: $scope.client.razonSocial,
                fechaConsumo: new Date(),
                cantidad: 1
            }
            $('#modalOther').modal('show')
        }

        $scope.onChangeFechaConsumo = () => {

            // $scope.otherRecord.fechaConsumo = new Date(fechaConsumo);
        }
        $scope.saveOther = () => {
            try {
                // console.log($scope.otherRecord)
                // return
                let data = {
                    tipo: 2,
                    idConfigTpv: $scope.otherRecord.idConfigTpv,
                    idCliente: $scope.otherRecord.idCliente,
                    fechaConsumo: formatDateTimeZone($scope.otherRecord.fechaConsumo),
                    cantidad: $scope.otherRecord.cantidad
                }
                console.log(JSON.stringify(data))
                mS.getData('post', '/ConsumoTpv/Post?json=' + JSON.stringify(data)).then(
                    response => {
                        if (response.code == '1') {
                            $scope.otherRecord = {}
                            _cS.print(JSON.parse(response.payload))
                            startAgain()
                            $('#modalOther').modal('hide')
                            tS.toastr('success', response.message)
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }

        $scope.askToDelete = (item) => {
            if (item.idconsumoTpv > 0) {
                Swal.fire({
                    title: '¿Está seguro/a de eliminar este servicio?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si!',
                    cancelButtonText: 'No',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        $scope.delete(item)
                    }
                })
            } else {
                tS.toastr('warning', 'Aun no se ha guardado este servicio!')
            }
        }

        $scope.delete = (item) => {
            try {
                mS.getData('delete', '/consumoTpv/Delete?id=' + item.idconsumoTpv).then(
                    response => {
                        if (response.code == '1') {
                            tS.toastr('success', response.message)
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
        //Print Section
        $scope.print = (item) => {
            try {
                console.log(item)
                mS.getData('post', '/ConsumoTpv/Print?id=' + item.idConsumoTpv).then(
                    response => {
                        // if (response.code == "1") {
                        //     toastr.success(response.message, "")
                        // } else {
                        //     toastr.warning(response.message, "")
                        // }
                    }, error => {
                        console.error(error)
                    })
            } catch (error) {
                console.log(error)
            }
        }
        //**End Print Section */



        /**Anuación */
        $scope.getStatus = (item) => {
            try {
                mS.getData('get', '/ConsumoAnuladoTpv/Get?json=' + JSON.stringify({ idConsumoTpv: item.idConsumoTpv })).then(
                    response => {
                        if (response.code == '1') {
                            Swal.fire({
                                title: 'Motivo Anulación',
                                icon: 'info',
                                text: JSON.parse(response.payload)[0].motivo,
                                allowOutsideClick: false
                            }).then((result) => {
                            })
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
        $scope.askToRevert = (item) => {
            Swal.fire({
                title: '¿Está seguro/a de anular este consumo?',
                icon: 'warning',
                html: `<input type="text" id="motivoAnulacion" class="form-control" placeholder="Ingrese el motivo" />`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                cancelButtonText: 'No',
                allowOutsideClick: false
            }).then((result) => {
                if (result.value) {
                    let txtMotivo = document.getElementById('motivoAnulacion').value
                    if (!txtMotivo) {
                        tS.toastr('warning', 'Debe ingresar un motivo')
                    } else {
                        $scope.revert(item, txtMotivo)
                    }
                }
            })
        }
        $scope.revert = (item, motivo) => {
            try {
                //console.log(item)
                mS.getData('post', '/ConsumoAnuladoTpv/Post?json=' + JSON.stringify({ idConsumoTpv: item.idConsumoTpv, motivo: motivo })).then(
                    response => {
                        if (response.code == '1') {
                            $scope.initialLoad()
                            tS.toastr('success', response.message)
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
        /**End Anulacion */

        /**Reports */
        $scope.getReportApi = (data) => {
            try {
                showLoader()
                let tempArray = JSON.parse(data)[0][0]
                let parameters = {
                    rdlcProps: JSON.parse(tempArray.rdlcProps)[0],
                    dataSources: JSON.parse(tempArray.dataSources)[0],
                    rdlcParams: JSON.parse(tempArray.rdlcParams)[0]
                }
                let urlReports = document.getElementById('urlReports').value
                mS.getFile('POST', urlReports + 'api/Reporte/GetReport', parameters).then(
                    response => {
                        if (response) {
                            hideLoader()
                            let fileBlob = new Blob([response.data], { type: response.headers()['content-type'] });
                            let objectUrl = window.URL || window.webkitURL;
                            let urlFile = objectUrl.createObjectURL(fileBlob);

                            // Ajuste horizontal
                            let x = parseInt((screen.width - 1200) / 2);
                            // Ajustae vertical
                            let y = parseInt((screen.height - 650) / 4);

                            window.open(urlFile, "_blank",
                                `resizable=yes
                                             width=1200
                                             height=650
                                             screenY=${y}
                                             screenX=${x}`
                            )

                        }
                    }, error => {
                        hideLoader()
                        console.log(error)
                    }
                )
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }
        $scope.getReport = (tipo) => {
            try {
                showLoader()
                mS.getData('get', '/consumoTpv/Get?json=' + JSON.stringify({ tipo: 5, formato: tipo == 1 ? 'pdf' : 'excel', idConfigTpv: Number(document.getElementById('idConfigTpv').value) })).then(
                    response => {
                        if (response.code == '1') {
                            hideLoader()
                            $scope.getReportApi(response.payload)
                        }
                    }, error => {
                        hideLoader()
                        console.log(error)
                    }
                )
            } catch (error) {
                hideLoader()
                console.log(error)
            }
        }
        /**End Reports */
        /**Utils*/

        function formatTime(stringTime) {
            let date = new Date();
            let splitTime = stringTime.split(':')
            date.setHours(splitTime[0], splitTime[1], splitTime[2])
            date.setSeconds(0)
            date.setMilliseconds(0)
            return date;
        }

        $scope.playSound = () => {
            let x = document.getElementById("audioNotify")
            x.play()
        }
        /**End Utils */
    }
})(window.angular);
