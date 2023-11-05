import { PATHS } from "@/core/constants"
import { Http, searchFetch } from "@/core/utilities"
import { ApiResponse} from "@/core/models"
import { customerReadAdapter, dataFormReadAdapter } from "../adapters"
import Swal from "sweetalert2"

const URL = 'Cliente/'
const customerService = {
    async getDataForm() {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.SALE}${URL}Get`,
            params: {
                json: JSON.stringify({ tipo: 2 })
            }
        })
        const response: ApiResponse = resultAxios.data;
        const mainDataRepository = JSON.parse(response.payload)

        const obj = {
            tipoIdentificacion: mainDataRepository[0],
            tipoContribuyentes: mainDataRepository[1],
            tiempoCreditos: mainDataRepository[2],
        }
        const dataForm = dataFormReadAdapter(obj);
        return dataForm;

    },
    async getId(id: number) {
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.SALE}${URL}FindById/` + id
        })
        const response: ApiResponse = resultAxios.data;
        const mainDataRepository = JSON.parse(response.payload)[0]; 
        const resultData = customerReadAdapter(mainDataRepository);
        return resultData;

    },
    async post(data: object) {
        const resultAxios = await Http({
            method: 'post',
            url: `${PATHS.SALE}${URL}Insert`,
            data
        })
        const response: ApiResponse = resultAxios.data;

        return response;
    },
    async put(id: number, data: object) {
        const resultAxios = await Http({
            method: 'put',
            url: `${PATHS.SALE}${URL}Update/${id}`,            
            data
        }) 
        const response: ApiResponse = resultAxios.data;
        return response;
    },
    search: async (textSearch: string) => {
        try {
            const resultAxios = await searchFetch(
                `${PATHS.SALE}${URL}Search`,
                {
                    json: JSON.stringify({ textSearch })
                }
            ) 
            const response: ApiResponse = resultAxios?.data;     
            const dataApi = response?.payload ? JSON.parse(response.payload) as [] : []      
            return customerReadAdapter(dataApi)
        } catch (error) {
            console.log(error)
            throw error;
        }
    },



    /**
     * 
     * @param query {tipo: 3, textSearch: '}
     * @returns devuelve true si el cliente esta registrado y sino false 
     */
    async isCustomerRegistered(query: object): Promise<boolean> {
        let isRegistered = false;
        const resultAxios = await Http({
            method: 'get',
            url: `${PATHS.SALE}${URL}Get`,
            params: {
                json: JSON.stringify(Object.assign({ tipo: 3 }, query))
            }
        })
        const response: ApiResponse = resultAxios.data;
        if (response.code === "1") {
            isRegistered = true;
            const clienteRepository = JSON.parse(response.payload)[0][0];
            await Swal.fire({
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
                focusConfirm: true,
                allowEscapeKey: true
            })
        }

        return isRegistered;
    }


}

export {
    customerService
}