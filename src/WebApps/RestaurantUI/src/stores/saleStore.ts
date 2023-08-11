import { CartItem, Summary } from "@/core/models";
import { addSound, clearSound } from "@/core/utilities";
import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { create } from "zustand";

interface SaleState {
    totalItems: number;
    items: Array<CartItem>
    summary: Summary, 
    addItemToCart(cartItem: CartItem): void
    removeItemFromCart(productId: number): void
    setTotalItems(): void,
    setItemChangeQty(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cartItem: CartItem): void
    caculateTotals(): void
    resetForm(): void
}

export const saleStore = create<SaleState>((set, get) => ({
    totalItems: 0,
    items: [],
    summary: {
        tax: 0,
        taxAmount: 0,
        total: 0,
        netTotal: 0
    },
    addItemToCart: (item) => { 
        const {items, setTotalItems, caculateTotals} = get();
        
        if(items.some(itemCompare=> itemCompare.productId===item.productId)) {
            for(const itemToModify of items) {
                if(itemToModify.productId===item.productId) {
                    itemToModify.qty = itemToModify.qty + 1;
                    itemToModify.totalPrice = itemToModify.qty * itemToModify.sellingPrice;
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
        setTotalItems();
        caculateTotals();
        addSound();
    },
    removeItemFromCart: (productId: number) => {
        const {setTotalItems, caculateTotals} = get();
        set((state)=>({
            ...state,
            items: state.items.filter(_=>_.productId !== productId)
        }))
        setTotalItems();
        caculateTotals(); 
        clearSound();      
    },
    setTotalItems: ()=>set(state => ({
        ...state, 
        totalItems: state.items.reduce((total, item) => total + item.qty, 0)
    })),
    setItemChangeQty: (event, item)=>{
        const {items, setTotalItems, caculateTotals} = get();
        let qty = Number(event.target.value)
      
        if(qty < 1){
           
            qty = 1; 
        }
        for(const itemToModify of items){
            if(itemToModify.productId===item.productId){
                itemToModify.qty = qty;
                itemToModify.totalPrice = itemToModify.qty * itemToModify.sellingPrice;
                break
            }
        }
        set(state => ({
            ...state, 
            items: [...items], 
        })) 
        setTotalItems(); 
        caculateTotals();
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
            get().caculateTotals();
        }
    },
    caculateTotals(){
        const {items} = get(); 
        let total = 0;
        for(const item of items){
            total += item.totalPrice;            
        }

        set(state=>({
            ...state,
            summary: {
                ...state.summary,
                total,
                netTotal: total
            }
        }))
    }
}))