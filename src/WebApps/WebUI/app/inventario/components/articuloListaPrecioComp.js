import app from '@src/app';
import template from './articuloListaPrecioComp.html';

 
app.component('articuloListaPrecioComp', {
    template: template, // Ruta al archivo HTML
    controller:  articuloListaPrecioComp,
    bindings: { 
        checkCart: '<',      // Enlace unidireccional para datos no primitivos 
    },
});


articuloListaPrecioComp.$inject = ['$scope', 'articuloService'];
function articuloListaPrecioComp($scope, articuloSvc){
    let ctrl = this;
    console.log(ctrl)
    $scope.articulos = [];
        $scope.selectedArticulos = [];
        //Filtro
        $scope.recordsQuantity = [10, 25, 50, 100];
        $scope.dataSearch = {
            pageSize: 10,
            pageIndex: 1,
            maxSize: 5,
            totalRecords: 0,
            bySearch: null,
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
            rowSelection: true,
            multiSelect: ctrl.checkCart,
            autoSelect: false,
            decapitate: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true,

        }; 

        $scope.onSearchText = onSearchText;
        $scope.pageChanged = pageChanged;
        $scope.changePageSize = changePageSize;
        $scope.onEnter = onEnter;
        $scope.refresh = refresh;
        $scope.askToSelect = askToSelect;




        function pageChanged() {
            refresh();
        }

        function changePageSize() {
            $scope.dataSearch.pageIndex = 1;
            refresh();
        }

        function onEnter($event) {
            if ($scope.dataSearch.bySearch && $event.key === "Enter") {
                refresh()
                $scope.dataSearch.bySearch = null;
            }
        };

        function onSearchText() {
            $scope.articulos = [];
            if ($scope.dataSearch.bySearch && $scope.dataSearch.bySearch.length > 2) {
                getArticulos()
            }

        }

        function getArticulos() {
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
                articuloSvc.getAllWithPrices(dataSearch).then((response) => {
                    let { articulos, totalRecords } = response;

                    $scope.articulos = articulos;
                    $scope.dataSearch.totalRecords = totalRecords;
                    $scope.tarifas = $scope.articulos.length > 0 ? $scope.articulos[0].tarifas : [];
                }).catch((err) => {
                    console.log(err);
                });
            } catch (error) {
                console.log(error);
            }

        }

        function refresh() {
            getArticulos();
        }



        $scope.onChangeCheckBoxItem = (item) => {
            const data = {
                idArticulo: item.idArticulo,
                idPresentacion: item.idPresentacion,
                presentacion: item.presentacion,
                tipoRegistro: 1,
            };
            $uibModalInstance.close(data);
        };

        // $scope.onChangeCheckBoxItem =  (item)=>{
        //     console.log(item)
        // }

        // const dataMergeStockQty = mergeStockQty(cloneOrderItems, {
        //     idArticulo: $event.productId,
        //     idBodega: $event.bodegaId
        // });

        // const cantidad = calculateCantidadStock({
        //     cantidadStock: dataMergeStockQty.cantidadStock,
        //     idBodega: $event.bodegaId,
        //     fechaEmision: this.posStoreSvc.state().order.createdAt,
        //     productoConsolidaciones: $event.consolidacionesFecha
        // });

        // const paramsStock = {
        //     idArticulo: $event.productId,
        //     idBodega: $event.bodegaId,
        //     cantidad
        // };

        function askToSelect(item) {

            if (params && typeof params === 'object' && params.esVenta) {
                askToAdd(item);
                return
            }

            const data = {
                idArticulo: item.idArticulo,
            };
            $uibModalInstance.close(data);


        }

        function getElementQty() {
            return document.getElementById('cantidadInput');
        }

        /**
         * 
         * @param {*} item 
         */
        function askToAdd(item) {
            Swal.fire({
                title: '¿Qué deseas hacer?',
                html: `
                <label for="cantidadInput" style="display: block; margin-bottom: 5px;">Ingresa una cantidad:</label>
                <input id="cantidadInput" type="number" class="swal2-input" placeholder="Escribe un número" min="1" value="1" autofocus>
            `,
                focusConfirm: false,
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'Añadir y continuar',
                denyButtonText: 'Añadir y cerrar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const cantidadInput = getElementQty().value;

                    // Validar si el valor es un número y mayor que 0
                    if (isNaN(cantidadInput) || cantidadInput <= 0) {
                        Swal.showValidationMessage('La cantidad debe ser un número mayor a 0.');
                        return false; // Retorna false para no permitir el cierre
                    }

                    return cantidadInput; // Retorna el valor si es válido
                },
                preDeny: () => {
                    const cantidadInput = getElementQty().value;

                    // Validar si el valor es un número y mayor que 0
                    if (isNaN(cantidadInput) || cantidadInput <= 0) {
                        Swal.showValidationMessage('La cantidad debe ser un número mayor a 0.');
                        return false; // Retorna false para no permitir el cierre
                    }

                    return cantidadInput; // Retorna el valor si es válido
                },
                didOpen: () => {
                    // Detectar la tecla Enter
                    const cantidadInputElement = getElementQty();
                    cantidadInputElement.select()
                    cantidadInputElement.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter') {
                            Swal.clickConfirm(); // Simula el clic en "Añadir y continuar"
                        }
                    });
                }
            }).then((result) => {
                let cantidadInput = getElementQty().value; // Obtener el valor del input
                cantidadInput = Number(cantidadInput);

                if (result.isConfirmed) {
                    params.refProductoVenta.onInventario(item.idArticulo, cantidadInput);

                } else if (result.isDenied) {
                    params.refProductoVenta.onInventario(item.idArticulo, cantidadInput);
                    $uibModalInstance.close();
                }
            });

        }

        $scope.previewImg = function (item) {
            productPhotoSvc.previewImg(item.idArticulo)
        }
 
}

export {}