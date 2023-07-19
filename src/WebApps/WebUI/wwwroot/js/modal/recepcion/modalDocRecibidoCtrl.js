

export class ModalHistoryComprasCtrl{

    static $inject = ['mainService', 'toastService', '$uibModalInstance', 'params']

    constructor(_mS, _tS, $uibModalInstance, _params) {

        this._mS = _mS;
         
        this._tS = _tS;        

        this.$uibModalInstance = $uibModalInstance;



        this._params = _params;
        this.articleName = `${this._params.codigo} -> ${this._params.descripcion}`;

        this.historyComprasArticle = []
        
    }

    $onInit(){
      
        this.getArticleHC();
    }

    
    getArticleHC(item){
        try {
           
            //$scope.articleName = item.descripcion
            this._mS.getData('get', 'CompraHabitual/Get?json=' + JSON.stringify({ 
                tipo: 3, 
                idArticulo: this._params.idArticulo 
            }), null, true).then(
                response => {
                    if (!response.payload) {
                        this._tS.toastr('warning', 'Este articulo aun no tiene registros de compra habitual')
                    } else {
                        this.historyComprasArticle = JSON.parse(response.payload)
                        //console.log($scope.historyComprasArticle)
                        this.articleName = this.historyComprasArticle[0].articulo
                       
                        
                    }
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    askToDeleteCH(item) {
        Swal.fire({
            title: '¿Está seguro/a de desvincular este articulo de compras habituales?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si!',
            cancelButtonText: 'No',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteCH(item);
            }
        })
    }
    
    deleteCH = (item) => {
        try {
            this._mS.getData('delete', 'CompraHabitual/Delete?id=' + item.idCompraHabitual, null, true).then(
                response => {
                    if (response.code == '0') {
                        this._tS.toastr('warning', response.message)
                        return
                    }
                    if (response.code == '1') {
                        let index = this.historyComprasArticle.indexOf(item)
                        this.historyComprasArticle.splice(index, 1)
                        this._tS.toastr('success', response.message)
                    }
                }, error => {
                    console.log(error)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }


    closeModal(){
        this.$uibModalInstance.close()
    }


}