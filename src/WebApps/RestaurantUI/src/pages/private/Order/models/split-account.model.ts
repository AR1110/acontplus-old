// interface SplitAccount {

import { ItemRead } from "@/core/models"

// }
export type LeftOrderItem = ItemRead
export type RighttOrderItem = ItemRead


export interface SplitAccountState {
    orderLoading: boolean
    leftOrderItems: LeftOrderItem[],
    rightOrderItems:RighttOrderItem[]
}