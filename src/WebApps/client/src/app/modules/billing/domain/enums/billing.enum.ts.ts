export enum BILLING_PATHS {
  ATS = 'Ats/',
  DOC_ELECT = 'DocumentoElectronico/',
  INVOICE = 'Factura/',
  NOTIFICACION_TRIBUTARIA = 'NotificacionTributaria',
  RETENCION_ATS = 'RetencionAts/',
  GUIA_REMISION = 'GuiaRemision',
}

export enum RETENCION_ATS_PATHS {
  DOC_SUSTENTO = 'DocSustento/',
  DOC_SUSTENTO_IMPUESTO = 'DocSustentoImpuesto/',
  DOC_SUST_RETENCION = 'DocSustentoRetencion/',
  DOC_SUSTENTO_PAGO = 'DocSustentoPago/',
}

export const enum BILLING_CODE_REPORT {
  FEG = 'FEG',
  NCRG = 'NCRG',
  FCRRG = 'FCRRG', ////Facturación Retención Reporte General
  LCRG = 'LCRG',
  RGGR = 'RGGR',
}


export const enum BILLING_MODULES_CODE {
  DOC_ELECT='AUTH',
  ATS='ATS',
  RETENCION_ATS='RETENCION_ATS',
  GUIA_REMISION='GUIA_REMISION'
}
