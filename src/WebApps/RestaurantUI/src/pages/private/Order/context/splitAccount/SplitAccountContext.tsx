import { createContext, useContext, useEffect, useReducer } from "react";
import { splitAccountReducer } from ".";
import { SplitAccountAction, SplitAccountState } from "../../models";
import { orderService } from "@/core/services";
import {
    GET_ORDER_BEGIN,
    GET_ORDER_ERROR,
    GET_ORDER_SUCCESS,
    SET_CHECKED_ORDER_ITEMS,
    SET_FILTER_ORDER_ITEMS,
    SET_LEFT_ORDER_ITEMS,
    SET_RIGHT_ORDER_DATA,
    SET_RIGHT_ORDER_ITEMS
} from "..";

import { orderReadForUpdateAdapter } from "@/core/adapters";
import { ItemRead, Order } from "@/core/models";
import { RoundNumber } from "@/core/utilities";
import { TAX_RATE_CODE } from "@/core/constants";


// Define el estado inicial del contexto
const initialState: SplitAccountState = {
    orderLoading: false,
    orderError: false,

    leftOrder: {
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
    },
    rightOrder: {
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
    },
    leftOrderItems: [],
    rightOrderItems: [],
    checkedOrderItems: [],
    filteredItems: []
}

// Define las acciones iniciales del contexto
const initialActions: SplitAccountAction = {
    fetchOrderData: (id: number) => id,
    intersection: () => [],
    not: () => [],
    setCheckedOrderItem: () => [],
    setRightOrderItem: () => [],
    setLeftOrderItem: () => [],
    caculateTotals: () => [],
    setRightOrderData: () => [],
    setFilteredItems: () => [],
    mergeArraysByField: () => [],
    mergeArraysByFieldLeft:()=>[]
}


// Crea un contexto llamado SplitAccountContext
export const SplitAccountContext = createContext<SplitAccountState & SplitAccountAction>(
    {
        ...initialState,
        ...initialActions
    }
)


// Define una interfaz para las propiedades del componente Provider

interface Props {
    children: JSX.Element | JSX.Element[]
}
export const SpliAccountProvider = ({ children }: Props) => {

    // Utiliza useReducer para gestionar el estado
    const [state, dispatch] = useReducer(splitAccountReducer, initialState);

    let controller: AbortController;

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
            // Cancela la solicitud de datos de pedido al desmontar
            cancelEndpoint();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Función para calcular la intersección entre dos arreglos
    const intersection = (checkedOrderItems: Array<ItemRead>, leftOrderItems: Array<ItemRead>) => {
        return checkedOrderItems.filter((value) => leftOrderItems.indexOf(value) !== -1);
    }

    const not = (a: Array<ItemRead>, b: Array<ItemRead>) => {

        const results = a.map(value => {
            const dataOrderItemB = b.find(orderItemB => orderItemB.id === value.id && orderItemB.quantity !== value.quantity)
            console.log(dataOrderItemB)
            if (dataOrderItemB) {

                const qty = value.quantity - dataOrderItemB.quantity;
                const total = qty * value.price;
                value.quantity = qty;
                value.total = total;
                return value;
            }
            return value;
        }).filter((value) => b.findIndex(orderItem => orderItem.id === value.id) === -1)
        console.log(results)
        return results
        // const results = a.filter((value) => b.indexOf(value) === -1);
        // return results;
    }

    const setCheckedOrderItem = (checkedOrderItems: Array<ItemRead>) => {
        dispatch({ type: SET_CHECKED_ORDER_ITEMS, payload: checkedOrderItems })
    }

    const setRightOrderItem = (payload: Array<ItemRead>) => {
        dispatch({ type: SET_RIGHT_ORDER_ITEMS, payload })
        caculateTotals(state.rightOrder, payload)
    }

    const setLeftOrderItem = (payload: Array<ItemRead>) => {
        dispatch({ type: SET_LEFT_ORDER_ITEMS, payload })
        caculateTotals(state.leftOrder, payload)
    }

    const caculateTotals = (order: Order, orderItems: Array<ItemRead>) => {
        try {
            // Inicializar variables para los totales
            // subTotalSinImpuestos = 0; Subtotal sin impuestos
            // totalNetoIva = 0; Total neto con IVA
            let tax = 0; // Monto del IVA (12%)
            let totalPlusVAT = 0; // Total con IVA
            let importeTotal = 0; // Importe total con descuento 

            const { subTotalSinImpuestos, totalNetoIva } = orderItems.reduce((total, orderItem) => {
                // Calcular el precio del ítem teniendo en cuenta el descuento
                const itemPrice = orderItem.price - orderItem.discount;

                // Calcular el total del ítem
                const itemTotal = itemPrice * orderItem.quantity;

                // Agregar el total del ítem al subtotal sin impuestos
                total.subTotalSinImpuestos += itemTotal;

                // Si hay un impuesto correspondiente, agregar el total del ítem al total neto con IVA
                if (orderItem.taxRateCode === TAX_RATE_CODE.TWELVE_PERCENT) {
                    total.totalNetoIva += itemTotal;
                }

                return total;
            }, {
                subTotalSinImpuestos: 0,
                totalNetoIva: 0
            })



            // Calcular el monto del impuesto (IVA 12%)
            tax = (totalNetoIva * 12) / 100;

            // Calcular el total con IVA
            totalPlusVAT = subTotalSinImpuestos + tax;

            // Calcular el importe total con descuento  
            importeTotal = totalPlusVAT;

            order.netTotal = importeTotal;
            order.subTotalSinImpuestos = RoundNumber(subTotalSinImpuestos, 5);
            order.tax = RoundNumber(tax, 5);
            order.total = RoundNumber(importeTotal, 5);
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

    const setFilteredItems = (payload: Array<ItemRead>) => {
        dispatch({
            type: SET_FILTER_ORDER_ITEMS,
            payload
        })
    }


    //Funciona para fusionar items seleccionados(cuenta general) con items (cuenta individual)
    function mergeArraysByField<T extends { id: number; quantity: number; price: number, total: number }>(array1: T[], array2: T[], field: keyof T): T[] {
        // Realiza una copia superficial de array1 para evitar mutar el array original
        const mergedArray: T[] = [];

        for (const item1 of array1) {
            const dataOrderItem = array2.find((item) => item[field] === item1[field]);

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

        for (const item2 of array2) {
            const existsInMergedArray = mergedArray.some((item) => item[field] === item2[field]);
            if (!existsInMergedArray) {
                mergedArray.push(item2);
            }
        }
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


    // Proporciona el estado y las funciones del contexto a los componentes hijos
    return (
        <SplitAccountContext.Provider value={{
            ...state,
            fetchOrderData,
            intersection,
            not,
            setCheckedOrderItem,
            setRightOrderItem,
            setLeftOrderItem,
            caculateTotals,
            setRightOrderData,
            setFilteredItems,
            mergeArraysByField,
            mergeArraysByFieldLeft
        }}>
            {children}
        </SplitAccountContext.Provider>
    )
}

// Exporta un hook personalizado para acceder al contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useSplitAccountContext = () => {
    return useContext(SplitAccountContext)
}