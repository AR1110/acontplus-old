(function () {
    'use strict'
    app.controller('precioMasivoCtrl', precioMasivoCtrl)
    precioMasivoCtrl.$inject = [
        '$scope',
        'mainService',
        'toastService',
        'commonService',
        'articuloService'
    ]

    function precioMasivoCtrl($scope, _mS, _tS, _commonSvc, _articleSvc) {
        _mS.detectDevice()

        $scope.catalogs = [
            { code: 1, description: 'Articulo' },
            { code: 2, description: 'Familias' },
            { code: 3, description: 'Subfamilias' },
            { code: 4, description: 'Proveedor' },
            { code: 5, description: 'N° Documento' }
        ]

        $scope.establecimientos = []
        $scope.familias = []
        $scope.subfamilias = []
        $scope.marcas = []
        $scope.articles = []

        $scope.mainForm = {}

        $scope.mainForm.opcion = $scope.catalogs.find(x => x.code == '4').code

        $scope.initialLoad = () => {
            _commonSvc.getEstabAsign().then(
                response => {
                    $scope.establecimientos = response
                    $scope.mainForm.codEstab = $scope.establecimientos.find(x => x.predeterminado == true).codEstab
                    $scope.getFilters()
                }
            )
        }
        $scope.initialLoad()

        $scope.getFilters = () => {
            $scope.mainForm.tipo = 1
            _mS.getData('get', 'PrecioMasivo/?json=' + JSON.stringify($scope.mainForm), null, true).then(
                response => {
                    console.log(response)
                }
            ).catch(error => {
                console.log(error)
            })
        }

        $scope.proveedorSearch = (textSearch) => _commonSvc.proveedorSearch(textSearch);
        $scope.selectProveedorFiltro = (item) => {
            $scope.mainForm.rucProveedor = item.proveedor.numeroIdentificacion
            $scope.getArticles()
        }

        $scope.articuloSearch = (item) => {
            if (item.length >= 3) {
                return _articleSvc.search({ busqueda: item })
            }
        }

        $scope.articleSelected = (item) => {
            $scope.mainForm.idArticulo = item.idArticulo
            $scope.getArticles()
        }

        $scope.getArticles = () => {
            $scope.articles = []
            $scope.mainForm.tipo = 2
            _mS.getData('get', 'PrecioMasivo/?json=' + JSON.stringify($scope.mainForm), null, true).then(
                response => {
                    let temp = JSON.parse(response.payload)
                    $scope.articles = temp[0]
                    console.log(response)
                }
            ).catch(error => {
                console.log(error)
            })
        }

    }

})(window.angular)