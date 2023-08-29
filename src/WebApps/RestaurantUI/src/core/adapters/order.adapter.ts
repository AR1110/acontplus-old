import { OrderReadDto, RawOrderData } from "../models";

function orderReadAdapter(orders: RawOrderData[]): Array<OrderReadDto> {
    console.log(orders);
    return orders.map(order => ({
        orderId: order.id,
        establecimientoId: order.establecimientoId,
        puntoEmisionId: order.puntoEmisionId,
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