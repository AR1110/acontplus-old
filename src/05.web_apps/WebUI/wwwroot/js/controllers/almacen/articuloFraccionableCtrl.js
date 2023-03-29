
class ArticuloFraccionadoCtrl{
    static $inject = [                
        'mainService', 
        'modalService', 
        'nombreModal', 
        'formulario', 
        'toastService'
    ];

    constructor(_mS, _modalSvc, _nombreModal, _form, _toastr){                      
        this._mS       = _mS;
        this._modalSvc = _modalSvc;
        this._nombreModal = _nombreModal;
        this._form        = _form;
        this._toastr      = _toastr;        

        this.maxSize = 5;
        this.totalRecords = 0;
        this.pageIndex = 1;
        this.pageSize = 10000000;
        this.recordsQuantity = [5, 10, 25, 50];

        this.options = {
                boundaryLinks: false,
                limitSelect: true,
                pageSelect: true
            }

       this.query = {
            order: 'medida',
            limit: 5,
            page: 1
        }
    }

    $onInit(){
        let accion = JSON.parse(localStorage.getItem("accion"));
        if(accion===null){
            location.href = "/Home/Index";
        }else{
            this.accion = accion[0];
        }

        this.getAllArticuloFraccionado();

    }

    getAllArticuloFraccionado(){
        try {
            this.articuloFraccionados = [];
            showLoader();
            this._mS.getData('get','/ArticuloFraccionado/Get?json=' + JSON.stringify({ test: 'kjghksh' })).then(
                response => {
                    if(response.code=="0"){
                        this.articuloFraccionados = [];
                        console.log(response)
                        hideLoader();
                    }
                    if(response.code==="1"){
                        this.articuloFraccionados = JSON.parse(response.payload) || [];                        
                        hideLoader();

                    }
                }
            )  
        } catch (error) {
            
        }
            
    }

    async openModal(item){
        const {MODAL_CTRL, MODAL_ARTICULO_FRACCIONADO_CSHTML} = this._nombreModal.articulo;
        const {ModalArticuloFraccionadoCtrl} = await import('./../../modal/' + MODAL_CTRL);
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalArticuloFraccionadoCtrl,
            template: MODAL_ARTICULO_FRACCIONADO_CSHTML,
            size: 'xl',
            params: item
        })                
        modalRef.result.then(res=>{
            if(typeof res==='object'){
                this.getAllArticuloFraccionado();
            }
        })
    }

    async askToDelete(item) {
        
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar este registro ahora</small>`,            
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            this._mS.getData('delete','/ArticuloFraccionado/Delete?id=' + item.idArticuloFraccionado).then(response=>{
                if (response.id == "0") {
                    toastr.warning(response.message);                
                }
                if (response.id == "1") {
                    toastr.success(response.message);
                    this.getAllArticuloFraccionado();                
                }
            })          
        }
    }
}

export default app.controller('articuloFraccionableCtrl', ArticuloFraccionadoCtrl).name;
