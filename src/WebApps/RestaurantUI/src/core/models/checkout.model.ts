import { Bank, City, PaymentSubType, PaymentType, VoucherQuota } from "."

export interface Voucher {
    customerCompanyId: number,
    customerIdentification: string
    customerName: string
    payingAmount: number
    receivedAmount: string
    changeReturn: number
    totalBalance: number
    codEstab: string
    creationDate: Date | string
    nroDoc: string
}

// {
//     "importeTotal": 9.06,
//     "mora": 0,
//     "totalSaldoDoc": 9.06,
//     "saldo": 9.06,
//     "abono": 0,
//     "idCliente": 11,
//     "numeroIdentificacion": "9999999999999",
//     "nombreFiscal": "CONSUMIDOR FINAL",
//     "codEstab": "ESTAB-000000117",
//     "fechaEmision": "08/27/2023",
//     "serieComprobante": "002-002-000000020"
// }

export interface Payment {
    paymentTypeId: number
    paymentSubtypeId: number
    creationDate: string
    receivedAmount: number
    payingAmount: number
    sequential: number
    isControlBox: number
    paymentTypeCode?: string
    paymentTypeDescription?: string
    nro?:string
    referencia?:string
    aprobacion?:string
    lote?:string
    cityId?: number
    idBanco?: number
}

export const paymentInitialState: Payment = {
    paymentTypeId: 0,
    paymentSubtypeId: 0,
    creationDate: "",
    receivedAmount: 0,
    payingAmount: 0,
    sequential: 0,
    isControlBox: 0,
    paymentTypeCode: "",
    paymentTypeDescription: "",    
}

export interface CheckoutDataForm {
    paymentTypes: Array<PaymentType>
    paymentSubTypes: Array<PaymentSubType>
    voucherQuotas: Array<VoucherQuota>
    banks:Array<Bank>
    cities: Array<City> 
    comprobante: object
}

export const checkoutDataFormInitialState: CheckoutDataForm = {
    paymentTypes: [],
    paymentSubTypes: [],
    voucherQuotas: [],
    banks: [],
    cities: [],
    comprobante: {}
}
export interface Checkout {
    dataForm: CheckoutDataForm
    voucher: Voucher
    payments: Payment
}

export interface PaymentDetail  {
    idCuentaPorCobrar: number
    idCuotaPorCobrar: number,
    abono: number
    interes : number
    diasMora : number
    mora : number
    cuota: number
    saldo: number
    secuencial: number
} 

export interface PaymentHistory{
    idCuentaPorCobrar: number                    
    abono: number,
    diasMora : number
    mora : number
}
export const checkoutInitialState: Checkout = {
    dataForm: checkoutDataFormInitialState,
    voucher: {
        customerCompanyId: 0,
        customerIdentification: "",
        customerName: "",
        payingAmount: 0,
        receivedAmount: "0",
        changeReturn: 0,
        totalBalance: 0,
        codEstab: "",
        creationDate: "",
        nroDoc: ""
    },
    payments: paymentInitialState
}