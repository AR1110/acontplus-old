angular.module('acontPlusApp')
    .controller('layoutCtrl', layoutCtrl);

layoutCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$window'
];

function layoutCtrl($scope, $rootScope, $window) {
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

    $scope.subMenus = $scope.userData.submenus || [];
    $scope.permissions = $scope.userData.permissions || [];
    $scope.accions = $scope.userData.actions || []

    if ($scope.menus.length == 0) {
        location.href = '/Login';
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

                    textHtml += '<li><a href="' + $scope.subMenus[sm].url + '">' + $scope.subMenus[sm].descripcion + '</a></li>';
                }
            }
        }

        $('#sidebarnav').html(textHtml);
    };

    if ($scope.menus.length > 0 || $scope.subMenus.length > 0) {
        $scope.drawMenus();
    }

    const pathname = $window.location.pathname;
    const rutasReservadas = ['/ReporteVentas/ConsumoCliente']
    if (pathname) {

        if (pathname === '/') {
            location.href = '/Home/Index';
        }
        if (pathname.indexOf('/Home') == -1) {
            let lengthPath = pathname.split('/').splice(1).length;

            if ([1, 2].includes(lengthPath)) {
                let path = '';
                if (rutasReservadas.includes(pathname)) {
                    path = pathname;
                } else {
                    path = pathname.indexOf('/Index') == -1 ? pathname + '/Index' : pathname;
                }


                let dataMenu = $scope.subMenus.find(item => item.url === path);
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
    $scope.onChangeSubMenu = function (item) {
        try {
            location.href = item.url;

        } catch (error) {
            location.href = '/Login/Logout';
        }
    }

}