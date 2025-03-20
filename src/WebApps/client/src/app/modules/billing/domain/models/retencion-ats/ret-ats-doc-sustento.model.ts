export interface RetAtsDocSustento {
  idDocumento?: number;
  documentName?: string;
  idRetDocSustento?: number;
  idRetencionAts?: number;
  uniqueIdDoc?: string;
  codSustento?: string;
  codDocSustento?: string;
  numDocSustento: string;
  fechaEmisionDocSustento: string;
  fechaRegistroContable?: string;
  numAutDocSustento?: string;
  pagoLocExt?: string;
  tipoRegi?: string;
  paisEfecPago?: string;
  aplicConvDobTrib?: string;
  pagExtSujRetNorLeg?: string;
  pagoRegFis?: string;
  totalComprobantesReembolsos?: number;
  totalBaseImponibleReembolso?: number;
  totalImpuestoReembolso?: number;
  totalSinImpuestos?: number;
  importeTotal: number;
  taxes?: any[];
  estado?: boolean;
  isAutomatic?: boolean;
}

export interface RetencionAtsDocPayment
  extends Pick<
    RetAtsDocSustento,
    'idRetDocSustento' | 'idRetencionAts' | 'uniqueIdDoc'
  > {
  idFormaPago: number;
  formaPago: string;
  descripcion: string;
  total?: number;
}
