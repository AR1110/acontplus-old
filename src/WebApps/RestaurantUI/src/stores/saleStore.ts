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
import { RoundNumber, SnackbarUtility, addSound, clearSound } from "@/core/utilities";
import { ChangeEvent } from "react";
import { create } from "zustand";
import { produce } from 'immer';

type State = {
    itemSearch: ItemSearch
    tempOrderItems: Array<ItemReadDto>
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
    filterOderItems(textSearch: string): void
    getItemQty(productId: number): number
    setDataForm(dataForm: DataFormSale): void
    setCollectionItems(products: Array<ItemReadDto>): void
    addItemToCart(item: ItemRead): void //Añadir Item 
    removeItemFromCart(productId: number): void //Eliminar item 
    setTotalItems(): void, //Calcular totales
    setAddQuantity(index: number, value: number): void //Añadir cantidad
    setRemoveQuantity(index: number, value: number): void //Restar cantidad
    setItemChangeQty(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        cartItem: ItemRead,
    ): void //Modificar cantidad del item 
    onChangePVP(id:number, index:number):void
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
            customerName: order.customerName,
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
            obs: order.obs,
            codDoc: order.codDoc,
            quickSale: false,
            createdAt: new Date(order.createdAt),
            table: {
                tableName: order.tableName,
                numberTable: order.numberTable
            }
        }
        set(
            produce((state: State) => {
                state.order = orderAdapt;
                state.items = orderItems.map((orderItem: any) => {

                    return {
                        ...orderItem,
                        code: orderItem.codigo,
                        description: orderItem.descripcion
                    }

                })

            })
        )

    },
    setChangeValueOrderItem(itemIndex, prop, newValue) {
        const { items } = get();

        const newArray = items.map((elem, index) => {
            if (index == itemIndex) {
                return {
                    ...elem,
                    [prop]: newValue
                }
            }
            return elem;
        });

        set(
            produce((state: State) => {
                state.items = newArray;

            })
        )
    },
    setItemSearch: (itemSearch) => {
        set({
            itemSearch
        })
    },
    tempOrderItems: [],
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

    filterOderItems(textSearch) {
        const { tempOrderItems } = get();
        // const tempOrderItems = structuredClone(tempOrderItems);
        if (!textSearch) {
            set(
                produce((state: State) => {
                    state.collectionItems = tempOrderItems;
                })
            )
            return
        }

        const filteredItems = tempOrderItems.filter((item) => {
            return (
                item.code.toLowerCase().includes(textSearch.toLowerCase()) ||
                item.description.toLowerCase().includes(textSearch.toLowerCase())
            );
        });
        set(
            produce((state: State) => {
                state.collectionItems = filteredItems;
            })
        )

    },

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
            produce((state: State) => { 
                state.dataForm = dataForm;
                state.dataForm.categories = [{
                    idSubFamilia: 0,
                    code: "",
                    description: 'Todos',
                    s3ObjectUrl: ''
                }, ...dataForm.categories];
                //customer default
                if(!(state.order.orderId > 0) && dataForm.customer.customerCompanyId>0){
                    
                    state.order.customerCompanyId = dataForm.customer.customerCompanyId;
                    state.order.customerName = dataForm.customer.fiscalName;
                } 
            })
        )
    },
    setCollectionItems: (collectionItems) => {
        set(
            produce((state: State) => {
                state.collectionItems = collectionItems;
                state.tempOrderItems = structuredClone(collectionItems)
            })
        )
        // set({
        //     collectionItems
        // })
    },
    addItemToCart: (item) => {
        const { items, setTotalItems, caculateTotals } = get();

        if (items.some(itemCompare => itemCompare.productId === item.productId)) {

            const newArray = items.map((itemToModify) => {
                if (itemToModify.productId === item.productId) {
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
                produce((state: State) => {
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

    setAddQuantity(index: number, value: number) {

        const { items, setTotalItems, caculateTotals } = get();
        const newArray = items.map((orderItem, orderItemIndex) => {
            const total = value * orderItem.price;
            if (index === orderItemIndex) {
                return {
                    ...orderItem,
                    quantity: value,
                    total: RoundNumber(total, 2)
                };
            } else {
                return orderItem;
            }
        })
        set(
            produce((state: State) => {
                state.items = newArray;
            })
        )
        setTotalItems();
        caculateTotals();
        addSound();
    },
    setRemoveQuantity(index: number, value: number) {

        const { items, setTotalItems, caculateTotals } = get();
        const newArray = items.map((orderItem, orderItemIndex) => {
            const total = value * orderItem.price;
            if (index === orderItemIndex) {
                return {
                    ...orderItem,
                    quantity: value,
                    total: RoundNumber(total, 2)
                };
            } else {
                return orderItem;
            }
        })
        set(
            produce((state: State) => {
                state.items = newArray;
            })
        )
        setTotalItems();
        caculateTotals();
        addSound();
    },
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
            produce((state: State) => {
                state.order.tableId = 0,
                    state.order.obs = "",
                    state.order.customerName = "",
                    state.order.customerCompanyId = 0,
                    state.order.orderId = 0;
                state.totalItems = 0;
                state.items = [];
                state.order.table = {}
            })
        )
        clearSound();
        get().caculateTotals();

    },
    onChangePVP(id, index){
         
        const { items, setTotalItems, caculateTotals } = get();
        const newArray = items.map((orderItem, orderItemIndex) => {         
            if (index === orderItemIndex) {
                const dataPVP = orderItem.pvps.find(pvp=>pvp.feeId === id);
                const total = orderItem.quantity * (dataPVP?.salePrice ?? 0);
                return {
                    ...orderItem, 
                    feeId: dataPVP?.feeId ?? 0, 
                    price: dataPVP?.salePrice ?? 0,
                    priceWithVat: dataPVP?.priceWithVat ?? 0,                  
                    total: RoundNumber(total, 2)
                };
            } else {
                return orderItem;
            }
        })
        set(
            produce((state: State) => {
                state.items = newArray;
            })
        )
        setTotalItems();
        caculateTotals();
    },
    caculateTotals() {

        // Obtener los datos necesarios del estado (state)
        const { items, dataForm } = get();
        const decimal = dataForm.decimal;

        // Inicializar variables para los totales
        let subTotalSinImpuestos = 0; // Subtotal sin impuestos
        let totalNetoIva = 0; // Total neto con IVA
        let tax = 0; // Monto del IVA (12%)
        let totalPlusVAT = 0; // Total con IVA
        let importeTotal = 0; // Importe total con descuento 

        // Iterar a través de los ítems del pedido  
        for (const item of items) {
            // Calcular el precio del ítem teniendo en cuenta el descuento
            const itemPrice = item.price - item.discount;

            // Calcular el total del ítem
            const itemTotal = itemPrice * item.quantity;

            // Agregar el total del ítem al subtotal sin impuestos
            subTotalSinImpuestos += itemTotal;

            // Verificar si el ítem tiene un impuesto correspondiente en dataForm
            const matchingTaxRate = dataForm.taxRates.find(
                (taxRate) => taxRate.taxRateId === item.taxPercentId
            );

            // Si hay un impuesto correspondiente, agregar el total del ítem al total neto con IVA
            if (matchingTaxRate?.taxRateCode === "2") {
                totalNetoIva += itemTotal;
            }
        }

        // Calcular el monto del impuesto (IVA 12%)
        tax = (totalNetoIva * 12) / 100;

        // Calcular el total con IVA
        totalPlusVAT = subTotalSinImpuestos + tax;

        // Calcular el importe total con descuento  
        importeTotal = totalPlusVAT;

        // Actualizar el estado (state) con los totales calculados y redondeados
        set(
            produce((state: State) => {
                state.order.netTotal = importeTotal;
                state.order.subTotalSinImpuestos = RoundNumber(
                    subTotalSinImpuestos,
                    decimal.nroTotalSubTotal
                );
                state.order.tax = RoundNumber(tax, decimal.nroIva);
                state.order.total = RoundNumber(importeTotal, decimal.importeTotal);
            })
        );
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
            get().resetForm();
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
                    state.navigation.isOpen = false
                })
            )
        },
    }
}))