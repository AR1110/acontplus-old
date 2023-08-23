import { Checkout, Voucher, checkoutInitialState } from "@/core/models"
import { create } from "zustand"
import { produce } from 'immer';
import { RoundNumber } from "@/core/utilities";

type State = {
    checkout: Checkout
}

type Actions = {
    setVoucher(payingAmount: number, receivedAmount: string, changeReturn: number): void
    setChangeReturn(): void
    setReceivedAmount(value: string): void //Actualizar el abono     
}

export const useCheckoutStore = create<State & Actions>((set, get) => ({
    checkout: checkoutInitialState,
    setVoucher(payingAmount, receivedAmount) { 
        set(
            produce((state: State) => {
                state.checkout.voucher.payingAmount = payingAmount;
                state.checkout.voucher.receivedAmount = receivedAmount;
                state.checkout.voucher.changeReturn = 0;
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