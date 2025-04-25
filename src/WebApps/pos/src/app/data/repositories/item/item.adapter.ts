import { generateUuidv4 } from '@domain/utils/generate-uuidv4';
import { ITEM_TYPE_CODE } from '@domain/enums/main.enum';
import { ItemPvp, ItemRead } from '@domain/models/item.model';
import { Injectable } from '@angular/core';
import { imgDefault } from '@domain/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class ItemAdapter {
  getAllFrom(items: any[]): ItemRead[] {
    const results = items.map((item: any) => {
      const resultPvp = JSON.parse(item.pvp);
      const dataPvp: ItemPvp = {
        feeId: resultPvp.idTarifa,
        precioVenta: resultPvp.precioVenta,
        precioConIva: resultPvp.precioConIva,
        descripcion: resultPvp.tarifa,
        default: resultPvp.precioPredeterminado,
      };
      return {
        uniqueItem: generateUuidv4(),
        id: item.id,
        itemId: item.itemTypeCode === ITEM_TYPE_CODE.ITEM ? item.id : 0, //idItem
        menuId: item.itemTypeCode === ITEM_TYPE_CODE.MENU ? item.id : 0, //MenuId para combos
        summary: item.summary,
        productId: item.productId,
        descripcion: item.descripcion,
        img: item.s3ObjectUrl || imgDefault,
        stock: item.stock,
        codigo: item.codigo,
        medida: item.medida,
        tipoIva: item.tipoIva,
        cost: item.costPrice,
        dataPvp,
        totalRecords: item.totalRecords,
        itemTypeCode: item.itemTypeCode,
        idMedida: item.idMedida,
      };
    });
    return results;
  }
}
