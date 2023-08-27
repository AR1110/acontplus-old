import { Checkout, QueryParams, Voucher, checkoutInitialState, queryParamsInitialState } from "@/core/models"
import { create } from "zustand"
import { produce } from 'immer';
import { RoundNumber } from "@/core/utilities";

type State = {
    queryParams: QueryParams
    checkout: Checkout
}

type Actions = {
    setQueryParams(data: QueryParams): void
    setVoucher(data: Voucher): void
    setChangeReturn(): void
    setReceivedAmount(value: string): void //Actualizar el abono     
}

export const useCheckoutStore = create<State & Actions>((set, get) => ({
    queryParams: queryParamsInitialState,
    setQueryParams(queryParams){
        set(
            produce((state: State)=>{
                state.queryParams = queryParams;
            })
        )
    },
    checkout: checkoutInitialState,
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