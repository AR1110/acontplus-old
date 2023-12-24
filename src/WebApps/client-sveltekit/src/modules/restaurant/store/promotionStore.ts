import { estabAsignService } from "$services/restaurant/estab-asign-service";
import { hideLoader, showLoader } from "$utils/loading-spinner";
import { PromotionService } from "$services/restaurant/promotion-service";
import { writable } from "svelte/store";
import type { Promotion } from "$interfaces/restaurant/promotion";

type StateModal = {
  isOpen: boolean;
  openModal(): void;
  closeModal(): void;
};

type State = {
  dataUpdate: Promotion;
  establecimientos: any;
  promotions: any;
  days: any;
  codEstab?: string;
};

const initialState: State = {
  dataUpdate: {
    id: 0,
    codEstab: "",
    description: "",
    startDate: "",
    endDate: "",
    promotionDays: "",
  },
  establecimientos: [],
  promotions: [],
  days: [],
  codEstab: "",
};

const initialModalState: StateModal = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const promotionStore = () => {
  const { set, update, subscribe } = writable<StateModal & State>({
    ...initialModalState,
    ...initialState,
  });

  const get = (params?: object) => {
    console.log("get");
    showLoader();
    update((state) => ({ ...state, promotions: [], days: [] }));

    let json = { pageIndex: 1, pageSize: 9, tipo: 1, ...params };
    PromotionService.get(JSON.stringify(json)).then((response) => {
      if (response) {
        update((state) => ({
          ...state,
          promotions: response["promotions"],
          days: response["days"],
        }));
      }
      hideLoader();
    });
  };

  const getEstablecimiento = () => {
    estabAsignService.get(JSON.stringify({ tipo: 1 })).then((response) => {
      if (response) {
        let codEstab = response[0].codEstab;

        update((state) => ({
          ...state,
          establecimientos: response,
          codEstab: codEstab,
        }));

        get({ codEstab: codEstab });
      }
    });
  };

  const openingModal = (data?: Promotion) => {
    console.log("openingModal");
    update((state) => ({
      ...state,
      isOpen: true,
      dataUpdate: data || initialState.dataUpdate,
    }));
  };

  return {
    set,
    subscribe,
    update,
    get,
    getEstablecimiento,
    openingModal,
  };
};

export const usePromotionStore = promotionStore();
