import { SupportService } from '$core/services/mechanical/support-service'
import { hideLoader, showLoader } from "$core/utils/loading-spinner";
import { writable } from 'svelte/store'
import type { Support } from '$core/interfaces/mechanical/support';
import type { Vehicle } from '$core/interfaces/mechanical/vehicle';
import type { Customer } from '$core/interfaces/customer/customer';

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    supports: any;
    parameter: any;
    support: Support;
    vehicle: Vehicle;
    customer: Customer;

};

const initialModalState: StateModal = {
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const initialState: State = {
    supports: [],
    parameter: { establecimientoId: 0, sequence: "" },
    support: {
        id: 0,
        puntoEmisionId: 0,
        vehicleCompanyId: 0,
        userAssignedId: 0,
        customerId: 0,
        supportTypeId: 0,
        date: new Date().toISOString().slice(0, 10),
        sequence: 0,
        obs: "",
    },
    vehicle: {
        id: 0,
        countryId: 0,
        vehicleId: 0,
        vehicleTypeId: 0,
        customerId: 0,
        licensePlate: "",
        brand: "",
        model: "",
        year: 0,
        color: "",
        engine: "",
        chassis: "",
        cylindraje: "",
        enabled: false,
    },
    customer: {
        id: 0,
        idType: "",
        idCard: "",
        businessName: "",
        tradeName: "",
        email: "",
        telephone: "",
        address: "",
    }
};

const cretaeSupport = () => {
    const { set, update, subscribe } = writable<StateModal & State>({
        ...initialState,
        ...initialModalState,
    });

    const get = (params?: object) => {

        let json = { pageIndex: 1, pageSize: 10, tipo: 1 }
        let query = Object.assign(json, params ? params : json);

        update((state) => {
            return {
                ...state,
                supports: []
            }
        });

        SupportService.get(JSON.stringify(query)).then((response) => {
            if (response) {
                update((state) => ({
                    ...state,
                    supports: response["supports"]
                }));
            }
        }).finally(() => {
            hideLoader();
        });
    };


    const getOpenModal = (id?: number) => {


        if (id > 0) {
            showLoader();
            SupportService.get(JSON.stringify({ tipo: 3, id })).then((response) => {
                if (response) {
                    console.log(response["support"][0]);
                    update((state) => ({
                        ...state,
                        isOpen: true,
                        support: response["support"][0],
                        vehicle: response["vehicle"][0],
                        customer: response["customer"][0],
                        parameter: response["paramaters"]["0"],
                    }));
                }
            }).finally(() => {
                hideLoader();
            });
        } else {
            update((state) => ({
                ...state,
                isOpen: true
            }))
        }
    }

    return { set, subscribe, update, get, getOpenModal }
}

export const supportStore = cretaeSupport()