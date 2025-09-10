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
        function search(obj) {
            let json = JSON.stringify({
                tipo: 2,
                textSearch: obj.textSearch,
            });
            return mS.getData('get', `${url}?json=${json}`).then(response => {
                const results = {
                    data: [],
                    total: 0
                }
                if (response.code === "1") {
                    const payload = JSON.parse(response.payload);
                    const items = (payload.items || []).map(i => {
                        return {
                            "productId": i.idArticulo,
                            "code": i.codigo,
                            "stock": i.stock,
                            "menuId": i.menuId,
                            "summary": i.summary,
                            "content": i.content,
                        }

                    });
                    results.data = items;
                }
                return results;
            })
        }
        function getByIdForOrderProduction(menuId) {
            let json = JSON.stringify({
                tipo: 4,
                menuId,
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
                            "precioCosto": c.precioCosto,
                            "estado": c.estado,
                            "iva": c.iva,
                            "llevaInventario": c.llevaInventario,
                            "idMedida": c.idMedida,
                            nombreMedida: c.medida,
                            "conversion": c.conversion,
                            medidas
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
                        estado: menu.estado,
                        iva: menu.iva,
                        llevaInventario: menu.llevaInventario,
                        idMedida: menu.idMedida,
                        nombreMedida: menu.medida,
                        conversion: menu.conversion,
                        medidas,
                        components: results.components
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
