
import { ModalEmpresaCtrl } from "../../modal/modalEmpresaCtrl.min.js";

class EmpresaCtrl{
    static $inject = ['$http', 'modalService'];
    constructor($http, _modalSvc){
        this.$http = $http;
        this._modalSvc = _modalSvc;
        this.empresas  = [];
        this.accion    = {};
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
        this.$http.get('/Empresa/Get?json=' + JSON.stringify({})).then(({data:response})=>{
            if(response.id==="0"){
                hideLoader();
                this._toastr.toastr('warning', response.message);
                return
            }
            this.empresas = JSON.parse(response.data) || [];            
            hideLoader();
        })
    }

    

    openModal(item){
        const modalRef = this._modalSvc.openModalSecond(ModalEmpresaCtrl, 'Empresa/_ModalEmpresa.cshtml', 'md', item);
        modalRef.result.then(response=>{
            if(typeof response ==='object' && response.id==="1"){
                this.initiload();
            }
        })
    }

    async delete(item){
        let {isConfirmed} = await Swal.fire({
            icon:'warning',
            html:`<small>Esta seguro de eliminar esta Empresa: <b>${item.razonSocial}</b></small>`,
            confirmButtonText:'Sí, eliminar',
            showDenyButton:true,
            denyButtonText:'No, cancelar'
        });
        
        if(isConfirmed){
            showLoader();
            this.$http.post('/Empresa/Delete?id=' + item.idEmpresa).then(({data:response})=>{
                if(response.id==="0"){
                    hideLoader();
                    toastr.warning(response.message);
                    return
                }
                if(response.id==="1"){
                    hideLoader();
                    toastr.success(response.message, response.titleSms);
                    this.initiload();
                }
            })
        }
    }

}

export default app.controller('empresaCtrl', EmpresaCtrl).name