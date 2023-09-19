import { writable } from 'svelte/store';
import { hideLoader, showLoader } from "$core/utils/loading-spinner";
import { InspectionService } from '$core/services/mechanical/inspection-service';
import type { Inspection } from '$core/interfaces/mechanical/inspection';

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    maintenance: any;
    vehicleParts: any;
    support: any;
    inspection: Inspection;
};

const initialModalState: StateModal = {
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const initialState: State = {
    maintenance: [],
    vehicleParts: [],
    support: [],
    inspection: {
        id: 0,
        supportId: 0,
        date: new Date().toISOString().slice(0, 10),
        mileage: '',
        fuelLevel: '',
        engine: '',
        transmission: '',
        brake: '',
        steering: '',
        suspension: '',
        obs: '',
        enabled: true
    },
};

const createInspection = () => {
    const { set, update, subscribe } = writable<StateModal & State>({
        ...initialState,
        ...initialModalState,
    });

    const getOpenModal = (id?: number) => {
        showLoader();
        InspectionService.get(JSON.stringify({ tipo: 3, supportId: id })).then((response) => {
            if (response) {
                update((state) => ({
                    ...state,
                    isOpen: true,
                    support: response["support"][0],
                    vehicleParts: response["vehicleParts"],
                }));
            }
        }).finally(() => {
            hideLoader();
        });
    }



    return { set, subscribe, update, getOpenModal }
}

export const InspectionStore = createInspection()