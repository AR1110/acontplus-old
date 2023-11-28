angular.module('acontPlusApp')
    .controller('layoutCtrl', layoutCtrl);

layoutCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$window',
    '$interval'
];

function layoutCtrl($scope, $rootScope, $window, $interval) {
    'use strict';

    $scope.logout = function () {
        Object.keys(localStorage).forEach(function (key) {
            localStorage.removeItem(key);
        })
        location.href = '/Login';
    }

    if (JSON.parse(localStorage.getItem('userData')) === null) {
        $scope.logout();
        return
    }

    $scope.userData = JSON.parse(localStorage.getItem('userData'));

    $scope.menus = $scope.userData.menus || [];

    if ($scope.menus.length == 0) {
        $scope.logout();
        return
    }

    $scope.licenseExpiration = $scope.userData.licenseExpiration || {};
    if (angular.equals($scope.licenseExpiration, {})) {
        $scope.logout();
        return
    }

    console.log($scope.licenseExpiration)

    $scope.subMenus = $scope.userData.submenus || [];
    $scope.permissions = $scope.userData.permissions || [];
    $scope.accions = $scope.userData.actions || []

    if ($scope.menus.length == 0) {
        $scope.logout();
        return
    }

    $scope.drawMenus = function () {
        let textHtml = "";
        textHtml +=
            `<li class="user-pro">
                <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                    <img src="/assets/images/user/user.png" alt="" class="img-circle">
                    <span class="hide-menu">${$scope.userData.fullname}</span>
                </a>
                <ul aria-expanded="false" class="collapse">
                    <li><a href="/Usuario/Perfil"><i class="ti-user"></i> Mi Perfil</a></li>
                    <li><a href="#" onclick="logout()" id="logoutII"><i class="fa fa-power-off"></i> Salir</a></li>
                </ul>
            </li>`;
        for (let i = 0; i < $scope.menus.length; i++) {
            textHtml += '</ul></li>';
            textHtml += `<li>
                                <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                                    <i class="${$scope.menus[i].icono}"></i>
                                    <span class="hide-menu"> ${$scope.menus[i].descripcion}</span>
                                </a>
                <ul aria-expanded="false" class="collapse">`;
            for (let sm = 0; sm < $scope.subMenus.length; sm++) {
                if ($scope.menus[i].idMenu == $scope.subMenus[sm].idMenu) {

                    textHtml += `<li><a href="${$scope.subMenus[sm].url}"><i class="${$scope.subMenus[sm].icono}"></i> ${$scope.subMenus[sm].descripcion}</a></li>`;
                }
            }
        }

        $('#sidebarnav').html(textHtml);
    };

    if ($scope.menus.length > 0 || $scope.subMenus.length > 0) {
        $scope.drawMenus();
    }

    const pathname = $window.location.pathname;
    if (pathname) {

        if (pathname === '/') {
            location.href = '/Home/Index';
        }
        if (pathname.indexOf('/Home') == -1) {
            let lengthPath = pathname.split('/').splice(1).length;

            if ([1, 2].includes(lengthPath)) {
                let dataMenu = $scope.subMenus.find(item => item.url === pathname);
                if (dataMenu) {
                    $rootScope.usuarioPermiso = {
                        almacenPermiso: JSON.parse($scope.permissions.find(x => x.codModule == "AR").permission),
                        ventaPermiso: JSON.parse($scope.permissions.find(x => x.codModule == "V").permission),
                        cajaPermiso: JSON.parse($scope.permissions.find(x => x.codModule == "C").permission),
                    }
                    $scope.accion = dataMenu
                    $rootScope.articlePermission = $scope.accions[0];
                    $rootScope.ventaPermiso = $rootScope.usuarioPermiso.ventaPermiso;
                } else {
                    location.href = '/Home/Index'
                }
            }
        }
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



    $scope.onChangeSubMenu = function (item) {
        try {
            location.href = item.url;

        } catch (error) {
            location.href = '/Login/Logout';
        }
    }

}