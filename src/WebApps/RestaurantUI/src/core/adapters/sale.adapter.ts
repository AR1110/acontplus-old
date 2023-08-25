import { ItemRead, ItemPostDto, Summary, SummaryPostDto } from "../models";

function itemToApi(items: ItemRead[]): Array<ItemPostDto> {
    return items.map(item => ({
        uuid: item.uuid,
        itemId: item.itemId,
        taxId: item.taxId,
        taxPercentId: item.taxPercentId,
        taxValue: item.taxValue,
        quantity: item.quantity,
        cost: item.cost,
        price: item.price,
        discount: item.discount,
        total: item.total
    }))
}

function summaryToApi(summary: Summary): SummaryPostDto {
    return {
        establecimientoId: summary.establecimientoId,
        puntoEmisionId: summary.puntoEmisionId,
        tableId: summary.tableId,
        customerCompanyId: summary.customerCompanyId,
        tax: summary.tax,
        discount: summary.discount,
        total: summary.total,
        items: [],
        taxes: [],
        payments: {}        
    }
}


export {
    itemToApi,
    summaryToApi
}
