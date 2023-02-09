import {EntidadService} from './../services/admin/entidadService.min.js';

export class ModalEntidadCtrl{
    
    static $inject = ['$http', '$timeout', '$q', '$uibModalInstance', 'toastService', 'formulario', 'params']
    constructor($http, $timeout, $q, $uibModalInstance, _toastr, _form, _params){
      
        this.API_URL = 'https://localhost:7030/';

        this.$http = $http;
        this.$timeout = $timeout;
        this.$q    = $q;
        this.$uibModalInstance = $uibModalInstance;
        this._toastr = _toastr;
        this._form = _form;
        this._params = _params;
        this._eSvc =  new EntidadService($http);

        this.fecha = new Date();
        this.anio = this.fecha.getFullYear() + '';
    
        this.data = {};
        this.tipoRegistro = 1;
        this.data.obligadoLlevarContabilidad = false;
    }

    $onInit(){
        this.$timeout(this.initiload(), 0);
    }

    async initiload(){
        const idEntidad = this._params?this._params.idEntidad: 0;

        showLoader();
        await this.$q.all([
            this._eSvc.getAllSubContribuyente(),
            this._eSvc.getAllCiudadProvincia(),
            this._eSvc.getAllCodigoEnvioSRI(),
            this._eSvc.getAllAnioFiscal(),
            this._eSvc.getDataByIdEntidad(idEntidad)
        ]).then(results=>{
            for(let response of results){                              
                if(typeof response ==='object' && response.id==='0'){
                    this._toastr.toastr('warning', response.message, response.titleSms);
                    return
                }
            }
            const [ 
                {data:subContribuyentes}, 
                {data: ciudadPronvincias}, 
                {data: envioSriCodigos}, 
                {data: anioFiscales},
                dataEntidad
            ] = results;

            this.subContribuyentes           = subContribuyentes;
            this.ciudadPronvincias           = ciudadPronvincias;

            const [{biocombustible, regimen}] = JSON.parse(envioSriCodigos)
            this.biocombustibles              = JSON.parse(biocombustible);                        
            this.regimenes                    = JSON.parse(regimen);

            this.anioFiscales                 = anioFiscales;
            this.data.idAnioFiscal             = this.anioFiscales.find(val=>val.descripcion === this.anio).idAnioFiscal;                                  

            if(this._params){
                this.tipoRegistro = 2;
                const parseData = JSON.parse(dataEntidad.data)[0] || {};

                this.data = parseData;    

                this.regimenes = this.regimenes.map(regimen=>{
                    return {
                        ...regimen,
                        selected: regimen.codigo ===parseData.regimen
                    }
                });                 
                console.log(this.data)
            }

            hideLoader();
        }).catch(error=>{
            hideLoader();
            this._toastr.toastr('error', error)
        });
        
        // if(this._params){
        //     this.tipoRegistro = 2;
        //     this.getDataEntidad();            

        // }
        $("input[name='ruc']").focus();            
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
        if(item.selected){
            this.regimenes = this.regimenes.map(regimen=>{                
                return {
                    ...regimen,
                    selected: regimen.codigo ===item.codigo
                }
            });           
        }

        if(item.selected && (item.codigo==='AR' || item.codigo==='R')){
            this.data.regimen = item.codigo;
            return
        }
       
        this.data.regimen = null;               
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
            if (this._form.campo(this.data.idSubContribuyente)) {
                this._toastr.toastr('warning', 'Seleccione el Contribuyente', tituloModal)
                return
            }
            if (this._form.campo(this.data.razonSocial)) {
                this._toastr.toastr('warning', 'Ingrese la Razón Social', tituloModal)
                return
            }
            if (this._form.campo(this.data.nombreComercial)) {
                this._toastr.toastr('warning', 'Ingrese el Nombre Comercial', tituloModal)
                return
            }
            // if (this._form.campo(this.data.email)) {
            //     this._toastr.toastr('warning', 'Ingrese el Email', tituloModal)
            //     return
            // }
            // if (this._form.campo(this.data.telefono)) {
            //     this._toastr.toastr('warning', 'Ingrese el Celular / Teléfono ', tituloModal)
            //     return
            // }
            // if (this._form.campo(this.data.direccion)) {
            //     this._toastr.toastr('warning', 'Ingrese la dirección', tituloModal)
            //     return
            // }
            // if (!this._form.campo(this.data.nroContribuyenteEspecial)) {              
            //     if(this.data.nroContribuyenteEspecial.length<3){
            //         this._toastr.toastr('warning', 'El Nro Contribuyente Especial número mínimo es de 3', tituloModal);
            //         return
            //     }
            // }
            // if (this._form.campo(this.data.idCiudad)) {
            //     this._toastr.toastr('warning', 'Seleccione la ciudad', tituloModal);
            //     return;
            // }
            // if (this._form.campo(this.data.idAnioFiscal)) {
            //     this._toastr.toastr('warning', 'Seleccione el Año Fiscal', tituloModal);
            //     return;
            // }

            //Cuando es Agente de Retención
            // if(this.data.regimen==='AR'){
            //     if(this._form.campo(this.data.agenteRetencion)){
            //         this._toastr.toastr('warning', 'Ingrese la Descripción de Agente de Retención');
            //         return
            //     }
            // }else{
            //     this.data.agenteRetencion = 0;
            // }
            
            let url = this.tipoRegistro === 1 ? 'apiCliente/Entidad/Post' : `apiCliente/Entidad/Put/${this.data.idEntidad}`;
            showLoader();          
            this.$http({ 
                method: this.tipoRegistro==1?'post':'put',
                data: this.data,
                url: `${this.API_URL}${url}`
            }).then(({data:response}) => {                
                if (response.id == "0") {
                    hideLoader();
                    this._toastr.toastr('warning', response.message, response.titleSms);
                    return
                };
                if (response.id == "1") {
                    hideLoader();
                    this._toastr.toastr('success', response.message, response.titleSms);
                    this.$uibModalInstance.close(response)               
                    return
                };
            }).catch(error=>{
                hideLoader();
                let msg = error.config?error.config.url: error
                toastr.error(tituloModal +': ' + msg)
            })
            
        } catch (error) {
            hideLoader();
            toastr.error(error)
        }                    
    }


    closeModal(){
        this.$uibModalInstance.close();
    }




}