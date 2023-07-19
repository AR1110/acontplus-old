(function () {
    'use strict';
    angular.module('loginApp', ['ngStorage'])
        .controller('loginCtrl', loginCtrl);
    //services

    angular
        .module('loginApp')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', '$localStorage'];

    function loginService($http, $localStorage) {
        let service = {
            getData: getData
        };

        return service;
        function getData(method, url, data = null) {
            let urlBase = document.getElementById('urlGateway').value
            console.log(urlBase)
            let urlService = `${urlBase}/gateway/`

            let serviceData = $http({
                method: method,
                url: urlService + url,
                data: data
            }).then(response => {
                console.log(response)
                if (response.data.code == "2") {
                    $localStorage.currentUser = {
                        token: response.data.data.userData[0].jwtToken
                    }
                    // add jwt token to auth header for all requests made by the $http service
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.data.userData[0].jwtToken
                }
                return response.data
            })
            return serviceData
        }
    }

    loginCtrl.$inject = ['$scope', 'loginService'];

    function loginCtrl($scope, mS) {
        $scope.loader = false;
        $scope.ver = false;
        $scope.data = {};

        $scope.verContrasenia = function (ver) {
            let contra = $("#password")
            if (!ver) {
                contra.attr("type", 'text')
                $scope.ver = true;
            } else {
                contra.attr('type', "password");
                $scope.ver = false;
            }
        }

        $scope.loginMultiple = (item) => {
            $scope.data.id = item.idRol;
            $scope.login();
        }

        $scope.login = function () {
            try {
                showLoader();
                $scope.data.returnUrl = $('#returnUrl').val();
                if ($scope.data.returnUrl == undefined || $scope.data.returnUrl === "" || $scope.data.returnUrl == null) {
                    $scope.data.returnUrl = '/';
                }
                mS.getData('post', 'account/login', $scope.data).then(response => {
                    if (response.id === "0" || response.code === "0") {
                        hideLoader();
                        toastr.warning(response.message, response.titleSms, { closeButton: true, progressBar: true });
                        return;
                    };

                    if (response.id === "1" || response.code === "1") {
                        hideLoader();
                        $scope.usuarioEntidades = response.data.userData;
                        // $(".mainLogin").hide();                    
                        $("#modalLoginUsuarioEntidad").modal('show');
                    }

                    if (response.id === "2" || response.code === "2") {
                        toastr.success(response.message, response.titleSms, { closeButton: true, progressBar: true });
                        location.href = response.data.returnUrl;
                        localStorage.setItem('userData', JSON.stringify(response.data.userData[0]));
                        localStorage.setItem('menus', JSON.stringify(response.data.menus));
                        localStorage.setItem('subMenus', JSON.stringify(response.data.subMenus));
                        hideLoader();
                    };
                }, function (error) {
                    hideLoader();
                    console.log(error)
                });
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }
        //Bloquear Ir a la pagina Anterior en el Navegador 
        history.pushState(null, document.title, location.href);
        window.addEventListener('popstate', function (event) {
            history.pushState(null, document.title, location.href);
        });
    };
})(window.angular)