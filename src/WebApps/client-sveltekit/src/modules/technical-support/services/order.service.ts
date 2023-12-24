import { client } from '$utils/axiosClient';

const URL = 'TechnicalSupport/Order/'
type Params = {
    tipo: 1
}

export const orderService = {

    /**
     * Realiza una operación específica basada en el tipo proporcionado.
     *
     * @param {number} tipo - El tipo de operación a realizar.
     *   - 1: Obtiene datos para un formulario de ficha técnica.
     *   - 2: Obtiene un listado de fichas técnicas.
     * @returns {any} - El resultado de la operación.
    */
    get<T extends Params>(params: T) {
        return client.get(URL + '?json=' + JSON.stringify(params)).then(response => {
            const mainData = response.data;
            //Datos para el formulario Ficha Técnica 
            if (params.tipo === 1) {
                const tempEstabsAndPtosEmision = mainData.puntosEmision;
                const bodegas = mainData.bodegas;

                const estabsReducer = tempEstabsAndPtosEmision.reduce((acc, item) => {
                    const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                    if (!existingItem) {
                        acc.push({
                            idEstablecimiento: item.idEstablecimiento,
                            nombreComercial: item.nombreComercial,
                            codEstab: item.codEstab,
                            defaultEstab: item.defaultEstab,
                            puntosEmision: [{
                                idPuntoEmision: item.idPuntoEmision,
                                ptoEmi: item.ptoEmi,
                                defaultPtoEmi: item.defaultPtoEmi
                            }]
                        });
                    } else {
                        existingItem.puntosEmision.push({
                            idPuntoEmision: item.idPuntoEmision,
                            ptoEmi: item.ptoEmi,
                            defaultPtoEmi: item.defaultPtoEmi
                        });
                    }
                    return acc;
                }, []);

                const estabs = estabsReducer.map(estab => {
                    return {
                        ...estab,
                        bodegas: bodegas.filter(bodega => bodega.idEstablecimiento === estab.idEstablecimiento)
                            .map(bodega => ({
                                idBodega: bodega.idBodega,
                                defaultBodega: bodega.defaultBodega,
                                nombreBodega: bodega.bodega
                            }))
                    }
                })

                return {
                    estabs
                }
            }
            throw "El tipo no proporcionado"
        })
    }
}