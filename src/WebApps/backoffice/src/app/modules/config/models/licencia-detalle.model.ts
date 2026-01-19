export interface LicenciaDetalle {
  id: number;
  licenciaId: number;
  aplicacionId: number;
  name: string;
  cost: number;
  total: number;
  uuid: string;
  position?: number;
}
