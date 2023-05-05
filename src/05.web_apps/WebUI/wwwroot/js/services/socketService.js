(function () {
    'use strict';

    app.factory('socketService', socketService);

    socketService.$inject = ['$http', '$rootScope'];

    function socketService($http, $rootScope) {
        let host = 'http://localhost:8000' //'http://205.209.99.71:8000'
        let socket = io.connect(host, { path: '/socket.io' })
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