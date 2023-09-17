import { ItemRead, ItemPostDto, Order, SummaryPostDto } from "../models";
import { v4 as uuidv4 } from 'uuid';

function itemToApi(items: ItemRead[]): Array<ItemPostDto> {
    console.log(items)
    return items.map(item => ({
        orderItemId: item.id,
        uuid: item.uuid,
        itemId: item.itemId,
        feeId: item.feeId,
        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        taxValue: item.taxValue,
        quantity: item.quantity,
        cost: item.cost,
        price: item.price,
        discount: item.discount,
        total: item.total,
        obs: item.obs,
        itemTypeCode: item.itemTypeCode,
        menuId: item.menuId
    }))
}

function summaryToApi(order: Order): SummaryPostDto {
    return {
        orderId: order.orderId,
        establecimientoId: order.establecimientoId,
        puntoEmisionId: order.puntoEmisionId,
        bodegaId: order.bodegaId ,      
        tableId: order.tableId,
        customerCompanyId: order.customerCompanyId,
        subtotalSinImpuestos: order.subTotalSinImpuestos,
        tax: order.tax,
        taxPercent: order.taxPercent,
        discount: order.discount,
        total: order.total,
        items: [],
        taxes: [],
        payments: {},
        tip: order.tip,
        obs: order.obs,
        codDoc: order.codDoc,  
        quickSale: order.quickSale ,
        fechaEmision: order.createdAt, 
        uuid: order.orderId > 0 ? order.uuid : uuidv4(),
           
    }
}


export {
    itemToApi,
    summaryToApi
}
