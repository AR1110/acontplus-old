import {ApiResponse} from "@core/models/api-response";
import {groupSubCategoryUtil} from "@inventory/utils/group-sub-category.util";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {ProductSearch} from "@inventory/domain/models/product.model";
import {mergeMeasureUtil} from "@inventory/utils/merge-measure.util";


export class TagMapper {

  static fromApiGetAll(response:any){

    let tags = response.tags || []
    return tags.map((item: any) => {
      return {
        idEtiqueta: item.idEtiqueta,
        descripcion: item.descripcion,
        etiquetas: item.etiquetas,
        estado: item.estado
      }
    })

  }



}
