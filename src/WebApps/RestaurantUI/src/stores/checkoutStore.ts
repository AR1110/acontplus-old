import { Checkout, Voucher, checkoutInitialState } from "@/core/models"
import { create } from "zustand" 
import {produce} from 'immer';

type State = {
    checkout: Checkout 
}

type Actions = {
    setVoucher(payingAmount: number, receivedAmount: number ): void
    setChangeReturn(value: number): void

}

export const useCheckoutStore = create<State & Actions>((set)=>({
    checkout: checkoutInitialState,
    setVoucher(payingAmount, receivedAmount ){
        console.log('hola')
        set(
            produce((state: State)=>{
                state.checkout.voucher.payingAmount = payingAmount;
                state.checkout.voucher.receivedAmount = receivedAmount;
            })
        )
    },
    setChangeReturn(value){
       console.log('tet')
        
    }
}))