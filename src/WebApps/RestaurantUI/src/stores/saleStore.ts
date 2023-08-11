import { CartItem } from "@/core/models";
import { create } from "zustand";

interface SaleState {
    totalItems: number;
    items: Array<CartItem>
    addItemToCart: (cartItem: CartItem) => void
}

export const saleStore = create<SaleState>((set, get) => ({
    totalItems: 0,
    items: [],
    addItemToCart: (item) => { 
        set(state => ({
            ...state, 
            items: [item, ...state.items],
        }) )
    }
}))