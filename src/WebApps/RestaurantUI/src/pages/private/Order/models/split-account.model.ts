 

import { ItemRead, Order } from "@/core/models"

// }
export type LeftOrderItem = ItemRead
export type RighttOrderItem = ItemRead


export interface SplitAccountState {
    orderLoading: boolean
    orderError: boolean
    leftOrder: Order
    rightOrder: Order
    leftOrderItems: LeftOrderItem[],
    rightOrderItems:RighttOrderItem[],
    checkedOrderItems: RighttOrderItem[],
    filteredItems: RighttOrderItem[],
}

export interface SplitAccountAction {
    fetchOrderData(id:number):void
    intersection(a: Array<ItemRead>, b: Array<ItemRead>):Array<ItemRead>
    not(a: Array<ItemRead>, b: Array<ItemRead>):Array<ItemRead>
    setCheckedOrderItem(payload: Array<ItemRead>):void
    setRightOrderItem(payload: Array<ItemRead>):void
    setLeftOrderItem(payload: Array<ItemRead>):void
    caculateTotals(order:Order, orderItems:Array<ItemRead>):void
    setRightOrderData(order:Order):void
    setFilteredItems(payload: Array<ItemRead>):void
}