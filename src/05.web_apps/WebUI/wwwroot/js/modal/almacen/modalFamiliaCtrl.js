export class ModalFamiliaCtrl{
    static get $inject(){
        return ['$http', '$uibModalInstance', 'formulario', 'params']
    }

    constructor($http, $uibModalInstance, _form, _params){      
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._form = _form;
        this._params = _params;
        this.tipoRegistro = 1;
        this.data = {};                     
    }

    $onInit(){
        if(this._params){
            this.tipoRegistro=2;
            this.data = this._params;
        }
        
    }

    getFamilyCode(){
        if (!this._form.campo(this.data.descripcion) && this.tipoRegistro === 1) {
            this.data.siglas = this._form.obtenerTresLetras(this.data.descripcion);            
        }      
    }

    saveAndUpdate(){
        const tituloToastr = this.tipoRegistro === 1 ? 'Nuevo':'Actualizar';

        if (this._form.campo(this.data.descripcion)) {
            toastr.warning('Por favor, ingrese la Descripción', tituloToastr);
            return;
        }
        if (this._form.campo(this.data.siglas)) {
            toastr.warning('Por favor, ingrese la Sigla', tituloToastr);
            return;
        };

        const url = this.tipoRegistro === 1 ? '/Familia/Post' : '/Familia/Put?idFamilia=' + this.data.idFamilia;
        this.$http.post(url, this.data).then(({data:response}) => {
            console.log(response)
            if (response.id === "0" || response.code==='0') {
                toastr.warning(response.message, response.titleSms);
                return
            }
            if (response.id === "1" || response.code==='1') {
                this.$uibModalInstance.close(response)
                toastr.success(response.message, response.titleSms);                
                return
            }
        })

       
    }


}

