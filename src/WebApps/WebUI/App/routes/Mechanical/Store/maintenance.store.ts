import type { Maintenance } from "$interfaces/mechanical/maintenance";
import { MaintenanceService } from "$services/mechanical/maintenance-service";
import { writable } from "svelte/store";
import { hideLoader, showLoader } from "$utils/loading-spinner";

type StateModal = {
  isOpen: boolean;
  openModal(): void;
  closeModal(): void;
};

type State = {
  maintenance: Maintenance;
  maintenanceDetail: any;
  establecimiento: any;
  bodega: any;
};

const initialModalState: StateModal = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const initialState: State = {
  maintenance: {
    id: 0,
    inspectionId: 0,
    date: new Date().toISOString().slice(0, 10),
    obs: "",
  },
  maintenanceDetail: [],
  establecimiento: [],
  bodega: [],
};

const createMaintenance = () => {
  const { set, update, subscribe } = writable<StateModal & State>({
    ...initialState,
    ...initialModalState,
  });

  const getOpenModal = (id?: number, inspectionId?) => {
    if (id > 0) {
      showLoader();
      MaintenanceService.get(JSON.stringify({ tipo: 2, id }))
        .then((response) => {
          if (response) {
            update((state) => ({
              ...state,
              isOpen: true,
              maintenance: response["maintenance"][0],
              maintenanceDetail: response["maintenanceDetail"],
            }));
          }
        })
        .finally(() => {
          hideLoader();
        });
    }

    showLoader();
    MaintenanceService.get(JSON.stringify({ tipo: 3, inspectionId }))
      .then((response) => {
        console.log(response);
        if (response) {
          update((state) => ({
            ...state,
            isOpen: true,
            maintenance: {
              id: 0,
              inspectionId: inspectionId,
              date: new Date().toISOString().slice(0, 10),
              obs: "",
            },
            maintenanceDetail: [],
            establecimiento: response["establecimiento"],
            bodega: response["bodega"],
          }));
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  return { set, subscribe, update, getOpenModal };
};

export const MaintenanceStore = createMaintenance();
