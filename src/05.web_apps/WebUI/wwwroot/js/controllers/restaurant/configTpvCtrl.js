(function () {
    'use strict';

    app.controller('configTpvCtrl', configTpvCtrl)
    configTpvCtrl.$inject = ['$scope', 'mainService', 'toastService']
    function configTpvCtrl($scope, mS, tS) {
        $scope.configurations = []
        function formatTime(stringTime) {
            let date = new Date();
            let splitTime = stringTime.split(':')
            date.setHours(splitTime[0], splitTime[1], splitTime[2])
            date.setSeconds(0)
            date.setMilliseconds(0)
            return date;
        }
        $scope.printerConfig = false
        $scope.initialLoad = () => {
            try {
                $scope.configurations = []
                mS.getData('get', '/ConfigTpv/Get').then(
                    response => {
                        if (response.code == '1') {
                            let tempArray = JSON.parse(response.payload)
                            for (const arr of tempArray) {
                                $scope.configurations.push({
                                    idConfigTpv: arr.idConfigTpv,
                                    codigo: arr.codigo,
                                    descripcion: arr.descripcion,
                                    horaInicio: formatTime(arr.horaInicio),
                                    horaFin: formatTime(arr.horaFin),
                                    estado: arr.estado
                                })
                            }
                        } else {
                            tS.toastr('warning', response.message)
                        }
                    }, error => {
                        console.log(error)
                    }
                )
                mS.getData('get', '/ConfigPrinter/Get').then(
                    response => {
                        if (response.code == '1') {
                            let tempArray = JSON.parse(response.payload)
                            $scope.printerConfig = tempArray[0].estado
                        } else {
                            console.log(response.message)
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

        $scope.validateTime = (start, end) => {
            if (start == end) {
                return false
            }
            if (start > end) {
                return false
            }
            if (end > start) {
                return true
            }
        }

        $scope.save = (item) => {
            try {
                let horaInicio = $('#horaInicio-' + item.codigo).val()
                let horaFin = $('#horaFin-' + item.codigo).val()

                if (!$scope.validateTime(horaInicio, horaFin)) {
                    tS.toastr('warning', 'Horario incorrecto: ' + item.descripcion)
                    return
                }

                if (!horaInicio) {
                    tS.toastr('warning', 'Seleccione una hora de inicio para el servicio de: ' + item.descripcion)
                    return
                }
                if (!horaFin) {
                    tS.toastr('warning', 'Seleccione una hora de fin para el servicio de: ' + item.descripcion)
                    return
                }
                let method = '', url = ''
                let data = {
                    idConfigTpv: item.idConfigTpv,
                    codigo: item.codigo,
                    descripcion: item.descripcion,
                    horaInicio: horaInicio,
                    horaFin: horaFin,
                    estado: item.estado
                }
                if (item.idConfigTpv > 0) {
                    method = 'put'
                    url = '/ConfigTpv/Put?json=' + JSON.stringify(data)
                } else {
                    method = 'post'
                    url = '/ConfigTpv/Post?json=' + JSON.stringify(data)
                }

                mS.getData(method, url).then(
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

        $scope.put = (item) => {
            try {
                mS.getData('put', '/ConfigTpv/Put?json=' + JSON.stringify(item)).then(
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

        $scope.askToDelete = (item) => {
            if (item.idConfigTpv > 0) {
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
                mS.getData('delete', '/ConfigTpv/Delete?id=' + item.idConfigTpv).then(
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
        $scope.saveConfigPrinter = (item) => {
            try {
                let method = '', url = ''
                method = 'post'
                url = '/ConfigPrinter/Post?estado=' + $scope.printerConfig
                mS.getData(method, url).then(
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

    }
})(window.angular);
