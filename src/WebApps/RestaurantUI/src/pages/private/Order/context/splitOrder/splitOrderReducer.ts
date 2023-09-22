
import {
    GET_ORDER_BEGIN,
    GET_ORDER_ERROR,
    GET_ORDER_SUCCESS,
    SET_CHANGE_ORDER_ITEMS, 
    SET_DATA_FORM, 
    SET_LEFT_CHECKED_ORDER_ITEMS, 
    SET_LEFT_ORDER_ITEMS,
    SET_RIGHT_CHECKED_ORDER_ITEMS,
    SET_RIGHT_ORDER_DATA,
    SET_RIGHT_ORDER_ITEMS
} from "..";

import { SplitOrderState } from "../../models";

export const splitOrderReducer = (state: SplitOrderState, action: any): SplitOrderState => {
    switch (action.type) {
        case GET_ORDER_BEGIN: {
            return { ...state, orderLoading: true }
        }
        case GET_ORDER_SUCCESS: {
            const { order, orderItems } = action.payload; 
            return {
                ...state,
                orderLoading: false,
                leftOrder: order,
                leftOrderItems: orderItems,
                leftOrderItemsLength : orderItems.length
            }
        }
        case GET_ORDER_ERROR:
            return { ...state, orderError: true, orderLoading: false } 

        case SET_DATA_FORM: 
            return { 
                ...state, 
                dataForm: action.payload
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

        case SET_LEFT_CHECKED_ORDER_ITEMS: {
            return {
                ...state,
                leftCheckedOrderItems: action.payload
            }
        }

        case SET_RIGHT_CHECKED_ORDER_ITEMS: {
            return {
                ...state,
                rightCheckedOrderItems: action.payload
            }
        }


        //Se aplica cuando editamos las cantidades
        case SET_CHANGE_ORDER_ITEMS: {
            return {
                ...state,
                changeOrderItems: action.payload.map((orderItem: any, index: number) => ({
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