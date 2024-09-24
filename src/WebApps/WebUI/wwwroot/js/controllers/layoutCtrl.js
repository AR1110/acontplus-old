(function () {
    let userData = {};

    angular.module("acontPlusApp").controller("layoutCtrl", layoutCtrl);

    layoutCtrl.$inject = [
        "$scope",
        "$rootScope",
        "$window", 
        "userCustomerPermissionService"
    ];

    function layoutCtrl($scope, $rootScope, $window, userCustomerPermissionSvc) {
        "use strict";

        $scope.userData = {};

        $scope.drawMenus = function () {
            let textHtml = "";
            textHtml += `<li class="user-pro">
                <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                    <img src="/assets/images/user/user.png" alt="" class="img-circle">
                    <span class="hide-menu">${$scope.userData.username}</span>
                </a>
                <ul aria-expanded="false" class="collapse">
                    <li><a href="/Config/UserProfile/Index"><i class="ti-user"></i> Mi Perfil</a></li>
                    <a href="https://api.whatsapp.com/send?phone=593986669930" target="_blank" class="dropdown-item text-success" data-bs-toggle="tooltip" title="Si requiere ayuda personalizada comuniquese al siguiente número!"> <i aria-hidden="true" class="fab fa-whatsapp"></i> Soporte </a>
                    <li><a href="#" onclick="logout()" id="logoutII"><i class="fa fa-power-off"></i> Salir</a></li>
                </ul>
            </li>`;
            for (let i = 0; i < $scope.menus.length; i++) {
                textHtml += "</ul></li>";
                textHtml += `<li>
                                <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                                    <i class="${$scope.menus[i].icon}"></i>
                                    <span class="hide-menu"> ${$scope.menus[i].name}</span>
                                </a>
                <ul aria-expanded="false" class="collapse">`;
                for (let sm = 0; sm < $scope.submenus.length; sm++) {
                    if ($scope.menus[i].id == $scope.submenus[sm].menuId) {
                        textHtml += `<li><a href="${$scope.submenus[sm].url}"><i class="${$scope.submenus[sm].icon}"></i> ${$scope.submenus[sm].name}</a></li>`;
                    }
                }
            }

            $("#sidebarnav").html(textHtml);
        };

        $scope.logout = function () {
            Object.keys(localStorage).forEach(function (key) {
                localStorage.removeItem(key);
            });
            Object.keys(sessionStorage).forEach(function (key) {
                sessionStorage.removeItem(key);
            });
            location.href = "/Login";
        };



        $scope.init = () => {
            if (JSON.parse(localStorage.getItem("userData")) === null) {
                $scope.logout();
                return;
            }

            userData = JSON.parse(localStorage.getItem("userData"));
            $scope.userData = userData

            //console.log($scope.userData)

            let { latestVersion } = $scope.userData;

            if (latestVersion != '20240430') {
                // $scope.logout();
            } else {
                //consume from bd
            }

            $scope.menus = $scope.userData.menus || [];

            if ($scope.menus.length == 0) {
                $scope.logout();
                return;
            }

            $scope.submenus = $scope.userData.submenus || [];

            //console.log($scope.menus)
            //console.log($scope.submenus)

            $scope.permissions = $scope.userData.permissions || [];
            $scope.accions = $scope.userData.actions || [];

            if ($scope.menus.length == 0) {
                $scope.logout();
                return;
            }

            if ($scope.menus.length > 0 || $scope.submenus.length > 0) {
                $scope.drawMenus();
            }
        }
        $scope.init();


        const pathname = $window.location.pathname;
        if (/\/Config\/UserProfile\/Index/.test(pathname)) return;

        if (pathname) {
            if (pathname === "/") {
                location.href = "/Index";
            }
            if (pathname.indexOf("/Home") == -1) {
                let lengthPath = pathname.split("/").splice(1).length;

                if ([1, 2, 3].includes(lengthPath)) {
                    let dataMenu = $scope.submenus.find((item) => item.url === pathname);
                    if (dataMenu) {
                        const { newUrl, newUrlExpiration } = dataMenu;
                        if (newUrl.length > 0) {
                            let timerInterval;
                            swal.fire({
                                icon: 'info',
                                //title: 'Nueva Versión Disponible',
                                text: 'Existe una nueva versión disponible, ¿desea acceder?',
                                showCancelButton: true,
                                confirmButtonText: 'Sí, acceder',
                                cancelButtonText: 'Cancelar',
                                timer: 5000,
                                timerProgressBar: true,
                                didOpen: () => {
                                    //const progressBar = swal.getTimerProgressBar();
                                    //if (progressBar) {
                                    //    progressBar.style.background = '#4caf50';
                                    //    progressBar.style.height = '6px';
                                    //}
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
                                },
                            }).then(result => {
                                if (result.isConfirmed) {
                                    location.href = newUrl;
                                };
                            });

                        }
                        const dataAccionesSubMenu = userCustomerPermissionSvc.accionesSubMenu()
                        $rootScope.usuarioPermiso = userCustomerPermissionSvc.userPermissionAdapter();
                        let tempArray = JSON.parse(dataMenu.actions) || []
                        let newArr = tempArray.map(x => x.name);
                        const namesObject = newArr.reduce((obj, name) => {
                            obj[name] = true;
                            return obj;
                        }, {});
                        $scope.accion = namesObject; 
                        $rootScope.accion = structuredClone(namesObject)
                        $rootScope.articlePermission = dataAccionesSubMenu.accionesProduct;
                    } else {
                        //location.href = "/";
                    }
                }
            }
        }
        $scope.onChangeSubMenu = function (item) {
            try {
                location.href = item.url;
            } catch (error) {
                location.href = "/Login/Logout";
            }
        };
    }


    let stor = window.localStorage;
    window.addEventListener("load", function (e) {
        let openTabs = stor.getItem("openTabs");
        if (openTabs) {
            openTabs++;
            stor.setItem("openTabs", openTabs)
        } else {
            stor.setItem("openTabs", 1)
        }
        render();
    })
    window.addEventListener("unload", function (e) {
        e.preventDefault();
        var openTabs = stor.getItem("openTabs");
        if (openTabs) {
            openTabs--;
            stor.setItem("openTabs", openTabs)
        }
        e.returnValue = '';
    });
    window.addEventListener('storage', function (e) {
        render();
    })

    function render() {
        let tempUserData = JSON.parse(localStorage.getItem('userData'));

        if (!tempUserData) {
            Swal.fire({
                icon: 'warning',
                title: 'Cerrada la sesión',
                html: `<small>Se ha cerrado la sesión. Dale a recargar página!</small>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: true,
                showDenyButton: false,
                confirmButtonText: 'Recargar!',
                // denyButtonText: 'Login!'
            }).then(result => {
                if (result.isConfirmed) {
                    location.reload();
                }
            })
            return
        }
        if (Object.keys(userData).length > 0 && (tempUserData.username !== userData.username)) {
            userData = tempUserData;
            location.reload();
        }
    }


})(window.angular)