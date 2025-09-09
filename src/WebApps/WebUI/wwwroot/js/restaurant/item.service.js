(function () {
    'use strict';
    app.factory('itemService', itemService);
    itemService.$inject = ['mainService'];
    function itemService(mS) {
        var service = {
            search
        };
        return service;
        function search(obj) {
            var url = 'restaurant/items';
            let json = JSON.stringify({
                tipo: 2,
                textSearch: obj.textSearch,
            });
            return mS.getData(`${url}?json=${json}`).then(response => {
                console.log(response)
                return response;
            })
        }
        function getItem(id) {
            var url = configService.apiUrl + 'restaurant/items/' + id;

            return $http.get(url, { headers: headers });
        }
        function createItem(item) {
            var url = configService.apiUrl + 'restaurant/items';

            return $http.post(url, item, { headers: headers });
        }
        function updateItem(id, item) {
            var url = configService.apiUrl + 'restaurant/items/' + id;

            return $http.put(url, item, { headers: headers });
        }
        function deleteItem(id) {
            var url = configService.apiUrl + 'restaurant/items/' + id;

            return $http.delete(url, { headers: headers });
        }
    }
}());
