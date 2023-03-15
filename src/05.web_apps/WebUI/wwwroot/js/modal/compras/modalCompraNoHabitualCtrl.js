
export class ModalBaseCtrl{
    
    constructor({mS, commonSvc, tS}){
        this.mS = mS;
        this.commonSvc = commonSvc;
        this.tS = tS;
    }


    askToChangeEstablecimiento(){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success ml-2',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
          
        swalWithBootstrapButtons.fire({
            title: 'Cambiar Establecimiento?',
            html: "<small>Se cambiará Punto de Emisión y Bodega</small>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, cambiar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then(result=>{
            if(result.isConfirmed){
                this.changeEstableciminto();
            }
        })
    }

    changeEstableciminto(){
        try {
            if(this.establecimientos.length>0){
                let dataEstab = this.establecimientos.find(item=>(item.predeterminado));
                
                this.data.codEstab_Asig = dataEstab.codEstab_Asig
                this.data.codEstab = dataEstab.codEstab;
                
                this.puntosEmision = this.puntosEmisionTemporal.filter(item=>item.codEstab_Asig===this.data.codEstab_Asig)

                this.data.idPuntoEmision = this.puntosEmision.find(item=>(item.predeterminado)).idPuntoEmision
            }        

        } catch (error) {
            console.log(error)
        }
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
            typeList: 2
        }

        this.establecimientos = [];
        this.puntosEmision = [];
        this.decimal = {};
        this.tipoIvas = [];
        this.tiemposCredito = [];
        this.bodegas = [];

    }


    $onInit(){
        try {
            showLoader();
            this.mS.getData('get',  'CompraNoHabitual/' + JSON.stringify({typeList: 2}), null, true).then(response=>{
                if(response.code=="0"){
                    hideLoader();
                    console.log(response)
                }

                if(response.code==="1"){

                    let mainData = JSON.parse(response.payload);
                    
                    this.establecimientos = mainData[0];                
                    
                    this.puntosEmisionTemporal = mainData[1];
                    
                    this.decimal = mainData[2][0];
                    this.tipoIvas = mainData[3];
                    this.tiemposCredito = mainData[4];
    
                    this.changeEstableciminto();
                    
                    this.mS.getData('get',  'CompraNoHabitual/' + JSON.stringify({typeList: 3, codEstab: this.data.codEstab }), null, true).then(response=>{
                        if(response.code==="0"){
                            console.log(response)
                        }
                        if(response.code==="1"){
                            this.bodegas = response.payload? JSON.parse(response.payload): [];
                        }
                    })
                    hideLoader();
                }
            })

        } catch (error) { 
            hideLoader();
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