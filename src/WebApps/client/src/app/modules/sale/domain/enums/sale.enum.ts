export const enum SALE_PATHS {
  EMPLOYEE = 'Empleado/',
  APROBACION_DOC = 'AprobacionDocumento/',
  NOTA_ENTREGA = 'NotaEntrega/',
  PROFORMA_INVOICE = 'Proforma',
}

export const enum SALE_CODE_REPORT {
  /**
   * SALE REPORT RENTABILIDAD
   * @type {string}
   */
  SRR = 'SRR',

  /**
   * SALE REPORT RENTABILIDAD CUSTOM
   * @type {string}
   */
  SRRC = 'SRRC',

  /**
   * SALE REPORT INVOICE GENERAL
   * @type {string}
   */
  FG = 'FG',
}

export const enum SALE_ROUTES {
  proforma_invoices = 'proforma_invoices',
}
export const SALE_MODULES_CODE = {
  PROFORMA_INVOICE: 'PF', //PROFORMAS
} as const;
