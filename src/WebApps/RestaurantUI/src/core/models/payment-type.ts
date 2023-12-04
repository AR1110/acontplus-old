import { PaymentTypeCode } from "../constants"

type PaymentCode =
    PaymentTypeCode.EFE |
    PaymentTypeCode.TRA |
    PaymentTypeCode.TAR |
    PaymentTypeCode.CHE |
    PaymentTypeCode.DOC

//Start Api
export interface RawPaymentType {
    idEntidadFinanciera: number,
    descripcion: string,
    codigo: PaymentCode
}


export interface RawPaymentSubType {
    idEntidadFinanciera: number,
    idSubEntidadFinanciera: number,
    descripcion: string,
    codigo: string
    controlCaja: boolean
}

//End Api

//Start Adapter Front End
export interface PaymentSubType {
    paymentTypeId: number,
    paymentSubTypeId: number,
    description: string,
    code: string
    isControlBox: boolean
}

export interface PaymentType {
    paymentTypeId: number
    description: string
    code: PaymentCode
    paymentSubTypes: Array<PaymentSubType>
}



//Start Adapter Front End