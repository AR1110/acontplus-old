import {
    ItemRead,
    ItemSearch,
    ItemReadDto,
    Summary,
    itemSearchInitialState,
    DataFormSale,
    dataFormInitialState,
    WarehouseAsign
} from "@/core/models";
import { ProductService } from "@/core/services";
import { SnackbarUtility, addSound, clearSound } from "@/core/utilities";
import { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { create } from "zustand";

interface SaleState {
    itemSearch: ItemSearch
    setItemSearch(itemSearch: ItemSearch): void
    collectionItems: Array<ItemReadDto>
    totalItems: number;
    items: Array<ItemRead>
    summary: Summary,
    setSummary(summary: Summary): void
    dataForm: DataFormSale,
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



export const saleStore = create<SaleState>((set, get) => ({
    itemSearch: itemSearchInitialState,
    setItemSearch: (itemSearch) => {
        set(state => ({
            ...state,
            itemSearch
        }))
    },
    collectionItems: [],
    totalItems: 0,
    items: [],
    summary: {
        establecimientoId: 0,
        puntoEmisionId: 0,
        customerCompanyId: 0,
        tableId: 0,
        tax: 0,
        taxAmount: 0,
        discount: 0,
        total: 0,
        netTotal: 0
    },
    setSummary(summary: Summary) {
        set(state => ({
            ...state,
            summary
        }))
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
        set(state => ({
            ...state,
            dataForm
        }))
    },
    setCollectionItems: (collectionItems) => {
        set(state => ({
            ...state,
            collectionItems
        }))
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
            ...state,
            items: state.items.filter(_ => _.productId !== productId)
        }))
        setTotalItems();
        caculateTotals();
        clearSound();
    },
    setTotalItems: () => set(state => ({
        ...state,
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

        set(state => ({
            ...state,
            totalItems: 0,
            cartItems: []
        }))
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
    }
}))