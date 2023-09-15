import { writable } from 'svelte/store';
import { hideLoader, showLoader } from "$core/utils/loading-spinner";
import { MaintenanceService } from '$core/services/mechanical/maintenance-service';

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    maintenance: any;
    support: any;
};

const initialModalState: StateModal = {
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const initialState: State = {
    maintenance: [],
    support: [],
};

const createMaintenance = () => {
    const { set, update, subscribe } = writable<StateModal & State>({
        ...initialState,
        ...initialModalState,
    });

    const getOpenModal = (id?: number) => {
        showLoader();
        MaintenanceService.get(JSON.stringify({ tipo: 3, supportId: id })).then((response) => {
            if (response) {
                update((state) => ({
                    ...state,
                    isOpen: true,
                    support: response["support"][0],
                }));
            }
        }).finally(() => {
            hideLoader();
        });
    }



    return { set, subscribe, update, getOpenModal }
}

export const MaintenanceStore = createMaintenance()