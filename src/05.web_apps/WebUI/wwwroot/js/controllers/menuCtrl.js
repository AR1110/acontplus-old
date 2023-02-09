(function () {
    'use strict';

    angular.module('acontPlusApp')

        .controller('menuCtrl', menuCtrl);

    menuCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function menuCtrl($scope, mS, toast, form) {
        $scope.data = {};
        $scope.menu = {};
        $scope.subMenu = {};
        $scope.menus = [];
        $scope.subMenus = []

        $scope.listSubMenu = []; //Añadir submenus               

        $scope.getMenu = () => {
            mS.getData('get', '/Menu/Get').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.menus = response.data;
            }, error => console.log(error));
        }
        $scope.getMenu();

        $scope.getSubMenu = () => {
            mS.getData('get', '/SubMenu/Get').then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.subMenus = response.data;
            }, error => console.log(error));
        }
        $scope.getSubMenu();

        $scope.abrirModalM = (data, tipo) => {
            $scope.tipo = tipo;
            $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-success';
            $scope.icono = tipo == 1 ? 'fa fa-plus' : 'fa fa-edit';
            $scope.tituloModal = tipo == 1 ? 'Agregar Menu' : 'ActualizarMenu';
            $scope.btnTitulo = tipo == 1 ? 'Guardar' : 'Actualizar';
            $scope.data = tipo == 1 ? {} : data.menu;
            $('#agregarMenu').modal('show');
        }

        $scope.saveUpdateM = tipo => {
            if (form.campo($scope.data.grupo)) {
                toast.toastr('warning', 'Ingrese el Grupo', $scope.tituloModal);
                return
            }
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', $scope.tituloModal);
                return
            }
            if (form.campo($scope.data.icono)) {
                toast.toastr('warning', 'Ingrese el Icono', $scope.tituloModal);
                return
            }
            let data = {
                menu: $scope.data
            }
            let url = tipo == 1 ? '/Menu/Post' : '/Menu/Put';
            mS.getData('post', url, data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregarMenu").modal('hide');
                    return
                }
            })
        }

        $scope.deleteM = function ({ menu }) {
            Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de eliminar este Menu ahora?</small> ',
                showConfirmButton: true,
                confirmButtonText: 'Si,eliminar!',
                showCancelButton: true,
                cancelButtonText: 'No,cancelar',
                allowOutsideClick: false
            }).then(response => {
                if (response.value) {
                    mS.getData('post', '/Menu/Delete?idMenu=' + menu.idMenu).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getMenu();
                            return
                        }
                    }, error => console.log(error));
                };
            });
        }

        /*------------------------------------SUB MENU-----------------*/
        $scope.abrirModalSubM = (menu, data, tipo) => {
            $scope.tipo = tipo;
            $scope.menu = menu; //Vista;
            $scope.colorHeader = tipo == 1 ? 'bg-info' : 'bg-success';
            $scope.icono = tipo == 1 ? 'fa fa-plus' : 'fa fa-edit';
            $scope.tituloModal = tipo == 1 ? 'Agregar Sub Menus' : 'Agregar Sub Menus';
            $scope.btnTitulo = tipo == 1 ? 'Guardar' : 'Actualizar';
            $scope.data = tipo == 1 ? {} : data.menu;
            $("#agregarSubMenu").modal('show');
            return;
        };

        //Añadir Sub Menus
        $scope.addSubMenu = sm => {
            if (form.campo(sm.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', $scope.tituloModal);
                return
            }
            if (form.campo(sm.url)) {
                toast.toastr('warning', 'Ingrese la URL', $scope.tituloModal);
                return
            }
            if (form.campo(sm.icono)) {
                toast.toastr('warning', 'Ingrese el Icono', $scope.tituloModal);
                return
            }

            $scope.listSubMenu.push({
                descripcion: sm.descripcion,
                url: sm.url,
                icono: sm.icono,
                grupo: $scope.menu.grupo
            });
            $scope.data = {};
        }

        //Remover Sub Menus 
        $scope.removeMenu = function (index) {
            $scope.listSubMenu.splice(index, 1)
        };

        $scope.saveUpdateSubM = tipo => {
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', $scope.tituloModal);
                return
            }
            if (form.campo($scope.data.url)) {
                toast.toastr('warning', 'Ingrese la URL', $scope.tituloModal);
                return
            }
            if (form.campo($scope.data.icono)) {
                toast.toastr('warning', 'Ingrese el Icono', $scope.tituloModal);
                return
            }

            if ($scope.listSubMenu.length == 0 && tipo == 1) $scope.addSubMenu($scope.data);
            let url = tipo == 1 ? '/SubMenu/Post' : '/SubMenu/Put';
            let data = tipo == 1 ? $scope.listSubMenu : $scope.data;
            mS.getData('post', url, data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $("#agregarSubMenu").modal('hide');
                    return
                }
            });
        }

        $scope.deleteSubM = function ({ menu }) {
            Swal.fire({
                icon: 'warning',
                html: '<small>Esta seguro/a de eliminar este Sub Menu ahora?</small> ',
                showConfirmButton: true,
                confirmButtonText: 'Si,eliminar!',
                showCancelButton: true,
                cancelButtonText: 'No,cancelar',
                allowOutsideClick: false
            }).then((response) => {
                if (response.value) {
                    mS.getData('post', '/SubMenu/Delete?idSubMenu=' + menu.idMenu).then(response => {
                        if (response.id == "0") {
                            toast.toastr('warning', response.message, response.titleSms);
                            return
                        }
                        if (response.id == "1") {
                            toast.toastr('success', response.message, response.titleSms);
                            $scope.getSubMenu();
                            return
                        }
                    }, error => console.log(error));
                };
            });
        }

        $('#agregarMenu,#agregarSubMenu').on('hide.bs.modal', e => {
            $scope.data = {}
            $scope.listSubMenu = [];
            $scope.getMenu();
            $scope.getSubMenu();
        });
    }
})(window.angular);