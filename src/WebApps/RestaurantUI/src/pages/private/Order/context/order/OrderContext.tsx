import { createContext, useContext, useEffect, useReducer } from "react";
import { GET_ORDERS_BEGIN, GET_ORDERS_ERROR, GET_ORDERS_SUCCESS, SET_DATA_FILTER, orderReducer } from ".";
import { orderService } from "@/core/services";
import { OrderActions, OrderState, orderFilter } from "@/core/models";
import { orderReadAdapter } from "@/core/adapters";
import axios, { CancelTokenSource } from "axios";
import { useLoaderStore } from "@/stores";


const initialState: OrderState = {
    orderLoading: false,
    orderError: false,
    dataFilter: orderFilter,
    orders: []
}
const initialActions: OrderActions = {
    fetchOrders: () => [],
    setDataFilter: () => []
}
export const OrderContext = createContext<OrderState & OrderActions>({
    ...initialState,
    ...initialActions
});


interface Props {
    children: JSX.Element | JSX.Element[]
}

export const OrderProvider = ({ children }: Props) => {
    // Utiliza useReducer para gestionar el estado
    const [state, dispatch] = useReducer(orderReducer, initialState);
    const showLoader = useLoaderStore((state) => state.showLoader);
    let cancelTokenSource: CancelTokenSource | null = null;

    // Función para cargar datos de pedido
    const fetchOrders = async () => {
        try {
            // Inicia el indicador de carga
            dispatch({ type: GET_ORDERS_BEGIN })
            showLoader(true)
            // Check if we made a request
            if (cancelTokenSource) {
                // Cancel the previous request before making a new request
                cancelTokenSource.cancel('Request canceled');
            }
            // Create a new CancelTokenSource
            cancelTokenSource = axios.CancelToken.source();
            const response = await orderService.get(state.dataFilter, cancelTokenSource.token,);
            const orders = orderReadAdapter(response.orders);
            dispatch({ type: GET_ORDERS_SUCCESS, payload: orders });
            showLoader(false)
        } catch (error) {
            dispatch({ type: GET_ORDERS_ERROR })
            showLoader(false)
        }
    }

    function setDataFilter<T extends keyof typeof state.dataFilter>(prop: T, value: typeof state.dataFilter[T]) {
        dispatch({
            type: SET_DATA_FILTER,
            payload: {
                ...state.dataFilter,
                [prop]: value,
            }
        });

    }


    // Función para cancelar la solicitud de datos de pedido
    const cancelEndpoint = () => {
        dispatch({ type: GET_ORDERS_ERROR })
        cancelTokenSource && cancelTokenSource.cancel('Request canceled');
    };


    useEffect(() => {
        fetchOrders();
        return () => cancelEndpoint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.dataFilter])

    // Proporciona el estado y las funciones del contexto a los componentes hijos
    return (
        <OrderContext.Provider value={{
            ...state,
            fetchOrders,
            setDataFilter
        }}>
            {children}
        </OrderContext.Provider>
    )
}

// Exporta un hook personalizado para acceder al contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useOrderContext = () => {
    return useContext(OrderContext)
}