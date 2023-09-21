import { ItemRead, OrderReadDto, ProductPVPReadDto, RawOrderData } from "../models";
import { productService } from "../services";

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
        createdAt: order.createdAt,
        totalRecords: order.totalRecords
    })
    )
}



async function orderReadForUpdateAdapter(obj: any) {
    const order = obj.order[0];
    const orderItems = obj.orderItems;
    const orderMapper = {
        orderId: order.id,
        establecimientoId: order.establecimientoId,
        puntoEmisionId: order.puntoEmisionId,
        customerCompanyId: order.customerCompanyId,
        customerName: order.customerName,
        bodegaId: 0,
        tableId: order.tableId,
        subTotalSinImpuestos: 0,
        tax: order.tax,
        taxPercent: order.taxPercent,
        taxAmount: 0,
        discount: order.discount,
        total: order.total,
        netTotal: 0,
        tip: 0,
        obs: order.obs ?? "",
        codDoc: order.codDoc,
        quickSale: false,
        createdAt: new Date(order.createdAt),
        table: {
            tableName: order.tableName,
            numberTable: order.numberTable
        }
    }

    const results = orderItems.map(async (orderItem: any, indexOrderItem: number) => {
        let response: any = {}
        let pvps: Array<ProductPVPReadDto> = [];

        try {
            response = await productService.findForSale(orderItem.idArticulo);
            pvps = response.measures[0]?.pvps ?? [];


        } catch (error) {
            console.error(`Error al obtener datos del producto para orderItem ${indexOrderItem}: ${error}`);
        }
        return {
            index: indexOrderItem + 1,
            productId: orderItem.idArticulo,
            id: orderItem.id,
            uuid: orderItem.uuid,
            orderId: orderItem.orderId,
            itemId: orderItem.itemId,
            taxId: orderItem.taxId,
            taxPercentId: orderItem.taxPercentId,
            taxValue: orderItem.taxValue,
            quantity: orderItem.quantity,
            cost: orderItem.cost,
            price: orderItem.price,
            discount: orderItem.discount,
            total: orderItem.total,
            obs: orderItem.obs ?? "",
            feeId: orderItem.feeId,
            bodegaId: orderItem.bodegaId,
            description: orderItem.descripcion,
            code: orderItem.codigo,
            s3ObjectUrl: orderItem.s3ObjectUrl,
            carryInventory: orderItem.llevaInventario,
            priceWithVat: orderItem.priceWithVat,
            discountTotal: 0,
            taxes: [],
            pvps: pvps,
            taxRateCode: orderItem.taxRateCode,
            envioSri: orderItem.envioSri
        };
    })

    const orderItemsMapper: Array<ItemRead> = await Promise.all(results);

    return {
        order: orderMapper,
        orderItems: orderItemsMapper
    }
}

export {
    orderReadAdapter,
    orderReadForUpdateAdapter
}