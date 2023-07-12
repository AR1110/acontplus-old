


class ModalBaseCtrl{

    
    constructor(tS){
        this.tS = tS;
    }

    isValidForm(tituloModal){
        
        if(!this.data.codigo){
            this.tS.toastr('warning', 'Ingrese el código');
            return
        }

        if(!this.data.concepto){
            this.tS.toastr('warning', 'Ingrese la Descripción');
            return
        }

        
        if(this.data.porcentajeMin === undefined || this.data.porcentajeMin ===null || this.data.porcentaje==''){
            this.tS.toastr('warning', 'Ingrese el Porcentaje');
            return
        }

        return true;

    }

    closeModal() {
        this.$uibModalInstance.close()
    }
}


export class ModalNuevoCtrl extends ModalBaseCtrl {

    static $inject = ['$uibModalInstance', 'mainService', 'toastService', 'params']

    constructor($uibModalInstance, mS, tS, params){
        super(tS)
        this.$uibModalInstance = $uibModalInstance;
        this.mS = mS;
        this.params = params;

        this.data = {};
    }

    $onInit(){

    }

    save(){
        try {
            if(!this.isValidForm()) return 

            this.mS.getData('post', '/ImpuestoRenta/Insert?json=' + JSON.stringify(this.data)).then(
                response =>{
                    if(response.code==="0"){
                        this.tS.toastr('warning', response.message);
                    }

                    if(response.code==="1"){
                        this.tS.toastr('success', response.message);
                        this.$uibModalInstance.close(response)
                    }
                }
            )

        } catch (error) {
            
        }
    }

}


export class ModalEditarCtrl extends ModalBaseCtrl {

    static $inject = ['$uibModalInstance', 'mainService', 'toastService', 'params']

    constructor($uibModalInstance, mS, tS, params){
        super(tS)
        this.$uibModalInstance = $uibModalInstance;
        this.mS = mS;
        this.params = params;

        this.data = Object.assign({}, this.params);
    }

    $onInit(){

    }

    save(){
        try {
            if(!this.isValidForm()) return 

            this.mS.getData('put', '/ImpuestoRenta/Update?id=' + this.data.idCodigoRetencion+'&json=' + JSON.stringify(this.data)).then(
                response =>{
                    if(response.code==="0"){
                        this.tS.toastr('warning', response.message);
                    }

                    if(response.code==="1"){
                        this.tS.toastr('success', response.message);
                        this.$uibModalInstance.close(response)
                    }
                }
            )

        } catch (error) {
            
        }
    }

}