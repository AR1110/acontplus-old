class BaseSearchArticulo {
    constructor({
        _mS,
        $rootScope,
        $scope,
        $timeout,
        $q,
        _commonSvc,
        _modalSvc,
        _nombreModalConst,
        tS
    }) {
        this._mS = _mS;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$q = $q;
        this._commonSvc = _commonSvc;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this.tS = tS;
    }


    // $scope.gridApi.grid.cellNav.clearFocus();
    focusDescripcionArticulo(id) {
        this.$timeout(() => {
            this.focusMe(id);
        });
    }

    focusMe(id) {
        this.$timeout(() => {
            let element = document.querySelector(id);
            if (element) element.focus();
        });

    }


    getDataArticuloByEnterCode() {
        try {

            if (!this.searchText) {
                this.searchText = null;
                return
            }

            if(this.searchText.length < 3) return

            /**
             * return object {idArticulo: 0}
             */
            showLoader();
            this.articuloSvc.findByEnterCode({textSearch: this.searchText, isSearchByCode: true}).then(response=>{
                hideLoader();
                this.selectArticleSearch(response)
                this.searchText = null                
            }).catch(error => {  
                hideLoader();           
                console.log(error);
            })
        } catch (error) {
            console.log(error)
        }
    }

    selectArticleSearch(item) {

        if (typeof item === 'object' && item.hasOwnProperty('showHeader')) {
            this.searchText = null
            return
        }
        if (!item || !item.hasOwnProperty('idArticulo')) return

        this.dataArticulo = {
            idArticulo: item.idArticulo, 
            llevaInventario: item.llevaInventario
        }
        this.selectedItem = null

        this.validarGetDataArticulo();
    }


    validarGetDataArticulo() {
        if (['FV', 'NE', 'PR', 'NC'].includes(this.tipoDoc.codigo)) {
            this.getDataArticuloParaVenta()
        }

        if (['FC', 'IB', 'LC', 'NCP', 'OC', 'TRA', 'GR'].includes(this.tipoDoc.codigo)) {
            this.getDataArticuloParaCompra();
        }
         if (['CIV'].includes(this.tipoDoc.codigo)) {
             this.getId()
         }
    }


    getDataArticuloParaVenta() {
        try {
            
            showLoader();
            this.dataArticulo.idBodega = this.idBodega;
            this.dataArticulo.tipo = 6;

            /**
             * return object {articulo, medidas, datosAdicionales}
             */
            this.articuloSvc.findForSale(this.dataArticulo).then(async dataArticuloApi => {

                //Cuando el articulo no lleva inventario 
                if(!dataArticuloApi.articulo.llevaInventario) {
                    hideLoader();
                    this.setItemArticuloEnDetalle({
                        item: dataArticuloApi
                    })
                    return
                }
                //Agregando validacion nueva el idMedida 07/10/2023 por emilio 
                this.articuloSvc.checkNotificationStock({
                    idArticulo: this.dataArticulo.idArticulo,
                    cantidad: 1,
                    idBodega: this.dataArticulo.idBodega,
                    idMedida: dataArticuloApi.medidas[0].idMedida
                }).then(async responseApi=>{
                    hideLoader();
                    
                    let {code, message, titleSms} = responseApi; 
                  
                    if (code === "1") { 
                        this.setItemArticuloEnDetalle({
                            item: dataArticuloApi
                        })
                        return 
                    }
                    
                    let {isConfirmed} = await Swal.fire({
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
                            this.setItemArticuloEnDetalle({
                                item: dataArticuloApi
                            })
                        }
                    }


                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })
                //hideLoader();
                // this.setItemArticuloEnDetalle({
                //     item: result
                // })
                // hideLoader();               
                
            }).catch(error => {
                hideLoader();
                console.log(error);
            })        
        } catch (error) {
            hideLoader();
            console.log(error)            
        }
    }

    async getDataArticuloParaCompra() {
        try {

            showLoader();
            this.dataArticulo.idBodega = this.idBodega;
            this.articuloSvc.findForPurchase(this.dataArticulo).then(response =>{
                hideLoader();
                this.setItemArticuloEnDetalle({
                    item: response
                })
            }).catch(error=>{
                hideLoader();
                console.log(error);
            })
           
        } catch (error) {
            console.error(error)
        }
    }

     async getId() {
         try {
             showLoader();
             this.dataArticulo.idBodega = this.idBodega;
             this.articuloSvc.getId(this.dataArticulo.idArticulo).then(response => {
                 hideLoader();
                 this.setItemArticuloEnDetalle({
                     item: response
                 })
             }).catch(error => {
                 hideLoader();
                 console.log(error);
             })
         } catch (e) {
             console.log(e)
         }
     }

}


//Buscador de articulo general con pvp contado 
class MdArticuloCtrl extends BaseSearchArticulo {

    static $inject = ['articuloService', 'mainService', '$rootScope', '$scope', '$timeout', '$q', 'commonService', 'modalService', 'nombreModal', 'nombreModalInventario', 'toastService']
    constructor(articuloSvc, _mS, $rootScope, $scope, $timeout, $q, _commonSvc, _modalSvc, _nombreModalConst, nombreModalInventario, tS) {
        super({
            _mS,
            $rootScope,
            $scope,
            $timeout,
            $q,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            tS
        })

        this.articuloSvc = articuloSvc;
        this.placeholder = this.placeholder || "Buscar articulo"

        this.nombreModalInventario = nombreModalInventario;

        this.mdNoCache = false;
        this.dataSearch = {
            tipo: 1,
            bySearch: '',
            pageIndex: 1,
            pageSize: 20
        }

        this.$scope.$on("editArticulo", (e, itemArticulo) => {
            this.openModalArticulo(itemArticulo)
        })


        setTimeout(() => {
            $("#custom-template-md-autocomplete-articulo").on('keyup', e => {
                let keyCode = e.keyCode || e.which;
                if (!this.searchText && keyCode === 13) {
                    $("#clienteSearchInvoice").focus();
                }
            })
        }, 500)

    }


    $onInit() {
        this._mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response => {

            let mainData = JSON.parse(response.payload);
            let articulo = mainData[6];


            this.$rootScope.articlePermission = mainData[10][0];

            if (this.isDefaultArticle && articulo.length > 0) {
                this.searchTextSimple = articulo[0].descripcion;
                this.selectArticleSearch(articulo[0])
            }
        })

    }

    getDynamicSearchArticles() {

        let json = {
            busqueda: this._commonSvc.removeAccents(this.searchText),
            condicion: false,
            fraccionado: false,
        }

        if (json.busqueda.length < 3) return [];

        return this.articuloSvc.search(json).then(articulos=>{
            if (articulos.length > 0) {
                articulos.unshift({
                    showHeader: true,
                    priceSale: articulos[0].priceSales,
                    warehouses: articulos[0].warehouses

                })
                
                articulos = articulos.map(item => {
                    if (!item.hasOwnProperty('showHeader')) {
                        item.priceSale = item.priceSales;
                        item.warehouses = item.warehouses;
                    }
                    return item;
                })
                return articulos;
            }
        }).catch(error=>{
            hideLoader();
            console.log(error)
            return [];
        })
    }

    async getDynamicSearchArticlesSimple(textSearch) {
        let results = await this._commonSvc.articuloSearchGeneral({
            textSearch,
            condicion: false
        })


        let deferred = this.$q.defer();
        deferred.resolve(results);
        return deferred.promise;

    }




    async openModalArticulo(item) {
        try {          
            let fileCtrl = this.nombreModalInventario.ARTICULO.fileCtrl;  
            
            let ctrl = this.nombreModalInventario.ARTICULO.controllers['M'];
            let template = this.nombreModalInventario.ARTICULO.templates['M'];
            let controller = (await import(fileCtrl))[ctrl];
            
            const modalRef = this._modalSvc.openModalCustom({
                controller,
                template,
                size: 'xl',
                params: item
            })
    
            modalRef.result.then(response => {
                if (typeof response !== 'object') return
                this.dataArticulo = {
                    idArticulo: response.idArticulo,
                    idPresentacion: response.idPresentacion,
                    presentacion: 'A'
                }
                //Funcion pasada como referencia desde el controlador                 
                this.validarGetDataArticulo();
            })
        } catch (error) {
            console.log(error);
        }
       
    }

    
    async openModalArticuloGeneral(item) {
        try {
            const {fileCtrl, controllers, templates} = this.nombreModalInventario.ARTICULO;
            let ctrl = (await import(fileCtrl))[controllers['LG']];
            let template = templates['LG'];
            let modalRef = this._modalSvc.openModalCustom({
                controller: ctrl,
                template,
                size: 'xl',
                params: item,
                windowClass: 'uibModalFullScreen'
            })
    
            modalRef.result.then(response => {
                if (typeof response !== 'object') return
                this.dataArticulo = {
                    idArticulo: response.idArticulo,
                    idPresentacion: response.idPresentacion,
                    presentacion: 'A'
                }
                //Funcion pasada como referencia desde el controlador                 
                this.validarGetDataArticulo();
            })
        } catch (error) {
            console.log(error)
        }
        
    }


    
    async openModalArticuloFraccionadoInfo(item) {
        try {
            const {fileCtrl, controllers, templates} = this.nombreModalInventario.ARTICULO;
            let ctrl = (await import(fileCtrl))[controllers['AFI']];
            let template = templates['AFI'];
            let modalRef = this._modalSvc.openModalCustom({
                controller: ctrl,
                template,
                size: 'md',
                params: item,
                windowClass: 'zindex'
            })
    
            
        } catch (error) {
            console.log(error)
        }
    }
}


//Buscador Articulo 
class InputSearchBarcodeCtrl extends BaseSearchArticulo {
    static $inject = ['mainService', 'articuloService', '$scope', '$timeout', '$q', 'commonService', 'modalService', 'nombreModal', 'toastService']
    constructor(_mS, articuloSvc, $scope, $timeout, $q, _commonSvc, _modalSvc, _nombreModalConst, tS) {
        super({
            _mS,
            $scope,
            $timeout,
            $q,
            _commonSvc,
            _modalSvc,
            _nombreModalConst,
            tS
        })

        this.articuloSvc = articuloSvc;




    }

    $onInit() {

        setTimeout(() => {

            $("#inputBarcode").on('keyup', e => {
                var keyCode = e.keyCode || e.which;

                if (!this.searchText && keyCode === 13) {
                    $("#clienteSearchInvoice").focus();
                }
            })

        }, 500)
    }
}


app.component('mdAutocompleteArticuloComponent', {
    templateUrl: '/Articulo/MdAutocomplete',
    //controllerAs: '$ctrl',
    bindings: {
        tipoDoc: '=',
        placeholder: '=',
        // abrirModalArticulo: '&',
        // getDataArticulo:'&',
        setItemArticuloEnDetalle: '&',
        isDefaultArticle: '=?',
        idBodega: '='
    },
    controller: MdArticuloCtrl
});


app.component("articuloSearchBarcode", {
    template: `<input  type="text" autocomplete="off"
                       class="form-control border-select" 
                       ng-model="$ctrl.searchText"  
                       ng-enter="$ctrl.getDataArticuloByEnterCode()"     
                       id="inputBarcode" 
                       ng-focus="$ctrl.focusDescripcionArticulo('#inputBarcode')" 
                       placeholder="Ej: COMP1"> 
                `,
    bindings: {
        tipoDoc: '=',
        setItemArticuloEnDetalle: '&',
        idBodega: '='
    },
    controller: InputSearchBarcodeCtrl

})


app.component("mdAutocompleteArticuloSimple", {
    template: `<md-autocomplete
                ng-disabled="$ctrl.isDisabled"
                md-no-cache="$ctrl.noCache"
                md-selected-item="$ctrl.selectedItemSimple"
                md-search-text-change="$ctrl.searchTextChange($ctrl.searchTextSimple)"
                md-search-text="$ctrl.searchTextSimple"
                md-selected-item-change="$ctrl.selectArticleSearch(item)"
                md-items="item in $ctrl.getDynamicSearchArticlesSimple($ctrl.searchTextSimple)"
                md-item-text="item.descripcion"
                md-min-length="3"
                placeholder="Ej: Mouse..."
                md-floating-label="Artículo"
                input-aria-labelledby="Articulos">
            <md-item-template>
                <span class="small" md-highlight-text="$ctrl.searchTextSimple" md-highlight-flags="^i">{{item.descripcion}}</span>
            </md-item-template>           
            </md-autocomplete>`,
    bindings: {
        tipoDoc: '=',
        abrirModalArticulo: '&',
        getDataArticulo: '&',
        setItemArticuloEnDetalle: '&',
        scopeParent: '=?'
    },
    controller: MdArticuloCtrl
})