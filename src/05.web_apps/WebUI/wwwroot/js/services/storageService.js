
app.factory('storageService', storageService)

storageService.$inject = ['$window']

function storageService($window){

    return {
        set:function(key, value){
            return $window.localStorage[key] = value;
        },
        get: function(key, defaultValue){
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value){
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key){
            return JSON.parse($window.localStorage[key] || '{}');
        },


        askToSaveDetailDoc: async function(name, valueStorage){
            let {isConfirmed, value} = await Swal.fire({
                title: '<small>Apartar Documento</small>',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Apartar',
                cancelButtonText: 'No, cancelar',                
                inputValidator: (value) => {
                    if (!value) {                    
                        return 'Ingrese la descripción!'
                    }   
                    
                    if(Object.keys(this.getObject(name)).length>0){
                        if(this.getObject(name)[value]){
                            return 'Ya existe Documento Apartado con esta descripción';                            
                        }
                    }                                          
                },           
            })  
            
            if(isConfirmed){
                if(Object.keys(this.getObject(name)).length>0){
                    let dataInvoiceDetail = this.getObject(name)                   
                    dataInvoiceDetail[value] = JSON.stringify(valueStorage);
                    this.setObject(name, dataInvoiceDetail)                                        
                    toastr.success('Documento Apartado Correctamente')                                        
                }

                if(Object.keys(this.getObject(name)).length===0){
                    let objSave = {
                        [value]: JSON.stringify(valueStorage)
                    }   
                    this.setObject(name, objSave)                     
                    toastr.success('Documento Apartado Correctamente')                     
                }
                    
            }

            return isConfirmed;
            

        },

        restoreInvoiceDetail: async function(name){
            let dataInvoiceDetail = this.getObject(name)
           
            const { isConfirmed, value } = await Swal.fire({
                title: '<small>Recuperar Detalle del Documento</small>',
                input: 'select',
                inputOptions: Object.keys(dataInvoiceDetail).reduce((obj, cur)=>({...obj, [cur]: cur}), {}),
                inputPlaceholder: 'Seleccionar el documento',
                showCancelButton: true,
                confirmButtonText: 'Recuperar detalle',
                cancelButtonText: 'No, cancelar',
                allowEscapeKey:false,
                allowOutsideClick:false,
                inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) {
                        resolve()
                    } else {
                        resolve('Seleccione la opción :)')
                    }
                })
                }
            })


            return {
                isConfirmed,
                value, 
                dataInvoiceDetail
            }           
        }




    }


    
    
    

}