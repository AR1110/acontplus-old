import { isApiResponse } from '$interfaces/structure-response';
import { client } from '$utils/axiosClient';
import { groupEstabAndCreatePtoEmisionNodes } from '$utils/utils'
const URL = 'Contabilidad/CuentaPorCobrar/'

export const cuentaPorCobrarService = {
    get<T extends { tipo: number }>(params: T) {
        return client.get(`${URL}?json=${JSON.stringify(params)}`).then((axiosResponse) => {
            const response = axiosResponse.data;
            if (isApiResponse(response)) {
                if (response.code === "1") {
                    const mainData = JSON.parse(response.payload)
                    if (params.tipo === 6) {
                        const tempEstabs = mainData[0];
                        const estadosDoc = mainData[1];
                        const estabs = groupEstabAndCreatePtoEmisionNodes(tempEstabs)
                        return {
                            estabs,
                            estadosDoc
                        }
                    }
                } else {
                    console.log(response)
                }
            }
        })
    }
}