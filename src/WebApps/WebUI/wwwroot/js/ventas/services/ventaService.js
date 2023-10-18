/**
 * 1. ventaService
 * 2. clienteService
 * 3. empleadoService 
 */
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
                    let permisoVenta = JSON.parse(payload[11][0].jsonPermission);
                    let permisoArticulo =payload[12][0];


                    let estabsMapper = estabs.map(item=>({
                        codEstab_Asig: item.codEstab_Asig,
                        codEstab: item.codEstab,
                        predeterminado: item.predeterminado,
                        nombreComercial: item.nombreComercial,
                        estab: item.estab,   
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
                        permisoVenta,
                        permisoArticulo
                    }
                   
                }
            })
        }


        service.getIdNotaEntrega = function (id){
            return mS.getData('get', "/NotaEntrega/GetId?id=" + id)
            
            .catch(error=>{
                console.log('sale service', error)
                throw new Error(error)
            })
            // return mS.getData('get', 'Venta/NotaEntrega/' + 'GetId/' + id, null, true)
            
            // .catch(error=>{
            //     console.log('sale service', error)
            //     throw new Error(error)
            // })
        }


        return service;
    })


    //---------------------------------Cliente------------------------------------------
    app.factory('clienteService', function($injector){
        let url = 'Venta/Cliente/';
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        let tS = $injector.get('toastService');
        let cS = $injector.get('commonService')

        let service = {};

        service.getDataForm = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({tipo: 2}), null, true)
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
                                ciudades: mainDataRepository[3],                            
                                tiposCliente: mainDataRepository[4],
                                empresas: mainDataRepository[5],
                                cargos: mainDataRepository[6],
                            }
                        }
                    }).catch(response=>{
                        throw response;
                    })
            
        }

        service.getAll = function (query) {
            query.tipo = 1; 
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true)
                .then(response=>{
                    if(response.code=="0"){
                        throw response;
                    }
                    if(response.code=="1"){ 
                        let clientes = JSON.parse(response.payload)[0] || [];
                    
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
                                validationSri: item.validationSri,
                                tipoIdentificacion: item.tipoIdentificacion,
                                esConsumidorFinal: item.tipoIdentificacion=='CF',
                                totalRecords: item.totalRecords,
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

        /**
         * 
         * @param {object} query  {textSearch}
         * @returns 
         */
        service.search = function(query){
            if(!query){
                throw new Error('No se ha proporcionado ningun parámetro')
            }
            if(!query.hasOwnProperty('textSearch')){
                throw new Error(`La propiedad "textSearch" no se ha proporcionado`)
            }

            let obj = { ...query, textSearch: cS.removeAccents(query.textSearch) }

            return mS.getData('get', url + 'Search?json=' + JSON.stringify(obj), null, true).then(response => {
                if(response.code==='0'){
                    return response;
                }
                if(response.code==='1'){
                    let clientes = JSON.parse(response.payload) || [];
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
            }).catch(error=>{
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
                if (!data.correos.every(item => fS.isEmail(item))) {
                    tS.toastr('warning', 'Verifique que los correos  esten ingresado correctamente');
                    return
                }
            }

            if (!(data.idTiempoCredito>0)) {
                tS.toastr('warning', 'Seleccione el Tiempo Credito');
                return
            }


            data.direccion = data.direccion ? fS.letterInline(data.direccion) : "";
            data.telefono = data.telefonos.length > 0 ? data.telefonos.join(';') : "";
            data.correo = data.correos.length > 0 ? data.correos.join(';') : "";
            data.placa = data.placas.length > 0 ? data.placas.join(';') : "";


            return true;
        }

        

        service.checkClientByIdentification = function (query, codigoIdentificacion, callback) {
            mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                console.log(response)
                if (response.code === '0') {
                    callback(codigoIdentificacion)
                    // return response;
                }
                if(response.code==="1"){
                    
                    let clienteRepository = JSON.parse(response.payload)[0]

                    // return {
                    //     idCliente: clienteRepository.idCliente,
                    //     numeroIdentificacion: clienteRepository.numeroIdentificacion,
                    //     nombreFiscal: clienteRepository.nombreFiscal,
                    //     direccion: clienteRepository.direccion,
                    //     telefono: clienteRepository.telefono,
                    //     correo: clienteRepository.correo,
                    //     estado: clienteRepository.estado,
                    //     consumidorFinal: clienteRepository.consumidorFinal,
                    //     totalRecords: clienteRepository.totalRecords,
                    //     validationSri: clienteRepository.validationSri,
                    //     tipoIdentificacion: clienteRepository.tipoIdentificacion,
                    //     esConsumidorFinal: clienteRepository.tipoIdentificacion=='CF',
                    // }
                    Swal.fire({
                        title: `Cliente Registrado`,
                        html: `
                                <small><strong>Nro. Identificación</strong></small>
                                <br>
                                <p class="text-muted small">${clienteRepository.numeroIdentificacion}</p>
                                <small><strong>Nombre Fiscal</strong></small> <br>
                                <p class="text-muted small">${clienteRepository.nombreFiscal}</p>

                                <small><strong>Nombre Comercial</strong></small> <br>
                                <p class="text-muted small">${clienteRepository.nombreComercial}</p>
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
            }).catch(error => {
                console.log(error);
                throw error;
            })           
        }

        service.checkClientSRIByRUC = function (identificacion) {
            return mS.getData('get', 'Consultas/GetRucSRI?Ruc=' + identificacion, null, true)
        }

        service.checkClientSRIByCedula = function (identificacion) {
            return mS.getData('get', 'Consultas/GetCedulaSri?Ruc=' + identificacion, null, true)
        }


        service.onKeyupEmail = function (item) {
            let textChip = item.target.value || "";
            textChip = fS.removeAccents(textChip);
            item.target.value = textChip.toLowerCase();
        }

        service.transformChipEmail = function (item) {
            let textChip = item || "";
            textChip = fS.removeAccents(textChip);
            item = textChip.toLowerCase();
        } 
        return service;
        
    })
  
     //NO SUBIR HASTA QUE SE HAYA ACTUALIZADO  
    app.factory('empleadoService', function($injector){
        let url = 'Venta/Empleado/'; 
        let mS = $injector.get('mainService');
        return {
            getAll ,
            search,
            deleteEmployee,
            save,
            update
        }

        function getAll(query) { 
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let employeesApi = JSON.parse(response.payload);
                    return employeesApi.map(item=>({
                        idEmpleado: item.idEmpleado,
                        idTipoIdentificacion: item.idTipoIdentificacion,
                        nroIdentificacion: item.nroIdentificacion,
                        nombreCompleto: item.nombreCompleto,
                        estado: item.estado,
                        totalDatos: item.totalDatos,
                    }))
                }
            })
        }

        function search(json) { 
            return mS.getData('get', url + 'Search?json=' + JSON.stringify(json), null, true)
            .then(response => {
                if(response.code==='0'){
                    throw response;
                }
                if(response.code==='1'){
                    let employeesApi = JSON.parse(response.payload); 
                    return employeesApi.map(item=>({
                        idEmpleado: item.idEmpleado,
                        idTipoIdentificacion: item.idTipoIdentificacion,
                        nroIdentificacion: item.nroIdentificacion,
                        nombreCompleto: item.nombreCompleto,
                        estado: item.estado,
                    })) 
                }
            })
            .catch(error => { 
                console.log(error)                 
                throw error;
            })
        }

        function deleteEmployee(id) { 
            return mS.getData('delete', url + 'Delete/' +id, null, true);
        }

        function save(data) { 
            return mS.getData('post', url + 'Insert?json=' + JSON.stringify(data), null, true)
            .catch(error => { 
                console.log('Error service save employee: '+ error)                 
                throw error;
            })
        }

        function update(id, data) { 
            return mS.getData('put', url + 'Update/' + id + '?json=' + JSON.stringify(data),null, true)
            .catch(error => { 
                console.log('Error service update employee: '+ error)                 
                throw error;
            })
        }

    }) 

 
})(window.angular)