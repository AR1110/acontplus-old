import { Injectable } from '@angular/core';
import { GroupedEstabBodega } from '@core/models/estab.model';
import { OrderMaintenance } from '@modules/technical-support/models/order-maintenance.model';
import { Tarifa } from '@inventory/data/models/tarifa.model';
import { Impuesto } from '@shared/models/impuesto.model';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { GenericStoreSignalService } from '@shared/services/generic-store-signal.service';
import { DecimalSale } from '@sale/domain/models/decimal-sale.model';

export interface OrderMaintenanceState {
  orderDetails: any[];
  orderMaintenances: OrderMaintenance[];
  bodegas: GroupedEstabBodega[];
  feeds: Tarifa[];
  taxes: Impuesto[];
  taxPercents: TarifaImpuesto[];
  decimal: DecimalSale;
}
@Injectable()
export class OrderMaintenanceStateService extends GenericStoreSignalService<OrderMaintenanceState> {
  constructor() {
    super();
  }
}
