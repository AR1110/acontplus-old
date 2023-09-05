import { OrderReadDto, RawOrderData } from "../models";

function orderReadAdapter(orders: RawOrderData[]): Array<OrderReadDto> { 
    return orders.map(order => ({
        orderId: order.id,
        documentoId: order.documentoId,
        establecimientoId: order.establecimientoId,
        puntoEmisionId: order.puntoEmisionId,
        nameFiscal: order.nameFiscal,
        userName: order.userName,        
        serie: order.serie,
        total: order.total,
        codDoc: order.codDoc,
        createdAt: order.createdAt
    })
    )
}

export {
    orderReadAdapter
}