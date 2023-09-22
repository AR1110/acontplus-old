import { writable } from 'svelte/store';

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    maintenance: any;
};

const initialModalState: StateModal = {
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const initialState: State = {
    maintenance: [],
};

const createMaintenance = () => {
    const { set, update, subscribe } = writable<StateModal & State>({
        ...initialState,
        ...initialModalState,
    });

    const getOpenModal = (id?: number) => {
        update((state) => ({
            ...state,
            isOpen: true,

        }));
    }

    return { set, subscribe, update, getOpenModal }
}

export const MaintenanceStore = createMaintenance()