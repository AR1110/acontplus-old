//@ts-check
(function () {
    'use strict';
    angular.module('loginApp', ['ngStorage'])
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$http', '$localStorage'];

    function loginCtrl($scope, $http, $localStorage) {
        let urlBase = document.getElementById('urlGateway').value;
        let urlService = `${urlBase}/gateway/seguridad`

        // Set Client-Id header for rate limiting
        $http.defaults.headers.common['Client-Id'] = 'acontplus-web-app';
        // For get the customer data from response
        $scope.codes = ['', '', '', '', '', ''];
        $scope.mainResponse = {};
        let customerIp = "";
        const tS = toastr;

        // Ditect user info
        //let Url = "https://" + "cloudflare.com/cdn-cgi/trace";
        //let AjaxUrl = new XMLHttpRequest();
        //AjaxUrl.open("get", Url);
        //AjaxUrl.send();
        //AjaxUrl.onreadystatechange = function () {
        //    if (AjaxUrl.readyState === 4 && AjaxUrl.status === 200) {
        //        let resultUrl = AjaxUrl.responseText;
        //        let mapUrlStart = resultUrl.indexOf("ip") + 3;
        //        let mapUrlEnd = resultUrl.indexOf("ts");
        //        let IpResult = resultUrl.slice(mapUrlStart, mapUrlEnd);
        //        customerIp = IpResult.replace(/[\n\r]/g, "")
        //    }
        //};
        $scope.loader = false;
        $scope.ver = false;
        $scope.data = {};
        $scope.hasManyRoles = false;
        $scope.roleSelected = {};


        let parser = new UAParser(navigator.userAgent)
        let parserResults = parser.getResult();


        $scope.getPublicIP = getPublicIP;
        $scope.askToCancel = askToCancel;
        $scope.verContrasenia = verContrasenia;
        $scope.authMultiple = authMultiple;
        $scope.loginMultiple = loginMultiple;
        $scope.login = login;
        $scope.skipCodeFields = skipCodeFields;
        $scope.authenticate = authenticate;

        function getPublicIP() {
            $http.get('https://api.ipify.org?format=json')
                .then(function (response) {
                    customerIp = response.data.ip;
                })
                .catch(function (error) {
                    //console.error('Error fetching public IP address:', error);
                    //$scope.publicIP = 'Unable to retrieve IP address.';
                });
        };

        // Automatically fetch the public IP when the controller is loaded
        getPublicIP();

        function askToCancel() {
            swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Esta seguro de salir de esta ventana, eliminara esta solicitud',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then(response => {
                if (response.isConfirmed) {
                    $("#accessAuthorizationModal").modal('hide');
                }
            })
        }
        function verContrasenia(ver) {
            let contra = $("#password")
            if (!ver) {
                contra.attr("type", 'text')
                $scope.ver = true;
            } else {
                contra.attr('type', "password");
                $scope.ver = false;
            }
        }


        function setBearerToken(token) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + token
        }

        function setUserData(userData) {
            localStorage.setItem('userData', userData);
        }


        function authMultiple() {
            showLoader();
            let item = $scope.roleSelected;

            item.userAgent = JSON.stringify({
                userAgent:
                    JSON.stringify(parserResults),
                ipAddress: customerIp
            });

            $http.post(`${urlService}/account/createToken`, item).then(
                response => {
                    if (response.data.code == "0") {
                        toastr.warning(response.data.message, "Login", { closeButton: true, progressBar: true, preventDuplicates: true, positionClass: 'toast-bottom-center' });
                        return;
                    }

                    if (response.data.code == "1") {
                        let { token, returnUrl } = JSON.parse(response.data.payload)

                        $localStorage.currentUser = {
                            token
                        }
                        // add jwt token to auth header for all requests made by the $http service
                        setBearerToken(token);
                        setUserData(response.data.payload)
                        toastr.success(response.message, "Login", {
                            closeButton: true,
                            progressBar: true,
                            preventDuplicates: true,
                            positionClass: 'toast-bottom-center'
                        });
                        location.href = returnUrl;
                    }
                })
                .finally(() => {
                    hideLoader();
                })
                .catch(error => {
                    hideLoader();
                    console.log(error);
                })
        }

        function loginMultiple(item) {
            $scope.roleSelected = item;
            if ($scope.roleSelected.needAuthorization) {
                const params = { uuid: $scope.roleSelected.uuid, userRoleId: $scope.roleSelected.userRoleId }
                showLoader()
                $http.post(`${urlService}/account/requestaccess`, params).then(
                    response => {
                        if (response.data.code == '1') {
                            $("#accessAuthorizationModal").modal('show');
                        }
                    }
                ).catch(error => {
                    console.log(error)
                })
            } else {
                 authMultiple();
            }
        }



        function login() {
            try {
                showLoader();
                $scope.data.userAgent = JSON.stringify({
                    userAgent: JSON.stringify(parserResults),
                    ipAddress: customerIp
                });
                $scope.data.returnUrl = $('#returnUrl').val();
                if (!$scope.data.returnUrl) {
                    $scope.data.returnUrl = '/';
                }
                $http.post(`${urlService}/account/login`, $scope.data).then(response => {
                    if (response.data.code === "0") {
                        tS.warning(response.data.message, "Login", {
                            closeButton: true,
                            progressBar: true,
                            preventDuplicates: true,
                            positionClass: 'toast-bottom-center'
                        });
                        return;
                    };
                    if (response.data.code == "1") {
                        $scope.mainResponse = JSON.parse(response.data.payload);
                        if ($scope.mainResponse.length == 1) {
                            if ($scope.mainResponse[0].needAuthorization) {
                                $scope.roleSelected = $scope.mainResponse[0];
                                $("#accessAuthorizationModal").modal('show');
                                return;
                            }

                            $localStorage.currentUser = {
                                token: $scope.mainResponse[0].token
                            }

                            setBearerToken($scope.mainResponse[0].token);
                            setUserData(JSON.stringify($scope.mainResponse[0]))
                            tS.success(response.message, "Login", {
                                closeButton: true,
                                progressBar: true,
                                preventDuplicates: true,
                                positionClass: 'toast-bottom-center'
                            });
                            location.href = $scope.mainResponse[0].returnUrl;
                            return;
                        }

                        if ($scope.mainResponse.length > 1) {
                            $scope.hasManyRoles = true;
                            $scope.usuarioEntidades = $scope.mainResponse;
                            tS.info(response.message, "Login", {
                                closeButton: true,
                                progressBar: true,
                                preventDuplicates: true,
                                positionClass: 'toast-bottom-center'
                            });
                            $("#modalLoginUsuarioEntidad").modal('show');
                        }
                    }
                })
                    .finally(() => {
                        hideLoader()
                    })
                    .catch(error => {
                        hideLoader();
                        console.log(error);
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

        function skipCodeFields(event, index) {
            let newIndex = (index + 1)
            let id = `code_auth2f${newIndex}`;
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function () {
                    if (this.value.length === 1 && newIndex <= 5) {
                        // Move focus to the second input field
                        const codeEl = document.getElementById('code_auth2f' + (newIndex + 1));
                        if (codeEl) {
                            codeEl.focus();
                        }
                    }
                });
            }

        }

        function authenticate() {
            showLoader();
            $scope.dataSend = {
                senderId: 0,
                receiverId: 0,
                uuid: $scope.mainResponse[0].uuid,
                code: Number($scope.codes.join(''))
            }

            $http.post(`${urlService}/account/authenticate`, $scope.dataSend).then(response => {
                if (response.data.code === "0") {
                    tS.warning(response.data.message, "Login", {
                        closeButton: true,
                        progressBar: true,
                        preventDuplicates: true,
                        positionClass: 'toast-bottom-center'
                    });
                    return;
                };
                if (response.data.code == "1") {
                    $("#accessAuthorizationModal").modal('hide');
                     authMultiple();
                }
            })
                .finally(() => {
                    hideLoader()
                })
                .catch(error => {
                    hideLoader();
                    console.log(error);
                });
        }
    };
})(window.angular)
