export const enum ACCOUNTING_PATHS {
  CUENTA_POR_PAGAR = 'CuentaPorPagar/',
  CASHBOX = 'Caja/',
  CONTROL_CAJA = 'ControlCaja/',
  MOVIMIENTO_CAJA = 'MovimientoCaja/',
  ANTICIPO = 'Anticipo/',
  COMPROBANTE_INGRESO = 'ComprobanteIngreso/',
  SUB_ENTIDAD_FINANCIERA = 'SubEntidadFinanciera/',
  CUENTA_POR_COBRAR = 'CuentaPorCobrar/',
  CATEGORY = 'Category/',
  SUBCATEGORY = 'Subcategory/',
  ACCOUNTING_MOVEMENT = 'AccountingMovement/',
  COMPROBANTE_EGRESO = 'ComprobanteEgreso/',
}

export const enum PaymentTypeCode {
  TAR = 'TAR',
  EFE = 'EFE',
  TRA = 'TRA',
  CHE = 'CHE',
  DOC = 'DOC',
}

/**
 * Accounting Report Codes used to identify different types of accounting reports in the system.
 */
export const enum ACCOUNTING_CODE_REPORT {
  /** Reporte Movimiento Caja (Caja / Anticipo) */
  RMC = 'RMC',

  /** Comprobante Caja por  */
  CCCR = 'CCCR',

  /** Comprobante Caja  */
  CCR = 'CCR',

  /** Reporte Movimiento por ID de Documento (Caja / Anticipo) */
  RMIE = 'RMIE',

  /** Resumen Movimiento Contable (Accounting Movement) */
  RAAM = 'RAAM',

  /** Reporte Comprobante de Egreso */
  RCEGR = 'RCEGR',

  /** Listado Comprobantes de Egreso (Accounting - Comprobante Egreso) */
  ACELC = 'ACELC',

  /** Detalles de formas de pago **/
  ACEDFP = 'ACEDFP',
}
