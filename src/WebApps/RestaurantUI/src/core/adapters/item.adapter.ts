import { RawItemData, ItemReadDto, RawProductPVPData, ProductPVPReadDto } from "../models"; 


function pvpReadAdapter(pvp: RawProductPVPData): ProductPVPReadDto {
    return({
         salePrice: pvp.precioVenta,
         priceWithVat: pvp.precioConIva
    })
}

function itemReadAdapter(items: RawItemData[]): Array<ItemReadDto> {     

    
    return items.map((item) => ({
        itemId: item.id, //idItem 
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