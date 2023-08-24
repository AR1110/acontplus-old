
export interface RawPaymentType {
    idEntidadFinanciera: number,
    descripcion: string,    
    codigo: string
}


export interface RawPaymentSubType {
    idEntidadFinanciera: number,
    idSubEntidadFinanciera: number,
    descripcion: string,
    codigo: string 
    controlCaja: boolean
}

export interface PaymentType {
    paymentTypeId: number
    description: string
    code: string
}

export interface PaymentSubType {
    paymentTypeId: number,
    paymentSubtypeId: number,
    description: string,
    code: string 
    isControlBox: boolean
}