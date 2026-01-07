(function () {
    'use strict';
    app.factory('itemService', itemService);
    itemService.$inject = ['mainService', 'formulario'];
    function itemService(mS, fS) {
        var url = 'restaurant/item/';

        var service = {
            search,
            getByIdForOrderProduction
        };
        return service;
        function search(params) {
            const queryParams = new URLSearchParams({
                pageIndex: params.pageIndex?.toString() ?? '0',
                pageSize: params.pageSize?.toString() ?? '10',
                tipo: '2'
            });

            if (params.textSearch) {
                queryParams.append('textSearch', params.textSearch);
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

                    if (response.code === "1") {
                        const payload = JSON.parse(response.payload);

                        results.data = (payload.items || []).map(i => ({
                            productId: i.productId,
                            description: i.descripcion,
                            nombreSubFamilia: i.subFamilia,
                            code: i.codigo
                        }));

                        results.total = payload.total ?? 0;
                    }

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
        function createItem(item) {
            var url = configService.apiUrl + 'restaurant/items';

            return $http.post(url, item, { headers: headers });
        }
        function updateItem(id, item) {
            var url = configService.apiUrl + 'restaurant/items/' + id;

            return $http.put(url, item, { headers: headers });
        }
        function deleteItem(id) {
            var url = configService.apiUrl + 'restaurant/items/' + id;

            return $http.delete(url, { headers: headers });
        }
    }
}());
