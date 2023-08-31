import { writable } from "svelte/store";
import { itemService } from "$core/services/restaurant/item-service";
import { hideLoader, showLoader } from "$core/utils/loading-spinner";
import { IngredientService } from "$core/services/restaurant/ingredient-service";
import { productionAreaService } from "$core/services/restaurant/production-area-service";
import type { Item } from "$core/interfaces/restaurant/item";
import { RecipeService } from "../../../core/services/restaurant/recipe-service";

type StateModal = {
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
};
const initiatlModalState: StateModal = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const createItemStore = () => {
  const { set, update, subscribe, ...rest } = writable<StateModal & State>({
    ...initiatlState,
    ...initiatlModalState,
  });

  const get = (params?: object) => {
    showLoader();
    let json = { pageIndex: 1, pageSize: 10, tipo: 1 };

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

  const getIngredient = () => {
    IngredientService.get(JSON.stringify({ pageIndex: 1, pageSize: 10 }))
      .then((response) => {
        hideLoader();
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
