import { createContext, useContext, useEffect, useReducer } from "react";
import { splitAccountReducer } from ".";
import { SplitAccountAction, SplitAccountState } from "../../models";
import { orderService } from "@/core/services";
import { GET_ORDER_BEGIN, GET_ORDER_ERROR, GET_ORDER_SUCCESS } from "..";
import { orderReadForUpdateAdapter } from "@/core/adapters";



const initialState: SplitAccountState = {
    orderLoading: false,
    orderError: false,
    order: {
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
    rightOrderItems: []
}
const initialActions: SplitAccountAction = {
    fetchOrderData: (id: number) => id
}

export const SplitAccountContext = createContext<SplitAccountState & SplitAccountAction>(
    {
        ...initialState,
        ...initialActions
    }
)


interface Props {
    children: JSX.Element | JSX.Element[]
}
export const SpliAccountProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(splitAccountReducer, initialState);

    let controller: AbortController;

    const fetchOrderData = async (id: number) => {
        try {
            const dataFetch = orderService.getId(id);

            if (dataFetch.controller) controller = dataFetch.controller;

            dispatch({ type: GET_ORDER_BEGIN })

            const resultAxios = await dataFetch.call;

            const response = resultAxios.data;
            const orderData = await orderReadForUpdateAdapter(response);

            dispatch({ type: GET_ORDER_SUCCESS, payload: orderData })

        } catch (error) {
            dispatch({ type: GET_ORDER_ERROR })
        }
    }

    const cancelEndpoint = () => {
        dispatch({ type: GET_ORDER_ERROR })
        controller && controller.abort();
    };

    useEffect(() => {
        return () => {
            console.log('close context')
            cancelEndpoint();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SplitAccountContext.Provider value={{
            ...state,
            fetchOrderData
        }}>
            {children}
        </SplitAccountContext.Provider>
    )
}

// make sure use
// eslint-disable-next-line react-refresh/only-export-components
export const useSplitAccountContext = () => {
    return useContext(SplitAccountContext)
}