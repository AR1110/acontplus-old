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
  ACCOUNTING_MOVEMENT='AccountingMovement/',
  COMPROBANTE_EGRESO = 'ComprobanteEgreso/',
}

export const enum PaymentTypeCode {
  TAR = 'TAR',
  EFE = 'EFE',
  TRA = 'TRA',
  CHE = 'CHE',
  DOC = 'DOC',
}

export const enum ACCOUNTING_CODE_REPORT {
  RMC='RMC', //REPORTE MOVIMIENTO CAJA (MOVIMIENTO CAJA/ANTICIPO)
  CCCR ='CCCR' ,
  CCR ='CCR',
  RMIE='RMIE', //REPORTE MOVIMIENTO CAJA POR DOCUMENTO ID (MOVIMIENTO CAJA/ANTICIPO)
  RAAM = 'RAAM' //(Accounting Movement) Resument Movimiento
}
