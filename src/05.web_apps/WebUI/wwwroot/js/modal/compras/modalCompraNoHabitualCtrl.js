
export class ModalBaseCtrl{
    
    constructor({mS, commonSvc, tS}){
        this.mS = mS;
        this.commonSvc = commonSvc;
        this.tS = tS;
    }


    isValidForm(){



    }

}



export class ModalNuevoCtrl extends ModalBaseCtrl{

    static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'params'];

    constructor($scope, $uibModalInstance, mS, commonSvc, tS, params) {
      
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