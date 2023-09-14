 

import { ItemRead, Order } from "@/core/models"

// }
export type LeftOrderItem = ItemRead
export type RighttOrderItem = ItemRead


export interface SplitAccountState {
    orderLoading: boolean
    orderError: boolean
    order: Order
    leftOrderItems: LeftOrderItem[],
    rightOrderItems:RighttOrderItem[]
}

export interface SplitAccountAction {
    fetchOrderData(id:number):void
}