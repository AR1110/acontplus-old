export const enum PATHS {
    PRIVATE = "Restaurant/",
    INVENTARIO = "Inventario/",
    SALE = 'Venta/',
    ACCOUNTING = 'Contabilidad/',
    CONFIG = 'Config/',
    CUSTOMER = 'Customer/',
    REPORT = 'Reporte/'
}

export const enum PERSIS_USER {
    user_data = "user_data",
    estabs = "estabs",
    auth_token = "auth_token"
}

export enum SRI_IDENTIFITION_CODE {
    RUC = "04",
    LICENSE = "05",
    PASSPORT = "06"
}

export const enum DOC_TYPE {
    FV = 'FV',
    NE = 'NE',
    OR = 'OR'
}

export const enum PaymentTypeCode {
    TAR = "TAR",
    EFE = "EFE",
    TRA = "TRA",
    CHE = "CHE",
    DOC = "DOC"
}

export enum TAX_RATE_CODE {
    ZERO_PERCENT = "0",
    TWELVE_PERCENT = "2",
    FOURTEEN_PERCENT = "3",
    NOT_SUBJECT_TO_TAX = "6",
    TAX_EXEMPT = "7",
    DIFFERENTIATED_TAX = "8",
}

export enum ITEM_TYPE_CODE {
    MENU = "MENU",
    ITEM = "ITEM"
}

export enum DOC_TYPE_REPORT {
    FV = 'RF',
    NE = 'RNE'    
}