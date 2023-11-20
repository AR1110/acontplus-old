import { productSaleRateReadAdapter } from ".";
import { ItemRead, OrderReadDto, ProductPVPReadDto, RawOrderData } from "../models";
import { productService } from "../services";

function orderReadAdapter(orders: RawOrderData[]): Array<OrderReadDto> {  
    return orders.map(order => ({
        orderId: order.id,
        documentoId: order.documentoId,
        establecimientoId: order.establecimientoId,
        codEstab: order.codEstab,
        telefonoEstablecimiento: order.telefonoEstablecimiento,
        nombreComercialEstab: order.nombreComercialEstab,
        puntoEmisionId: order.puntoEmisionId,
        nameFiscal: order.nameFiscal,
        telefonoCliente: order.telefonoCliente,
        userName: order.userName,
        serie: order.serie,
        total: order.total,
        codDoc: order.codDoc,
        createdAt: order.createdAt,
        totalRecords: order.totalRecords,
        divided: order.divided,
        finished: order.finished,
        tableName: order.tableName
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
        },
        userId: order.userId
    }

    const orderItemsMapper = orderItems.map((orderItem: any, indexOrderItem: number) => {
        
        //let pvps: Array<ProductPVPReadDto> = [];
        
        const { medidasFraccionado, medidasPrincipal, ...restOrderItem } = orderItem;

        // Medidas del artículo fraccionado del principal
        const medidasFraccionadoTemp = JSON.parse(medidasFraccionado) || [];

        // Medida principal con las tarifas
        const medidasPrincipalTemp = JSON.parse(medidasPrincipal) || [];

        /**
         * Combinar los dos arrays de medidas en uno solo
         *
         * Parámetros:
         *  - mergedMedidasArray: El array resultante de la combinación de los dos arrays de medidas
         */
        const mergedMedidasArray = [...medidasFraccionadoTemp, ...medidasPrincipalTemp];

        /**
         * Ordenar el array de medidas en función de la propiedad "orden" y
         * establecer la propiedad "defaultMedida" en falso para todos los elementos
         *
         * Parámetros:
         *  - orderMedidaArray: El array de medidas ordenado
         */
        const orderMedidaArray = mergedMedidasArray.sort((a, b) => a.orden - b.orden).map(medida => ({
            ...medida,
            defaultMedida: false
        }));

        // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
        orderMedidaArray[0].defaultMedida = true;

        const measures = productSaleRateReadAdapter(orderMedidaArray)      

        /**
         * Obtener los datos de la medida
         *
         * Parámetros:
         *  - orderMedidaArray: El array de medidas ordenado
         *  - restItem: El artículo
         *
         * Devuelve:
         *  - Los datos de la medida, o un objeto vacío si la medida no se encuentra
         */
        const dataMedida = measures.find(m => m.measureId === restOrderItem.medidaId);
      
        return {
            index: indexOrderItem + 1,
            productId: restOrderItem.idArticulo,
            id: restOrderItem.id,
            uuid: restOrderItem.uuid,
            orderId: restOrderItem.orderId,
            itemId: restOrderItem.itemId,
            taxId: restOrderItem.taxId,
            taxPercentId: restOrderItem.taxPercentId,
            taxValue: restOrderItem.taxValue,
            quantity: restOrderItem.quantity,
            cost: restOrderItem.cost,
            price: restOrderItem.price,
            discount: restOrderItem.discount,
            total: restOrderItem.total,
            obs: restOrderItem.obs ?? "",
            feeId: restOrderItem.feeId,
            bodegaId: restOrderItem.bodegaId,
            description: restOrderItem.descripcion,
            summary: restOrderItem.summary,
            code: restOrderItem.codigoArticulo,
            s3ObjectUrl: restOrderItem.s3ObjectUrl,
            carryInventory: restOrderItem.llevaInventario,
            priceWithVat: restOrderItem.priceWithVat,
            discountTotal: 0,
            taxes: [],
            pvps: dataMedida && dataMedida.pvps || [], // Asignar los datos de las tarifas obtenidos de data medida 
            measureId: restOrderItem.medidaId,
            measures: measures, // Asignar los datos de la medida al artículo
            conversion: dataMedida && dataMedida.conversion,
            taxRateCode: restOrderItem.taxRateCode,
            envioSri: restOrderItem.envioSri,
            paid: restOrderItem.paid ?? false,
            menuId: restOrderItem.menuId,
            itemTypeCode: restOrderItem.itemTypeCode,
            remainingQuantity: restOrderItem.remainingQuantity
        };
        
    }) 
    return {
        order: orderMapper,
        orderItems: orderItemsMapper
    }
}

export {
    orderReadAdapter,
    orderReadForUpdateAdapter
}