

import { ItemRead, Order } from "@/core/models"

// }
export type LeftOrderItem = ItemRead
export type RighttOrderItem = ItemRead
type ChangeOrderItem = ItemRead

export interface SplitAccountState {
    orderLoading: boolean
    orderError: boolean
    leftOrder: Order
    rightOrder: Order
    leftOrderItems: LeftOrderItem[]
    rightOrderItems: RighttOrderItem[]
    changeOrderItems: ChangeOrderItem[]
    leftCheckedOrderItems: Array<ItemRead>
    rightCheckedOrderItems: Array<ItemRead>
}

type ReturnTypeTotal = {
    quantity: number
    subTotalSinImpuestos: number
    tax: number
    total: number
}
export interface SplitAccountAction {
    fetchOrderData(id: number): void
    intersection(a: Array<ItemRead>, b: Array<ItemRead>): Array<ItemRead>
    not(a: Array<ItemRead>, b: Array<ItemRead>): Array<ItemRead>
    setRightOrderItem(payload: Array<ItemRead>): void
    setLeftOrderItem(payload: Array<ItemRead>): void
    setRightOrderData(order: Order): void
    setChangeOrderItems(payload: Array<ItemRead>): void
    mergeArraysByField<T extends { id: number; quantity: number; price: number; total: number; }>(
        array1: T[],
        array2: T[],
        field: keyof T
    ): T[]
    mergeArraysByFieldLeft<T extends { id: number; quantity: number; price: number, total: number }>(
        array1: T[],
        array2: T[],
        field: keyof T
    ): T[]
    setLeftCheckedOrderItems(payload: Array<ItemRead>): void
    setRightCheckedOrderItems(payload: Array<ItemRead>): void
    calculateOrderItemTotal<T extends {
        quantity: number
        price: number
        discount: number
        total: number
        taxRateCode?: string
        priceWithVat:number
    }>(arr: T[]): ReturnTypeTotal
}