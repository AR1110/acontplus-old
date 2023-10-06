import { writable, get } from "svelte/store";
import { hideLoader } from '$lib/utils/loading-spinner';
import { categoryService } from "../services/category.service";
import { showLoader } from "$utils/loading-spinner";
import tS from "$utils/toast";
import { deviceService } from "../services/device.service";
import { estabAsignService } from "$services/restaurant/estab-asign-service";

//Start Tech Spec 
type Data = {
    establecimientoId: number
    puntoEmisionId: number
    customerCompanyId: number
    deviceId: number
    createdAt: string
}

type State = {
    data: Data
}
//End Tech Spec 

//Start Device 
type Category = {
    code: string
    name: string
    id: number
}

type Device = {
    id: number
    categoryId: number
    name: string
    serie: string
    marca: string
    model: string
    year: number
    warranty: number
    color: string
    specs: string
}
//End Device  

type DeviceState = {
    categories: Array<Category>,
    dataDevice: Device
}
const data: Data = {
    customerCompanyId: 0,
    deviceId: 0,
    establecimientoId: 0,
    puntoEmisionId: 0,
    createdAt: new Date().toISOString().slice(0, 10),
}

const initialState: State = {
    data: structuredClone(data)
}

const dataDevice = {
    id: 0,
    categoryId: 0,
    name: '',
    serie: '',
    marca: '',
    model: '',
    year: 0,
    warranty: 0,
    color: '',
    specs: ""
}
const initialDeviceState: DeviceState = {
    categories: [],
    dataDevice: structuredClone(dataDevice)
}


export const techSpecStore = writable<State & DeviceState>({ ...initialState, ...initialDeviceState });

/**
 * se ejecuta al cargar component TechSpecDialog
 */
export const initiload = async () => {
    try {
        showLoader();
        categoryService.get().then(response=>{
            techSpecStore.update(state => {
                state.categories = response;
                return state;
            })
        })

        estabAsignService.get(JSON.stringify({})).then(response=>{
            console.log(response)
        })

        hideLoader();
    } catch (error) {
        console.log(error)
    }
}

export const setCustomerCompanyId = (id) => {
    techSpecStore.update(state => {
        state.data.customerCompanyId = id;
        return state;
    })
}


export const saveDevice = () => {
    try {
        const { data, dataDevice } = get(techSpecStore)

        if (!(dataDevice.categoryId > 0)) {
            tS({
                type: 'warning',
                message: 'Seleccione la Categoría'
            })
            return
        }

        if (!dataDevice.name || dataDevice.name === "") {
            tS({
                type: 'warning',
                message: 'Ingrese el nombre del Producto'
            })
            return
        }

        if (!dataDevice.serie || dataDevice.serie === "") {
            tS({
                type: 'warning',
                message: 'Ingrese el IMEI/SERIE'
            })
            return
        }
        if (!(data.deviceId > 0)) {
            showLoader();
            deviceService.post(dataDevice).then(response => {
                if (response) {
                    tS({
                        type: "success",
                        message: response.message
                    })
                    techSpecStore.update(state => {
                        state.data.deviceId = response.id;
                        state.dataDevice.id = response.id;
                        return state;
                    })
                } else {
                    tS({
                        type: 'warning',
                        message: response?.data
                    })
                }
            }).finally(() => hideLoader())
        }
        if (data.deviceId > 0) {
            showLoader();
            deviceService.put(data.deviceId, dataDevice).then(response => {
                console.log(response)
                if (response.status === 200) {
                    tS({
                        type: "success",
                        message: response.data
                    })
                } else {
                    tS({
                        type: "success",
                        message: response.data
                    })
                }
            }).finally(() => hideLoader())
        }
    } catch (error) {
        console.log(error)
    }
}

export const resetFormDevice = () => {
    techSpecStore.update(state => {
        state.dataDevice = structuredClone(dataDevice);
        state.data.deviceId = 0;
        return state;
    })
}

export const resetFormMain = () => {
    techSpecStore.update(state => {
        state.data = structuredClone(data);
        state.dataDevice = structuredClone(dataDevice)
        return state;
    })
}