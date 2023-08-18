import { RawItemData, ItemReadDto } from "../models"; 

function itemReadAdapter(items: RawItemData[]): Array<ItemReadDto> {     
 
    return items.map((item) => ({
        id: item.id, //idItem 
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
        totalRecords: item.totalRecords   
    })
    )
}

export {
    itemReadAdapter
}