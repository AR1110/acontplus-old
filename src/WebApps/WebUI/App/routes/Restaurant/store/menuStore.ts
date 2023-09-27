import type { Menu } from "$core/interfaces/restaurant/menu";
import { writable } from "svelte/store";
import { hideLoader, showLoader } from "$core/utils/loading-spinner";
import { MenuService } from "$core/services/restaurant/menu-service";

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    menus: any;
    dataUpdate: Menu;
    menuTypes: any;
};

const initialState: State = {
    menus: [],
    dataUpdate: {
        id: 0,
        productId: 0,
        title: "",
        summary: "",
        typeId: 0,
        content: "",
        forPromotion: false,
    },
    menuTypes: [],
};

const initialModalState: StateModal = {
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const menuStore = () => {
    const { set, update, subscribe } = writable<StateModal & State>({
        ...initialState,
        ...initialModalState,
    });

    const get = () => {
        showLoader();
        update((state) => ({ ...state, menus: [], menuTypes: [] }));

        MenuService.get(JSON.stringify({ tipo: 1 }))
            .then((response) => {
                update((state) => ({
                    ...state,
                    menus: response["menus"],
                    menuTypes: response["menuTypes"],
                }));
            })
            .finally(() => {
                hideLoader();
            });
    };

    const openingModal = (menu?: Menu) => {
        update((state) => ({
            ...state,
            isOpen: true,
            dataUpdate: menu,
        }));
    };

    return { set, subscribe, update, get, openingModal };
};

export const useMenuStore = menuStore();
