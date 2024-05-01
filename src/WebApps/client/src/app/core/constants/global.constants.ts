export const enum PATHS_API {
  ACCOUNTING = `Contabilidad/`,
  COMMON = 'Common/',
  CONFIG = 'Config/',
  CUSTOMER = 'Customer/',
  IDENTITY = 'Seguridad/',
  PRINT_SERVER = 'https://acontplusprint.com/',
  PURCHASE = 'Compra/',
  REPORT = 'Reports/',
  FACT_ELECT = 'FactElect/',
  SALES = 'Venta/',
  TECHSUPPORT = 'TechnicalSupport/',
  INVENTORY = 'Inventario/',
  RESTAURANT = 'Restaurant/',
  BILLING = 'FactElect/',
  MECHANICAL = 'Mechanical/'
}

export const enum PATHS {
  DOWNLOAD_V1 = 'Reporte/Download',
  DOWNLOAD = 'v2/Reporte/Download',
  APP_NOTIFICATION = 'Notificacion/',
  PRINT = 'Print',
  USER = 'Usuario/',
  ESTAB_ASIGN = 'EstabAsig/'
}

export const enum DOC_TYPE {
  FC = 'FC',
  DNH = 'DH',
  LC = 'LC',
  IC = 'IC',
  EC = 'EC',
  FV = 'FV',
  FE = 'FE', //Factura Electrónica
  FF = 'FF', // Factura Fisica
  IV = 'IV', //Ingresos Varios (Compras No Habituales)
  NE = 'NE' //Nota Entrega
}

export const enum DOC_TYPE_SRI {
  LC = '03',
  F = '01',
  NC = '04',
  R = '07',
}

export enum FORMAT_REPORT {
  PDF = 'pdf',
  EXCEL = 'excel',
}

export type FORMAT_TYPE = FORMAT_REPORT.PDF | FORMAT_REPORT.EXCEL;

export enum CODE_REPORT {
  RF = 'RF', // Reporte Factura
  FG = 'FG', // Ventas -> Factura General
  CCR = 'CCR', // Cuenta por cobrar
  FEG = 'FEG', // Facturacion Electronica -> Factura General
  RNE = 'RNE',
  RNC = 'RNCC', // Reporte Nota Credito
  NCRG = 'NCRG', // Reporte Nota Credito General
  PR = 'PR', // Reporte Proforma
  PRE_F = 'RAC', // Aprobacion-Factura
  P_NE = 'P-NE', // Aprobacion - Nota Entrega
  RLC = 'RLC', // Reporte Liquidacion Compra
  RCD = 'RCD', // Reporte Compra detalle
  RFC = 'RFC', // Reporte Factura Compra
  RCNH = 'RCNH', // PDF compra no habitual
  ROC = 'ROC', // Orden Compra
  RCP = 'RCP', //Reporte Compras
  RCC = 'RCC', //Reporte Control Caja
  RMIE = 'RMIE', //Reporte Movimiento Caja
  RA = 'RA', //Reporte Anticipo
  RRF = 'RRF', //Reporte Recepcion Factura
  RRNC = 'RRNC', //Recepcion Nota Credito
  RRG = 'RRG', //Recepcion Retencion General
  CCP = 'CCP', //Contabilidad Cartera Proveedor
  CCPC = 'CCPC', //Contabilidad Cartera Proveedor Cuota
  CDCC = 'CDCC', //Contabilidad Detalle Control Caja
  RTS = 'RTS', // Technical Support Report
}

export enum CODE_ESTADO {
  NCBR = 'NCBR',
}


export enum TAX_RATE_CODE {
  ZERO_PERCENT = "0",
  TWELVE_PERCENT = "2",
  FOURTEEN_PERCENT = "3",
  FIFTEEN_PERCENT='4',
  FIVE_PERCENT='5',
  NOT_SUBJECT_TO_TAX = "6",
  TAX_EXEMPT = "7",
  DIFFERENTIATED_TAX = "8",
}

export enum TAX_CODE {
  IVA = '2',
  ICE = '3',
  IRBPNR = '5'
}


export enum MODAL_SIZE {
  XL='xl',
  LG='lg',
  SM ='sm'
}
