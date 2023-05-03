(function () {
    'use strict';

    app.factory('socketService', socketService);

    socketService.$inject = ['$http', '$rootScope'];

    function socketService($http, $rootScope) {
        let socket = io.connect('http://205.209.99.71:8000', { path: '/socket.io' })
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }
})();