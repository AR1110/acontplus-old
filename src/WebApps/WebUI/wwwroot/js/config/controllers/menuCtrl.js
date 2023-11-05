(function () {
    'use strict';


    const URL_TEMPLATE = '~/Pages/Menu/'

    //Variable servicios 
    let tS = {}; 
    let menuSvc = {}; 

    app.controller('menuCtrl', menuCtrl);

    menuCtrl.$inject = [
        '$scope',
        '$injector',
        'mainService',
        'modalService', 
    ];

    function menuCtrl($scope, $injector, mS, modalSvc) {

        menuSvc = $injector.get('menuService');
        tS = $injector.get('toastService');
        $scope.data = {};

        $scope.nuevoMenu = function () {
            modalSvc.openModalCustom({
                controller: 'modalMenuCtrl',
                template: URL_TEMPLATE + '_ModalAddUpdateMenu.cshtml',
                size: 'md',
                params: {
                },
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') {
                    $scope.getMenus();
                }
            })
        };

        $scope.getMenus = function () {
            showLoader();
            menuSvc.get({ tipo: 1 }).then(async response => { 
                $scope.menus = response;
                for (let val of $scope.menus) {
                    await $scope.getSubMenus(val, val.idMenu);
                }
            }).finally(() => hideLoader())
        }
        $scope.getMenus();

        $scope.getSubMenus = function (itemMenu, idMenu) {
            menuSvc.findByIdMenu(idMenu).then(response => {
                itemMenu.subMenus = response;
            })
        }; 

        $scope.editarMenu = function (item) {
            modalSvc.openModalCustom({
                controller: 'modalMenuCtrl',
                template: URL_TEMPLATE + '_ModalAddUpdateMenu.cshtml',
                size: 'md',
                params: item,
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') {
                    $scope.getMenus();
                }
            })
        }

        $scope.askToDeleteMenu = async function (item) {
            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Menu ahora?</small>`,
                showDenyButton: true,
                confirmButtonText: `Si, eliminar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            })

            if (isConfirmed) {
                showLoader();
                menuSvc.delete(item.idMenu).then(response => {
                    if (response.code == "0") {
                        tS.toastr('warning', response.message, response.titleSms); 
                    }
                    if (response.code == "1") {
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getMenus(); 
                    }
                }).finally(()=>hideLoader())
            }
        }; 

        /*------------------------------------SUB MENU-----------------*/



        $scope.nuevoSubMenu = function (dataMenu) { 
            $scope.menu = dataMenu;
            modalSvc.openModalCustom({
                controller: 'modalSubMenuCtrl',
                template: URL_TEMPLATE + '_ModalAddUpSubMenu.cshtml',
                size: 'md',
                params: {
                    idMenu: dataMenu.idMenu
                },
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') { 
                    $scope.getSubMenus($scope.menu, $scope.menu.idMenu);
                }
            })
        } 

        $scope.editarSubMenu = function (dataMenu, dataSubMenu) { 
            $scope.menu = dataMenu; 
            modalSvc.openModalCustom({
                controller: 'modalSubMenuCtrl',
                template: URL_TEMPLATE + '_ModalAddUpSubMenu.cshtml',
                size: 'md',
                params: {
                    ...dataSubMenu,
                    idMenu: dataMenu.idMenu,                    
                },
                isRenderRazorPartial: true
            }).result.then(response => {
                if (typeof response === 'object') { 
                    $scope.getSubMenus($scope.menu, $scope.menu.idMenu);
                }
            }) 
        }

        $scope.askToDeleteSubMenu = async function (dataMenu, dataSubMenu) {
            let { isConfirmed } = await Swal.fire({
                icon: 'warning',
                html: `<small>Esta seguro/a de eliminar este Sub Menú ahora?</small>`,
                showDenyButton: true,
                confirmButtonText: `Si, eliminar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            })

            if (isConfirmed) {
                showLoader();
                menuSvc.deleteSubMenu(dataSubMenu.idSubMenu).then(response => { 
                    if (response.code == "0") { 
                        tS.toastr('warning', response.message, response.titleSms);
                    }
                    if (response.code == "1") { 
                        tS.toastr('success', response.message, response.titleSms);
                        $scope.getSubMenus(dataMenu, dataMenu.idMenu); 
                    }
                })
                .finally(()=>hideLoader())
                .catch(error => {
                    console.log(error);
                })
            }
        } 
    }


    app.controller('modalMenuCtrl', modalMenuCtrl);

    modalMenuCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalMenuCtrl($scope, $uibModalInstance, params) {
        let data = params || {}
        $scope.data = Object.assign({}, data) || {};
        $scope.showEstado = $scope.data.idMenu > 0;

        $scope.titleModal = $scope.data.idMenu > 0 ? 'Editar' : 'Guardar';
        $scope.btnText = $scope.data.idMenu > 0 ? 'Actualizar' : 'Guardar';
        $scope.btnIcon = $scope.data.idMenu > 0 ? 'ti-pencil' : 'ti-save';
 

        $scope.onSave = function () { 

            if (!$scope.data.grupo) {
                tS.toastr('warning', 'Ingrese el Grupo', $scope.titleModal);
                return
            }
            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Ingrese la Descripción', $scope.titleModal);
                return
            }
            if (!$scope.data.icono) {
                tS.toastr('warning', 'Ingrese el Icono', $scope.titleModal);
                return
            }


            showLoader();

            if ($scope.data.idMenu > 0) {
                menuSvc.update($scope.data.idMenu, $scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            } else if (!($scope.data.idMenu > 0)) {
                menuSvc.save($scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            }
        }

        $scope.successReponse = function (response) {
            hideLoader();
            if (response.code === '0') {
                tS.toastr('warning', response.message, response.titleSms);
            }
            if (response.code === '1') {
                tS.toastr('success', response.message, response.titleSms);
                $uibModalInstance.close(response)
            }
        } 
        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

    }

    app.controller('modalSubMenuCtrl', modalSubMenuCtrl);

    modalSubMenuCtrl.$inject = ['$scope', '$uibModalInstance', 'params'];

    function modalSubMenuCtrl($scope, $uibModalInstance, params) {
        let data = params || {}
        $scope.data = Object.assign({}, data) || {};
        $scope.showEstado = $scope.data.idSubMenu > 0;
        let idMenu = $scope.data.idMenu;

        $scope.titleModal = $scope.data.idSubMenu > 0 ? 'Editar' : 'Guardar';
        $scope.btnText = $scope.data.idSubMenu > 0 ? 'Actualizar' : 'Guardar';
        $scope.btnIcon = $scope.data.idSubMenu > 0 ? 'ti-pencil' : 'ti-save';
 
        $scope.obtenerCodigoSubMenu = function () {
            console.log('dkjd')
            if ($scope.data.descripcion && !($scope.data.idSubMenu > 0)) {
                $scope.data.codTemp = $scope.data.descripcion.slice(0,3); 

            }
        }

        $scope.onSave = function () { 

            if (!$scope.data.descripcion) {
                tS.toastr('warning', 'Ingrese la Descripción', $scope.titleModal);
                return
            }
            if (!$scope.data.codTemp) {
                tS.toastr('warning', 'Ingrese el Código', $scope.titleModal);
                return
            }
            if (!$scope.data.url) {
                tS.toastr('warning', 'Ingrese la URL', $scope.titleModal);
                return
            }
            if (!$scope.data.icono) {
                tS.toastr('warning', 'Ingrese el Icono', $scope.titleModal);
                return
            }
            $scope.data.idMenu = idMenu;

            showLoader();

            if ($scope.data.idSubMenu > 0) {
                menuSvc.updateSubMenu($scope.data.idSubMenu, $scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            } else if (!($scope.data.idSubMenu > 0)) {
                menuSvc.saveSubMenu($scope.data).then($scope.successReponse)
                    .catch(err => {
                        hideLoader();
                        console.log(err);
                    })
            }
        }

        $scope.successReponse = function (response) {
            hideLoader();
            if (response.code === '0') {
                tS.toastr('warning', response.message, response.titleSms);
            }
            if (response.code === '1') {
                tS.toastr('success', response.message, response.titleSms);
                $uibModalInstance.close(response)
            }
        }




        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

    }




    

})(window.angular);