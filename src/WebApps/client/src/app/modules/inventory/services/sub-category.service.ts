import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { INVENTORY_PATHS } from "../constants/inventory.constants";
import { map } from "rxjs";
import { isApiResponse } from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})

export class SubCategoryService {

  private http = inject(HttpClient)
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.SUBCATEGORY}`

  getAll<T>(data: T) {
    let params = JSON.stringify({ ...data, tipo: 1 })
    return this.http.get(`${this.url}Get?json=${params}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {

            if (response.code === "0") {
              throw response;
            }
            if (response.code === "1") {
              const subCategorias = JSON.parse(response.payload as string) || [] 
              const results = subCategorias.map((category: any) => {
                return {
                  idSubFamilia: category.idSubFamilia,
                  idFamilia: category.idFamilia,
                  descripcion: category.descripcion,
                  estado: category.estado,
                  siglas: category.siglas,
                  codigo: category.codigo,
                  montoObjetivo: category.montoObjetivo,
                  nombreFamilia: category.nombreFamilia,
                  ultimoSecuencial: category.ultimoSecuencial,
                  s3ObjectKey: category.s3ObjectKey,
                  s3ObjectUrl: category.s3ObjectUrl,
                  subcategoryPhotoId: category.subcategoryPhotoId,
                  totalRecords: category.totalRecords,
                }
              })
              return results;
            }
          }
          return []
        })
      )
  }

}
