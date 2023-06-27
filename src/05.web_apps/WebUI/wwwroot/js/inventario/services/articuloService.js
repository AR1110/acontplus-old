
(function(){

    'use strict';

    app.factory('articuloService', ['mainService', function(mainService){

        let url = 'Articulo/';

        let service = {};

        
        service.getAll = function(query){
            return mainService.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }

                if(response.code==="1"){
                    let articulos = JSON.parse(response.payload) || [];
                    return articulos.map(item=>{
                        
                        return { 
                            idArticulo: item.idArticulo,
                            idMedida: item.idMedida,
                            code_unique: item.code_unique,
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            precioCosto: item.precioCosto,
                            estado: item.estado,
                            stock: item.stock,
                            observaciones: item.observaciones,
                            imagen: item.imagen,
                            subFamilia: item.subFamilia,
                            medida: item.medida,
                            tipoIva: item.tipoIva,
                            tipoArticulo: item.tipoArticulo,
                            totalRecords: item.totalRecords,
                            style: item.style
                        }
                    })
                }
            })
        }

        service.getDataForm = function(query){
            return mainService.getData('get', url + 'GetDataForm?json=' + JSON.stringify(query), null, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }

                if(response.code==="1"){
                    let mainDataRepository = JSON.parse(response.payload);
                    let subFamiliaRepository = mainDataRepository[0];
                    let familiaRepository = mainDataRepository[1];
                    let medidaRepository = mainDataRepository[2];
                    let modeloRepository = mainDataRepository[3];
                    let marcaRepository = mainDataRepository[4];
                    let metodoValoracionRepository = mainDataRepository[5]; //"Ultimos en entrar, primeros en salir";                                        
                    let tipoArticuloRepository = mainDataRepository[6];
                    let tarifaRepository = mainDataRepository[7];
                    let etiquetaRepository = mainDataRepository[8];
                    let movimientoRepository = mainDataRepository[9]; //[Entrdas, salidas]
                    let permisoAlmacenRepository = mainDataRepository[10];
                    let decimalAlmacenRepository = mainDataRepository[11][0];

                    let tipoIvaRepository = mainDataRepository[12];
                    let tipoIceRepository = mainDataRepository[13];
                    
                    return {
                        subFamilias: subFamiliaRepository,
                        familias: familiaRepository,
                        medidas: medidaRepository,
                        modelos: modeloRepository,
                        marcas: marcaRepository,
                        valoracionMetodos: metodoValoracionRepository,
                        tipoArticulos: tipoArticuloRepository,
                        tarifas: tarifaRepository,
                        etiquetaActividades:etiquetaRepository,
                        movimientosStocks: movimientoRepository,
                        jsonPersmission: permisoAlmacenRepository,
                        decimal: decimalAlmacenRepository,
                        tipoIvas: tipoIvaRepository,
                        tipoIces: tipoIceRepository,
                    }
                }
            })
        }

        service.save = function(data){
            return mainService.getData('post', url  + 'Insert/', data, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }

                if(response.code==="1"){
                    console.log(response)
                }
            })

        }

        service.update = function(id, data){
            return mainService.getData('put', url + 'Update/' + id, data, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }

                if(response.code==="1"){
                    console.log(response)
                }
            })
        }

        service.search = function(query){
            return mainService.getData('get', url + 'Search?json=' + JSON.stringify(query), null, true).then(response=>{
                if(response.code==="0"){
                    throw response;
                }
                if(response.code==="1"){
                    let articulos = JSON.parse(response.payload) || [];

                    return articulos.map(item=>{
                        let priceSales = JSON.parse(item.priceSale) || [];
                        let warehouses = JSON.parse(item.warehouses) || [];
                        
                        return {
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            idArticulo: item.idArticulo,
                            iva: item.iva,
                            marca: item.marca,
                            medida: item.medida,
                            stock: item.stock,
                            stockMinimo: item.stockMinimo,
                            style: item.style,
                            subFamilia: item.subFamilia,
                            priceSales: priceSales.map(item=>{
                                return {
                                    tarifa: item.tarifa,
                                    precio: item.precio,
                                }
                            }),
                            warehouses
                        }
                    })                       
                }
            })
        }

        service.findByEnterCode = function(objSearch) {
            const query = {
                bySearch: objSearch.textSearch,
                code: objSearch.isSearchByCode 
            }
            return mainService.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if(response.code==="0"){
                    throw response;
                }

                if(response.code==="1"){
                    const dataRepository = JSON.parse(response.payload)[0];
                    return dataRepository;
                }
            })
        }

        service.findForPurchase = function(query){
            return mainService.getData('get', url + 'FindForPurchase?json='+ JSON.stringify(query), null, true).then(response=>{
                if(response.code==='0'){
                    throw response;
                }

                if(response.code==='1'){
                    let dataRepository = JSON.parse(response.payload);
                    let dataArticulo = dataRepository[0][0];
                    let medidas = dataRepository[1] || []; 
                    let etiquetas = dataRepository[2] || [];               
                    let articuloMapper = {
                        codIce:  dataArticulo.codIce,
                        codImpuesto: dataArticulo.codImpuesto,
                        codigoArticulo: dataArticulo.codigoArticulo,
                        codigoAuxiliar: dataArticulo.codigoAuxiliar,
                        codigoPorcentaje: dataArticulo.codigoPorcentaje,
                        codigoPrincipal: dataArticulo.codigoPrincipal,
                        costoNeto: dataArticulo.costoNeto,
                        datosAdicionales: dataArticulo.datosAdicionales,
                        descripcion: dataArticulo.descripcion,
                        idArticulo: dataArticulo.idArticulo,
                        idTipoIva: dataArticulo.idTipoIva,
                        llevaInventario: dataArticulo.llevaInventario,
                        precioSinSubsidio : dataArticulo.precioSinSubsidio,
                        nombreTipoIva: dataArticulo.nombreTipoIva,
                        productoFraccionable: dataArticulo.productoFraccionable,
                        stock: dataArticulo.stock,
                        tarifa: dataArticulo.tarifa,
                        valorIce: dataArticulo.valorIce,
                    }    
                    
                    let medidasMapper = medidas.map(item=>({
                        idMedida: item.idMedida,
                        descripcion: item.descripcion,
                        precioCosto: item.precioCosto,
                        // tarifas: JSON.parse(item.tarifas)
                    }))
                    
                   
                    let etiquetasMapper = etiquetas.map(item => ({
                        idEtiqueta: item.idEtiqueta,
                        descripcion: item.descripcion,
                        etiquetas: item.etiquetas.split(';'),
                    }))

                    return {
                        articulo: articuloMapper,
                        medidas: medidasMapper,
                        etiquetas: etiquetasMapper
                    }                        
                }
            })
        }
        
        /**
         * 
         * @param {*} query 
         * @returns object
         */
        service.findForSale = function(query){
            return mainService.getData('get', url + 'FindForSale?json='+ JSON.stringify(query), null, true).then(response=>{
                if(response.code==='0'){
                    throw response;
                }

                if(response.code==='1'){
                   
                    
                    let dataRepository = JSON.parse(response.payload);                    
                    let dataMedida = []
                    let dataInfoAdicionales = []

                    let medidaMapper = [];
                    let infoAdicionalMapper = [];

                    // let responseMsg = results[0][0];
                    // let sharedData = {
                    //     articulo: results[0][0],
                    //     medidas: results[1],
                    //     datosAdicionales: results[2]
                    // }

                    let dataArticulo = dataRepository[0][0];
                    if(dataRepository[1]){
                        dataMedida = dataRepository[1];
                    }
                    if(dataRepository[2]){
                        dataInfoAdicionales = dataRepository[2]
                    }
                    
                    let articuloMapper = {                        
                        idArticulo: dataArticulo.idArticulo,
                        idTipoIva: dataArticulo.idTipoIva,
                        idMedida: dataArticulo.idMedida,
                        descripcion: dataArticulo.descripcion,
                        valorIce: dataArticulo.valorIce,
                        llevaInventario: dataArticulo.llevaInventario,
                        datosAdicionales: dataArticulo.datosAdicionales,
                        productoFraccionable: dataArticulo.productoFraccionable,
                        nombreTipoIva: dataArticulo.nombreTipoIva,
                        codigoArticulo: dataArticulo.codigoArticulo,
                        stock: dataArticulo.stock,
                        codIce: dataArticulo.codIce,
                        costoNeto: dataArticulo.costoNeto,
                        precioSinSubsidio : dataArticulo.precioSinSubsidio,
                        codigoPrincipal: dataArticulo.codigoPrincipal,
                        codigoAuxiliar: dataArticulo.codigoAuxiliar,
                        codImpuesto: dataArticulo.codImpuesto,
                        codigoPorcentaje:dataArticulo.codigoPorcentaje,
                        tarifa: dataArticulo.tarifa,
                        precioCosto: dataArticulo.precioCosto,
                        cantMinimaVentaPorMayor: dataArticulo.cantMinimaVentaPorMayor
                    }
                    
                    medidaMapper = dataMedida.map(item=>({
                        idMedida: item.idMedida,
                        descripcion: item.descripcion,
                        precioCosto: item.precioCosto,
                        tarifas: item.tarifas
                    }))

                    infoAdicionalMapper = dataInfoAdicionales.map(item => ({
                        idArticulo: item.idArticulo,
                        idEtiqueta: item.idEtiqueta,
                        idInfoAdicional: item.idInfoAdicional,
                        jsonAdicional: JSON.parse(item.jsonAdicional),
                        uniqueId: item.uniqueId,
                        estado: item.estado
                    }))
                    
                    return {
                        response: {
                            code: dataArticulo.code,
                            message: dataArticulo.message,
                            titleSms: dataArticulo.titleSms,
                        },
                        articulo: articuloMapper,
                        medidas: medidaMapper,
                        datosAdicionalesArticulo: infoAdicionalMapper
                    }                 
                }
            })
        }

         service.getId = (id) => {
           return mainService.getData("GET", url + "GetId/" + id, null, true).then(
                 response => {
                     if (response.code == "0") {
                         throw response
                     }
                     if (response.code == "1") {
                         return response
                     }
                 })
         }
        
        return service;

    }])

})(window.angular)