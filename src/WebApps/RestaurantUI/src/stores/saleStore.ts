import {
    ItemRead,
    ItemSearch,
    ItemReadDto,
    Order,
    itemSearchInitialState,
    DataFormSale,
    dataFormInitialState,
    orderInitialState
} from "@/core/models";
import { SnackbarUtility, addSound, clearSound } from "@/core/utilities";
import { ChangeEvent } from "react";
import { create } from "zustand";
import { produce } from 'immer';

type State = { 
    itemSearch: ItemSearch
    collectionItems: Array<ItemReadDto>
    totalItems: number;
    items: Array<ItemRead>
    order: Order,
    dataForm: DataFormSale
    //Pagos
    payment: {
        isOpen: boolean
        openDialogCustom(): void
        closeDialogCustom(): void
    },
    //Navigation 
    navigation: {
        isOpen: boolean
        openDialogCustom(): void
        closeDialogCustom(): void
    }
}

type Actions = {
    setDataEdit(obj: object): void
    setChangeValueOrderItem<K extends keyof ItemRead>(itemIndex: number, property: K, newValue: ItemRead[K]): void
    setItemSearch(itemSearch: ItemSearch): void
    setSummary(order: Order): void
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
    setDataEdit(obj: any) {
        const { order, orderItems } = obj;
        const orderAdapt = {
            orderId: order.id,
            establecimientoId: order.establecimientoId,
            puntoEmisionId: order.puntoEmisionId,
            customerCompanyId: order.customerCompanyId,
            bodegaId: 0,
            tableId: order.tableId,
            subTotalSinImpuestos: 0,
            tax: order.tax,
            taxPercent: order.taxPercent,
            taxAmount: 0,
            discount: order.discount,
            total: order.total,
            netTotal: 0,
            tip: 0,
            obs: "",
            codDoc: order.codDoc,
            quickSale: false,
            createdAt: new Date(order.createdAt)
        }
        set(
            produce((state: State) => {
                state.order = orderAdapt;
                state.items = orderItems.map((orderItem: any) => {
                    console.log(orderItem)
                    return orderItem;

                })

            })
        )
        console.log(obj)
    },
    setChangeValueOrderItem(itemIndex, prop, newValue){
        const {items} = get(); 
        
        const newArray = items.map((elem, index) => {
            if(index==itemIndex) {
                return {
                    ...elem,
                    [prop]: newValue
                }                
            }
            return elem;
        });
         
        set(
            produce((state: State)=>{
                state.items = newArray;                

            })
        )
    },
    setItemSearch: (itemSearch) => {
        set({
            itemSearch
        })
    },
    collectionItems: [],
    totalItems: 0,
    items: [],
    order: orderInitialState,
    setSummary(order: Order) {
        set(
            produce((state: State) => {
                state.order = order;
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
        set(
            produce((state:State)=>{
                state.dataForm = dataForm;                
            })
        )
    },
    setCollectionItems: (collectionItems) => {
        set({
            collectionItems
        })
    },
    addItemToCart: (item) => {
        const { items, setTotalItems, caculateTotals } = get();

        if (items.some(itemCompare => itemCompare.productId === item.productId)) {

            const newArray = items.map((itemToModify) => {
                if(itemToModify.productId === item.productId) {
                    const sumQty = itemToModify.quantity + 1;
                    const sumTotal = sumQty * itemToModify.price;
                  
                    return {
                        ...itemToModify,
                        quantity: sumQty,
                        total: sumTotal
                    }                
                }
                return itemToModify;
            });
            
            set(
                produce((state:State)=>{
                    state.items = newArray;
                })
            ) 
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
    removeItemFromCart: (indexItem: number) => {
        const { setTotalItems, caculateTotals } = get();
        set((state) => ({
            items: state.items.filter((_, index) => index !== indexItem)
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
        set(
            produce((state: State)=>{ 
                state.order.orderId = 0;
                state.totalItems = 0;
                state.items = []                
            })
        )
        clearSound();
        get().caculateTotals();

    },
    caculateTotals() {
        const { items } = get();
        let total = 0;
        for (const item of items) {
            total += item.total;
        }

        set(
            produce((state: State) => {
                state.order.total = total;
                state.order.netTotal = total;
            })
        )
    },
    payment: {
        isOpen: false,
        openDialogCustom() {
            set(
                produce((state: State) => {
                    state.payment.isOpen = true
                })
            )
        },
        closeDialogCustom() {
            set(
                produce((state: State) => {
                    state.payment.isOpen = false
                })
            )
        },
    },
    navigation: {
        isOpen: false,
        openDialogCustom() {
            set(
                produce((state: State) => {
                    state.navigation.isOpen = true
                })
            )
        },
        closeDialogCustom() {
            set(
                produce((state: State) => {
                    state.payment.isOpen = false
                })
            )
        },
    }
}))