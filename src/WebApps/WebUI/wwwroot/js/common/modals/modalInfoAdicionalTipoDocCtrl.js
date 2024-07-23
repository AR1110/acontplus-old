
export class InfoAdicionalTipoDocCtrl{
    static $inject = ['$uibModalInstance', 'params'];
    constructor($uibModalInstance, _params){
        this.$uibModalInstance = $uibModalInstance;
        this._params           = _params;

        this.gridOptions = {
            enableColumnMenus: false,
            enableColumnReordering: true,
            columnDefs: this.columnDefsInfoAdicional(!this._params.isView),
            showGridFooter: false,           
        }
        this.gridOptions.data = this._params.infoAdicionalDocumento || [];
        this.setEnumeracion();             
    }

    $onInit(){
    }

    columnDefsInfoAdicional(isRegister){
        return [
            {
                name: 'Op.',
                headerCellTemplate: `<button type="button" ng-click="grid.appScope.$ctrl.addRow()"  ng-disabled="grid.appScope.$ctrl._params.isView" class="btn btn-secondary btn-xs">
                                        <i class="fa fa-plus-circle"></i>
                                    </button>`,
                enableCellEdit: false,
                width: '5%',
                minWidth:'30',
                cellTemplate: `<button type="button" ng-click="grid.appScope.$ctrl.deleteRow(row)" style="cursor:pointer;"  ng-disabled="grid.appScope.$ctrl._params.isView" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada">
                                    <i class="fa fa-trash"></i>
                                </button>`,
            },                        
            {
                name: 'N°',
                field: 'n',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '5%',
                minWidth:'50'
            },
            {
                name: 'Nombre',
                field: 'nombre',
                enableCellEdit: isRegister,
                allowCellFocus: isRegister,
                enableCellEditOnFocus: isRegister,
                type:'string',
                width: '50%',
                minWidth:'100'
            },  
            {
                name: 'Valor',
                field: 'valor',
                enableCellEdit: isRegister,
                allowCellFocus: isRegister,
                enableCellEditOnFocus: isRegister,
                type:'string',
                width: '25%',
                minWidth:'100'
            },                
        ]
    }

    setEnumeracion() {
        let index = 0, counter=1;
        for(let item of this.gridOptions.data){
            this.gridOptions.data[index].n = counter++
            index++
        }       
    }

    addRow() {
        this.gridOptions.data.push({
            idInfoAdicionalDoc:0,            
            n: 0,
            nombre: '',
            valor: ''
        });
        this.setEnumeracion();
    }

    deleteRow(row) {
        let index = this.gridOptions.data.indexOf(row.entity);
        this.gridOptions.data.splice(index, 1);
        this.setEnumeracion();        
    }

    
    closeModal(){
        if(!this._params.isView){
            let validacion = (val) => ["", null, undefined].includes(val.nombre) ||  ["", null, undefined].includes(val.valor);

            if (this.gridOptions.data.some(validacion)) {
                toastr.warning('Llene todos los campos', 'Cerrar');
                return
            }
        }
        
        this.$uibModalInstance.close(this.gridOptions.data)
    }
}