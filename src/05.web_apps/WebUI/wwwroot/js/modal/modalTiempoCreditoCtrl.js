export class ModalTiempoCreditoCtrl{

    static $inject = ['$http', '$uibModalInstance', 'toastService', 'params'];
    constructor($http, $uibModalInstance, _toastr, _params){
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._toastr = _toastr;
        this._params = _params;
        this.tipoRegistro = 1;
        this.data = {};
        
        this.tiempoCredito = {};  
       
        this.data.tipo = true;
        this.data.entrada = false; 
        this.onChangeTipo();       

    }

    $onInit(){
        if(this._params){
            this.tipoRegistro=2;
            this.data = this._params.tiempoCredito;
        }

    }

    onChangeTipo(){
        if(this.data.tipo){
            this.data.diasCredito = 0;
            this.data.numeroCuota = 1;
            this.data.entrada = false;            
        }
    }    


    validarCampo(campo){
        return [null, undefined, ""].includes(campo) ? true : false;
    }

    saveAndUpdate() {
        const tituloToastr = this.tipoRegistro === 1 ? 'Guardar':'Actualizar';

        if (this.validarCampo(this.data.descripcion)) {
            this._toastr.toastr('warning', 'Ingrese la descripción', tituloToastr);
            return;
        }
        //Si es opcion  Credito 
        if (this.data.tipo === false) {
            if (this.validarCampo(this.data.diasCredito)) {
                this._toastr.toastr('warning', 'Ingrese el Dias de Crédito', tituloToastr);
                return;
            }
            if (this.data.diasCredito == 0) {
                this._toastr.toastr('warning', 'Dias de Credito tiene que ser mayor a 0 días', tituloToastr);
                return;
            }
            if (this.validarCampo(this.data.numeroCuota)) {
                this._toastr.toastr('warning', 'Por favor, ingrese el Número de Cuota', tituloToastr);
                return;
            }
            if (this.data.numeroCuota == 0) {
                this._toastr.toastr('warning', 'El Número de Cuota tiene que ser mayor a 0', tituloToastr);
                return;
            }
        }
        if (this.data.tipo) {
            if (this.data.diasCredito !== 0) {
                this._toastr.toastr('warning', 'Los Días de Crédito no tiene que ser mayor a 0', tituloToastr);
                return;
            }
            if (this.data.numeroCuota > 1) {
                this._toastr.toastr('warning', 'Número de Cuota tiene que ser igual a 1', tituloToastr);
                return;
            }
            if (this.data.entrada) {
                this._toastr.toastr('warning', 'El Contado no lleva la Entrada ', tituloToastr);
                return;
            }
        }
        
        //Tipo de Gestion(Compra/Venta)
        if (this.validarCampo(this.data.gestion)) {
            this._toastr.toastr('warning', 'Marque el Tipo de Gestión', tituloToastr);
            return;
        }

        const URL = this.tipoRegistro == 1 ? '/TiempoCredito/Post' : '/TiempoCredito/Put?idTiempoCredito=' + this.data.idTiempoCredito;
        this.$http.post(URL, this.data).then(({data:response})=>{
            if (response.id == "0") {
                this._toastr.toastr('warning',  response.message, response.titleSms);
                return
            }
            if (response.id == 1) {
                this._toastr.toastr('success',  response.message, response.titleSms);
                this.$uibModalInstance.close(response);
                return
            }
        })
    }

    closeModal(){
        this.$uibModalInstance.close();
    }

}