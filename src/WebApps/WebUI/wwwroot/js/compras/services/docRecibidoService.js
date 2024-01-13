
(function () {

    'use strict';

    app.factory('docRecibidoService', function ($injector) {


        const URL = 'Compra/DocumentoRecibido/'
        const URL_PROVEEDOR = 'Compra/Proveedor/'
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');

        return {
            getDataFilter,
            getAll,
            getDocRelacionado,
            getDataForm,
            getTempDetails,
            saveArticleTemp,
            searchArticle,
            addStock,
            deleteStock,
            saveCompraHabitual,
            saveDocumentoDetalle,
            getDatoAdicionalArticulo, 
            postDatoAdicionalArticulo,
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
            let data = { tipo: 2 }
            return mS.getData('get', `${URL}?json=${JSON.stringify(data)}`, null, true).then(
                response => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload);
                        return {
                            establecimientos: mainData.establecimientos,
                            tipoComprobantes: mainData.tipoComprobantes
                        }

                    }
                }
            )
        }

        function getAll(query) {
            let data = { ...query, tipo: 1 }
            return mS.getData('get', `${URL}?json=${JSON.stringify(data)}`, null, true).then(
                response => {
                    if (!response) return [];

                    if (response.code === "0") {
                        console.log(response)
                        return [];
                    }
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload);
                        let documentos = mainData.documentos || [];
                        

                        return documentos.map(doc => {
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

        function getDataForm() {
            let data = { tipo: 3 }
            return mS.getData('get', `${URL}?json=${JSON.stringify(data)}`, null, true).then(
                response => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code === "1") {
                        let mainData = JSON.parse(response.payload);
                        
                        // let estabs = fS.groupEstabBodega(mainData.bodega);

                        return {
                            //  estabs,
                            bodegas: mainData.bodega,
                            categoriasCompra: mainData.categoriaCompra,
                            sustentosTributario: mainData.sustentoTributario,
                            medidas: mainData.medida
                        }

                    }
                }
            )
        }

        function getTempDetails(idDocumento) {
            return mS.getData('get', 'Compra/Doc_Rec_DetailTemp/' + idDocumento, null, true).then(
                response => {
                    if (response.code === "0") {
                        throw response;
                    }
                    if (response.code == "1") {
                        let tempDetail = JSON.parse(response.payload);

                        tempDetail = tempDetail.map(item => {
                            let tempEtiquetas = JSON.parse(item.etiquetas) || [];

                            let etiquetasMapper = tempEtiquetas.map(etiquet => {
                                return {
                                    ...etiquet,
                                    etiquetas: etiquet.etiquetas.split(';')
                                }
                            })

                            return {
                                ...item,
                                etiquetas: etiquetasMapper
                            }
                        })
                        return tempDetail;
                    }
                }
            )
        }

        function saveArticleTemp(data, method) {
            return mS.getData(method, "Compra/Doc_Rec_DetailTemp/", { data }, true)
        }

        function searchArticle(obj) {
            let params = JSON.stringify(obj)
            return mS.getData('get', 'Compra/Articulo/?json=' + encodeURIComponent(params), null, true)
        }

        function saveCompraHabitual(data) {
            return mS.getData('post', 'Compra/CompraHabitual/Post', { data }, true);
        }

        function saveDocumentoDetalle(idDocumento){
            return mS.getData('post', `Compra/DocumentoDetalle/${idDocumento}/0`, null, true)
        }

        function getDatoAdicionalArticulo(idDocumento) {
            return mS.getData('get', 'Compra/DatoAdicionalArticulo/Get?json=' + JSON.stringify({
                idDocumento
            }), null, true).then(response => {
                if (response.code == '0') {
                    //console.log(response)
                    throw response;
                }
                if (response.code == '1') {
                    let dtAdicional = JSON.parse(response.payload);
                    let datosAdicionalesArticulo = dtAdicional.map(item => {
                        return {
                            idArticulo: item.idArticulo,
                            idEtiqueta: item.idEtiqueta,
                            idInfoAdicional: item.idInfoAdicional,
                            adicionales: JSON.parse(item.jsonAdicional),
                            estado: item.estado,
                        }
                    })
                    return datosAdicionalesArticulo;

                }
            })
        }  

        function postDatoAdicionalArticulo(idDocumento, datosAdicionales){
            let data = {
                datosAdicionales
            }
            return mS.getData('post', `Compra/DatoAdicionalArticulo/Insert/${idDocumento}`, { data }, true) 
        }

        function getDocRelacionado(query) {
            let params = {...query, tipo: 4}
            return mS.getData('get', `${URL}?json=${JSON.stringify(params)}`, null, true).then(response => {
                if(!response) return [];

                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {

                    let mainData = JSON.parse(response.payload);

                    let comprobantes = mainData.comprobante;
                    return comprobantes;                    
                }
            })
        }

        function addStock(obj){
            return mS.getData('post', 'Compra/DocumentoDetalle/' + obj.idDocumento + '/' + obj.idArticulo, null, true) 
        }

        function deleteStock(idDocumentoDetalle){
            return mS.getData('delete', 'Compra/DocumentoDetalle/' + idDocumentoDetalle, null, true)
        }

        function readFileTxt(fileTxt) {
            return mS.getDataFile(`${URL}Read`, fileTxt, null, true)
        }

        function uploadXml(query, file) {
            return mS.getDataFile(`${URL}UploadXml/?json=${JSON.stringify(query)}`, file, null, true)
        }

        function checkExistenceXml(item) {
            return mS.getData('post', `${URL}CheckExistenceXml/?claveAcceso=${item}`, null, true)
        }

        function post(data) {
            return mS.getData('post', `${URL}Post`, { data }, true).then(response => {
                return response
            })
        }

        function putXml(id) {
            return mS.getData('put', `${URL}Put/${id}`, null, true)
        }

        function putXmlManual(idDocumento, claveAcceso) {
            return mS.getDataFile(`${URL}${idDocumento}/${claveAcceso}`, file, null, true)
        }

        function deleteDoc(idDocumento) {
            return mS.getData('delete', `${URL}${idDocumento}`, null, true)
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