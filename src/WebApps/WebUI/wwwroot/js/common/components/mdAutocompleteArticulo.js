//@ts-check
inputSearchArticuloCtrl.$inject = ['$scope', '$rootScope', '$injector', '$timeout', '$q']
function inputSearchArticuloCtrl($scope, $rootScope, $injector, $timeout, $q) {
    let $ctrl = this;
    let articuloSvc = $injector.get('articuloService')
    let productPhotoSvc = $injector.get('productPhotoService')
    let mS = $injector.get('mainService')


    let commonSvc = $injector.get('commonService')
    let modalSvc = $injector.get('modalService')
    let nombreModal = $injector.get('nombreModal')
    let nombreModalInventario = $injector.get('nombreModalInventario')
    let tS = $injector.get('toastService');


    $scope.placeholder = $ctrl.placeholder || "Buscar articulo";



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
    let isUpdateProduct = false;



    $scope.searchTextChange = searchTextChange;
    $scope.selectArticleSearch = selectArticleSearch;
    $scope.getDataArticuloByEnterCode = getDataArticuloByEnterCode;
    $scope.openModalArticulo = openModalArticulo;
    $scope.openModalArticuloGeneral = openModalArticuloGeneral;

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
        let el = $("#clienteSearchInvoice")
        if (el) {
            el.focus();
        }
    }

    setTimeout(() => {

        //buscador principal 
        let el = $("#custom-template-md-autocomplete-articulo")

        if (el) {
            el.on('keyup', e => {
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

    setTimeout(() => {

        let el = $("#inputBarcode")

        if (el) {
            el.on('keyup', e => {
                var keyCode = e.keyCode || e.which;

                if (!$scope.searchText && keyCode === 13) {
                    focusSearchCustomer()
                }
            })
        }

    }, 800)

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
                //this.productsFound = this.productsFound.concat(resultProducts)
                // var autocompleteCtrl = angular.element(document.querySelector('md-autocomplete')).controller('mdAutocomplete');
                // var matchesList = autocompleteCtrl.matches;
                // console.log(matchesList);

                // console.log(autocompleteCtrl);
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


    function validarGetDataArticulo(idArticulo) {

        if ($ctrl.esVenta) {
            $ctrl.refProductoVenta.onInventario(idArticulo)
        }
        console.log($ctrl)

        // if (['FV', 'NE', 'PR', 'NC'].includes($ctrl.tipoDoc.codigo)) {
        //     getDataArticuloParaVenta();
        //     return
        // }

        if (['CIV'].includes($ctrl.tipoDoc.codigo)) {
            getId(idArticulo)
            return
        }


        if (["C"].includes($ctrl.tipoDoc.codigo)) {
            getDataArticuloParaCompra(idArticulo);
            return
        }

        if (['FC', 'IB', 'LC', 'NCP', 'OC', 'TRA', 'GR'].includes($ctrl.tipoDoc.codigo)) {
            getDataArticuloParaCompra(idArticulo);
        }

    }


    function getDataArticuloParaVenta(dataArticulo) {
        try {
            dataArticulo.idBodega = $ctrl.idBodega;
            /**
             * return object {articulo, medidas, datosAdicionales}
             */
            articuloSvc.getForSale(dataArticulo).then(async dataArticuloApi => {

                //Cuando el articulo no lleva inventario 
                if (!dataArticuloApi.articulo.llevaInventario) {
                    $ctrl.setItemArticuloEnDetalle({
                        item: dataArticuloApi
                    })
                    return
                }

                if (['PR'].includes($ctrl.tipoDoc.codigo)) {
                    $ctrl.setItemArticuloEnDetalle({
                        item: dataArticuloApi
                    })
                    return
                }

                //Agregando validacion nueva el idMedida 07/10/2023 por emilio 
                articuloSvc.checkNotificationStock({
                    idArticulo: dataArticulo.idArticulo,
                    cantidad: -1,
                    idBodega: dataArticulo.idBodega,
                    idMedida: dataArticuloApi.medidas[0].idMedida
                }).then(async responseApi => {

                    let { code, message, titleSms } = responseApi;

                    if (code === "1") {
                        $ctrl.setItemArticuloEnDetalle({
                            item: dataArticuloApi
                        })
                        return
                    }

                    let { isConfirmed } = await Swal.fire({
                        title: `<small>${titleSms}</small>`,
                        icon: 'warning',
                        html: `<small>${message}</small>`,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    })

                    if (isConfirmed) {
                        if (code === "0") {
                            $("#custom-template-md-autocomplete-articulo").focus();
                        }
                        if (code === "2") {
                            $ctrl.setItemArticuloEnDetalle({
                                item: dataArticuloApi
                            })
                        }
                    }


                }).catch(error => {
                    console.log(error);
                })

            }).catch(error => {
                console.log(error);
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function getDataArticuloParaCompra(idArticulo) {
        try {

            let spParams = {
                idArticulo
            }
            articuloSvc.getForPurchase(spParams).then(response => {
                $ctrl.setItemArticuloEnDetalle({
                    item: response
                })
            })

        } catch (error) {
            console.error(error)
        }
    }

    function getId(idArticulo) {
        try {
            let params = {
                idArticulo,
                idBodega: $ctrl.idBodega
            }
            articuloSvc.getId(params).then(response => {
                $ctrl.setItemArticuloEnDetalle({
                    item: { ...response, isUpdateProduct }
                })
                isUpdateProduct = false;
            })
        } catch (e) {
            console.log(e)
        }
    }
    //=====================================================================================================


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


    function getDynamicSearchArticles() {

        // let json = {
        //     busqueda: this._commonSvc.removeAccents(this.searchText),
        //     condicion: false,
        //     fraccionado: false,
        //     pageIndex: this.dataSearch.pageIndex,
        //     pageSize: this.dataSearch.pageSize
        // }

        // if (json.busqueda.length < 3) return [];

        // return this.articuloSvc.search(json).then(articulos => {
        //     if (articulos.length > 0) {
        //         articulos.unshift({
        //             showHeader: true,
        //             priceSale: articulos[0].priceSales,
        //             warehouses: articulos[0].warehouses

        //         })

        //         articulos = articulos.map(item => {
        //             if (!("showHeader" in item)) {
        //                 item.priceSale = item.priceSales;
        //             }
        //             return item;
        //         })
        //         return articulos;
        //     }
        // }).catch(error => {
        //     hideLoader();
        //     console.log(error)
        //     return [];
        // })
    }

    async function getDynamicSearchArticlesSimple(textSearch) {
        let results = await articuloSvc.search({
            textSearch,
            condicion: false,
            pageIndex: 1,
            pageSize: 25
        })


        let deferred = $q.defer();
        deferred.resolve(results);
        return deferred.promise;

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
        this.productPhotoSvc.previewImg(data.idArticulo)

    }


    //BUscador por codigo 
    function getDataArticuloByEnterCode() {
        try {

            if (!$scope.searchText) {
                $scope.searchText = null;
                return
            }

            if ($scope.searchText.length < 2) return

            /**
             * return object {idArticulo: 0}
             */
            articuloSvc.findByEnterCode({ textSearch: $scope.searchText, isSearchByCode: true }).then(response => {
                selectArticleSearch(response)
                $scope.searchText = null
            }).catch(error => {
                console.log(error);
            })
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


app.component('mdAutocompleteArticuloComponent', {
    templateUrl: `/Home/Index?name=~/Pages/Articulo/MdAutocomplete.cshtml`,
    //controllerAs: '$ctrl',
    bindings: {
        tipoDoc: '=',
        placeholder: '=',
        // abrirModalArticulo: '&',
        // getDataArticulo:'&',
        setItemArticuloEnDetalle: '&',
        isDefaultArticle: '=?',
        idBodega: '=',

        esVenta: "=",
        onSelect: "&",
        items: "=",
        fechaEmision: "=",
        refProductoVenta: '='
    },
    controller: inputSearchArticuloCtrl

});


app.component("articuloSearchBarcode", {
    template: `<input  type="text" autocomplete="off"
                       class="form-control border-select" 
                       ng-model="searchText"  
                       ng-enter="getDataArticuloByEnterCode()"     
                       id="inputBarcode"
                       placeholder="Ej: COMP1"> 
                `,
    bindings: {
        tipoDoc: '=',
        setItemArticuloEnDetalle: '&',
        idBodega: '=',

        validatarStock: "=",
        onSelect: "&",
        items: "=",
        fechaEmision: "="
    },
    controller: inputSearchArticuloCtrl

})