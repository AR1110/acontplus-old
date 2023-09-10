import { RawItemData, ItemReadDto, RawProductPVPData, ProductPVPReadDto } from "../models"; 


function pvpReadAdapter(pvp: RawProductPVPData): ProductPVPReadDto {
    return({ 
        feeId: pvp.idTarifa,
        salePrice: pvp.precioVenta,
        priceWithVat: pvp.precioConIva,
        description: pvp.tarifa,
        default: pvp.precioPredeterminado
    })
}

function itemReadAdapter(items: RawItemData[]): Array<ItemReadDto> {     

    
    return items.map((item) => ({
        itemId: item.id, //idItem
        menuId: item.id, //MenuId para combos 
        userId: item.userId,
        productId: item.productId,
        description: item.descripcion,
        s3ObjectUrl: item.s3ObjectUrl,
        minStock: item.stockMinimo,
        stock: item.stock,
        code: item.codigo,
        auxiliaryCode: item.codigoAuxiliar,
        vatRate: item.tipoIva,
        itemType: item.tipoArticulo,           
        totalRecords: item.totalRecords,
        pvps: pvpReadAdapter(JSON.parse(item.pvp)) 
    })
    )
}

export {
    itemReadAdapter
}