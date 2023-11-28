import { writable } from "svelte/store";
import { hideLoader, showLoader } from "@/lib/utils/loading-spinner";
import { InspectionService } from "@/lib/services/mechanical/inspection-service";
import type { Inspection } from "@/lib/interfaces/mechanical/inspection";
import { sharedService } from "@/lib/services/shared.service";

type StateModal = {
  isOpen: boolean;
  openModal(): void;
  closeModal(): void;
};

type State = {
  maintenance: any;
  vehicleParts: any;
  support: any;
  inspection: Inspection;
};

const initialModalState: StateModal = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const initialState: State = {
  maintenance: [],
  vehicleParts: [],
  support: [],
  inspection: {
    id: 0,
    supportId: 0,
    date: new Date().toISOString().slice(0, 10),
    mileage: 0,
    fuelLevel: "",
    engine: "",
    cabin: "",
    bearing: "",
    transmission: "",
    lighting: "",
    brake: "",
    steering: "",
    suspension: "",
    obs: "",
    enabled: true,
  },
};

const createInspection = () => {
  const { set, update, subscribe } = writable<StateModal & State>({
    ...initialState,
    ...initialModalState,
  });

  const getOpenModal = (id?: number, supportId?: number) => {
    if (id > 0) {
      showLoader();
      InspectionService.get(JSON.stringify({ tipo: 2, id }))
        .then((response) => {
          if (response) {
            update((state) => ({
              ...state,
              isOpen: true,
              inspection: response["inspection"][0],
              support: response["support"][0],
            }));
          }
        })
        .finally(() => {
          hideLoader();
        });
    } else {
      showLoader();
      InspectionService.get(JSON.stringify({ tipo: 3, supportId: supportId }))
        .then((response) => {
          if (response) {
            update((state) => ({
              ...state,
              isOpen: true,
              support: response["support"][0],
              vehicleParts: response["vehicleParts"],
            }));
          }
        })
        .finally(() => {
          hideLoader();
        });
    }
  };

  const getReport = (parameters: object) => {
    sharedService.download(parameters);
  };

  return { set, subscribe, update, getOpenModal, getReport };
};

export const InspectionStore = createInspection();
