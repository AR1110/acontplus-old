import { 
    CartItem, 
    ItemSearch, 
    ItemReadDto, 
    Summary, 
    itemSearchInitialState, 
    DataFormSale, 
    dataFormInitialState 
} from "@/core/models"; 
import { addSound, clearSound } from "@/core/utilities";
import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { create } from "zustand";

interface SaleState { 
    itemSearch: ItemSearch
    setItemSearch(itemSearch:ItemSearch ): void
    collectionItems: Array<ItemReadDto>
    totalItems: number;
    cartItems: Array<CartItem>
    summary: Summary, 
    dataForm:  DataFormSale,
    setDataForm(dataForm: DataFormSale): void
    setCollectionItems(products: Array<ItemReadDto>): void
    addItemToCart(cartItem: CartItem): void
    removeItemFromCart(productId: number): void
    setTotalItems(): void,
    setItemChangeQty(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cartItem: CartItem): void
    caculateTotals(): void
    resetForm(): void
}



export const saleStore = create<SaleState>((set, get) => ({ 
    itemSearch: itemSearchInitialState,
    setItemSearch: (itemSearch)=>{
        set(state=>({
            ...state,
            itemSearch
        }))
    },
    collectionItems: [],
    totalItems: 0,
    cartItems: [],
    summary: {
        tax: 0,
        taxAmount: 0,
        total: 0,
        netTotal: 0
    }, 
    dataForm: dataFormInitialState,
    setDataForm(dataForm){
        set(state=>({
            ...state,
            dataForm
        }))
    },
    setCollectionItems: (collectionItems)=>{
        set(state=>({
            ...state,
            collectionItems
        }))
    },
    addItemToCart: (item) => { 
        const {cartItems, setTotalItems, caculateTotals} = get();
        
        if(cartItems.some(itemCompare=> itemCompare.productId===item.productId)) {
            for(const itemToModify of cartItems) {
                if(itemToModify.productId===item.productId) {
                    itemToModify.qty = itemToModify.qty + 1;
                    itemToModify.totalPrice = itemToModify.qty * itemToModify.sellingPrice;
                    break 
                }

            }
            set(state => ({
                ...state, 
                cartItems: [...cartItems], 
            }))
           
        }else{
            set(state => ({
                ...state, 
                cartItems: [item, ...state.cartItems], 
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
            cartItems: state.cartItems.filter(_=>_.productId !== productId)
        }))
        setTotalItems();
        caculateTotals(); 
        clearSound();      
    },
    setTotalItems: ()=>set(state => ({
        ...state, 
        totalItems: state.cartItems.reduce((total, item) => total + item.qty, 0)
    })),
    setItemChangeQty: (event, item)=>{
        const {cartItems, setTotalItems, caculateTotals} = get();
        let qty = Number(event.target.value)
      
        if(qty < 1){
           
            qty = 1; 
        }
        for(const itemToModify of cartItems){
            if(itemToModify.productId===item.productId){
                itemToModify.qty = qty;
                itemToModify.totalPrice = itemToModify.qty * itemToModify.sellingPrice;
                break
            }
        }
        set(state => ({
            ...state, 
            cartItems: [...cartItems], 
        })) 
        setTotalItems(); 
        caculateTotals();
        addSound();
    },
    async resetForm() {
        if(get().cartItems.length===0) return;

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
                cartItems: []
            }))
            clearSound();
            get().caculateTotals();
        }
    },
    caculateTotals(){
        const {cartItems} = get(); 
        let total = 0;
        for(const item of cartItems){
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