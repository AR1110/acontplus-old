import { hideLoader, showLoader } from "$utils/loading-spinner";
import { sharedService } from "$services/shared-service";
import { SupportDetailService } from "$modules/mechanical/services/support-detail-service";
import { SupportService } from "$modules/mechanical/services/support-service";
import { writable } from "svelte/store";
import type { Customer } from "$modules/sales/interfaces/customer";
import type { Support } from "$modules/mechanical/interfaces/support";
import type { Vehicle } from "$modules/mechanical/interfaces/vehicle";

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
  supportDetails: any;
  establishments: any;
  measures: any;
  warehouses: any;
  tipoIva: any;
  decimals: any;
  ptoEmisiones: any;
  tiempoCreditos: any;
  tarifaImpuestos: any;
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
    status: 1,
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
  supportDetails: [],
  establishments: [],
  measures: [],
  warehouses: [],
  tipoIva: [],
  decimals: [],
  ptoEmisiones: [],
  tiempoCreditos: [],
  tarifaImpuestos: [],
};

const cretaeSupport = () => {
  const { set, update, subscribe } = writable<StateModal & State>({
    ...initialState,
    ...initialModalState,
  });

  const get = (params?: object) => {
    showLoader();

    const json = { pageIndex: 1, pageSize: 10, tipo: 1 };
    const query = Object.assign(json, params ? params : json);

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
    showLoader();

    SupportDetailService.get(JSON.stringify({ tipo: 1, id }))
      .then((response) => {
        if (response) {
          update((state) => ({
            ...state,
            isApprove: true,
            support: response["support"][0],
            supportDetails: response["supportDetail"],
            measures: response["medidas"],
            establishments: response["establecimiento"],
            warehouses: response["bodega"],
            tipoIva: response["tipoIva"],
            decimals: response["decimal"],
            ptoEmisiones: response["ptoEmision"],
            tiempoCreditos: response["tiempoCredito"],
            tarifaImpuestos: response["tarifaImpuesto"],
          }));
        }
      })
      .finally(() => {
        hideLoader();
      });
  };

  const getReport = (parameters: object) => {
    sharedService.download(parameters);
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
