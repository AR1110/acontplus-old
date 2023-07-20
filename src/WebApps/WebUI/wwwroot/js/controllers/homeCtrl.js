

app.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', 'mainService', '$interval'];


function homeCtrl($scope, mS, $interval) {


    $scope.init = () => {
        mS.getData('get', 'Dashboard/', null, true).then(function (response) {
            if (response.id == 0) {
                toast.toastr('warning', response.message, response.titleSms);
                return
            }
            let tempArray = JSON.parse(response.payload)[0]
            $scope.cantidad = tempArray[0];
        })
    }


    $scope.init();

    $scope.docs = []
    function getDocs() {
        try {
            mS.getData('GET', 'DocumentoElectronico/GetByStatus/?json=' + JSON.stringify({ tipo: 3 }), null, true).then(
                response => {
                    if (response.code == '1') {
                        $scope.docs = JSON.parse(response.payload)[0]
                        $('#comprobantesErroneosModal').modal('show')
                    }
                    console.log(response)
                }
            ).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    $scope.fixDocs = () => {
        location.href = '/DocumentoElectronico/Index?tipo=' + 3
    }
    // Get the current time
    var now = new Date();

    // Set the desired hour for execution (e.g. 3pm)
    var desiredHour = 12; // 3pm in 24-hour format

    // Check if the current hour is less than the desired hour
    if (now.getHours() < desiredHour) {
        // Calculate the time difference between now and the desired hour
        var timeDiff = (desiredHour - now.getHours()) * 60 * 60 * 1000;

        // Use $interval to execute the function after the time difference has elapsed
        //$interval(getDocs(), timeDiff);
    } else {
        // The desired hour has already passed today, so schedule execution for tomorrow
        var tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        tomorrow.setHours(desiredHour);
        tomorrow.setMinutes(0);
        tomorrow.setSeconds(0);

        // Calculate the time difference between now and tomorrow's desired hour
        var timeDiff = (tomorrow.getTime() - now.getTime());

        // Use $interval to execute the function after the time difference has elapsed
        $interval(getDocs(), timeDiff);
    }
}