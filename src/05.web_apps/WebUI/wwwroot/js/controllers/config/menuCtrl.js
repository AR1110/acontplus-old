(function () {
    'use strict';

    angular.module('acontPlusApp')

        .controller('menuCtrl', menuCtrl);

    menuCtrl.$inject = ['$scope', 'mainService', 'toastService', 'formulario'];

    function menuCtrl($scope, mS, toast, form) {
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // };
        
        $scope.data = {};
        
        $scope.nuevoMenu = function(){
            $scope.tipoRegistro = 1;
            $("#modalAddUpdateMenu").modal('show');            
            return
        };

        $scope.getMenus = function(){
            mS.getData('get', '/Menu/Get').then(response => {
                if (response.id === "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                $scope.menus = response.data;
                for(let val of $scope.menus){
                    $scope.getSubMenus(val, val.idMenu);
                }
                
            }, error => console.log(error));
        }
        $scope.getMenus();

        $scope.getSubMenus = function(itemMenu, idMenu){
            mS.getData('get', '/SubMenu/GetSubMenus?idMenu=' + idMenu).then(response => {
                if (response.id === "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }                
                itemMenu.subMenus = response.data;
            }, error => console.log(error));
        };



        $scope.saveUpdateMenu= function(){
            let tituloToast = $scope.tipoRegistro === 1?'Guardar':'Actualizar';
            if (form.campo($scope.data.grupo)) {
                toast.toastr('warning', 'Ingrese el Grupo', tituloToast);
                return
            }
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', tituloToast);
                return
            }
            if (form.campo($scope.data.icono)) {
                toast.toastr('warning', 'Ingrese el Icono', tituloToast);
                return
            }
          
            let url = $scope.tipoRegistro ===1?'/Menu/Post':'/Menu/Put?idMenu=' + $scope.data.idMenu;
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getMenus();
                    $("#modalAddUpdateMenu").modal('hide');                    
                    return
                }
            })
        };

        $scope.editarMenu = function(item){
            $scope.tipoRegistro = 2;
            $scope.data = item;
            $("#modalAddUpdateMenu").modal('show');
            return            
        }

        $scope.askToDeleteMenu = async function(item){
            let {isConfirmed} = await Swal.fire({
                icon: 'warning',                
                html: `<small>Esta seguro/a de eliminar este Menu ahora?</small>`,
                showDenyButton: true,
                confirmButtonText: `Si, eliminar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            })
            
            if(isConfirmed){                
                mS.getData('post', '/Menu/Delete?idMenu=' + item.idMenu).then(response => {                    
                    if (response.id == "0") {
                        toast.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    if (response.id == "1") {
                        toast.toastr('success', response.message, response.titleSms);
                        $scope.getMenus();
                        return
                    }
                }, error => console.log(error));
            };              
        };

        $("#modalAddUpdateMenu").on('hide.bs.modal', e=>{            
            $scope.data ={};
            $scope.getMenus();
            return
        })
        
        /*------------------------------------SUB MENU-----------------*/        
       
        
        
        $scope.nuevoSubMenu = function(dataMenu){
            $scope.menu = dataMenu;
            $scope.tipoRegistro = 1;
            $("#modalAddUpSubMenu").modal('show');
            return
        };
        
        $scope.obtenerCodigoSubMenu = function(){
            if (!form.campo($scope.data.descripcion) && $scope.tipoRegistro == 1) {
                $scope.data.codTemp = form.obtenerTresLetras($scope.data.descripcion);
                return
            }
        }

        $scope.saveUpdateSubMenu = function() {
            let tituloToast = $scope.tipoRegistro ===1?'Guardar':'Actualizar';
            if (form.campo($scope.data.descripcion)) {
                toast.toastr('warning', 'Ingrese la Descripción', tituloToast);
                return
            };
            if(form.campo($scope.data.codTemp)){
                toast.toastr('warning', 'Ingrese el Código', tituloToast);
                return
            }
            if (form.campo($scope.data.url)) {
                toast.toastr('warning', 'Ingrese la URL', tituloToast);
                return
            };
            if (form.campo($scope.data.icono)) {
                toast.toastr('warning', 'Ingrese el Icono', tituloToast);
                return
            };
            $scope.data.idMenu = $scope.menu.idMenu;                        
            let url = $scope.tipoRegistro == 1 ? '/SubMenu/Post' : '/SubMenu/Put?idSubMenu='+$scope.data.idSubMenu;
            mS.getData('post', url, $scope.data).then(response => {
                if (response.id == "0") {
                    toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    toast.toastr('success', response.message, response.titleSms);
                    $scope.getSubMenus($scope.menu, $scope.menu.idMenu);
                    $("#modalAddUpSubMenu").modal('hide');
                    return
                }
            });
        };

        $scope.editarSubMenu = function(dataMenu, dataSubMenu){
            $scope.tipoRegistro = 2;
            $scope.menu = dataMenu;
            $scope.data = dataSubMenu;
            $("#modalAddUpSubMenu").modal('show');
            return
        }

        $scope.askToDeleteSubMenu = async function (dataMenu, dataSubMenu) {
            let {isConfirmed} = await Swal.fire({
                icon: 'warning',                
                html: `<small>Esta seguro/a de eliminar este Sub Menú ahora?</small>`,
                showDenyButton: true,
                confirmButtonText: `Si, eliminar`,
                denyButtonText: `No, cancelar`,
                allowOutsideClick: false
            })
            
            if(isConfirmed){                
                mS.getData('post', '/SubMenu/Delete?idSubMenu=' + dataSubMenu.idSubMenu).then(response => {                  
                    if (response.id == "0") {
                        toast.toastr('warning', response.message, response.titleSms);
                        return
                    }
                    if (response.id == "1") {
                        toast.toastr('success', response.message, response.titleSms);
                        $scope.getSubMenus(dataMenu, dataMenu.idMenu);
                        return
                    }
                }, error => console.log(error));
            };                
        }

        $('#modalAddUpSubMenu').on('hide.bs.modal', e => {
            $scope.menu = {};
            $scope.data = {}                                   
        });
    }
})(window.angular);