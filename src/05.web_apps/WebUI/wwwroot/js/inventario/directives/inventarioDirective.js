(function(){

    'use strict';

    app.directive('btnDataAdicionalArticulo', function (modalService, nombreModal) {
        return {
            restrict: 'A',
            scope: {
                getDataCustomer: '&',
                dataSearchCustomer: '='
            },
            link: function (scope, element, attrs) {
    
                element.on('click', async function () {
                  
                });
            }
        };
    });



})(window.angular)