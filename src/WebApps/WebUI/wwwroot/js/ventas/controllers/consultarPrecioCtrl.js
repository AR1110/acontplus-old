

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
		console.log("init");
		$scope.articulos = [];
		$scope.selectedArticulos = [];
		//Filtro
		$scope.recordsQuantity = [10, 25, 50, 100];
		$scope.dataSearch = {
			pageSize: 50,
			pageIndex: 1,
			maxSize: 5,
			totalRecords: 0,
			busqueda: "",

			byColumn: "DESC",
		};

		$scope.activated = false;

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

		$scope.dynamicPopover = {
			content: "Hello, World!",
			templateUrl: "myPopoverTemplate.html",
			title: "Title",
		};

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

		$scope.consultarPrecioSearchText = function () {
			$scope.articulos = [];
			if ($scope.dataSearch.bySearch && $scope.dataSearch.bySearch.length < 2) return;
			$scope.querySearchArticulo();
		};

		$scope.querySearchArticulo = function () {
			try {
				$scope.articulos = [];
				if ($scope.dataSearch.bySearch.length < 2) {
					$scope.dataSearch.totalRecords = 0;
					return;
				}
				$scope.activated = true;

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
						$scope.activated = false;

						$scope.articulos = articulos;
						$scope.dataSearch.totalRecords = totalRecords;
						$scope.tarifas =
							$scope.articulos.length > 0 ? $scope.articulos[0].tarifas : [];
					})
					.catch((err) => {
						$scope.activated = false;
						console.log(err);
					});
			} catch (error) {
				$scope.activated = false;
				console.log(error);
			}
		};

		$scope.pagechanged = function () {
			$scope.querySearchArticulo();
		};

		$scope.changePageSize = function () {
			$scope.dataSearch.pageIndex = 1;
			$scope.querySearchArticulo();
		};

		$scope.consultarPrecioEnter = function ($event) {
			if ($scope.dataSearch.bySearch && $event.key === "Enter") {
				$scope.querySearchArticulo();
				$scope.dataSearch.bySearch = "";
			}
		};


		$scope.onChangeCheckBoxItem = (item) => {
			const data = {
				idArticulo: item.idArticulo,
				idPresentacion: item.idPresentacion,
				presentacion: item.presentacion,
				tipoRegistro: 1,
			};
			$uibModalInstance.close(data);
		};
 
        $scope.previewImg = function (item) {
            productPhotoSvc.previewImg(item.idArticulo)
        }


	}


})(window.angular);