(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('iframeAngularCtrl', iframeAngularCtrl);

    iframeAngularCtrl.$inject = ['$scope', '$location', '$injector', '$localStorage', 'jwtHelper'];

    function iframeAngularCtrl($scope, $location, $injector, $localStorage, jwtHelper) {
        const mS = $injector.get('mainService');
        const fS = $injector.get('formulario');

        function alertEndSession() {
            let timerInterval;
            Swal.fire({
                icon: "warning",
                title: "Ha perdido sesión!",
                html: "Redirigiendo en <b></b> segundos",
                timer: 10000,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                        timer.textContent = `${(Swal.getTimerLeft() * 0.001).toFixed()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                },
            }).then((result) => {
                if ((result.dismiss === Swal.DismissReason.timer) || (result.isConfirmed)) {
                    Object.keys(localStorage).forEach(function (key) {
                        localStorage.removeItem(key);
                    });
                    window.location.href = "/Login/Index";
                }
            });
        }

        const authData = $localStorage.currentUser;

        if (authData && authData.token) {
            try {
                let decodedJwt = jwtHelper.decodeToken(authData.token);
                const expiration = Number(decodedJwt.exp);
                const currentTime = Math.floor(new Date() / 1000); // convert to seconds

                if (expiration < currentTime) {
                    return alertEndSession();
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                return alertEndSession();
            }
        } else {
            return alertEndSession();
        }

        const userCustomerPermissionSvc = $injector.get('userCustomerPermissionService');
        mS.detectDevice();
        let frontend = window.angularAppUrl;
        let div = document.querySelector('.container-fluid'); // Select the div by class
        div.classList.remove('container-fluid'); // Remove the div
        // Get the current URL
        let url = $location.absUrl();
        // Create a URL object with the current URL
        let urlObj = new URL(url);
        let { pathname } = urlObj
        /*  console.log(pathname);*/
        let totalRoutes = pathname.split('/');
        let route;
        if (totalRoutes.length === 4) {
            route = totalRoutes[1] + totalRoutes[2]
        }
        else if (totalRoutes.length === 5) {
            route = totalRoutes[1] + totalRoutes[2] + totalRoutes[3];
        }
        else {
            route = pathname.split('/')[1]
            //route = pathname
        }
        async function getSrc() {
            if (!frontend) { return; }
            let params = localStorage.getItem('userData')
            let { token, codeRole } = JSON.parse(params);
            if (!token) { return; }

            let permissions = userCustomerPermissionSvc.userPermissionAdapter();
            let userRoleData = {
                codeRole
            }
            // Create a new iframe element
            let iframe = document.createElement('iframe');
            // iframe.classList='iframe-container'
           
            iframe.title = 'Angular App';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-popups-to-escape-sandbox'

             iframe.loading = 'lazy'; // Precarga solo cuando sea visible 
            // Set the src attribute of the iframe

            let urlClient = `${frontend}?token=${token}&route=${route}&permission=${JSON.stringify({ ...permissions, acciones: $scope.accion || {} })}&userRoleData=${JSON.stringify(userRoleData)}`

            iframe.src = urlClient;

            // Get the div element
            var div = document.getElementById('iframeApp');
            div.classList.add('iframe-container');
            // Append the iframe to the div
            div.appendChild(iframe);
        }
        getSrc();
    }
})();
