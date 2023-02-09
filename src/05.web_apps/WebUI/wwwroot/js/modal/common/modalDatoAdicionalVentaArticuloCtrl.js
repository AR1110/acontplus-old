export class ModalDatoAdicionalVentaArticuloCtrl{
    static $inject = ['$http', '$uibModalInstance', 'params'];
    constructor($http, $uibModalInstance, _params){
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._params           = _params;
        this.articulo          = this._params.rowEntity;
        
        this.tipoDoc           = this._params.tipoDoc;

        this.articuloManejos   = this._params.articuloManejos || [];
        
    }

    $onInit(){
        
        if(this._params.idComprobante>0){                            
            let url = `${this.articulo.idArticulo}&idTipoDoc=${this.tipoDoc.idTipoDocumento}&idComprobante=${this._params.idComprobante}`
            this.$http.get('/ManejoArticulo/GetTagByDocument?idArticulo='+ url)
            .then(({data:response})=>{                
                if(response.id==="0"){
                    toastr.warning(response.message, response.titleSms);
                }
                if(response.id==="1"){                                        
                    this.articuloDatosAdicionales = this.transformarDatoAdicionalArticulo(response.data);                                            
                }
            })           
        } 

        if (this._params.idComprobante ===null || this._params.idComprobante === undefined) {
            this.articuloDatosAdicionales = this.articulo.adicional.map(val => {
                if(val.hasOwnProperty("json")){
                    val.etiquetas = JSON.parse(val.json);
                }else{
                    val.etiquetas = JSON.parse(val.jsonDetail);
                }
                val.gestion = this.articuloManejos.some(m => m.idManejoArticulo === val.idManejoArticulo);
                return val;
            })            
        }     
    }

    transformarDatoAdicionalArticulo(datosAdicionales){
        return datosAdicionales.map(val=>{   
            if(val.hasOwnProperty("json")){
                val.etiquetas = JSON.parse(val.json);
            }else{
                val.etiquetas = JSON.parse(val.jsonDetail);
            }                                                              
            this.setManejoArticulo(val);
            return val;
        });                
    };

    setManejoArticulo(item){        
        this.articuloManejos = this.articuloManejos.filter(val=>val.idManejoArticulo !==item.idManejoArticulo);            
        if(item.gestion){                  
            let obj = {
                idArticulo: this.articulo.idArticulo,
                idManejoArticulo: item.idManejoArticulo,
                gestion: item.gestion,
                isAdd: this.isAdd
            }
            this.articuloManejos.push(obj);                                            
        }                          
        
    }

    agregarDatoAdicional(item) {
        let articuloAdicionales = this.articuloManejos.filter(val => val.idArticulo === this.articulo.idArticulo);

        if (item.gestion && this.articulo.cantidad === articuloAdicionales.length) {
            Swal.fire({
                icon:'warning',
                html:`<small>Elige la etiqueta de acuerdo la cantidad ingresada en el detalle</small>`
            })            
            item.gestion = false;
            return
        }
        this.setManejoArticulo(item);        
    }

    closeModal(){
        this.$uibModalInstance.close(this.articuloManejos);
    }


}