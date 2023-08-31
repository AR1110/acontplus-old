import { VehicleService } from '$core/services/Mechanical/vehicle-service'
import { writable } from 'svelte/store'

const cretaeVehicle = () => {
    const { subscribe, set, update } = writable([])

    return {
        subscribe,
        get: (json?: object) => {
            let obj = { tipo: 1 }
            obj = Object.assign(obj, json ? json : obj)
            VehicleService.get(JSON.stringify(obj)).then((response) => {
                if (response) {
                    console.log('response')
                    update(state => state = response.vehicles)
                }
            });
        },
    }

}

export const vehicleStore = cretaeVehicle()