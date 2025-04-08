export const PATHS_API = {
  SECURITY: 'Seguridad/v3/',
  CUSTOMER: 'Customer/',
  RESTAURANT: 'Restaurant/',
  CONFIG: 'Config/',
  GREEN_API: 'https://api.green-api.com/',
  COMMON: 'Common/',
  BILLING: 'FactElect/',
  INVENTORY: 'Inventario/',
  ACCOUNTING: 'Contabilidad/',
  REPORT: 'Reports/'
}
export const PATHS = {
  ACCOUNT: 'Account/',
  COMPANY_CUSTOMER: 'CompanyCustomer/',
  ORDER: 'Order/',
  EMAIL_CONFIG: 'EmailConfig/',
  WA_INSTANCE: 'waInstance',
  NOTIFICACION: 'Notificacion/',
  NOTIFICACION_TRIBUTARIA: 'NotificacionTributaria',
  PRODUCT: 'Articulo/',
  CONFIG: 'Configuration/',
  ITEM: 'Item/',
  COMPROBANTE_INGRESO: 'ComprobanteIngreso/',
  REPORT_V1: `Reporte/`,
  REPORT_V2: `v2/Reporte/`,
  PROMOTION: 'Promotion/',
  CONSULTAS: 'Consultas/',
  PRMOTION_MENU: 'PromotionMenu/',
  TABLE: 'Table/',
}


export const enum DOC_TYPE {
  FV = 'FV',
  NE = 'NE',
  OR = 'OR'
}
export const enum DOC_TYPE_SRI {
  FV = '01',
}

export enum SEPARATOR_KEY_CODE {
  SLASH = '|',
  PUNTO_COMA = ';',
}
export const STRING_SPLIT_REGEX = /[\|;]/;
export enum CODE_REPORT {
  RNE = 'RNE'
}


export enum SRI_IDENTIFICATION_CODE {
  RUC = '04',
  CEDULA = '05',
  PASSPORT = '06',
  CONSUMIDOR_FINAL = '07'
}


export enum TAX_RATE_CODE {
  ZERO_PERCENT = "0",
  TWELVE_PERCENT = "2",
  FOURTEEN_PERCENT = "3",
  NOT_SUBJECT_TO_TAX = "6",
  TAX_EXEMPT = "7",
  DIFFERENTIATED_TAX = "8",
}

export enum TAX_CODE {
  IVA = '2',
  ICE = '3',
  IRBPNR = '5'
}

export enum SUB_CATEGORY_CODE {
  COM = 'COM',
  PROM = 'PROM'
}

export enum ITEM_TYPE_CODE {
  MENU = "MENU",
  ITEM = "ITEM"
}


export enum CODE_REPORT {
  OR = 'RRO', //Reporte Orden
  FV = 'RF',
  NE = 'RNE'
}

export const enum PaymentTypeCode {
  TAR = "TAR",
  EFE = "EFE",
  TRA = "TRA",
  CHE = "CHE",
  DOC = "DOC"
}

export const DECIMALS = {
  DOS: 2,
  CINCO: 5,
  GENERAL: 5
}

export const STATUS_ORDER = {
  PENDIENTE: 'PE',
  PROCESO: 'P',
  FINALIZADO: 'F',
  ANULADO: 'A',
}

export const ROUTES_PATH = {
  AUTH: 'auth',
  DASHBOARD : 'dashboard',
  POS: 'pos',
  CUSTOMER: 'customer',
  ORDER: 'order'
}
