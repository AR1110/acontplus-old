import { SupportService } from "$lib/services/mechanical/support-service";
import { hideLoader, showLoader } from "$lib/utils/loading-spinner";
import { writable } from "svelte/store";
import type { Support } from "$lib/interfaces/mechanical/support";
import type { Vehicle } from "$lib/interfaces/mechanical/vehicle";
import type { Customer } from "$lib/interfaces/customer/customer";
import { sharedService } from "$services/shared.service";

type StateModal = {
  isOpen: boolean;
  isApprove: boolean;
  openModal(): void;
  closeModal(): void;
};

type State = {
  supports: any;
  parameter: any;
  support: Support;
  vehicle: Vehicle;
  customer: Customer;
};

const initialModalState: StateModal = {
  isOpen: false,
  isApprove: false,
  openModal: () => {},
  closeModal: () => {},
};

const initialState: State = {
  supports: [],
  parameter: { establecimientoId: 0, sequence: "" },
  support: {
    id: 0,
    puntoEmisionId: 0,
    vehicleCompanyId: 0,
    userAssignedId: 0,
    customerId: 0,
    supportTypeId: 0,
    date: new Date().toISOString().slice(0, 10),
    sequence: 0,
    obs: "",
  },
  vehicle: {
    id: 0,
    countryId: 0,
    vehicleId: 0,
    vehicleTypeId: 0,
    customerId: 0,
    licensePlate: "",
    brand: "",
    model: "",
    year: 0,
    color: "",
    engine: "",
    chassis: "",
    cylindraje: "",
    enabled: false,
  },
  customer: {
    id: 0,
    idType: "",
    idCard: "",
    businessName: "",
    tradeName: "",
    email: "",
    telephone: "",
    address: "",
  },
};

const cretaeSupport = () => {
  const { set, update, subscribe } = writable<StateModal & State>({
    ...initialState,
    ...initialModalState,
  });

  const get = (params?: object) => {
    let json = { pageIndex: 1, pageSize: 10, tipo: 1 };
    let query = Object.assign(json, params ? params : json);

    update((state) => {
      return {
        ...state,
        supports: [],
      };
    });

    SupportService.get(JSON.stringify(query))
      .then((response) => {
        if (response) {
          update((state) => ({
            ...state,
            supports: response["supports"],
          }));
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  const getOpenModal = (id?: number) => {
    if (id > 0) {
      showLoader();
      SupportService.get(JSON.stringify({ tipo: 3, id }))
        .then((response) => {
          if (response) {
            update((state) => ({
              ...state,
              isOpen: true,
              support: response["support"][0],
              vehicle: response["vehicle"][0],
              customer: response["customer"][0],
              parameter: response["paramaters"]["0"],
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
      }));
    }
  };

  const getOpenApproveModal = (id?: number) => {
    update((state) => ({ ...state, isApprove: true }));
  };

  const getReport = (parameters: object) => {
    console.log(parameters);
    sharedService.download(parameters, true);
  };

  return {
    set,
    subscribe,
    update,
    get,
    getOpenModal,
    getOpenApproveModal,
    getReport,
  };
};

export const supportStore = cretaeSupport();
