
(function () {

    'use strict';

    app.factory('docRecibidoService', function ($injector) {

        const URL = 'Compra/DocumentoRecibido/'
        const URL_PROVEEDOR = 'Compra/Proveedor/'
        let mS = $injector.get('mainService');

        return {
            getDataFilter,
            getAll,
            get,
            readFileTxt,
            uploadXml,
            checkExistenceXml,
            post,
            putXml,
            putXmlManual,
            deleteDoc,
            getId,
            migrate
        }

        function getDataFilter() {
            return mS.getData('get', `${URL}?json=${JSON.stringify({tipo: 2})}`, null, true).then(
                response => {
                    if(response.code==="0"){
                        throw response;
                    }
                    if(response.code==="1"){
                        let mainData = JSON.parse(response.payload); 
                        return {
                            establecimientos: mainData.establecimientos,
                            tipoComprobantes: mainData.tipoComprobantes
                        }

                    }
                }
            )
        }

        function getAll(query){
            return mS.getData('get', `${URL}?json=${JSON.stringify({...query, tipo: 1 })}`, null, true).then(
                response=>{
                    if(!response) return [];
                    
                    if(response.code==="0"){
                        console.log(response)
                        return [];
                    }
                    if(response.code==="1"){
                        let mainData = JSON.parse(response.payload);
                        let documentos = mainData.documentos || [];
                        console.log(mainData)

                        return documentos.map(doc=>{
                            return {
                                idDocumento: doc.idDocumento,
                                codEstab: doc.codEstab,
                                comprobante: doc.comprobante,
                                codDoc: doc.codDoc,
                                serieComprobante: doc.serieComprobante,
                                rucEmisor: doc.rucEmisor,
                                razonSocialEmisior: doc.razonSocialEmisior,
                                fechaEmision: doc.fechaEmision,
                                fechaAutorizacion: doc.fechaAutorizacion,
                                tipoEmision: doc.tipoEmision,
                                identificacionReceptor: doc.identificacionReceptor,
                                claveAcceso: doc.claveAcceso,
                                numeroAutorizacion: doc.numeroAutorizacion,
                                importeTotal: doc.importeTotal,
                                hasXml: doc.hasXml,
                                complete: doc.complete,
                                colorRow: doc.colorRow,
                                colorCol: doc.colorCol,
                                hoverText: doc.hoverText,
                                totalRecords: doc.totalRecords,
                            }
                        })

                    }
                }
            )
        }

        function get(query) {
            return mS.getData('get', URL + 'Get/' + JSON.stringify(query), null, true).then(response => {

                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {

                    let mainData = JSON.parse(response.payload);

                    if (query.tipo && query.tipo === "1") {
                        return mainData;
                    }

                    if (query.tipo && query.tipo === 3) {
                        return mainData[0];
                    }

                    return mainData[0];
                }
            })
        }

        function readFileTxt (fileTxt) {
            return mS.getDataFile(`${URL}Read`, fileTxt, null, true)
        }

        function uploadXml(query, file) {
            return mS.getDataFile(`${URL}UploadXml/?json=${JSON.stringify(query)}`, file, null, true)
        }

        function checkExistenceXml (item) {
            return mS.getData('post', `${URL}CheckExistenceXml/?claveAcceso=${item}`, null, true)
        }

        function post(data) {
            return mS.getData('post', `${URL}Post`, { data: data }, true).then(response => {
                return response
            })
        }

        function putXml(id) {
            return mS.getData('put', `${URL}Put/${id}`, null, true)
        }

        function putXmlManual (idDocumento, claveAcceso) {
            return mS.getDataFile(`${URL}${idDocumento}/${claveAcceso}`, file, null, true)
        }

        function deleteDoc (item) {
            return mS.getData('delete', `${URL}${item}`, null, true)
        }

        function getId(idDocumento) {
            return mS.getData('get', `${URL}GetId/${idDocumento}`, null, true)
        }

        function migrate(data) {
            return mS.getData('put', `${URL}Migrate`, { data: data }, true)
        }


        //Proveedor 
        // service.getProveedor = function (params) {
        //     return mS.getData('get', `${URL_PROVEEDOR}${JSON.stringify(params)}`, null, true).then(response => {

        //         if (response.code === '0') {
        //             return response;
        //         }
        //         if (response.code === '1') {
        //             let mainData = JSON.parse(response.payload)
        //             if (params.tipo === 1) {
        //                 return mainData;
        //             }

        //             if (params.tipo === 2) {
        //                 const tiposIdentificacion = mainData[0];
        //                 const tiposProveedor = mainData[1];
        //                 const tiposEntidad = mainData[2];
        //                 const contribuyentes = mainData[3];
        //                 const tiemposCredito = mainData[4];
        //                 const ciudades = mainData[5]
        //                 return {
        //                     tiposIdentificacion,
        //                     tiposProveedor,
        //                     tiposEntidad,
        //                     contribuyentes,
        //                     tiemposCredito,
        //                     ciudades,
        //                 }
        //             }
        //         }
        //     })
        // }

        // service.saveProveedor = function(params){
        //     return mS.getData('post', `${URL_PROVEEDOR}?json=${JSON.stringify(params)}`, null, true);
        // }

        return service;
    })
})(window.angular)