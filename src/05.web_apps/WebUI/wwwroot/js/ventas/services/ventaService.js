(function() {

    'use strict';

    //---------------------------------Cliente------------------------------------------
    app.factory('clienteService', function($injector){
        let url = 'Cliente/';
        let mS = $injector.get('mainService');

        let service = {};

        service.getDataForm = function (query) {
            return mS.getData('get', url + 'GetDataForm?json=' + JSON.stringify(query), null, true)
                    .then(response => {
                        if(response.code==='0'){
                            console.log('Status code 0: Get Data Form Customer')                            
                            throw response
                        }
                        if(response.code==='1'){
                            let mainDataRepository = JSON.parse(response.payload)
                            
                            return {
                                tipoIdentificacion: mainDataRepository[0],
                                tipoContribuyentes: mainDataRepository[1],
                                tiempoCreditos: mainDataRepository[2],
                                ciudades: mainDataRepository[3]
                            }
                        }
                    }).catch(response=>{
                        throw response;
                    })
            
        }

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true)
                .then(response=>{
                    if(response.code=="0"){
                        throw response;
                    }
                    if(response.code=="1"){
                        let clientes = JSON.parse(response.payload) || [];
                    
                        return clientes.map(item=>{
                            return {
                                idCliente: item.idCliente,
                                numeroIdentificacion: item.numeroIdentificacion,
                                nombreFiscal: item.nombreFiscal,
                                direccion: item.direccion,
                                telefono: item.telefono,
                                correo: item.correo,
                                estado: item.estado,
                                consumidorFinal: item.consumidorFinal,
                                totalRecords: item.totalRecords,
                                validationSri: item.validationSri,
                                tipoIdentificacion: item.tipoIdentificacion,
                                esConsumidorFinal: item.tipoIdentificacion=='CF',
                            }
                        })
                    }
                })
                .catch(error => { 
                    console.log(error)                 
                    throw error;
                })
        }

        service.save = function (data) {
            return mS.getData('post', url + 'Insert', data, true)
            .catch(error => { 
                console.log('Error service save customer: '+ error)                 
                throw error;
            })
        }

        service.update = function (id, data) {
            return mS.getData('put', url + 'Update/' + id, data, true)
            .catch(error => { 
                console.log('Error service update customer: '+ error)                 
                throw error;
            })
        }

        service.delete = function (id) {
            return mS.getData('delete', url + 'Delete/' + id, null, true)
            .catch(error => { 
                console.log('Error service delete customer: '+ error)                 
                throw error;
            })
        }

        service.findById = function (id) {
            return mS.getData('get', url + 'Insert', data, true)
            .catch(error => { 
                console.log('Error service get customer: '+ error)                 
                throw error;
            })
        }

        


        service.validateForm = function (data) {

            if (!data.numeroIdentificacion) {
                tS.toastr('warning', 'Ingrese Número de Identificación')
                return;
            };

            if ($("#numeroIdentificacion").hasClass('is-invalid')) {
                tS.toastr('warning', 'Ingrese el número de Identificación válido');
                return
            }

            if (data.codigoIdentificacion === "CF" && data.numeroIdentificacion.length !== 13) {
                tS.toastr('warning', 'Número de Consumidor Final tiene que ser de 13 dígitos');
                return
            }

            if (data.codigoIdentificacion === "C" && data.numeroIdentificacion.length !== 10) {
                tS.toastr('warning', 'Número de Cédula tiene que ser de 10 dígitos');
                return
            }

            if (data.codigoIdentificacion === "R" && data.numeroIdentificacion.length !== 13) {
                tS.toastr('warning', 'Número de RUC tiene que ser de 13 dígitos');
                return
            }

            if (data.codigoIdentificacion === "R" && data.numeroIdentificacion.slice(-3) !== '001') {
                tS.toastr('warning', 'Número de RUC tiene que contener 001');
                return
            }

            // if (form.campo(data.idSubContribuyente)) {
            //     tS.toastr('warning', 'Seleccione el Contribuyente', tituloModal)
            //     return
            // }
            if (!data.nombreFiscal) {
                tS.toastr('warning', 'Ingrese el nombre Fiscal')
                return
            }
            if (!data.nombreComercial) {
                tS.toastr('warning', 'Ingrese el nombre Comercial')
                return
            }

            if (data.correos.length > 0) {
                if (!data.correos.every(item => validationsUtils.isEmail(item))) {
                    tS.toastr('warning', 'Verifique que los correos  esten ingresado correctamente');
                    return
                }
            }

            if (!data.idTiempoCredito) {
                tS.toastr('warning', 'Seleccione el Tiempo Credito');
                return
            }


            data.direccion = data.direccion ? validationsUtils.letterInline(data.direccion) : "";
            data.telefono = data.telefonos.length > 0 ? data.telefonos.join(';') : "";
            data.correo = data.correos.length > 0 ? data.correos.join(';') : "";
            data.placa = data.placas.length > 0 ? data.placas.join(';') : "";


            return true;
        }

        

        service.checkClientByIdentification = function (query, codigoIdentificacion, callback) {
            clienteRepository.checkClientByIdentification(query).then(response => {
                if (response.code == "0") {
                    callback(codigoIdentificacion)
                }
                if (response.code == "1") {
                    Swal.fire({
                        title: `Cliente Registrado`,
                        html: `
                                <small><strong>Nro. Identificación</strong></small>
                                <br>
                                <p class="text-muted small">${response.numeroIdentificacion}</p>
                                <small><strong>Nombre Fiscal</strong></small> <br>
                                <p class="text-muted small">${response.nombreFiscal}</p>
    
                                <small><strong>Nombre Comercial</strong></small> <br>
                                <p class="text-muted small">${response.nombreComercial}</p>
                            `,
                        icon: 'info',
                        showCloseButton: true,
                        showCancelButton: true,
                        focusConfirm: true,
                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Validar datos!',
                        confirmButtonAriaLabel: 'Validar datos!',
                        cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancelar',
                        cancelButtonAriaLabel: 'Cancelar'
                    }).then(result => {
                        if (result.isConfirmed) {
                            callback(codigoIdentificacion);
                        }
                    })
                }

            }).catch(errorResponse => {
                let error = apiErrorHandler.handle(errorResponse);
                throw new Error(error.message);
            })
        }

        service.checkClientSRIByCedula = function (identificacion) {
            return clienteRepository.checkClientSRIByCedula(identificacion)
        }

        service.checkClientSRIByRUC = function (identificacion) {
            return clienteRepository.checkClientSRIByRUC(identificacion)
        }


        service.onKeyupEmail = function (item) {
            let textChip = item.target.value || "";
            textChip = validationsUtils.removeAccents(textChip);
            item.target.value = textChip.toLowerCase();
        }

        service.transformChipEmail = function (item) {
            let textChip = item || "";
            textChip = validationsUtils.removeAccents(textChip);
            item = textChip.toLowerCase();
        }


        



        return service;
        
    })



})(window.angular)