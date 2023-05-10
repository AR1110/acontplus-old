
(function(){

    'use strict';

    app.factory('articuloService', function(mainService){

        let url = 'Articulo/';

        return {
            search: function(query){
                return mainService.getData('get', url + query).hen(response=>{

                })
            },
            findForPurchase: function(query){
                return mainService.getData('get', url + query).then(response=>{
                    if(response.code==='0'){
                        throw response;
                    }

                    if(response.code==='1'){
                        
                    }
                })
            }
        }

    })

})(window.angular)