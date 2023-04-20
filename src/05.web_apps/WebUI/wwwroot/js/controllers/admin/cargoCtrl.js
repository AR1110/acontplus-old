import { ModalCargoCtrl } from "../../modal/modalCargoCtrl.min.js";

class CargoCtrl{
    static $inject = ['$http', 'modalService', 'toastService', 'formulario'];
    constructor($http, _modalSvc, _toastr, _form){
        this.$http     = $http;
        this._modalSvc = _modalSvc;
        this._toastr   = _toastr;
        this._form     = _form;   
        
        this.cargos    = [];        
    }

    $onInit(){
        // this.accion = JSON.parse(localStorage.getItem("accion"));
        // if(this.accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     this.accion = this.accion[0];
        // }   
        this.initiload();
    }


    initiload(){
        showLoader();
        this.$http.get('/Cargo/Get?json=' + JSON.stringify({})).then(({data:response})=>{
            if(response.id==="0"){
                hideLoader();
                this._toastr.toastr('warning', response.message, response.titleSms);
                return
            }
            hideLoader();
            this.cargos = JSON.parse(response.data);            
        }).catch(error=>{
            hideLoader();
            this._toastr.toastr('error', error)
        })
    }

   
    async openModal(item){
        const modalRef = this._modalSvc.openModalSecond(ModalCargoCtrl, 'Cargo/_ModalCargo.cshtml', 'md', item);
        modalRef.result.then(res=>{
            if(typeof res === 'object' && res.id === '1'){
                this.initiload();
            }
        })
    }

    async delete(item){
        let {isConfirmed} = await Swal.fire({
            icon:'warning',
            html:`<small>Esta seguro de eliminar este Cargo <b>${item.descripcion}</b> ahora?</small>`,
            confirmButtonText:'Sí, eliminar',
            showDenyButton:true,
            denyButtonText:'No, cancelar',
            allowOutsideClick:false
        });

        if(isConfirmed){
            this.$http.post('/Cargo/Delete?id='+item.idCargo).then(({data:response})=>{
                if(response.id==="0"){
                    this._toastr.toastr('warning', response.message, response.titleSms);
                    return
                }
    
                if(response.id==="1"){
                    this._toastr.toastr('success', response.message, response.titleSms);
                    this.initiload();
                }
            })
        }
    }

    
}

export default app.controller('cargoCtrl', CargoCtrl)