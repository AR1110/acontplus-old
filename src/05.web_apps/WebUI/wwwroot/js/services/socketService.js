(function () {
    'use strict';

    app.factory('socketService', socketService);

    socketService.$inject = ['$http', '$rootScope'];

    function socketService($http, $rootScope) {
        const _env = 1
        let host = _env == 1 ? 'http://localhost:8000' : 'http://74.50.85.164:8000'
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