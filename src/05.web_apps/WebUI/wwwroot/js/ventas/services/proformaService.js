(function(e) {
    
    'use strict';

    app.factory('proformaService', function($injector) {
        let url = 'Proforma/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario')

        let service = {};

        //se a mas de listar en modulo de proformas en Aprobacion Documento 
        service.getAll = function(query) {
            
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let proformas = JSON.parse(response.payload) || [];
                    console.log(proformas)
                    return proformas.map(item =>{
                        return {
                            compronte: 'Proforma',
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
                            nroDocumento: item.nroDocumento,
                            serieComoprobante: item.nroDocumento,
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
                }
            }).catch(error =>{
                console.log('Error al obtener datos->proforma service', error)
                throw error;
            })
        }

        service.queryMapper = function({data, cliente, detalles}){
            let proforma = Object.assign({}, data);
            //Tarifa Aplicada al Documento
            proforma.idCliente = cliente.idCliente;
            proforma.fechaEmision = fS.formatDateTimeZone(data.fechaEmision)
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