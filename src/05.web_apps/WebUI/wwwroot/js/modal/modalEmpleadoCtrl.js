export class ModalEmpleadoCtrl{
    static $inject = ['mainService', '$uibModalInstance', 'toastService', 'formulario', 'params'];
    
    constructor(_mS, $uibModalInstance, _toast, _form, _params){
        this._mS             = _mS;
        this.$uibModalInstance = $uibModalInstance;
        this._toast            = _toast;
        this._form             = _form;
        this._params           = _params;

        this.tipoRegistro      = 1;
        this.data              = {};

    }

    $onInit(){
        this._mS.getData('post','/TipoIdentificacion/ReadTipoIdentificacion', { tipoValidacion: 'V' }).then(response => {
            this.tipoIdentificaciones = response.data;
            this.data.idTipoIdentificacion = this.tipoIdentificaciones[0].idTipoIdentificacion;
            this.data.identificacion       = this.tipoIdentificaciones[0].identificacion; 

        });

        if(this._params){
            this.tipoRegistro = 2;
            this.data = this._params;
        }
    }

    onChangeTipoIdentificacion(){
        this.data.identificacion = this.tipoIdentificaciones.find(item=>item.idTipoIdentificacion===this.data.idTipoIdentificacion).identificacion;
    }

    saveAndUpdate(){
        try {

            const titulo = this.tipoRegistro ===1?'Guardar':'Actualizar';

            if(this._form.campo(this.data.idTipoIdentificacion)){
                this._toast.toastr('warning', 'Seleccione el Tipo Identificación', titulo);
                return
            }

            if (this._form.campo(this.data.nroIdentificacion)) {
                this._toast.toastr('warning', 'Ingrese Nro. de Identificación', titulo);
                return
            }

            if(this.tipoRegistro===1){
                if (this._form.campo(this.data.nombre)) {
                    this._toast.toastr('warning', 'Ingrese el Nombre', titulo);
                    return
                }
                if (this._form.campo(this.data.apellido)) {
                    this._toast.toastr('warning', 'Ingrese el Apellido', titulo)   ;
                    return
                }
                this.data.nombreCompleto = this.data.nombre +" " + this.data.apellido
            }

            if(this.tipoRegistro===2){
                if (this._form.campo(this.data.nombreCompleto)) {
                    this._toast.toastr('warning', 'Ingrese el Nombre Completo', titulo)   ;
                    return
                }
            }
            
            const url = this.tipoRegistro===1?'/Empleado/Post':'/Empleado/Put?idEmpleado=' + this.data.idEmpleado;
            showLoader();
            this._mS.getData('post', url, this.data).then(response => {
                if (response.id == "0") {
                    hideLoader();
                    this._toast.toastr('warning', response.message, response.titleSms);
                    return
                }
                if (response.id == "1") {
                    hideLoader();
                    this._toast.toastr('success', response.message, response.titleSms);
                    this.$uibModalInstance.close(response)                ;
                }
            })
            
        } catch (error) {
            hideLoader();
            toastr.error(error)
        }


    }

    closeModal(){
        this.$uibModalInstance.close();
    }



}