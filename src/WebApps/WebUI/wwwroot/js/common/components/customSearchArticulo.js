//@ts-check
inputSearchArticuloCtrl.$inject = ['$scope', '$injector', '$timeout']
function inputSearchArticuloCtrl($scope, $injector, $timeout) {
    let $ctrl = this;
    let articuloSvc = $injector.get('articuloService')


    let commonSvc = $injector.get('commonService')
    let modalSvc = $injector.get('modalService')
    let nombreModalInventario = $injector.get('nombreModalInventario')
    let productPhotoSvc = $injector.get('productPhotoService');
    const fS = $injector.get('formulario')

    $scope.placeholder = $ctrl.placeholder || "Buscar articulo";



    $scope.dataEnterSearch = {
        textSearch: null
    }

    $scope.searchText = null;
    $scope.selectedItem = null

    $scope.mdNoCache = false;
    $scope.dataSearch = {
        tipo: 1,
        bySearch: '',
        pageIndex: 1,
        pageSize: 15
    }

    $scope.productsFound = [];


    let isFetchingByBarcode = false;
    let enterPressCount = 0;
    let enterPressTimer;

    $scope.filteredResults = [];
    let pendingResolve = null;




    $scope.searchTextChange = searchTextChange;
    $scope.selectArticleSearch = selectArticleSearch;
    $scope.getDataArticuloByEnterCode = getDataArticuloByEnterCode;
    $scope.openModalArticulo = openModalArticulo;
    $scope.openModalArticuloGeneral = openModalArticuloGeneral;
    $scope.previewImg = previewImg;

    let dataArticulo = null;

    async function openModalArticulo(item) {
        try {
            const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
            let ctrl = (await import(fileCtrl))[controllers['M']];
            let template = templates['M'];
            const modalDialogRef = modalSvc.open({
                controller: ctrl,
                template,
                size: 'xl',
                params: item || {},
                isRenderRazorPartial: true
            })

            modalDialogRef.result.then(response => {
                if (response && typeof response === 'object') {
                    validarGetDataArticulo(response.idArticulo);
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

    function focusSearchCustomer() {
        let el = document.getElementById("clienteSearchInvoice")
        if (el) {
            el.focus();
        }
    }

    setTimeout(() => {

        //buscador principal
        let el = document.getElementById("custom-template-md-autocomplete-articulo")

        if (el) {
            el.addEventListener('keyup', e => {
                let keyCode = e.keyCode || e.which;
                if (!$scope.searchText && keyCode === 13) {
                    focusSearchCustomer()
                }
            })
        }

        //buscador por enter

        const autocompleteImput = document.getElementsByClassName('md-autocomplete-suggestions-container')[0]


        autocompleteImput.addEventListener('scroll', () => {
            var scrollTop = autocompleteImput.scrollTop;
            var scrollHeight = autocompleteImput.scrollHeight;
            var clientHeight = autocompleteImput.clientHeight;

            // Verificar si se ha llegado al principio (top)
            if (scrollTop === 0) {

            }

            // Verificar si se ha llegado al final (bottom)
            if (scrollTop + clientHeight === scrollHeight) {
                getProductPaginationSearch()

            }
        });

    }, 500)


    $scope.onKeyUpInputBarcode = function (event) {

        var keyCode = event.keyCode || event.which;

        if (keyCode === 13) { // Verifica si se presionó la tecla Enter
            enterPressCount++;
            if (isFetchingByBarcode) {
                enterPressCount = 0;
            }

            // Reiniciar el temporizador si ya ha pasado el tiempo
            if (enterPressTimer) {
                $timeout.cancel(enterPressTimer);
            }

            // Reiniciar el temporizador para contar 1 segundo (o el tiempo que prefieras)
            enterPressTimer = $timeout(() => {
                enterPressCount = 0; // Reiniciar el contador después de un segundo
            }, 1000); // Cambia 1000 a la duración deseada en milisegundos

            // Si se presiona Enter dos veces
            if (enterPressCount === 2) {
                focusSearchCustomer();
            }
        }

    };

    function getProductPaginationSearch() {
        let cloneProductsFound = [...$scope.productsFound]

        if (cloneProductsFound.length > 0) {
            cloneProductsFound.shift();
            if (cloneProductsFound[0].totalRecords === cloneProductsFound.length) return
        }

        $scope.dataSearch.pageIndex += 1;
        let json = {
            busqueda: commonSvc.removeAccents($scope.searchText),
            condicion: false,
            fraccionado: false,
            pageIndex: $scope.dataSearch.pageIndex,
            pageSize: $scope.dataSearch.pageSize
        }

        articuloSvc.search(json).then(articulos => {
            let resultProducts = articulos.map(item => {
                item.priceSale = item.priceSales;
                return item;
            })
            if (resultProducts.length > 0) {
                $scope.productsFound.push.apply($scope.productsFound, resultProducts);

            }
        }).catch(error => {
            console.log(error)
        })
    }


    //============================================funciones generales
    function selectArticleSearch(item) {
        console.log(item, 'selectArticleSearch')

        if (typeof item === 'object' && ("showHeader" in item)) {
            $scope.searchText = null
            return
        }
        if (!item || !("idArticulo" in item)) return

        $scope.selectedItem = null

        validarGetDataArticulo(item.idArticulo);
    }


    function validarGetDataArticulo(idArticulo, textSearch) {
        if ($ctrl.esVenta) {
            $ctrl.refProductoVenta.onInventario({
                idArticulo,
                textSearch
            })
            return
        }

    }



    function searchTextChange() {
        let json = {
            busqueda: commonSvc.removeAccents($scope.searchText),
            condicion: false,
            fraccionado: false,
            pageIndex: 1,
            pageSize: 15
        }

        $scope.dataSearch.pageIndex = 1;
        $scope.dataSearch.pageSize = 15;


        if (json.busqueda.length < 2) Promise.resolve([])


        $scope.productsFound = []
        return articuloSvc.search(json).then(articulos => {
            let results = formatProduct(articulos)
            $scope.productsFound = results;
            return results
        }).catch(error => {
            console.log(error)
            return Promise.resolve([])
        })
    }

    function formatProduct(products) {
        let results = [];
        if (products.length > 0) {
            products.unshift({
                showHeader: true,
                priceSale: products[0].priceSales,
                warehouses: products[0].warehouses

            })

            results = products.map(item => {
                if (!("showHeader" in item)) {
                    item.priceSale = item.priceSales;
                }
                return item;
            })
        }
        return results;
    }


    async function openModalArticuloGeneral() {
        try {
            const { fileCtrl, controllers, templates } = nombreModalInventario.ARTICULO;
            let ctrl = (await import(fileCtrl))[controllers['LG']];
            let template = templates['LG'];
            let modalRef = modalSvc.open({
                controller: ctrl,
                template,
                size: 'xl',
                params: {
                    ...$ctrl
                },
                windowClass: 'uibModalFullScreen',
                isRenderRazorPartial: true
            })

            modalRef.result.then(response => {
                if (response && typeof response === 'object') {
                    validarGetDataArticulo(response.idArticulo);
                }
            })
        } catch (error) {
            console.log(error)
        }

    }

    async function previewImg($event, data) {
        $event.stopPropagation();
        productPhotoSvc.previewImg(data.idArticulo)

    }


    //BUscador por codigo
    function getDataArticuloByEnterCode($event) {
        try {

            console.log($event)


            // if (!$scope.searchText) {
            //     $scope.searchText = null;
            //     return
            // }
            if (isFetchingByBarcode) return;

            if (!$scope.searchText) return;

            if ($scope.searchText.length < 2) return

            validarGetDataArticulo(null, $scope.searchText)
            $scope.searchText = null;

            /**
             * return object {idArticulo: 0}
             */
            // isFetchingByBarcode = true;
            // articuloSvc.findByEnterCode({ textSearch: $scope.searchText, isSearchByCode: true }).then(response => {
            //     if(!response) return;

            //     validarGetDataArticulo(response.idArticulo);
            //     $scope.searchText = null
            // }).catch(error => {
            //     console.log(error);
            // }).finally(()=>{
            //     isFetchingByBarcode = false;
            // })
        } catch (error) {
            console.log(error)
        }
    }

    function selectArticleSearch(item) {
        if (typeof item === 'object' && ("showHeader" in item)) {
            $scope.searchText = null
            return
        }
        if (!item || !("idArticulo" in item)) return

        $scope.selectedItem = null

        validarGetDataArticulo(item.idArticulo);
    }

}


app.component('customSearchArticulo', {
    templateUrl: `/Home/Index?name=~/Pages/Articulo/CustomSearchArticulo.cshtml`,
    //controllerAs: '$ctrl',
    bindings: {
        tipoDoc: '=',
        placeholder: '=',
        // abrirModalArticulo: '&',
        // getDataArticulo:'&',
        setItemArticuloEnDetalle: '&',
        idBodega: '=',

        esVenta: "=",
        onSelect: "&",
        items: "=",
        fechaEmision: "=",
        refProductoVenta: '='
    },
    controller: inputSearchArticuloCtrl

});


app.component("customSearchArticuloBarcode", {
    template: `<input  type="text" autocomplete="off"
                       class="form-control border-select"
                       ng-model="searchText"
                       ng-enter="getDataArticuloByEnterCode($event)"
                       ng-keyup="onKeyUpInputBarcode($event)"
                       id="inputBarcode"
                       placeholder="Ej: COMP1">
                `,
    bindings: {
        tipoDoc: '=',
        setItemArticuloEnDetalle: '&',
        idBodega: '=',

        esVenta: "=",
        onSelect: "&",
        items: "=",
        fechaEmision: "=",
        refProductoVenta: '='
    },
    controller: inputSearchArticuloCtrl

})


// Directiva para manejar el scroll infinito en el dropdown
app.directive('ngScroll', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
        element.bind('scroll', function () {
            if (element[0].scrollTop + element[0].offsetHeight >= element[0].scrollHeight - 100) {
                scope.$apply(attrs.ngScroll);
            }
        });
    };
}]);


searchComponent.$inject = ['$scope', '$element', '$timeout', '$document', '$injector'];
function searchComponent($scope, $element, $timeout, $document, $injector) {
    let articuloSvc = $injector.get('articuloService');
    let commonSvc = $injector.get('commonService')
    const $ctrl = this;

    $ctrl.searchTerm = '';
    // Ya no almacenamos la lista completa de productos.
    // Todas las búsquedas, incluida la inicial, irán directamente a la API.
    $ctrl.filteredResults = [];
    $ctrl.displayedResults = [];
    $ctrl.itemsPerLoad = 20;
    $ctrl.startIndex = 0;
    $ctrl.selectedIndex = -1;
    $ctrl.isLoading = false;
    $ctrl.isLoadingMore = false;
    $ctrl.showDropdown = false;

    function formatProduct(products) {
        let results = [];
        if (products.length > 0) {
            products.unshift({
                showHeader: true,
                priceSale: products[0].priceSales,
                warehouses: products[0].warehouses

            })

            results = products.map(item => {
                if (!("showHeader" in item)) {
                    item.priceSale = item.priceSales;
                }
                return item;
            })
        }
        return results;
    }

    // Función para filtrar los datos y manejar la carga.
    // Ahora siempre llama al servicio, sin importar si la consulta está vacía.
    $ctrl.filterData = function (query) {
        $ctrl.startIndex = 0;
        $ctrl.displayedResults = [];
        $ctrl.selectedIndex = -1;
        $ctrl.isLoading = true;

        let json = {
            busqueda: commonSvc.removeAccents(query),
            condicion: false,
            fraccionado: false,
            pageIndex: 1,
            pageSize: 15
        }
        console.log($ctrl.startIndex)

        $ctrl.filteredResults = [];

        articuloSvc.search(json).then(results => {
            $ctrl.filteredResults = results;
            console.log(results)
            $ctrl.isLoading = false;
            $ctrl.loadMore();
        }).finally(() => {
            $ctrl.isLoading = false;
            $ctrl.loadMore();
        })
    };

    // Función para cargar más datos (scroll infinito)
    $ctrl.loadMore = function () {
        if ($ctrl.isLoadingMore || $ctrl.startIndex >= $ctrl.filteredResults.length) {
            return;
        }

        $ctrl.isLoadingMore = true;
        $timeout(function () {
            const nextItems = $ctrl.filteredResults.slice($ctrl.startIndex, $ctrl.startIndex + $ctrl.itemsPerLoad);
            $ctrl.displayedResults = $ctrl.displayedResults.concat(nextItems);
            $ctrl.startIndex += $ctrl.itemsPerLoad;
            $ctrl.isLoadingMore = false;
        }, 500);
    };

    // Escuchador para el campo de búsqueda con debounce
    $scope.$watch('$ctrl.searchTerm', function (newValue, oldValue) {
        // Al inicio, 'newValue' es `undefined`. La primera carga se activa cuando se define.
        if (newValue !== undefined && newValue.length > 2) {
            $ctrl.filterData(newValue);
        }
    });

    // Ya no es necesaria una carga inicial de datos.
    // El $watch en el ng-model se encargará de la primera búsqueda.

    // Función para manejar la navegación con teclado
    $ctrl.handleKeyDown = function (event) {
        const key = event.key;
        if (key === 'ArrowDown' && $ctrl.displayedResults.length > 0) {
            event.preventDefault();
            $ctrl.selectedIndex = ($ctrl.selectedIndex + 1) % $ctrl.displayedResults.length;
            $ctrl.scrollToSelected();
        } else if (key === 'ArrowUp' && $ctrl.displayedResults.length > 0) {
            event.preventDefault();
            $ctrl.selectedIndex = ($ctrl.selectedIndex - 1 + $ctrl.displayedResults.length) % $ctrl.displayedResults.length;
            $ctrl.scrollToSelected();
        } else if (key === 'Enter' && $ctrl.selectedIndex !== -1) {
            event.preventDefault();
            $ctrl.onSelect({ item: $ctrl.displayedResults[$ctrl.selectedIndex] });
            $ctrl.closeDropdown();
        }
    };

    // Desplazar al elemento seleccionado
    $ctrl.scrollToSelected = function () {
        $timeout(function () {
            const element = document.getElementById('row-' + $ctrl.selectedIndex);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 0);
    };

    // Selección de elemento con clic
    $ctrl.selectItem = function (index) {
        $ctrl.selectedIndex = index;
        $ctrl.onSelect({ item: $ctrl.displayedResults[$ctrl.selectedIndex] });
        $ctrl.closeDropdown();
    };

    // Manejador para el evento de "venta" en stock o imagen
    $ctrl.handleSale = function (item, type, event) {
        if (event) {
            event.stopPropagation();
        }
        $ctrl.onSale({ item: item, type: type });
    };

    // Función para simular la modificación del elemento seleccionado
    $ctrl.modifySelection = function () {
        if ($ctrl.selectedIndex !== -1) {
            $ctrl.onModify({ item: $ctrl.displayedResults[$ctrl.selectedIndex] });
        }
    };

    // Cierra el dropdown
    $ctrl.closeDropdown = function () {
        $ctrl.showDropdown = false;
    };

    // Vuelve a mostrar el dropdown al enfocar el input
    $ctrl.onFocus = function () {
        $ctrl.showDropdown = true;
    };

    // Se agrega un "escuchador" de eventos a todo el documento
    $document.on('click', function (event) {
        const searchContainer = $element[0];
        if (searchContainer && !searchContainer.contains(event.target)) {
            $timeout(function () {
                $ctrl.closeDropdown();
            }, 0);
        }
    });

    // Limpiamos el escuchador de eventos cuando el componente es destruido
    $scope.$on('$destroy', function () {
        $document.off('click');
    });
}

app.directive('searchComponent', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        template: `
              <div class="search-app-search-container">
                        <label for="search-input" class="search-app-search-label">Buscar productos</label>
                        <input
                            type="text"
                            id="search-input"
                            class="search-app-search-input"
                            placeholder="Ej. Mouse inalámbrico"
                            ng-model="$ctrl.searchTerm"
                            ng-model-options="{debounce: 500}"
                            ng-keydown="$ctrl.handleKeyDown($event)"
                            ng-focus="$ctrl.onFocus()"
                        >

                        <div class="search-app-dropdown-results" ng-if="$ctrl.showDropdown" ng-scroll="$ctrl.loadMore()">
                            <!-- Loading state -->
                            <div class="search-app-loading-text" ng-if="$ctrl.isLoading">Cargando resultados...</div>
                            <!-- No results state -->
                            <div class="search-app-info-text" ng-if="!$ctrl.isLoading && $ctrl.filteredResults.length === 0 && $ctrl.searchTerm.length > 0">
                                <p>No se encontraron resultados para "{{$ctrl.searchTerm}}".</p>
                            </div>
                            <!-- Results table (desktop) -->
                            <div ng-if="$ctrl.filteredResults.length > 0" class="search-app-table-container">
                                <table class="search-app-result-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Subfamilia</th>
                                            <th>Medida</th>
                                            <th>Stock</th>
                                            <th ng-repeat="pvp in $ctrl.displayedResults[0].priceSales">{{pvp.tarifa}}</th>
                                            <th>Impuesto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="item in $ctrl.displayedResults" ng-class="{'search-app-selected-row': $index === $ctrl.selectedIndex}" ng-click="$ctrl.selectItem($index)" id="row-{{$index}}">
                                            <td class="search-app-clickable-cell text-left" ng-click="$ctrl.handleSale(item, 'imagen', $event)">
                                             <div class="d-flex align-items-center">
          <img
             ng-src="{{item.s3ObjectUrl}}"
            alt="Imagen de {{$index}}"
              style="width: 45px; height: 45px"
              class="rounded-circle"
              />
          <div class="ms-3">
            <p class="fw-bold mb-1">{{item.descripcion}}</p>
            <p class="text-muted mb-0">{{item.codigo}}</p>
          </div>
        </div>

                                            </td>
                                            <td>{{item.subFamilia}}</td>
                                            <td class="search-app-clickable-cell" ng-click="$ctrl.handleSale(item, 'medida', $event)">{{item.medida}}</td>
                                            <td class="search-app-clickable-cell" ng-click="$ctrl.handleSale(item, 'stock', $event)">
                                                <span class="search-app-stock-badge" ng-class="{'search-app-warning-stock': item.stock <= 10, 'search-app-success-stock': item.stock > 10}">{{item.stock}}</span>
                                            </td>
                                            <td ng-repeat="pvp in item.priceSales">{{pvp.precio}}</td>
                                            <td>{{item.iva}}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- Results cards (mobile) -->
                                <div class="search-app-result-cards">
                                    <div class="search-app-result-card" ng-repeat="item in $ctrl.displayedResults" ng-class="{'search-app-selected-row': $index === $ctrl.selectedIndex}" ng-click="$ctrl.selectItem($index)" id="row-{{$index}}">
                                        <div class="search-app-card-image-container" ng-click="$ctrl.handleSale(item, 'imagen', $event)">
                                            <img ng-src="{{item.imagen}}" alt="Imagen de {{item.codigo}}" class="search-app-result-image search-app-clickable">
                                        </div>
                                        <div class="search-app-card-details">
                                            <p><strong>Código:</strong> {{item.codigo}}</p>
                                            <p><strong>Descripción:</strong> {{item.descripcion}}</p>
                                            <p><strong>Subfamilia:</strong> {{item.subfamilia}}</p>
                                            <p><strong class="search-app-clickable" ng-click="$ctrl.handleSale(item, 'medida', $event)">Medida:</strong> {{item.medida}}</p>
                                            <p><strong>Stock:</strong> <span class="search-app-stock-badge" ng-class="{'search-app-warning-stock': item.stock <= 10, 'search-app-success-stock': item.stock > 10}" ng-click="$ctrl.handleSale(item, 'stock', $event)">{{item.stock}}</span></p>
                                            <p><strong>PVP1:</strong> {{item.pvp1}}</p>
                                            <p><strong>PVP2:</strong> {{item.pvp2}}</p>
                                            <p><strong>Impuesto:</strong> {{item.impuesto}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="search-app-loading-text" ng-if="$ctrl.isLoadingMore">Cargando más resultados...</div>
                        </div>
                    </div>


        `,
        controller: searchComponent,
        controllerAs: '$ctrl',
        bindToController: {
            sourceData: '=', // Enlace bidireccional para los datos
            onSelect: '&',   // Callback para cuando se selecciona un ítem
            onModify: '&'    // Callback para cuando se modifica un ítem
        }
    }

}])

productSearchComponent.$inject = ['$scope'];
function productSearchComponent($scope) {

    // Dataset simulado para productos con nuevos campos
    const sampleProducts = [
        { codigo: 'SKU-001', descripcion: 'Mouse inalámbrico', subfamilia: 'Periféricos', stock: 150, pvp1: 25.50, pvp2: 23.00, pvp3: 21.50, pvp4: 20.00, pvp5: 19.50, impuesto: 'IVA 21%', imagen: 'https://placehold.co/60x60/808080/FFFFFF?text=Mouse' },
        { codigo: 'ACC-002', descripcion: 'Teclado mecánico', subfamilia: 'Periféricos', stock: 80, pvp1: 85.00, pvp2: 80.50, pvp3: 78.00, pvp4: 75.00, pvp5: 72.50, impuesto: 'IVA 21%', imagen: 'https://placehold.co/60x60/808080/FFFFFF?text=Teclado' },
        { codigo: 'COM-003', descripcion: 'Monitor Ultra HD', subfamilia: 'Monitores', stock: 55, pvp1: 350.00, pvp2: 340.00, pvp3: 330.00, pvp4: 320.00, pvp5: 310.00, impuesto: 'IVA 21%', imagen: 'https://placehold.co/60x60/808080/FFFFFF?text=Monitor' },
        { codigo: 'SKU-004', descripcion: 'Auriculares inalámbricos', subfamilia: 'Audio', stock: 200, pvp1: 65.00, pvp2: 60.00, pvp3: 58.50, pvp4: 55.00, pvp5: 52.00, impuesto: 'IVA 21%', imagen: 'https://placehold.co/60x60/808080/FFFFFF?text=Auricular' },
        { codigo: 'ACC-005', descripcion: 'Soporte de laptop', subfamilia: 'Accesorios', stock: 350, pvp1: 15.00, pvp2: 14.50, pvp3: 14.00, pvp4: 13.50, pvp5: 13.00, impuesto: 'IVA 21%', imagen: 'https://placehold.co/60x60/808080/FFFFFF?text=Soporte' },
        { codigo: 'PER-006', descripcion: 'Webcam 4K', subfamilia: 'Periféricos', stock: 120, pvp1: 99.00, pvp2: 95.00, pvp3: 92.00, pvp4: 90.00, pvp5: 88.00, impuesto: 'IVA 21%', imagen: 'https://placehold.co/60x60/808080/FFFFFF?text=Webcam' },
        { codigo: 'COM-007', descripcion: 'Tarjeta gráfica', subfamilia: 'Componentes', stock: 45, pvp1: 500.00, pvp2: 480.00, pvp3: 470.00, pvp4: 450.00, pvp5: 430.00, impuesto: 'IVA 21%', imagen: 'https://placehold.co/60x60/808080/FFFFFF?text=GPU' }
    ];

    $scope.productosData = [];
    for (let i = 0; i < 50; i++) {
        $scope.productosData = $scope.productosData.concat(sampleProducts.map(item => ({ ...item, codigo: item.codigo + '-' + i })));
    }

    // Define la única fuente de datos
    $scope.currentData = $scope.productosData;

    // Variables de estado del MainController para el modal
    $scope.showModal = false;
    $scope.modalTitle = '';
    $scope.selectedItem = null;

    // Función de callback para cuando se selecciona un ítem
    $scope.handleSelection = function (item) {
        console.log('Item seleccionado en el controlador principal:', item);
        $scope.selectedItem = item;
        $scope.modalTitle = `¡Item seleccionado!`;
        $scope.showModal = true;
    };

    // Función de callback para cuando se modifica un ítem
    $scope.handleModification = function (item) {
        console.log('Item a modificar en el controlador principal:', item);
        $scope.selectedItem = item;
        $scope.modalTitle = `Modificando el ítem: ${item.codigo || item.id}`;
        $scope.showModal = true;
    };

    // Función para cerrar el modal
    $scope.closeModal = function () {
        $scope.showModal = false;
        $scope.selectedItem = null;
    };

}

app.component('productSearchComponent', {
    template: `
         <search-component
            source-data="currentData"
            on-select="handleSelection(item)"
            on-modify="handleModification(item)">
        </search-component>

    `,
    controller: productSearchComponent
})



// Define el componente de itemSearch
app.component('itemSearch', {
    bindings: {
        onItemSelect: '&',
        siglaFamilia: '='
    },
    template: `
           <div class="form-group">
            <label>Búsqueda</label>
            <div class="gac-form-control-container">
                <input type="text"
                       class="form-control rounded-pill p-3 select-border"
                       placeholder="Buscar por código o nombre..."
                       ng-model="$ctrl.searchText"
                       ng-change="$ctrl.filterItemsWithDebounce()"
                       ng-focus="$ctrl.showDropdown = true;"
                       ng-blur="$ctrl.hideDropdown()"
                       ng-keydown="$ctrl.handleKeydown($event)"
                       autocomplete="off">

                <div class="gac-autocomplete-dropdown"
                     ng-show="$ctrl.showDropdown && $ctrl.filteredItems.length > 0"
                     ng-mousedown="$ctrl.preventDropdownClose($event)"> <!-- Agregado: previene que se cierre el dropdown al hacer clic -->
                    <a href="#"
                       class="gac-dropdown-item"
                       ng-class="{ 'active': $index === $ctrl.highlightedIndex }"
                       ng-repeat="item in $ctrl.filteredItems track by $index"
                       ng-click="$ctrl.selectItem(item)">
                        <div>
                            <span class="gac-dropdown-item-code">{{ item.code }}</span> -
                            <span class="gac-dropdown-item-summary">{{ item.description }}</span>
                        </div>
                        <small class="gac-dropdown-item-content">{{item.nombreSubFamilia}}</small>
                    </a>
                </div>
            </div>

           </div>
        `,
    controller: ['$timeout', '$element', '$scope', 'itemService', function ($timeout, $element, $scope, itemService) {
        var $ctrl = this;
        var searchTimeout;

        $ctrl.searchText = '';
        $ctrl.filteredItems = [];
        $ctrl.selectedItem = null;
        $ctrl.showDropdown = false;
        $ctrl.highlightedIndex = -1;

        $ctrl.filterItemsWithDebounce = function () {
            $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                $ctrl.filteredItems = [];
                if (!($ctrl.searchText.length > 0)) return;
                itemService.search({
                    searchTerm: $ctrl.searchText,
                    filters: {
                        siglaFamilia: $ctrl.siglaFamilia
                    },
                    pageIndex: 1,
                    pageSize: 10
                })
                    .then((response) => {
                        $ctrl.filteredItems = response.data;
                    })
                    .catch((error) => {
                        console.error("Error al obtener datos:", error);
                    });
                console.log('Searching for:', $ctrl.searchText);

            }, 300);
        };

        $ctrl.selectItem = function (item) {
            $ctrl.onItemSelect({ item: item });
            $ctrl.searchText = item.Summary;
            $ctrl.showDropdown = false;
            $ctrl.filteredItems = [];
            $ctrl.highlightedIndex = -1;
        };

        $ctrl.handleKeydown = function (event) {
            const listSize = $ctrl.filteredItems.length;
            if (listSize === 0) {
                return;
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                $ctrl.highlightedIndex = ($ctrl.highlightedIndex + 1) % listSize;
                $ctrl.scrollToHighlightedItem();
            }
            else if (event.key === 'ArrowUp') {
                event.preventDefault();
                $ctrl.highlightedIndex = ($ctrl.highlightedIndex - 1 + listSize) % listSize;
                $ctrl.scrollToHighlightedItem();
            }
            else if (event.key === 'Enter') {
                event.preventDefault();
                if ($ctrl.highlightedIndex > -1) {
                    $ctrl.selectItem($ctrl.filteredItems[$ctrl.highlightedIndex]);
                }
            }
            else if (event.key === 'Escape') {
                $ctrl.showDropdown = false;
            }
        };

        $ctrl.hideDropdown = function () {
            $timeout(function () {
                if (!$element.find('input')[0].contains(document.activeElement)) {
                    $ctrl.showDropdown = false;
                    $scope.$apply();
                }
            }, 200);
        };

        // Nueva función para prevenir el cierre del dropdown
        $ctrl.preventDropdownClose = function (event) {
            event.preventDefault();
        };

        $ctrl.scrollToHighlightedItem = function () {
            var dropdown = $element.find('.gac-autocomplete-dropdown')[0];
            var highlightedItem = dropdown.querySelector('.gac-dropdown-item.active');
            if (highlightedItem) {
                var itemTop = highlightedItem.offsetTop;
                var itemBottom = itemTop + highlightedItem.offsetHeight;
                var dropdownScrollTop = dropdown.scrollTop;
                var dropdownHeight = dropdown.offsetHeight;

                if (itemBottom > dropdownScrollTop + dropdownHeight) {
                    dropdown.scrollTop = itemBottom - dropdownHeight;
                } else if (itemTop < dropdownScrollTop) {
                    dropdown.scrollTop = itemTop;
                }
            }
        };
    }
    ]
});
