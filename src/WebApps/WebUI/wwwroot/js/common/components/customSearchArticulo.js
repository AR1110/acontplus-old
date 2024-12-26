//@ts-check
inputSearchArticuloCtrl.$inject = ['$scope',  '$injector', '$timeout' ]
function inputSearchArticuloCtrl($scope,   $injector,  $timeout ) {
    let $ctrl = this;
    let articuloSvc = $injector.get('articuloService')  


    let commonSvc = $injector.get('commonService')
    let modalSvc = $injector.get('modalService') 
    let nombreModalInventario = $injector.get('nombreModalInventario')  
    let productPhotoSvc = $injector.get('productPhotoService');

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


    $scope.searchTextChange = searchTextChange;
    $scope.selectArticleSearch = selectArticleSearch;
    $scope.getDataArticuloByEnterCode = getDataArticuloByEnterCode;
    $scope.openModalArticulo = openModalArticulo;
    $scope.openModalArticuloGeneral = openModalArticuloGeneral;
    $scope.previewImg = previewImg;

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
 

    $scope.onKeyUpInputBarcode = function(event) { 

        var keyCode = event.keyCode || event.which;

        if (keyCode === 13) { // Verifica si se presionó la tecla Enter
            enterPressCount++;
            if(isFetchingByBarcode){
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


        if (json.busqueda.length < 2) return [];


        $scope.productsFound = []
        return articuloSvc.search(json).then(articulos => {
            let results = formatProduct(articulos)
            $scope.productsFound = results;
            return results
        }).catch(error => {
            console.log(error)
            return []
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
    function getDataArticuloByEnterCode() {
        try {

            // if (!$scope.searchText) {
            //     $scope.searchText = null;
            //     return
            // }
            if(isFetchingByBarcode) return;

            if(!$scope.searchText) return;

            if ($scope.searchText.length < 2) return

            validarGetDataArticulo(null,$scope.searchText )
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
                       ng-enter="getDataArticuloByEnterCode()"     
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