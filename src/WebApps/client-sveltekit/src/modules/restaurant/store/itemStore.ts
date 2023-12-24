import { writable } from "svelte/store";
import { itemService } from "$services/restaurant/item-service";
import { hideLoader, showLoader } from "$utils/loading-spinner";
import { IngredientService } from "$services/restaurant/ingredient-service";
import { productionAreaService } from "$services/restaurant/production-area-service";
import type { Item } from "$interfaces/restaurant/item";
import { RecipeService } from "$services/restaurant/recipe-service";
import type { Ingredient } from "$interfaces/restaurant/ingredient";

type StateModal = {
    description: string;
    isOpen: boolean;
    openModal(): void;
    closeModal(): void;
};
type State = {
    items: any;
    ingredientes: [];
    productionAreas: [];
    recipes: any;
    dataUpdate: Item;
    setIngredient: Ingredient;
};
const initiatlState: State = {
    items: [],
    ingredientes: [],
    productionAreas: [],
    recipes: [],
    dataUpdate: {
        id: 0,
        summary: "",
        cooking: false,
        recipe: "",
        instructions: "",
        content: "",
        createdAt: "",
        updatedAt: "",
        enabled: false,
        deleted: false,
        userId: 0,
        productId: 0,
        descripcion: "",
        s3ObjectUrl: "",
        stockMinimo: 0,
        stock: 0,
        codigo: "",
        codigoAuxiliar: "",
        tipoIva: "",
        tipoArticulo: "",
        style: "",
        productionAreaId: 0,
        descriptionProductionArea: "",
        totalRecords: 0,
    },
    setIngredient: {
        id: 0,
        productId: 0,
        productDescription: "",
        s3ObjectUrl: "",
        summary: "",
        quantity: 0,
        unit: 0,
        content: "",
        ingredientTypeId: 0,
    },
};
const initiatlModalState: StateModal = {
    description: "",
    isOpen: false,
    openModal: () => { },
    closeModal: () => { },
};

const createItemStore = () => {
    const { set, update, subscribe, ...rest } = writable<StateModal & State>({
        ...initiatlState,
        ...initiatlModalState,
    });

    const get = (params?: object) => {
        showLoader();
        let json = { pageIndex: 1, pageSize: 9, tipo: 1 };


        let query = Object.assign(json, params ? params : json);
        update((state) => {
            return {
                ...state,
                items: [],
            };
        });
        itemService
            .get(JSON.stringify(query))
            .then((response) => {
                if (response) {
                    update((state) => ({
                        ...state,
                        items: response["items"],
                    }));
                }
            })
            .finally(() => {
                hideLoader();
            });
    };

    const getProductionArea = () => {
        showLoader();
        productionAreaService
            .get()
            .then((response) => {
                if (response) {
                    update((state) => ({
                        ...state,
                        productionAreas: response,
                    }));
                }
            })
            .finally(() => {
                hideLoader();
            });
    };

    const getIngredient = (params?: object) => {
        let json = { pageIndex: 1, pageSize: 10 };
        let query = Object.assign(json, params ? params : json);

        update((state) => {
            return { ...state, ingredientes: [] };
        });

        IngredientService.get(JSON.stringify(query))
            .then((response) => {
                hideLoader();
                console.log(response);
                if (response) {
                    update((state) => ({
                        ...state,
                        ingredientes: response["ingredients"],
                    }));
                }
            })
            .finally(() => {
                hideLoader();
            });
    };

    const getRecipe = (item: any) => {
        RecipeService.getByItem(item.id)
            .then((response) => {
                hideLoader();
                if (response) {
                    update((state) => ({
                        ...state,
                        recipes: response["recipe"],
                        isOpen: true,
                        dataUpdate: item,
                        description: item.descripcion,
                    }));
                } else {
                    update((state) => ({
                        ...state,
                        recipes: [],
                        isOpen: true,
                        dataUpdate: item,
                    }));
                }
            })
            .finally(() => {
                hideLoader();
            });
    };


    return {
        set,
        subscribe,
        update,
        get,
        getIngredient,
        getProductionArea,
        getRecipe,
    };
};

export const useItemStore = createItemStore();
