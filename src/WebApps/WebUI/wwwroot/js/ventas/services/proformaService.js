(function() {
    
    'use strict';

    app.factory('proformaService', function($injector) {
        let url = 'Venta/Proforma/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')

        let service = {};

        service.getDataForm = function(){
            return mS.getData('get', url +'Get?json=' + JSON.stringify({tipo: 2}), null, true ).then(response =>{
                if(response.code==="0"){
                    throw response;
                }
                
                if(response.code==="1"){ 
                    let mainData = JSON.parse(response.payload);  
                    return mainData;
                }
            })
        }

        //se a mas de listar en modulo de proformas en Aprobacion Documento 
        service.getAll = function(query) {
            
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(Object.assign(query, {tipo: 1})), null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let mainData = JSON.parse(response.payload) || [] ;
                    let proformasRepos = mainData[0]; 
                    let {totalRecords, totalDocument} = proformasRepos[0];  
                    let proformas = proformasRepos.map(item =>{
                        return {
                            comprobante: 'Proforma',
                            entidad: item.entidad,
                            codEstab: item.codEstab,
                            idProforma: item.idProforma,
                            idDocumento: item.idDocumento,
                            idTipoDocumento: item.idTipoDocumento,
                            idCliente: item.idCliente,
                            nombreComercial: item.nombreComercial,
                            telefonoEstablecimiento: item.telefonoEstablecimiento,
                            correo: item.correo,
                            fechaEmision: item.fechaEmision,
                            total: item.total,
                            nroDocumento: item.nroDocumento, //eliminar posteriormente
                            serieComprobante: item.nroDocumento,
                            nombreFiscal: item.nombreFiscal,
                            nroIdentificacion: item.nroIdentificacion,
                            telefono: item.telefono,
                            usuario: item.usuario,
                            estadoDoc: item.estadoDoc,
                            codDoc: item.codDoc,
                            rowColor: item.rowColor,
                            codEstado: item.codEstado,
                        }
                    })
                    return {
                        proformas,
                        dataTotals: {totalRecords, totalDocument}
                    }
                }
            }).catch(error =>{
                console.log('obtener datos->proforma service', error)
                throw error;
            })
        }

        service.queryMapper = function({data, cliente, detalles}){
            let formattedDateForInsert = null;
            if (moment(data.fechaEmision).isBefore(new Date(), 'day')) {
                formattedDateForInsert =  moment(data.fechaEmision).startOf('day').toDate();
            }else{
                formattedDateForInsert = data.fechaEmision
            } 

            if(cliente.idCliente===0 && !cliente.razonSocialComprador && !cliente.identificacionComprador){
                throw new Error("Datos de cliente no proporcionados")
            }

            let proforma = Object.assign({}, data);
             
            //Tarifa Aplicada al Documento
            proforma.idCliente = cliente.idCliente; 
            proforma.identificacionComprador = cliente.identificacionComprador;
            proforma.razonSocialComprador = cliente.razonSocialComprador;
            proforma.direccionComprador = cliente.direccionComprador;
            proforma.email = cliente.email;
            proforma.telefono = cliente.telefono;
            proforma.fechaEmision = fS.formatDateTimeZone(formattedDateForInsert)
            // this.data.tarifa = this.actividadTipoIva.tarifa;            
    
            return {
                proforma,
                detalle: service.detalleMapperTo(detalles)
            }
        }

        service.detalleMapperTo = function(detalles) {         
            let tempDetails = [];
            let orderIndex = 1;
    
            for (let item of detalles) {
                tempDetails.push({
                    orderIndex: orderIndex++,
                    idProformaDetalle: item.idProformaDetalle || 0,
                    idArticulo: item.idArticulo,
                    idTarifa: item.idTarifa,
                    idBodega: item.idBodega,
                    idMedida: item.idMedida,
                    idPresentacion: item.idPresentacion || 0,
                    idTipoIva: item.idTipoIva,
                    tarifa: item.tarifa,
                    codigoPorcentaje: item.codigoPorcentaje,
                    ice: item.ice,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioCostoNeto: item.precioCostoNeto,
                    precioUnitario: item.precioUnitario,
                    precioConIva: item.precioConIva,
                    valorDescuento: item.valorDescuento,
                    precioTotalSinImpuesto: item.precioTotalSinImpuesto || 0,
                    porcentajeDescuento: item.porcentajeDescuento,
                    total: item.total,
                    nota: item.nota,
                })
            }
            return tempDetails;
          
        }

        service.save = function(data){
            return mS.getData('post', url + 'Insert/', data, true).then(response => {
                if(response.code==="0"){
                    return response;
                }
                if(response.code==="1"){
                   return response;
                }
            })
        }


        service.update = function(id, data){
            return mS.getData('put', url + 'Update/' + id, data, true).then(response => {
                if(response.code==="0"){
                    return response;
                }
                if(response.code==="1"){
                    return response
                }
            })
        }

        service.delete = function(id){
            return mS.getData('delete', url + 'Delete/' + id, null, true).then(response => {
                if(response.code==="0"){
                    return response;
                }
                if(response.code==="1"){
                    return response
                }
            })
        }


        return service;

    })



})(window.angular)