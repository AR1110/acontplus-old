import { createContext, useContext, useEffect, useReducer } from "react";
import { splitOrderReducer } from ".";

import { SaleService, getEstabs, orderService } from "@/core/services";
import {
    GET_ORDER_BEGIN,
    GET_ORDER_ERROR,
    GET_ORDER_SUCCESS,
    SET_CHANGE_ORDER_ITEMS,
    SET_DATA_FORM,
    SET_FUNCTION_CLOSE_DIALOG,
    SET_LEFT_CHECKED_ORDER_ITEMS,
    SET_LEFT_ORDER_ITEMS,
    SET_PAYMENT_DATA,
    SET_RESET_DATA,
    SET_RIGHT_CHECKED_ORDER_ITEMS,
    SET_RIGHT_ORDER_DATA,
    SET_RIGHT_ORDER_ITEMS
} from "..";

import { orderReadForUpdateAdapter } from "@/core/adapters";
import { ItemRead, Order, SplitOrderAction, SplitOrderState, dataFormInitialState } from "@/core/models";
import { RoundNumber } from "@/core/utilities";
import { TAX_RATE_CODE } from "@/core/constants";

const leftOrder = {
    orderId: 0,
    establecimientoId: 0,
    puntoEmisionId: 0,
    customerCompanyId: 0,
    customerName: "",
    bodegaId: 0,
    tableId: 0,
    subTotalSinImpuestos: 0,
    tax: 0,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    netTotal: 0,
    tip: 0,
    obs: "",
    codDoc: "",
    quickSale: false,
    createdAt: new Date()
};

const rightOrder = {
    orderId: 0,
    establecimientoId: 0,
    puntoEmisionId: 0,
    customerCompanyId: 0,
    customerName: "",
    bodegaId: 0,
    tableId: 0,
    subTotalSinImpuestos: 0,
    tax: 0,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    netTotal: 0,
    tip: 0,
    obs: "",
    codDoc: "",
    quickSale: false,
    createdAt: new Date()
};
// Define el estado inicial del contexto
const initialState: SplitOrderState = {

    orderLoading: false,
    orderError: false,
    dataForm: dataFormInitialState,
    leftOrder,
    rightOrder,
    leftOrderItemsLength: 0,
    leftOrderItems: [],
    rightOrderItems: [],
    changeOrderItems: [],
    leftCheckedOrderItems: [],
    rightCheckedOrderItems: [],
    payment: {
        payload: {},
        open: false,
    },
    closeDialogDivide: ()=>[]
}
const initialActions: SplitOrderAction = {
    fetchOrderData: (id: number) => id,
    intersection: () => [],
    not: () => [],

    setRightOrderItem: () => [],
    setLeftOrderItem: () => [],
    setRightOrderData: () => [],
    setChangeOrderItems: () => [],
    mergeArraysByField: () => [],
    mergeArraysByFieldLeft: () => [],
    setLeftCheckedOrderItems: () => [],
    setRightCheckedOrderItems: () => [],
    calculateOrderItemTotal: () => {
        return {
            quantity: 0, subTotalSinImpuestos: 0, tax: 0, total: 0
        };
    },
    setPaymentData: () => [],
    resetData: () => [],
    setCloseDialogDivide:()=>[], 
};

// Crea un contexto llamado SplitOrderContext
export const SplitOrderContext = createContext<SplitOrderState & SplitOrderAction>(
    {
        ...initialState,
        ...initialActions
    }
)


// Define una interfaz para las propiedades del componente Provider

interface Props {
    children: JSX.Element | JSX.Element[]
}
export const SplitOrderProvider = ({ children }: Props) => {

    // Utiliza useReducer para gestionar el estado
    const [state, dispatch] = useReducer(splitOrderReducer, initialState);

    let controller: AbortController;

    const getDataForForm = (establecimientoId: number) => {
        const establecimientos = getEstabs();
        const dataEstab = establecimientos.find(estab => estab.idEstablecimiento === establecimientoId)

        SaleService.getDataForForm(JSON.stringify({
            codEstab: dataEstab?.codEstab
        })).then(response => {
            dispatch({ type: SET_DATA_FORM, payload: response })
        })
    }

    // Función para cargar datos de pedido
    const fetchOrderData = async (id: number) => {
        try {
            const dataFetch = orderService.getId(id);

            if (dataFetch.controller) controller = dataFetch.controller;

            // Inicia el indicador de carga
            dispatch({ type: GET_ORDER_BEGIN })

            const resultAxios = await dataFetch.call;

            const response = resultAxios.data;
            const orderData = await orderReadForUpdateAdapter(response)
            console.log(orderData)
            await getDataForForm(orderData.order.establecimientoId)
            // Actualiza el estado con los datos del pedido
            dispatch({ type: GET_ORDER_SUCCESS, payload: orderData })

        } catch (error) {
            dispatch({ type: GET_ORDER_ERROR })
        }
    }

    // Función para cancelar la solicitud de datos de pedido
    const cancelEndpoint = () => {
        dispatch({ type: GET_ORDER_ERROR })
        controller && controller.abort();
    };

    // Utiliza useEffect para realizar una limpieza al desmontar el componente
    useEffect(() => {
        return () => {
            dispatch({
                action: SET_RESET_DATA,
                payload: {
                    rightOrder,
                    leftOrder
                }
            })
            // Cancela la solicitud de datos de pedido al desmontar
            cancelEndpoint();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Función para calcular la intersección entre dos arreglos
    const intersection = (checkedOrderItems: Array<ItemRead>, leftOrderItems: Array<ItemRead>) => {
        return checkedOrderItems.filter((value) => {
            return leftOrderItems.some((item) => item.id === value.id);
        });
        // return checkedOrderItems.filter((value) => leftOrderItems.indexOf(value) !== -1);
    }

    const not = (a: Array<ItemRead>, b: Array<ItemRead>) => {
        const results = a.filter((value) => b.indexOf(value) === -1);
        return results;
    }

    const setRightOrderItem = (payload: Array<ItemRead>) => {
        dispatch({ type: SET_RIGHT_ORDER_ITEMS, payload })
        caculateTotals(state.rightOrder, payload)
    }

    const setLeftOrderItem = (payload: Array<ItemRead>) => {
        dispatch({ type: SET_LEFT_ORDER_ITEMS, payload })
        caculateTotals(state.leftOrder, payload)
    }

    function calculateOrderItemTotal<T extends {
        quantity: number
        price: number
        discount: number
        total: number
        taxRateCode?: string
        priceWithVat: number
    }>(payload: T[]) {
        let tax = 0; // Monto del IVA (12%)
        // let totalPlusVAT = 0; // Total con IVA
        // let importeTotal = 0; // Importe total con descuento 

        const { quantity, subTotalSinImpuestos, totalNetoIva, importeTotal } = payload.reduce((total, orderItem) => {
            // Calcular el precio del ítem teniendo en cuenta el descuento
            const itemPrice = orderItem.price - orderItem.discount;

            // Calcular el total del ítem
            const itemTotal = itemPrice * orderItem.quantity;

            total.quantity += orderItem.quantity;
            // Agregar el total del ítem al subtotal sin impuestos
            total.subTotalSinImpuestos += itemTotal;

            // Si hay un impuesto correspondiente, agregar el total del ítem al total neto con IVA
            if (orderItem.taxRateCode === TAX_RATE_CODE.TWELVE_PERCENT) {
                total.totalNetoIva += itemTotal;
            }

            total.importeTotal += Number((orderItem.priceWithVat * orderItem.quantity).toFixed(2))
            return total;
        }, {
            quantity: 0,
            subTotalSinImpuestos: 0,
            totalNetoIva: 0,
            importeTotal: 0
        })

        // Calcular el monto del impuesto (IVA 12%)
        tax = (totalNetoIva * 12) / 100;

        // Calcular el total con IVA
        //  totalPlusVAT = subTotalSinImpuestos + tax;

        // Calcular el importe total con descuento  
        // importeTotal = totalPlusVAT;

        return {
            quantity,
            subTotalSinImpuestos: RoundNumber(subTotalSinImpuestos, 5),
            tax: RoundNumber(tax, 5),
            total: RoundNumber(importeTotal, 5)
        }
    }

    const caculateTotals = (order: Order, orderItems: Array<ItemRead>) => {
        try {

            const obj = calculateOrderItemTotal(orderItems);

            order.netTotal = obj.total;
            order.subTotalSinImpuestos = obj.subTotalSinImpuestos;
            order.tax = obj.tax;
            order.total = obj.total
        } catch (error) {
            console.log(error)
        }
    }

    const setRightOrderData = (payload: Order) => {
        dispatch({
            type: SET_RIGHT_ORDER_DATA,
            payload
        })
    }

    const setChangeOrderItems = (payload: Array<ItemRead>) => {
        dispatch({
            type: SET_CHANGE_ORDER_ITEMS,
            payload
        })
    }


    const setLeftCheckedOrderItems = (payload: Array<ItemRead>) => {
        dispatch({
            type: SET_LEFT_CHECKED_ORDER_ITEMS,
            payload
        })
    }
    const setRightCheckedOrderItems = (payload: Array<ItemRead>) => {
        dispatch({
            type: SET_RIGHT_CHECKED_ORDER_ITEMS,
            payload
        })
    }


    //Funciona para fusionar items seleccionados(cuenta general) con items (cuenta individual)
    function mergeArraysByField<T extends { id: number; quantity: number; price: number, total: number }>(array1: T[], array2: T[], field: keyof T): T[] {
        // Realiza una copia superficial de array1 para evitar mutar el array original
        const mergedArray: T[] = [];
        const closeArray2 = structuredClone(array2);

        for (const item1 of array1) {
            const dataOrderItem = closeArray2.find((item) => item[field] === item1[field]);

            if (dataOrderItem) {
                // Si existe en array2, suma la cantidad y calcula el nuevo precio
                const qty = dataOrderItem["quantity"] + item1.quantity
                const total = qty + item1.price
                dataOrderItem.quantity = qty;
                dataOrderItem.total = total;
            } else {
                // Si no existe en array2, agrega el elemento de array1 en array2
                mergedArray.push(item1);
            }

        }

        for (const item2 of closeArray2) {
            const existsInMergedArray = mergedArray.some((item) => item[field] === item2[field]);
            if (!existsInMergedArray) {
                mergedArray.push(item2);
            }
        }
        console.log(array2)
        return mergedArray;
    }


    function mergeArraysByFieldLeft<T extends { id: number; quantity: number; price: number, total: number }>(
        array1: T[],
        array2: T[],
        field: keyof T
    ): T[] {
        const newArray2 = [...array2]; // Crear una copia de array2

        for (const item1 of array1) {
            const dataOrderItem = newArray2.find((item) => item[field] === item1[field]);

            if (dataOrderItem) {
                // Si la cantidad es diferente, resta la cantidad de array1 a newArray2
                if (item1.quantity !== dataOrderItem.quantity) {
                    dataOrderItem.quantity -= item1.quantity;
                } else {
                    // Si la cantidad es igual, elimina el elemento de newArray2
                    const item2Index = newArray2.findIndex((item) => item[field] === item1[field]);
                    if (item2Index !== -1) {
                        newArray2.splice(item2Index, 1);
                    }
                }
            }
        }

        return newArray2;
    }

    function setPaymentData<T>(payload: T) {
        console.log('payment settttt hjdgdhje')
        dispatch({
            type: SET_PAYMENT_DATA,
            payload
        })

    }

    function resetData() {
        dispatch({
            type: SET_RESET_DATA,
            payload: {
                rightOrder,
                leftOrder
            }
        })
    }

    const setCloseDialogDivide = (payload:()=>void)=>{
        dispatch({
            type: SET_FUNCTION_CLOSE_DIALOG,
            payload
        })
    }
   


    // Proporciona el estado y las funciones del contexto a los componentes hijos
    return (
        <SplitOrderContext.Provider value={{
            ...state,
            fetchOrderData,
            intersection,
            not,
            setRightOrderItem,
            setLeftOrderItem,
            setRightOrderData,
            setChangeOrderItems,
            mergeArraysByField,
            mergeArraysByFieldLeft,
            setLeftCheckedOrderItems,
            setRightCheckedOrderItems,
            calculateOrderItemTotal,
            setPaymentData,
            resetData,
            setCloseDialogDivide,  
        }}>
            {children}
        </SplitOrderContext.Provider>
    )
}

// Exporta un hook personalizado para acceder al contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useSplitOrderContext = () => {
    return useContext(SplitOrderContext)
}