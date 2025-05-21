export interface RetAtsDocSustento {
  idDocumento?: number;
  documentName?: string;
  idRetAtsDocSustento: number;
  idRetencionAts?: number;
  tipoComprobanteId?: number;
  uniqueIdDoc?: string;
  codSustento?: string;
  codDocSustento?: string;
  numDocSustento: string;
  fechaEmisionDocSustento: string;
  fechaRegistroContable?: string;
  numAutDocSustento?: string;
  pagoLocExt?: string;
  TipoRegimenFiscalExteriorId?: number;
  DocumentoSustentoTributarioId: number;
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
  retenciones?: any[];
  payments?: any[];
  estado?: boolean;
  isAutomatic?: boolean;
}

export interface RetencionAtsDocPayment
  extends Pick<
    RetAtsDocSustento,
    'idRetAtsDocSustento' | 'idRetencionAts' | 'uniqueIdDoc'
  > {
  idFormaPago: number;
  formaPago: string;
  descripcion: string;
  total?: number;
}
