
export class ModalBodegaCtrl{
    static $inject = ['$uibModalInstance', 'mainService', 'commonService', 'toastService', 'params']
    constructor($uibModalInstance, _mS, _commonSvc, _tS, _params){
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._tS = _tS;

        let {tipoRegistro, data} = _params;
        this.tipoRegistro = tipoRegistro;
        this.data = Object.assign({}, data) || {};
        this.showEstado = !this.data.estado;
        
    }

    $onInit(){
        this._mS.getData('get', '/EstabAsig/Get?json=' + JSON.stringify({})).then(response=>{          
            console.log(response)              
            this.sucursales = JSON.parse(response.payload) || [];
            console.log(this.sucursales)
        })
    }

    onSave(){
        let tituloModal = this.tipoRegistro==='N'?'Guardar':'Actualizar'
       
        if (!this.data.codEstab) {
            this._tS.toastr('warning', 'Seleccione la Sucursal', tituloModal);
            return;
        }
       
        if (!this.data.descripcion){
            this._tS.toastr('warning', 'Ingrese la descripción', tituloModal);
            return;
        }              
        
        let url = this.tipoRegistro === 'N' ? '/Bodega/Insert' : '/Bodega/Update?id=' +this.data.idBodega;
        let method = this.tipoRegistro==='N'?'post':'put';
        this._mS.getData(method, url, this.data).then(response => {
            if (response.code == "0") {
                this._tS.toastr('warning', response.message, response.titleSms);                
            }
            if (response.code == "1") {
                this._tS.toastr('success', response.message, response.titleSms);                
                this.$uibModalInstance.close(response)            
            }
        })
    }



    closeModal(){
        this.$uibModalInstance.close();
    }
}