(function () {
    'use strict';

    app.factory('subcategoryService', subcategoryService);

    subcategoryService.$inject = ['$http', 'decodeToken'];

    function subcategoryService($http, _token) {
        const url = `${_token.urlGateway}/gateway/Contabilidad/Subcategory/`
        let service = {
            get: get
        };

        return service;

        async function get({ params = null }) {
            return $http.get(`${url}?json=${JSON.stringify(params)}`).then(response => {
                if (response.data.code == "1") {
                    let { subcategories } = JSON.parse(response.data.payload);
                    return subcategories;
                }
                return [];
            })
        }
    }
})();