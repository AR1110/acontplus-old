import { CartItem } from "@/core/models";
import { addSound, clearSound } from "@/core/utilities";
import { create } from "zustand";

interface SaleState {
    totalItems: number;
    items: Array<CartItem>
    addItemToCart: (cartItem: CartItem) => void
    removeItemFromCart(productId: number): void
    setTotalItems(): void
}

export const saleStore = create<SaleState>((set, get) => ({
    totalItems: 0,
    items: [],
    addItemToCart: (item) => { 
        const {items} = get();
        
        if(items.some(itemCompare=> itemCompare.productId===item.productId)) {
            for(const itemToModify of items) {
                if(itemToModify.productId===item.productId) {
                    itemToModify.cantidad = itemToModify.cantidad + 1;
                    itemToModify.total = itemToModify.cantidad * itemToModify.unitPrice;
                    break 
                }

            }
            set(state => ({
                ...state, 
                items: [...items], 
            }))
            addSound();
        }else{
            set(state => ({
                ...state, 
                items: [item, ...state.items], 
            }))
            get().setTotalItems();
        }
    },
    removeItemFromCart: (productId: number) => {
        set((state)=>({
            ...state,
            items: state.items.filter(_=>_.productId !== productId)
        }))
        get().setTotalItems(); 
        clearSound();      
    },
    setTotalItems: ()=>set(state => ({...state, totalItems: get().items.length}))
}))