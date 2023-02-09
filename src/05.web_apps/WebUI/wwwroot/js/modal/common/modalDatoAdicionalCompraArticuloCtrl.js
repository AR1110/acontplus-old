

export class DatoAdicionalCompraArticuloCtrl{
    static $inject = ['$http', '$uibModalInstance', 'params'];
    constructor($http, $uibModalInstance, _params){
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this._params           = _params;
        this.articulo          = this._params.articulo;
        this.tipoDoc           = this._params.tipoDoc;
                
        this.manejoArticuloDetalle = this._params.manejoArticuloDetalle
        
        this.etiquetasEliminados = [];
        this.etiquetas             = [];
    }

    $onInit(){        
         /*verificamos si el articulo tiene etiqueta agregada en el array manejo articulo detalle y si
            tiene recuperamos las etiquetas 
        */
        if(this.existeArticuloEnEtiqueta()){
            this.etiquetas = this.getEtiquetaDeManejoArticuloDetalle();           
        }else{
            this.etiquetas = this.articulo.etiquetas.map(val=>{                                   
                val.etiquetas =[];
                return val;
            })
        }
    }

    getEtiquetaDeManejoArticuloDetalle(){            
        return this.articulo.etiquetas.map(val=>{               
            val.etiquetas = this.manejoArticuloDetalle.filter(valTag=>{
                return valTag.idArticulo === this.articulo.idArticulo && valTag.detalle.idEtiqueta === val.idEtiqueta;
            })                
            return val;
        })                  
    }

       
    transformarEtiqueta($chip, $index,  item) {                         
        /* Verificamos si la etiqueta existe en el array etiquetas eliminados         
            y si existe recuperamos los valores y reemplazamos la descripcion x el nuevo.
        */
        let getTag = this.etiquetasEliminados.find(val=>val.detalle.idEtiqueta===item.idEtiqueta);

        if(angular.isObject(getTag)){
            
            let index = this.etiquetasEliminados.indexOf(getTag);
            this.etiquetasEliminados.splice(index, 1);
            
            getTag.detalle.descripcion = $chip; //reemplazamos la descripcion por el nuevo 
            return getTag;               
        }                                

        let detalle = {
                idEtiqueta: item.idEtiqueta,
                descripcion: $chip,
                secuencial: item.etiquetas?item.etiquetas.length + 1 : 1
        }

        let obj = {
                detalle,
                idArticulo: this.articulo.idArticulo
        }

        return obj;                                                                    
    }

    etiquetaRemove(tag, e){          
        /*Si el tipo registro es actualizar guardamos temporalmente las etiquetas que se eliminen             
        */
        if(tag.detalle.idManejoArticuloDetalle>0 && tag.detalle.idManejoArticulo>0){
            this.etiquetasEliminados.push(tag);            
        } 
        if(e.etiquetas === undefined) e.etiquetas = [];                         
    }

    //funcion para verificar si el articulo tiene etiquetas agregadas 
    existeArticuloEnEtiqueta(){
        return this.manejoArticuloDetalle.some(val=>val.idArticulo===this.articulo.idArticulo);
    }   

    guardarEtiquetaArticulo(){       
      
        if(this.etiquetas.some(val=>val.etiquetas.length===0)){
            Swal.fire({
                icon:'warning',
                html:`<small>Ingrese todas las etiquetas</small>`
            });
            return
        }

        if(this.etiquetas.some(val=>val.etiquetas.length!== this.articulo.cantidad)){
            Swal.fire({
                icon:'warning',
                html:`<small>Número de etiquetas no coinciden con el número de cantidad del articulo</small>`
            });
            return
        }

        //Verificamos si el articulo tiene etiquetas y si existe eliminamos las etiquetas para reemplzar por nuevas etiquetas
        if(this.existeArticuloEnEtiqueta()){
            this.manejoArticuloDetalle = this.manejoArticuloDetalle.filter(val=>val.idArticulo!== this.articulo.idArticulo);
        }        
                
        //Unimos lista de etiquetas  de un articulo                              
        const unionEtiquetas = this.etiquetas.flatMap(val=>val.etiquetas);
        
        this.manejoArticuloDetalle = this.manejoArticuloDetalle.concat(unionEtiquetas);
       
       this.closeModal();
    }
    

    closeModal(){
        this.$uibModalInstance.close(this.manejoArticuloDetalle);
    }
}