 

// type Actions = 
//     | {type:'addRightOrderItem', payload: []}

import { GET_ORDER_BEGIN, GET_ORDER_SUCCESS } from "..";
import { SplitAccountState } from "../../models";

export const splitAccountReducer  = (state: SplitAccountState, action: any):SplitAccountState => {
    switch(action.type){
        case GET_ORDER_BEGIN: {
            return { ...state, orderLoading: true }
        }
        case GET_ORDER_SUCCESS: 
            return {
                ...state,
                rightOrderItems: action.payload
            }

        default: 
         return state;
    }
}