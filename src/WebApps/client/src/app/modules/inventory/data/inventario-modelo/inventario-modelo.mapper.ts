import {ApiResponse} from "@core/models/api-response";
import {groupSubCategoryUtil} from "@inventory/utils/group-sub-category.util";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {ProductSearch} from "@inventory/domain/models/product.model";
import {mergeMeasureUtil} from "@inventory/utils/merge-measure.util";


export class InventarioModeloMapper {

  static fromApiGetAll(response:any){

    let modelos = response.modelos || []
    return modelos.map((item: any, index: number) => {
      return {
        index: index + 1,
        idModelo: item.idModelo,
        codigo: item.codigo,
        descripcion: item.descripcion,
        nomEstado: item.estado?'Activo': 'Inactivo',
        estado: item.estado,
        idMarca: item.idMarca,
        marca: item.marca,
        totalRecords: item.totalRecords,
      }
    })

  }



}
