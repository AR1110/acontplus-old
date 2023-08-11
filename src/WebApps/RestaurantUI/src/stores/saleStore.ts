import { CartItem } from "@/core/models";
import { addSound, clearSound } from "@/core/utilities";
import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { create } from "zustand";

interface SaleState {
    totalItems: number;
    items: Array<CartItem>
    addItemToCart(cartItem: CartItem): void
    removeItemFromCart(productId: number): void
    setTotalItems(): void,
    setItemChangeAmount(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cartItem: CartItem): void
    resetForm(): void
}

export const saleStore = create<SaleState>((set, get) => ({
    totalItems: 0,
    items: [],
    addItemToCart: (item) => { 
        const {items} = get();
        
        if(items.some(itemCompare=> itemCompare.productId===item.productId)) {
            for(const itemToModify of items) {
                if(itemToModify.productId===item.productId) {
                    itemToModify.amount = itemToModify.amount + 1;
                    itemToModify.total = itemToModify.amount * itemToModify.unitPrice;
                    break 
                }

            }
            set(state => ({
                ...state, 
                items: [...items], 
            }))
           
        }else{
            set(state => ({
                ...state, 
                items: [item, ...state.items], 
            }))
        }
        get().setTotalItems();
        addSound();
    },
    removeItemFromCart: (productId: number) => {
        set((state)=>({
            ...state,
            items: state.items.filter(_=>_.productId !== productId)
        }))
        get().setTotalItems(); 
        clearSound();      
    },
    setTotalItems: ()=>set(state => ({
        ...state, 
        totalItems: state.items.reduce((total, item) => total + item.amount, 0)
    })),
    setItemChangeAmount: (event, item)=>{
        const {items} = get();
        let amount = Number(event.target.value)
        console.log(amount)
        if(amount < 1){
           
            amount = 1; 
        }
        for(const itemToModify of items){
            if(itemToModify.productId===item.productId){
                itemToModify.amount = amount;
                itemToModify.total = itemToModify.amount * itemToModify.unitPrice;
                break
            }
        }
        set(state => ({
            ...state, 
            items: [...items], 
        })) 
        get().setTotalItems(); 
        addSound();
    },
    async resetForm() {
        if(get().items.length===0) return;

        console.log("resetForm")
        const {isConfirmed} = await Swal.fire({
            title: 'Reiniciar',
            html: '<small>¿Está seguro de que desea restablecer el producto ?</small>',
            icon: 'warning',
            showCancelButton: true,
            // confirmButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Si, restablecer',
            cancelButtonText: 'No, cancelar'
        })
        if(isConfirmed){
            set(state=>({
                ...state,
                totalItems: 0, 
                items: []
            }))
            clearSound();
        }
    },
}))