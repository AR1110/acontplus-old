(function(){

    app.controller('articuloCtrl', articuloCtrl);

    articuloCtrl.$inject = [
        '$scope',
        'articuloService'
    ]

    function articuloCtrl($scope){
        console.log('test')
    }



})()