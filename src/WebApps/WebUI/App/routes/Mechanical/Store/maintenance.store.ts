import { writable } from 'svelte/store';
import { hideLoader, showLoader } from "$core/utils/loading-spinner";
import { MaintenanceService } from '$core/services/mechanical/maintenance-service';
import type { Maintenance } from '$core/interfaces/mechanical/maintenance';

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    maintenance: Maintenance;
    maintenanceDetail: any;
};

const initialModalState: StateModal = {
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const initialState: State = {
    maintenance: {
        id: 0,
        inspectionId: 0,
        date: new Date().toISOString().slice(0, 10),
        obs: ''
    },
    maintenanceDetail: [],
};

const createMaintenance = () => {
    const { set, update, subscribe } = writable<StateModal & State>({
        ...initialState,
        ...initialModalState,
    });

    const getOpenModal = (id?: number, inspectionId?) => {
        if (id > 0) {
            showLoader();
            MaintenanceService.get(JSON.stringify({ tipo: 2, id })).then((response) => {
                if (response) {
                    update((state) => ({
                        ...state,
                        isOpen: true,
                        maintenance: response["maintenance"][0],
                        maintenanceDetail: response["maintenanceDetail"],
                    }));
                }
            }).finally(() => {
                hideLoader();
            });
        } else {
            update((state) => ({
                ...state,
                isOpen: true,
                maintenance: {
                    id: 0,
                    inspectionId: inspectionId,
                    date: new Date().toISOString().slice(0, 10),
                    obs: ''
                },
                maintenanceDetail: []
            }));
        }
    }

    return { set, subscribe, update, getOpenModal }
}

export const MaintenanceStore = createMaintenance()