 
export interface Voucher {
    customerCompanyId: number,    
    payingAmount: number
    receivedAmount: number 
    changeReturn: number
    codEstab: string    
}

export interface Payment {
    paymentTypeId: number
    paymentSubtypeId: number
    creationDate: string
    receivedAmount: number
    payingAmount: number
    sequential: number
    isControlBox: number
}

export interface Checkout {
    voucher: Voucher
    payments: Payment
}

export const checkoutInitialState: Checkout = {
    voucher: {
        customerCompanyId: 0,
        payingAmount: 0,
        receivedAmount: 0,
        changeReturn: 0,
        codEstab: ""
    },
    payments: {
        paymentTypeId: 0,
        paymentSubtypeId: 0,
        creationDate: "",
        receivedAmount: 0,
        payingAmount: 0,
        sequential: 0,
        isControlBox: 0
    }
}