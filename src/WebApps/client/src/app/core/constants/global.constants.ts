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
  MECHANICAL = 'Mechanical/',
  VET = 'Vet/',
  BARBER_SHOP = 'BarberShop',
  RETENCION_ATS = 'RetencionAts/',
}

export const enum PATHS {
  DOWNLOAD_V1 = 'Reporte/Download',
  DOWNLOAD = 'v2/Reporte/Download',
  //APP_NOTIFICATION = 'Notification/',
  APP_NOTIFICATION = 'Notificacion/',
  PRINT = 'Print',
  USER = 'Usuario/',
  ESTAB_ASIGN = 'EstabAsig/',
}

export const enum DOC_TYPE {
  FC = 'FC',
  DNH = 'DH',
  LC = 'LC',
  IC = 'IC', //Ingreso Caja(Ingresos)
  EC = 'EC', //Egreso Caja (Gastos)
  FV = 'FV',
  FE = 'FE', //Factura Electrónica
  FF = 'FF', // Factura Fisica
  IV = 'IV', //Ingresos Varios (Compras No Habituales)
  NE = 'NE', //Nota Entrega
  CDV = 'CDV', //Consolidao diario venta
  AC='AC' //Ajuste Consolidacion
}

export const enum DOC_TYPE_SRI {
  LC = '03',
  F = '01',
  NC = '04',
  R = '07',
  ND = '05'
}

export enum REPORT_FORMAT {
  PDF = 'pdf',
  EXCEL = 'excel',
  WORD = 'word',
  IMAGE = 'image',
  XML = 'xml',
  CSV = 'csv',
  MHTML = 'mhtml',
  HTML = 'html',
}

export type FORMAT_TYPE =
  | REPORT_FORMAT
  | 'pdf'
  | 'excel'
  | 'word'
  | 'image'
  | 'xml'
  | 'csv'
  | 'mhtml'
  | 'html';

export enum REPORT_CODE {
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
  RCXC = 'RCXC', // Contabilidad Cobros por Cuotas.
  RCXD = 'RCXD', // Contabilidad Cobros por Documentos
  RCXP = 'RCXP', // Contabilidad Cobros por Pagos
  RRC = 'RRC', // Reporte Retencion
  RRND = 'RRND', // Reporte Recepcion de Nota de Debito
}

export enum CODE_ESTADO {
  NCBR = 'NCBR',
}

export enum TAX_RATE_CODE {
  ZERO_PERCENT = '0',
  TWELVE_PERCENT = '2',
  FOURTEEN_PERCENT = '3',
  FIFTEEN_PERCENT = '4',
  FIVE_PERCENT = '5',
  NOT_SUBJECT_TO_TAX = '6',
  TAX_EXEMPT = '7',
  DIFFERENTIATED_TAX = '8',
}

export enum TAX_CODE {
  IVA = '2',
  ICE = '3',
  IRBPNR = '5',
}

export enum MODAL_SIZE {
  XL = 'xl',
  LG = 'lg',
  SM = 'sm',
}

export enum FORMA_PAGO_SRI_CODE {
  /**
   * SIN UTILIZACION DEL SISTEMA FINANCIERO
   * @type {string}
   */
  SUSF = '01',

  /**
   * COMPENSACIÓN DE DEUDAS
   * @type {string}
   */
  CD = '15',

  /**
   * TARJETA DE DÉBITO
   * @type {string}
   */
  TB = '16',

  /**
   * DINERO ELECTRÓNICO
   * @type {string}
   */
  DE = '17',

  /**
   * TARJETA PREPAGO
   * @type {string}
   */
  TPP = '18',

  /**
   * TARJETA DE CRÉDITO
   * @type {string}
   */
  TC = '19',

  /**
   * OTROS CON UTILIZACION DEL SISTEMA FINANCIERO
   * @type {string}
   */
  OCUSF = '20',

  /**
   * ENDOSO DE TÍTULOS
   * @type {string}
   */
  ET = '21',
}

export enum SRI_IDENTIFICATION_CODE {
  RUC = '04',
  CEDULA = '05',
  PASSPORT = '06',
}

export enum IDENTIFICATION_CODE {
  RUC = 'R',
  CEDULA = 'C',
  PASSPORT = 'P',
}

export enum SEPARATOR_KEY_CODE {
  SLASH = '|',
  PUNTO_COMA = ';',
  DOS_PUNTOS = ':',
}
export const SEPARADORES_REGEX = new RegExp(
  `[${Object.values(SEPARATOR_KEY_CODE).join('')}]`,
);

export enum CODE_ROLE {
  ADM = 'ADM',
}

export enum TIPO_TRANSACCION {
  C = 'C',
  V = 'V',
}

export const DECIMALS = {
  DOS: 2,
  CINCO: 5,
  GENERAL: 6,
};

interface D {
  nu: 2
}
