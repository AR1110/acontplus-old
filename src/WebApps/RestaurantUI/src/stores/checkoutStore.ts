 
import { Checkout, CheckoutDataForm, Payment, QueryParams, Voucher, checkoutInitialState, queryParamsInitialState } from "@/core/models"
import { create } from "zustand"
import { produce } from 'immer';
import { RoundNumber } from "@/core/utilities";
import { PaymentTypeCode } from "@/core/constants";

type State = {
    queryParams: QueryParams
    checkout: Checkout
}

type Actions = {
    setCheckoutDataForm(data: CheckoutDataForm):void
    setQueryParams(data: QueryParams): void
    setVoucher(data: Voucher): void
    setPayment(data: Payment):void
    setChangeReturn(): void
    setReceivedAmount(value: string): void //Actualizar el abono     
}

export const useCheckoutStore = create<State & Actions>((set, get) => ({
    queryParams: queryParamsInitialState,
    checkout: checkoutInitialState,
    setCheckoutDataForm(data){
        set(
            produce((state: State)=>{
                const paymentData = data.paymentTypes.find(item=>item.code===PaymentTypeCode.EFE)
                state.checkout.dataForm = data;                
                state.checkout.payments.paymentTypeId = paymentData?.paymentTypeId ?? 0;
                state.checkout.payments.paymentTypeCode = paymentData?.code  
                state.checkout.payments.paymentTypeDescription = paymentData?.description  

            })
        )
    },
    setQueryParams(queryParams){
        set(
            produce((state: State)=>{
                state.queryParams = queryParams;
            })
        )
    },
    setVoucher(voucher) { 
        set(
            produce((state: State) => {
                state.checkout.voucher = voucher;
                console.log(voucher)
                // state.checkout.voucher.payingAmount = data.payingAmount;
                // state.checkout.voucher.receivedAmount = data.receivedAmount;
                // state.checkout.voucher.changeReturn = 0;
                // state.checkout.voucher.creationDate = data.creationDate;
                
            })
        )
    },
    setPayment(payments) { 
        set(
            produce((state: State) => {
                state.checkout.payments = payments;
                console.log(payments) 
                
            })
        )
    },
    setChangeReturn() {
        const {payingAmount, receivedAmount} = get().checkout.voucher;
        let changeReturn = 0;
        const receivedAmountValue = parseFloat(receivedAmount)
        if (receivedAmountValue > payingAmount) {
            changeReturn = receivedAmountValue - payingAmount;            
        }

        set(
            produce((state: State)=>{
                state.checkout.voucher.changeReturn = RoundNumber(changeReturn, 2)
            })
        )
    },
    setReceivedAmount(receivedAmount) {
        set(
            produce((state: State) => {
                state.checkout.voucher.receivedAmount = receivedAmount;
            })
        )
    }
}))