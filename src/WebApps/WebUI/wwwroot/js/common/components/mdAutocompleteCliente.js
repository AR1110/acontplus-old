class MdAutocompleteClienteComponent{
    static $inject = ['$scope','commonService', 'modalService', 'nombreModal', 'nombreModalVenta']
    constructor($scope, _commonSvc, _modalSvc, _nombreModal, nombreModalVenta){
        this.$scope = $scope;
        this._commonSvc = _commonSvc;
        this._modalSvc  = _modalSvc;
        this._nombreModal = _nombreModal;       
        this.nombreModalVenta = nombreModalVenta;       
        this.search = {
            isDisabled: false,
            noCache: false,
            selectedItem: null,

        }
    }

    $onInit(){    
        
        this.search.showBtnNew = this.searchOptions.showBtnNew;
        this.search.showBtnList = this.searchOptions.showBtnList;
        this.search.isDisabled  = this.searchOptions.isDisabled;
        this.search.showBtnEdit = this.searchOptions.showBtnEdit;
      
        if(this.clienteDataParam && this.clienteDataParam.idCliente>0){
            this.dataCliente = this.clienteDataParam;
          
            this.searchText        = this.dataCliente.nombreFiscal
            this.search.searchText = this.dataCliente.nombreFiscal;            
            this.idCliente = this.dataCliente.idCliente;
        }
    }

    $onChanges(changesObj){
        
    }

    getDynamicSearchCliente(searchText){
        if(searchText===null || searchText === undefined || searchText===""){
            this.search.showBtnEdit = false;
            return
        } 
        return this._commonSvc.clienteSearch(searchText);        
    }

    searchTextChange(textSearch){
        
        if(textSearch===null || textSearch==="" || textSearch === undefined){
            this.dataCliente = null;
            this.idCliente = 0;
            this.search.showBtnEdit = false;            
        }
    }

    async selectedItemChange(item){
        try {            
            if(item===null || item ==undefined) return 
            showLoader();
            this.dataCliente = await this._commonSvc.getDataCliente(item.idCliente);
            
            this.searchText=  this.dataCliente.nombreComercial;
            this.search.searchText = this.dataCliente.nombreComercial;
            this.search.showBtnEdit = true;
            this.idCliente = this.dataCliente.idCliente;
            this.selectedItemCliente({
                 item: this.dataCliente
            })
            this.$scope.$apply();
        } catch (error) {
            console.error(error)
        }finally{
            hideLoader();
        }        
    }

    resultModalCliente(result) {
        if(typeof result==='object'){
            this.selectedItemChange(result)
        }
    }


}



app.component("mdAutocompleteClienteComponent",{
    templateUrl:'/Cliente/MdAutocomplete',
    bindings:{
        selectedItemCliente:'&',
        editData:"<",
    },
    controller: MdAutocompleteClienteComponent
})


app.component("mdAutocompleteCliente",{
    template:`
                <md-autocomplete
                    ng-disabled="$ctrl.search.isDisabled"
                    md-no-cache="$ctrl.search.noCache"
                    md-selected-item="$ctrl.search.selectedItem"
                    md-search-text-change="$ctrl.searchTextChange($ctrl.searchText)"
                    md-search-text="$ctrl.search.searchText"
                    md-selected-item-change="$ctrl.selectedItemChange(item)"
                    md-items="item in $ctrl.getDynamicSearchCliente($ctrl.search.searchText)"
                    md-item-text="item.nombreFiscal"
                    md-min-length="1"
                    placeholder="Ej. Emilio Senguana"
                    md-escape-options="clear"
                    md-require-match=""
                    md-clear-button="false"
                    md-floating-label="Cliente"
                    md-autofocus md-autoselect
                    input-aria-labelledby="Cliente">
                    <md-item-template>
                        <span md-highlight-text="$ctrl.search.searchText">{{item.nombreFiscal}}</span>
                    </md-item-template>                        
                    <a ng-if="$ctrl.search.showBtnList" class="btn btn-warning btn-sm mt-1" href="javascript:void(0)" btn-cliente-lista result-modal="$ctrl.resultModalCliente(result)"><i class="mdi mdi-account-search"></i> Lista</a>
                    <a ng-if="$ctrl.search.showBtnNew" class="btn btn-info btn-sm mt-1" href="javascript:void(0)" btn-cliente result-modal="$ctrl.resultModalCliente(result)"><i class="mdi mdi-plus"></i> Nuevo</a>
                    <a ng-if="$ctrl.search.showBtnEdit" class="btn btn-success btn-sm mt-1" href="javascript:void(0)" btn-cliente result-modal="$ctrl.resultModalCliente(result)" params="$ctrl.dataCliente"><i class="mdi mdi-pencil"></i> Editar</a>
                </md-autocomplete>   
                `,
    bindings:{
        selectedItemCliente:'&',
        editData:"<",
        clienteDataParam:'<',
        searchOptions:'<'
    },
    controller: MdAutocompleteClienteComponent
})

app.component("mdAutocompleteClienteCustom",{
    template:`
                <md-autocomplete
                    ng-disabled="$ctrl.search.isDisabled"
                    md-no-cache="$ctrl.search.noCache"
                    md-selected-item="$ctrl.search.selectedItem"
                    md-search-text-change="$ctrl.searchTextChange($ctrl.search.searchText)"
                    md-search-text="$ctrl.search.searchText"
                    md-selected-item-change="$ctrl.selectedItemChange(item)"
                    md-items="item in $ctrl.getDynamicSearchCliente($ctrl.search.searchText)"
                    md-item-text="item.nombreFiscal"
                    md-min-length="1"
                    placeholder="Ej. Emilio Senguana"
                    md-escape-options="clear"                    
                    md-clear-button="false"                    
                    md-autofocus md-autoselect                    
                    input-aria-labelledby="Cliente">
                    <md-item-template>
                        <span md-highlight-text="$ctrl.search.searchText">{{item.nombreFiscal}}</span>
                    </md-item-template>                        
                    </md-autocomplete>   
                    <a  class="btn btn-warning btn-xs mt-1" href="javascript:void(0)" btn-cliente-lista result-modal="$ctrl.resultModalCliente(result)">
                        <i class="mdi mdi-account-search"></i>Lista
                    </a>
                    <a ng-if="$ctrl.search.showBtnNew" class="btn btn-info btn-xs mt-1" href="javascript:void(0)" btn-cliente result-modal="$ctrl.resultModalCliente(result)">
                        <i class="mdi mdi-plus"></i> Nuevo
                    </a>
                    <a ng-if="$ctrl.search.showBtnEdit" class="btn btn-success btn-xs mt-1" href="javascript:void(0)" btn-cliente result-modal="$ctrl.resultModalCliente(result)" params="$ctrl.dataCliente">
                        <i class="mdi mdi-pencil"></i> Editar
                    </a>
                `,
    bindings:{
        selectedItemCliente:'&',
        editData:"<",
    },
    controller: MdAutocompleteClienteComponent
})


app.component('searchClienteCustom', {

    template: `<div class="input-group"> 
                <input   type="text" 
                    id="clienteSearchCustom"                 
                    autocomplete="off"
                    name="clienteSearchCustom"
                    class="form-control border-select"
                    placeholder="Ingrese C.I o Nombre Fiscal"
                    ng-model="$ctrl.search.searchText"            
                    ng-keyup="$ctrl.searchTextChange($ctrl.search.searchText)"
                    uib-typeahead="item as item.nombreFiscal for item in $ctrl.getDynamicSearchCliente($viewValue)"
                    typeahead-loading="$ctrl.clienteSearch.loading"
                    typeahead-no-results="$ctrl.clienteSearch.noResults"
                    typeahead-template-url="autocompleteClienteTemplate.html"
                    typeahead-min-length="1"
                    typeahead-editable="false"
                    typeahead-on-select="$ctrl.selectedItemChange($item)" onClick="select();"  /> 

                    <script type="text/ng-template" id="autocompleteClienteTemplate.html">
                        <div class="autocomplete-suggestion-uib-typeahead">
                            <span class="item-title">
                                <b> {{match.model.numeroIdentificacion}}</b> - {{match.model.nombreFiscal}}
                            </span>
                        </div>
                    </script>  

                    <div class="input-group-append" ng-if="$ctrl.search.showBtnNew">
                        <button type="button" type="button" class="btn btn-outline-secondary btn-sm" btn-cliente result-modal="$ctrl.resultModalCliente(result)"  id="btnNewCustomerDocument">
                                <i class="fa fa-plus fa-xs"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-sm" ng-if="$ctrl.search.showBtnEdit && $ctrl.dataCliente.idCliente>0" btn-cliente result-modal="$ctrl.resultModalCliente(result)" params="$ctrl.dataCliente"
                                tabindex="-1"> <i class="fas fa-pencil-alt fa-xs"></i>
                        </button>                         
                        <button type="button" class="btn btn-outline-secondary btn-sm" ng-if="$ctrl.search.showBtnList"  btn-cliente-lista result-modal="$ctrl.resultModalCliente(result)"
                                tabindex="-1"> <i class="fa fa-search fa-xs"></i>
                        </button>   
                        
                        <button type="button" cliente-info-popover customer="$ctrl.dataCliente" popover-placement='top'
                            class="btn btn-outline-secondary btn-xs" ng-if="$ctrl.dataCliente.idCliente>0" tabindex="-1"><i
                                class="fa fa-info fa-xs"></i>
                        </button>
                    </div>`,
    bindings:{
        selectedItemCliente:'&',
        editData:"<",
        clienteDataParam:'<',
        searchOptions:'<'
    },
    controller: MdAutocompleteClienteComponent

})






//Buscador simple para filtros 

class MdAutocompleteSimpleCliente{
    static $inject = ['commonService']
    constructor(_commonSvc){
        this._commonSvc = _commonSvc;
    }


    getDynamicSearchCliente(searchText){
        if(searchText===null || searchText === undefined) return
        return this._commonSvc.clienteSearch(searchText);        
    }

    selectedItemChange(item){
        try {            
            showLoader();
            if(item===null || item ==undefined) return 
            this.selectedItemClienteSimple({
                item
            });           
        } catch (error) {
            console.error(error)
        }finally{
            hideLoader();
        }        
    }
}


app.component("mdAutocompleteSimpleCliente",{
    template:`
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
            </md-autocomplete>
            `,
    bindings:{
        selectedItemClienteSimple:'&',        
    },
    controller: MdAutocompleteSimpleCliente
})