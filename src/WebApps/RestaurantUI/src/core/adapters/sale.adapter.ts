import { ItemRead, ItemPostDto, Summary, SummaryPostDto } from "../models";

function itemToApi(items: ItemRead[]): Array<ItemPostDto> {
    return items.map(item => ({
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
        total: item.total
    }))
}

function summaryToApi(summary: Summary): SummaryPostDto {
    return {
        establecimientoId: summary.establecimientoId,
        puntoEmisionId: summary.puntoEmisionId,
        bodegaId: summary.bodegaId ,      
        tableId: summary.tableId,
        customerCompanyId: summary.customerCompanyId,
        subtotalSinImpuestos: summary.subTotalSinImpuestos,
        tax: summary.tax,
        taxPercent: summary.taxPercent,
        discount: summary.discount,
        total: summary.total,
        items: [],
        taxes: [],
        payments: {},
        tip: summary.tip,
        obs: summary.obs,
        codDoc: summary.codDoc,  
        quickSale: summary.quickSale ,
        fechaEmision: summary.creationDate    
    }
}


export {
    itemToApi,
    summaryToApi
}
