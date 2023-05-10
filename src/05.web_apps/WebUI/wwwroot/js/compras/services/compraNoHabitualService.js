
(function(){

    'use strict';

    app.factory('compraNoHabitualService', function($injector){        
       
        let url = 'CompraNoHabitual/'
        let mS = $injector.get('mainService');

        return {
            getAll: function(query){
                return mS.getData('get', url  + JSON.stringify(query), null, true).then(response=>{
                    if(response.code==='0'){
                        throw response;
                    }
                    if(response.code==='1'){
                        let results = JSON.parse(response.payload)[0] || [];
                        return results.map(item => ({
                            colorRow: item.colorRow,
                            estado: item.estado,
                            fechaEmision: item.fechaEmision,
                            idDocumentoIngreso: item.idDocumentoIngreso,
                            importeTotal: item.importeTotal,
                            nombreFiscal: item.nombreFiscal,
                            serieComprobante: item.serieComprobante, 
                            usuario: item.usuario
                        }))
                    }
                })
            },
            create: function(query){

            },
            update: function(id, data){

            },
            delete: function(id){

            }
        }
    })
})(window.angular)