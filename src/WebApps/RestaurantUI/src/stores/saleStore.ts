import {
    ItemRead,
    ItemSearch,
    ItemReadDto,
    Order,
    itemSearchInitialState,
    DataFormSale,
    dataFormInitialState,
    orderInitialState,
    CATEGORY_CODE
} from "@/core/models";
import { RoundNumber, SnackbarUtility, addSound, clearSound } from "@/core/utilities";
import { create } from "zustand";
import { produce } from 'immer';
import { SharedService, orderService, productService } from "@/core/services";
import Swal from "sweetalert2";
import { DOC_TYPE } from "@/core/constants";
import { itemToApi, summaryToApi } from "@/core/adapters";
import { showLoader, hideLoader } from "@/spinner";


const imgUrlPromocion = new URL('/assets/promocion.jpg', import.meta.url).href
const imgUrlCombo = new URL(`/assets/combo.jpg`, import.meta.url).href

const typeActions: { [key: string]: string } = {
    [DOC_TYPE.FV]: `
    Esta seguro de guardar el pedido como Factura? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
    [DOC_TYPE.NE]: `
    Esta seguro de guardar el pedido como Nota de Entrega? </br>
    <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
    [DOC_TYPE.OR]: `Esta seguro de guardar el pedido? </br>
    <small>El stock de los productos <strong>no se descontará</strong> hasta que se transforme a "Factura" o "Nota de Entrega".`

}

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
        params: any
        openDialogCustom(data: any): void
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
    setItemChangeQty(index: number, qty: number): void //Modificar cantidad del item  
    onChangePVP(id: number, index: number): void
    caculateTotals(): void
    resetForm(): void
    save(codDoc: string): void
}
export const useSaleStore = create<State & Actions>((set, get) => ({
    itemSearch: itemSearchInitialState,
    setDataEdit(obj: any) {
        const { order, orderItems } = obj;
        set(
            produce((state: State) => {
                state.order = order;
                state.items = orderItems
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
                },
                {
                    idSubFamilia: 0,
                    code: CATEGORY_CODE.PROM,
                    description: 'PROMOCIÓN',
                    s3ObjectUrl: imgUrlPromocion
                },
                {
                    idSubFamilia: 0,
                    code: CATEGORY_CODE.COM,
                    description: 'COMBOS',
                    s3ObjectUrl: imgUrlCombo
                }, ...dataForm.categories];
                //customer default
                if (!(state.order.orderId > 0) && dataForm.customer.customerCompanyId > 0) {

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
    async setItemChangeQty(index, qty) {
        const { order, items, dataForm, setTotalItems, caculateTotals, getItemQty } = get();
        const decimal = dataForm.decimal;

        const dataOrderItem = items.find((_, indexToCompare) => indexToCompare === index);

        if (dataOrderItem?.carryInventory) {
            showLoader();
            productService.checkNotificationStock({
                idArticulo: dataOrderItem.productId,
                cantidad: getItemQty(dataOrderItem.productId),
                idBodega: order.bodegaId
            }).then(async response => {
                const { code, message, titleSms } = response;
                if (code === "1") {
                    setQty();
                    return
                }

                const { isConfirmed } = await Swal.fire({
                    title: `<small>${titleSms}</small>`,
                    icon: 'warning',
                    html: `<small>${message}</small>`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                })

                if (isConfirmed) {
                    if (code === "2") {
                        setQty();
                    }
                }
            }).finally(() => hideLoader())
        }
        else {
            setQty();
        }

        function setQty() {
            const newArray = items.map((orderItem, orderItemIndex) => {
                const total = qty * orderItem.price;
                if (index === orderItemIndex) {
                    return {
                        ...orderItem,
                        quantity: qty,
                        total: RoundNumber(total, decimal.nroTotalDetalle)
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
        // clearSound();
        get().caculateTotals();

    },
    onChangePVP(id, index) {

        const { items, setTotalItems, caculateTotals } = get();
        const newArray = items.map((orderItem, orderItemIndex) => {
            if (index === orderItemIndex) {
                const dataPVP = orderItem.pvps.find(pvp => pvp.feeId === id);
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
        //Invocamos otro store de autencation en donde se recupera los establecimientos al inicar sesión 
        // const dataEstab = useAuthStore.getState().dataEstab;

        // Obtener los datos necesarios del estado (state)
        const { items, dataForm } = get();
        const { decimal, tarifaImpuestoVigente } = dataForm;

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
            if (matchingTaxRate?.taxRateCode === tarifaImpuestoVigente.taxRateCode) {
                totalNetoIva += itemTotal;
            }
        }

        // Calcular el monto del impuesto (IVA 12%) 
        tax = (totalNetoIva * tarifaImpuestoVigente.percentage) / 100;

        // Calcular el total con IVA
        totalPlusVAT = subTotalSinImpuestos + tax;

        // Calcular el importe total con descuento  
        importeTotal = totalPlusVAT;

        // Actualizar el estado (state) con los totales calculados y redondeados
        set(
            produce((state: State) => {
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
        params: {},
        openDialogCustom(params) {
            set(
                produce((state: State) => {
                    state.payment.isOpen = true
                    state.payment.params = params;
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
    }, 
    async save(codDoc: string) {
        const { order, items, resetForm, payment } = get();
        try {
            if (!(order.tableId > 0)) {
                Swal.fire({
                    icon: 'warning',
                    html: `Seleccione la Mesa`
                })
                return
            }
            if (items.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    html: `Agregue al menos un Item`
                })
                return
            }
            const { isConfirmed } = await Swal.fire({
                title: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'} Pedido`,
                html: typeActions[codDoc],
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'}`,
                cancelButtonText: 'No, cancelar!'
            })

            if (!isConfirmed) return

            const summaryResult = summaryToApi(order);
            const itemsResult = itemToApi(items);
            const taxesResult = items.flatMap(item => item.taxes);
            const data = {
                ...summaryResult,
                updateOrder: (order.orderId > 0) && codDoc === DOC_TYPE.OR,
                saveDoc: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
                codDoc,
                quickSale: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
                items: itemsResult,
                taxes: taxesResult,
                payments: {}
            }
            if (order.orderId > 0) {
                showLoader();
                orderService.put(order.orderId, data).then(response => {
                    hideLoader()
                    if (response.code === '0') {
                        SnackbarUtility.warning(response.message)
                    }
                    if (response.code === "1") {
                        SnackbarUtility.success(response.message);
                        // const queryParams: QueryParams = JSON.parse(response.payload)[0];
                        resetForm();
                    }
                }).finally(() => hideLoader())
            } else {
                showLoader();
                orderService.post(data).then(response => {
                    hideLoader()
                    if (response.code === '0') {
                        Swal.fire({
                            icon: 'warning',
                            html: response.message
                        })

                    }
                    if (response.code === "1") {
                        Swal.fire({
                            icon: 'success',
                            html: response.message,
                            timer: 1000
                        })
                        //SnackbarUtility.success(response.message);
                        //Order
                        if (codDoc === DOC_TYPE.OR) {
                            const orderId = JSON.parse(response.payload);
                            SharedService.getPrinter({
                                id: orderId,
                                documentoId: 0,
                                tipo: 2
                            })
                            resetForm();
                            return
                        }
                        const queryParams = JSON.parse(response.payload)[0];

                        if (queryParams.payAutomatic) {
                            payment.openDialogCustom(queryParams);
                            return
                        }


                        if (queryParams.printerAutomatic) {
                            SharedService.getPrinter({
                                id: queryParams.orderId,
                                documentoId: queryParams.idDocumento,
                                tipo: 1
                            })
                        } else {
                            resetForm();
                        }
                    }
                }).catch(() => hideLoader())
            }
        } catch (error) {
            console.log(error)
        }
    }
}))