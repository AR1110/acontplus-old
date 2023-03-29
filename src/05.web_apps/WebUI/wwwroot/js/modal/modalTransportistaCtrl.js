export class ModalTransportistaCtrl{
    static $inject = ['$http', '$uibModalInstance', 'mainService', 'formulario', 'params']
    constructor($http, $uibModalInstance, _mS, _form, _params){
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;

        this._mS = _mS;
        this._form             = _form;
        this._params           = _params;
        this.tipoRegistro      = 1;
        this.data              = {};
    }

    $onInit(){
        this.getTipoIdentificacion();        
    }

    getTipoIdentificacion(){
        this.$http.get('/TipoIdentificacion/GetByType?tipo=V').then(({data:response}) => {
            if (response.id === "0") {
                toastr.warning(response.message);
                return
            }
            
            this.tipoIdentificaciones = response.data;
            this.data.idTipoIdentificacion = response.data[0].idTipoIdentificacion;
            
            if(this._params){
                this.tipoRegistro=2;
                this.data = this._params;            
            }
        })
    }

    validarTipoIdentificacion(idTipo) {
        let { codigoIdentificacion } = this.tipoIdentificaciones.find(val => val.idTipoIdentificacion === idTipo) || { codigoIdentificacion: 0 };
        return codigoIdentificacion
    }
    
    saveUpdate() {
        let tituloToast = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';

        if (this._form.campo(this.data.idTipoIdentificacion)) {
            toastr.warning('Seleccione el Tipo de Identificación', tituloToast);
            return
        }
        if (this._form.campo(this.data.nroIdentificacion)) {
            toastr.warning('Ingrese N° de Identificación', tituloToast);
            return
        }
        if (this.validarTipoIdentificacion(this.data.idTipoIdentificacion) === "C" && this.data.nroIdentificacion.length !== 10) {
            toastr.warning('Número de Cédula tiene que tener 10 dígitos', tituloToast);
            return
        }

        if (this.validarTipoIdentificacion(this.data.idTipoIdentificacion) === "R" && this.data.nroIdentificacion.length !== 13) {
            toastr.warning('Número de RUC tiene que tener 13 dígitos', tituloToast);
            return
        }
        if (this._form.campo(this.data.nombre)) {
            toastr.warning('Ingrese el Nombre', tituloToast);
            return
        }

        let url = this.tipoRegistro == 1 ? "/Transportista/Post" : "/Transportista/Put?id=" + this.data.idTransportista;

        let method = this.tipoRegistro ===1?'post':'put';
        this._mS.getData(method, url, this.data).then(response => {
            console.log(response)
            if (response.id === "0" || response.code === "0") {
                toastr.warning(response.message);
                return;
            }
            if (response.id === "1" || response.code === "1") {
                toastr.success(response.message);
                this.$uibModalInstance.close(response)
            }
        })

    }

    closeModal(){
        this.$uibModalInstance.close();
    }


}