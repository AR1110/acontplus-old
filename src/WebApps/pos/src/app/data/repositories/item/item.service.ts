
import { PATHS_API, PATHS } from "@domain/enums/main.enum";
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { map } from "rxjs";
import { ItemRead } from "@domain/models/item.model";
import { ItemAdapter } from "@data/repositories/item/item.adapter";
import { ApiResponse } from "@domain/models/api-response";
import { getNoLoader } from "@core/interceptors/loader.interceptor";
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  private itemAdapter = inject(ItemAdapter)
  private url = `${PATHS_API.RESTAURANT}${PATHS.ITEM}`

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 2,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response: any) => {
        let result = {
          items: [] as ItemRead[]
        }
        if (response.code === "1") {
          let mainData = JSON.parse(response.payload as string)
          result.items = this.itemAdapter.getAllFrom(mainData.items)
        }
        return result;
      })
    )
  }

  getCombos<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 3,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response: any) => {
        let result = {
          items: [] as ItemRead[]
        }
        if (response.code === "1") {
          let mainData = JSON.parse(response.payload as string)
          result.items = this.itemAdapter.getAllFrom(mainData.items)
        }
        return result;
      })
    )
  }

  getPromotions() {

  }

}
