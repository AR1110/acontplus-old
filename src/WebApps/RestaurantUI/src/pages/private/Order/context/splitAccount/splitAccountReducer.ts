
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

import { SplitAccountState } from "../../models";

export const splitAccountReducer = (state: SplitAccountState, action: any): SplitAccountState => {
    switch (action.type) {
        case GET_ORDER_BEGIN: {
            return { ...state, orderLoading: true }
        }
        case GET_ORDER_SUCCESS: {
            const { order, orderItems } = action.payload;
            console.log(order)
            return {
                ...state,
                orderLoading: false,
                leftOrder: order,
                leftOrderItems: orderItems
            }
        }
        case GET_ORDER_ERROR:
            return { ...state, orderError: true, orderLoading: false }

        case SET_CHECKED_ORDER_ITEMS: {
            return {
                ...state,
                checkedOrderItems: action.payload
            }
        }

        case SET_LEFT_ORDER_ITEMS: {
            return {
                ...state,
                leftOrderItems: action.payload.map((orderItem: any, index: number) => ({
                    ...orderItem,
                    index: index + 1
                }))
            }
        }

        case SET_RIGHT_ORDER_ITEMS: {
            return {
                ...state,
                rightOrderItems: action.payload.map((orderItem: any, index: number) => ({
                    ...orderItem,
                    index: index + 1
                }))
            }
        }
        case SET_RIGHT_ORDER_DATA: {
            return {
                ...state,
                rightOrder: action.payload
            }
        }

        case SET_FILTER_ORDER_ITEMS: {
            return {
                ...state,
                filteredItems: action.payload.map((orderItem: any, index: number) => ({
                    ...orderItem,
                    quantityTemp: state.leftOrderItems.find(leftOrderItem => leftOrderItem.id === orderItem.id)?.quantity,
                    index: index + 1
                }))
            }
        }

        default:
            return state;
    }
}