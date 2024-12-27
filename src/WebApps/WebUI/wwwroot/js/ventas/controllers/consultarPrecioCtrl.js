

(function () {

	'use strict';

	app.controller('consultarPrecioCtrl', consultarPrecioCtrl)

	consultarPrecioCtrl.$inject = [
		"$scope",
		"articuloService",
        'productPhotoService', 
	];

	function consultarPrecioCtrl(
		$scope, 
		artSvc,
        productPhotoSvc, 
	) { 
		$scope.articulos = [];
		$scope.selectedArticulos = [];
		//Filtro
		$scope.recordsQuantity = [10,15, 25, 50, 100];
		$scope.dataSearch = {
			pageSize: 10,
			pageIndex: 1,
			maxSize: 5,
			totalRecords: 0,
			bySearch: "",

			byColumn: "DESC",
		};
  
		$scope.tipoBusquedas = [
			{
				codigo: "DESC",
				descripcion: "Descripción",
			},
			{
				codigo: "COD",
				descripcion: "Código",
			},
			{
				codigo: "AUX",
				descripcion: "Código Auxiliar",
			},
			{
				codigo: "BAR",
				descripcion: "Código Barra",
			},
		];

	 

		$scope.options = {
			rowSelection: false,
			multiSelect: false,
			autoSelect: false,
			decapitate: false,
			largeEditDialog: false,
			boundaryLinks: false,
			limitSelect: false,
			pageSelect: false,
		};

        $scope.refresh = refresh;
        $scope.getArticulos = getArticulos;
        $scope.onEnter = onEnter;

        function refresh(){ 
            getArticulos()
        }

        function getArticulos(){
            try {
				$scope.articulos = []; 
				const dataSearch = {
					tipo: 3,
					bySearch: $scope.dataSearch.bySearch,
					byColumn: $scope.dataSearch.byColumn,
					checkBoxStock: [1, 2].includes($scope.dataSearch.byStock),
					byStock: $scope.dataSearch.byStock,
					pageIndex: $scope.dataSearch.pageIndex,
					pageSize: $scope.dataSearch.pageSize,

				}
				artSvc
					.getAllWithPrices(dataSearch)
					.then((response) => {
						let { articulos, totalRecords } = response; 

						$scope.articulos = articulos;
						$scope.dataSearch.totalRecords = totalRecords;
						$scope.tarifas =
							$scope.articulos.length > 0 ? $scope.articulos[0].tarifas : [];
					})
					.catch((err) => { 
						console.log(err);
					});
			} catch (error) {
				$scope.activated = false;
				console.log(error);
			}
        } 
 

		$scope.pagechanged = function () {
			refresh()
		};

		$scope.changePageSize = function () {
			$scope.dataSearch.pageIndex = 1;
			refresh()
		};
 

        function onEnter($event) {
            $scope.articulos = [];
            if ($scope.dataSearch.bySearch && $event.key === "Enter") {
                refresh()
              //  $scope.dataSearch.bySearch = null;
            }
        }; 
        $scope.previewImg = function (item) {
            productPhotoSvc.previewImg(item.idArticulo)
        }


	}


})(window.angular);