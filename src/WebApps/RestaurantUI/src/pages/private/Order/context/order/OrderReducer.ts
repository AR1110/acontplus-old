
import { OrderState } from "@/core/models";
import { GET_ORDERS_BEGIN, GET_ORDERS_ERROR, GET_ORDERS_SUCCESS, SET_DATA_FILTER } from ".";
export const orderReducer = (state: OrderState, action: any): OrderState => {
    switch (action.type) {
        case GET_ORDERS_BEGIN: {
            return { ...state, orderLoading: true }
        }
        case GET_ORDERS_SUCCESS: {
            return {
                ...state,
                orderLoading: false,
                orders: action.payload,
            }
        }
        case GET_ORDERS_ERROR:
            return { ...state, orderError: true, orderLoading: false }

        case SET_DATA_FILTER:
            return {
                ...state,
                dataFilter: action.payload
            }

        default:
            return state;
    }
}