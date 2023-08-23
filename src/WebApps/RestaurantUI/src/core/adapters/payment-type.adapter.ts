import { PaymentSubType, PaymentType, RawPaymentSubType, RawPaymentType } from "../models"; 

function paymentTypeAdapter(paymentTypes: RawPaymentType[]): Array<PaymentType> { 
    return paymentTypes.map(paymentType=>({
        paymentTypeId: paymentType.idEntidadFinanciera,
        code: paymentType.codigo,
        description: paymentType.descripcion
    }) )   
}

function paymentSubTypeAdapter(paymentSubTypes: RawPaymentSubType[]): Array<PaymentSubType> { 
    return paymentSubTypes.map(paymentSubType=>({
        paymentSubtypeId: paymentSubType.idSubEntidadFinanciera,
        paymentTypeId: paymentSubType.idEntidadFinanciera,
        code: paymentSubType.codigo,
        description: paymentSubType.descripcion,
        isControlBox: paymentSubType.controlCaja
    }) )   
}

export {
    paymentTypeAdapter,
    paymentSubTypeAdapter
}