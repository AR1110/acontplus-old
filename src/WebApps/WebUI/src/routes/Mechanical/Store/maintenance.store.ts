import { writable } from "svelte/store";
import { hideLoader, showLoader } from "@/lib/utils/loading-spinner";
import { SupportDetailService } from "@/lib/services/Mechanical/support-detail-service";
import type { Support } from "@/lib/interfaces/mechanical/support";

type StateModal = {
  isOpen: boolean;
  openModal(): void;
  closeModal(): void;
};

type State = {
  support: Support;
  supportDetail: any;
  establecimiento: any;
  bodega: any;
  medidas: any;
};

const initialModalState: StateModal = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const initialState: State = {
  support: {
    id: 0,
    puntoEmisionId: 0,
    vehicleCompanyId: 0,
    customerId: 0,
    supportTypeId: 0,
    date: new Date().toISOString().slice(0, 10),
    sequence: 0,
    obs: "",
    userAssignedId: 0,
  },
  supportDetail: [],
  establecimiento: [],
  bodega: [],
  medidas: [],
};

const createMaintenance = () => {
  const { set, update, subscribe } = writable<StateModal & State>({
    ...initialState,
    ...initialModalState,
  });

  const getOpenModal = (id?: number, supportId?) => {
    if (id > 0) {
      showLoader();
      SupportDetailService.get(JSON.stringify({ tipo: 1, id }))
        .then((response) => {
          if (response) {
            update((state) => ({
              ...state,
              isOpen: true,
              support: response["support"][0],
              supportDetail: response["supportDetail"],
              medidas: response["medidas"],
              establecimiento: response["establecimiento"],
              bodega: response["bodega"],
            }));
          }
        })
        .finally(() => {
          hideLoader();
        });
    } else {
      update((state) => ({
        ...state,
        isOpen: true,
        maintenance: {
          id: 0,
          supportId: supportId,
          date: new Date().toISOString().slice(0, 10),
          obs: "",
        },
        supportDetail: [],
      }));
    }

    // SupportDetailService.get(JSON.stringify({ tipo: 2, supportId }))
    //   .then((response) => {
    //     if (response) {
    //       update((state) => ({
    //         ...state,
    //         isOpen: true,
    //         establecimiento: response["establecimiento"],
    //         bodega: response["bodega"],
    //       }));
    //     }
    //   })
    //   .finally(() => {
    //     hideLoader();
    //   });
  };

  return { set, subscribe, update, getOpenModal };
};

export const MaintenanceStore = createMaintenance();
