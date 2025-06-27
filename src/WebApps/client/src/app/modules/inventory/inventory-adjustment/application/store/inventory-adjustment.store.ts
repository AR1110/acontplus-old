import {InventoryAdjustmentFormDataResponse} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";
import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";


class InventoryAdjustmentState {
  mainFormData:InventoryAdjustmentFormDataResponse = {
    decimal:  {},
    estabs: [],
    subFamilias: [],
    tiposDoc: [],
    tiposTransaccion: []
  }
}

export const InventoryAdjustmentStore = signalStore(
  {providedIn: 'root'},
  withState(new InventoryAdjustmentState()),
  withMethods(store => ({

    setMainFormData(params: InventoryAdjustmentFormDataResponse) {
      patchState(store, {
        mainFormData: params,
      })
    }

  }))
)
