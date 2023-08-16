(function(){

    'use strict';

    app.factory('liquidacionCompraService', function($injector){
        const url = '/LiquidacionCompra/'
        let mS = $injector.get('mainService');

        return {
            getAll
        }

        function getAll(query){
            return mS.getData('get', url + 'Get' +'?json=' + JSON.stringify(query)).then(response=>{           
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let results = JSON.parse(response.payload) || [];
                    return results.map(item=>({
                        codEstab: item.codEstab,
                        idLiquidacionCompra: item.idLiquidacionCompra,
                        fechaEmision: item.fechaEmision,
                        total: item.total,
                        nroDocumento: item.nroDocumento,
                        nombreFiscal: item.nombreFiscal,
                        estadoFinanciero: item.estadoFinanciero,
                        style: item.style,
                        usuario: item.usuario,
                        codDoc: item.codDoc,
                        codEstado: item.codDoc
                    }))
                }
            })
        }

    })



})(window.angular)