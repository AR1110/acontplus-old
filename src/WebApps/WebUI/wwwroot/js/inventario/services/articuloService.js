
(function () {

    'use strict';

    app.factory('articuloService', ['mainService', 'formulario', function (mS, fS) {

        let url = 'Inventario/Articulo/';

        let service = {};

        /**
         * 
         * @param {*} params 
         * 
         * @returns 
         */
        service.get = (params) => {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    if (params.tipo === 1) {
                        let articles = mainData[0];
                        let totalRecords = articles.length > 0 ? articles[0].totalRecords : 0
                        return {
                            totalRecords,
                            articulos: articles.map(item => {
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
                                    style: item.style,
                                    s3ObjectKey: item.s3ObjectKey,
                                    s3ObjectUrl: item.s3ObjectUrl
                                }
                            })
                        }
                    }

                    if (params.tipo === 5) {
                        console.log(mainData)
                        console.log('data form')
                    }

                    if (params.tipo === 11) {
                        return {
                            subFamilias: mainData[0],
                            medidas: mainData[1],
                            marcas: mainData[2],
                            modelos: mainData[3],
                            tiposIva: mainData[4]
                        }
                    }

                }
            })
        }

        service.getAll = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);

                    let articulos = mainData[0];
                    let totalRecords = mainData[0][0].totalRecords;

                    //Listado de articulos 
                    return {
                        totalRecords,
                        articulos: articulos.map(item => {
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
                                style: item.style,
                                s3ObjectKey: item.s3ObjectKey,
                                s3ObjectUrl: item.s3ObjectUrl
                            }
                        }),
                    }
                }
            })
        }

        /**
         * Nueva depuracion de datos para el formulario
         * @param {*} query 
         * @returns 
         */
        service.getDataForForm = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 5 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let tempEstabs = mainData[0];
                    let decimal = mainData[1][0];
                    let familias = mainData[3];
                    let subFamilias = mainData[2];
                    let medidas = mainData[4];
                    let modelos = mainData[5];
                    let marcas = mainData[6];
                    let tiposArticulo = mainData[7];
                    let tarifasImpuesto = mainData[8];
                    let tiposICE = mainData[9];
                    let tarifas = mainData[10];
                    let etiquetas = mainData[11];

                    let userData = JSON.parse(localStorage.getItem("userData"));
                    let permission = {
                        isUpdatePrice: true
                    }
                    if (userData) {
                        let jsonDataPermission = userData.permissions.find(dt => dt.codModule === 'AR');
                        if (jsonDataPermission) {
                            let result = JSON.parse(jsonDataPermission.permission);
                            permission.isUpdatePrice = result.precio.update;
                        }
                    }
                    const establecimientos = tempEstabs.reduce((acc, item) => {
                        const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                        if (!existingItem) {
                            acc.push({
                                idEstablecimiento: item.idEstablecimiento,
                                nombreComercial: item.nombreComercial,
                                codEstab: item.codEstab,
                                defaultEstab: item.defaultEstab,
                                bodegas: [{
                                    idEstablecimiento: item.idEstablecimiento,
                                    idBodega: item.idBodega,
                                    bodega: item.bodega,
                                    defaultBodega: item.defaultBodega,
                                }]
                            });
                        } else {
                            existingItem.bodegas.push({
                                idEstablecimiento: item.idEstablecimiento,
                                idBodega: item.idBodega,
                                bodega: item.bodega,
                                defaultBodega: item.defaultBodega,
                            });
                        }
                        return acc;
                    }, []);
                    return {
                        establecimientos,
                        decimal,
                        familias,
                        subFamilias,
                        medidas,
                        modelos,
                        marcas,
                        tiposArticulo,
                        tarifasImpuesto,
                        tiposICE,
                        tarifas,
                        etiquetas,
                        permission
                    }
                    // return {
                    //     establecimientos: mainData[0],
                    //     bodegas: mainData[1],
                    //     subFamilias: mainData[2],
                    //     familias: mainData[3],
                    //     medidas: mainData[4],
                    //     modelos: mainData[5],
                    //     marcas: mainData[6],
                    //     tiposArticulo: mainData[7],
                    //     tarifasImpuesto: mainData[8],
                    //     tarifas: mainData[9]
                    // }
                }
            })
        }


        //Lista de articulos fraccionados para buscador rapido 
        service.getArticlesFractionalInfo = function (query) {
            if (!('idArticulo' in query)) {
                fS.sweetAlert('warning', 'Propiedad idArticulo no proporcionado')
                return
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let dataRepository = JSON.parse(response.payload)[0];
                    return dataRepository.map(item => {
                        let tarifas = item.tarifas && JSON.parse(item.tarifas)
                        return {
                            ...item,
                            tarifas
                        }
                    })

                }
            })
        }

        //se usa en modulo consultar precio y modal consultar Listado de Articulos 
        service.getAllWithPrices = function (dataSearch) {
            const query = {
                tipo: 3,
                bySearch: dataSearch.bySearch,
                pageIndex: dataSearch.pageIndex,
                pageSize: dataSearch.pageSize,
                byColumn: dataSearch.byColumn,
                byStock: dataSearch.byStock,
                checkBoxStock: dataSearch.checkBoxStock,
            };

            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let articulos = mainData[0];
                    let totalRecords = mainData[0][0].totalRecords;

                    return {
                        totalRecords,
                        articulos: articulos.map(item => {
                            let tarifas = JSON.parse(item.tarifa)
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
                                marca: item.marca,
                                modelo: item.modelo,
                                tipoIva: item.tipoIva,
                                tipoArticulo: item.tipoArticulo,
                                style: item.style,
                                precioSinSubsidio: item.precioSinSubsidio,
                                stockMinimo: item.stockMinimo,
                                tarifas,
                                color: item.color,
                            }
                        })

                    }

                }
            })
        }


        //Articulos para listar en el modulo de articulo fraccionado 
        service.searchForFraccionado = function (query) {
            query.tipo = 1;
            query.pageIndex = 1;
            query.pageSize = 50
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let articulos = mainData[0];
                    //Listado de articulos 
                    return articulos.map(item => {
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

        //Se usa en modulo de consolidacion 
        service.getForImportation = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    return JSON.parse(response.payload)[0]
                }
            })
        }

        //eliminar mas adelante
        service.getDataForm = function (query) {
            return mS.getData('get', url + 'GetDataForm?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
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
                        etiquetaActividades: etiquetaRepository,
                        movimientosStocks: movimientoRepository,
                        jsonPersmission: permisoAlmacenRepository,
                        decimal: decimalAlmacenRepository,
                        tipoIvas: tipoIvaRepository,
                        tipoIces: tipoIceRepository,
                    }
                }
            })
        }

        service.save = function (file, data) {
            return mS.uploadFile({ url: url + "Post/?json=" + encodeURIComponent(JSON.stringify({ data })), file, forApi: true });
            //    return mainService.getData('post', url + 'Post', { data: data }, true)
        }


        service.update = function (id, data) {
            return mS.getData('PUT', url + `Put/${id}?json=${encodeURIComponent(JSON.stringify({ data }))}`, null, true);
        }

        /**
         * 
         * @param {json} query  { busqueda: "com", condicion: false, fraccionado: false}
         * @returns 
         */
        service.search = function (query) {
            return mS.getData('get', url + 'Search?json=' + encodeURIComponent(JSON.stringify(query)), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let articulos = JSON.parse(response.payload) || [];

                    return articulos.map(item => {
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
                            fraccionado: item.fraccionado,
                            priceSales: priceSales.map(item => {
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

        service.findByEnterCode = function (objSearch) {
            const query = {
                bySearch: objSearch.textSearch,
                code: objSearch.isSearchByCode,
                tipo: 2
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    const dataRepository = JSON.parse(response.payload)[0][0]
                    return dataRepository;
                }
            })
        }


        /**
         * Para Compras 
         * ✅
         */
        service.getForPurchase = function (query) {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ ...query, tipo: 14 }), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let [articuloApi, medidaPrincipal, medidaFraccionado, etiquetas] = JSON.parse(response.payload);
                    let dataArticulo = articuloApi[0];

                    let articulo = {
                        codImpuesto: dataArticulo.codigo, //Codigo Impuesto 
                        codigoArticulo: dataArticulo.codigoArticulo,
                        codigoPorcentaje: dataArticulo.codigoPorcentaje,
                        datosAdicionales: dataArticulo.datosAdicionales,
                        descripcion: dataArticulo.descripcion,
                        idArticulo: dataArticulo.idArticulo,
                        idTipoIva: dataArticulo.idTipoIva,
                        llevaInventario: dataArticulo.llevaInventario,
                        productoFraccionable: dataArticulo.productoFraccionable,
                        stock: dataArticulo.stock,
                        tarifa: dataArticulo.tarifa,
                        valorIce: dataArticulo.valorIce,
                    }

                    let medidas = fS.processAndSortMeasures(medidaPrincipal, medidaFraccionado);

                    let etiquetasMapper = etiquetas.map(item => ({
                        idEtiqueta: item.idEtiqueta,
                        descripcion: item.descripcion,
                        etiquetas: item.etiquetas.split(';'),
                    }))

                    return {
                        articulo,
                        medidas,
                        etiquetas: etiquetasMapper
                    }
                }

            })
        }

        /**
         * Eliminar mas adelante
         * 📛☺☺❌❓
         * @param {} query 
         * @returns 
         */
        service.findForPurchase = function (query) {
            return mS.getData('get', url + 'FindForPurchase?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }

                if (response.code === '1') {
                    let dataRepository = JSON.parse(response.payload);
                    let dataArticulo = dataRepository[0][0];
                    let medidas = dataRepository[1] || [];
                    let etiquetas = dataRepository[2] || [];
                    let articuloMapper = {
                        codIce: dataArticulo.codIce,
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
                        precioSinSubsidio: dataArticulo.precioSinSubsidio,
                        nombreTipoIva: dataArticulo.nombreTipoIva,
                        productoFraccionable: dataArticulo.productoFraccionable,
                        stock: dataArticulo.stock,
                        tarifa: dataArticulo.tarifa,
                        valorIce: dataArticulo.valorIce,
                    }

                    let medidasMapper = medidas.map(item => ({
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
         * @param {*} query {tipo: 6, idArticulo: 17, idBodega: 2}
         * @returns object
         */
        //👁‍🗨👁‍🗨📛📛❌📛
        service.findForSale = function (query) {
            if (!("tipo" in query)) {
                query.tipo = 6;
            }
            if (!('idArticulo' in query)) {
                fS.sweetAlert('warning', 'Propiedad idArticulo no proporcionado')
                throw ''
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }

                if (response.code === '1') {


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
                    if (dataRepository[1]) {
                        dataMedida = dataRepository[1];
                    }
                    if (dataRepository[2]) {
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
                        precioSinSubsidio: dataArticulo.precioSinSubsidio,
                        codigoPrincipal: dataArticulo.codigoPrincipal,
                        codigoAuxiliar: dataArticulo.codigoAuxiliar,
                        codImpuesto: dataArticulo.codImpuesto,
                        codigoPorcentaje: dataArticulo.codigoPorcentaje,
                        tarifa: dataArticulo.tarifa,
                        precioCosto: dataArticulo.precioCosto,
                        cantMinimaVentaPorMayor: dataArticulo.cantMinimaVentaPorMayor
                    }

                    medidaMapper = dataMedida.map(item => ({
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
                        articulo: articuloMapper,
                        medidas: medidaMapper,
                        datosAdicionalesArticulo: infoAdicionalMapper
                    }
                }
            })
        }

        /**
         * Nueva depuracion ✅✅✅✅
         */
        service.getForSale = function (obj) {
            let params = {
                ...obj,
                tipo: 6
            }
            if (!('idArticulo' in obj)) {
                fS.sweetAlert('warning', 'Propiedad idArticulo no proporcionado')
                throw ''
            }
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(params), null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    let articulo = mainData[0][0];
                    let infoAdicionalTemp = [];
                    let datosAdicionalesArticulo = [];

                    // Medidas del artículo fraccionado del principal
                    let medidasFraccionadoTemp = mainData[1];

                    // Medida principal con las tarifas
                    let medidasPrincipalTemp = mainData[2];

                    // Combinar los dos arrays de medidas en uno solo
                    const medidasPrincipal = medidasPrincipalTemp.map(medidaPrincipal => ({
                        ...medidaPrincipal,
                        tipo: 'PRINCIPAL'
                    }))
                    const medidasFraccionado = medidasFraccionadoTemp.map(medidaFraccionado => ({
                        ...medidaFraccionado,
                        tipo: 'FRACCIONADO'
                    }))
                    const mergedMedidasArray = [...medidasFraccionado, ...medidasPrincipal];

                    /**
                     * Ordenar el array de medidas en función de la propiedad "orden" y 
                     * establecer la propiedad "defaultMedida" en falso para todos los elementos 
                     * */
                    let orderMedidaArray = mergedMedidasArray.sort((a, b) => a.orden - b.orden).map(medida => ({
                        ...medida,
                        defaultMedida: false
                    }))
                    // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
                    orderMedidaArray[0].defaultMedida = true;

                    // Crear un nuevo array de medidas con un formato específico
                    let medidas = orderMedidaArray.map(item => ({
                        idMedida: item.idMedida,
                        conversion: item.conversion,
                        descripcion: item.descripcion,
                        defaultMedida: item.defaultMedida,
                        tipo: item.tipo,
                        tarifas: JSON.parse(item.tarifas)
                    }))

                    let consolidacionesFecha = mainData[3] || [];

                    if (mainData[4]) {
                        infoAdicionalTemp = mainData[4] || []
                    }


                    datosAdicionalesArticulo = infoAdicionalTemp.map(item => ({
                        idArticulo: item.idArticulo,
                        idEtiqueta: item.idEtiqueta,
                        idInfoAdicional: item.idInfoAdicional,
                        jsonAdicional: JSON.parse(item.jsonAdicional),
                        uniqueId: item.uniqueId,
                        estado: item.estado
                    }))
                    return {
                        articulo,
                        medidas,
                        datosAdicionalesArticulo,
                        consolidacionesFecha: consolidacionesFecha.map((data) => ({
                            ...data,
                            fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
                        }))
                    }

                }
            })
        }


        service.checkNotificationStock = function (query) {
            if (!("idArticulo" in query)) {
                fS.sweetAlert('warning', 'Propiedad idArticulo no proporcionado')
                throw ''
            }
            query.tipo = 7;
            return mS.getData('get', url + 'Get?json=' + JSON.stringify(query), null, true).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {

                    const responseApi = JSON.parse(response.payload)[0][0];
                    return responseApi;

                }

            })
        }


        service.findById = function (id) {
            return mS.getData("get", url + "GetId/" + id, null, true).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let mainData = JSON.parse(response.payload);
                    return {
                        data: mainData[0][0],
                        articuloTarifas: mainData[1],
                        articuloCodigoBarras: mainData[2],
                        articuloUbicaciones: mainData[3]
                    }
                }
            })
        }

        //Se usa Recepcion documentos (posiblemente eliminar mas adelante)
        service.getId = (id) => {
            return mS.getData("GET", url + "GetId/" + id, null, true).then(
                response => {
                    if (response.code == "0") {
                        throw response
                    }
                    if (response.code == "1") {
                        return response
                    }
                })
        }

        service.delete = function (id) {
            return mS.getData('delete', `${url}${id}`, null, true);
        }


        //Reports 
        service.getDataFormReport = function () {
            return mS.getData('get', url + 'Get?json=' + JSON.stringify({ tipo: 13 }), null, true).then(
                response => {
                    if (response.code === "0") {
                        throw response
                    }
                    if (response.code === "1") {
                        let [estabsTemp, subFamilias, marcas] = JSON.parse(response.payload);
                        
                        const estabs = fS.groupEstabBodega(estabsTemp)
                        return {
                            estabs,
                            subFamilias,
                            marcas
                        }
                    }
                }
            )
        }
        return service;

    }])

    app.factory('articuloCodigoBarraService', function ($injector) {
        const URL = '/CodigoBarraArticulo/';

        const mS = $injector.get('mainService');
        const service = {};

        service.post = function (data) {
            return mS.getData("post", `${URL}Post`, data);
        }


        service.put = function (id, data) {
            return mS.getData("post", `${URL}Put?idArticuloCodigoBarra=${id}`, data);
        }

        service.delete = function (id) {
            return mS.getData('delete', `${URL}Delete?idArticuloCodigoBarra=${id}`);
        }

        return service;

    })

    app.factory('articuloUbicacionService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Inventario/ArticuloUbicacion/';

        const service = {};

        service.save = function (data) {
            return mS.getData("post", URL + "?json=" + encodeURIComponent(JSON.stringify(data)), null, true);
        }


        service.update = function (id, data) {
            return mS.getData("put", URL + `${id}?json=${encodeURIComponent(JSON.stringify(data))}`, null, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', URL + id, null, true);
        }

        return service;

    })

    app.factory('articuloFraccionadoService', function ($injector) {
        const mS = $injector.get('mainService');
        const URL = 'Inventario/ArticuloFraccionado/';

        const service = {};

        service.get = function (params) {
            return mS.getData("get", URL + "?json=" + encodeURIComponent(JSON.stringify(params)), null, true)
                .then(response => {
                    if (response) {
                        if (params.tipo === 1) {
                            return response.articulosFraccionados;
                        }
                        if (params.tipo === 2) {
                            return {
                                data: response.data[0],
                                pvps: response.pvps
                            }
                        }
                    }
                    else {
                        throw response;
                    }
                })
        }

        service.post = function (data) {
            return mS.getData("post", URL, { data }, true)
        }


        service.put = function (id, data) {
            return mS.getData("put", URL + `${id}`, { data }, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', URL + id, null, true);
        }

        return service;

    })

    app.factory('productPhotoService', productPhotoService);

    productPhotoService.$inject = ['mainService'];

    function productPhotoService(mS) {
        let service = {}
        let url = 'Inventario/ProductPhoto/'
        function _get() {

        }
        function _post({ productId, file }) {
            return mS.uploadFile({ url: `${url}${productId}`, file, });
        }
        function _update({ id, data = null, file }) {
            return mS.uploadFile({ url: `${url}Put/${id}?json=${data}`, file, });
        }
        function _setDefault({ id, isDefault }) {
            return mS.getData('PUT', `${url}SetDefault/${id}/${isDefault}`, null, true);
        }
        function _delete(id) {
            return mS.getData('DELETE', `${url}${id}`, null, true);
        }
        function _delete(id) {
            return mS.getData('DELETE', `${url}${id}`, null, true);
        }
        service.get = _get;
        service.post = _post;
        service.setDefault = _setDefault;
        service.update = _update;
        service.delete = _delete;
        return service;
    }
})(window.angular)