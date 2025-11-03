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

            // --- Sección de usuario (fija) ---
            textHtml += `<li class="user-pro">
                        <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                            <img src="/assets/images/user/user.png" alt="" class="img-circle">
                            <span class="hide-menu">${$scope.userData.username}</span>
                        </a>
                        <ul aria-expanded="false" class="collapse">
                            <li><a href="/Config/UserProfile/Index"><i class="ti-user"></i> Mi Perfil</a></li>
                            <li><a href="/Common/UserManual/Index"><i class="fa fa-book-reader"></i> Manual de Usuario</a></li>
                            <li><a href="https://api.whatsapp.com/send?phone=593986669930" target="_blank" class="dropdown-item text-success" data-bs-toggle="tooltip" title="Si requiere ayuda personalizada comuniquese al siguiente número!">
                                <i aria-hidden="true" class="fab fa-whatsapp"></i> Soporte
                            </a></li>
                            <li><a href="#" onclick="logout()" id="logoutII"><i class="fa fa-power-off"></i> Salir</a></li>
                        </ul>
                    </li>`;


            function buildMenuItem(menu) {
                if (menu.children && menu.children.length > 0) {
                    let itemHtml = `
                                    <li>
                                        <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false">
                                            <i class="${menu.icon || 'ti-align-left'}"></i>
                                            <span class="hide-menu">${menu.name}</span>
                                        </a>
                                        <ul aria-expanded="false" class="collapse">`;

                    menu.children.forEach(child => {
                        itemHtml += buildMenuItem(child);
                    });

                    itemHtml += `
                                        </ul>
                                    </li>`;
                    return itemHtml;

                } else {
                    return `
                            <li>
                                <a href="${menu.url || 'javascript:void(0)'}">
                                    <i class="${menu.icon || ''}"></i>
                                    ${menu.name}
                                </a>
                            </li>`;
                }
            }
            $scope.menusWithChildren.forEach(menu => {
                textHtml += buildMenuItem(menu);
            });

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

        const buildTree = (items, parentId = undefined) => {
            const nodeMap = new Map(); // Para validar que no haya duplicados
            const roots = [];

            items.forEach(item => {
                if (nodeMap.has(item.id)) {
                    console.warn(`Nodo duplicado ignorado: ${item.id} ${item.name}`);
                    return;
                }
                nodeMap.set(item.id, { ...item, children: [] });
            });

            nodeMap.forEach(node => {
                if (node.parentId !== undefined && nodeMap.has(node.parentId)) {
                    nodeMap.get(node.parentId).children.push(node);
                } else if (node.parentId === undefined) {
                    roots.push(node);
                }
            });

            return roots;
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


            const fullTree = buildTree($scope.menus);
            $scope.menusWithChildren = fullTree.filter(item => item.children.length > 0);

            if ($scope.menus.length == 0) {
                $scope.logout();
                return;
            }


            $scope.permissions = $scope.userData.permissions || [];
            $scope.accions = $scope.userData.actions || [];

            if ($scope.menus.length == 0) {
                $scope.logout();
                return;
            }

            if ($scope.menus.length > 0) {
                $scope.drawMenus();
            }
        }
        $scope.init();


        const pathname = $window.location.pathname;

        if (/\/Config\/UserProfile\/Index/.test(pathname)) return;
        if (/\/Common\/UserManual\/Index/.test(pathname)) return;

        if (['/', '/Index', '/Config/WizardConfig/Index'].includes(pathname)) return;


        if (pathname) {
            if (pathname === "/") {
                location.href = "/Index";
            }
            if (pathname.indexOf("/Home") == -1) {
                let lengthPath = pathname.split("/").splice(1).length;

                if ([1, 2, 3, 4].includes(lengthPath)) {
                    let dataMenu = $scope.menus.find((item) => item.url === pathname);
                    if (dataMenu) {
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
                        location.href = "/Index";
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
