(function() {

    'use strict';

    app.factory('ventaService', function($injector){
        let service = {};
        let mS = $injector.get('mainService');

        /**
         * 
         * @param {object} query  
         * @returns array
         */
        service.getDataForm = function(query) {
            return mS.getData('get', 'CatalogoVenta/?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let payload = JSON.parse(response.payload);

                    let estabs      = payload[0];
                    let ptosEmision = payload[1];
                    let bodegas     = payload[2];
                    let configVenta = payload[3][0]
                    let decimal     =  JSON.parse(payload[4][0].jsonConfig)
                    let configDetalle         = payload[5][0]; 
                    let tipoIvas              = payload[6];
                    let tarifas = payload[7];
                    let tiempoCreditos = payload[8];
                    let articuloPredeterminado = payload[9][0]
                    let clientePredeterminado = payload[10][0];                    
                    let permisonVenta = JSON.parse(payload[11][0].jsonPermission);
                    let permisoArticulo =payload[12][0];


                    let estabsMapper = estabs.map(item=>({
                        codEstab_Asig: item.codEstab_Asig,
                        codEstab: item.codEstab,
                        predeterminado: item.predeterminado,
                        nombreComercial: item.nombreComercial,   
                        tarifasImpuestos: JSON.parse(item.tarifasImpuestos)                     
                    }))

                    let ptosEmisionMapper = ptosEmision.map(item => ({
                        codEstab_Asig: item.codEstab_Asig,
                        idPuntoEmision: item.idPuntoEmision,
                        ptoEmi: item.ptoEmi,
                        predeterminado: item.predeterminado,
                    }))

                    let configVentaMapper = {
                        idCliente: configVenta.idCliente | 0,
                        searchCode: configVenta.searchCode | false,
                        printerAutomatic: configVenta.printerAutomatic | false,
                        payAutomatic: configVenta.payAutomatic | true,
                    }

                    let decimalMapper  = {                        
                        nroPrecio: decimal.nroPrecio || 3,
                        nroCantidad: decimal.nroCantidad || 3,
                        nroIva: decimal.nroIva || 3,
                        nroDescuentoDetalle: decimal.nroDescuentoDetalle || 3,
                        nroTotalDetalle: decimal.nroTotalDetalle || 3,
                        nroTotalSubTotal: decimal.nroTotalSubTotal || 3,
                        nroDescuento: decimal.nroDescuento || 3,
                        nroIce: decimal.nroIce || 3,
                        importeTotal: decimal.importeTotal || 3,
                    }

                    let tipoIvasMapper = tipoIvas.map(item=>({
                            idTipoIva: item.idTipoIva,
                            descripcion: item.descripcion,
                            tarifa: item.tarifa,
                            codigoPorcentaje: item.codigoPorcentaje,
                        }))

                    let tiempoCreditosMapper = tiempoCreditos.map(item => ({
                        idTiempoCredito: item.idTiempoCredito,
                        descripcion: item.descripcion,
                        diasCredito: item.diasCredito,
                        numeroCuota: item.numeroCuota,
                    }))

                    console.log(payload)
                    return {
                        establecimientos: estabsMapper,
                        ptosEmision: ptosEmisionMapper, 
                        bodegas,
                        configVenta: configVentaMapper,
                        decimal: decimalMapper,
                        configDetalle,
                        tipoIvas: tipoIvasMapper,
                        tarifas,
                        tiempoCreditos: tiempoCreditosMapper,
                        articuloPredeterminado,
                        clientePredeterminado,
                        permisonVenta,
                        permisoArticulo
                    }
                   
                }
            })
        }
        return service;
    })


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
            return mS.getData('get', url + 'FindById/' + id, null, true)
            .then(response => {
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let dataRepository  = JSON.parse(response.payload)[0];
          
                    return {
                        idCliente: dataRepository.idCliente,
                        idTipoClienteProveedor: dataRepository.idTipoClienteProveedor,
                        idTipoEntidad: dataRepository.idTipoEntidad,
                        idSubContribuyente: dataRepository.idSubContribuyente,
                        idTiempoCredito: dataRepository.idTiempoCredito,
                        idTipoIdentificacion: dataRepository.idTipoIdentificacion,
                        idCiudad: dataRepository.idCiudad,
                        numeroIdentificacion: dataRepository.numeroIdentificacion,
                        nombreFiscal: dataRepository.nombreFiscal,
                        montoCredito: dataRepository.montoCredito,
                        nombreComercial: dataRepository.nombreComercial,
                        direccion: dataRepository.direccion,
                        telefono: dataRepository.telefono,
                        correo: dataRepository.correo,
                        estado: dataRepository.estado,
                        idEmpleado: dataRepository.idEmpleado,
                        diasCredito: dataRepository.diasCredito,
                        empleado: dataRepository.empleado,
                        idEmpresa: dataRepository.idEmpresa,
                        idCargo: dataRepository.idCargo,
                        placa: dataRepository.placa,
                        validationSri: dataRepository.validationSri,
                        correos: dataRepository.correo ? dataRepository.correo.split(';') : [],
                        telefonos: dataRepository.telefono ? dataRepository.telefono.split(';') : [],
                        placas: dataRepository.placa !== '' ? dataRepository.placa.split(';') : []
                    }                    
                }
            })
            .catch(error => { 
                console.log('Error service get customer Find by Id: '+ error)                 
                throw error;
            })
        }

        service.search = function(query){
            if(!query){
                throw new Error('No se ha proporcionado ningun parámetro')
            }
            if(!query.hasOwnProperty('textSearch')){
                throw new Error(`La propiedad "textSearch" no se ha proporcionado`)
            }

            return mS.getData('get', url + 'Search?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let clientes = JSON.parse(response.payload)[0] || {};
                    return clientes.map(item=>{
                        return {
                            idCliente: item.idCliente,
                            nombreFiscal: item.nombreFiscal,
                            nombreComercial: item.nombreComercial,
                            numeroIdentificacion: item.numeroIdentificacion,
                            direccion: item.direccion,
                            correo: item.correo,
                            idTiempoCredito: item.idTiempoCredito,
                            diasCredito: item.diasCredito,
                            nombreCompleto: item.nombreCompleto,
                            placa: item.placa,
                            validationSri: item.validationSri,
                            tipoIdentificacion: item.tipoIdentificacion
                        }
                    })
                }

                console.log(response)
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