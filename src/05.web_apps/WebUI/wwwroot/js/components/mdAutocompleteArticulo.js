class MdArticuloCtrl{
    
    static $inject = ['$http', 'mainService', '$scope','$timeout', '$q', 'commonService', 'modalService', 'nombreModal']
    constructor($http, _mS, $scope, $timeout, $q, _commonSvc, _modalSvc, _nombreModalConst){
        //this.self = this;
        this.$http             = $http;
        this._mS               = _mS;
        this.$scope            = $scope;   
        this.$timeout          = $timeout; 
        this.$q                = $q;
        this._commonSvc        = _commonSvc;     
        this._modalSvc         = _modalSvc;  
        this._nombreModalConst = _nombreModalConst;   
        
        this.dataSearch = {
            tipo: 1,
            bySearch : '',
            pageIndex: 1,
            pageSize: 20
        }
        
        this.$scope.$on("editArticulo", (e, itemArticulo)=>{
            this.openModalArticulo(itemArticulo)
        })      
    }

    $onInit(){
        
        if(this.isDefaultArticle){
            this._mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
                let articulo = JSON.parse(response.payload)[6]                
                if(articulo.length>0){
                    this.searchTextSimple = articulo[0].descripcion;
                    this.selectArticleSearch(articulo[0]) 
                }
            })
        }
    }

    $onChanges(){
       
    }


    // $scope.gridApi.grid.cellNav.clearFocus();
    focusDescripcionArticulo(id) {        
        this.$timeout( ()=> {
            this.focusMe(id);
        });
    }
    
    focusMe(id){
        this.$timeout(() => {            
            let element = document.querySelector(id);
            if (element) element.focus();
        });

    }
    
    async getDynamicSearchArticles(textSearch){  
        
        let results = await this._commonSvc.articuloSearchGeneral({
            textSearch,
            condicion: false
        })
        
        if(results.length>0){
            results.unshift({
                showHeader: true,
                priceSale: JSON.parse(results[0].priceSale),
                warehouses: JSON.parse(results[0].warehouses)

            })
            results = results.map(item=>{
                if(!item.hasOwnProperty('showHeader')){
                    item.priceSale = JSON.parse(item.priceSale)
                    item.warehouses = JSON.parse(item.warehouses)
                } 
                return item;
            })
        }
        
        return results
        // let deferred = this.$q.defer();
        // this.$timeout(()=> { 
        //     deferred.resolve(results); 
        // }, Math.random() * 1000, false);
        // return deferred.promise;              
       
    }

    async getDynamicSearchArticlesSimple(textSearch){  
        let results = await this._commonSvc.articuloSearchGeneral({
            textSearch,
            condicion: false
        })
        
       
        let deferred = this.$q.defer();
        this.$timeout(()=> { 
            deferred.resolve(results); 
        }, Math.random() * 1000, false);
        return deferred.promise;              
       
    }

    

    async getArticuloByCode(){
        try {
            if(this.searchText===null || this.searchText===undefined || this.searchText==='') return
            let result = await this._commonSvc.articuloSearchGeneral({
                textSearch: this.searchText,
                condicion: true
            }) 

            if(result===null || result ===undefined || (Array.isArray(result) && result.length===0)) return  
            
            //Tomamos  posicion 1 para obtener datos del articulo                  
            this.selectArticleSearch(result[0])
            this.searchText = '';
        } catch (error) {
            console.error(error)
        }
    }

    selectArticleSearch (item){  
      
        if(typeof item==='object' && item.hasOwnProperty('showHeader')){
            this.searchText = '';
            return
        }
        if(item===null || item===undefined || !item.hasOwnProperty('idArticulo') )return
        
        this.dataArticulo = {
            idArticulo: item.idArticulo,
            idPresentacion: item.idPresentacion,
            presentacion: 'A'
        }  
        this.selectedItem = '';
             
        this.validarGetDataArticulo();
    }
    
    async openModalArticulo(item){             
        const { MODAL_CTRL,  MODAL_NUEVO_CSHTML} = this._nombreModalConst.articulo;
        const { ModalArticuloCtrl } = await import('./../modal/' + MODAL_CTRL);
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalArticuloCtrl,
            template: 'Articulo/' + MODAL_NUEVO_CSHTML,
            size:'xl',
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
    }

    async openModalArticuloGeneral(item){      
        let { MODAL_CTRL,  MODAL_GENERAL_CSHTML} = this._nombreModalConst.articulo;
        let { ModalArticuloGeneralCtrl } = await import('./../modal/' + MODAL_CTRL);        
        let modalRef = this._modalSvc.openModalCustom({
            controller: ModalArticuloGeneralCtrl,
            template: 'Articulo/' + MODAL_GENERAL_CSHTML,
            size:'xl',
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
    }

    validarGetDataArticulo(){
        if(['FV', 'NE','PR', 'NC'].includes(this.tipoDoc.codigo)){
            this.getDataArticuloParaVenta()
        }

        if(['FC', 'IB', 'LC', 'NCP','OC', 'CIV', 'TRA', 'GR'].includes(this.tipoDoc.codigo)){
            this.getDataArticuloParaCompra();
        }
    }


    async getDataArticuloParaVenta(){
        try {

            let results = await this._commonSvc.getDataArticuloParaVenta({json: this.dataArticulo}).then(response=>{
                if(response.code==='0'){
                    throw response;
                }
                return JSON.parse(response.payload)
            });
            
            let responseMsg = results[0][0];     
            let sharedData = {
                articulo: results[0][0],
                medidas: results[1],
                datosAdicionales:  results[2]
            }    
            
            if (responseMsg.code === "1") {
                this.setItemArticuloEnDetalle({
                    item: sharedData
                })
                return
            } 
           
            let {isConfirmed} = await Swal.fire({
                title: `<small>${responseMsg.titleSms}</small>`,
                icon: 'warning',
                html: `<small>${responseMsg.message}</small>`,  
                allowOutsideClick:false,
                allowEscapeKey:false,                                      
            })

            if(isConfirmed){
                if (responseMsg.code === "0") {
                    $("#custom-template-md-autocomplete-articulo").focus();                        
                }
                if (responseMsg.code === "2") {
                    this.setItemArticuloEnDetalle({
                        item: sharedData
                    })                                                        
                }
            }
                
        } catch (error) {
            console.log(error)
        }
    }

    async getDataArticuloParaCompra(){
        try {
            let results = await this._commonSvc.getDataArticuloParaCompra({
                json: this.dataArticulo
            }).then(response=>JSON.parse(response.payload));

            let responseMsg = results[0][0];  

            let sharedData = {
                articulo: results[0][0],
                medidas: results[1],
                etiquetas:  results[2]
            }    
            // console.log(responseMsg)
            // if (responseMsg.code === "1") {
                this.setItemArticuloEnDetalle({
                    item: sharedData
                })
            //}
        } catch (error) {
            console.error(error)
        }
    }

    async showDetailTarifa(item){
        let {MODAL_CTRL, MODAL_DETALLE_CSHTML} = this._nombreModalConst.articulo;
        let {ModalArticuloDetalleCtrl} = await import('./../modal/' + MODAL_CTRL);
        let _modalRef = this._modalSvc.openModalCustom({
            controller: ModalArticuloDetalleCtrl,
            template: MODAL_DETALLE_CSHTML,
            size:'lg',
            windowClass: 'zindex',
            params: item,
            keyboard:true
        })
    }

    
}

app.component('mdAutocompleteArticuloComponent',{
    templateUrl: '/Articulo/MdAutocomplete',
    //controllerAs: '$ctrl',
    bindings: { 
        tipoDoc: '=',
        // abrirModalArticulo: '&',
        // getDataArticulo:'&',
        setItemArticuloEnDetalle:'&',
        isDefaultArticle:'=?'
    },
    controller: MdArticuloCtrl
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
        getDataArticulo:'&',
        setItemArticuloEnDetalle:'&',
        scopeParent:'=?'
    },
    controller: MdArticuloCtrl
})
