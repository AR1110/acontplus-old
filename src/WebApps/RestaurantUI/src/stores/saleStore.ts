import {
    ItemRead,
    ItemSearch,
    ItemReadDto,
    Summary,
    itemSearchInitialState,
    DataFormSale,
    dataFormInitialState, 
    summaryInitialState
} from "@/core/models"; 
import { SnackbarUtility, addSound, clearSound } from "@/core/utilities";
import { ChangeEvent } from "react"; 
import { create } from "zustand";
import {produce} from 'immer';
 
type State = {
    itemSearch: ItemSearch
    collectionItems: Array<ItemReadDto>
    totalItems: number;
    items: Array<ItemRead>
    summary: Summary,
    dataForm: DataFormSale
    //Pagos
    payment: {
        isOpen: boolean
        openDialogCustom():void
        closeDialogCustom(): void
    },    
    //Navigation 
    navigation: {
        isOpen: boolean
        openDialogCustom():void
        closeDialogCustom(): void
    }
}

type Actions = {
    setItemSearch(itemSearch: ItemSearch): void    
    setSummary(summary: Summary): void
    getItemQty(productId: number): number
    setDataForm(dataForm: DataFormSale): void
    setCollectionItems(products: Array<ItemReadDto>): void
    addItemToCart(item: ItemRead): void
    removeItemFromCart(productId: number): void
    setTotalItems(): void,
    setItemChangeQty(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cartItem: ItemRead): void
    caculateTotals(): void
    resetForm(): void
}
export const useSaleStore = create<State & Actions>((set, get) => ({
    itemSearch: itemSearchInitialState,
    setItemSearch: (itemSearch) => {
        set({            
            itemSearch
        })
    },
    collectionItems: [],
    totalItems: 0,
    items: [],
    summary: summaryInitialState,
    setSummary(summary: Summary) {
        set(
            produce((state: State)=>{
                state.summary = summary;
            })
        ) 
    },
    dataForm: dataFormInitialState,
    getItemQty: (productId: number) => {
        const { items } = get();
        const dataCartItem = items.find(cartItem => cartItem.productId === productId);
        let qty = 1;
        if (dataCartItem) {
            qty = dataCartItem.quantity;
        }
        return qty;
    },
    setDataForm(dataForm) {
        set({
            dataForm
        })
    },
    setCollectionItems: (collectionItems) => {
        set({
            collectionItems
        })
    },
    addItemToCart: (item) => {
        const { items, setTotalItems, caculateTotals } = get();

        if (items.some(itemCompare => itemCompare.productId === item.productId)) {
            for (const itemToModify of items) {
                if (itemToModify.productId === item.productId) {
                    itemToModify.quantity = itemToModify.quantity + 1;
                    itemToModify.total = itemToModify.quantity * itemToModify.price;
                    break
                }

            }
            set(state => ({
                ...state,
                items: [...items],
            }))

        } else {
            set(state => ({
                ...state,
                items: [item, ...state.items],
            }))
        }
        setTotalItems();
        caculateTotals();
        addSound();
        SnackbarUtility.success('Agregado correctamente')
    },
    removeItemFromCart: (productId: number) => {
        const { setTotalItems, caculateTotals } = get();
        set((state) => ({ 
            items: state.items.filter(_ => _.productId !== productId)
        }))
        setTotalItems();
        caculateTotals();
        clearSound();
    },
    setTotalItems: () => set(state => ({ 
        totalItems: state.items.reduce((total, item) => total + item.quantity, 0)
    })),

    async setItemChangeQty(event, item) {
        const { items, setTotalItems, caculateTotals, dataForm } = get();

        let qty = Number(event.target.value)

        if (qty < 1) {
            qty = 1;
        }

        if (!item.takesInventory) {
            setItem();
            return
        }

        //Si el articulo lleva inventario 
        if (item.takesInventory) {

            // let warehouses: Array<WarehouseAsign> = dataForm.warehouses.filter(
            //     warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig
            // );

            // let dataWarehouse = {} as WarehouseAsign
            // if (warehouses.length > 0) {
            //     dataWarehouse = warehouses.find(warehouse => (warehouse.defaultBodega)) as WarehouseAsign
            // } else {
            //     SnackbarUtility.warning('No tienes bodegas asignadas')
            //     return
            // }


            // await ProductService.checkNotificationStock({
            //     idArticulo: item.productId,
            //     cantidad: qty ,
            //     idBodega: dataWarehouse.idBodega
            // }).then(async response => {
            //     const { code, message, titleSms } = response;
            //     if (code === "1") {
            //         setItem();
            //         return
            //     }

            //     let { isConfirmed } = await Swal.fire({
            //         title: `<small>${titleSms}</small>`,
            //         icon: 'warning',
            //         html: `<small>${message}</small>`,
            //         allowOutsideClick: false,
            //         allowEscapeKey: false,
            //     })

            //     if (isConfirmed) {
            //         if (code === "2") {
            //             setItem();
            //         }
            //     }
            // })

        }

        function setItem() {

            for (const itemToModify of items) {
                if (itemToModify.productId === item.productId) {
                    itemToModify.quantity = qty;
                    itemToModify.total = itemToModify.quantity * itemToModify.price;
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
        }

    },
    async resetForm() {
        set({ 
            totalItems: 0,
            items: []
        })
        clearSound();
        get().caculateTotals();

    },
    caculateTotals() {
        const { items } = get();
        let total = 0;
        for (const item of items) {
            total += item.total;
        }

        set(state => ({
            ...state,
            summary: {
                ...state.summary,
                total,
                netTotal: total
            }
        }))
    },
    payment: {
        isOpen: false,
        openDialogCustom() {
            set(
                produce((state:State)=>{
                    state.payment.isOpen = true
                }) 
            )
        },
        closeDialogCustom() {
            set(
                produce((state:State)=>{
                    state.payment.isOpen = false
                }) 
            )
        },
    },
    navigation: {
        isOpen: false,
        openDialogCustom() {
            set(
                produce((state:State)=>{
                    state.navigation.isOpen = true
                }) 
            )
        },
        closeDialogCustom() {
            set(
                produce((state:State)=>{
                    state.payment.isOpen = false
                }) 
            )
        },
    }
}))