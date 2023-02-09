import {EntidadService} from '../../services/admin/entidadService.min.js';

export class ModalEntidadCtrl{
    
    static $inject = ['$http', '$timeout', '$q', '$uibModalInstance', 'commonService', 'toastService', 'formulario', 'params']
    constructor($http, $timeout, $q, $uibModalInstance, _commonSvc, _toastr, _form, _params){              
        this.$http             = $http;
        this.$timeout          = $timeout;
        this.$q                = $q;
        this.$uibModalInstance = $uibModalInstance;
        this._commonSvc        = _commonSvc
        this._toastr           = _toastr;
        this._form             = _form;
        this._params           = _params;
        this._eSvc             =  new EntidadService($http, _commonSvc);

        this.fecha             = new Date();
        this.anio              = this.fecha.getFullYear() + '';
    
        this.data              = {};
        this.tipoRegistro      = 1;
        this.data.obligadoLlevarContabilidad = false;      
        this.COD_NORMATIVA_REGIMEN_RETENCION='R'
    }

    $onInit(){        
        this.initiload()        
    }

    async initiload(){
        try {
            const idEntidad = this._params?this._params.idEntidad: 0;

            showLoader();
            const results = await this.$q.all([
                this._eSvc.getAllSubContribuyente().then(response=>response.data),
                this._eSvc.getAllCiudadProvincia().then(response=>response.data),
                this._eSvc.getAllCodigoEnvioSRI().then(response=>JSON.parse(response.data)[0]),
                this._eSvc.getAllAnioFiscal().then(response=>response.data),
                this._eSvc.getDataByIdEntidad(idEntidad)                
            ])            

            this.subContribuyentes           = results[0];
            this.ciudadPronvincias           = results[1];                    
            this.biocombustibles              = JSON.parse(results[2].biocombustible);                        
            this.anioFiscales                 = results[3];
            this.data.idAnioFiscal            = this.anioFiscales.find(val=>val.descripcion === this.anio).idAnioFiscal;                                              

            if(this._params){
                this.data = this._params;                
                this.tipoRegistro = 2;                                
            }

            //Datos relacionados al SRI 
            if(this._params && this._params.hasOwnProperty('isConfigSri')){    
                const dataEntidadSri = JSON.parse(results[4].data);
                this.data = dataEntidadSri[0][0] || {};                                             
                this.regimenes = dataEntidadSri[1];               
            }   
            
            hideLoader();            
        } catch (error) {
            hideLoader();
            console.error(error)
        }
        
        this.$uibModalInstance.rendered.then(()=>{
            $("input[name='ruc']").focus();            
        })
    }

    validarRuc(){
        if (!!this.data.ruc) {
            this.typeNotify = 'is-invalid';
            this.message = 'Número de RUC debe tener 13 dígitos';
            this.id = 0;

            if (this.data.ruc.length == 13) {
                this.$http.post('/ValidarDatos/VerificarDatos', { tipoValidacion: 'IDENTI', numeroIdentificacion: this.data.ruc }).then(({data:response}) => {
                    this.formValid = response.id;
                    this.typeNotify = response.typeNotify;
                    this.message = response.message;
                })
            }
        };
    }

    validarRetencionRegimen(item){   
        // if(!item.estado && item.codNormativa==='AR'){
        //     item.descripcion =""
        //     return
        // }
        if(item.estado && item.codNormativa===this.COD_NORMATIVA_REGIMEN_RETENCION && this.data.idSubContribuyente>0){
            item.descripcion = this.subContribuyentes.find(
                item=>item.subContribuyente.idSubContribuyente === this.data.idSubContribuyente
                ).tipoContribuyente.descripcion            
        }
    }

    


    saveUpdate() {               
        try {
            let tituloModal = this.tipoRegistro ===1?'Guardar':'Actualizar';

            if (this._form.campo(this.data.ruc)) {
                this._toastr.toastr('warning', 'Ingrese el nuúmero de RUC', tituloModal);
                return;
            }
            
            if($("#ruc").hasClass('is-invalid')){
                this._toastr.toastr('warning', 'Ingrese el número de RUC válido', tituloModal);
                return;
            }
         
            if (this._form.campo(this.data.razonSocial)) {
                this._toastr.toastr('warning', 'Ingrese la Razón Social', tituloModal)
                return
            }
            if (this._form.campo(this.data.nombreComercial)) {
                this._toastr.toastr('warning', 'Ingrese el Nombre Comercial', tituloModal)
                return
            }

            this.data.idCiudad  = this.data.idCiudad? this.data.idCiudad:0

          
            let url = this.tipoRegistro === 1 ? 'apiCliente/Entidad/Post' : `apiCliente/Entidad/Put/${this.data.idEntidad}`;
            this._commonSvc.getDataApi({
                method: this.tipoRegistro==1?'post':'put',
                url,
                data: this.data,
                typeUrl:1
            }).then(response => {                
                if (response.id == "0") {
                    hideLoader();
                    this._toastr.toastr('warning', response.message, response.titleSms);                    
                }
                if (response.id == "1") {
                    hideLoader();
                    this._toastr.toastr('success', response.message, response.titleSms);
                    this.$uibModalInstance.close(response)                                   
                }
            }).catch(error=>{
                hideLoader();
                let msg = error.config?error.config.url: error
                console.error(tituloModal +': ' + msg)
            })
            
        } catch (error) {
            hideLoader();
            toastr.error(error)
        }                    
    }

    onChangeSubContribuyente(){
        for(let item of this.regimenes){
            if(item.codNormativa===this.COD_NORMATIVA_REGIMEN_RETENCION){
                item.descripcion =  this.subContribuyentes.find(
                    item=>item.subContribuyente.idSubContribuyente === this.data.idSubContribuyente
                    ).tipoContribuyente.descripcion.toUpperCase()  
                          
            }
        }
    }

    saveConfigSri(){
        if (this._form.campo(this.data.idSubContribuyente)) {
            this._toastr.toastr('warning', 'Seleccione el Contribuyente', )
            return
        }   
        
        if (!this._form.campo(this.data.nroContribuyente)) {              
            if(this.data.nroContribuyente.length<3){
                this._toastr.toastr('warning', 'El Nro Contribuyente Especial número mínimo es de 3', );
                return
            }
        }

        if (this._form.campo(this.data.idAnioFiscal)) {
            this._toastr.toastr('warning', 'Seleccione el Año Fiscal', );
            return;
        }

        if(this.regimenes.some(item=>item.estado && item.codNormativa==='AR' && this._form.campo(item.descripcion))){
            this._toastr.toastr('warning', 'Ingrese la Descripción de Agente de Retención');
            return
        }
        const data = {
            jsonHeader: JSON.stringify(this.data),
            jsonDetail: JSON.stringify(this.regimenes)
        }
        showLoader();
        this._commonSvc.getDataApi({
            method:'put',
            url: `apiCliente/EntidadConfigSri/Put/${this.data.idEntidadConfigSri}`, data,
            typeUrl:1
        }).then(response=>{            
            if (response.id == "0") {
                hideLoader();
                this._toastr.toastr('warning', response.message, response.titleSms);                
            };
            if (response.id == "1") {
                hideLoader();
                this._toastr.toastr('success', response.message, response.titleSms);
                this.$uibModalInstance.close(response)                               
            }            
        }).catch(error=>{
            hideLoader();
            const msg = error.config?error.config.url:error;
            console.error(`${msg}`, 'GUARDAR CONFIG. SRI:')
        })
    }


    closeModal(){
        this.$uibModalInstance.close();
    }




}