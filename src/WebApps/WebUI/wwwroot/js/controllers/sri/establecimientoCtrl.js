


class EstablecimientoCtrl{
    static $inject = ['mainService', 'commonService', 'toastService', 'modalService', 'nombreModal'];
    constructor(_mS, _commonSvc, _tS, _modalSvc, _nombreModalConst){
        this._mS        = _mS;
        this._commonSvc = _commonSvc;
        this._tS        = _tS;
        this._modalSvc  = _modalSvc;
        this._nombreModalConst = _nombreModalConst;

        this.dataSearch = {
            pageIndex: 1,
            pageSize: 10,
            typeList: 1 //Listar los establecimientos
        }
        
        this.maxSize = 5;
        this.totalRecords = 0;      
        this.recordsQuantity = [5, 10, 25, 50];

        this.establecimientos = [];
       
    }

    $onInit(){
        this.getEstablecimientos();        
    }

    async getEstablecimientos(){
        try {
            showLoader();
            await this._mS.getData('get', '/Establecimiento/Get?json=' + JSON.stringify(this.dataSearch)).then(response=>{
                if(response.code==='0'){                
                    console.warn(response.message)
                    return
                }
                this.establecimientos = JSON.parse(response.payload) || [];  
                                      
            })
        } catch (error) {
            hideLoader();
            console.trace(error)
        }finally{
            hideLoader();
        }
    }

    async openModalNew(){
        let {MODAL_CTRL, MODAL_NUEVO} = this._nombreModalConst.establecimiento;                            
        let controller                = (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']]
        let template                  = MODAL_NUEVO['template']; 
        let params = {
            tipoRegistro: 'N'
        }   
        
        this.openModal(controller, template, params);
    }

    async openModalEdit(params){
        let {MODAL_CTRL, MODAL_EDIT} = this._nombreModalConst.establecimiento;                            
        let controller  = (await import('./../../modal/' + MODAL_CTRL))[MODAL_EDIT['controller']] 
        let template    = MODAL_EDIT['template']; 
        params.tipoRegistro = 'E'        
        this.openModal(controller, template, params);
    }

    async openModalConfig(params){
        let {MODAL_CTRL, MODAL_CONFIG} = this._nombreModalConst.establecimiento; 
        
        let controller  = (await import('./../../modal/' + MODAL_CTRL))[MODAL_CONFIG['controller']]
        let template   = MODAL_CONFIG['template']; 
               
        this.openModal(controller, template, params, 'xl');
    }

    /**
     * 
     * @param {*} controller 
     * @param {*} template 
     */
    openModal(controller, template, params, size='lg'){
        this._modalSvc.openModalCustom({
            controller,
            template,
            params,
            size
        }).result.then(result=>{
            if(typeof result==='object'){
                this.getEstablecimientos();
            }
        })
    }
    

    pagechanged(){
        this.getEstablecimientos();        
    } 

    changePageSize() {
        this.dataSearch.pageIndex = 1;
        this.getEstablecimientos();
    }
   
    async askToCloseEstab(item){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger m-l-5'
            },
            buttonsStyling: false
        })
          
        const {isConfirmed} = await swalWithBootstrapButtons.fire({
            title: 'Cerrar el Establecimiento',
            html: "<small>Esta seguro de cerrar el Establecimiento?</small>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar!',
            cancelButtonText: 'No, cancelar!',
            allowOutsideClick:false,
            reverseButtons: false
        })

        if(isConfirmed){
            this._mS.getData('delete', `/Establecimiento/Delete?id=${item.idEstablecimiento}`).then(response=>{
                if(response.code==='0'){
                    this._tS.toastr('warning', response.message)
                }
                if(response.code==='1'){
                    this._tS.toastr('success', response.message);
                    this.getEstablecimientos();
                }
            })
        }
    }

}

app.controller('establecimientoCtrl', EstablecimientoCtrl)