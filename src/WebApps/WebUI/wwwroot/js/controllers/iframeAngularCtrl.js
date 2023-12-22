(function () {
    'use strict';

    angular
        .module('acontPlusApp')
        .controller('iframeAngularCtrl', iframeAngularCtrl);

    iframeAngularCtrl.$inject = ['$scope', '$location'];

    function iframeAngularCtrl($scope, $location) {
        let frontend = document.getElementById('frontend').value
        console.log(frontend)
        let div = document.querySelector('.container-fluid'); // Select the div by class
        div.classList.remove('container-fluid'); // Remove the div
        // Get the current URL
        let url = $location.absUrl();

        // Create a URL object with the current URL
        let urlObj = new URL(url); 
        let { pathname } = urlObj
      /*  console.log(pathname);*/
        let route = pathname.split('/')[1]
        //console.log(route);
        async function getSrc() {
            let params = localStorage.getItem('userData')
            let { token } = JSON.parse(params);
            if (!token) { return; }
            // Create a new iframe element
            var iframe = document.createElement('iframe');

            iframe.style.width = '100%';
            iframe.style.height = '600px';
            iframe.style.border = 'none';
            iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-popups-to-escape-sandbox'
            //let url = 'http://localhost:4200'
            let url = 'http://localhost:5173'
            // Set the src attribute of the iframe
            iframe.src = `${frontend}?token=${token}&route=${route}`;

            // Get the div element
            var div = document.getElementById('iframeApp');

            // Append the iframe to the div
            div.appendChild(iframe);
        }
        getSrc();
    }
})();
