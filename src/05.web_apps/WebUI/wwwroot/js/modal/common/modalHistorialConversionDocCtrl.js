
export class ModalHistorialConversionDocventaCtrl{
    static $inject = ['$uibModalInstance', 'params'];
    constructor($uibModalInstance, _params){
        this.$uibModalInstance = $uibModalInstance;
        this._params           = _params;  
    }

    $onInit(){
        this.historialConversiones = this._params.historialConversiones
 
    }

    closeModal(){
        this.$uibModalInstance.close();
    }
 
}