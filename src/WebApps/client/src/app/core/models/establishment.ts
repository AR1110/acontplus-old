import { EmissionPointEstablishment } from '@core/models/emission-point';
import { WarehouseEstablishment } from '@core/models/warehouse';

export interface GroupedEstablishment {
  id: number;
  tradeName: string;
  code: string;
  isDefault: boolean;
  email?: string;
  emissionPoints: EmissionPointEstablishment[];
  warehouses: WarehouseEstablishment[];
}
