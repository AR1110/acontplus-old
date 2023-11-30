(function () {
    'use strict';

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'mainService', 'docElectService', '$interval', '$q'];

    function homeCtrl($scope, mS, docElectSvc, $interval, $q) {
        $scope.docs = []
        $scope.countDownDate = 0;
        let warningMessage = '';
        $scope.expired = false;
        $scope.alertIsOpened = false;

        $scope.openAlert = () => {
            $scope.alertIsOpened = true
            swal.fire({
                icon: 'warning',
                title: 'Alerta',
                html: `${warningMessage}<br><h2 class="text-warning" id="expirationCounter"></h2>`,
                showConfirmButton: true,
            }).then((result) => {
                $scope.stopTimer();
            });
        }


        $scope.openAlertMultiple = () => {
            let message
            message = `<h5>Licencias Pendientes a Pagar</h5><br><table class="table table-bordered">
                            <thead>
                                <tr class="small">
                                    <th>Licencia</th>
                                    <th>Suscripcion</th>
                                    <th>F. Max Pago</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>`
            for (const art of $scope.licenses) {
                message += `<tr class="small">
                                <td>${art.licenseCode} - ${art.licenseType}</td>
                                <td>${art.susbscriptionType}</td>
                                <td>${art.maxPaymentDate}</td>
                                <td class"text-right">$ ${art.total}</td>
                            </tr>`
            }
            message += `</tbody></table>`

            swal.fire({
                icon: 'warning',
                title: 'Alerta',
                html: message,
                width: '800px',
                showConfirmButton: true,
            }).then((result) => {
                $scope.stopTimer();
            });
        }

        $scope.openAlertExpired = () => {
            $scope.expired = true
            let timerInterval
            swal.fire({
                icon: 'warning',
                title: 'Alerta',
                html: `${warningMessage}`,
                timer: 6000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getHtmlContainer()
                        if (content) {
                            const b = content.querySelector('b')
                            if (b) {
                                b.textContent = Swal.getTimerLeft()
                            }
                        }
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    $scope.logout();
                };
            });
        }

        $scope.timer = null;
        $scope.stopTimer = function () {

            //Set the Timer stop message.
            $scope.Message = "Timer stopped.";

            //Cancel the Timer.
            if (angular.isDefined($scope.timer)) {
                $interval.cancel($scope.timer);
            }
        };

        $scope.startTimer = function () {
            $scope.timer = $interval(function () {
                let now = new Date().getTime();
                let distance = $scope.countDownDate - now;

                $scope.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                $scope.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                $scope.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                $scope.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (!$scope.alertIsOpened) {
                    $scope.openAlert();
                }

                document.getElementById("expirationCounter").innerHTML = $scope.days + "d " + $scope.hours + "h "
                    + $scope.minutes + "m " + $scope.seconds + "s ";

                if (distance == 0) {
                    $scope.stopTimer()
                    if (!$scope.expired) {
                        $scope.openAlertExpired()
                    }
                }
            }, 1000)
        };
        function getDashboard() {
            return mS.getData('get', 'Dashboard/', null, true);
        }

        function getDocs() {
            return docElectSvc.getByStatus({ tipo: 3 });
        }

        function init() {
            const dashboardPromises = getDashboard().catch(error => { console.log(error) });
            const documentsPromises = getDocs().catch(error => { console.log(error) });
            $q.all([dashboardPromises, documentsPromises]).then(response => {
                if (response[0]) {
                    let dashboard = JSON.parse(response[0].payload);
                    $scope.cantidad = angular.fromJson(dashboard[0].statistics);
                    $scope.licenses = angular.fromJson(dashboard[0].licenses) || []

                    if ($scope.licenses.length > 0) {
                        let expired = angular.fromJson(dashboard[0].licenses)[0].expired || false

                        if (expired) {
                            warningMessage = angular.fromJson(dashboard[0].licenses)[0].warningMessage
                            $scope.openAlertExpired()
                            return
                        }
                    }

                    if ($scope.licenses.length == 1) {
                        let maxPaymentDate = $scope.licenses[0].maxPaymentDate;
                        warningMessage = $scope.licenses[0].warningMessage;
                        $scope.countDownDate = new Date(maxPaymentDate).setMinutes(new Date().getMinutes() + 5);

                        let date1 = new Date();
                        let date2 = new Date(maxPaymentDate);

                        // To calculate the time difference of two dates 
                        let differenceInTime = date2.getTime() - date1.getTime();

                        // To calculate the no. of days between two dates 
                        let differenceInDays = differenceInTime / (1000 * 3600 * 24);
                        if (differenceInDays <= 30) {
                            $scope.startTimer();
                        }
                    }
                    if ($scope.licenses.length > 1) {
                        $scope.openAlertMultiple();
                    }
                }
                if (response[1]) {
                    $scope.docs = response[1]
                    $('#comprobantesErroneosModal').modal('show');
                }

            });
        }
        init()

        $scope.fixDocs = () => {
            location.href = '/DocumentoElectronico/Index?tipo=' + 3
        }
    }
})(window.angular)