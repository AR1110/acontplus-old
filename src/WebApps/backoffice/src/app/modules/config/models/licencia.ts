import { LicenciaDetalle } from "./licencia-detalle.model";

export interface Licencia {
  id: number,
  code: string,
  licenseTypeId: number;
  sistemaId?: number;
  cost?: number;
  tax?: number;
  discount?: number;
  total?: number;
  isActive?: boolean;
  licenciaDetalles?: LicenciaDetalle[];
}
