export class ModalMovimientoCajaCtrl{
    static $inject = ['$http', '$q', '$timeout', '$uibModalInstance', 'formulario', 'toastService']
    constructor($http, $q, $timeout, $uibModalInstance, _form, _toastr){
        this.$http = $http;
        this.$q = $q;        
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this._form = _form;
        this._toastr = _toastr;

        this.tipoDocumentos = [];
        this.entidadesFinancieras = [];
        this.cajas = [];

        this.data = {};

    }

    $onInit(){
        this.initiload();

    }

    initiload(){        
        this.$q.all([
            this.$http.get('/TipoDocumento/GetAll'),
            this.$http.get('/EntidadFinanciera/OptionEntidadFinanciera'),
            this.$http.get('/Caja/GetAsigCajaUsuario')           
        ]).then(results=>{                      
            for(let {data} of results){
                if(data.id==="0"){
                    toastr.warning(data.message, data.titleSms)                    
                }                          
            }
            
            this.tipoDocumentos       = results[0].data.data.filter(val=>val.codigo==="IC" || val.codigo=="EC");                                           
            this.entidadesFinancieras = results[1].data.data;            
            this.cajas                = JSON.parse(results[2].data.data) || [];
            console.log(results)
            this.data.idCaja          = this.cajas[0].idCaja || null;
            
        })
        // .catch(error=>{
        //     toastr.warning(error);
        // })
    }

    $onDestroy(){
        
    }

    //Get Sub Entidad Financiera 
    getSubEntidadByEntidadFinanciera(){        
        this.$http.get('/SubEntidadFinanciera/GetByIdEntidadFinanciera?idEntidadFinanciera=' + this.data.idEntidadFinanciera).then(({data:response}) => {               
            this.subEntidades = response.data;
            this.data.idSubEntidadFinanciera = this.subEntidades[0].idSubEntidadFinanciera;                               
        }, error => console.log(error));
    }

    //Buscar Empleado 
    searchEmpleado(busqueda){
        return this.$http.get('/Empleado/Search?busqueda='+busqueda).then(response=>{                                   
            return response.data.data
        })
    }

    onKeyupSearchEmpleado(text){
        if(text===null || text ===undefined || text ===""){
            this.data.idEmpleado='';
        }
    }
        
    selectedEmpleadoChange(item){             
        this.data.idEmpleado=item.idEmpleado;            
    }

    guardarMovCaja(){
        const tituloToast = 'Guardar';

        if(this._form.campo(this.data.idCaja)){
            this._toastr.toastr('warning', 'Seleccione la Caja', tituloToast);
             return
         }

        if(this._form.campo(this.data.idTipoDocumento)){
           this._toastr.toastr('warning', 'Seleccione el Tipo Documento', tituloToast);
            return
        }

        if(this._form.campo(this.data.idEntidadFinanciera)){
           this._toastr.toastr('warning', 'Seleccione la Entidad Financiera', tituloToast);
            return
        }

        if(this._form.campo(this.data.idSubEntidadFinanciera)){
           this._toastr.toastr('warning', 'Seleccione la Entidad Financiera', tituloToast);
            return
        }

        if(this._form.campo(this.data.idEmpleado)){
            this._toastr.toastr('warning', 'Seleccione el Empleado', tituloToast);
             return
         }
        
        if(this._form.campo(this.data.valor) || isNaN(this.data.valor)){
           this._toastr.toastr('warning', 'Ingrese el Valor', tituloToast);
            return
        }

        if(Number(this.data.valor)===0){
           this._toastr.toastr('warning', 'El valor tiene que ser mayor a 0', tituloToast);
            return
        }

        if(this._form.campo(this.data.observaciones)){
           this._toastr.toastr('warning', 'Ingrese la Observación', tituloToast);
            return
        }
       
        this.$http.post('/MovimientoCaja/Post', this.data).then(({data:response})=>{
            if(response.id==="0"){
                this._toastr.toastr('warning', response.message)              
                return
            }

            if(response.id==="1"){
                this._toastr.toastr('success', response.message) 
                this.$uibModalInstance.close(response);
            }
        })
    }

    closeModal(){        
        this.$uibModalInstance.close();
    }
}

