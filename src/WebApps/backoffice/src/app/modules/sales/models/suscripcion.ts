export interface Suscripcion {
  id: number;
  subscriptionTypeId: number;
  companyId: number;
  startDate: Date;
  endDate: Date;
  maxPaymentDate: Date;
  cost?: number | null;
  tax?: number | null;
  discount?: number | null;
  total?: number | null;
  paid?: boolean | null;
  warningMessage?: string | null;
}

export interface SuscripcionReport {
  totalRecords: number;
  id: number;
  companyId: number;
  businessName: string;
  tradeName?: string;
  startDate: Date;
  endDate: Date;
}
