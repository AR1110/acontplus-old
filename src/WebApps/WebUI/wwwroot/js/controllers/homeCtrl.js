(function () {
    'use strict';

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'mainService', 'docElectService', '$interval', '$q', 'modalService'];

    function homeCtrl($scope, mS, docElectSvc, $interval, $q, modalService) {
        $scope.docs = []
        $scope.countDownDate = 0;
        let warningMessage = '';
        $scope.expired = false;
        $scope.alertIsOpened = false;
        $scope.releases = []

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

        $scope.openReleases = () => {
            let release = `<table class="table table-bordered">
                                        <thead>
                                            <tr class="small">
                                                <th>Version</th>
                                                <th>Detalles</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;

            const groupedReleases = $scope.releases.reduce((acc, rel) => {
                const date = rel.releaseDate.split('T')[0]; // Assuming releaseDate is in ISO format
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(rel);
                return acc;
            }, {});

            for (const [date, releases] of Object.entries(groupedReleases)) {
                release += `<tr class="small">
                                            <td colspan="2">${date}</td>
                                        </tr>`;
                for (const rel of releases) {
                    release += `<tr class="small">
                                                <td style="vertical-align: middle;">${rel.version}</td>
                                                <td>${rel.description}</td>
                                            </tr>`;
                }
            }

            release += `</tbody></table>`;


            swal.fire({
                icon: 'info',
                title: `Nuevas Actualizaciones Disponibles</b>`,
                html: release,
                width: '800px',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: true,
                confirmButtonText: 'Confirmar Lectura'
            }).then(result => {
                if (result.isConfirmed) {
                    const dataToSave = {
                        releases: JSON.stringify($scope.releases.map(release => ({ id: release.id })))
                    };
                    mS.getData('post', 'Common/UserReleaseRead', { data: dataToSave }).then(response => {
                        if (response.code == '1') {
                            swal.fire({
                                icon: 'info',
                                text: response.message,
                                allowOutsideClick: false
                            })

                            const hasLogoutRequired = $scope.releases.some(release => release.logoutRequired === true);

                            if (hasLogoutRequired) {
                                $scope.logout();
                            };
                        }
                    })
                }
            })
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
            return mS.getData('get', `Common/Dashboard/?json=${JSON.stringify({ tipo: 1 })}`);
        }

        function getDocs() {
            //return docElectSvc.getByStatus({ tipo: 3 });

            let dataSearch = {
                codEstado: 8
            }
            return docElectSvc.getAll(dataSearch)
        }

        function init() {
            const dashboardPromises = getDashboard().catch(error => { console.log(error) });
            const documentsPromises = getDocs().catch(error => { console.log(error) });
            $q.all([dashboardPromises, documentsPromises]).then(response => {
                const [dashboardData, comprobantesElectronicos] = response;
                 
                if (dashboardData) {
                    const { statistics, licenses, releases } = JSON.parse(dashboardData.payload)
                    $scope.cantidad = angular.fromJson(statistics)
                    $scope.licenses = angular.fromJson(licenses) || []
                    $scope.releases = angular.fromJson(releases) || []
                    if ($scope.releases.length > 0) {

                        $scope.openReleases();
                    }

                    if ($scope.licenses.length > 0) {
                        let expired = $scope.licenses[0].expired || false

                        if (expired) {
                            warningMessage = $scope.licenses[0].warningMessage
                            $scope.openAlertExpired()
                            return
                        }
                        let maxPaymentDate = $scope.licenses[0].maxPaymentDate;
                        let date1 = new Date();
                        let date2 = new Date(maxPaymentDate);

                        // To calculate the time difference of two dates 
                        let differenceInTime = date2.getTime() - date1.getTime();

                        // To calculate the no. of days between two dates 
                        let differenceInDays = differenceInTime / (1000 * 3600 * 24);

                        if ($scope.licenses.length == 1) {
                            warningMessage = $scope.licenses[0].warningMessage;
                            $scope.countDownDate = new Date(maxPaymentDate).setMinutes(new Date().getMinutes() + 5);




                            if (differenceInDays <= 30) {
                                $scope.startTimer();
                            }
                        }
                        if ($scope.licenses.length > 1 && differenceInDays <= 30) {
                            modalService.openModalCustom({
                                controller: ["$uibModalInstance", "$scope", ($uibModalInstance, $scope) => {
                                    $scope.onClose = () => {
                                        $uibModalInstance.close();
                                    }
                                }],
                                scope: $scope,
                                size: 'xl',
                                template: '~/Pages/Shared/_LicensesModal.cshtml'
                            })
                        }
                    }
                }
                if (comprobantesElectronicos) { 
                    modalService.openModalCustom({
                        controller: ["$uibModalInstance", "$scope", "docElectService", "params", ($uibModalInstance, $scope, docElectSvc, params) => {
                            const { comprobantesElectronicos } = params;
                            $scope.docs = comprobantesElectronicos;
                            $scope.dataSearch = {
                                pageIndex:1,
                                pageSize:25,
                                totalRecords: 0,
                                recordsQuantity: [25,50,100],
                                maxSize: 5
                            }
                            if($scope.docs.length>0){
                                $scope.dataSearch.totalRecords = $scope.docs[0].totalRecords;
                            }

                            function getDocs() { 
                                let dataSearch = {
                                    codEstado: 8,
                                    pageIndex: $scope.dataSearch.pageIndex,
                                    pageSize: $scope.dataSearch.pageSize
                                }
                                docElectSvc.getAll(dataSearch).then(response=>{
                                    $scope.docs = response;
                                    if ($scope.docs.length > 0) {
                                        $scope.dataSearch.totalRecords = $scope.docs[0].totalRecords;
                                    }
                                })
                            }


                            $scope.pageChanged = function () {
                                getDocs()
                            }

                            $scope.changePageSize = function () {
                                $scope.dataSearch.pageIndex = 1;
                                getDocs()
                            }

                            $scope.fixDocs = () => {
                                location.href = '/FactElect/DocumentoElectronico/Index?tipo=' + 3
                            }

                            $scope.onClose = () => {
                                $uibModalInstance.close();
                            }
                        }],
                        //scope: $scope,
                        params: {
                            comprobantesElectronicos
                        },
                        size: 'xl',
                        template: '~/Pages/Shared/_ComprobantesErroneos.cshtml'
                    })
                }

            });
        }
        init()

        
    }
})(window.angular)