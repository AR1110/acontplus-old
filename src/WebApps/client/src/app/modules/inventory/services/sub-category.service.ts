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
              const categories = JSON.parse(response.payload as string) || []
              console.log(categories)
              const results = categories.map((category: any) => {
                return {
                  idFamilia: category.idFamilia,
                  descripcion: category.descripcion,
                  siglas: category.siglas,
                  estado: category.estado,
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
