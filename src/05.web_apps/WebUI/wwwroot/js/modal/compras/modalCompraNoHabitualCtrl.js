
export class ModalBaseCtrl{
    
    constructor({mS, commonSvc, tS}){
        this.mS = mS;
        this.commonSvc = commonSvc;
        this.tS = tS;
    }


    isValidForm(){
        if(!this.data.idPuntoEmision || !this.data.idPuntoEmision ===0){
            this.tS.toastr('warning', 'Seleccione el Punto de Emisión')
            return
        }

        if(!this.data.fechaEmision ||  (this.data.fechaEmision instanceof Date && !isNaN(this.data.fechaEmision))){
            this.tS.toastr('warning', 'Ingrese la fecha de Emisión')
            return
        }
       
        if(!this.data.fechaVencimiento ||  (this.data.fechaVencimiento instanceof Date && !isNaN(this.data.fechaEmision))){
            this.tS.toastr('warning', 'Ingrese la fecha de vencimiento')
            return
        }

        if((Date.parse(this.data.fechaEmision) <= Date.parse(this.data.fechaVencimiento))){
            this.tS.toastr('warning', 'Fecha de Vencimiento no puede ser menor a  Fecha de Emisión')
            return
        }
        
        return
    }

}



export class ModalNuevoCtrl extends ModalBaseCtrl{

    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params'];

    constructor($scope, $uibModalInstance, mS, commonSvc, tS, form, params) {
      
        super({mS, commonSvc, tS});
      
        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this.form = form;
        this.params = params;
        this.data = {};

        this.dataSearch = {
            typeList: 1
        }

        this.establecimientos = [];
        this.puntosEmision = [];
        this.decimal = {};
        this.tipoIvas = [];
        this.tiemposCredito = [];

    }


    $onInit(){
        try {

            this.mS.getData('get',  'CompraNoHabitual/' + JSON.stringify(this.dataSearch), null, true).then(response=>{
                console.log(response)
            })

        } catch (error) { 
            console.log(error)
        }        
    }


    save(){
        try {
            if(!this.isValidForm()) return;

            showLoader();

            this.mS.getData('post', 'CompraNoHabitual/Post', this.data).then(response => {
                
                if(response.code==="0"){
                    hideLoader();
                    this.form.sweetAlert('warning', response.message)
                    return
                }

                if(response.code==="1"){
                    hideLoader();
                    this.form.sweetAlert('success', response.message)
                    this.$uibModalInstance.close(response)
                }
            })


        } catch (error) {
            hideLoader()
            console.log(error)
        }
    }


    closeModal(){
        this.$uibModalInstance.close();
    }

}


export class ModalEditarCtrl extends ModalBaseCtrl {

    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'toastService', 'params'];

    constructor($scope, $uibModalInstance, mS, tS, params) {
       
        super({mS, commonSvc, tS});
      
        this.$scope = $scope;
        this.$uibModalInstance = $uibModalInstance;
        this.params = params;
        this.data = {};
    }


    $onInit(){
        console.log(this)
    }


    closeModal(){
        this.$uibModalInstance.close();
    }

}