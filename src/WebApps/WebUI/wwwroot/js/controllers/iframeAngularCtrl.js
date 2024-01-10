(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('iframeAngularCtrl', iframeAngularCtrl);

    iframeAngularCtrl.$inject = ['$scope', '$location', '$injector'];

    function iframeAngularCtrl($scope, $location, $injector) {
        const mS = $injector.get('mainService');
        const fS = $injector.get('formulario')
        mS.detectDevice();

        let frontend = document.getElementById('frontend').value
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
        } else {
            route = pathname.split('/')[1]
        }
        async function getSrc() {
            if (!frontend) { return; }
            let params = localStorage.getItem('userData')
            let { token } = JSON.parse(params);
            if (!token) { return; }

            let permissions = fS.getDataUserRol();
            console.log($scope)
            // Create a new iframe element
            var iframe = document.createElement('iframe');

            iframe.style.width = '100%';
            iframe.style.height = '600px';
            iframe.style.border = 'none';
            iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-popups-to-escape-sandbox'
            // Set the src attribute of the iframe
            let urlClient = `${frontend}?token=${token}&route=${route}&permission=${JSON.stringify({ ...permissions, acciones: $scope.accion || {} })}`
            //// Ajuste horizontal
            //let x = parseInt((screen.width - 1200) / 2);
            //// Ajustae vertical
            //let y = parseInt((screen.height - 650) / 4);
            //window.open(
            //    urlClient,
            //    "_blank",
            //    `resizable=yes
            //        width=1200
            //        height=650
            //        screenY=${y}
            //        screenX=${x}`
            //)
            //return;
            iframe.src = urlClient;

            // Get the div element
            var div = document.getElementById('iframeApp');

            // Append the iframe to the div
            div.appendChild(iframe);
        }
        getSrc();
    }
})();
