
(()=>{


    //Capa de Datos - mappers 
    app.factory('facturaMapper', function(){
        return {
            
            /**
             * Función que mapea los datos del objeto a un objeto Comprobante
             * @param {object} data - Objeto con los datos de la factura
             * @returns {object} - Objeto Comprobante mapeado
             */
            mapToComprobante: function(data){
                return {
                    idCliente: data.idCliente,
                    fechaEmision: data.fechaEmision
                }
            },

             /**
             * Función que mapea los datos del objeto Comprobante a un objeto de factura
             * @param {object} data - Objeto Comprobante con los datos de la factura
             * @returns {object} - Objeto de factura mapeado
             */
            mapFromComprobante: function(data){
                return {

                }
            }
        }
    })


    //Capa de datos 
    app.factory('facturaRepository', facturaRepository)

    facturaRepository.$inject = ['mainService', 'facturaMapper'];

    function facturaRepository(mS, facturaMapper){
        let url = 'Factura/'
        
        return {

            /**
             * Obtiene todas las facturas
             * @param {object} query - Objeto con los parámetros de búsqueda
             * @returns {Promise} - Promesa con los datos de las facturas
             */
            getAll: function(query){
              
                return mS.getData('get', url + 'Get?json=' + JSON.stringify(query)).then(response => {
                   
                    return response;

                }).catch(error => {

                     // Crear objeto de respuesta de error
                    let errorResponse = {
                        status: error.status,
                        message: 'Error al leer los datos de la factura'
                    }
                    return Promise.reject(errorResponse);

                })
            },
            /**
             * Crea una nueva factura
             * @param {object} data - Objeto con los datos de la factura
             * @returns {Promise} - Promesa con el resultado de la operación
             */
            create: function(data){

                let params = facturaMapper.mapToComprobante(data);

                return mS.getData('post', url, params, true);

            },

            /**
             * Actualiza una factura existente
             * @param {number} id - ID de la factura a actualizar
             * @param {object} data - Objeto con los nuevos datos de la factura
             * @returns {Promise} - Promesa con el resultado de la operación
             */
            update: function(id, data){

                let params = facturaMapper.mapToComprobante(data);

                return mS.getData('put', url + '/' + id, params, true);

            },

            /**
             * Elimina una factura existente
             * @param {number} id - ID de la factura a eliminar
             * @returns {Promise} - Promesa con el resultado de la operación
             */
            delete: function(id){

                return mS.getData('delete', url + '/' + id, true);
                
            },
            /**
             * Obtiene una factura por ID
             * @param {number} id - ID de la factura a obtener
             * @returns {Promise} - Promesa con los datos de la factura
             */
            getById: function(id){

            }

        }
    }


    //Capa de negocio - utils
    app.factory('validationsUtils', function(){
        return {

            /**
            * Verifica si el valor pasado como argumento es un número válido.
            * @param {any} value Valor a verificar.
            * @returns {boolean} true si el valor es un número válido, de lo contrario false.
            */
            isNumber: function(value) {
                return !isNaN(value) && isFinite(value);
            }
        };
    })


    //Capa de negocio 
    app.factory('facturaService', facturaService);

    facturaService.$inject = ['mainService', 'validationsUtils', 'facturaRepository'];

    function facturaService(mS, validationsUtils, facturaRepository) {

        return {

              /**
             * Obtiene todas las facturas.
             * @param {object} query Objeto con los parámetros de búsqueda.
             * @returns {Promise} Promesa que se resuelve con las facturas encontradas o se rechaza con un error.
             */
            getAll: (query)=> {
                return facturaRepository.getAll(query)
                .catch(error=>{
                    // Manejar error
                    console.error('Error al obtener datos de la factura -> service:', errorResponse);
                    throw new Error(errorResponse.message);
                })
            },

            /**
             * Crea una nueva factura
             * @param {object} data - Objeto con los datos de la factura
             * @returns {Promise} - Promesa con el resultado de la operación
             */
            create: (data)=>{
                return facturaRepository.create(data)
                .catch(error => {
                    console.error('Error al crear una factura -> service:', errorResponse);
                    throw new Error(errorResponse.message);
                });
            }
        }
    }




    //Capa Presentacion 
    app.controller('facturaCtrl', facturaCtrl);

    facturaCtrl.$inject = ['$scope', 'facturaService', 'modalService'];

    function facturaCtrl($scope, facturaService, modalService){

        $scope.data = {};
        $scope.invoices = [];

        $scope.dataSearch = {};
        
        /**
         *  Obtiene todas las facturas y las asigna a la variable $scope.invoices.
         * 
         */
        $scope.getInvoices = ()=>{
            try {
                showLoader();
               
                $scope.invoices = [];
               
                facturaService.getAll($scope.query).then(invoices=>{
                    
                    $scope.invoices = invoices;

                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
            }
        }


        $scope.openModalFiltro= () => {

        }
        


    }













})(window.angular)