//@ts-check
(function () {
    "use strict";

    app.controller("homeCtrl", homeCtrl);

    homeCtrl.$inject = [
        "$scope",
        "mainService",
        "docElectService",
        "$interval",
        "$q",
        "modalService",
    ];

    function homeCtrl($scope, mS, docElectSvc, $interval, $q, modalService) {
        $scope.docs = [];
        $scope.countDownDate = 0;
        let warningMessage = "";
        $scope.expired = false;
        $scope.alertIsOpened = false;
        $scope.releases = [];
        $scope.stepsConfig = [];
        $scope.expiredSignatures = [];
        $scope.emittedDocuments = [];
        $scope.receivedDocuments = [];
        $scope.anotherSalesDocs = [];

        let chartEmittedDocs = null,
            chartReceivedDocs = null,
            chartAnoterSalesDocuments;

        $scope.openAlert = () => {
            $scope.alertIsOpened = true;
            swal
                .fire({
                    icon: "warning",
                    title: "Alerta",
                    html: `${warningMessage}<br><h2 class="text-warning" id="expirationCounter"></h2>`,
                    showConfirmButton: true,
                })
                .then((result) => {
                    $scope.stopTimer();
                });
        };

        $scope.openAlertExpired = () => {
            $scope.expired = true;
            let timerInterval;
            swal
                .fire({
                    icon: "warning",
                    title: "Alerta",
                    html: `${warningMessage}`,
                    timer: 6000,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                        timerInterval = setInterval(() => {
                            const content = Swal.getHtmlContainer();
                            if (content) {
                                const b = content.querySelector("b");
                                if (b) {
                                    b.textContent = Swal.getTimerLeft();
                                }
                            }
                        }, 100);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                })
                .then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        $scope.logout();
                    }
                });
        };

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
                const date = rel.releaseDate.split("T")[0]; // Assuming releaseDate is in ISO format
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
                                                <td>${rel.content}</td>
                                            </tr>`;
                }
            }

            release += `</tbody></table>`;

            modalService.openModalCustom({
                controller: [
                    "$uibModalInstance",
                    "$scope",
                    "$timeout",
                    "$sce",
                    "mainService",
                    "params",
                    ($uibModalInstance, $scope, $timeout, $sce, mS, params) => {
                        const { release, releases } = params;

                        $scope.releases = releases || [];
                        $scope.releaseTable = $sce.trustAsHtml(release);

                        $scope.confirmRead = () => {
                            const dataToSave = {
                                releases: JSON.stringify(
                                    $scope.releases.map((release) => ({ id: release.id })),
                                ),
                            };
                            mS.getData("post", "Common/UserReleaseRead", {
                                data: dataToSave,
                            }).then((response) => {
                                if (response.code == "1") {
                                    swal.fire({
                                        icon: "info",
                                        text: response.message,
                                        allowOutsideClick: false,
                                    });

                                    const hasLogoutRequired = $scope.releases.some(
                                        (release) => release.logoutRequired === true,
                                    );

                                    if (hasLogoutRequired) {
                                        $scope.logout();
                                    } else {
                                        $scope.onClose();
                                    }
                                }
                            });
                        }

                        $scope.onClose = () => {
                            $uibModalInstance.close();
                        };
                    },
                ],
                params: {
                    release,
                    releases: $scope.releases
                },
                size: "lg",
                template: "~/Pages/Shared/_ReleasesModal.cshtml",
            });
        };

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
                $scope.hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                );
                $scope.minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60),
                );
                $scope.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (!$scope.alertIsOpened) {
                    $scope.openAlert();
                }

                document.getElementById("expirationCounter").innerHTML =
                    $scope.days +
                    "d " +
                    $scope.hours +
                    "h " +
                    $scope.minutes +
                    "m " +
                    $scope.seconds +
                    "s ";

                if (distance == 0) {
                    $scope.stopTimer();
                    if (!$scope.expired) {
                        $scope.openAlertExpired();
                    }
                }
            }, 1000);
        };

        function getDashboard() {
            return mS.getData(
                "get",
                `Common/Dashboard/?json=${JSON.stringify({ tipo: 1 })}`,
            );
        }

        function getDocs() {
            //return docElectSvc.getByStatus({ tipo: 3 });

            let dataSearch = {
                codEstado: 8,
            };
            return docElectSvc.getAll(dataSearch);
        }

        function getReleases() {
            return mS.getData(
                "get",
                `Common/Release`
            );
        }

        function init() {
            const dashboardPromises = getDashboard().catch((error) => {
                console.log(error);
            });
            const documentsPromises = getDocs().catch((error) => {
                console.log(error);
            });
            const releasesPromise = getReleases().catch((error) => {
                console.log(error);
            });
            $q.all([dashboardPromises, documentsPromises, releasesPromise]).then((response) => {
                const [responseDashboard, comprobantesElectronicos, releases] = response;

                $scope.releases = releases.payload || [];

                /*if ($scope.releases.length > 0) {
                    $scope.openReleases();
                }*/

                if (comprobantesElectronicos && comprobantesElectronicos.length > 0) {
                    modalService.openModalCustom({
                        controller: [
                            "$uibModalInstance",
                            "$scope",
                            "docElectService",
                            "params",
                            ($uibModalInstance, $scope, docElectSvc, params) => {
                                const { comprobantesElectronicos } = params;
                                $scope.docs = comprobantesElectronicos;
                                $scope.dataSearch = {
                                    pageIndex: 1,
                                    pageSize: 25,
                                    totalRecords: 0,
                                    recordsQuantity: [25, 50, 100],
                                    maxSize: 5,
                                };
                                if ($scope.docs.length > 0) {
                                    $scope.dataSearch.totalRecords = $scope.docs[0].totalRecords;
                                }

                                function getDocs() {
                                    let dataSearch = {
                                        codEstado: 8,
                                        pageIndex: $scope.dataSearch.pageIndex,
                                        pageSize: $scope.dataSearch.pageSize,
                                    };
                                    docElectSvc.getAll(dataSearch).then((response) => {
                                        $scope.docs = response;
                                        if ($scope.docs.length > 0) {
                                            $scope.dataSearch.totalRecords =
                                                $scope.docs[0].totalRecords;
                                        }
                                    });
                                }

                                $scope.pageChanged = function () {
                                    getDocs();
                                };

                                $scope.changePageSize = function () {
                                    $scope.dataSearch.pageIndex = 1;
                                    getDocs();
                                };

                                $scope.fixDocs = () => {
                                    location.href =
                                        "/FactElect/DocumentoElectronico/Index?tipo=" + 3;
                                };

                                $scope.onClose = () => {
                                    $uibModalInstance.close();
                                };
                            },
                        ],
                        //scope: $scope,
                        params: {
                            comprobantesElectronicos,
                        },
                        size: "xl",
                        template: "~/Pages/Shared/_ComprobantesErroneos.cshtml",
                    });
                }

                let dashboardData = JSON.parse(responseDashboard.payload);
                if (dashboardData) {
                    const { statistics, licenses, stepsConfig, expiredSignatures, emittedDocuments, receivedDocuments, anotherSalesDocs } = dashboardData;
                    $scope.cantidad = statistics[0] || [];
                    $scope.licenses = licenses || [];
                    $scope.stepsConfig = stepsConfig || [];
                    $scope.expiredSignatures = expiredSignatures || [];
                    $scope.emittedDocuments = emittedDocuments || [];
                    $scope.receivedDocuments = receivedDocuments || [];
                    $scope.anotherSalesDocs = anotherSalesDocs || [];

                    if ($scope.emittedDocuments.length > 0) {
                        // Prepare the data for the chart
                        let labels = [];
                        let totals = [];
                        let backgroundColors = [];
                        let borderColors = [];

                        // Loop through the documents and extract the type and total for each
                        $scope.emittedDocuments.forEach(function (doc) {
                            labels.push(doc.document);          // Document type (e.g., "Invoices", "Credit Notes")
                            totals.push(doc.total);          // Total for the document type
                            backgroundColors.push(getRandomColor(0.2)); // Random background color with 0.2 opacity
                            borderColors.push(getRandomColor(1));       // Random border color with full opacity
                        });

                        // Call the function to render the chart with the updated data
                        $scope.renderChart(labels, totals, backgroundColors, borderColors);
                    }

                    if ($scope.receivedDocuments.length > 0) {
                        // Prepare the data for the chart
                        let labels = [];
                        let totals = [];
                        let backgroundColors = [];
                        let borderColors = [];

                        // Loop through the documents and extract the type and total for each
                        $scope.receivedDocuments.forEach(function (doc) {
                            labels.push(doc.document);          // Document type (e.g., "Invoices", "Credit Notes")
                            totals.push(doc.total);          // Total for the document type
                            backgroundColors.push(getRandomColor(0.2)); // Random background color with 0.2 opacity
                            borderColors.push(getRandomColor(1));       // Random border color with full opacity
                        });

                        // Call the function to render the chart with the updated data
                        $scope.renderChartReceived(labels, totals, backgroundColors, borderColors);
                    }
                    if ($scope.anotherSalesDocs.length > 0) {
                        // Prepare the data for the chart
                        let labels = [];
                        let totals = [];
                        let backgroundColors = [];
                        let borderColors = [];

                        // Loop through the documents and extract the type and total for each
                        $scope.anotherSalesDocs.forEach(function (doc) {
                            labels.push(doc.document);          // Document type (e.g., "Invoices", "Credit Notes")
                            totals.push(doc.total);          // Total for the document type
                            backgroundColors.push(getRandomColor(0.2)); // Random background color with 0.2 opacity
                            borderColors.push(getRandomColor(1));       // Random border color with full opacity
                        });

                        // Call the function to render the chart with the updated data
                        $scope.renderAnotherSalesDocsChart(labels, totals, backgroundColors, borderColors);
                    }

                    if ($scope.stepsConfig.length > 0) {
                        location.href = '/Config/WizardConfig/Index'
                    }

                    if ($scope.licenses.length > 0) {
                        let expired = $scope.licenses[0].expired || false;

                        if (expired) {
                            warningMessage = $scope.licenses[0].warningMessage;
                            $scope.openAlertExpired();
                            return;
                        }
                        let maxPaymentDate = $scope.licenses[0].maxPaymentDate;
                        let date1 = new Date();
                        let date2 = new Date(maxPaymentDate);

                        // To calculate the time difference of two dates
                        const differenceInTime = date2.getTime() - date1.getTime();

                        // To calculate the no. of days between two dates
                        let differenceInDays = differenceInTime / (1000 * 3600 * 24);
                        differenceInDays = Math.round(differenceInDays);

                        if ($scope.licenses.length == 1) {
                            warningMessage = $scope.licenses[0].warningMessage;
                            $scope.countDownDate = new Date(maxPaymentDate).setMinutes(
                                new Date().getMinutes() + 5,
                            );

                            if (differenceInDays <= 30) {
                                $scope.startTimer();
                            }
                        }

                        const totalLicenses = $scope.licenses.filter((x) => x.licenseCode != "ERP-D").length;

                        if (
                            totalLicenses >
                            1 &&
                            differenceInDays <= 30
                        ) {
                            modalService.openModalCustom({
                                controller: [
                                    "$uibModalInstance",
                                    "$scope",
                                    ($uibModalInstance, $scope) => {
                                        $scope.onClose = () => {
                                            $uibModalInstance.close();
                                        };
                                    },
                                ],
                                scope: $scope,
                                size: "xl",
                                template: "~/Pages/Shared/_LicensesModal.cshtml",
                            });
                        }
                    }

                    if ($scope.expiredSignatures.length > 0) {
                        modalService.openModalCustom({
                            controller: [
                                "$uibModalInstance",
                                "$scope",
                                "params",
                                ($uibModalInstance, $scope, params) => {

                                    const { message } = params;

                                    $scope.message = message;

                                    $scope.onClose = () => {
                                        $uibModalInstance.close();
                                    };

                                    $scope.onSupport = () => {
                                        window.open('https://api.whatsapp.com/send?phone=593986669930', '_blank');
                                    }
                                },
                            ],
                            scope: $scope,
                            params: {
                                message: $scope.expiredSignatures[0].message
                            },
                            size: "sm",
                            template: "~/Pages/Shared/_SignatureModal.cshtml",
                        });
                    }
                }
            });
        }
        init();

        // Function to render the chart
        $scope.renderChart = function (labels, totals, backgroundColors, borderColors) {
            let ctx = document.getElementById('documentChart').getContext('2d');

            // If the chart instance already exists, destroy it before creating a new one
            if (chartEmittedDocs && chartEmittedDocs !== null) {
                chartEmittedDocs.destroy();
            }

            // Create the new chart instance

            chartEmittedDocs = new Chart(ctx, {
                type: 'bar', // You can change the chart type (e.g., 'line', 'pie', etc.)
                data: {
                    labels: labels, // X-axis labels (document types)
                    datasets: [{
                        label: 'Documentos Emitidos',
                        data: totals, // Data values (totals for each document type)
                        backgroundColor: backgroundColors, // Dynamic background colors
                        borderColor: borderColors, // Dynamic border colors
                        borderWidth: 1
                    }]
                },
                options: {
                    //plugins: {
                    //    // Enable the Data Labels plugin to show labels on bars
                    //    datalabels: {
                    //        anchor: 'end',
                    //        align: 'top',
                    //        offset: -5,
                    //        formatter: function (value, context) {
                    //            return value; // Display the value of each bar
                    //        },
                    //        font: {
                    //            weight: 'bold',
                    //            size: 12
                    //        },
                    //        color: 'black'
                    //    }
                    //},
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: false,
                            },
                        },
                        y: {
                            beginAtZero: true, // Ensures the Y-axis starts from 0
                            ticks: {
                                stepSize: 1,
                            }
                        },
                    }
                },
                //plugins: [ChartDataLabels] // Register the Data Labels plugin
            });
        };
        $scope.renderChartReceived = function (labels, totals, backgroundColors, borderColors) {
            let ctx = document.getElementById('documentReceivedChart').getContext('2d');

            // If the chart instance already exists, destroy it before creating a new one
            if (chartReceivedDocs && chartReceivedDocs !== null) {
                chartReceivedDocs.destroy();
            }

            // Create the new chart instance

            chartReceivedDocs = new Chart(ctx, {
                type: 'line', // You can change the chart type (e.g., 'line', 'pie', etc.)
                data: {
                    labels: labels, // X-axis labels (document types)
                    datasets: [{
                        label: 'Documentos Recibidos',
                        data: totals, // Data values (totals for each document type)
                        backgroundColor: backgroundColors, // Dynamic background colors
                        borderColor: borderColors, // Dynamic border colors
                        borderWidth: 1
                    }]
                },
                options: {
                    //plugins: {
                    //    // Enable the Data Labels plugin to show labels on bars
                    //    datalabels: {
                    //        anchor: 'end',
                    //        align: 'top',
                    //        offset: -5,
                    //        formatter: function (value, context) {
                    //            return value; // Display the value of each bar
                    //        },
                    //        font: {
                    //            weight: 'bold',
                    //            size: 12
                    //        },
                    //        color: 'black'
                    //    }
                    //},
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: false,
                            },
                        },
                        y: {
                            beginAtZero: true, // Ensures the Y-axis starts from 0
                            ticks: {
                                stepSize: 1,
                            }
                        },
                    }
                },
                //plugins: [ChartDataLabels] // Register the Data Labels plugin
            });
        };
        $scope.renderAnotherSalesDocsChart = function (labels, totals, backgroundColors, borderColors) {
            let ctx = document.getElementById('anotherSalesDocsChart').getContext('2d');

            // If the chart instance already exists, destroy it before creating a new one
            if (chartAnoterSalesDocuments && chartAnoterSalesDocuments !== null) {
                chartAnoterSalesDocuments.destroy();
            }

            // Create the new chart instance

            chartAnoterSalesDocuments = new Chart(ctx, {
                type: 'line', // You can change the chart type (e.g., 'line', 'pie', etc.)
                data: {
                    labels: labels, // X-axis labels (document types)
                    datasets: [{
                        label: 'Documentos No Tributarios',
                        data: totals, // Data values (totals for each document type)
                        backgroundColor: backgroundColors, // Dynamic background colors
                        borderColor: borderColors, // Dynamic border colors
                        borderWidth: 1
                    }]
                },
                options: {
                    //plugins: {
                    //    // Enable the Data Labels plugin to show labels on bars
                    //    datalabels: {
                    //        anchor: 'end',
                    //        align: 'top',
                    //        offset: -5,
                    //        formatter: function (value, context) {
                    //            return value; // Display the value of each bar
                    //        },
                    //        font: {
                    //            weight: 'bold',
                    //            size: 12
                    //        },
                    //        color: 'black'
                    //    }
                    //},
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: false,
                            },
                        },
                        y: {
                            beginAtZero: true, // Ensures the Y-axis starts from 0
                            ticks: {
                                stepSize: 1,
                            }
                        },
                    }
                },
                //plugins: [ChartDataLabels] // Register the Data Labels plugin
            });
        };

        // Helper function to generate random colors for the chart
        function getRandomColor(opacity) {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        }
    }
})(window.angular);
