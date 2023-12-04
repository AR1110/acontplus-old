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
    totalValorAbono: number
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
    paymentSubTypeId: number
    creationDate: Date
    receivedAmount: number
    payingAmount: number
    sequential: number
    isControlBox: boolean
    paymentTypeCode: string
    paymentTypeDescription?: string
    nro?: string
    referencia?: string
    aprobacion?: string
    lote?: string
    cityId?: number
    idBanco?: number
    posfechado?: boolean
}



export interface CheckoutDataForm {
    paymentTypes: Array<PaymentType>
    voucherQuotas: Array<VoucherQuota>
    banks: Array<Bank>
    cities: Array<City>
    comprobante: Voucher
}


export interface CheckoutSubTotal {
    importeTotal:  number
    totalAbonoAnterior:  number
    totalSaldo: number
    totalSaldoDoc: number
}

/**
 * Datos cobro 
 */
export interface MultiplesPaymentType extends Payment  {
    idCuentaBancaria:number
    paymentSubTypeName: string
    infoCobro?: string
}

export interface Checkout {
    dataForm: CheckoutDataForm
    voucher: Voucher
    paymentData: Payment,
    paymentSubTypes: Array<PaymentSubType>
    dataSubTotal: CheckoutSubTotal
    multiplesPaymentType: Array<MultiplesPaymentType>
    paymentDetails: Array<PaymentDetail>
}

export interface PaymentDetail {
    idCuentaPorCobrar: number
    idCuotaPorCobrar: number,
    abono: number
    interes: number
    diasMora: number
    mora: number
    cuota: number
    saldo: number
    secuencial: number
}

export interface PaymentHistory {
    idCuentaPorCobrar: number
    abono: number,
    diasMora: number
    mora: number
}

//Context Checkout
export interface CheckoutParams {
    orderId: number
    idDocumento: number
    idTipoDocumento: number
    codEstab: string
    tiempoCredito: number
    idCliente: number
    codDoc: 'NE' | 'FV';
    idCuentaPorCobrar: number
    payAutomatic: boolean
    printerAutomatic: boolean
}

export interface CheckoutState {
    isOptionReceivedAmount: boolean
    isReplaceReceivedAmount: boolean
    checkoutParams: CheckoutParams
    checkoutLoading: boolean
    checkoutError: boolean
    checkout: Checkout
    closeDialog(data?:any): void
}



type ActionCalculator = {
    handleClickOptionReceivedAmount(value: number): void
    checkoutClearButton(): void
}

export type CheckoutActions = ActionCalculator & {
    fetchCheckout<T extends CheckoutParams>(data: T, callback: () => void): void
    setChangePaymentType(data: Partial<Payment>, paymentSubTypes: PaymentSubType[]): void;
    setChangeFieldFormPayment<T extends keyof typeof paymentDataInitialState>(
        prop: T,
        value: typeof paymentDataInitialState[T]
    ): void;
    addPaymentType<T>(data: T): void
    onChangeReceivedAmount(event: React.ChangeEvent<HTMLInputElement>): void
    handleChangeSetReceivedAmount(value: number | string): void
    removePaymentType(index:number):void
    save(): void
}


export const paymentDataInitialState: Payment = {
    paymentTypeId: 0,
    paymentSubTypeId: 0,
    creationDate: new Date(),
    receivedAmount: 0,
    payingAmount: 0,
    sequential: 0,
    isControlBox: false,
    paymentTypeCode: "",
    paymentTypeDescription: "",
    nro: "",
    referencia: "",
    aprobacion: "",
    lote: "",
    cityId: 0,
    idBanco: 0,
    posfechado: false
}


export const checkoutDataFormInitialState: CheckoutDataForm = {
    paymentTypes: [],
    voucherQuotas: [],
    banks: [],
    cities: [],
    comprobante: {
        customerCompanyId: 0,
        customerIdentification: "",
        customerName: "",
        payingAmount: 0,
        receivedAmount: "",
        changeReturn: 0,
        totalBalance: 0,
        codEstab: "",
        creationDate: "",
        nroDoc: "",
        totalValorAbono: 0
    }
}


export const initialCheckoutState: Checkout = {
    dataForm: structuredClone(checkoutDataFormInitialState),
    voucher: {
        customerCompanyId: 0,
        customerIdentification: "",
        customerName: "",
        payingAmount: 0,
        receivedAmount: "0",
        changeReturn: 0,
        totalBalance: 0,
        codEstab: "",
        creationDate: new Date(),
        nroDoc: "",
        totalValorAbono: 0
    },
    paymentData: structuredClone(paymentDataInitialState),
    paymentSubTypes: [],
    dataSubTotal: {
        importeTotal: 0,
        totalAbonoAnterior: 0,
        totalSaldo: 0,
        totalSaldoDoc: 0
    },
    multiplesPaymentType: [],
    paymentDetails: []
}



