import { createContext, useContext, useEffect, useReducer } from "react";
import { splitOrderReducer } from ".";

import { SaleService, getEstabs, orderService } from "@/core/services";
import {
    GET_ORDER_BEGIN,
    GET_ORDER_ERROR,
    GET_ORDER_SUCCESS,
    SET_ACTION_TYPE,
    SET_CHANGE_ORDER_ITEMS,
    SET_DATA_FORM,
    SET_LEFT_CHECKED_ORDER_ITEMS,
    SET_LEFT_ORDER_ITEMS,
    SET_PAYMENT_DATA,
    SET_RESET_DATA,
    SET_RIGHT_CHECKED_ORDER_ITEMS,
    SET_RIGHT_ORDER_DATA,
    SET_RIGHT_ORDER_ITEMS
} from "..";

import { orderReadForUpdateAdapter } from "@/core/adapters";
import { OrderItemDivide, Order, SplitOrderAction, SplitOrderState, dataFormInitialState } from "@/core/models";
import { PricingCalculateUtility, RoundNumber } from "@/core/utilities";
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
    createdAt: new Date(),
    userId: 0,
    taxPercentId: 0
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
    createdAt: new Date(),
    userId: 0,
    taxPercentId: 0
};
// Define el estado inicial del contexto
const initialState: SplitOrderState = {
    actionType: '',
    orderLoading: false,
    orderError: false,
    dataForm: dataFormInitialState,
    leftOrder: structuredClone(leftOrder),
    rightOrder: structuredClone(rightOrder),
    leftOrderItemsLength: 0,
    leftOrderItems: [],
    rightOrderItems: [],
    changeOrderItems: [],
    leftCheckedOrderItems: [],
    rightCheckedOrderItems: [],
    payment: {
        payload: {},
        open: false,
    }
}
const initialActions: SplitOrderAction = {
    setActionType: () => [],
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
            remainingQuantity: 0, subTotalSinImpuestos: 0, tax: 0, total: 0
        };
    },
    setPaymentData: () => [],
    resetData: () => []
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
            await getDataForForm(orderData.order.establecimientoId)
            // Actualiza el estado con los datos del pedido 
            resetData()
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
            console.log('abort component')
            resetData()
            // Cancela la solicitud de datos de pedido al desmontar
            cancelEndpoint();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function setActionType<T>(payload: T) {
        dispatch({
            type: SET_ACTION_TYPE,
            payload
        })
    }

    // Función para calcular la intersección entre dos arreglos
    const intersection = (checkedOrderItems: Array<OrderItemDivide>, leftOrderItems: Array<OrderItemDivide>) => {
        return checkedOrderItems.filter((value) => {
            return leftOrderItems.some((item) => item.id === value.id);
        });
        // return checkedOrderItems.filter((value) => leftOrderItems.indexOf(value) !== -1);
    }

    const not = (a: Array<OrderItemDivide>, b: Array<OrderItemDivide>) => {
        const results = a.filter((value) => b.indexOf(value) === -1);
        return results;
    }

    const setRightOrderItem = (payload: Array<OrderItemDivide>) => {
        dispatch({ type: SET_RIGHT_ORDER_ITEMS, payload })
        caculateTotals(state.rightOrder, payload)
    }

    const setLeftOrderItem = (payload: Array<OrderItemDivide>) => {
        dispatch({ type: SET_LEFT_ORDER_ITEMS, payload })
        caculateTotals(state.leftOrder, payload)
    }



    const caculateTotals = (order: Order, orderItems: Array<OrderItemDivide>) => {
        try {

            const obj = calculateOrderItemTotal(orderItems);

            order.subTotalSinImpuestos = obj.subTotalSinImpuestos;
            order.tax = obj.tax;
            order.total = obj.total
        } catch (error) {
            console.log(error)
        }
    }

    function calculateOrderItemTotal<T extends {
        remainingQuantity: number
        price: number
        discount: number
        total: number
        taxRateCode?: string
        priceWithVat: number
    }>(payload: T[]) {
        // let tax = 0; // Monto del IVA (12%)
        // let totalPlusVAT = 0; // Total con IVA
        // let importeTotal = 0; // Importe total con descuento 

        // const { quantity, discount, subTotalSinImpuestos, totalNetoIvaVigente } = payload.reduce((total, orderItem) => {

        //     // Calcular el precio del ítem teniendo en cuenta el descuento
        //     //const itemPrice = orderItem.price - orderItem.discount;
        //     const totalSubSinImpuesto = orderItem.remainingQuantity * orderItem.price;
        //     const totalNetoIvaVigente = ((orderItem.price * orderItem.remainingQuantity)) - orderItem.discount;
        //     const discount = orderItem.remainingQuantity * orderItem.discount;

        //     // Calcular el total del ítem
        //     //const itemTotal = itemPrice * orderItem.remainingQuantity;
        //     total.discount += discount;
        //     total.quantity += orderItem.remainingQuantity;
        //     // Agregar el total del ítem al subtotal sin impuestos
        //     total.subTotalSinImpuestos += totalSubSinImpuesto;

        //     // Si hay un impuesto correspondiente, agregar el total del ítem al total neto con IVA
        //     if (orderItem.taxRateCode === TAX_RATE_CODE.TWELVE_PERCENT) {
        //         total.totalNetoIvaVigente += totalNetoIvaVigente;
        //     }

        //     //total.importeTotal += Number((orderItem.priceWithVat * orderItem.remainingQuantity).toFixed(2))
        //     return total;
        // }, {
        //     quantity: 0,
        //     subTotalSinImpuestos: 0,
        //     totalNetoIvaVigente: 0,
        //     importeTotal: 0,
        //     discount: 0
        // })

        // const tax = totalNetoIvaVigente * state.dataForm.tarifaImpuestoVigente.percentage / 100;
        // const total = subTotalSinImpuestos + tax;
        // const importeTotal = total - discount;
        // // calcular valor impuesto vigente a partir del total 
        // // const price = PricingCalculateUtility.calculatePriceSale(importeTotal, state.dataForm.tarifaImpuestoVigente.percentage);
        // // tax = importeTotal - price;

        // return {
        //     remainingQuantity: quantity,
        //     subTotalSinImpuestos: RoundNumber(subTotalSinImpuestos, 5),
        //     tax: RoundNumber(tax, 5),
        //     total: RoundNumber(importeTotal, state.dataForm.decimal.nroTotalSubTotal)
        // }


        let tax = 0; // Monto del IVA (12%)
        // let totalPlusVAT = 0; // Total con IVA
        // let importeTotal = 0; // Importe total con descuento 

        const { quantity, subTotalSinImpuestos, totalNetoIva, importeTotal } = payload.reduce((total, orderItem) => {
            // Calcular el precio del ítem teniendo en cuenta el descuento
            const itemPrice = orderItem.price - orderItem.discount;

            // Calcular el total del ítem
            const itemTotal = itemPrice * orderItem.remainingQuantity;

            total.quantity += orderItem.remainingQuantity;
            // Agregar el total del ítem al subtotal sin impuestos
            total.subTotalSinImpuestos += itemTotal;

            // Si hay un impuesto correspondiente, agregar el total del ítem al total neto con IVA
            if (orderItem.taxRateCode === TAX_RATE_CODE.TWELVE_PERCENT) {
                total.totalNetoIva += itemTotal;
            }

            total.importeTotal += Number((orderItem.priceWithVat * orderItem.remainingQuantity).toFixed(2))
            return total;
        }, {
            quantity: 0,
            subTotalSinImpuestos: 0,
            totalNetoIva: 0,
            importeTotal: 0
        })
        // calcular valor impuesto vigente a partir del total 
        const price = PricingCalculateUtility.calculatePriceSale(importeTotal, state.dataForm.tarifaImpuestoVigente.percentage);
        tax = importeTotal - price;

        return {
            remainingQuantity: quantity,
            subTotalSinImpuestos: RoundNumber(subTotalSinImpuestos, 5),
            tax: RoundNumber(tax, 5),
            total: RoundNumber(importeTotal, 5)
        }
    }

    const setRightOrderData = (payload: Order) => {
        dispatch({
            type: SET_RIGHT_ORDER_DATA,
            payload
        })
    }

    const setChangeOrderItems = (payload: Array<OrderItemDivide>) => {
        dispatch({
            type: SET_CHANGE_ORDER_ITEMS,
            payload
        })
    }


    const setLeftCheckedOrderItems = (payload: Array<OrderItemDivide>) => {
        dispatch({
            type: SET_LEFT_CHECKED_ORDER_ITEMS,
            payload
        })
    }
    const setRightCheckedOrderItems = (payload: Array<OrderItemDivide>) => {
        dispatch({
            type: SET_RIGHT_CHECKED_ORDER_ITEMS,
            payload
        })
    }


    //Funciona para fusionar items seleccionados(cuenta general) con items (cuenta individual)
    function mergeArraysByField<T extends { id: number; remainingQuantity: number; price: number, total: number }>(array1: T[], array2: T[], field: keyof T): T[] {
        // Realiza una copia superficial de array1 para evitar mutar el array original
        const mergedArray: T[] = [];
        const closeArray2 = structuredClone(array2);

        for (const item1 of array1) {
            const dataOrderItem = closeArray2.find((item) => item[field] === item1[field]);

            if (dataOrderItem) {
                // Si existe en array2, suma la cantidad y calcula el nuevo precio
                const qty = dataOrderItem["remainingQuantity"] + item1.remainingQuantity
                const total = qty + item1.price
                dataOrderItem.remainingQuantity = qty;
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

        return mergedArray;
    }


    function mergeArraysByFieldLeft<T extends { id: number; remainingQuantity: number; price: number, total: number }>(
        array1: T[],
        array2: T[],
        field: keyof T
    ): T[] {
        const newArray2 = [...array2]; // Crear una copia de array2

        for (const item1 of array1) {
            const dataOrderItem = newArray2.find((item) => item[field] === item1[field]);

            if (dataOrderItem) {
                // Si la cantidad es diferente, resta la cantidad de array1 a newArray2
                if (item1.remainingQuantity !== dataOrderItem.remainingQuantity) {
                    dataOrderItem.remainingQuantity -= item1.remainingQuantity;
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
        dispatch({
            type: SET_PAYMENT_DATA,
            payload
        })

    }

    function resetData() {
        dispatch({
            type: SET_RESET_DATA,
            payload: {
                rightOrder: structuredClone(rightOrder),
                leftOrder: structuredClone(rightOrder)
            }
        })
    }



    // Proporciona el estado y las funciones del contexto a los componentes hijos
    return (
        <SplitOrderContext.Provider value={{
            ...state,
            fetchOrderData,
            setActionType,
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