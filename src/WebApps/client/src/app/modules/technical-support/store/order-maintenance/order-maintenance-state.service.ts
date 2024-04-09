import { Injectable } from '@angular/core';
import { OrderMaintenanceStoreService } from './order-maintenance-store.service';
import { GroupedEstabBodega } from '@core/models/estab.model';
import { OrderMaintenance } from '@modules/technical-support/models/order-maintenance.model';
import { Tarifa } from '@modules/inventory/shared/models/tarifa.model';
import { Impuesto } from '@shared/models/impuesto.model';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';


export interface OrderMaintenanceState {
  orderDetails: any[]
  orderMaintenances: OrderMaintenance[]
  bodegas: Array<GroupedEstabBodega>
  feeds: Tarifa[],
  taxes: Impuesto[],
  taxPercents: TarifaImpuesto[]
}
@Injectable()
export class OrderMaintenanceStateService extends OrderMaintenanceStoreService<OrderMaintenanceState> {
  constructor() {
    super();
  }
}
