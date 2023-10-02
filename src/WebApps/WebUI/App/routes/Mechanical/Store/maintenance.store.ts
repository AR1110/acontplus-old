import { writable } from 'svelte/store';
import type { Maintenance } from '$lib/interfaces/mechanical/maintenance';

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    maintenance: Maintenance;
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