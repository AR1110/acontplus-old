class MdAutocompleteProveedor {
    static $inject = ['commonService', 'modalService', 'nombreModalCompra', 'proveedorService']
    constructor(commonSvc, modalSvc, nombreModalCompra, proveedorSvc) {
        this.commonSvc = commonSvc;
        this.modalSvc = modalSvc;
        this.nombreModalCompra = nombreModalCompra;
        this.proveedorSvc = proveedorSvc;
        this.search = this.search || {};
    }

    $onInit() {

        // this.proveedorData = this.proveedorData || {};        
        // console.log(this.proveedorData)
        if (typeof this.proveedorData === 'object' && this.proveedorData.idProveedor > 0) {
            this.dataProveedor = Object.assign({}, this.proveedorData)
            this.searchText = this.dataProveedor.nombreFiscal;
            this.idProveedor = this.proveedorData.idProveedor;
        }
        // console.log(this.search)
        // console.log(this.proveedorData)
        //Accion proveedor actualizar
        //  this.search.showBtnNew = this.editData.showBtnNew;
        //  this.search.showBtnList = this.editData.showBtnList;
        //  this.search.isDisabled  = this.editData.isDisabled;
        //  this.search.showBtnEdit = this.editData.showBtnEdit;


    }


    getDynamicSearchProveedor(searchText) {
        if (searchText === null || searchText === undefined) return
        return this.proveedorSvc.search(searchText);
    }

    async selectedItemChange(item) {
        try {
            if (item === null || item == undefined) return
            showLoader();
            this.dataProveedor = await this.proveedorSvc.getId(item.idProveedor).finally(()=>hideLoader())
    
            this.searchText = this.dataProveedor.nombreFiscal;
            this.idProveedor = this.dataProveedor.idProveedor;
            this.selectedItemProveedor({
                item: this.dataProveedor
            })
        } catch (error) {
            hideLoader()
            console.error(error)
        }  
    }

    searchTextChange(item) {
        if (item === "" || item === null || item === undefined) {
            this.idProveedor = null;
            this.selectedItemProveedor({
                item: {}
            })
        }
    }

    resultModal(result) {
        if (typeof result === 'object') {
            this.selectedItemChange(result)
        }
    }



}



app.component("mdAutocompleteProveedor", {
    template: `
                    <md-autocomplete
                        ng-disabled="$ctrl.search.isDisabled"
                        md-no-cache="$ctrl.search.noCache"
                        md-selected-item="$ctrl.search.selectedItem"
                        md-search-text-change="$ctrl.searchTextChange($ctrl.searchText)"
                        md-search-text="$ctrl.searchText"
                        md-selected-item-change="$ctrl.selectedItemChange(item)"
                        md-items="item in $ctrl.getDynamicSearchProveedor($ctrl.searchText)"
                        md-item-text="item.nombreFiscal"
                        md-min-length="1"
                        placeholder="Ej. Emilio Senguana"
                        md-escape-options="clear"
                        md-require-match=""
                        md-clear-button="false"
                        md-floating-label="Proveedor"
                        md-autofocus md-autoselect
                        input-aria-labelledby="Proveedores">
                        <md-item-template>
                            <span md-highlight-text="ctrl.searchText">{{item.nombreFiscal}}</span>
                        </md-item-template>   

                        <a ng-if="$ctrl.search.showBtnList" 
                        class="btn btn-warning btn-sm mt-1" 
                        href="javascript:void(0)" 
                       btn-proveedor-lista result-modal="$ctrl.resultModal(result)" >
                        <i class="mdi mdi-account-search"></i> Lista</a>

                        <a ng-if="$ctrl.search.showBtnNew" 
                        class="btn btn-info btn-sm mt-1" 
                        href="javascript:void(0)" 
                        btn-proveedor-add-update result-modal="$ctrl.resultModal(result)" ><i class="mdi mdi-plus"></i> Nuevo</a>

                        <a class="btn btn-success btn-sm mt-1" 
                        ng-if="$ctrl.search.showBtnEdit && $ctrl.idProveedor>0" href="javascript:void(0)" 
                        btn-proveedor-add-update result-modal="$ctrl.resultModal(result)" params="$ctrl.dataProveedor"><i class="mdi mdi-pencil"></i> Editar</a>

                    </md-autocomplete>   
                   `,
    bindings: {
        selectedItemProveedor: '&',
        editData: "<",
        search: "<"
    },
    controller: MdAutocompleteProveedor
})

app.component('uibModalProveedorSearch', {
    template: ` <div class="input-group"> 
                    <input   type="text" 
                        id="proveedorAutocomplete"                 
                        autocomplete="off"
                        name="proveedorAutocomplete"
                        class="form-control border-select"
                        placeholder="Ingrese C.I o Nombre Fiscal"
                        typeahead-wait-ms="10"                        
                        ng-model="$ctrl.searchText"
                        ng-keyup="$ctrl.onKeyupSearchProveedor()"
                        uib-typeahead="item as item.nombreFiscal for item in $ctrl.getDynamicSearchProveedor($viewValue)"
                        typeahead-loading="$ctrl.search.loadingSearch"
                        typeahead-no-results="$ctrl.search.noResults"
                        typeahead-template-url="autocompleteProveedor.html"
                        typeahead-editable="false"
                        typeahead-on-select="$ctrl.selectedItemChange($item)" /> 

                        <script type="text/ng-template" id="autocompleteProveedor.html">
                            <div class="autocomplete-suggestion-uib-typeahead">
                                <span class="item-title">
                                    <b> {{match.model.numeroIdentificacion}}</b> - {{match.model.nombreFiscal}}
                                </span>
                            </div>
                        </script>  

                    <div class="input-group-append" ng-if="$ctrl.search.showBtnNew">
                        <button type="button" type="button" class="btn btn-outline-secondary btn-sm"  
                         btn-proveedor-add-update result-modal="$ctrl.resultModal(result)"      
                         tabindex="-1">
                                <i class="fa fa-plus fa-xs"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-sm" 
                        ng-if="$ctrl.search.showBtnEdit && $ctrl.idProveedor>0" 
                         btn-proveedor-add-update result-modal="$ctrl.resultModal(result)" params="$ctrl.dataProveedor"
                                tabindex="-1"> <i class="fas fa-pencil-alt fa-xs"></i>
                        </button>                         
                        <button type="button" 
                        class="btn btn-outline-secondary btn-sm" 
                        ng-if="$ctrl.search.showBtnList"  
                        btn-proveedor-lista result-modal="$ctrl.resultModal(result)" 
                                tabindex="-1"> <i class="fa fa-search fa-xs"></i>
                        </button>                                                                                               
                    </div>  
                   `,
    bindings: {
        selectedItemProveedor: '&',
        editData: "<",
        search: "<",
        proveedorData: "=" // Se agregó en Modal Editar Proveedor
    },
    controller: MdAutocompleteProveedor
})




//Buscador simple para filtros 

class MdAutocompleteSimpleProveedor {
    static $inject = ['commonService']
    constructor(commonSvc) {
        this.commonSvc = commonSvc;
    }


    getDynamicSearchCliente(searchText) {
        if (searchText === null || searchText === undefined) return
        return commonSvc.clienteSearch(searchText);
    }

    selectedItemChange(item) {
        try {
            showLoader();
            if (item === null || item == undefined) return
            this.selectedItemClienteSimple({
                item
            });
        } catch (error) {
            console.error(error)
        } finally {
            hideLoader();
        }
    }
}


app.component("mdAutocompleteSimpleProveedor", {
    template: `
            <md-autocomplete
                ng-disabled="$ctrl.search.isDisabled"
                md-no-cache="$ctrl.search.noCache"
                md-selected-item="$ctrl.search.selectedItem"
                md-search-text-change="$ctrl.searchTextChange($ctrl.searchText)"
                md-search-text="$ctrl.searchText"
                md-selected-item-change="$ctrl.selectedItemChange(item)"
                md-items="item in $ctrl.getDynamicSearchCliente($ctrl.searchText)"
                md-item-text="item.nombreComercial"
                md-min-length="1"
                placeholder="Ej. Emilio Senguana"
                md-escape-options="clear"
                md-require-match=""
                md-clear-button="false"
                input-aria-labelledby="Clientes">
                <md-item-template>
                    <span md-highlight-text="ctrl.searchText">{{item.nombreFiscal}}</span>
                </md-item-template>
                <md-not-found>
                    No se encontraron los resultados          
                    <a ng-click="$ctrl.openModal($ctrl.searchText)">Crear Nuevo!</a>
                </md-not-found>
            </md-autocomplete>
            `,
    bindings: {
        selectedItemProveedorSimple: '&',
    },
    controller: MdAutocompleteSimpleProveedor
})