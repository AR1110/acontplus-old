//@ts-check
(function () {

    'use strict';

    app.factory('articuloService', ['$injector', function ($injector) {
        let mS = $injector.get('mainService');
        let fS = $injector.get('formulario');
        const userCustomerPermissionSvc = $injector.get('userCustomerPermissionService');


        let url = 'Inventario/Articulo/';

        let service = {};

        service.getDataFilter = function () {
            return mS.getData('get', url + '?json=' + JSON.stringify({ tipo: 11 })).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let {
                        brands,
                        measures,
                        models,
                        subcategories,
                        taxes

                    } = JSON.parse(response.payload);
                    return {
                        subFamilias: subcategories || [],
                        medidas: measures || [],
                        marcas: brands || [],
                        modelos: models || [],
                        tiposIva: taxes
                    }

                }
            })
        }

        /**
         * 
         * @param {*} params 
         * 
         * @returns 
         */
        service.get = (params) => {
            return mS.getData('get', url + '?json=' + JSON.stringify(params)).then(response => {
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
            let json = {
                tipo: 1,
                ...query
            }
            return mS.getData('get', url + '?json=' + JSON.stringify(json)).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let { products } = JSON.parse(response.payload);
                    let articulos = products || [];
                    let totalRecords = 0;

                    if (articulos.length > 0) {
                        totalRecords = articulos[0].totalRecords;
                    }



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
            return mS.getData('get', url + '?json=' + JSON.stringify({ tipo: 5 })).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let { brands, categories, decimal, fees, ice, measures, models, productTypes, subcategories, tags, taxes, warehouses

                    } = JSON.parse(response.payload);

                    const dataPermission = userCustomerPermissionSvc.userPermissionAdapter();

                    let permission = {
                        isUpdatePrice: dataPermission.product.precio,
                        gestionUbicacion: dataPermission.product.gestionUbicacion
                    }
                    const establecimientos = fS.groupEstabBodega(warehouses);

                    return {
                        establecimientos,
                        decimal: decimal[0],
                        familias: categories,
                        subFamilias: subcategories,
                        medidas: measures,
                        modelos: models,
                        marcas: brands,
                        tiposArticulo: productTypes,
                        tarifasImpuesto: taxes,
                        tiposICE: ice,
                        tarifas: fees,
                        etiquetas: tags,
                        permission
                    }
                }
            })
        }


        //Lista de articulos fraccionados para buscador rapido 
        service.getArticlesFractionalInfo = function (query) {
            if (!('idArticulo' in query)) {
                fS.sweetAlert('warning', 'Propiedad idArticulo no proporcionado')
                return
            }
            return mS.getData('get', url + '?json=' + JSON.stringify(query), null, true).then(response => {
                let results = []
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {

                    let { products } = JSON.parse(response.payload);
                    let data = products || []
                    results = data.map(item => {
                        let tarifas = item.tarifas && JSON.parse(item.tarifas)
                        return {
                            ...item,
                            tarifas
                        }
                    })

                }
                return results;
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

            return mS.getData('get', url + '?json=' + JSON.stringify(query)).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let { products } = JSON.parse(response.payload);

                    let articulos = products || [];
                    let totalRecords = articulos.length > 0 ? articulos[0].totalRecords : 0;

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
                                codigoBarra: item.codigoBarra,
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
                                s3ObjectKey: item.s3ObjectKey,
                                s3ObjectUrl: item.s3ObjectUrl
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
            return mS.getData('get', url + '?json=' + JSON.stringify(query)).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let { products } = JSON.parse(response.payload);
                    let articulos = products || []
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
            return mS.getData('get', url + '?json=' + JSON.stringify(query)).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    return JSON.parse(response.payload)[0]
                }
            })
        }


        service.save = function (file, data) {
            let json = encodeURIComponent(JSON.stringify({ data }))
            return mS.uploadFile({ url: `${url}?json=${json}`, file, forApi: true });
        }


        service.update = function (id, data) {
            let json = encodeURIComponent(JSON.stringify({ data }))
            return mS.getData('PUT', `${url}${id}?json=${json}`, null, true);
        }


        service.search = function (query) {
            return mS.getData('get', url + 'Search?json=' + encodeURIComponent(JSON.stringify(query))).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let articulos = JSON.parse(response.payload) || [];
                    return articulos.map(item => {
                        let priceSales = JSON.parse(item.priceSale) || [];
                        let warehouses = JSON.parse(item.warehouses) || [];

                        return {
                            s3ObjectUrl: item.s3ObjectUrl,
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
                            llevaInventario: item.llevaInventario,
                            priceSales: priceSales.map(item => {
                                return {
                                    tarifa: item.tarifa,
                                    precio: item.precio,
                                }
                            }),
                            warehouses,
                            totalRecords: item.totalRecords
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
            return mS.getData('get', url + '?json=' + JSON.stringify(query)).then(response => {
                if (response.code === "0") {
                    throw response;
                }

                if (response.code === "1") {
                    let { product } = JSON.parse(response.payload)
                    product = product || {}
                    return product[0];
                }
            })
        }


        /**
         * Para Compras 
         * ✅
         */
        service.getForPurchase = function (query) {
            return mS.getData('get', url + '?json=' + JSON.stringify({ ...query, tipo: 9 })).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let {
                        product,
                        measures,
                        fractionedMeasures,
                        tags
                    } = JSON.parse(response.payload)
                    let dataArticulo = product[0];
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


                    let medidas = fS.processAndSortMeasures(measures, fractionedMeasures);

                    let etiquetasMapper = tags.map(item => ({
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
         * Nueva depuracion ✅✅✅✅
         */
        service.getForSale = function (obj) {
            let params = {
                ...obj,
                bySearch: obj.bySearch || obj.textSearch,
                tipo: 6
            }
            if (!('idArticulo' in obj)) {
                fS.sweetAlert('warning', 'Propiedad idArticulo no proporcionado')
                throw ''
            }
            return mS.getData('get', url + '?json=' + JSON.stringify(params)).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let {
                        product, fractionedMeasures, measures, inventoryAdjustment, additionalInfo
                    } = JSON.parse(response.payload)

                    if(product.length===0 || measures.length===0){
                        throw new Error("No se encontro los resultados")
                    }

                    let articulo = product[0];
                    let infoAdicionalTemp = [];
                    let datosAdicionalesArticulo = [];

                    // Medidas del artículo fraccionado del principal
                    let medidasFraccionadoTemp = fractionedMeasures || []

                    // Medida principal con las tarifas
                    let medidasPrincipalTemp = measures || []

                    let medidas = fS.processAndSortMeasures(medidasPrincipalTemp, medidasFraccionadoTemp);


                    let consolidacionesFecha = inventoryAdjustment || [];

                    infoAdicionalTemp = additionalInfo || []



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
            return mS.getData('get', url + '?json=' + JSON.stringify(query)).then(response => {
                if (response.code === '0') {
                    throw response;
                }
                if (response.code === '1') {
                    const { stockCheckResponse } = JSON.parse(response.payload)

                    const responseApi = stockCheckResponse[0];
                    return responseApi;

                }

            })
        }


        service.findById = function (id) {
            return mS.getData("get", `${url}${id}`).then(response => {
                if (response.code === "0") {
                    throw response;
                }
                if (response.code === "1") {
                    let { products, productPvps,
                        productMeasures,
                        productBarcodes,
                        productLocations

                    } = JSON.parse(response.payload);
                    return {
                        data: products[0],
                        articuloTarifas: productPvps,
                        articuloCodigoBarras: productBarcodes,
                        articuloUbicaciones: productLocations

                    }
                }
            })
        }

        //Se usa Recepcion documentos (posiblemente eliminar mas adelante)
        service.getId = (id) => {
            return mS.getData("GET", url + "GetId/" + id).then(
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
            return mS.getData('get', url + '?json=' + JSON.stringify({ tipo: 13 })).then(
                response => {
                    if (response.code === "0") {
                        throw response
                    }
                    if (response.code === "1") {
                        let {
                            warehouses, subcategories, brands, documentTypes, fees
                        }
                            = JSON.parse(response.payload);

                        const estabs = fS.groupEstabBodega(warehouses)
                        return {
                            estabs,
                            subFamilias: subcategories,
                            marcas: brands
                        }
                    }
                }
            )
        }



        service.getDataStock = function (id) {
            let json = JSON.stringify({
                idArticulo: id,
                tipo: 10,
            })
            return mS.getData('get', url + '?json=' + json, null, true).then(response => {
                let estabsStock = [];
                if (response.code === "1") {
                    let { establishments } = JSON.parse(response.payload);
                    estabsStock = establishments.map(val => {
                        val.warehouses = JSON.parse(val.warehouses);
                        return val;
                    });

                }
                return estabsStock;
            })
        }


        return service;

    }])

    app.factory('articuloCodigoBarraService', function ($injector) {
        const URL = 'Inventario/ArticuloCodigoBarra/';

        const mS = $injector.get('mainService');
        const service = {};

        service.post = function (data) {
            return mS.getData("post", `${URL}`, { data }, true);
        }


        service.put = function (id, data) {
            return mS.getData("put", `${URL}${id}`, { data }, true);
        }

        service.delete = function (id) {
            return mS.getData('delete', `${URL}${id}`, null, true);
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

        function getPhotos(id) {
            return mS.getData('GET', `${url}${id}`).then(response => {
                let photos = [];
                if (response.code === "1") {
                    photos = response.payload;
                }
                return photos;

            })
        }

        function previewImg(id) {
            try {
                showLoader();
                getPhotos(id).then(photos => {
                    hideLoader();
                    if (photos.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            html: '<small> El artículo no posee imágenes.</small> '
                        })
                        return
                    }

                    let sliderContent = `<div id="carouselPhotosProductControls" class="carousel slide" data-ride="carousel">
                                    <div class="carousel-inner">`;
                    let index = 0;
                    for (const photo of photos) {
                        sliderContent += `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img class="d-block w-100" src="${photo.s3ObjectUrl}" alt="First slide">
                                </div>   
                                `;
                        index++;
                    }

                    sliderContent += `</div>
                                    <a class="carousel-control-prev" href="javascript:void(0);" role="button" data-slide="prev" id="prevSlide">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="carousel-control-next" href="javascript:void(0);" role="button" data-slide="next" id="nextSlide">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>`

                    Swal.fire({
                        html: sliderContent,
                        showConfirmButton: true,
                        width: '50em'
                    });

                    document.getElementById('nextSlide').addEventListener('click', () => {
                        $('#carouselPhotosProductControls').carousel('next');
                    })
                    document.getElementById('prevSlide').addEventListener('click', () => {
                        $('#carouselPhotosProductControls').carousel('prev');
                    })

                }).catch(error => {
                    console.log(error)
                }).finally(() => hideLoader())
            } catch (error) {
                hideLoader();
                console.log(error)
            }
        }

        service.get = _get;
        service.post = _post;
        service.setDefault = _setDefault;
        service.update = _update;
        service.delete = _delete;

        service.getPhotos = getPhotos
        service.previewImg = previewImg;
        return service;
    }
})(window.angular)