import { writable } from "svelte/store";
import { hideLoader, showLoader } from "$utils/loading-spinner";
import { IngredientService } from "$modules/restaurant/services/ingredient-service";
import { itemService } from "$modules/restaurant/services/item-service";
import type { Ingredient } from "$modules/restaurant/interfaces/ingredient";

type StateModal = {
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};

type State = {
    ingredients: any;
    ingredientType: any,
    dataUpdate: Ingredient
};

const initialModalState: StateModal = {
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const initialState: State = {
    ingredients: [],
    ingredientType: [],
    dataUpdate: {
        id: 0,
        productId: 0,
        productDescription: "",
        summary: "",
        quantity: 0,
        unit: 0,
        content: "",
        ingredientTypeId: 0,
    }
};

const createIngredientStore = () => {
    const { set, update, subscribe } = writable<StateModal & State>({
        ...initialState,
        ...initialModalState,
    });

    const get = (params?: object) => {
        showLoader();

        let json = { pageIndex: 1, pageSize: 10, tipo: 1 }
        let query = Object.assign(json, params ? params : json);

        update((state) => {
            return {
                ...state,
                ingredients: []
            }
        });

        IngredientService.get(JSON.stringify(query)).then((response) => {
            if (response) {
                update((state) => ({
                    ...state,
                    ingredients: response["ingredients"],
                    ingredientType: response["ingredientTypes"]
                }));
            }
        }).finally(() => {
            hideLoader();
        });
    };

    //const getIngredientType = () => {
    //  showLoader();
    //  itemService.get(JSON.stringify({ tipo: 2 })).then((response) => {
    //    if (response) {
    //      debugger
    //      update((state) => ({
    //        ...state,
    //        ingredientType: response["ingredientType"]
    //      }));
    //    }
    //  }).finally(() => {
    //    hideLoader();
    //  });
    //}

    const getUpdate = (data: any) => {
        update((state) => ({
            ...state,
            isOpen: true,
            dataUpdate: data,
        }))
    }

    return { set, subscribe, update, get, getUpdate }
};

export const useIngredientStore = createIngredientStore();
