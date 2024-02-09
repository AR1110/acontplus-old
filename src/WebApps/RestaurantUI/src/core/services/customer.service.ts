
import { PATHS, PATHS_API } from "@/core/constants"
import { Http, searchFetch } from "@/core/utilities"
import { ApiResponse, CustomerReadDto } from "@/core/models"
import { customerReadAdapter, dataFormReadAdapter } from "../adapters"
import Swal from "sweetalert2"

const url = `${PATHS_API.CUSTOMER}${PATHS.COMPANY_CUSTOMER}`
const customerService = {
    async getDataForm() {
        const resultAxios = await Http({
            method: 'get',
            url: `${url}`,
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
            url: `${url}GetId/` + id
        })
        const response: ApiResponse = resultAxios.data;
        const mainDataRepository = JSON.parse(response.payload)[0];
        const resultData = customerReadAdapter(mainDataRepository);
        return resultData;

    },
    async post(data: object) {
        const resultAxios = await Http({
            method: 'post',
            url: `${url}`,
            data: { data }
        })
        const response: ApiResponse = resultAxios.data;

        return response;
    },
    async put(id: number, data: object) {
        const resultAxios = await Http({
            method: 'put',
            url: `${url}${id}`,
            data: { data }
        })
        const response: ApiResponse = resultAxios.data;
        return response;
    },
    search: async (textSearch: string) => {
        try {
            const resultAxios = await searchFetch(
                `${url}Search`,
                {
                    json: JSON.stringify({ textSearch })
                }
            )
            const response: ApiResponse = resultAxios?.data;
            const dataApi = response?.payload ? JSON.parse(response.payload) as [] : []
            return customerReadAdapter(dataApi)
        } catch (error) {
            console.log('')
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
            url: `${url}`,
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
    },

    /**
     * 
     * @param query {tipo: 3, textSearch: '}
     * @returns devuelve true si el cliente esta registrado y sino false 
     */
    async getByICard<T extends { textSearch: string }>(query: T): Promise<CustomerReadDto> {
        const resultAxios = await Http({
            method: 'get',
            url: `${url}`,
            params: {
                json: JSON.stringify(Object.assign({ tipo: 3 }, query))
            }
        })
        const response: ApiResponse = resultAxios.data;
        if (response.code === "0") {
            const data: CustomerReadDto = {
                customerCompanyId: 0,
                fiscalName: "",
                tradeName: "",
                identificationNumber: "",
                correo: "",
                telefono: "",
                direccion: ""
            }
            return data;
        }
        const clienteRepository = JSON.parse(response.payload)[0][0]
        return customerReadAdapter(clienteRepository)
    }


}

export {
    customerService
}