export interface SuscripcionDetalle {
  id: number;
  licenciaCode?: string;
  licenciaCost?: number;
  licenciaTax?: number;
  licenciaDiscount?: number;
  licenciaTotal?: number;
  suscripcionCost?: number;
  suscripcionTax?: number;
  suscripcionDiscount?: number;
  suscripcionTotal?: number;
  licenseTypeName?: string;
  licenciaDetalleId: number;
  aplicacionName?: string;
  suscripcionId: number;
  startDate: Date;
  endDate: Date;
  maxPaymentDate: Date;
  name: string;
  cost?: number | 0.0;
  tax?: number | 0.0;
  discount?: number | 0.0;
  total?: number | 0.0;
  paid?: boolean | false;
  uuid?: string | null;
  position?: number;
}
