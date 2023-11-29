(function () {
    'use strict';

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'mainService', 'docElectService', '$interval'];

    function homeCtrl($scope, mS, docElectSvc, $interval) {
        $scope.docs = []

        if (JSON.parse(localStorage.getItem('userData')) === null) {
            $scope.logout();
            return
        }

        $scope.userData = JSON.parse(localStorage.getItem('userData'));

        $scope.licenseExpiration = $scope.userData.licenseExpiration || {};
        if (angular.equals($scope.licenseExpiration, {})) {
            $scope.logout();
            return
        }

        let { hasSubscription, expiryDate, messageExpiration } = JSON.parse($scope.licenseExpiration)

        //var countDownDate = new Date($scope.userData.expiryDate).getTime();
        let countDownDate = new Date(expiryDate).setMinutes(new Date().getMinutes() + 5);
        $scope.expired = false;
        $scope.alertIsOpened = false;

        $scope.openAlert = () => {
            $scope.alertIsOpened = true
            swal.fire({
                icon: 'warning',
                title: 'Alerta',
                html: `${messageExpiration}<br><h2 class="text-warning" id="expirationCounter"></h2>`,
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
                html: `${messageExpiration}`,
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

        $scope.updateTimer = function () {

            $scope.timer = $interval(function () {
                console.log('updating')
                let now = new Date().getTime();
                let distance = countDownDate - now;

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

        if (hasSubscription) {
            var date1 = new Date();
            var date2 = new Date(expiryDate);
            console.log(date2)
            // To calculate the time difference of two dates 
            var differenceInTime = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates 
            var differenceInDays = differenceInTime / (1000 * 3600 * 24);
            if (differenceInDays <= 30) {
                $scope.updateTimer();
            }
        }

        function getDocs() {
            docElectSvc.getByStatus({ tipo: 3 }).then(response => {
                $scope.docs = response;
                $('#comprobantesErroneosModal').modal('show');
            }
            ).catch(error => {
                console.log(error)
            })
        }

        $scope.init = () => {
            mS.getData('get', 'Dashboard/', null, true).then(function (response) {
                if (response.code == 0) {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.cantidad = JSON.parse(response.payload)
            }).catch(error => {
                console.log(error)
            })
            getDocs()
        }

        $scope.init();


        $scope.fixDocs = () => {
            location.href = '/DocumentoElectronico/Index?tipo=' + 3
        }
    }
})(window.angular)