export const enum PATHS_API {
  ACCOUNTING = `Contabilidad/`,
  COMMON = 'Common/',
  CONFIG = 'Config/',
  CUSTOMER = 'Customer/',
  IDENTITY = 'Seguridad/',
  PRINT_SERVER = 'https://acontplusprint.com/',
  PURCHASE = 'Compra/',
  REPORT = 'Reports/',
  SALES = 'Venta/',
  TECHSUPPORT = 'TechnicalSupport/',
  INVENTORY = 'Inventario/',
}

export const enum PATHS {
  DOWNLOAD_V1 = 'Reporte/Download',
  DOWNLOAD = 'v2/Reporte/Download',
  APP_NOTIFICATION = 'Notificacion/',
  PRINT = 'Print',
  USER = 'Usuario/',
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
}

// Example usage:
// const reportType: CODE_REPORT = CODE_REPORT.RF;
// console.log(reportType);
