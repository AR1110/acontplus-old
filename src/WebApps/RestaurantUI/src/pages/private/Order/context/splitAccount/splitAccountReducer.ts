
import { GET_ORDER_BEGIN, GET_ORDER_ERROR, GET_ORDER_SUCCESS } from "..";
import { SplitAccountState } from "../../models";

export const splitAccountReducer = (state: SplitAccountState, action: any): SplitAccountState => {
    switch (action.type) {
        case GET_ORDER_BEGIN: {
            return { ...state, orderLoading: true }
        }
        case GET_ORDER_SUCCESS: {
            const {order, orderItems} = action.payload;
            return { 
                ...state, 
                orderLoading: false,   
                order,
                leftOrderItems: orderItems
            } 
        }
        case GET_ORDER_ERROR:
            return { ...state, orderError: true, orderLoading: false }


        default:
            return state;
    }
}