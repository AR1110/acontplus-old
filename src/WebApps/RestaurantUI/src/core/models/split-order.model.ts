

import { DataFormSale, ItemRead, Order } from "@/core/models"


export type OrderItemDivide = ItemRead & {
    remainingQuantity: number
}
 

export interface SplitOrderState {
    actionType: string
    orderLoading: boolean
    orderError: boolean
    dataForm: DataFormSale
    leftOrder: Order
    rightOrder: Order
    leftOrderItemsLength: number
    leftOrderItems: OrderItemDivide[]
    rightOrderItems: OrderItemDivide[]
    changeOrderItems: OrderItemDivide[]
    leftCheckedOrderItems: Array<OrderItemDivide>
    rightCheckedOrderItems: Array<OrderItemDivide>
    payment: { 
        payload: any
        open: boolean
    }
}

type ReturnTypeTotal = {
    remainingQuantity: number
    subTotalSinImpuestos: number
    tax: number
    total: number
}
export interface SplitOrderAction {
    setActionType<T>(value:T):void //Verificar si es custom detail o division 
    fetchOrderData(id: number): void
    intersection(a: Array<OrderItemDivide>, b: Array<OrderItemDivide>): Array<OrderItemDivide>
    not(a: Array<OrderItemDivide>, b: Array<OrderItemDivide>): Array<OrderItemDivide>
    setRightOrderItem(payload: Array<OrderItemDivide>): void
    setLeftOrderItem(payload: Array<OrderItemDivide>): void
    setRightOrderData(order: Order): void
    setChangeOrderItems(payload: Array<OrderItemDivide>): void
    mergeArraysByField<T extends { id: number; remainingQuantity: number; price: number; total: number; }>(
        array1: T[],
        array2: T[],
        field: keyof T
    ): T[]
    mergeArraysByFieldLeft<T extends { id: number; remainingQuantity: number; price: number, total: number }>(
        array1: T[],
        array2: T[],
        field: keyof T
    ): T[]
    setLeftCheckedOrderItems(payload: Array<OrderItemDivide>): void
    setRightCheckedOrderItems(payload: Array<OrderItemDivide>): void
    calculateOrderItemTotal<T extends {
        remainingQuantity: number
        price: number
        discount: number
        total: number
        taxRateCode?: string
        priceWithVat: number
    }>(arr: T[]): ReturnTypeTotal
    setPaymentData<T>(ar: T): void
    resetData(): void  
}