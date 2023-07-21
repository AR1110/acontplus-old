

(function(){
    
    'use strict';

    app.controller('consultarPrecioCtrl', consultarPrecioCtrl)
    
    consultarPrecioCtrl.$inject = [
        "$scope",
        
        "articuloService",
        "modalService",
        "nombreModal",
      ];
      
      function consultarPrecioCtrl(
        $scope,
       
        artSvc,
        modalSvc,
        nombreModal
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
          byStock: 0,
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
          $scope.articulos = []; //Vaciar el array (Lista de Articulos);
          if ($scope.dataSearch.busqueda && $scope.dataSearch.busqueda.length < 2)
            return;
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
      
            artSvc
              .getAllWithPrices($scope.dataSearch)
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
      
        //   async openModalFiltro() {
        //     const { MODAL_CTRL, MODAL_FILTRO_CSHTML } = this._nombreModal.articulo;
        //     const { ModalFiltroCtrl } = await import("./../modal/" + MODAL_CTRL);
      
        //     const modalDialogRef = this._modalSvc.openModalCustom({
        //       controller: ModalFiltroCtrl,
        //       template: "Articulo/" + MODAL_FILTRO_CSHTML,
        //       size: "lg",
        //       params: this.dataSearch,
        //     });
        //     modalDialogRef.result.then(async (result) => {
        //       this.dataSearch = Object.assign(this.dataSearch, result);
        //       if (result.isSearch) {
        //         this.dataSearch.busqueda = null;
        //         this.querySearchArticulo();
        //       }
        //     });
        //   }
      
        $scope.onChangeCheckBoxItem = (item) => {
          const data = {
            idArticulo: item.idArticulo,
            idPresentacion: item.idPresentacion,
            presentacion: item.presentacion,
            tipoRegistro: 1,
          };
          $uibModalInstance.close(data);
        };
      
        //   //Presentacion del imagen
        $scope.getImagen = async function (item) {
          const { MODAL_CTRL, MODAL_IMAGEN_DETALLE_CSHTML } = nombreModal.articulo;
          const { ModalArticuloImagenDetalleCtrl } = await import(
            "./../modal/" + MODAL_CTRL
          );
          modalSvc.openModalCustom({
            controller: ModalArticuloImagenDetalleCtrl,
            template: `Articulo/${MODAL_IMAGEN_DETALLE_CSHTML}`,
            size: "xl",
            params: item,
          });
        };
      
        
      }
      

})(window.angular);