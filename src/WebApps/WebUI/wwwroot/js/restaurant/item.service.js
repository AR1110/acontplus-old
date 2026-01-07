(function () {
    'use strict';
    app.factory('itemService', itemService);
    itemService.$inject = ['mainService', 'formulario'];
    function itemService(mS, fS) {
        var url = 'restaurant/items';

        var service = {
            search,
            getByIdForOrderProduction,
            getId
        };
        return service;
        function search(params) {
            console.log('itemService search params', params);
            const queryParams = new URLSearchParams({
                pageIndex: params.pageIndex.toString() || '1',
                pageSize: params.pageSize.toString() || '10',
            });

            if (params.searchTerm) {
                queryParams.append('searchTerm', params.searchTerm);
            }

            if (params.filters) {
                const objToJsonFilters = {
                    siglaFamilia: 'sigla'
                };

                Object.entries(params.filters).forEach(([key, value]) => {
                    if (value == null) return;
                    const filterKey = objToJsonFilters[key] || key;
                    queryParams.append(`filters[${filterKey}]`, String(value));
                });
            }

            return mS
                .getData('get', `${url}?${queryParams.toString()}`)
                .then(response => {
                    const results = {
                        data: [],
                        total: 0
                    };


                    console.log('itemService search response', response);

                    results.data = (response.items || []).map((item, index) => {
                        return {
                            index: index + 1,
                            id: item.id,
                            acronymCategory: item.acronymFamily,
                            productId: item.productId,
                            title: item.title,
                            summary: item.summary,
                            imageUrl: item.s3ObjectUrl,
                            description: item.description,
                            code: item.code,
                            measure: item.measure,
                            auxiliaryCode: item.auxiliary_code,
                            costPrice: item.costPrice,
                            nombreSubFamilia: item.category,
                        };
                    });

                    results.total = response.totalCount || 0;


                    return results;
                });
        }

        function getByIdForOrderProduction(productId) {
            let json = JSON.stringify({
                tipo: 4,
                productId,
            });

            return mS.getData('get', `${url}?json=${json}`).then(response => {
                console.log('getByIdForOrderProduction response', response)
                const results = {
                    menu: {},
                    components: []
                }
                if (response.code === "1") {
                    const payload = JSON.parse(response.payload);
                    const menu = payload.menu[0];
                    results.components = (payload.components || []).map(c => {

                        const { fraccionado, principal } = c;

                        const medidas = fS.processAndSortMeasures(principal, fraccionado);

                        return {
                            "idArticulo": c.idArticulo,
                            "codigo": c.codigo,
                            "codigoAuxiliar": c.codigoAuxiliar,
                            "codigoBarra": c.codigoBarra,
                            "descripcion": c.descripcion,
                            "stock": c.stock,
                            precioCosto: c.precioCosto,
                            precioUnitario: c.precioCosto,
                            precioCostoFraccionado: c.precioCosto,
                            "estado": c.estado,
                            "iva": c.iva,
                            "llevaInventario": c.llevaInventario,
                            "idMedida": c.idMedida,
                            nombreMedida: c.medida,
                            "conversion": c.conversion,
                            medidas,
                            uniqueId: c.uniqueId
                        }

                    });

                    const { fraccionado, principal } = menu;

                    const medidas = fS.processAndSortMeasures(principal, fraccionado);

                    results.menu = {
                        idArticulo: menu.idArticulo,
                        codigo: menu.codigo,
                        codigoAuxiliar: menu.codigoAuxiliar,
                        codigoBarra: menu.codigoBarra,
                        descripcion: menu.descripcion,
                        stock: menu.stock,
                        precioCosto: menu.precioCosto,
                        precioCostoFraccionado: menu.precioCosto,
                        precioUnitario: menu.precioCosto,
                        estado: menu.estado,
                        iva: menu.iva,
                        llevaInventario: menu.llevaInventario,
                        idMedida: menu.idMedida,
                        nombreMedida: menu.medida,
                        conversion: menu.conversion,
                        medidas,
                        components: results.components,
                        uniqueId: menu.uniqueId
                    }
                }
                return results;
            });
        }

        function getId(id) {
            return mS.getData('get', `${url}/${id}`).then(response => {
                console.log('itemService getById response', response);
                return response;
            });
        }
    }
}());
