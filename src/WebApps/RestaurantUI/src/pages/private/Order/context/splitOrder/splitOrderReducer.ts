
import { SplitOrderState } from "@/core/models";
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
                rightOrder: {
                    ...state.rightOrder,
                    customerName: order.customerName, 
                    customerCompanyId: order.customerCompanyId
                },
                leftOrderItems: orderItems,
                leftOrderItemsLength: orderItems.length
            }
        }
        case GET_ORDER_ERROR:
            return { ...state, orderError: true, orderLoading: false }

        case SET_DATA_FORM:
            return {
                ...state,
                dataForm: action.payload
            }

        case SET_ACTION_TYPE: {
            return {
                ...state,
                actionType: action.payload
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
                    quantityTemp: state.leftOrderItems.find(leftOrderItem => leftOrderItem.id === orderItem.id)?.remainingQuantity,
                    index: index + 1
                }))
            }
        }

        case SET_PAYMENT_DATA: {
            return {
                ...state,
                payment: action.payload
            }
        }

        case SET_RESET_DATA:
            return {
                ...state,
                rightOrder: action.payload.rightOrder,
                leftOrderItemsLength: 0,
                leftOrderItems: [],
                rightOrderItems: [],
                changeOrderItems: [],
                leftCheckedOrderItems: [],
                rightCheckedOrderItems: []
            } 
        default:
            return state;
    }
}